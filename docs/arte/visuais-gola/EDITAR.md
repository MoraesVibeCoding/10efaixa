# Opção A (recomendada): editar a imagem atual

Mantém o rosto, o cabelo e a pose do visual que já está no jogo. Faça uma vez para cada visual.

**Como fazer**
1. Abra uma conversa NOVA no gerador de imagem.
2. Anexe a imagem atual do visual: `docs/arte/visuais/visual-NN/` (o arquivo `Image.jpeg` ou `imagem.jpeg` que está lá).
3. Cole o prompt abaixo, sem mudar nada.
4. Salve o resultado na mesma pasta como `imagem.jpeg`, substituindo o antigo.
5. Se o rosto, o cabelo ou o enquadramento mudarem, descarte e use a opção B (`visual-NN.md`).

## Prompt

```
Edit the attached image. Keep EVERYTHING exactly as it is: the same person, the same face, hair, skin, expression, pose, framing, painting style, lighting, the same magenta shirt and the same flat green background (#00B140). Do not redraw, restyle, crop, zoom or move anything.

Change ONLY two small parts of the shirt:
- The COLLAR: paint the round collar as a ribbed band about 2 cm wide around the neck, in flat bright cyan (RGB 0, 181, 226 / #00B5E2).
- BOTH SLEEVE CUFFS: paint a band about 2 cm wide at the end of each short sleeve, in the same flat bright cyan (#00B5E2).

The cyan bands have clean, sharp edges against the magenta, keep the same soft fabric shading as the rest of the shirt, and have no dark outline. Cyan appears nowhere else in the image. Magenta stays on the body and sleeves of the shirt only.

Output at the same aspect ratio (4:5 vertical) and at the highest native resolution available (target 1856 x 2304 px). No upscaling artefacts, no blockiness, no text, no logo, no watermark.
```

## Conferência

- [ ] O rosto, o cabelo e a pose são os mesmos da imagem anterior.
- [ ] Gola e os dois punhos em ciano, com borda nítida. Nenhum outro ciano na imagem.
- [ ] Camisa magenta lisa no resto; fundo verde uniforme.
- [ ] 4:5, lado maior de pelo menos 1152 px, sem blocos ou pixelização.
