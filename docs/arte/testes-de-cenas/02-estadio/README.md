# Teste de cena por camadas — Estádio

Cena de comparação no jogo: `docs/arte/cenas/21-estadio` (corte curto).
Roupa do jogador: camisa de clube (magenta) e calção e meiões (ciano), trocados por código.

## Camadas

| # | Pasta | Papel | O que é |
|--:|---|---|---|
| 1 | `01-cenario` | cenario | Estádio lotado, sem jogadores |
| 2 | `03-adversarios` | figurantes | Dois adversários fechando |
| 3 | `03-companheiros` | figurantes | Dois companheiros pedindo a bola |
| 4 | `04-jogador-conduzindo-curto` | jogador | Jogador curto |
| 5 | `04-jogador-conduzindo-coque` | jogador | Jogador coque |
| 6 | `05-bola` | objeto | Bola |

## Ordem para gerar
1. `01-cenario`
2. `04-jogador-conduzindo-curto`
3. `04-jogador-conduzindo-coque`
4. `03-adversarios`
5. `03-companheiros`
6. `05-bola`

Cada camada vem com a mesma **ficha da cena** (câmera, luz, mapa de posições); por isso o código consegue empilhar sem ajuste manual de escala.

## Ficha da cena
Camera: at waist height, a few metres behind the player, looking up the pitch towards the opponents' goal. The horizon (the far goal line) sits at 38% of the way down from the top edge.
Light: a night match under floodlights from above; cool white light on the pitch, warm yellow only on the floodlight glow itself; soft shadows pointing slightly to the right and towards the camera.
Palette: navy blue, concrete grey, off-white, pitch green. The crowd and the flags are light grey and mid grey. Magenta appears only on the shirts and cyan only on the shorts and socks of the player's team. Opponents wear plain light grey. No purple, no pink, no neon.
Placement map (fractions of the canvas): the main player is horizontally centred, head top at 12% and boots at 75%; the two opponents are ahead of him, between x 18% and 80% and y 38% and 68%; the two team-mates run on the far left and far right, between x 3% and 97% and y 38% and 62%; the ball is just ahead of the player's right foot, between x 50% and 60% and y 66% and 76%.
The lower 40% of the canvas is calm and dark: the grass fading into deep navy shadow, with no objects, because interface panels go over that area.

## Depois de gerar
Avise; eu junto as camadas (`montagem.json`), aplico o uniforme de 4 clubes e 2 tons de pele por código e preencho `avaliacao.md` com você.
