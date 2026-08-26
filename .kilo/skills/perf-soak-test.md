---
name: perf-soak-test
description: Cria e executa testes de endurance/soak (longa duração) para detectar vazamentos de memória, degradação e acúmulo de dados. Use quando o usuário pedir teste de soak, endurance ou estabilidade de longa duração.
---
<!-- Autor: QAI - Julio H M -->

# Skill: Teste de Endurance (Soak / Soak Test)

Valide a estabilidade sob carga **sustentada e prolongada** (horas/dias).

## Objetivo
Detectar:
- Memory leaks / vazamento de recursos.
- Degradação gradual de latência (GC, pools).
- Crescimento descontrolado de filas, logs ou DB.

## Padrão
- Carga moderada (ex.: 50-70% da capacidade) por 4h a 24h.
- Coleta de métricas de recurso a cada intervalo.

## Passos
1. Ler `specs/load-test-spec.md`.
2. Usar `run-k6` com duração longa e VUs constantes.
3. Monitorar tendência de memória/latência via `grafana-observe`.
4. Veretido em `reports/soak-<data>.md`.

## Exemplo k6
```javascript
export const options = {
  scenarios: {
    soak: {
      executor: 'constant-vus',
      vus: 100,
      duration: '8h',
    },
  },
};
```
