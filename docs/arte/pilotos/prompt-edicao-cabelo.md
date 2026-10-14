# Prompt de edição do cabelo (Piloto A)

Use numa **conversa nova** do Gemini, **anexando a pintura original** (a imagem da cena, sem editar). Gere **uma** imagem por vez e salve com o nome indicado no passo a passo do README.

```
Edit the attached image. Change ONLY the hair of the main player, who is seen from behind.

NEW HAIR
{CABELO}

WHAT MUST STAY EXACTLY THE SAME
Everything else in the image: the stadium, the crowd, the other players, the ball, the pitch, the sky, the lighting, the player's body, skin, arms, shirt, shorts, socks and boots, the camera angle, the painting style, the image size and the framing. Do not move, resize, redraw or recolour anything except the hair.
Keep the player's head in the same position and at the same size, and the neck and ears where they are. Keep the same dark-brown hair colour.
The new hair may extend over the shoulders or above the head only as far as the description says, and it falls behind the shoulders, never over the front of the body.

MUST NOT APPEAR
No text, letters or numbers, no logos, no headband, cap or other accessory, no watermark or signature.
```

## Os três cabelos do piloto (troque `{CABELO}`)

| Formato | Texto para colar no lugar de `{CABELO}` |
|---|---|
| coque | `long dark-brown hair pulled up and gathered into a neat bun at the crown of the head, with the back of the neck and both ears clear` |
| tranças | `long dark-brown braids: tight cornrow braids run back across the top of the head and the braid ends gather behind the head and end at shoulder height` |
| degradê alto | `a short high fade in dark-brown hair: the sides and back of the head are faded down to the skin up to the temples, and the top is short and textured, about 3 cm` |

## Depois de gerar
1. Salve a imagem editada (por exemplo `gol-coque-editada.png`).
2. Rode: `python3 docs/arte/recompor_regiao.py original.png editada.png final.png x0,y0,x1,y1 4` com a caixa da tabela em `docs/arte/pilotos/README.md`.
3. O relatório tem de dizer `fora_diferentes: 0`.
4. Registre a tentativa em `docs/arte/pilotos/registro-do-piloto.csv`.
