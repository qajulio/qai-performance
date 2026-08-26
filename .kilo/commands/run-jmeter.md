---
name: run-jmeter
description: Executa um plano de teste JMeter (.jmx) em modo non-GUI, coletando resultados .jtl e gerando relatorio HTML. Use para rodar cenarios JMeter de carga/stress.
---

# Comando: Run JMeter

Execute um plano de teste **JMeter** em modo non-GUI (recomendado para performance).

## Uso
```
/run-jmeter [plano] [--threads 200] [--rampup 60] [--loop -1] [--duration 300]
```

## Passos
1. Se nenhum plano for informado, usar `scripts/jmeter/load-test.jmx`.
2. Validar: `jmeter -v` deve retornar a versao.
3. Criar diretorio de resultados `results/`.
4. Executar:
   ```bash
   jmeter -n -t scripts/jmeter/<plano> -l results/<plano>.jtl -e -o reports/html/<plano>
   ```
5. (Opcional) Sobrepoe parametros via `-Jthreads=`, `-Jrampup=`, `-Jduration=`.
6. Chamar skill `perf-sla-check` usando o `.jtl`.
7. Salvar laudo em `reports/jmeter-<plano>-<data>.md`.

## Flags suportadas
- `--threads` : usuarios (Thread Group).
- `--rampup` : tempo de subida (s).
- `--duration` : duracao (s).

## Saida esperada
Relatorio HTML em `reports/html/` + laudo de SLA.
