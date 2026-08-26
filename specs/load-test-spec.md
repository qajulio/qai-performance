<!-- Autor: QAI - Julio H M -->

# Spec: Teste de Carga (Load Test)

## Objetivo
Validar que o sistema suporta o volume esperado de usuarios mantendo os SLAs.

## Escopo
- Alvo: API de checkout e listagem de produtos.
- Volume esperado: 200 VUs concurrentes.
- Periodo: dias uteis, pico das 18h-22h.

## Perfil de carga
- Ramp-up: 2 min ate 50 VUs.
- Plato: 5 min a 200 VUs.
- Ramp-down: 2 min ate 0.

## Métricas esperadas (SLA)
- p95 < 500ms, p99 < 1000ms.
- Error rate < 1%.
- RPS estabiliza sem queda.

## Critérios de aceitação
- Todas as métricas dentro do SLA -> PASS.
- Veja `specs/sla-thresholds.json`.

## Entregáveis
- `reports/load-<data>.md`
- Saida k6: `reports/load-<data>.json`
