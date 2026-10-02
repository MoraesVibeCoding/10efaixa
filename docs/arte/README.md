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

## Lote 3 — cenários que já têm evento no jogo (11 cenas × 6 cortes = 66 imagens)

| Pasta | Cena | Roupa do jogador |
|---|---|---|
| `cenas/06-sala-empresario/` | Sala do empresário | camisa magenta, calça marinho |
| `cenas/07-reuniao-comissao/` | Reunião com a comissão | uniforme |
| `cenas/08-casa-familia/` | Em casa com a família | camisa magenta, calça marinho |
| `cenas/09-despedida/` | Despedida | uniforme |
| `cenas/10-copa/` | Copa do Mundo | uniforme |
| `cenas/11-treino/` | Treino | uniforme |
| `cenas/12-gol/` | Gol | uniforme |
| `cenas/13-hospital/` | Hospital | camisa magenta, calção marinho |
| `cenas/14-festa/` | Festa | camisa magenta, calça marinho |
| `cenas/15-entrevista/` | Entrevista | uniforme |
| `cenas/16-convocacao/` | Convocação | camisa magenta, calça marinho |

## Lote 4 — cenários restantes do catálogo (9 cenas × 6 cortes = 54 imagens)

`cenas/17-rua-do-bairro/` · `18-peneira/` · `19-banco-de-reservas/` · `20-aeroporto/` · `21-estadio/` · `22-cabecada/` · `23-fisioterapia/` · `24-classico/` · `25-vaia/`.

## Lote 5 — goleiro, troféus e abertura (79 imagens)

- `cenas-goleiro/<cena>/<corte>/`: 10 cenas de jogo × 6 cortes, com o goleiro de rosa (`#F0569B`), manga longa e luvas laranja; os companheiros seguem de magenta e ciano. Cenas: título, pênalti (ele defende), defesa (no lugar do gol), saída do gol (no lugar da cabeçada), estádio, clássico, Copa, vaia, treino e despedida. Nas cenas fora de campo o goleiro usa a mesma imagem dos jogadores de linha.
- `trofeus/<id>/`: 18 troféus de desenho original, quadrados (1:1), em fundo azul-marinho chapado. **Confira um a um se não lembra o troféu real.**
- `abertura/`: a tela de abertura, com o jogador em silhueta no túnel e a faixa de capitão amarela.

## Como os prompts dos lotes 3 a 5 são feitos

Saem de `gerar-lotes-3-5.py` (os textos das cenas ficam no próprio script). Para ajustar uma cena, edite o script e rode `python3 docs/arte/gerar-lotes-3-5.py`: ele reescreve só os `prompt.md` desses lotes e não toca em imagens nem nos lotes 1 e 2.

**Seis cortes de uma vez:** cada pasta de cena dos lotes 3 a 5 tem também um `prompt-6-cortes.md`, que pede as seis imagens na mesma conversa do Gemini (testado em 2026-10-02 com o treino: saíram seis imagens separadas, na ordem). Cole o bloco inteiro numa conversa nova; se ele parar antes da sexta, responda `Continue with the next image.`

Em todas as cenas: jogador de costas, costas da camisa livres para o número, torcida e adversários em cinza, 40% de baixo escuros e vazios, nenhum texto.
