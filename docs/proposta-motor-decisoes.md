# Proposta: as decisões pesam em tempo de jogo e evolução (v3.07, motor)

Pedido do usuário em 2026-10-15: "principalmente em tempo de jogo e curva de evolução isso deve interferir mais".
Status: **aguardando DE ACORDO**. Nada entra no código antes.

## 1. O problema, medido

60 carreiras sorteadas (sementes 1 a 60), jogadas de três jeitos: escolha automática; sempre a opção que mais sobe
moral + relação com o técnico + disciplina ("bom"); sempre a que mais desce ("ruim").

| Jeito | Over de pico | Minutos (média da carreira) | Over aos 24 | Valor aos 24 |
|---|---|---|---|---|
| Automático | 87,0 | 65,2% | 86,6 | € 62,5 mi |
| Bom | 87,0 | 65,8% | 86,7 | € 63,6 mi |
| Ruim | 86,9 | 65,0% | 86,8 | € 63,7 mi |

Escolher bem ou mal dá **0,1 ponto de over e 0,8 ponto percentual de minutos**. Por que:

- **Tempo de jogo** vem só do over comparado ao nível do elenco (`minutes.json`, curva). Moral, relação e disciplina não entram.
- **Evolução**: a moral multiplica o crescimento de 0,8× a 1,2×, mas a moral se recupera sozinha com os minutos e o
  resultado do time (`updateMorale`), então a escolha some em um ou dois semestres.
- **Relação com o técnico** só pesa na reunião (40% da nota). **Disciplina** quase não faz nada (cartões vêm do temperamento).
- **Valor de mercado** é só over e idade; ele acompanha o over e herda o mesmo efeito quase nulo.

## 2. A mudança proposta

Tudo em números de configuração (`minutes.json`, `evolution.json`, `discipline.json`), nunca fixo no código, e nenhum
número mostrado ao jogador (só palavras e faixas, como hoje).

### 2.1 Tempo de jogo: a "confiança para escalar"

O motor passa a calcular o tempo de jogo por um over de escalação:

`over de escalação = over + bônus da relação + bônus da forma + desconto da disciplina` (limitado a ±6 pontos)

| Parte | Regra | Faixa |
|---|---|---|
| Relação com o técnico | (relação − 0,5) × 8 | −4 a +4 pontos |
| Forma (moral) | (moral − 0,5) × 4 | −2 a +2 pontos |
| Disciplina baixa | abaixo de 0,4: −(0,4 − disciplina) × 10 | 0 a −4 pontos |

Na zona de disputa da curva, cada ponto vale cerca de 9 pontos percentuais de minutos. Um técnico que confia
(relação 0,9) dá +3,2 pontos, cerca de **+28 pp de minutos**; um técnico que desconfia (0,2) tira 2,4 pontos, cerca de
**−22 pp**. O papel na tela (titular, disputa, reserva) passa a seguir o over de escalação, então o jogador vê o efeito.

### 2.2 Curva de evolução

O crescimento do semestre ganha dois fatores novos, e a moral fica mais forte:

| Fator | Hoje | Proposta |
|---|---|---|
| Moral | 0,8× a 1,2× | 0,7× a 1,3× |
| Relação com o técnico (atenção no treino) | — | 0,9× a 1,1× |
| Disciplina (cuidado com o corpo) | — | 0,85× a 1,1× |
| Produto dos três | 0,8× a 1,2× | limitado a 0,6× a 1,45× |

Somado ao efeito dos minutos (que já multiplicam a evolução de 0,4× a 1,0×), a diferença entre uma carreira bem e
mal cuidada vira alguns pontos de over no pico, não décimos.

### 2.3 Disciplina no fim da carreira e nos cartões

- **Declínio:** disciplina alta retarda a queda do veterano. O fator de declínio vai de 0,85× (disciplina 1) a 1,15× (disciplina 0).
- **Cartões:** a taxa passa a ser temperamento × (1,6 − disciplina), ou seja, de 0,6× a 1,6×. Mais cartões tiram minutos (regra que já existe).

### 2.4 A moral não "esquece" tão rápido

Hoje a moral volta ao normal com os minutos em um ou dois semestres. Proposta: a recuperação natural fica 40% mais lenta
(`pesoMinutos` e `pesoResultado` × 0,6), para a escolha ainda valer no semestre seguinte.

## 3. Critérios de aceitação (medidos com a mesma simulação de 60 carreiras)

1. **Bom vs. ruim:** diferença de **4 a 8 pontos** no over de pico e de **15 a 30 pp** nos minutos médios.
2. **Equilíbrio geral:** a carreira automática fica a no máximo **±2 pontos** do over de pico de hoje (87,0), recalibrando se precisar.
3. **Valor de mercado aos 24:** a diferença bom vs. ruim fica entre **2× e 4×** (consequência do over e da idade).
4. Determinístico (PRNG com semente), todos os números em `src/data`, nenhum número de atributo na tela.
5. Testes unitários para cada regra nova, a simulação como teste de integração, e 100% dos testes, o typecheck e o build passando.

## 4. Efeitos colaterais

- **Saves:** a carreira muda para as mesmas escolhas, então o save sobe para a v13 (saves v12 viram "carreira de outra versão").
- **Texto:** o resultado da decisão já mostra "Relação com o técnico ↑"; ganhamos uma frase curta no resumo do semestre
  quando o papel muda por causa da confiança do técnico (ex.: "O técnico passou a confiar mais em você."), em `src/i18n/pt-BR`.
- **Escolha automática:** não muda (segue o temperamento), mas os resultados dela mudam com as novas regras.

## 5. Tarefas (uma por vez, cada uma com teste antes)

1. Script de medição fixo (`npm run sim`): os três jeitos e a tabela acima, como base.
2. Over de escalação nos minutos e no papel (2.1).
3. Fatores de evolução (2.2).
4. Disciplina no declínio e nos cartões (2.3).
5. Recuperação da moral mais lenta (2.4).
6. Recalibrar até cumprir os critérios da seção 3; save v13; linha v3.07 no SPEC.
7. Frase do resumo do semestre (i18n).
