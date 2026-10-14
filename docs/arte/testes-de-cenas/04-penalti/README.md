# Teste de cena por camadas — Pênalti

Cena de comparação no jogo: `docs/arte/cenas/04-penalti` (corte curto).
Roupa do jogador: camisa de clube (magenta) e calção e meiões (ciano), trocados por código.

## Camadas

| # | Pasta | Papel | O que é |
|--:|---|---|---|
| 1 | `01-cenario` | cenario | Gol e torcida, sem ninguém |
| 2 | `03-goleiro` | figurantes | Goleiro agachado na linha |
| 3 | `04-jogador-parado-curto` | jogador | Jogador curto |
| 4 | `04-jogador-parado-coque` | jogador | Jogador coque |
| 5 | `05-bola-na-marca` | objeto | Bola na marca do pênalti |

## Ordem para gerar
1. `01-cenario`
2. `04-jogador-parado-curto`
3. `04-jogador-parado-coque`
4. `03-goleiro`
5. `05-bola-na-marca`

Cada camada vem com a mesma **ficha da cena** (câmera, luz, mapa de posições); por isso o código consegue empilhar sem ajuste manual de escala.

## Ficha da cena
Camera: at waist height, a few metres behind the player, looking straight at the goal.
Light: a night match under floodlights from above; cool white light on the pitch, warm yellow only on the floodlight glow; soft shadows pointing slightly to the right and towards the camera.
Palette: pitch green, navy blue, concrete grey, off-white. The crowd, the flags, the banners and the stands are light grey and mid grey; the sky is plain deep navy. Magenta appears only on the player's shirt and cyan only on his shorts and socks. The goalkeeper wears rose pink (#F0569B) with orange gloves. No purple, no neon.
Placement map (fractions of the canvas): the goal is centred, its posts at x 26% and x 74%, the crossbar at y 34% and the goal line at y 55%; the goalkeeper crouches on the goal line between x 43% and 57% and y 39% and 56%; the penalty spot is at x 50%, y 66%, with the ball on it between x 46% and 54% and y 62% and 69%; the main player stands a few steps behind the ball, horizontally centred, head top at 14% and boots at 75%.
The lower 40% of the canvas is calm and dark: the grass fading into deep navy shadow, with no objects, because interface panels go over that area.

## Depois de gerar
Avise; eu junto as camadas (`montagem.json`), aplico o uniforme de 4 clubes e 2 tons de pele por código e preencho `avaliacao.md` com você.
