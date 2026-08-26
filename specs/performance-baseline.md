<!-- Autor: QAI - Julio H M -->

# Baseline de Performance

Referencia historica de desempenho para comparacao de regressoes.

## Ultima medição (exemplo)
- Data: 2026-08-26
- Ferramenta: k6 0.52
- Ambiente: staging (4 vCPU, 8GB)
- Carga: 200 VUs / 5 min

## Resultados de referencia
| Métrica | Valor |
|---------|-------|
| p95 | 420ms |
| p99 | 880ms |
| RPS medio | 540 |
| Error rate | 0.4% |
| CPU max | 62% |
| Memoria max | 71% |

## Como usar
Compare novos resultados contra esta tabela. Regressao > 10% em p95 ou
aumento de 15% em recurso deve disparar investigacao.
