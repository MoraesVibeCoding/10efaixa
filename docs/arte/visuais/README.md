# Visuais prontos da criação: 10 prompts independentes

Cada pasta `visual-NN/` tem um `prompt.md` **completo e independente**: abra uma conversa nova, cole o bloco "Prompt" e gere uma única imagem. Salve como `visual-NN/imagem.jpeg`.

Os 10 personagens são **originais e ficcionais**. Os prompts não citam nem se baseiam em nenhuma pessoa real, e nenhum arquivo do projeto deve fazê-lo (CLAUDE.md).

## Fichas

| Visual | Características | Idade aparente |
|---|---|---|
| Visual 01 | pele clara oliva; rosto oval; cabelo curto liso castanho-médio; sem barba | 20 anos |
| Visual 02 | pele média-morena; rosto largo; cabelo curto cacheado preto; barba rala | 23 anos |
| Visual 03 | pele parda; rosto alongado; cabeça raspada; cavanhaque | 26 anos |
| Visual 04 | pele escura; rosto quadrado; cabelo crespo curto preto; sem barba | 21 anos |
| Visual 05 | pele muito escura; rosto oval; black power médio preto; barba cheia e curta | 24 anos |
| Visual 06 | pele clara; rosto redondo; cabelo liso castanho-escuro até a linha da mandíbula, atrás das orelhas; sem barba | 22 anos |
| Visual 07 | pele morena clara; rosto triangular; cabelo cacheado médio castanho-escuro; bigode fino | 22 anos |
| Visual 08 | pele média; rosto largo; dreads curtos pretos; barba cheia | 27 anos |
| Visual 09 | pele escura-parda; rosto oval; cabelo preto com laterais baixas; cavanhaque rala | 19 anos |
| Visual 10 | pele clara rosada; rosto quadrado, traços maduros; cabelo curto liso castanho-escuro com fios grisalhos; barba cheia aparada | 28 anos |

## Por que são idênticos fora do bloco CHARACTER

Estilo, linha, fundo, camisa, luz, plano de cores e composição são **iguais** nos 10, para formarem um conjunto coerente e o pós-processamento tratar todos do mesmo jeito. Só o bloco CHARACTER muda.

## Reforços (Visuais 01, 06 e 10)

Três prompts têm um bloco extra "CRITICAL FOR THIS IMAGE", porque na primeira rodada o resultado fugiu da ficha: Visual 01 (cabeça perto demais do topo), Visual 06 (cabelo cobrindo as orelhas e descendo até os ombros; agora é até a linha da mandíbula) e Visual 10 (fios grisalhos ausentes). Os outros sete ficam como estavam.

## Especificação técnica (o que o pós-processamento espera)

| Item | Valor |
|---|---|
| Proporção e tamanho | 4:5 vertical. Ideal 1856 x 2304 px nativo. **Mínimo aceito 928 x 1152** (serve de provisório); abaixo disso reprova |
| Fundo | verde chapado exato `#00B140` (RGB 0, 177, 64), igual nos quatro cantos |
| Camisa | magenta lisa (~`#CC00AA`), sem estampa e sem contorno escuro |
| Olhos | castanho-escuros (verde, azul, cinza, mel e amarelo conflitam com as cores-chave do recolor) |
| Cabelo e pelos | preto e tons de castanho (grisalho só no Visual 10) |
| Topo da cabeça | ~10% da altura (aceita de 8% a 12%) |
| Olhos (posição) | ~30% da altura (aceita de 26% a 34%) |
| Corte inferior | na cintura; mãos fora do quadro |
| Laterais | faixa verde de pelo menos 8% da largura de cada lado |

## Problemas que apareceram em testes anteriores (e como estes prompts evitam)

- Olhos verdes, mel e azul-acinzentados → o prompt exige íris castanho-escura e proíbe verde, azul, cinza, mel e amarelo.
- Pixelização e textura em blocos → pede resolução nativa e proíbe ampliação, JPEG em blocos e ruído.
- Quadrados e manchas no fundo e verde diferente entre imagens → pede o RGB exato, os quatro cantos e proíbe manchas.
- Cabeça colada no topo → pede 10% de faixa livre (nunca menos de 8%).
- Contorno escuro na camisa → proíbe qualquer linha de contorno.

## Depois de gerar

Traga os 10 `imagem.jpeg`. Antes de usar nas cenas, cada um passa pela conferência no fim do próprio `prompt.md` (e por um conferidor automático de tamanho, fundo e posição da cabeça, se você pedir).
