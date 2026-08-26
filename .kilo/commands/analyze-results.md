---
name: analyze-results
description: Analisa resultados de testes de performance (k6 JSON ou JMeter .jtl), correlaciona com recursos via Grafana e produz laudo de SLA com gargalos e recomendacoes. Use para interpretar resultados.
---

# Comando: Analyze Results

Analise e diagnostique resultados de performance.

## Uso
```
/analyze-results [arquivo] [--baseline specs/performance-baseline.md]
```

## Passos
1. Identificar tipo de arquivo: `.json` (k6) ou `.jtl` (JMeter).
2. Carregar metricas e normalizar (p95/p99, RPS, error rate, latencia media).
3. Se `grafana-observe` disponivel, correlacionar com CPU/memoria/DB.
4. Aplicar `perf-sla-check` para veredito.
5. Identificar top gargalos (causa raiz, nao sintoma).
6. Gerar laudo em `reports/analysis-<data>.md`.

## Formato do laudo
- Resumo executivo (PASS/FAIL).
- Tabela metricas vs SLA.
- Gargalos + evidencia.
- Recomendacoes ordenadas por impacto.

## Entradas aceitas
- `reports/*.json` (k6 --out json)
- `results/*.jtl` (JMeter)
- `reports/html/*/content/js/dashboard*.js` (JMeter report)
