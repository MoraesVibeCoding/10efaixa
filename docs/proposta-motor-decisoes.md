# Proposta: decisões, liga e clube pesam em tempo de jogo, evolução e valor (v3.07, motor)

Pedidos do usuário em 2026-10-15:
1. "principalmente em tempo de jogo e curva de evolução isso deve interferir mais";
2. tempo de jogo pelos fatores, nesta ordem de importância: **confiança do técnico, moral, disciplina, apoio da torcida**;
3. na evolução, o **tempo de jogo e a moral** devem pesar mais;
4. o valor de mercado deve considerar o **crescimento do over** e a **relevância do time e da liga**;
5. as ligas ganham peso no valor e no over, num ranking definido pelo usuário (seção 2.4).

Status: **aguardando DE ACORDO**. Nada entra no código antes. Todos os números abaixo são o ponto de partida da
calibragem; ficam em `src/data` (nunca fixos no código) e nenhum número de atributo aparece ao jogador.

## 1. O problema, medido

60 carreiras sorteadas (sementes 1 a 60), jogadas de três jeitos: escolha automática; sempre a opção que mais sobe
moral + relação com o técnico + disciplina ("bom"); sempre a que mais desce ("ruim").

| Jeito | Over de pico | Minutos (média da carreira) | Over aos 24 | Valor aos 24 |
|---|---|---|---|---|
| Automático | 87,0 | 65,2% | 86,6 | € 62,5 mi |
| Bom | 87,0 | 65,8% | 86,7 | € 63,6 mi |
| Ruim | 86,9 | 65,0% | 86,8 | € 63,7 mi |

Escolher bem ou mal dá **0,1 ponto de over e 0,8 ponto percentual de minutos**. Hoje:

- **Tempo de jogo** vem só do over comparado ao nível do elenco (`minutes.json`). Os quatro fatores não entram.
- **Evolução**: minutos multiplicam de 0,4× a 1,0×, moral de 0,8× a 1,2×, estrutura do clube de 0,8× a 1,2×. A moral
  se recupera sozinha em um ou dois semestres, então a escolha some.
- **Valor de mercado** é só over e idade (`marketValue`). Liga e clube entram só no salário e, para 7 clubes de elite
  (×1,25), no valor projetado das propostas.

## 2. A mudança proposta

### 2.1 Tempo de jogo: a confiança para escalar, semestre a semestre

O papel e os minutos passam a vir de um **over de escalação**, recalculado a cada semestre da temporada:

`over de escalação = over + bônus`, com `bônus = 8 × (0,40·T + 0,30·M + 0,20·D + 0,10·I)`

Cada fator vai de −1 a +1:

| Ordem | Fator | Normalização | Peso | Faixa em pontos de over |
|---|---|---|---|---|
| 1 | Confiança do técnico (relação) | (relação − 0,5) × 2 | 40% | −3,2 a +3,2 |
| 2 | Moral | (moral − 0,5) × 2 | 30% | −2,4 a +2,4 |
| 3 | Disciplina | (disciplina − 0,5) × 2 | 20% | −1,6 a +1,6 |
| 4 | Apoio da torcida (idolatria no clube) | idolatria ÷ 100 | 10% | −0,8 a +0,8 |
| | **Total** | | | **−8 a +8** |

Na zona de disputa da curva de minutos, cada ponto vale cerca de 9 pontos percentuais. Exemplos:
- técnico confiando (0,9), moral boa (0,8): +2,6 + 1,4 = +4 pontos, cerca de **+35 pp de minutos**;
- técnico desconfiado (0,2), moral baixa (0,3): −1,9 − 1,2 = −3,1 pontos, cerca de **−28 pp**.

O papel mostrado na tela (titular, disputa, reserva) segue o over de escalação, então o jogador vê o efeito.

### 2.2 Curva de evolução: tempo de jogo e moral pesam mais

| Fator | Hoje | Proposta |
|---|---|---|
| **Tempo de jogo** | 0,4× (sem jogar) a 1,0× | **0,25× a 1,15×** (quem joga muito cresce mais) |
| **Moral** | 0,8× a 1,2× | **0,65× a 1,35×** |
| Confiança do técnico (atenção no treino) | — | 0,92× a 1,08× |
| Disciplina (cuidado com o corpo) | — | 0,94× a 1,06× |
| Apoio da torcida | — | não entra (fica só no tempo de jogo) |
| Nível da liga (2.4) | — | 0,97× a 1,10× |
| Estrutura do clube | 0,8× a 1,2× | igual |
| **Produto dos fatores de decisão** | 0,8× a 1,2× | limitado a **0,5× a 1,6×** |

Além disso:
- **A moral não esquece tão rápido:** a recuperação natural fica 40% mais lenta (`pesoMinutos` e `pesoResultado` × 0,6).
- **Veterano disciplinado dura mais:** o declínio vai de 0,85× (disciplina 1) a 1,15× (disciplina 0).
- **Cartões:** a taxa passa a ser temperamento × (1,6 − disciplina), de 0,6× a 1,6×. Mais cartões já tiram minutos.

### 2.3 Valor de mercado: over, idade, crescimento, clube e liga

`valor = valor base (over, idade) × fator do crescimento × fator da liga × fator do clube`

| Parte | Regra | Faixa |
|---|---|---|
| Valor base | a curva de hoje (over e idade) | igual |
| Crescimento do over | variação do over no último ano: +1 ponto = +5%, −1 ponto = −5% | 0,8× a 1,3× |
| Liga | o nível da liga onde joga (2.4) | 0,7× a 1,9× |
| Clube | os clubes de exceção da 2.4 sobem um nível; a elite de hoje (×1,25) passa a valer também no valor atual, não só na projeção | 1,0× a 1,25× |

O valor aparece na tela como hoje (faixas e o valor em euros, regra v2.33).

### 2.4 Ranking das ligas (definido pelo usuário)

Valores relativos ao Brasileirão Série A (= 1,0), que é a referência da curva de valor de hoje.

| Nível | Ligas e clubes | Valor | Evolução |
|---|---|---|---|
| 1 | Inglesa, Espanhola; **Bayern** e **PSG** | 1,9× | 1,10× |
| 2 | Alemã; **Inter** | 1,6× | 1,08× |
| 3 | Francesa | 1,45× | 1,06× |
| 4 | Italiana | 1,35× | 1,05× |
| 5 | Portuguesa | 1,2× | 1,03× |
| 6 | Demais ligas europeias (`OUTROS`) | 1,1× | 1,02× |
| 7 | Brasileira: Série A / B / C / D | 1,0 / 0,8 / 0,7 / 0,7× | 1,0× |
| 8 | Demais ligas (América do Sul, Arábia, EUA, Japão, Catar, China) | 0,85× | 0,97× |

Os nomes das ligas na tela seguem descritivos (regra de nomes, `competitions.json`). Bayern, PSG e Inter só aparecem
como identificadores de dados, como hoje.

## 3. Critérios de aceitação (60 carreiras, mesma simulação)

1. **Bom vs. ruim:** de **4 a 8 pontos** de diferença no over de pico e de **15 a 30 pp** nos minutos médios.
2. **Ordem dos pesos respeitada:** ligar só a confiança do técnico mexe mais nos minutos do que ligar só a moral, que
   mexe mais que só a disciplina, que mexe mais que só a torcida (teste automático).
3. **Equilíbrio:** a carreira automática fica a no máximo **±2 pontos** do over de pico de hoje (87,0).
4. **Liga:** o mesmo jogador (mesmo over e idade) vale mais na Inglaterra que na Alemanha, que na França, e assim por
   diante, na ordem da tabela 2.4; Bayern, PSG e Inter acima das suas ligas.
5. **Crescimento:** dois jogadores com o mesmo over, um subindo e outro caindo, têm valores diferentes.
6. Determinístico, números em `src/data`, nenhum número de atributo na tela, testes de cada regra, e 100% dos testes,
   typecheck e build passando.

## 4. Efeitos colaterais

- **Saves:** a mesma escolha dá outra carreira, então o save sobe para a v13 (saves v12 viram "carreira de outra versão").
- **Propostas e salários:** o salário já é % do valor; com o fator de liga, salários na Europa sobem. Confiro o
  equilíbrio com a medição (critério 3) e ajusto `salarioPct` se precisar.
- **Texto novo (i18n):** frase curta no resumo do semestre quando o papel muda por confiança do técnico (ex.: "O técnico
  passou a confiar mais em você.").
- **Escolha automática:** continua seguindo o temperamento; só os resultados mudam.

## 5. Tarefas (uma por vez, teste antes de cada uma)

1. Medição fixa (`npm run sim`): os três jeitos e as tabelas acima, como base.
2. Over de escalação com os 4 fatores ponderados (2.1).
3. Fatores de evolução, moral mais lenta, declínio e cartões (2.2).
4. Ranking de ligas e clubes de exceção em dados (2.4).
5. Valor de mercado com crescimento, liga e clube (2.3).
6. Recalibrar até cumprir a seção 3; save v13; linha v3.07 no SPEC.
7. Frase do resumo do semestre (i18n).

## 6. Resultado da simulação (300 carreiras × 3 jeitos, 2026-10-15)

Protótipo atrás da chave `src/data/motor.json` (`ligado: false`). Mesmas 300 sementes com a chave desligada (hoje) e ligada.

| | Hoje: bom | Hoje: ruim | Proposta: auto | Proposta: bom | Proposta: ruim |
|---|---|---|---|---|---|
| Minutos (média) | 67,9% | 68,1% | 73,6% | **79,8%** | **65,2%** |
| Over de pico | 86,9 | 86,8 | 87,0 | 87,1 | 86,9 |
| Over aos 24 | 86,7 | 86,7 | 86,8 | 87,0 | 86,8 |
| Valor aos 24 (mediana) | € 55,2 mi | € 55,2 mi | € 74,5 mi | € 80,8 mi | € 71,6 mi |
| Títulos na carreira | 7,6 | 8,6 | 8,8 | 9,5 | 8,1 |
| Pico ≥ 85 | 76% | 75% | 76% | 76% | 75% |

Leitura:
- **Tempo de jogo:** bom vs. ruim passou de −0,2 para **+14,6 pp** (meta 15 a 30): quase lá.
- **Over de pico:** **não mudou** (87,1 vs. 86,9; meta 4 a 8). A evolução mais rápida só antecipa o pico: o teto de cada
  atributo (o potencial sorteado na criação) é o limite, e quase todo jogador chega nele. Para a decisão pesar no pico,
  ela precisa mexer no teto (ver 7).
- **Equilíbrio:** a carreira automática ficou no mesmo pico (87,0 vs. 86,9) ✓; joga mais (73,6% vs. 67,4%) e ganha mais
  títulos (8,8 vs. 7,6).
- **Valor:** sobe com a liga (mediana aos 24: € 55 mi → € 74 mi) e separa bom de ruim (€ 81 mi vs. € 72 mi).

## 7. Ajuste proposto depois da simulação: as decisões mexem no teto

Opção A (recomendada): a cada semestre, o produto das decisões (moral × técnico × disciplina) desloca o teto dos
atributos: acima de 1, o teto sobe até +0,5 ponto por semestre; abaixo de 1, desce até −0,5; limite de ±6 pontos na
carreira. Assim, carreira bem cuidada vira pico maior, e não só pico mais cedo.

Opção B: manter o teto e aceitar que as decisões mudam minutos, títulos e valor, mas não o pico.

**Escolhida: opção A** (usuário, 2026-10-15).

## 8. Resultado da opção A (300 carreiras × 3 jeitos, 2026-10-15)

Calibragem: o passo do teto é `0,5 × (produto − 1,26) ÷ 0,25`, limitado a ±0,5 por semestre e ±6 na carreira
(`motor.json`, `teto`). O neutro não é 1: o produto médio por semestre medido foi auto 1,25, bom 1,42, ruim 1,20. Com
neutro 1 (primeira rodada), o teto subia para todos (auto 90,6, bom 91,9, ruim 90,1) e falhava os critérios 1 e 3.

| | Hoje: auto | Opção A: auto | Opção A: bom | Opção A: ruim |
|---|---|---|---|---|
| Over de pico | 86,9 | 87,6 | **91,2** | **86,1** |
| Minutos (média) | 67,4% | 72,2% | **81,6%** | **60,9%** |
| Over aos 24 | 86,7 | 86,7 | 90,2 | 85,4 |
| Valor aos 24 (mediana) | € 55,2 mi | € 80,8 mi | € 240,1 mi | € 55,2 mi |
| Títulos na carreira | 7,6 | 9,0 | 12,8 | 6,8 |
| Pico ≥ 85 / ≥ 90 | 75% / 11% | 74% / 35% | 97% / 72% | 65% / 15% |

Critérios da seção 3:
1. Bom vs. ruim: **5,1 pontos** de pico (meta 4 a 8) ✓ e **20,7 pp** de minutos (meta 15 a 30) ✓.
3. Automática: 87,6 vs. 86,9 hoje (meta ±2) ✓.

Pontos de atenção:
- **Valor do "bom" aos 24: € 240 mi de mediana.** Over 90+ na liga de nível 1 (×1,9) com crescimento (até ×1,3) sobre
  a curva de valor de hoje. Proposta: limitar o produto liga × crescimento × clube a ×2,0, ou baixar o nível 1 para ×1,6.
- **Auto com pico ≥ 90 passou de 11% para 35%**, com a média quase igual: a dispersão aumentou (quem decide bem chega
  mais longe, quem decide mal fica abaixo).

### 8.1 Limite do fator de valor (×2,0), 2026-10-15

Escolhido pelo usuário e implementado (`valor.fatorMax`), mas **não muda a mediana do "bom"** (€ 240 mi, igual). A causa
é a curva de valor base: +1 ponto de over = ×1,30, e over 90 aos 24 já vale € 120 mi antes de liga e clube. O "bom"
chega a 90,2 aos 24 (72% com pico ≥ 90, contra 11% hoje).

### 8.2 Teto de € 180 mi sobre o valor final (opção 1), 2026-10-15

`motorValue`: o `tetoEUR` da curva (`market.json`) passa a valer depois de liga, crescimento e clube.

| | Hoje | Auto | Bom | Ruim |
|---|---|---|---|---|
| Valor aos 24 (mediana) | € 55,2 mi | € 80,8 mi | € 180 mi | € 55,2 mi |
| No teto de € 180 mi aos 24 | 8% | 27% | **59%** | 10% |

Pico, minutos e títulos não mudam (8). O valor ficou realista no máximo, mas o "bom" satura no teto: 72% dele passa de
90 de pico. Se a saturação incomodar, a alavanca é a subida do teto de atributos (`teto.limiteCarreira`), não o valor.

### 8.3 Subida máxima do teto em +4 (queda em −6), 2026-10-15

Pedido do usuário: a diferença estava grande. `teto.limiteSubida` 4, `teto.limiteQueda` 6.

| Subida máx. | Pico auto | Pico bom | Pico ruim | Bom − ruim | Minutos bom − ruim | Bom no teto de valor aos 24 | 9.3 (95–99 / 90–94 / 85–89 / 80–84) |
|---|---|---|---|---|---|---|---|
| +6 | 87,6 | 91,2 | 86,1 | 5,1 | 20,7 pp | 59% | 7,6 / 23,6 / 43,2 / 22,2 |
| +5 | 87,5 | 90,8 | 86,1 | 4,7 | 20,1 pp | 58% | 7,6 / 22,8 / 44,0 / 22,2 |
| **+4** | **87,4** | **90,2** | **86,1** | **4,1** | **19,6 pp** | **56%** | **7,6 / 21,6 / 44,8 / 22,6** |

A meta 9.3 do SPEC (5 / 10 / 60 / 25, ±6 pp) continua fora em 90–94 e 85–89 com qualquer subida que mantenha bom − ruim ≥ 4.
