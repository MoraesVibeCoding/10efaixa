# Teste de cena por camadas — Treino

Cena de comparação no jogo: `docs/arte/cenas/11-treino` (corte curto).
Roupa do jogador: camisa de clube (magenta) e calção e meiões (ciano), trocados por código.

## Camadas

| # | Pasta | Papel | O que é |
|--:|---|---|---|
| 1 | `01-cenario` | cenario | Cenário do treino, sem ninguém |
| 2 | `03-companheiros` | figurantes | Três companheiros trotando |
| 3 | `03-tecnico` | figurantes | Técnico de braços cruzados |
| 4 | `04-jogador-correndo-curto` | jogador | Jogador curto |
| 5 | `04-jogador-correndo-coque` | jogador | Jogador coque |
| 6 | `05-bola` | objeto | Bola |

## Ordem para gerar
1. `01-cenario`
2. `04-jogador-correndo-curto`
3. `04-jogador-correndo-coque`
4. `03-companheiros`
5. `03-tecnico`
6. `05-bola`

Cada camada vem com a mesma **ficha da cena** (câmera, luz, mapa de posições); por isso o código consegue empilhar sem ajuste manual de escala.

## Ficha da cena
Camera: at waist height, a few metres behind the player, looking along a row of small white training cones that curves away towards the horizon. The horizon sits at 45% of the way down from the top edge.
Light: bright morning sunlight from the upper left; warm soft highlights on the left of everything and soft short shadows to the right.
Palette: pitch green, concrete grey, off-white, pale sky blue and muted natural tones. Magenta appears only on shirts and cyan only on shorts and socks of the players. No purple, no pink, no neon.
Placement map (fractions of the canvas, x from the left and y from the top): the main player is horizontally centred, head top at 12% and boots at 75%; the team-mates group is on the left, between x 6% and 34% and y 38% and 52%; the coach is on the right, between x 70% and 80% and y 36% and 56%; the ball is just ahead of the player's lifted foot, between x 58% and 68% and y 66% and 76%.
The lower 40% of the canvas is calm and dark: the grass fading into deep navy shadow, with no objects, because interface panels go over that area.

## Depois de gerar
Avise; eu junto as camadas (`montagem.json`), aplico o uniforme de 4 clubes e 2 tons de pele por código e preencho `avaliacao.md` com você.
