---
name: perf-spike-test
description: Cria e executa testes de pico (spike test) aplicando aumentos abruptos e massivos de carga para validar elasticidade e recuperação. Use quando o usuário pedir teste de pico, spike ou validação de elasticidade.
---
<!-- Autor: QAI - Julio H M -->

# Skill: Teste de Pico (Spike Test)

Valide a resposta a **variações bruscas** de tráfego (ex.: flash sale, viralização).

## Objetivo
Garantir que o sistema absorve picos súbitos e se recupera sem falha em cascata.

## Padrão
```
0 -> 1000 VUs em 10s -> manter 1m -> 0 -> 1000 VUs em 10s -> ...
```

## Passos
1. Ler `specs/load-test-spec.md` (reaproveita SLAs).
2. Usar `run-k6` com estágios de spike.
3. Medir: tempo de autoescala, recuperação de erros, filas/backpressure.
4. Veretido em `reports/spike-<data>.md`.

## Exemplo k6
```javascript
export const const options = {
  stages: [
    { duration: '10s', target: 1000 },
    { duration: '1m', target: 1000 },
    { duration: '10s', target: 0 },
    { duration: '1m', target: 0 },
    { duration: '10s', target: 1000 },
    { duration: '1m', target: 1000 },
    { duration: '10s', target: 0 },
  ],
};
```
