# Validação final (a fazer pelo usuário)

> Criado em 2026-10-07 (SPEC v2.52). O usuário dispensou as paradas por lote e valida tudo no fim. Esta lista cresce a cada etapa; no fim vira a página de leitura do catálogo inteiro.

## Etapas entregues sem parada
- T28b–d tela de propostas (PR #12, já no `main`).
- T28e propostas completas (coração e rival na tela, aceitar por amor, empresário negocia, forçar saída): feito, em PR.
- Reunião em 3 ideias (T52b–d): feita, em PR; carreiras salvas antigas com reunião na tela não abrem.
- T25c marcos (motor pronto; 20 marcos escritos em `d5cdb21`, revertidos na branch) · T25d memória · T25e eventos modulares · T25b catálogo 80+: *a fazer*.

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

## Medição de equilíbrio: 8 papéis por idade (T28g, 2026-10-07)
Simulação pareada (`npm run sim:estilos`, 400 carreiras por estilo), antes (HEAD, reunião em 3 ideias) × depois (papéis divididos em dados; minutos de cada papel continuam os de antes: titular .85/.88, rodízio .62/.48, reserva .25, promessa .15; jovens até 20 anos):
- **"Lenda" média dos 21 estilos:** 5,67% → 5,97% (+0,30 pt; ruído da média ≈ ±0,25 pt).
- **Por estilo:** antes 4,3% a 7,0%; depois **4,0% a 7,5%** (Lateral construtor 4,0%, Enganche 7,5%), **0,3 e 0,5 pt fora da faixa combinada** (4,3%–7,0%), mas dentro do ruído de amostra (±1,1 pt por estilo com 400 carreiras).
- **Decisão pendente do usuário:** aceitar (medir com 1000+ carreiras na validação final) ou recalibrar os minutos de `Disputa` e `Reserva Imediato` agora.

## Tela de contratos (T28g–k): o que conferir no celular real
- Selecionar cartão, ver o detalhe abaixo dele e **Confirmar escolha** (botão fixo no rodapé); modos: aceitar, negociar, forçar a saída, por amor, renovar, pedir aumento, não renovar.
- Variação de salário muito alta (jovem da base indo para a Europa) aparece como "mais de 10 vezes o atual" (limite `pctMaximo` em `src/data/contractCard.json`).
- Valor projetado é estimativa de 2 semestres sem sorteio; pode ser otimista para jovens de alto Over: conferir contra a evolução real nas carreiras de teste.
- Reputação em 6 níveis: distribuição dos 447 clubes (quartis 22, 22, 30, 58, 75, 87).
- Simulação pareada do T28g: ver seção acima (4,0%–7,5%); repetir com 1000+ carreiras por estilo.

## Marcos da carreira (T25c)
- Medido em 40 carreiras (Completo, automático): **~21 marcos por carreira**, sobretudo "no clube" (estreia no clube 4,3 por carreira, primeiro gol no clube 3,1). Conferir se pesa demais no Normal e no Completo (marcos têm importância 10 e ocupam vaga).
- 20 marcos escritos para você ler (`src/i18n/pt-BR/events.json`, ids em `src/data/milestones.json`); os textos não passaram por revisão sua.
- Números: bônus de Mental por marco 0,04 (teto 1,25 no multiplicador), cobrador +10% de gols (`milestones.json` → `efeitos`), gols pela Seleção = 15% dos gols do ano (`fatos`).
- Pendente do SPEC: progresso do traço "Bola parada" pelo marco; manchete do cartão final com marco.
- A equivalência "automático = simulação" continua (testes de ritmo), mas a carreira automática **mudou** (marcos entram): relatórios de simulação antigos não valem mais.

## Curva de minutos contínua e marca de minutos (T28l, T28m; SPEC v2.55)
- Pedido do usuário: clube maior = elenco melhor = menos minutos para quem ainda não tem nome; o jogador precisa "conquistar o espaço". O motor já seguia isso (papel e minutos pelo Over relativo ao elenco), mas a curva tinha **degrau** (Over 69 no Coritiba: ~46% dos minutos; Over 68: ~2%) e chegava a 0%. Agora: curva contínua por pontos em `minutes.json` (`curva`), piso de 5%, papel como rótulo e promessa da moral.
- Cartão de proposta: marca "Jogará mais / parecido / menos que hoje" (tolerância 0,08 em `contractCard.json` → `minutosParecidoAte`).
- **Equilíbrio** (simulação pareada, 400 carreiras por estilo, antes = `main` com os marcos, depois = curva nova): "Lenda" média 5,99% → 6,02%; por estilo 4,0%–7,5% → 3,8%–7,5%; nota média 30,2 → 29,9; pico de Over 86,8 → 86,9. Sem mudança além do ruído (±1,1 pt por estilo); extremos seguem 0,5 pt fora da faixa 4,3%–7,0% como já estavam desde a T28g (medir com 1000+ carreiras no fim).
- Os pontos de meio da curva são a média das duas pontas do degrau antigo, por isso a continuidade com o equilíbrio de antes.

## Memória da carreira (T25d)
- Infraestrutura pronta e testada: memórias (marcos + perdeuFinal, lesaoGrave, trocouPeloRival, recusouEuropa), contexto `mem.*`/`anos.*`, parâmetros `{mem_<id>_ano|anos|clube}` e teste de citação. Nenhum evento do catálogo usa ainda (T25e e T25b). Medido em 60 carreiras: lesão grave 47, final perdida 3 (rara), recusa da Europa uma por carreira.
