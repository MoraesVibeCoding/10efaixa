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

## Visuais 11 a 20 (SPEC v2.95, decisão do usuário em 2026-10-13)

O conjunto passa a ter **20 visuais** (os 10 de cima ficam como estão). Tabela completa, com grupo de pele, comprimento do cabelo e peças, em `docs/proposta-mais-visuais.md`, seção 3. Os prompts novos são gerados por `python3 docs/arte/gerar_visuais_11_20.py` a partir do prompt do Visual 04: tudo igual, só muda o bloco CHARACTER (e, nos de cabelo claro, duas linhas do plano de cor). Autoteste: `python3 docs/arte/test_gerar_visuais_11_20.py`.

Os personagens são **famílias de estilo** que o futebol popularizou, originais e ficcionais, **sem nome de ninguém**. Em cada retrato, a conferência pergunta "isso lembra uma pessoa específica?"; se sim, descarte e gere de novo com outra variação.

| Visual | Características | Idade aparente |
|---|---|---|
| Visual 11 | pele clara de fundo pêssego; rosto oval; moicano médio descolorido (loiro dourado); sem barba | 22 anos |
| Visual 12 | pele muito escura; rosto oval alongado; cabelo crespo curto descolorido (platinado); sem barba | 24 anos |
| Visual 13 | pele média-morena; rosto quadrado; cabelo longo ondulado castanho claro, solto, atrás das orelhas; barba cheia e curta | 26 anos |
| Visual 14 | pele dourada escura; rosto triangular; degradê alto com topo curto preto; barba rala | 23 anos |
| Visual 15 | pele muito clara; rosto oval; cabelo longo loiro escuro preso em coque no alto; sem barba | 21 anos |
| Visual 16 | pele muito escura (a mais escura do conjunto); rosto oval; tranças pretas longas presas atrás; sem barba | 25 anos |
| Visual 17 | pele morena clara; rosto redondo; cabelo cacheado médio castanho com volume; barba rala | 22 anos |
| Visual 18 | pele escura; rosto alongado; rastas pretas longas para trás; cavanhaque | 27 anos |
| Visual 19 | pele parda; rosto quadrado, traços maduros; degradê alto com topo curto castanho-escuro; barba cheia e curta | 28 anos |
| Visual 20 | pele clara oliva; rosto triangular; cabelo cacheado médio ruivo acobreado; bigode fino | 20 anos |

### Gere o Visual 12 primeiro (teste do plano de cor)

Os 10 prompts antigos proíbem cabelo claro (só preto e castanho; nenhum amarelo, laranja ou vermelho na pessoa), por causa das cores-chave do recolor. Os visuais **11, 12, 15 e 20** têm cabelo claro (loiro, platinado, loiro escuro e ruivo), então o plano de cor deles diz "tirando a cor do cabelo, nenhum amarelo, laranja ou vermelho". Antes de gerar os outros, **gere só o Visual 12 (platinado)** e passe em:

```
python3 docs/arte/processar_visuais.py
python3 docs/arte/conferir-visuais.py
```

Se a máscara da camisa e o fundo verde saírem limpos, siga com os outros nove. Se não, os visuais de cabelo claro passam para o tom mais claro de castanho que passar, e eu ajusto a ficha.

Salve cada imagem em `visual-NN/imagem.jpeg`. **Os dados dos 10 novos só entram em `src/data/visuais.json` depois que os retratos existirem** (sem retrato a tela de criação quebra).
