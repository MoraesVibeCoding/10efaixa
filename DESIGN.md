---
name: 10eFaixa
description: Simulador de carreira do futebol brasileiro; a camisa é o número gigante, a braçadeira é a única cor que se move.
colors:
  escuro-fundo: "#212222"
  escuro-superficie: "#2C2D2D"
  escuro-texto: "#F2F4EF"
  escuro-textoSuave: "#C4C6C6"
  escuro-linha: "#414242"
  escuro-trilho: "#505151"
  escuro-destaque: "#FFC21A"
  escuro-sobreDestaque: "#14213D"
  escuro-positivo: "#63D7A0"
  escuro-negativo: "#FF8E97"
  escuro-foco: "#FFC21A"
  escuro-siglaTexto: "#FFFFFF"
  escuro-siglaContorno: "#14213D"
  claro-fundo: "#F2F4EF"
  claro-superficie: "#E5E9E0"
  claro-texto: "#14213D"
  claro-textoSuave: "#414D69"
  claro-linha: "#C9CFC6"
  claro-trilho: "#14213D"
  claro-destaque: "#FFC21A"
  claro-sobreDestaque: "#14213D"
  claro-positivo: "#18683F"
  claro-negativo: "#B81E2E"
  claro-foco: "#14213D"
  claro-siglaTexto: "#FFFFFF"
  claro-siglaContorno: "#14213D"
typography:
  numero:
    fontFamily: "'Big Shoulders Display Variable', 'Arial Narrow', 'Roboto Condensed', 'Helvetica Neue', sans-serif"
    fontSize: "5.5rem"
    fontWeight: 900
    lineHeight: 0.8
    letterSpacing: "-0.02em"
    fontFeature: "'tnum'"
  over:
    fontFamily: "'Big Shoulders Display Variable', 'Arial Narrow', 'Roboto Condensed', 'Helvetica Neue', sans-serif"
    fontSize: "2.25rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "'tnum'"
  titulo:
    fontFamily: "'Big Shoulders Display Variable', 'Arial Narrow', 'Roboto Condensed', 'Helvetica Neue', sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "0.01em"
  nome:
    fontFamily: "'Big Shoulders Display Variable', 'Arial Narrow', 'Roboto Condensed', 'Helvetica Neue', sans-serif"
    fontSize: "1.375rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "0.01em"
  opcao:
    fontFamily: "'Atkinson Hyperlegible', 'Verdana', 'Segoe UI', sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 700
    lineHeight: 1.2
  historia:
    fontFamily: "'Atkinson Hyperlegible', 'Verdana', 'Segoe UI', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.45
  corpo:
    fontFamily: "'Atkinson Hyperlegible', 'Verdana', 'Segoe UI', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  apoio:
    fontFamily: "'Atkinson Hyperlegible', 'Verdana', 'Segoe UI', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.3
  apoio-unidade:
    fontFamily: "'Big Shoulders Display Variable', 'Arial Narrow', 'Roboto Condensed', 'Helvetica Neue', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    letterSpacing: "0.14em"
rounded:
  reto: "0"
  balao: "1rem"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  toque-minimo: "4rem"
components:
  jogador:
    backgroundColor: "{colors.escuro-superficie}"
    textColor: "{colors.escuro-texto}"
    typography: "{typography.nome}"
    rounded: "{rounded.reto}"
    padding: "0.75rem 1rem"
  escudo:
    textColor: "{colors.escuro-siglaTexto}"
    width: "44px"
    height: "50px"
  over-numero:
    textColor: "{colors.escuro-texto}"
    typography: "{typography.over}"
  trofeu:
    textColor: "{colors.escuro-textoSuave}"
    size: "22px"
  trofeu-vezes:
    textColor: "{colors.escuro-texto}"
    typography: "{typography.apoio}"
    rounded: "{rounded.balao}"
    height: "1.4rem"
    padding: "0 0.3rem"
  faixa:
    backgroundColor: "{colors.escuro-trilho}"
    rounded: "{rounded.reto}"
    height: "6px"
  faixa-feito:
    backgroundColor: "{colors.escuro-destaque}"
    height: "6px"
  cabeca-numero:
    textColor: "{colors.escuro-texto}"
    typography: "{typography.numero}"
  cabeca-titulo:
    textColor: "{colors.escuro-texto}"
    typography: "{typography.titulo}"
  opcao:
    backgroundColor: "{colors.escuro-fundo}"
    textColor: "{colors.escuro-texto}"
    typography: "{typography.opcao}"
    rounded: "{rounded.reto}"
    padding: "0.75rem 1rem"
    height: "{spacing.toque-minimo}"
  opcao-hover:
    backgroundColor: "{colors.escuro-superficie}"
  opcao-pressed:
    backgroundColor: "{colors.escuro-destaque}"
    textColor: "{colors.escuro-sobreDestaque}"
---

# Design System: 10eFaixa

Registro do sistema **como construído**. A fonte dos tokens é `src/ui/theme/tokens.json`; `src/ui/theme/theme.ts` transforma cada chave em variável CSS (`--cor-*`, `--fonte-*`, `--tipo-*`, `--espaco-*`, `--toque-minimo`). Os nomes aqui são os do `tokens.json`; no frontmatter as cores levam o prefixo do tema (`escuro-`, `claro-`) porque o formato não tem temas. Até agora existe uma única tela construída, a de decisão (`src/ui/screens/Decision.tsx`), e ela força o tema escuro. O tema claro existe nos tokens e é o padrão de `:root`, mas ainda não foi visto em nenhuma tela: trate os valores claros como tokens conferidos por teste de contraste, não como composição validada.

## Overview

**Creative North Star: "A camisa e a braçadeira"**

O número nas costas é a tela. Um numeral gigante (a idade do jogador) ancora o painel como o número de uma camisa, e a braçadeira de capitão é a única cor que se move: ela marca o progresso da carreira e a opção que o polegar escolheu. Todo o resto é chão neutro e tipo claro. O painel fica em grafite sem matiz para nunca disputar com as cores do clube, que só aparecem dentro do escudo estilizado e da pintura da cena.

A densidade é de celular com uma mão: uma decisão por tela, tudo alinhado à esquerda, coluna única de no máximo 30rem, opções encostadas no polegar. O texto que se lê é grande e folgado; o que é placar (número, nome, título, Over) é condensado, pesado e em caixa alta. Não há cartões, sombras de elevação, gradientes nem movimento: a hierarquia vem do tamanho do tipo, de dois tons de cinza e de linhas de 1px.

A composição recusa a folha arredondada com botões em pílula flutuando sobre a imagem. A cena fica em cima, o painel continua o escuro da pintura, e as opções são faixas de largura inteira.

**Key Characteristics:**
- Numeral gigante como âncora da tela (`numero`, 5.5rem, peso 900).
- Chão grafite neutro (`fundo`, `superficie`); as cores de clube vivem só no escudo e na cena.
- Um único destaque, o amarelo da braçadeira (`destaque`), sempre como faixa cheia com tipo marinho por cima.
- Verde e vermelho só nas setas de consequência.
- Faixas de largura inteira separadas por linha de 1px; cantos retos.
- Alvo de toque de 4rem (`toque.minimo`); nenhum texto abaixo de 0.9375rem.
- Sem animação e sem transição nesta tela.

## Colors

Grafite neutro, cal e um amarelo só. A paleta de origem é a do SPEC 7 (`paleta` no `tokens.json`); os temas dão um papel a cada cor e ajustam verde e vermelho para passar em contraste em cada chão. Todo par usado em tela está listado em `contraste` no `tokens.json` e é conferido por teste (4,5:1 para texto, 3:1 para gráfico).

### Primary
- **Amarelo braçadeira** (`destaque`, igual nos dois temas): a parte feita da faixa de progresso e o fundo da opção pressionada. Também é a cor do anel de foco no tema escuro (`foco`), da seleção de texto, de `accent-color` e de `caret-color`.
- **Marinho sobre a braçadeira** (`sobreDestaque`): todo texto, seta e chevron que fica em cima do amarelo. No tema claro o mesmo marinho é o `texto`, o `trilho` e o `foco`.

### Secondary
- **Verde de subida** (`positivo`): só as setas de consequência que sobem. Clareado no tema escuro, escurecido no claro em relação ao verde gramado da paleta.
- **Vermelho de queda** (`negativo`): só as setas de consequência que descem. Mesmo ajuste por tema.

### Neutral
- **Grafite de painel** (`escuro-fundo`): chão da tela com cena e da página inteira em volta dela.
- **Grafite de faixa** (`escuro-superficie`): a faixa do jogador e o hover das opções em aparelho com ponteiro.
- **Cal de campo** (`escuro-texto`, e `claro-fundo`): o tipo no escuro, o chão no claro.
- **Cinza de apoio** (`textoSuave`): posição e clube, rótulos de unidade (ANOS, OVER), linha de temperamento e consequência, troféus, chevron.
- **Cinza de linha** (`linha`): divisores de 1px entre opções, anel do balão de troféus, borda lateral da coluna em telas largas. É decorativo: nunca carrega informação sozinho.
- **Cinza de trilho** (`trilho`): a parte ainda não vivida da faixa de progresso; também a barra de rolagem.
- **Branco de sigla com contorno marinho** (`siglaTexto`, `siglaContorno`): a sigla dentro do escudo, legível sobre qualquer par de cores de clube.

### Named Rules
**A Regra da Braçadeira.** O amarelo só aparece como faixa cheia: progresso feito e opção escolhida (mais o anel de foco no escuro e a seleção de texto). Nunca como cor de texto, ícone ou borda decorativa.

**A Regra do Chão Neutro.** Nenhuma cor de clube sai do escudo ou da cena. O painel é cinza sem matiz justamente para que qualquer par de cores de clube caiba sem briga.

**A Regra do Sinal.** Verde e vermelho pintam só as setas. O nome do campo afetado continua em `textoSuave`, e o sentido também é dito por forma (seta para cima, para baixo, troca) e por texto para leitor de tela; a cor nunca é o único sinal.

## Typography

**Display Font:** Big Shoulders Display Variable (com Arial Narrow, Roboto Condensed, Helvetica Neue, sans-serif), auto-hospedada via `@fontsource-variable/big-shoulders-display`
**Body Font:** Atkinson Hyperlegible, pesos 400 e 700, subconjunto latin (com Verdana, Segoe UI, sans-serif), auto-hospedada via `@fontsource/atkinson-hyperlegible`

**Character:** Placar e narração. A condensada pesada em caixa alta carrega o que se vê de longe (número, nome, título, Over); a Atkinson, larga e inequívoca, carrega tudo o que se lê e se toca.

### Hierarchy
- **Display** (`numero`, 900, 5.5rem, entrelinha 0.8, -0.02em, algarismos tabulares): o numeral gigante da cabeça. Um por tela.
- **Headline** (`over`, 900, 2.25rem, entrelinha 1, -0.01em, tabulares): o número do Over na faixa do jogador.
- **Headline** (`titulo`, 800, 1.875rem, entrelinha 1.02, 0.01em, caixa alta, `text-wrap: balance`): o título do evento, o `h1` da tela.
- **Title** (`nome`, 800, 1.375rem, entrelinha 1.05, 0.01em, caixa alta): o nome do jogador.
- **Title** (`opcao`, Atkinson 700, 1.1875rem, entrelinha 1.2): o rótulo de cada opção, em caixa normal, dizendo o que acontece.
- **Body** (`historia`, 400, 1.125rem, entrelinha 1.45, no máximo 44ch): o texto do evento.
- **Body** (`corpo`, 400, 1.0625rem, entrelinha 1.5): o padrão do `body`.
- **Label** (`apoio`, 400, 0.9375rem, entrelinha 1.3): posição e clube, linha de temperamento e consequência. Em 700 e cor `texto` quando marca "Seu jeito".
- **Label de unidade** (`apoio` em Big Shoulders 700, 0.14em, caixa alta, cor `textoSuave`): só ANOS e OVER, grudados no número que qualificam. O número do balão de troféus usa a mesma face em 800, sem espaçamento.

### Named Rules
**A Regra do Placar.** Big Shoulders só para numerais, nomes e títulos, sempre em peso 700 a 900. Tudo o que é frase vai em Atkinson.

**A Regra do Piso.** `apoio` (0.9375rem) é o menor texto do sistema e o corpo nunca desce de 1rem. Todos os tamanhos em rem, para respeitar o ajuste de fonte do aparelho.

**A Regra da Unidade.** A etiqueta condensada e espaçada só existe colada a um número, como unidade dele. Não vira sobretítulo de seção nem antetítulo de manchete.

## Layout

Coluna única, mobile-first, com largura máxima de 30rem e centrada; a tela ocupa exatamente a altura do aparelho (`100dvh`), sem rolagem no caso normal. De cima para baixo:

1. **Cena**: imagem em largura inteira, altura-base igual a metade da largura da coluna, que encolhe até 7rem em tela baixa para as opções caberem. Corte com `object-fit: cover` e foco em 50% 16%. Os 16% de baixo se dissolvem por máscara para costurar a emenda com o painel.
2. **Painel**: grade de cinco linhas (jogador, faixa de progresso, cabeça, sobra, opções). A sobra de altura fica entre a história e as opções, com mínimo de `espaco.2`; assim as opções sempre encostam embaixo, ao alcance do polegar, acima do `safe-area-inset-bottom`.

O respiro lateral é `espaco.4` (1rem) em tudo. O ritmo vertical usa `espaco.3` dentro das faixas e `espaco.4` no topo da cabeça; pares rótulo-valor ficam a `espaco.2`, e itens de uma mesma linha de consequência a `espaco.4`. Os passos `espaco.5`, `espaco.6` e `espaco.7` existem nos tokens mas ainda não foram usados.

Acima de 40rem de viewport a coluna ganha uma linha de 1px de cada lado (`linha`) e a página em volta acompanha o `fundo` escuro; não há outra mudança de layout.

## Elevation & Depth

Plano. Não há sombra de elevação em lugar nenhum. A profundidade vem de dois tons (`fundo` e `superficie`), de linhas de 1px e da cena que se dissolve no painel por máscara. O único `box-shadow` do sistema é um anel interno de 1px em `linha` no balão de troféus, que faz papel de borda, não de sombra.

### Named Rules
**A Regra do Tom.** Um plano se separa do outro por tom ou por linha de 1px, nunca por sombra projetada nem por desfoque.

## Shapes

Ombros retos. Faixas, opções e a faixa de progresso têm raio 0 e vão de borda a borda da coluna. As divisões são linhas de 1px em cima de cada opção. Há duas formas próprias do mundo: o **escudo** (silhueta de topo reto e ponta em baixo, partido ao meio na vertical) e o **balão de contagem** dos troféus (raio 1rem), o único elemento arredondado. Os ícones são SVG de traço cheio e cantos vivos (setas de consequência, troféu, chevron de ponta quadrada com traço 2.2).

## Components

### Faixa do jogador
Quem decide, sempre visível logo abaixo da cena.
- **Forma:** faixa de largura inteira em `superficie`, raio 0, respiro `espaco.3` por `espaco.4`. Grade de três colunas (escudo, quem, Over) centradas na vertical, com `espaco.3` entre elas.
- **Quem:** nome em `nome` (caixa alta, quebra em qualquer ponto se não couber); abaixo, "posição · clube" em `apoio` e `textoSuave`; abaixo, os troféus.
- **Acessibilidade:** é uma `section` com rótulo próprio.

### Escudo estilizado
Só as duas cores e a sigla do clube, nunca o escudo oficial.
- **Forma:** SVG de 44 por 50, metade esquerda na primeira cor do clube, metade direita na segunda, contorno de 2 na cor do `texto`.
- **Sigla:** Big Shoulders 900, centrada, em `siglaTexto` com contorno de 3 em `siglaContorno` pintado por baixo (`paint-order: stroke`).
- **Acessibilidade:** `role="img"` com nome que diz que o escudo é estilizado.

### Número do Over
- **Estilo:** rótulo de unidade OVER e o número em `over` na mesma linha de base, com `espaco.2` entre eles, à direita da faixa do jogador. É o único número de desempenho que aparece ao jogador; atributos nunca aparecem em número.

### Lista de troféus com balão
- **Estilo:** lista sem marcadores, um mini troféu de 22px em `textoSuave` por competição vencida, da mais pesada para a mais leve, com `espaco.4` entre itens e quebra de linha livre.
- **Balão:** só quando há mais de um título da mesma competição. Canto superior direito do troféu, raio 1rem, 1.4rem de altura, fundo do `fundo` a 74% (deixa ver o troféu por baixo), anel interno de 1px em `linha`, número em Big Shoulders 800 `apoio`, tabular.
- **Acessibilidade:** cada troféu tem nome com a competição e a contagem; o balão é escondido do leitor de tela.

### Braçadeira de progresso
A faixa que diz onde se está na carreira.
- **Forma:** barra de 6px de altura, largura inteira, raio 0, entre a faixa do jogador e a cabeça. Trilho em `trilho`, parte feita em `destaque`, com no mínimo 6px de amarelo mesmo no começo.
- **Acessibilidade:** `role="progressbar"` de 0 a 100, com o texto de valor dizendo a idade.

### Cabeça de numeral gigante
- **Forma:** grade de duas colunas (numeral, título) com `espaco.4` entre elas; a história ocupa a largura inteira na linha de baixo.
- **Numeral:** a idade em `numero`, com o rótulo de unidade ANOS a `espaco.2` abaixo. O par é escondido do leitor de tela, porque a idade já está no texto de valor da braçadeira.
- **Título:** `h1` em `titulo`, centrado na vertical em relação ao numeral.
- **História:** `historia`, no máximo 44ch. É opcional: sem texto, a cabeça fica só com numeral e título.

### Faixas de opção
O único controle da tela; cada uma diz o que acontece.
- **Forma:** botão de largura inteira, altura mínima `toque.minimo` (4rem), raio 0, fundo transparente, linha de 1px em `linha` em cima. Respiro `espaco.3` por `espaco.4`. Texto alinhado à esquerda, chevron em `textoSuave` centrado à direita.
- **Rótulo:** `opcao`, caixa normal.
- **Linha de prévia:** em `apoio` e `textoSuave`, com quebra livre. Primeiro o temperamento ("Jeito: Frio"); quando é o do jogador vira "Seu jeito: ..." em 700 e cor `texto`. Depois cada consequência: nome do campo e setas de 12 por 16 (uma a três conforme a intensidade; para cima em `positivo`, para baixo em `negativo`; a seta dupla de troca fica em `textoSuave`). Sem consequência, o texto "Sem efeito imediato". Nunca números.
- **Hover:** só em aparelho com ponteiro, fundo `superficie`.
- **Foco:** anel de 3px em `foco`, recuado 3px para dentro da faixa.
- **Pressionada / escolhida:** a faixa inteira vira `destaque` com rótulo, prévia, setas e chevron em `sobreDestaque`, na hora, sem transição. O estado escolhido persiste por `aria-pressed`; nele o anel de foco passa a `sobreDestaque`.

### Base de toda tela
- **Foco:** `outline` de 3px em `foco`, afastado 2px, em qualquer elemento focável.
- **Movimento:** `prefers-reduced-motion` zera animações e transições globalmente.
- **Temas:** claro por padrão, escuro pela preferência do aparelho, e `data-tema` força um dos dois em qualquer subárvore. Tela com cena usa `data-tema="escuro"`.

## Do's and Don'ts

### Do:
- **Do** usar as variáveis geradas do `tokens.json` (`--cor-*`, `--tipo-*`, `--espaco-*`, `--toque-minimo`); cor nova entra primeiro no `tokens.json`, com o par registrado em `contraste`.
- **Do** forçar `data-tema="escuro"` em tela com cena, para o painel continuar o escuro da pintura.
- **Do** manter um numeral gigante em `numero` como âncora da tela, com a unidade colada embaixo.
- **Do** fazer de todo controle tocável uma faixa de largura inteira com pelo menos `toque.minimo` de altura e rótulo que diz o que acontece.
- **Do** mostrar consequência por nome do campo, forma da seta e quantidade de setas, com o texto equivalente para leitor de tela.
- **Do** separar planos por `superficie` ou por linha de 1px em `linha`.
- **Do** desenhar clube só como escudo estilizado: duas cores, sigla branca com contorno marinho.

### Don't:
- **Don't** usar `destaque` em texto, ícone ou borda; ele é faixa cheia de progresso ou de escolha.
- **Don't** pintar nada com verde ou vermelho além das setas de consequência.
- **Don't** levar cor de clube para o painel, para os botões ou para o tipo.
- **Don't** usar cartões, sombras projetadas, gradientes de fundo ou botões em pílula; o único arredondado é o balão de contagem dos troféus.
- **Don't** mostrar número de atributo; só o Over aparece em número.
- **Don't** escrever frase em Big Shoulders nem número de placar em Atkinson.
- **Don't** descer texto abaixo de `apoio` (0.9375rem) nem apertar a entrelinha de leitura abaixo de 1.3.
- **Don't** acrescentar animação ou transição: o produto tem um único momento animado, o carimbo do número na abertura, e ele ainda não foi construído.
