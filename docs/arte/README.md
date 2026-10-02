# Arte — prompts para o Gemini (Nano Banana 2)

Um prompt por pasta. Você copia o prompt, gera no Gemini e salva a imagem **na mesma pasta** como `imagem.jpeg`.

## Como o lote funciona

- **Uma imagem-base por cena**, com o jogador de costas e o corte `curto`.
- **Cinco edições** da imagem-base, uma por corte de cabelo. Em cada uma você anexa a imagem-base e cola o prompt de edição, para a cena ficar idêntica.
- **Cortes:** `curto` · `cacheado-medio` · `liso-medio` · `cacheado-grande` · `liso-grande` · `careca`.
- **Tom de pele, cor do cabelo, uniforme do clube e número** não precisam de imagem: o código troca.

## Por que camisa magenta e calção ciano

O uniforme sai nessas duas cores chapadas para o código pintar com as cores e o padrão de cada clube (`src/data/kits.json`), mantendo a luz e a sombra da pintura. Torcida e bandeiras saem em cinza claro pelo mesmo motivo. No retrato, o fundo verde chapado serve para o recorte.

## Lote 1 — cinco cenas nos seis cortes

| Pasta | Cena | Usada em | curto | cacheado-medio | liso-medio | cacheado-grande | liso-grande | careca |
|---|---|---|---|---|---|---|---|---|
| `cenas/01-titulo/` | Título | Evento de título (estadual, copa, liga). Jogador de costas apontando para o céu, taça ao fundo. | feita | feita | feita | feita | feita | feita |
| `cenas/02-vestiario/` | Vestiário | Decisões de elenco e conversa com o técnico. Jogador sentado de costas no banco do vestiário. | feita | feita | feita | feita | feita | feita |
| `cenas/03-assinatura-contrato/` | Assinatura de contrato | Propostas, renovação e transferência. Jogador de costas à mesa, diante do contrato. | feita | feita | feita | feita | feita | feita |
| `cenas/04-penalti/` | Pênalti | Momento de decisão em jogo grande (o pênalti decisivo). Jogador de costas diante da bola e do gol. | feita | feita | feita | feita | feita | feita |
| `cenas/05-varzea/` | Várzea | Início de carreira na várzea e na rua do bairro. Jogador de costas no campinho de terra. | feita | feita | feita | feita | feita | feita |

Lote 1 completo em 2026-10-02: 30 de 30 imagens aprovadas, todas em 1856×2304. Ressalva: `02-vestiario/liso-grande` saiu com rabo de cavalo (nas outras cenas o liso grande é solto).

## Lote 2 — retratos de frente

`retratos/<corte>/`: seis retratos de frente, da cintura para cima, para a criação, a apresentação no clube e o cartão final. Camisa magenta lisa e fundo verde chapado (`#00B140`) para o recorte. Cada pasta tem um prompt completo, gerado do zero. Gere um primeiro, aprove o rosto e anexe-o como referência nos outros cinco.

Lote 2 completo em 2026-10-02: 6 de 6 retratos aprovados, todos em 1856×2304. Ressalvas: os rostos são parecidos, não idênticos (o `curto` tem o maxilar mais largo); o `liso-medio` saiu em escala um pouco menor (camisa com 73% da largura, contra ~81% dos outros), o que o código compensa ao recortar.

## Depois

Lote 3: os outros 9 cenários que já têm evento no jogo. Lote 4: os 11 cenários restantes. Lote 5: versões de goleiro (manga longa e luvas) das cenas de jogo, troféus e tela de abertura.
