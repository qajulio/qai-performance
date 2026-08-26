---
name: run-k6
description: Executa um teste de performance com k6 (load/stress/spike/soak) conforme o script informado ou o padrao, coletando metricas e gerando relatorio. Use para rodar cenarios k6.
---

# Comando: Run k6

Execute um teste de performance com **k6**.

## Uso
```
/run-k6 [script] [--vus N] [--duration 5m] [--env staging]
```

## Passos
1. Se nenhum script for informado, usar `scripts/k6/load-test.js`.
2. Validar pre-requisitos: `k6 version` deve retornar 0.x.
3. (Opcional) Subir InfluxDB/Grafana para observabilidade.
4. Executar:
   ```bash
   k6 run --out influxdb=http://localhost:8086/k6 scripts/k6/<script>
   ```
5. Capturar saida (VUs, RPS, p95/p99, error rate).
6. Chamar skill `perf-sla-check` para veredito.
7. Salvar relatorio em `reports/k6-<script>-<data>.md`.

## Flags suportadas
- `--vus` : numero de usuarios virtuais (sobrepoe script).
- `--duration` : duracao do plato.
- `--env` : ambiente alvo (usado na URL base do relatorio).

## Saida esperada
Relatorio com veredito PASS/FAIL e metricas comparadas ao SLA.
