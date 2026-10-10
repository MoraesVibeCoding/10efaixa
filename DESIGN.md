---
name: 10eFaixa
description: Simulador de carreira do futebol brasileiro; o jogador é uma figurinha de álbum, a cena ocupa a tela e o vidro só aparece por cima dela.
colors:
  claro-fundo: "#E8F6EC"
  claro-superficie: "#FFFFFF"
  claro-texto: "#091A11"
  claro-textoSuave: "#43534A"
  claro-linha: "#6E8A79"
  claro-trilho: "#CFE3D5"
  claro-destaque: "#006731"
  claro-sobreDestaque: "#FFFFFF"
  claro-positivo: "#006731"
  claro-negativo: "#B81E2E"
  claro-foco: "#006731"
  claro-siglaTexto: "#FFFFFF"
  claro-siglaContorno: "#091A11"
  escuro-fundo: "#212222"
  escuro-superficie: "#2C2D2D"
  escuro-texto: "#F2F4EF"
  escuro-textoSuave: "#C4C6C6"
  escuro-linha: "#8A8C8C"
  escuro-trilho: "#505151"
  escuro-destaque: "#4CC38A"
  escuro-sobreDestaque: "#10261B"
  escuro-positivo: "#63D7A0"
  escuro-negativo: "#FF8E97"
  escuro-foco: "#FFC21A"
  escuro-siglaTexto: "#FFFFFF"
  escuro-siglaContorno: "#14213D"
  claro-vidro: "#F8F5EE"  # alfa 0.88
  claro-scrim: "#14213D"  # alfa 0.58
  escuro-vidro: "#2C2D2D"  # alfa 0.92
  escuro-scrim: "#000000"  # alfa 0.62
  medalha-bronze: "#986A42"
  medalha-prata: "#E3E7EB"
  medalha-ouro: "#FFD966"
  medalha-platina: "#CDE6EB"
  medalha-esmeralda: "#1F7F54"
  medalha-diamante: "#7448E0"
typography:
  over:
    fontFamily: "'Oswald Variable', 'Arial Narrow', 'Roboto Condensed', sans-serif"
    fontSize: "3rem"
    fontWeight: 900
    lineHeight: 1
  titulo:
    fontFamily: "'Oswald Variable', 'Arial Narrow', 'Roboto Condensed', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 900
    lineHeight: 1
  nome:
    fontFamily: "'Oswald Variable', 'Arial Narrow', 'Roboto Condensed', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 900
    lineHeight: 1.05
  opcao:
    fontFamily: "'Archivo Variable', 'Segoe UI', 'Helvetica Neue', sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 700
    lineHeight: 1.2
  historia:
    fontFamily: "'Archivo Variable', 'Segoe UI', 'Helvetica Neue', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.4
  corpo:
    fontFamily: "'Archivo Variable', 'Segoe UI', 'Helvetica Neue', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  apoio:
    fontFamily: "'Archivo Variable', 'Segoe UI', 'Helvetica Neue', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.3
  miudo:
    fontFamily: "'Archivo Variable', 'Segoe UI', 'Helvetica Neue', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.3
  rotulo:
    fontFamily: "'Oswald Variable', 'Arial Narrow', 'Roboto Condensed', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "0.01em"
rounded:
  raio: "4px"
  cartao: "0.75rem"
  etiqueta: "0.5rem"
  pilula: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  toque-minimo: "4rem"
  toque-compacto: "3rem"
components:
  vidro:
    backgroundColor: "{colors.claro-vidro}"
    backdropFilter: "blur(14px) saturate(1.2)"
    border: "1px solid"
    rounded: "{rounded.cartao}"
  figurinha-moldura:
    backgroundImage: "moldura da medalha da faixa de overall"
    rounded: "{rounded.cartao}"
  opcao:
    backgroundColor: "{colors.claro-superficie}"
    textColor: "{colors.claro-texto}"
    typography: "{typography.opcao}"
    rounded: "{rounded.raio}"
    height: "{spacing.toque-compacto}"
  opcao-marcada:
    backgroundColor: "{colors.claro-destaque}"
    textColor: "{colors.claro-sobreDestaque}"
  confirmar:
    backgroundColor: "{colors.claro-texto}"
    textColor: "{colors.claro-superficie}"
    rounded: "{rounded.pilula}"
    height: "{spacing.toque-compacto}"
  selo:
    border: "1px solid {colors.claro-linha}"
    rounded: "{rounded.pilula}"
    typography: "{typography.apoio}"
---

# Design System: 10eFaixa

> **Direção nova aprovada (2026-10-10, v2.81 "Álbum").** Este documento ainda descreve as telas construídas (v2.34–v2.80). A direção aprovada, em implementação em 4 PRs, está no `SPEC.md` seção 7 ("Álbum"): capa e contracapa em verde-noite, páginas de papel creme, **nada inclinado**, card pequeno do jogador com a etiqueta "Carreira ›", cena como foto na página (o vidro sai), propostas e resumo como cards sobre a história, cards grandes de início e fim em frente e verso, e **paleta sem azul** (tinta `#0F2A1C`, verde-escuro `#0B4A2A`, verde-noite `#0B2A1B`, ouro `#B08D57`). O documento é regerado a cada PR do Álbum. **PR 1 feito:** tokens sem azul (fundo papel `#EEE9DF`, texto `#0F2A1C`, suave `#4B5B51`, linha `#6F7F72`, trilho `#DCD5C6`, scrim verde-noite), card pequeno do jogador (`.card-jogador`) com a etiqueta "Carreira ›" (`.card-jogador__carreira`, verde-escuro), cena em foto (`.decisao__foto`, `CenaPintada foto`), carimbo reto do resultado (`.decisao__carimbo`) e a gaveta com os números da carreira (`.gaveta__numeros`). As seções abaixo sobre vidro na decisão e caixa do topo ficam desatualizadas até a regeração completa no último PR do Álbum.
>
> **Atualização (2026-10-10, v2.73).** Frontmatter refeito do `tokens.json`: tema claro em verde gramado (`#006731`) sobre menta (`#E8F6EC`) e tinta `#091A11`; Oswald (display) desde a v2.46; texto em Archivo desde a v2.76 (antes Inter). Regras novas: **um só botão principal** (verde cheio, Oswald em caixa alta, pílula; a abertura mantém o amarelo da marca), **nenhum texto abaixo de 14 px** (teste em `src/ui/tipografia.test.ts`), cartão do WhatsApp com texto ≥ 30 px no desenho de 1080 (`cartao.textoMin`) e movimento por frequência de uso (v2.71–v2.72: o que se repete a cada decisão é curto e sem rebote; os momentos raros — palco do título, revelação, cartão — podem ser especiais; saídas em 150 ms; tudo some com `prefers-reduced-motion`). O tema escuro está fora da v1.
>
> **Estado deste documento (2026-10-06, T49j).** Regenerado com as telas construídas na direção **v2.34 "Álbum com vidro"** e na v2.37 (uniforme na figurinha). O frontmatter é gerado do `src/ui/theme/tokens.json`; se os dois divergirem, vale o `tokens.json`. Telas cobertas: criação (4 passos), revelação do jogador, decisão (variação B), gaveta "Minha carreira" e resultado da escolha. Abertura, ritmo, mercado, torneio e fim de carreira ainda não têm o visual novo.

Os tokens viram variáveis CSS em `src/ui/theme/theme.ts` (`--cor-*`, `--fonte-*`, `--tipo-*`, `--espaco-*`, `--toque-*`, `--forma-*`, `--vidro-*`, `--medalha-*`). As cores levam o prefixo do tema no frontmatter (`claro-`, `escuro-`) porque o formato não tem temas. Desde a v2.75 o jogo é sempre claro (o modo escuro do aparelho não muda nada); só a abertura força o escuro da marca (`data-tema="escuro"`).

## Overview

**Creative North Star: "A figurinha no álbum"**

O jogador é uma figurinha: retrato pintado, número, Over na moeda da faixa e moldura no metal dessa faixa, do bronze ao diamante. A carreira é o álbum sendo preenchido. Na decisão, a cena pintada ocupa a tela inteira e o que se lê fica por cima dela, em vidro fosco: a caixa do jogador no topo e a faixa da decisão embaixo. Fora dessas sobreposições, as superfícies são papel creme sólido com borda fina e sombra suave.

A densidade é de celular com uma mão: uma decisão por tela, opções de uma linha encostadas no polegar, nada rola a partir de 390×844. O que é placar (Over, nome, título) é condensado e pesado; o que se lê é Archivo (v2.76), grande e folgado; o que alguém diz vai em itálico.

**Key Characteristics:**
- Figurinha com moldura por faixa de overall (`bands.json` → `medalha` nos tokens).
- Cena inteira na decisão; vidro só em sobreposições, no máximo 2 camadas por tela.
- Papel creme e tinta marinho; verde de gramado como única cor de ação.
- Uniforme na figurinha: padrão tradicional e cores do clube (ou da seleção, nos eventos da Copa), sem escudo, patrocinador ou marca.
- Nenhum número de atributo antes do cartão final; só o Over aparece em número.
- Um momento animado construído: a figurinha "colando" na revelação, desligada com `prefers-reduced-motion`. O segundo aprovado (número "carimbando" na abertura) espera a tela de abertura.

## Colors

Papel, tinta e gramado. Todo par de texto usado em tela está em `contraste` no `tokens.json` e é conferido por teste (4,5:1 texto, 3:1 gráfico); o texto sobre vidro é conferido no pior fundo, com preto e com branco por trás, nos dois temas.

### Primary
- **Verde gramado** (`destaque`): opção marcada, botão "Avançar", faixa de progresso feita, barras das faixas de atributo. Nunca é cor de texto sobre o papel (dá 4,34:1); texto verde usa `positivo`.
- **Marinho tinta** (`texto`, `linha`): todo o texto, as bordas finas e o botão "Confirmar escolha" / "Começar carreira" (marinho cheio com texto creme).

### Secondary
- **Verde de ganho** (`positivo`) e **vermelho de custo** (`negativo`): "Você ganha / Em troca", setas de consequência, risco por escrito e o medidor de risco (4 segmentos, vermelho).
- **Metais de raridade** (`medalha`): bronze, prata, ouro, platina, esmeralda e diamante. Só em moldura, moeda do Over e no selo dourado "Diamante bruto". Nunca em texto corrido.

### Neutral
- **Papel** (`fundo`), **papel claro** (`superficie`), **texto suave** (`textoSuave`), **trilho** (`trilho`).
- **Vidro** (`vidro.claro`, `vidro.escuro`): o papel com alfa 0,88 (claro) e 0,92 (escuro), borda clara translúcida, blur 14px e saturação 1,2. **Scrim** (`vidro.*.scrim`): o fundo escurecido atrás do modal de revelação.

### Named Rules
**A Regra do Vidro.** Vidro só por cima de outra coisa. Construído: caixa do jogador e faixa de baixo da decisão, modal da revelação. A prévia fixa da criação, prevista na v2.34, não existe desde a v2.35 (a figurinha ficou no passo "quem é ele"). Nunca mais de 2 camadas por tela (teste em `glass.test.ts`). Sem `backdrop-filter`, ou com `prefers-reduced-transparency`, a superfície volta a ser papel sólido.

**A Regra do Uniforme.** Cor de clube só na camisa da figurinha, nas faixas dos ombros e no emblema. A camisa é pintada por código (máscara da camisa em cinza, multiplicada pelo padrão e pelas cores de `kits.json`); nunca escudo, patrocinador, marca de fornecedor ou modelo da temporada.

**A Regra do Sinal.** Verde e vermelho nunca são o único sinal: o sentido também vem por forma (setas, segmentos) e por texto para leitor de tela.

## Typography

**Display:** Oswald Variable (Over, títulos, nomes, rótulos e botões), auto-hospedada (v2.46). **Texto:** Archivo Variable 400 e 700 (v2.76; antes Inter), com itálico verdadeiro para falas (v2.77). Piso de 14 px no degrau `miudo`. Fallbacks no `tokens.json`.

### Hierarchy
- **Over** (3rem, 900): o número grande na caixa do jogador. O único número de atributo em tela.
- **Título** (1.75rem, 900, caixa alta): título do evento, "Nasce um jogador", "Minha carreira".
- **Nome** (1.5rem, 900): nome do jogador e títulos de passo da criação.
- **Opção** (1.1875rem, 700): texto das opções e dos botões.
- **História** (1.125rem, 400, entrelinha 1.4): o texto do evento.
- **Corpo** (1.0625rem) e **apoio** (0.9375rem): nunca abaixo disso.
- **Rótulo** (display 0.9375rem, 800): rótulos pequenos em caixa normal ("Você ganha", "Como ele começa"); a caixa alta fica para títulos.

## Layout

- Coluna de até 30rem no celular; a partir de 64rem, duas colunas (criação: "quem é ele" e "seu visual" lado a lado; revelação: figurinha e selo | atributos; decisão: caixa do jogador e álbum | faixa com as três opções lado a lado).
- **Sem rolagem a partir de 390×844** em todas as telas do fluxo; medido nos 25 eventos (390×844 e 430×932) e na revelação no pior caso (diamante + nome de 24 letras). Em 360×640 a página **rola, nunca corta**: a cena fica fixa ao fundo e gaveta e resultado ficam presos à tela.
- Alvos de toque: 4rem (`toque.minimo`) em botões grandes; 3rem (`toque.compacto`, 48 px) nas faixas da criação e nas opções de uma linha da decisão; sempre acima dos 44 px do WCAG.

## Elevation & Depth

Papel sólido com **borda fina (1px)** e **sombra suave** (`forma.sombraSuave`). A borda grossa e a sombra dura da v2.19 saíram. Profundidade de verdade só no vidro (blur da cena por trás) e no scrim da revelação.

## Shapes

Raio de 4px nas caixas e opções, 0.75rem em cartões (figurinha, palco do avatar, vidro), pílula nos selos e nos botões principais.

## Components

### Figurinha
Retrato pintado do visual (10 visuais prontos), número, nome na tarja e, com overall, a moldura do metal da faixa e a moeda do Over. A camisa do retrato vem em cinza e recebe o uniforme por máscara e `mix-blend-mode: multiply` (componente `Camisa`); o prop `uniforme` troca o clube pela seleção nos eventos da Copa, mantendo emblema e "Meia do Flamengo".

### Caixa do jogador (decisão, vidro)
Figurinha pequena (botão que abre "Minha carreira"), nome, posição e clube com emblema, o Over grande e os selos: idade, papel no elenco, salário do mês, valor de mercado e quantos títulos.

### Faixa da decisão (vidro)
Título, texto, três opções de uma linha com o medidor de risco à direita, o detalhe só da marcada (risco e tempo fora por escrito, "Você ganha / Em troca") e **Confirmar escolha**. No ritmo Normal tocar marca e confirmar decide; no Rápido tocar já decide. O leitor de tela ouve no botão de cada opção as consequências, o risco e o tempo fora.

### Revelação do jogador
`<dialog>` modal de vidro sobre o scrim: título, nome no subtítulo, figurinha "colando", selo dourado "Diamante bruto" (só para o diamante), os dez atributos em faixa (palavra e barra de seis degraus, componente `Niveis`) e "Começar carreira" com o foco inicial. Esc também segue.

### Gaveta "Minha carreira" e resultado
A gaveta sobe do pé da tela com atributos em faixa, títulos com troféu e trajetória com emblemas; o resultado é um cartão pequeno com o ganho e a perda reais. Os dois deixam o resto da tela inerte e fecham com Esc.

### Criação
Quatro passos com barra de progresso: "quem é ele" (figurinha ao vivo), "seu visual" (avatar-herói com setas e miniaturas), "em campo e cabeça" (campinho, faixas de pílula, cartões de estilo) e tipo de início (cartões).

## Do's and Don'ts

### Do:
- Ler valores de cor, tipo e espaço só dos tokens.
- Conferir contraste por teste ao criar um par de texto novo, inclusive sobre vidro.
- Medir no Chromium a rolagem em 390×844 e o corte em 360×640 ao mexer em altura de tela.
- Usar o `uniforme` da figurinha para mudar a camisa, nunca trocar o `clubId`.

### Don't:
- Mostrar número de atributo (só o Over), potencial ou valores internos antes do cartão final.
- Pôr uma terceira camada de vidro na tela ou vidro sobre papel liso.
- Usar o verde de destaque como cor de texto sobre o papel.
- Desenhar escudo oficial, patrocinador, marca de fornecedor ou modelo da temporada na camisa.
- Animar fora dos dois momentos aprovados (colar e carimbar), ou animar com `prefers-reduced-motion`.
