# Guia de produção da arte — 10eFaixa

> Arte final **pintada e gerada por IA** (decisão do usuário, SPEC v2.12). O usuário gera as imagens com a própria conta; o Claude Code escreve os prompts, processa as peças e confere cada lote.
> Mantido pela skill `.claude/skills/10efaixa-arte`.
> Versão 4 · 2026-10-01 · Base: SPEC v2.12, seções 6.17, 7 e 11. (v4: sai o vetorial chapado feito por ilustrador; entra ilustração pintada semi-realista por IA, com recolor por máscara. v3: troféus inspirados nos reais, nunca cópias.)
>
> **Estado:** o formato raster desta versão é uma **proposta a validar no lote piloto** (seção 7). Até a T43b–T45b, o jogo roda com a arte provisória em SVG descrita no Apêndice A.

## 1. O jogo em 30 segundos

10eFaixa é um simulador de carreira de jogador de futebol brasileiro, jogado no celular (navegador). O jogador cria um atleta fictício e vive a carreira dos 16 anos à aposentadoria: várzea, peneira, clubes, Seleção. **Toda decisão aparece com uma cena ilustrada**, montada pelo código a partir de peças: cenário + o avatar do jogador numa pose + companheiros + detalhes (taça, bola, placar, torcida).

O sonho que dá nome ao jogo: vestir a **camisa 10** e usar a **faixa de capitão** da Seleção.

## 2. Regras que não podem ser quebradas

- **Arte 100% original.** Nenhum rosto, penteado característico, tatuagem, comemoração marca registrada ou visual reconhecível de pessoa real.
- **Prompts limpos.** Nunca citar nome de pessoa (jogador, técnico, celebridade), clube, seleção, competição, marca, fornecedor de material nem artista ("no estilo de …"). Descrever só o que se vê.
- **Sem escudos, logos, marcas ou texto na imagem.** Uniformes só com cores e padrões genéricos; escudos do jogo são feitos pelo código (cores e iniciais). Imagem que sair com escudo, logo, número ou letras é descartada ou limpa.
- **Aparência não é estereótipo.** Tons de pele, cabelos e barbas são escolhas visuais do jogador e nunca aparecem associados a papéis ou "tipos" de personagem.
- **Uso comercial.** Só ferramentas e planos cujos termos permitam uso comercial das imagens. Cada peça entra em `docs/arte-registro.csv` (arquivo, ferramenta, plano, data, prompt). A titularidade de direitos sobre arte de IA é incerta no Brasil: **validar com advogado antes do lançamento** (SPEC, seção 11).
- **Não usar a imagem de referência como entrada da IA.** Ela orienta a descrição do estilo; não é imagem-base para variação.

## 3. Estilo

**Referência de qualidade e de layout:** `docs/referencias/estilo-layout-2026-10-01.webp`. Vale o acabamento e a composição; **não** valem as cores (roxo e dourado) nem os escudos.

- **Ilustração pintada semi-realista:** proporções humanas reais, luz e sombra suaves, textura leve de pincel, contorno fino e discreto. Nem vetor chapado, nem foto.
- **Composição de cena:** o cenário ocupa a tela; o personagem aparece de costas, de perfil ou em três quartos, **olhando para a ação**. Rosto de frente fica para o cartão final e a criação.
- **Espaço para a interface:** a parte de baixo da cena (cerca de 40%) é mais calma e escura, porque os painéis e botões entram por cima.
- **Legível no celular:** a cena aparece com ~360 px de largura. Silhuetas claras; detalhe miúdo some.
- **Tom:** caloroso, brasileiro. Campinho de terra, arquibancada de concreto, vestiário com azulejo, rádio de pilha.
- **Paleta original do jogo** (seção 7 do SPEC) domina cenários e detalhes:

| Nome | Hex | Uso na arte |
|---|---|---|
| Cal de campo | `#F2F4EF` | Luzes, céu claro, linhas do campo, paredes caiadas |
| Marinho de vestiário | `#14213D` | Sombras, noite, base escura, contorno |
| Amarelo braçadeira | `#FFC21A` | **Único destaque**: faixa de capitão, taça, refletor, janela acesa |
| Verde gramado | `#1E7B4F` | Gramado |
| Vermelho cartão | `#D62839` | Só cartão, lesão, alerta |
| Cinza de linha | `#C9CFC6` | Concreto, divisores |

Tons naturais (pele, terra, madeira) entram, mas dessaturados e sempre "banhados" pelo marinho nas sombras e pela cal nas luzes. Nada de roxo, rosa ou neon no resultado final.

## 4. Como o código monta a arte pintada

### 4.1 Recolor por máscara (chroma)

Cada peça é gerada **uma vez**, com as áreas que mudam pintadas em cores de chroma bem saturadas. O script de processamento encontra essas áreas pelo matiz, cria a máscara e guarda a pintura em tons de cinza; no jogo, o código aplica a cor real **preservando a luz e a sombra** da pintura.

| Área | Cor pedida no prompt | O código troca por |
|---|---|---|
| Camisa (cor 1 do clube) | verde-limão vivo | Cor 1 do clube |
| Calção e detalhes (cor 2) | azul puro vivo | Cor 2 do clube |
| Pele | tom médio neutro, sem maquiagem de cor | ~10 tons de pele |
| Cabelo e barba | castanho médio neutro | Cor do cabelo (e grisalho com a idade) |
| Chuteira | ciano vivo | Cor da chuteira |
| Fundo da peça | magenta chapado | Transparência |

Pele e cabelo não usam chroma (ficariam artificiais): a máscara vem da posição conhecida da peça e do matiz natural, e o piloto confirma se o resultado convence nos tons extremos.

### 4.2 Figura, altura e compleição

- **Figura de referência:** 1,80 m, compleição atlética, corpo inteiro, quadro retrato **800 × 1600**, pés na linha de base, centralizada.
- O código escala a **figura inteira**: vertical para a altura (cerca de 1,62 a 2,00 m) e horizontal para a compleição (franzino, atlético, forte). Não se geram versões alta, baixa ou forte.

### 4.3 Cabeça montada

- A pose traz o corpo com a cabeça **careca e sem barba**. O código cobre essa cabeça com a **cabeça canônica** do ângulo da pose (rosto + expressão), e por cima encaixa cabelo, barba, rugas e acessório.
- Para o encaixe funcionar, todas as cabeças e peças de cabeça de um mesmo ângulo são geradas **no mesmo quadro 512 × 512**, com a cabeça no mesmo lugar e tamanho.
- Este é o ponto de maior risco do formato (a IA varia a cabeça entre imagens) e é o que o lote piloto testa primeiro.

### 4.4 Montagem da cena

- Cenário em **1080 × 1350** (retrato 4:5), sem personagens em primeiro plano.
- Cada peça tem um arquivo de âncoras ao lado (`.json`), escrito pelo Claude Code depois do processamento: onde fica a cabeça na pose e o ângulo dela; onde ficam o jogador e os companheiros no cenário (posição, escala, pose sugerida).
- A torcida ao fundo é pintada em cinza neutro e recebe as cores do clube por máscara.

## 5. Formato técnico

### 5.1 Arquivos

- **Você entrega:** PNG como saiu do gerador, na maior resolução disponível, numa pasta por lote.
- **O script gera:** WebP com transparência, máscara e arquivo de âncoras, em `src/assets/art/final/`.
- **Nome do arquivo:** `categoria__peca__variante__angulo.png`, tudo minúsculo, sem acento, palavras com hífen. Partes que não se aplicam são omitidas.
  - Exemplos: `cabelo__black-power__frente.png`, `pose__correndo.png`, `cenario__vestiario.png`, `detalhe__taca.png`.
  - Ângulos: `frente`, `perfil`, `tres-quartos`.

### 5.2 Orçamento de peso (WebP final)

| Tipo | Máximo |
|---|---|
| Peça de cabeça/acessório | 40 KB |
| Pose | 150 KB |
| Detalhe | 60 KB |
| Cenário | 250 KB |
| Cena montada (tudo o que uma tela baixa) | 600 KB |

Valores iniciais; fecham na T43b com o piloto medido no celular.

### 5.3 Prompt-base

Os geradores respondem melhor em inglês. Todo prompt começa pelo bloco de estilo e termina pelo bloco de restrições; o meio descreve a peça.

```
[ESTILO] semi-realistic painted digital illustration, soft painterly shading, subtle brush texture,
thin clean linework, realistic human proportions, warm cinematic lighting,
limited palette: off-white lime-wash, deep navy blue shadows, pitch green, concrete grey,
a single warm golden-yellow accent

[PEÇA] … descrição da pose, cabeça, cenário ou detalhe …

[RESTRIÇÕES] no text, no letters, no numbers, no logos, no crests, no badges, no sponsor marks,
no watermark, original fictional character, not resembling any real person
```

Blocos extras por tipo:

- **Pose:** `full body, single male football player, bald, clean-shaven, plain bright lime-green shirt, plain pure-blue shorts and socks, cyan boots, flat solid magenta background, even studio light, no cast shadow on the background`
- **Cabeça:** `head and neck only, bald, clean-shaven, [ângulo], [expressão], centered, same framing, flat solid magenta background`
- **Cabelo / barba:** `only the hair (ou beard) as it would sit on a head, [estilo], medium neutral brown, [ângulo], centered, same framing, flat solid magenta background`
- **Cenário:** `empty scene, no foreground characters, portrait 4:5, calm darker lower third for interface overlay, distant crowd in neutral grey`
- **Detalhe:** `single object, centered, flat solid magenta background`

Os prompts completos de cada peça ficam em `docs/arte-prompts.md`, escritos lote a lote (o primeiro é o do piloto).

## 6. Lista de peças (v1)

### 6.1 Boneco e poses (~10)

| # | Pose | Usada em |
|---|---|---|
| 1 | Em pé, neutro | Entrevista, convocação, casa da família, reunião |
| 2 | Correndo | Treino, jogo, estádio |
| 3 | Chutando | Gol, pênalti |
| 4 | Cabeceando (no ar) | Cabeçada |
| 5 | Comemorando (base) | Gol, título — braços trocáveis para as comemorações (6.4) |
| 6 | Goleiro mergulhando | Defesa, pênalti (goleiro) |
| 7 | Sentado | Vestiário, banco, sala do empresário, hospital |
| 8 | Aperto de mão / assinando | Contrato, empresário |
| 9 | Erguendo a taça | Título, Copa |
| 10 | Cabisbaixo | Derrota, vaia, lesão, despedida |

Uniforme de goleiro: variante de camisa de manga longa e luvas (camadas extras `luvas` e `mangas-longas` nas poses 1, 2, 6, 7, 9, 10).

### 6.2 Cabeça (3 ângulos cada: frente, perfil, três quartos)

| Peça | Variantes | Arquivos |
|---|---|---|
| Rosto base | 1 | 3 |
| Expressões | neutra, alegre, triste, concentrada | 12 |
| Cabelos | raspado, curto, cacheado, crespo, black power, dread, moicano, longo | 24 |
| Cabelos com entradas (envelhecimento) | os 7 acima menos raspado | 21 |
| Barbas | rala, cavanhaque, bigode, cheia | 12 |
| Rugas (envelhecimento) | 1 | 3 |
| Acessório: faixa de cabelo | 1 | 3 |

O grisalho é feito pelo código (mistura a cor do cabelo com cinza), não precisa de imagem.

### 6.3 Uniforme (padrões sobre a camisa)

`lisa`, `listras-verticais`, `faixa-diagonal`, `metade`, `gola-contraste` — aplicados pelo código como máscara sobre a camisa de cada pose. Número nas costas é escrito pelo código.

### 6.4 Comemorações (braços/corpo sobre a pose 5)

`aviaozinho`, `dancinha`, `punho-cerrado`, `coracao-maos`, `cambalhota`, `aponta-ceu`, `beija-alianca`, `chuteira-telefone` — genéricas, nenhuma marca registrada de jogador.

### 6.5 Cenários (25)

várzea (campinho de terra) · rua do bairro (olheiro) · peneira · treino · vestiário · banco de reservas · reunião com a comissão · sala do empresário · assinatura de contrato · aeroporto · estádio · gol · cabeçada · pênalti · título · convocação · hospital · fisioterapia · festa · entrevista/redes sociais · clássico · vaia · Copa · casa da família · despedida

### 6.6 Detalhes

troféus (ver 6.7) · bola · placar · faixa de capitão (amarelo braçadeira) · bandeirão de torcida · microfone · celular · maca · contrato e caneta · mala.

### 6.7 Troféus — inspirados, nunca cópias

Cada título tem um troféu próprio que **evoca** o troféu real da competição pelo "tipo" (taça com orelhas, globo dourado, salva de prata, bola dourada no prêmio individual…), para o jogador reconhecer a conquista. **Não reproduza** o desenho de nenhum troféu real: proporções, figuras, relevos, inscrições e logotipos são originais. Desenhos de troféus reais são protegidos (ex.: a taça da Copa do Mundo é marca e desenho registrados).

Lista mínima: estadual · Série A · Série B · Série C · Série D · Copa do Brasil · Copa do Nordeste · copa continental principal · copa continental secundária · Copa do Mundo · Copa América · Olimpíadas (medalha) · ligas europeias · copa europeia · prêmios individuais (melhor jogador, artilheiro, melhor goleiro, revelação). Ouro puxado para o amarelo braçadeira `#FFC21A`, com sombra marinho.

## 7. Lotes

| Lote | Conteúdo | Objetivo |
|---|---|---|
| **Piloto (T42b ⛳)** | Pose "em pé, neutro"; cabeça de três quartos (neutra) + 2 cabelos + 1 barba; cenário vestiário | Decidir se o formato segue: recolor de camisa e pele em tons extremos, encaixe de cabelo e barba, legibilidade a 360 px, peso |
| 1 | Poses restantes, todas as cabeças e expressões | Avatar completo |
| 2 | Cabelos, barbas, rugas e acessório nos 3 ângulos | Personalização completa |
| 3 | Cenários e detalhes (com os troféus) | Todas as cenas |
| 4 | Ajustes finais | Revisão no jogo antes do lançamento |

Se o piloto mostrar que o encaixe de cabelo e barba não fica aceitável, a alternativa registrada no SPEC é reduzir a personalização a personagens prontos.

## 8. Checklist por imagem

- [ ] Nome no padrão `categoria__peca__variante__angulo.png`
- [ ] Quadro e enquadramento do tipo da peça (4.2 a 4.4)
- [ ] Fundo magenta chapado (peças) ou cenário sem personagens em primeiro plano
- [ ] Camisa, calção e chuteira nas cores de chroma; cabeça careca e sem barba nas poses
- [ ] Sem texto, número, escudo, logo ou marca
- [ ] Paleta do jogo no resultado; amarelo só como destaque
- [ ] Nada que lembre pessoa, clube ou marca real
- [ ] Linha no `docs/arte-registro.csv` (ferramenta, plano, data, prompt)

---

## Apêndice A — Formato SVG da arte provisória (em vigor no código até a T43b–T45b)

A arte provisória (`src/assets/art/provisoria/`, gerada por `npm run art:generate`) continua em SVG com cores-chave exatas. É o formato que o validador (`src/art/format.json`), o motor do avatar e o compositor usam hoje.

### A.1 Como o código monta a arte provisória

#### A.1.1 Recolor por cores-chave

Você desenha cada peça **uma vez**. Tudo que o jogador personaliza ou que muda por clube é pintado com uma **cor-chave** exata; o código troca essa cor pela cor real.

| Cor-chave | Hex exato | O código troca por |
|---|---|---|
| Pele | `#FF00FF` | ~10 tons de pele |
| Pele — sombra | `#B000B0` | Sombra do tom escolhido |
| Uniforme primária | `#00FF00` | Cor 1 do clube |
| Uniforme primária — sombra | `#00B000` | Sombra da cor 1 |
| Uniforme secundária | `#0000FF` | Cor 2 do clube |
| Uniforme secundária — sombra | `#0000B0` | Sombra da cor 2 |
| Cabelo / barba | `#FF8000` | Cor do cabelo (e grisalho com a idade) |
| Cabelo — sombra | `#B05800` | Sombra do cabelo |
| Chuteira | `#00FFFF` | Cor da chuteira |
| Acessório | `#FFFF00` | Cor da faixa de cabelo |

Use só esses hex nessas áreas. Uma cor "quase igual" (ex.: `#FE00FF`) não é trocada e o validador recusa.

#### A.1.2 Boneco-base, altura e compleição por proporção

- Um único **boneco-base** de referência: 1,80 m, compleição atlética, de frente, num `viewBox` de **400 × 800**, pés na linha `y = 780`, centro em `x = 200`.
- O código estica o boneco para a **altura** (cerca de 1,62 a 2,00 m) e alarga ou afina tronco e membros para a **compleição** (franzino, atlético, forte). Por isso cada parte do corpo é um **grupo separado** com o ponto de articulação marcado (A.2.2). Nada de desenhar versões alta/baixa/forte.

#### A.1.3 Montagem da cena

Cenários trazem **lugares marcados** (`slot`) onde o código encaixa o avatar e os companheiros. Companheiros usam o mesmo boneco, com outras aparências sorteadas.

### A.2 Formato técnico

#### A.2.1 Arquivos

- **SVG** puro (sem imagens raster embutidas, sem fontes, sem scripts, sem `<style>` com regras externas). Texto, se houver, convertido em contorno.
- Exportar com **IDs preservados** e sem minificar nomes (no Illustrator: "Propriedades de objeto: Identificadores de camada").
- **Nome do arquivo:** `categoria__peca__variante__angulo.svg`, tudo minúsculo, sem acento, palavras com hífen. Partes que não se aplicam são omitidas.
  - Exemplos: `cabelo__black-power__frente.svg`, `cabelo__cacheado-entradas__tres-quartos.svg`, `pose__correndo.svg`, `cenario__vestiario.svg`, `detalhe__taca.svg`.
  - Ângulos: `frente`, `perfil`, `tres-quartos`.

#### A.2.2 Camadas (grupos `<g>` com `id`)

**Pose** (`pose__*.svg`), sempre com estes grupos, de trás para frente:

```
braco-tras · perna-tras · tronco · pescoco · perna-frente · braco-frente · cabeca-ancora
```

- Cada grupo de membro tem `data-pivo="x,y"` com o ponto de articulação (ombro, quadril, joelho…).
- `cabeca-ancora` é um retângulo invisível (`fill="none"`) onde o código encaixa a cabeça montada; `data-angulo` diz qual ângulo de cabeça usar nessa pose.
- Uniforme desenhado na pose (camisa, calção, meião) usando as cores-chave de uniforme; mãos e pernas expostas com cor-chave de pele; chuteiras com a cor-chave de chuteira.

**Cabeça** (montada pelo código, um arquivo por peça e ângulo), de trás para frente:

```
cabelo-tras · cabeca (rosto/orelhas, pele) · rugas · expressao · barba · cabelo-frente · acessorio
```

**Cenário** (`cenario__*.svg`):

```
fundo · meio · slot-jogador · slot-companheiro-1 … slot-companheiro-4 · frente
```

- `slot-*` são retângulos invisíveis com `data-escala` (tamanho relativo do boneco naquele ponto) e `data-pose-sugerida`.
- Torcida, bandeiras e faixas no cenário usam as cores-chave de uniforme (pintadas com as cores do clube).

#### A.2.3 Orçamento de peso

| Tipo | Máximo (SVG sem compressão) |
|---|---|
| Peça de cabeça/acessório | 15 KB |
| Pose | 30 KB |
| Detalhe | 20 KB |
| Cenário | 80 KB |
| Uniforme (padrão) | 15 KB |
| Comemoração | 30 KB |

As regras completas que o validador aplica estão em `src/art/format.json`.
