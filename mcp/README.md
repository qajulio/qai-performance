# Servidores MCP de Conexao

Servidores MCP (Model Context Protocol) stdio que conectam o Kilo as ferramentas
de performance, permitindo orquestrar testes e coletar resultados via agentes.

## k6-gateway (k6-mcp-server.cjs)
Ferramenta `run_k6` executa `k6 run <script>` e retorna o resumo.
Ferramenta `list_k6_results` lista arquivos JSON de resultado.

Configuracao (kilo.json):
```json
{
  "command": "node",
  "args": ["./mcp/k6-mcp-server.cjs"],
  "env": { "K6_OUT": "influxdb=http://localhost:8086/k6" }
}
```

## jmeter-bridge (jmeter-mcp-server.cjs)
Ferramenta `run_jmeter` executa `jmeter -n -t <plano> -l <out>.jtl -e -o <report>`.
Ferramenta `parse_jtl` calcula amostras, erros, taxa de erro, media e maximo.

Configuracao (kilo.json):
```json
{
  "command": "node",
  "args": ["./mcp/jmeter-mcp-server.cjs"],
  "env": { "JMETER_HOME": "C:/apache-jmeter-5.6.3", "JMETER_BIN": "C:/apache-jmeter-5.6.3/bin/jmeter" }
}
```

## grafana-observe (http)
Conecta-se a um endpoint MCP HTTP do Grafana para consultar dashboards e alertas.
Configurar `GRAFANA_TOKEN` no ambiente.

## Teste rapido dos servidores
```bash
node mcp/k6-mcp-server.cjs      # deve iniciar e aguardar entrada JSON-RPC
node mcp/jmeter-mcp-server.cjs  # idem
```
