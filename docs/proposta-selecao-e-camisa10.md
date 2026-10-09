# Proposta: Seleção ano a ano e camisa 10 e faixa conquistadas (para aprovação)

> Escrito em 2026-10-09, a pedido do usuário. **Nada disto foi implementado.** Depois de aprovado, entra no SPEC como v2.63
> e vira tarefas com teste antes do código (TDD).

## 1. Seleção ano a ano na linha do tempo "Sua carreira"

### Hoje
- O motor conta **convocações por degrau** (Sub-17, Sub-20, Olímpica, lista, reserva, titular) e **jogos pela principal** (`selection.caps`), só no total da carreira.
- Os **torneios** (Copa, Copa América, Olimpíadas) ficam por ano, com a fase alcançada.
- **Não existem** gols nem assistências pela Seleção, nem jogos nas seleções de base.

### Proposta
- Cada temporada da linha do tempo ganha, **no mesmo card**, um bloco da Seleção quando houve convocação naquele ano:
  - o **degrau mais alto do ano** ("Seleção Sub-20", "Seleção Olímpica", "Seleção principal", e na principal "titular", "camisa 10", "capitão");
  - **jogos, gols e assistências pela Seleção** naquele ano;
  - o torneio do ano, se houve, com a fase ("Copa: semifinal").
- No motor: cada convocação gera **jogos da data FIFA** (número por degrau em `nationalTeam.json`, com fonte e data do calendário) e os torneios somam os jogos de cada fase; gols e assistências usam a mesma taxa por posição do clube (`stats.json`), ajustada pelo papel (titular, reserva). Tudo pelo gerador com semente.
- O total pela Seleção também vai para o cartão final (versão estatística) e para o resumo da temporada.
- A bandeira do topo continua aparecendo só depois da estreia na principal (v2.62).

### Critérios de aceitação
1. A soma por ano dos jogos pela principal é igual a `selection.caps`.
2. Gols e assistências pela Seleção por carreira ficam numa faixa plausível por posição (medido em 1000 carreiras).
3. Sem convocação no ano, nada de Seleção no card daquele ano.
4. A carreira continua determinística.

## 2. Camisa 10 e faixa de capitão conquistadas, nunca escolhidas

### Hoje
- Na criação, o jogador escolhe **qualquer número de 1 a 99, inclusive o 10** (SPEC 6.7).
- A **10 do clube** já é conquistada por regra (`canGetTen`: melhor do elenco e querido pela torcida), mas acontece **em silêncio**: não há evento, a figurinha segue com o número escolhido e nada aparece na tela.
- A **faixa de capitão** já é conquistada e vira o marco "primeira braçadeira" (evento com figurinha).
- Na Seleção, a 10 e a faixa são degraus próprios (6.11), contados no fim.

### Proposta
1. **Criação:** o número 10 sai das escolhas. A tela diz que "a 10 se conquista" e sugere outro número.
2. **Camisa 10 do clube vira momento:** quando `canGetTen` passa, abre o marco **"a camisa 10 é sua"** (novo, no formato dos marcos da T25c), com cena e figurinha no álbum. A partir dali, o número na figurinha e no cartão vira **10** naquele clube.
3. **Faixa de capitão:** continua como marco, e passa a ter o mesmo destaque visual que a 10.
4. **Destaque no topo da tela:** quando ele veste a 10 e/ou usa a faixa no clube atual, aparece um selo pequeno ao lado do nome ("10", "C" de capitão), como a bandeira da Seleção.
5. **Seleção:** a 10 e a faixa da Seleção ganham o mesmo tratamento (marco, selo e destaque no cartão final), mantendo os degraus da 6.11.
6. **Cartão final:** "10 e faixa" no clube ou na Seleção entram como honraria em destaque. A Seleção é o objetivo que dá nome ao jogo.

### Critérios de aceitação
1. A criação não aceita 10 (validação no motor, `player.ts`, e na tela).
2. Ninguém veste a 10 sem o marco ter aparecido; com o marco, a figurinha mostra 10 naquele clube.
3. O selo do topo aparece só enquanto ele veste a 10 ou usa a faixa no clube atual.
4. Saves antigos com o número 10 escolhido continuam válidos: o número vira o mais próximo livre (migração do save, como na v2.48).

## Perguntas para você decidir
1. Na linha do tempo, a Seleção fica **dentro do card do ano** (como você descreveu) ou numa faixa de cor própria logo abaixo, no mesmo card?
2. Gols pela Seleção nas **seleções de base** (Sub-17, Sub-20, Olímpica) também contam no total da carreira, ou só os da principal?
3. A camisa 10 no clube: depois de conquistada, ele **perde** a 10 ao trocar de clube (tem de conquistar de novo no novo clube)?
4. O número 7, 9 e outros "históricos" também viram conquista, ou só o 10?

## Respostas do usuário (2026-10-09)
1. A Seleção fica **dentro do card do ano** na linha do tempo.
2. Gols e jogos nas **seleções de base contam** no total da carreira.
3. Ao trocar de clube **a 10 permanece**: conquistada uma vez, ele segue com ela.
4. Só **o 10 e a faixa de capitão** viram conquista; os outros números seguem escolhidos.
