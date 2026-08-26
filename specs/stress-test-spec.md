<!-- Autor: QAI - Julio H M -->

# Spec: Teste de Stress (Stress Test)

## Objetivo
Descobrir o breaking point (limite de ruptura) do sistema.

## Escopo
- Subir carga progressivamente ate a falha sustentada.
- Observar recuperacao apos a reducao de carga.

## Perfil de carga
- Ramp-up continuo: 5 min ate 100 VUs.
- Subida agressiva: 10 min ate 1000, depois 2000 VUs.
- Ramp-down: 5 min ate 0.

## O que medir
- VUs maximos antes da falha (breaking point).
- Modo de falha: timeouts, 5xx, OOM, pool esgotado.
- Tempo de recuperacao apos carga.

## Critérios
- Documentar capacidade maxima sustentavel (VUs/RPS).
- Nao ha SLA de pass/fail; o objetivo e o diagnostico.

## Entregáveis
- `reports/stress-<data>.md`
- Graficos de recurso (Grafana).
