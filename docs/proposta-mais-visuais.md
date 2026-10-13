# Proposta: mais visuais de jogador (2026-10-13)

Pedido do usuário: "hoje a gente está limitado com 10 visuais"; aumentar, com visuais que "pareçam alguns jogadores famosos", mas sem rosto específico.

**Estado:** proposta, aguardando o "DE ACORDO" do usuário. Nada foi implementado nem registrado no SPEC.

## 1. Como é hoje

Fonte: `src/data/visuais.json`, `src/data/avatar.json`, SPEC 6.17.

- **10 visuais prontos**, sem nome ("Visual 1" a "Visual 10"), cada um com pele, cabelo, cor do cabelo, barba, faixa de cabelo e chuteira. A imagem do busto é `src/assets/visuais/visual-NN.webp` mais a máscara da camisa (`visual-NN-camisa.webp`).
- **Peças que já existem** (arte provisória em SVG e recolor): **10 tons de pele** (`t1` a `t10`), **8 estilos de cabelo** (raspado, curto, cacheado, crespo, black power, dread, moicano, longo), **8 cores de cabelo** (preto, castanho escuro, castanho, castanho claro, loiro escuro, loiro, ruivo, descolorido), **4 barbas** (rala, cavanhaque, bigode, cheia), **faixas de cabelo** e **6 cores de chuteira**.
- **O que os 10 visuais usam:** cada tom de pele uma vez; só **3 das 8 cores de cabelo** (preto 6, castanho escuro 3, castanho 1); o estilo **moicano nunca**; **nenhuma faixa de cabelo** e **só chuteira preta**.
- As cenas ainda são escolhidas pelo **corte de cabelo** (6 cortes, `cutForVisual`) e pintadas com **pele marrom fixa**. A cena não acompanha a pele do visual.

**Conclusão:** dá para criar bastante variedade **sem nenhuma peça nova**, só combinando melhor o que já existe.

## 2. A regra que limita "parecer jogador famoso"

SPEC 6.17: "Avatar **original**, nunca imitando o rosto ou o **visual característico** de pessoas reais". CLAUDE.md (regras que nunca podem ser quebradas): "Nunca imagem, rosto ou visual característico de pessoa real"; lendas só como texto descritivo no campo `inspiracao`, atrás da flag `inspiracaoLendas`.

- **Fora da regra:** um visual montado para lembrar uma pessoa específica (a combinação de corte, cor, barba, tatuagem e acessório que a identifica), mesmo sem rosto.
- **Dentro da regra:** visuais baseados em **famílias de estilo** que o futebol popularizou (um degradê alto, um platinado de comemoração, rastas curtas), sem reproduzir a combinação-assinatura de ninguém.
- **Risco jurídico real:** no Brasil, o uso da imagem de atleta em videogame sem cessão do próprio atleta já foi considerado ilícito (art. 20 do Código Civil), e os jogos grandes usam nomes e imagens genéricos para os brasileiros (fontes na seção 7). "Parecer" em nível de visual característico pode ser lido como uso de imagem.

**Recomendação:** seguir as famílias de estilo (seção 3), **sem citar nome de jogador em lugar nenhum dos visuais** (nem no prompt, nem no texto, nem no arquivo). Se o usuário quiser mesmo "inspirado em fulano", isso é mudança de regra do SPEC, com risco assumido por ele e revisão jurídica antes do lançamento, como foi com os emblemas (v2.86). Eu não recomendo.

## 3. Proposta: 20 visuais novos, em dois lotes

### Lote A, visuais 11 a 20: **só com peças que já existem** (sem SVG novo)

Usa as cores de cabelo, as faixas, as chuteiras e o moicano que hoje ninguém usa. Cada tom de pele aparece de novo uma vez.

| Visual | Pele | Cabelo | Cor | Barba | Faixa | Chuteira | Família de estilo |
|--:|---|---|---|---|---|---|---|
| 11 | t3 | moicano | loiro | nenhuma | branca | amarela | moicano descolorido de torcida |
| 12 | t8 | crespo | descolorido | nenhuma | nenhuma | preta | platinado de comemoração de título |
| 13 | t5 | longo | castanho claro | cheia | nenhuma | preta | cabelo solto e barba cheia |
| 14 | t10 | curto | preto | rala | preta | branca | curto com faixa |
| 15 | t1 | cacheado | ruivo | bigode | nenhuma | preta | ruivo clássico |
| 16 | t6 | dread | castanho escuro | cavanhaque | nenhuma | laranja | rastas com cavanhaque |
| 17 | t9 | black power | preto | nenhuma | nenhuma | vermelha | black power volumoso |
| 18 | t4 | raspado | (sem cabelo) | cheia | nenhuma | preta | careca com barba cheia |
| 19 | t7 | cacheado | loiro escuro | rala | branca | azul | cacheado claro com faixa |
| 20 | t2 | curto | castanho claro | nenhuma | nenhuma | branca | curto clássico, pele clara |

### Lote B, visuais 21 a 30: **precisa de peças novas**

Estilos que aparecem nas matérias sobre cortes do futebol e ainda não existem como peça. Cada estilo novo pede **uma peça em SVG** (arte provisória) e entra no portrait.

| Estilo novo | Descrição curta (genérica) |
|---|---|
| Degradê alto (high fade) | laterais raspadas bem altas, topo curto texturizado |
| Degradê cacheado | laterais em degradê baixo, topo cacheado volumoso |
| Repartido (side part) | corte social, risca de lado, laterais curtas |
| Tranças | tranças rentes à cabeça (fonte não encontrada; descrever à mão) |
| Rabo de cavalo ou coque | cabelo longo preso |

Os 10 visuais do lote B combinam esses 5 estilos com tons de pele ainda pouco usados, cores de cabelo e barbas diferentes. A tabela completa sai depois do lote A aprovado.

**Total possível:** 30 visuais. A tela "seu visual" (hoje 10 deslizando de lado) vira rolagem longa com 30; proposta de **agrupar por estilo** ou **mostrar 10 sorteados com botão "ver outros"**, mantendo teclado, foco visível e leitor de tela (WCAG 2.1 AA).

## 4. O que cada visual novo custa

- **Retrato do busto** (`visual-NN.webp`) mais máscara da camisa: 1 imagem por visual (gerada por IA e processada pelo script que já existe).
- **Cenas:** aqui está o custo grande.

| Caminho | Como funciona | 20 visuais novos (30 no total) |
|---|---|--:|
| **A. Uma cena por visual** | cada cena de cada visual é uma imagem (pele, cabelo e cor certos), o uniforme continua por código | **21 × 30 = 630 imagens** (420 a mais que as 210 de hoje com 10 visuais) |
| **B. Cena por silhueta de cabelo, com pele e cor de cabelo recoloridas por código** | 8 silhuetas (os 6 cortes de hoje mais 2); a pele e a cor do cabelo viram máscaras como o uniforme | **8 × 21 = 168 imagens**, mais as máscaras; cresce de graça com novos visuais |

O B exige regenerar as cenas com pele e cabelo em cinza neutro (como a camisa hoje) e criar as máscaras de pele e cabelo; o A não exige código novo na pintura, mas cresce a cada visual.

**Recomendação:** começar pelo **lote A** (sem peça nova, sem SVG novo) e testar o caminho B numa cena só (treino). Se o B funcionar, adotar; se não, adotar o A só para as 5 cenas mais usadas (62% das decisões) e deixar as outras com a silhueta mais próxima.

## 5. Passos, se aprovado (um por vez, cada um com teste)

1. Registrar no SPEC (v2.95) a decisão e a regra de estilo (sem nome de jogador).
2. Lote A em `visuais.json` (dados e teste de integridade), `visual-11` a `visual-20` retratos, prompts por visual.
3. Teste do caminho B na cena de treino.
4. Decidir A ou B e gerar as cenas dos 20 novos.
5. Lote B: estilos novos como peças em SVG, depois os 10 visuais e os retratos.
6. Revisão jurídica dos visuais antes do lançamento público.

## 6. Decisões que preciso do usuário

1. **DE ACORDO** com a regra: famílias de estilo, sem citar nem imitar jogador real.
2. Começar pelo **lote A** (10 visuais com peças existentes)?
3. Cenas: caminho **A** (uma por visual) ou testar o **B** (recolor por máscara) antes?
4. Meta final: **30 visuais** ou outro número (o código aceita crescer)?

## 7. Fontes

- Estilos de corte no futebol (famílias, não pessoas): [Beleza na Web](https://www.belezanaweb.com.br/loucas-por-beleza/cortes-de-cabelo-de-jogadores-os-estilos-masculinos-que-sao-tendencia-no-mundial), [Observador (Rússia 2018)](https://observador.pt/2018/06/28/com-o-mundial-pelos-cabelos-os-melhores-penteados-do-russia-2018/), [Lance!](https://www.lance.com.br/fora-de-campo/barbeiros-da-selecao-elegem-jogador-mais-resenha-e-revelam-possivel-corte-do-hexa.html).
- Direito de imagem em jogos e figurinhas: [Conjur, indenização por uso de imagem em videogame](https://www.conjur.com.br/2021-jun-30/empresa-indenizar-ex-atleta-uso-imagem-videogame//?print=1), [Jus.com.br, FIFA 20 e direito de imagem](https://jus.com.br/artigos/80158/fifa-20-electronic-arts-e-o-licenciamento-dos-jogadores-dos-times-brasileiros-uma-analise-sobre-o-direito-de-imagem-dos-atletas-no-brasil), [TRT-3, imagem em álbum de figurinhas](https://portal.trt3.jus.br/internet/conheca-o-trt/comunicacao/noticias-juridicas/importadas-2015-2016/ex-jogador-que-teve-imagem-divulgada-em-album-de-figurinhas-sem-autorizacao-sera-indenizado-06-05-2015-06-00-acs).
- Resumos de decisões, não os acórdãos: para um caso concreto, consultar advogado.
