<!-- Autor: QAI - Julio H M -->

# Regras de QA para Testes de Performance

Estas regras sao obrigatorias para todos os testes de carga/stress/spike/soak.

## 1. Ambiente
- Nunca executar testes de stress em producao sem autorizacao formal e janela de manutencao.
- Usar ambiente dedicado e isolado (staging) com dados anonimizados ou sinteticos.
- Garantir que monitoramento (InfluxDB/Grafana) esteja ativo antes de iniciar.

## 2. Planejamento
- Todo teste deve ter um objetivo claro (load/stress/spike/soak) e um SLA definido.
- O SLA vive em `specs/sla-thresholds.json` e deve ser versionado.
- Definir ramp-up e ramp-down para evitar picos artefato.

## 3. Execucao
- Prefira execucao non-GUI (JMeter `-n`) e saida para InfluxDB/k6 out.
- Parametrize dados de entrada (CSV/Data Pool) para evitar cache falso.
- Respeite `think time` realista entre requisicoes.

## 4. Coleta e reporte
- Sempre gerar relatorio em `reports/` com veredito (PASS/FAIL).
- Incluir: VUs, RPS, p95/p99, error rate, latencia media e uso de recursos.
- Anexar evidencia (graficos Grafana / dashboard JMeter).

## 5. Criterios de parada (abort imediato)
- Error rate > 5% no plato.
- Saturacao de CPU/memoria > 90% sustentada por 2 min.
- p99 > 3x o SLA.
- Falha em cascata de componentes downstream.

## 6. Reprodutibilidade
- Scripts k6 e planos JMeter devem ser versionados e deterministicos.
- Documentar versoes das ferramentas (k6, JMeter, plugins) no relatorio.

## 7. Seguranca e ética
- Nao realizar ataques DoS contra sistemas de terceiros.
- Limitar taxa de requisicoes conforme acordado com o dono do sistema.
