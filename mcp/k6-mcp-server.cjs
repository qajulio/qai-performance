"use strict";
// MCP server (stdio JSON-RPC) that bridges to the k6 load testing tool.
const { spawn } = require("child_process");
const fs = require("fs");

const CONFIG = {
  k6Bin: process.env.K6_BIN || "k6",
  out: process.env.K6_OUT || "",
  apiUrl: process.env.K6_API_URL || "http://localhost:6565"
};

const TOOLS = [
  {
    name: "run_k6",
    description: "Run a k6 performance test script and return summary metrics.",
    inputSchema: {
      type: "object",
      properties: {
        script: { type: "string", description: "Path to k6 .js script" },
        vus: { type: "number", description: "Override number of VUs" },
        duration: { type: "string", description: "Override duration, e.g. 5m" },
        out: { type: "string", description: "Output sink, e.g. json=results/out.json" }
      },
      required: ["script"]
    }
  },
  {
    name: "list_k6_results",
    description: "List k6 result JSON files in a directory.",
    inputSchema: {
      type: "object",
      properties: { dir: { type: "string", description: "Directory to scan" } },
      required: []
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
        serverInfo: { name: "k6-gateway", version: "1.0.0" }
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
      if (name === "run_k6") return runK6(args, id);
      if (name === "list_k6_results") return listResults(args, id);
      send({ jsonrpc: "2.0", id: id, error: { code: -32601, message: "unknown tool: " + name } });
      return;
    default:
      send({ jsonrpc: "2.0", id: id, error: { code: -32601, message: "method not found: " + msg.method } });
  }
}

function runK6(args, id) {
  const script = args.script || "scripts/k6/load-test.js";
  const cli = ["run"];
  if (args.vus) cli.push("--vus", String(args.vus));
  if (args.duration) cli.push("--duration", String(args.duration));
  if (args.out) cli.push("--out", String(args.out));
  else if (CONFIG.out) cli.push("--out", CONFIG.out);
  cli.push(script);
  const child = spawn(CONFIG.k6Bin, cli, { shell: true });
  let out = "";
  let err = "";
  child.stdout.on("data", function (d) { out += d.toString(); });
  child.stderr.on("data", function (d) { err += d.toString(); });
  child.on("close", function (code) {
    const text = "=== k6 " + script + " (exit " + code + ") ===\n" + out + "\n" + err;
    send({ jsonrpc: "2.0", id: id, result: { content: [{ type: "text", text: text }], isError: code !== 0 } });
  });
}

function listResults(args, id) {
  const dir = args.dir || "reports";
  let files = [];
  try {
    files = fs.readdirSync(dir).filter(function (f) { return f.endsWith(".json"); });
  } catch (e) {
    send({ jsonrpc: "2.0", id: id, error: { code: -32000, message: String(e) } });
    return;
  }
  send({ jsonrpc: "2.0", id: id, result: { content: [{ type: "text", text: JSON.stringify(files, null, 2) }] } });
}

process.stdin.resume();
