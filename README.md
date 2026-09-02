# QAI Performance Toolkit - JULIO Mishima.

Conjunto de arquivos para **validação de performance/QA** usando **k6** e **JMeter** como
ferramentas de carga/stress, com suporte a agentes, skills, regras, specs e MCPs de conexão.

## Estrutura

```
qa-performance/
├── kilo.json                 # Config base do Kilo (skills, agents, commands, MCPs)
├── README.md                 # Este arquivo
├── .kilo/
│   ├── skills/               # Skills especializadas de performance
│   │   ├── perf-load-test.md
│   │   ├── perf-stress-test.md
│   │   ├── perf-spike-test.md
│   │   ├── perf-soak-test.md
│   │   └── perf-sla-check.md
│   ├── agents/               # Agentes de QA performance
│   │   ├── performance-engineer.md
│   │   ├── load-test-specialist.md
│   │   └── performance-analyst.md
│   ├── commands/             # Comandos reutilizáveis
│   │   ├── run-k6.md
│   │   ├── run-jmeter.md
│   │   └── analyze-results.md
│   └── rules/                # Regras de QA performance
│       └── qa-performance-rules.md
├── specs/                    # Especificações de teste
│   ├── load-test-spec.md
│   ├── stress-test-spec.md
│   ├── performance-baseline.md
│   └── sla-thresholds.json
├── mcp/                      # Servidores MCP de conexão
│   ├── k6-mcp-server.cjs
│   ├── jmeter-mcp-server.cjs
│   └── README.md
└── scripts/                  # Scripts de exemplo
    ├── k6/
    │   ├── load-test.js
    │   ├── stress-test.js
    │   ├── spike-test.js
    │   └── soak-test.js
    └── jmeter/
        ├── load-test.jmx
        └── stress-test.jmx
```

## Pré-requisitos

- **k6**: https://grafana.com/docs/k6/latest/installation/
- **JMeter**: https://jmeter.apache.org/download_jmeter.cgi
- **Node.js** 18+ (para os servidores MCP)
- **InfluxDB + Grafana** (opcional, para dashboards em tempo real)

## Uso rápido

```bash
# k6 - teste de carga
k6 run scripts/k6/load-test.js

# JMeter - teste de carga (modo non-GUI)
jmeter -n -t scripts/jmeter/load-test.jmx -l results/load.jtl

# Via comandos Kilo
/run-k6
/run-jmeter
/analyze-results
```

## MCPs de conexão

| MCP | Tipo | Função |
|-----|------|--------|
| `k6-gateway` | stdio | Orquestra execução e coleta de métricas do k6 |
| `jmeter-bridge` | stdio | Dispara planos de teste JMeter e lê resultados `.jtl` |
| `grafana-observe` | http  | Consulta dashboards e alertas de performance |



##Copyright

Copyright © 2026 JULIO MISHIMA Todos os direitos reservados.

Este código é proprietário. É proibida a cópia, reprodução, modificação, distribuição ou utilização, total ou parcial, sem autorização prévia e expressa do titular dos direitos.

O acesso ao repositório não concede qualquer licença ou direito de uso.

All Rights Reserved.
