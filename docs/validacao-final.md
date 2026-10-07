# Validação final (a fazer pelo usuário)

> Criado em 2026-10-07 (SPEC v2.52). O usuário dispensou as paradas por lote e valida tudo no fim. Esta lista cresce a cada etapa; no fim vira a página de leitura do catálogo inteiro.

## Etapas entregues sem parada
- T28b–d tela de propostas (PR #12, já no `main`).
- T28e propostas completas (coração e rival na tela, aceitar por amor, empresário negocia, forçar saída): feito, em PR.
- T25c marcos · T25d memória · T25e eventos modulares · T25b catálogo 80+: *a fazer*.

## O que o usuário precisa revisar no fim
- Textos de todos os eventos novos (tom, zoeira só com o próprio jogador, nenhuma opção dominante).
- Números de balanceamento novos (`market.json` forçar saída e negociar; marcos; pesos de eventos).
- Simulação pareada (T28f): o equilíbrio dos estilos não pode ter piorado.

## Números novos para o usuário conferir
- `market.json` → `propostas.forcarSaida`: multa de 6 meses de salário, −30 de idolatria no clube que deixa, −0,08 de moral, −0,15 de relação com o técnico, 35% de risco de virar vilão (idolatria −70).
- `market.json` → `propostas.negociar` (já existia): +15% de salário quando melhora; 30% de chance base de a proposta sumir, menor com empresário mais influente.
- Aceitar a proposta do clube de coração agora **aplica** moral e idolatria da opção escolhida (antes só o salário valia); pode mexer um pouco no equilíbrio de carreiras com clube de coração.

## Revisão de equilíbrio pedida pelo usuário
- Muitas reuniões, muitas decisões de contrato/renovação, vida pessoal na média e pouco jogo em campo: ver `docs/revisao-equilibrio-decisoes.md` (números medidos e ideias). Itens a decidir junto com a reunião em 3 ideias e a tela de contratos.

## Medição de equilíbrio: reunião em 3 ideias (T52c, 2026-10-07)
Simulação pareada (`npm run sim:estilos`, 300 carreiras por estilo, mesmas sementes), regra antiga × nova (necessidade do clube pela posição, confiança por ideia, automático = ideia óbvia):
- **"Lenda" geral:** 5,63% → 5,78% (+0,15 pt). **Pico de Over médio:** 86,64 → 86,77.
- **Por estilo:** antes 4,0% a 6,7%; depois **4,3% a 7,0%**, dentro da faixa combinada (4,3% a 7,0%). Maiores variações: Ponta trabalhador +1,7 pt, Lateral apoiador +1,3 pt, Goleiro seguro −1,3 pt (ruído de amostra de ±1,3 pt com 300 carreiras).
- Conclusão: o equilíbrio não saiu da faixa; uma medição com 1000+ carreiras por estilo fica para o fim.
