---
name: perf-sla-check
description: Compara métricas coletadas de performance contra os SLAs definidos em specs/sla-thresholds.json e emite veredito PASS/FAIL com evidências. Use quando o usuário pedir validação de SLA, checagem de thresholds ou veredito de performance.
---
<!-- Autor: QAI - Julio H M -->

# Skill: Validação de SLA (SLA Check)

Compare resultado de teste contra os SLAs e decida PASS/FAIL.

## Entradas
- `specs/sla-thresholds.json` (thresholds por endpoint/transação).
- Relatório de métricas (`reports/*.md` ou `.jtl`/`.json` do k6).

## Regras de veredito
- **PASS**: todas as métricas dentro do SLA.
- **WARN**: 1-2 métricas levemente fora (margem < 10%).
- **FAIL**: qualquer métrica crítica fora, ou error rate acima do limite.

## Saída
Tabela resumida:
| Métrica | Medido | SLA | Status |
|---------|--------|-----|--------|
| p95 API /checkout | 480ms | 500ms | PASS |
| error rate | 0.8% | 1% | PASS |

Gerar `reports/sla-<data>.md`.
