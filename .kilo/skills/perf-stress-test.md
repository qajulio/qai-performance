---
name: perf-stress-test
description: Cria e executa testes de stress (stress test) para descobrir o limite de quebra (breaking point) do sistema aumentando a carga até a falha. Use quando o usuário pedir teste de stress, limite de capacidade ou ponto de ruptura.
---
<!-- Autor: QAI - Julio H M -->

# Skill: Teste de Stress (Stress Test)

Encontre o **breaking point**: aumente a carga até o sistema degradar ou falhar.

## Objetivo
Identificar:
- Número máximo de VUs antes da falha sustentada.
- Gargalos (CPU, memória, pool de conexões, DB).
- Comportamento de recuperação após a carga.

## Passos
1. Ler `specs/stress-test-spec.md`.
2. Usar `run-k6` ou `run-jmeter` com estágio de subida contínua.
3. Monitorar recursos (via MCP `grafana-observe` se disponível).
4. Parar ao atingir degradação (ver skill `perf-load-test` critérios).
5. Registrar o ponto de ruptura em `reports/stress-<data>.md`.

## Exemplo k6 (rampa até o limite)
```javascript
export const options = {
  stages: [
    { duration: '5m', target: 100 },
    { duration: '10m', target: 1000 },
    { duration: '5m', target: 2000 },
    { duration: '5m', target: 0 },
  ],
  thresholds: { http_req_failed: ['rate<0.05'] },
};
```

## Saída
- Capacidade máxima sustentável (VUs / RPS).
- Modo de falha (timeouts, 5xx, OOM).
- Recomendações de tuning.
