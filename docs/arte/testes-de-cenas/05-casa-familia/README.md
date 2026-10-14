# Teste de cena por camadas — Em casa com a família

Cena de comparação no jogo: `docs/arte/cenas/08-casa-familia` (corte curto).
Roupa do jogador: camisa de clube (magenta) com calça e tênis civis; a camisa troca por código.

## Camadas

| # | Pasta | Papel | O que é |
|--:|---|---|---|
| 1 | `01-cenario` | cenario | Sala de casa, sem sofá e sem ninguém |
| 2 | `02-fixo-sofa-com-a-familia` | fixo | Sofá com a família sentada |
| 3 | `04-jogador-no-banquinho-curto` | jogador | Jogador curto |
| 4 | `04-jogador-no-banquinho-coque` | jogador | Jogador coque |

## Ordem para gerar
1. `01-cenario`
2. `04-jogador-no-banquinho-curto`
3. `04-jogador-no-banquinho-coque`
4. `02-fixo-sofa-com-a-familia`

Cada camada vem com a mesma **ficha da cena** (câmera, luz, mapa de posições); por isso o código consegue empilhar sem ajuste manual de escala.

## Ficha da cena
Camera: at seated eye level, about two metres behind the player, looking straight at the sofa.
Light: early evening; warm, cosy light from a switched-on floor lamp and the last daylight through the window; soft shadows pointing slightly to the right.
Palette: navy blue, concrete grey, off-white, muted beige and natural tones; warm yellow or gold only on the warm light of the floor lamp. Magenta appears only on the player's shirt. There is no cyan anywhere. No purple, no neon.
Placement map (fractions of the canvas): the sofa with the family seated on it is centred, between x 14% and 86% and y 26% and 54%; the coffee table is in front of the sofa, between x 34% and 66% and y 52% and 60%; the floor lamp stands on the left, at x 6% to 14%; the shelf with picture frames is on the right wall, between x 82% and 98% and y 14% and 40%; the window with a curtain is on the back wall above the sofa, between x 34% and 66% and y 6% and 24%; the player sits on a wooden stool in the foreground, horizontally centred, head top at 30% and the seat of the stool at 60%.
The lower 40% of the canvas is calm and dark: the living-room floor fading into deep navy shadow, with no objects, because interface panels go over that area.

## Depois de gerar
Avise; eu junto as camadas (`montagem.json`), aplico o uniforme de 4 clubes e 2 tons de pele por código e preencho `avaliacao.md` com você.
