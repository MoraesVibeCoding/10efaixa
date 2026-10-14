# Teste de cena por camadas — Vestiário

Cena de comparação no jogo: `docs/arte/cenas/02-vestiario` (corte curto).
Roupa do jogador: camisa de clube (magenta) e calção e meiões (ciano), trocados por código.

## Camadas

| # | Pasta | Papel | O que é |
|--:|---|---|---|
| 1 | `01-cenario` | cenario | Vestiário com armários vazios |
| 2 | `02-fixo-camisas` | fixo | As cinco camisas pendentes |
| 3 | `04-jogador-sentado-no-banco-curto` | jogador | Jogador curto |
| 4 | `04-jogador-sentado-no-banco-coque` | jogador | Jogador coque |

## Ordem para gerar
1. `01-cenario`
2. `04-jogador-sentado-no-banco-curto`
3. `04-jogador-sentado-no-banco-coque`
4. `02-fixo-camisas`

Cada camada vem com a mesma **ficha da cena** (câmera, luz, mapa de posições); por isso o código consegue empilhar sem ajuste manual de escala.

## Ficha da cena
Camera: straight behind the player, at the height of his shoulders, about three metres back, looking horizontally; no tilt, no low angle, no close-up.
Light: a single bare light bulb hangs from the ceiling above the centre locker and is the only light source: soft, cool white light from above, soft shadows falling straight down.
Palette: navy-blue lockers, grey concrete walls and floor, dark brown wooden bench. Magenta appears only on the shirts hanging in the lockers. Cyan appears only on the player's shorts and socks. Boots are black. No gold, no yellow, no red, no green.
Placement map (fractions of the canvas): five open-front lockers side by side, each 18% wide, at x 1%-19%, 21%-39%, 41%-59%, 61%-79% and 81%-99%, with their interiors from y 10% to y 40%; the centre locker (x 41%-59%) has a navy-blue door swung open towards the right; one magenta shirt hangs inside each locker, centred in it, from y 14% to y 34%; the player sits on a bench in the centre of the canvas, head top at 30%, bench seat at 60% and boots at 72%.
The lower 28% of the canvas is empty concrete floor fading into deep navy shadow, with no objects, because interface panels go over that area.

## Depois de gerar
Avise; eu junto as camadas (`montagem.json`), aplico o uniforme de 4 clubes e 2 tons de pele por código e preencho `avaliacao.md` com você.
