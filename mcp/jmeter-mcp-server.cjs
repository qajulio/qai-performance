"use strict";
// MCP server (stdio JSON-RPC) that bridges to Apache JMeter.
const { spawn } = require("child_process");
const fs = require("fs");

const CONFIG = {
  jmeterBin: process.env.JMETER_BIN || "jmeter",
  jmeterHome: process.env.JMETER_HOME || "C:/apache-jmeter-5.6.3"
};

const TOOLS = [
  {
    name: "run_jmeter",
    description: "Run a JMeter test plan (.jmx) in non-GUI mode and produce an HTML report.",
    inputSchema: {
      type: "object",
      properties: {
        plan: { type: "string", description: "Path to .jmx test plan" },
        threads: { type: "number", description: "Override thread count" },
        rampup: { type: "number", description: "Override ramp-up seconds" },
        duration: { type: "number", description: "Override duration seconds" }
      },
      required: ["plan"]
    }
  },
  {
    name: "parse_jtl",
    description: "Parse a JMeter .jtl result file and return aggregate metrics.",
    inputSchema: {
      type: "object",
      properties: { file: { type: "string", description: "Path to .jtl file" } },
      required: ["file"]
    }
  }
];

let buf = Buffer.alloc(0);
process.stdin.on("data", function (chunk) {
  buf = Buffer.concat([buf, chunk]);
  while (true) {
    const headerEnd = buf.indexOf("\r\n\r\n");
    if (headerEnd === -1) break;
    const header = buf.slice(0, headerEnd).toString();
    const m = /Content-Length: (\d+)/i.exec(header);
    if (!m) { buf = buf.slice(headerEnd + 4); continue; }
    const len = parseInt(m[1], 10);
    const start = headerEnd + 4;
    if (buf.length < start + len) break;
    const body = buf.slice(start, start + len).toString();
    buf = buf.slice(start + len);
    try { handleMessage(JSON.parse(body)); } catch (e) { /* ignore malformed */ }
  }
});

function send(obj) {
  const payload = Buffer.from(JSON.stringify(obj), "utf8");
  process.stdout.write("Content-Length: " + payload.length + "\r\n\r\n");
  process.stdout.write(payload);
}

function handleMessage(msg) {
  const id = msg.id;
  switch (msg.method) {
    case "initialize":
      send({ jsonrpc: "2.0", id: id, result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "jmeter-bridge", version: "1.0.0" }
      }});
      return;
    case "notifications/initialized":
      return;
    case "ping":
      send({ jsonrpc: "2.0", id: id, result: {} });
      return;
    case "tools/list":
      send({ jsonrpc: "2.0", id: id, result: { tools: TOOLS } });
      return;
    case "tools/call":
      const name = msg.params && msg.params.name;
      const args = (msg.params && msg.params.arguments) || {};
      if (name === "run_jmeter") return runJmeter(args, id);
      if (name === "parse_jtl") return parseJtl(args, id);
      send({ jsonrpc: "2.0", id: id, error: { code: -32601, message: "unknown tool: " + name } });
      return;
    default:
      send({ jsonrpc: "2.0", id: id, error: { code: -32601, message: "method not found: " + msg.method } });
  }
}

function runJmeter(args, id) {
  const plan = args.plan || "scripts/jmeter/load-test.jmx";
  const outJtl = "results/" + path.basename(plan, ".jmx") + ".jtl";
  const reportDir = "reports/html/" + path.basename(plan, ".jmx");
  const cli = ["-n", "-t", plan, "-l", outJtl, "-e", "-o", reportDir];
  if (args.threads != null) cli.push("-Jthreads=" + args.threads);
  if (args.rampup != null) cli.push("-Jrampup=" + args.rampup);
  if (args.duration != null) cli.push("-Jduration=" + args.duration);
  const child = spawn(CONFIG.jmeterBin, cli, { shell: true });
  let out = "";
  let err = "";
  child.stdout.on("data", function (d) { out += d.toString(); });
  child.stderr.on("data", function (d) { err += d.toString(); });
  child.on("close", function (code) {
    const text = "=== jmeter " + plan + " (exit " + code + ") ===\n" + out + "\n" + err;
    send({ jsonrpc: "2.0", id: id, result: { content: [{ type: "text", text: text }], isError: code !== 0 } });
  });
}

function parseJtl(args, id) {
  const file = args.file || "results/load-test.jtl";
  try {
    const lines = fs.readFileSync(file, "utf8").trim().split("\n");
    if (lines.length < 2) { send({ jsonrpc: "2.0", id: id, result: { content: [{ type: "text", text: "empty" }] } }); return; }
    const header = lines[0].split(",");
    let total = 0, errors = 0, sum = 0, max = 0;
    const counts = {};
    for (let i = 1; i < lines.length; i++) {
      const c = lines[i].split(",");
      total++;
      const ok = c[7] === "true" || c[7] === "OK" || c[7] === "";
      const success = c[2] === "true" || c[2] === "OK";
      if (!success) errors++;
      const rt = parseInt(c[1], 10) || 0;
      sum += rt; if (rt > max) max = rt;
      const label = c[0];
      counts[label] = (counts[label] || 0) + 1;
    }
    const result = {
      samples: total,
      errors: errors,
      errorRate: total ? (errors / total) : 0,
      avgMs: total ? Math.round(sum / total) : 0,
      maxMs: max,
      labels: counts
    };
    send({ jsonrpc: "2.0", id: id, result: { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] } });
  } catch (e) {
    send({ jsonrpc: "2.0", id: id, error: { code: -32000, message: String(e) } });
  }
}

const path = require("path");
process.stdin.resume();
