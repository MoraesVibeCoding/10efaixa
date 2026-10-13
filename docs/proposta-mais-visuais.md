# Visuais de jogador: definição dos 20 (2026-10-13)

Pedido do usuário: chegar a **no máximo 20 visuais** (ideal entre 15 e 20), cobrindo pele branca, parda e negra e cabelo curto, médio e longo, com estilos que lembrem os de jogadores reais, sem rosto específico. Depois, as cenas genéricas por visual, o uniforme por código como hoje e as ligas em ordem: Série A, depois B a D, depois as grandes ligas.

**Estado:** definição proposta, aguardando o "DE ACORDO" do usuário na tabela da seção 3. Nada foi implementado nem registrado no SPEC.

## 1. Como é hoje

Fonte: `src/data/visuais.json`, `src/data/avatar.json`, SPEC 6.17.

- **10 visuais prontos**, sem nome, com pele, cabelo, cor do cabelo, barba, faixa e chuteira. Arte do busto em `src/assets/visuais/visual-NN.webp` mais máscara da camisa; os prompts ficam em `docs/arte/visuais/visual-NN/prompt.md`, o processamento em `docs/arte/processar_visuais.py` e a conferência em `docs/arte/conferir-visuais.py`.
- **Peças que já existem:** 10 tons de pele, 8 estilos de cabelo (raspado, curto, cacheado, crespo, black power, dread, moicano, longo), 8 cores de cabelo (preto, castanho escuro, castanho, castanho claro, loiro escuro, loiro, ruivo, descolorido), 4 barbas, faixas de cabelo e 6 cores de chuteira.
- **Grupos de pele dos 10 atuais:** branca 3 (`t1` a `t3`), parda 4 (`t4` a `t7`), negra 3 (`t8` a `t10`). Cada tom aparece uma vez.
- **Comprimento dos 10 atuais:** curto 7, médio 3, **longo 0**.
- **Cor de cabelo dos 10 atuais:** só preto, castanho escuro e castanho. Nenhum usa faixa nem outra chuteira que não a preta.

## 2. Regra de estilo (SPEC 6.17 e CLAUDE.md)

"Avatar original, nunca imitando o rosto ou o visual característico de pessoas reais." O usuário autorizou estilos parecidos com os de jogadores reais, sem trazer referência. Para ficar dentro da regra:

1. Cada visual é uma **família de estilo** que o futebol popularizou (degradê alto, platinado de comemoração, moicano descolorido, rastas, tranças, cabelo preso), nunca a combinação-assinatura de uma pessoa (corte, cor, barba e acessório que a identificam juntos).
2. **Nenhum nome de jogador** em prompt, texto ou arquivo do projeto.
3. A conferência de cada retrato inclui a pergunta "isso lembra uma pessoa específica?"; se sim, muda.
4. **Revisão jurídica** dos visuais antes do lançamento público, como os emblemas (v2.86). No Brasil, o uso da imagem de atleta em videogame sem cessão já foi considerado ilícito (art. 20 do Código Civil); isto não é parecer jurídico (fontes na seção 8).

## 3. Os 20 visuais

Os 10 primeiros **não mudam** (ids, saves e retratos ficam como estão). Os 10 novos entram como `visual-11` a `visual-20`.

| Visual | Grupo de pele | Pele | Comprimento | Estilo | Cor | Barba | Faixa | Chuteira | Família de estilo | Peça nova |
|--:|---|---|---|---|---|---|---|---|---|---|
| 01 | branca | t3 | curto | curto | castanho | nenhuma | nenhuma | preta | curto clássico | não |
| 02 | parda | t5 | curto | cacheado | preto | rala | nenhuma | preta | cacheado curto | não |
| 03 | parda | t6 | curto | raspado | preto | cavanhaque | nenhuma | preta | careca com cavanhaque | não |
| 04 | negra | t8 | curto | crespo | preto | nenhuma | nenhuma | preta | crespo curto | não |
| 05 | negra | t10 | médio | black power | preto | cheia | nenhuma | preta | black power | não |
| 06 | branca | t1 | médio | longo | castanho escuro | nenhuma | nenhuma | preta | liso até a mandíbula | não |
| 07 | parda | t4 | médio | cacheado | castanho escuro | bigode | nenhuma | preta | cacheado médio | não |
| 08 | parda | t7 | curto | dread | preto | cheia | nenhuma | preta | rastas curtas | não |
| 09 | negra | t9 | curto | curto | preto | cavanhaque | nenhuma | preta | laterais baixas | não |
| 10 | branca | t2 | curto | curto | castanho escuro | cheia | nenhuma | preta | curto com barba, traços maduros | não |
| **11** | branca | t2 | médio | moicano | loiro | nenhuma | branca | amarela | moicano descolorido | não |
| **12** | negra | t9 | curto | crespo | descolorido | nenhuma | nenhuma | preta | platinado de comemoração | não |
| **13** | parda | t5 | longo | longo | castanho claro | cheia | nenhuma | preta | cabelo solto e barba cheia | não |
| **14** | parda | t7 | curto | **degradê alto** | preto | rala | preta | branca | degradê alto | **sim** |
| **15** | branca | t1 | longo | **rabo de cavalo ou coque** | loiro escuro | nenhuma | nenhuma | preta | cabelo preso | **sim** |
| **16** | negra | t10 | longo | **tranças** | preto | nenhuma | nenhuma | amarela | tranças longas | **sim** |
| **17** | parda | t4 | médio | cacheado | castanho | rala | branca | azul | cacheado claro com faixa | não |
| **18** | negra | t8 | longo | dread | preto | cavanhaque | preta | vermelha | rastas longas com faixa | não |
| **19** | parda | t6 | curto | **degradê alto** | castanho escuro | cheia | nenhuma | preta | degradê alto com barba cheia | usa a peça do 14 |
| **20** | branca | t3 | médio | cacheado | ruivo | bigode | nenhuma | branca | cacheado ruivo | não |

**Cobertura do conjunto:** pele branca 6, parda 8, negra 6; cabelo curto 10, médio 6, **longo 4**; as 8 cores de cabelo aparecem; 4 visuais usam faixa e 6 usam chuteira que não é preta.

**Peças novas (3):** degradê alto, rabo de cavalo ou coque, tranças. Cada uma pede uma peça em SVG na arte provisória e entra no retrato.

## 4. Riscos técnicos a testar antes de gerar os 10

1. **Plano de cor dos retratos.** Os prompts atuais dizem "cabelo só em preto e tons de castanho" e "nenhum amarelo, dourado, laranja ou vermelho na pessoa" (cores-chave do recolor). Loiro, loiro escuro, ruivo e descolorido (visuais 11, 12, 15 e 20, e o castanho claro do 13) vão contra isso. **Teste:** gerar só o Visual 12 (platinado) e passar por `processar_visuais.py` e `conferir-visuais.py`; se a máscara da camisa e o fundo verde saírem limpos, a regra se ajusta; se não, os visuais de cabelo claro usam o tom mais claro de castanho que passar.
2. **Olhos:** continuam castanho-escuros (outras cores conflitam com as cores-chave).
3. **Peças novas em SVG** (degradê alto, coque, tranças) precisam passar no validador da arte (`npm run art:check`).

## 5. Cenas genéricas por visual (a decisão do usuário)

O usuário decidiu: as cenas são feitas **por padrão de jogador**, com o uniforme genérico (camisa magenta, calção e meiões ciano), e o jogo aplica o uniforme do clube **por código, como hoje**.

| O quê | Conta com 20 visuais |
|---|--:|
| As 21 cenas atuais, uma por visual | 21 × 20 = **420 imagens** |
| As 18 cenas novas (13 previstas + 5 do lote 7), uma por visual | 18 × 20 = **360 imagens** |
| Total de cenas genéricas | **780 imagens** |
| Retratos dos 10 visuais novos | 10 imagens |

Isto substitui o recorte por cabelo (6 cortes) de hoje: a cena passa a ser escolhida pelo visual, não pelo corte (`cutForVisual` em `src/ui/screens/cenaArte.ts`). Os prompts das cenas (lotes 3 a 7) precisam descrever o jogador por pele, cabelo, cor e barba do visual, não por corte. **Ordem sugerida:** as 5 cenas mais usadas primeiro (treino, estádio, vestiário, casa da família, gol), com os 20 visuais; depois as demais.

A cena genérica de cada visual **não é regenerada por clube**: o uniforme do clube continua por código. A melhoria da pintura por código (nº de listras, direção, cores de manga) está na auditoria das cenas e entra clube a clube.

## 6. Roteiro por liga (uniforme por código)

Contagens de `src/data/clubs.json`, `europe.json` e `foreignClubs.json`.

| Fase | Liga | Clubes | Situação hoje |
|--:|---|--:|---|
| 1 | Brasileirão Série A | 20 | padrão e cores em `kits.json`, a melhorar |
| 2 | Série B | 20 | camisa lisa nas cores do escudo |
| 3 | Série C | 20 | idem |
| 4 | Série D | 96 | idem |
| 5 | Grandes ligas europeias (ING, ESP, ITA, ALE, FRA, POR) | 114 | idem |
| 6 | América do Sul (9 países) | 77 | idem |
| 7 | Demais (clubes sem divisão no Brasil, outros europeus, fora do eixo) | 177 | idem |

Cada fase: descrever padrão e cores de cada clube em `kits.json` **com fonte e data** (CLAUDE.md), conferir pelo teste de dados e ver numa cena. Sem escudo, patrocínio ou marca de fornecedor.

## 7. Passos, se aprovado (um por vez, cada um com teste)

1. Registrar no SPEC (v2.95): 20 visuais, a tabela da seção 3, a regra de estilo, a cena por visual e o roteiro por liga.
2. Teste do plano de cor com o Visual 12 (seção 4).
3. Prompts dos retratos 11 a 20 em `docs/arte/visuais/visual-11` a `visual-20` (mesmo formato dos atuais) e o usuário gera.
4. Dados dos 10 novos em `visuais.json` **só depois** dos retratos existirem (sem retrato a tela de criação quebra).
5. Peças em SVG de degradê alto, rabo de cavalo ou coque e tranças.
6. Cenas genéricas por visual, as 5 mais usadas primeiro.
7. Troca da escolha da cena de "corte" para "visual" no código.
8. Série A (melhorar `kits.json`), depois B a D e as outras ligas.

## 8. Fontes

- Famílias de estilo de corte no futebol (famílias, não pessoas): [Beleza na Web](https://www.belezanaweb.com.br/loucas-por-beleza/cortes-de-cabelo-de-jogadores-os-estilos-masculinos-que-sao-tendencia-no-mundial), [Observador (Rússia 2018)](https://observador.pt/2018/06/28/com-o-mundial-pelos-cabelos-os-melhores-penteados-do-russia-2018/), [Lance!](https://www.lance.com.br/fora-de-campo/barbeiros-da-selecao-elegem-jogador-mais-resenha-e-revelam-possivel-corte-do-hexa.html). Não achei fonte para tranças; o estilo está descrito à mão.
- Direito de imagem em jogos e figurinhas: [Conjur, indenização por uso de imagem em videogame](https://www.conjur.com.br/2021-jun-30/empresa-indenizar-ex-atleta-uso-imagem-videogame//?print=1), [Jus.com.br, FIFA 20 e direito de imagem](https://jus.com.br/artigos/80158/fifa-20-electronic-arts-e-o-licenciamento-dos-jogadores-dos-times-brasileiros-uma-analise-sobre-o-direito-de-imagem-dos-atletas-no-brasil), [TRT-3, imagem em álbum de figurinhas](https://portal.trt3.jus.br/internet/conheca-o-trt/comunicacao/noticias-juridicas/importadas-2015-2016/ex-jogador-que-teve-imagem-divulgada-em-album-de-figurinhas-sem-autorizacao-sera-indenizado-06-05-2015-06-00-acs). São resumos de decisões, não os acórdãos; para um caso concreto, consultar advogado.
