---
name: perf-load-test
description: Cria e executa testes de carga (load test) com k6 ou JMeter para validar se o sistema suporta o volume esperado de usuários mantendo SLAs. Use quando o usuário pedir teste de carga, validação de throughput ou capacidade sob carga normal.
---
<!-- Autor: QAI - Julio H M -->

# Skill: Teste de Carga (Load Test)

Valide a capacidade do sistema sob um volume **esperado e constante** de usuários.

## Objetivo
Garantir que, para a carga alvo (ex.: 200 VUs), o sistema mantenha:
- `p95 < 500ms` para APIs transacionais
- `error rate < 1%`
- `throughput` estável (sem degradação ao longo do tempo)

## Passos
1. Ler `specs/load-test-spec.md` e `specs/sla-thresholds.json`.
2. Escolher a ferramenta (k6 via skill `run-k6` ou JMeter via skill `run-jmeter`).
3. Definir cenário: ramp-up suave -> platô (carga alvo) -> ramp-down.
4. Executar por `defaultDuration` (ex.: 5m no platô).
5. Coletar métricas: VUs, RPS, p95/p99, erros, tempo de espera.
6. Comparar contra SLA e emitir veredito.

## Critérios de parada (abort)
- Error rate > 5% no platô.
- Saturação de CPU/memória > 90% sustentada.
- p99 > 3x o SLA.

## Exemplo k6 (trecho)
```javascript
export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  thresholds: { http_req_duration: ['p(95)<500'], http_req_failed: ['rate<0.01'] },
};
```

## Entregáveis
- Relatório em `reports/load-<data>.md` com veredito (PASS/FAIL) e gráficos.
