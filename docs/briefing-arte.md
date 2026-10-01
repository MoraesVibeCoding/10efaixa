# Briefing de arte — 10eFaixa

> Documento para o ilustrador. Mantido pela skill `.claude/skills/10efaixa-arte` (fonte da verdade do formato).
> Versão 2 · 2026-09-30 · Base: SPEC v2.6, seções 6.17, 7 e 11. (v2: orçamento de peso fechado e validador automático disponível — T43.)

## 1. O jogo em 30 segundos

10eFaixa é um simulador de carreira de jogador de futebol brasileiro, jogado no celular (navegador). O jogador cria um atleta fictício e vive a carreira dos 16 anos à aposentadoria: várzea, peneira, clubes, Seleção. **Toda decisão aparece com uma cena ilustrada**, montada pelo código a partir das suas peças: cenário + o avatar do jogador numa pose + companheiros + detalhes (taça, bola, placar, torcida).

O sonho que dá nome ao jogo: vestir a **camisa 10** e usar a **faixa de capitão** da Seleção.

## 2. Regras que não podem ser quebradas

- **Arte 100% original.** Nenhum rosto, penteado característico, tatuagem, comemoração marca registrada ou visual reconhecível de pessoa real (jogador, técnico, narrador, celebridade).
- **Sem escudos, logos ou marcas.** Nada de escudo de clube, CBF, FIFA, patrocinador ou fornecedor de material. Uniformes só com cores e padrões genéricos.
- **Aparência não é estereótipo.** Tons de pele, cabelos e barbas são escolhas visuais do jogador e nunca aparecem associados a papéis, funções ou "tipos" de personagem.
- **Contrato:** trabalho sob contrato escrito com **cessão dos direitos patrimoniais** para uso comercial, incluindo versões futuras (Fase 2: anúncios; Fase 3: app nativo).

## 3. Estilo

- **Vetorial chapado (flat)**, formas simples, poucas sombras (no máximo 1 tom de sombra por cor), sem gradientes nem texturas raster.
- **Legível em tela de celular**: a cena aparece com ~360 px de largura. Silhuetas claras, nada de detalhe que some nesse tamanho.
- **Tom:** caloroso, brasileiro, com humor leve. Referências de clima: campinho de terra, arquibancada de concreto, vestiário com azulejo, rádio de pilha.
- **Paleta do jogo** (seção 7 do SPEC) como base de cenários e detalhes:

| Nome | Hex | Uso na arte |
|---|---|---|
| Cal de campo | `#F2F4EF` | Fundos claros, linhas do campo |
| Marinho de vestiário | `#14213D` | Contornos, sombras, base escura |
| Amarelo braçadeira | `#FFC21A` | Destaque único (faixa de capitão, taça) |
| Verde gramado | `#1E7B4F` | Gramado |
| Vermelho cartão | `#D62839` | Só cartão, lesão, alerta |
| Cinza de linha | `#C9CFC6` | Concreto, divisores |

Tons intermediários extras para cenários (céu, terra, madeira, pele de torcida ao fundo etc.) entram numa **lista de cores fixas** combinada na primeira entrega e congelada depois. Qualquer cor fora da paleta + lista fixa + cores-chave (abaixo) é recusada pelo validador.

## 4. Como o código monta a arte (o que muda o seu trabalho)

### 4.1 Recolor por cores-chave

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

### 4.2 Boneco-base, altura e compleição por proporção

- Um único **boneco-base** de referência: 1,80 m, compleição atlética, de frente, num `viewBox` de **400 × 800**, pés na linha `y = 780`, centro em `x = 200`.
- O código estica o boneco para a **altura** (cerca de 1,62 a 2,00 m) e alarga ou afina tronco e membros para a **compleição** (franzino, atlético, forte). Por isso cada parte do corpo é um **grupo separado** com o ponto de articulação marcado (seção 5.2). Nada de desenhar versões alta/baixa/forte.

### 4.3 Montagem da cena

Cenários trazem **lugares marcados** (`slot`) onde o código encaixa o avatar e os companheiros. Companheiros usam o mesmo boneco, com outras aparências sorteadas.

## 5. Formato técnico das entregas

### 5.1 Arquivos

- **SVG** puro (sem imagens raster embutidas, sem fontes, sem scripts, sem `<style>` com regras externas). Texto, se houver, convertido em contorno.
- Exportar com **IDs preservados** e sem minificar nomes (no Illustrator: "Propriedades de objeto: Identificadores de camada").
- **Nome do arquivo:** `categoria__peca__variante__angulo.svg`, tudo minúsculo, sem acento, palavras com hífen. Partes que não se aplicam são omitidas.
  - Exemplos: `cabelo__black-power__frente.svg`, `cabelo__cacheado-entradas__tres-quartos.svg`, `pose__correndo.svg`, `cenario__vestiario.svg`, `detalhe__taca.svg`.
  - Ângulos: `frente`, `perfil`, `tres-quartos`.

### 5.2 Camadas (grupos `<g>` com `id`)

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

### 5.3 Orçamento de peso

| Tipo | Máximo (SVG sem compressão) |
|---|---|
| Peça de cabeça/acessório | 15 KB |
| Pose | 30 KB |
| Detalhe | 20 KB |
| Cenário | 80 KB |
| Uniforme (padrão) | 15 KB |
| Comemoração | 30 KB |

As regras completas que o validador aplica estão em `src/art/format.json`.

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

O grisalho é feito pelo código (mistura a cor do cabelo com cinza), não precisa de desenho.

### 6.3 Uniforme (padrões sobre a camisa)

`lisa`, `listras-verticais`, `faixa-diagonal`, `metade`, `gola-contraste` — como camadas extras sobre o tronco de cada pose, só com cores-chave primária/secundária. Número nas costas é escrito pelo código.

### 6.4 Comemorações (braços/corpo sobre a pose 5)

`aviaozinho`, `dancinha`, `punho-cerrado`, `coracao-maos`, `cambalhota`, `aponta-ceu`, `beija-alianca`, `chuteira-telefone` — genéricas, nenhuma marca registrada de jogador.

### 6.5 Cenários (25)

várzea (campinho de terra) · rua do bairro (olheiro) · peneira · treino · vestiário · banco de reservas · reunião com a comissão · sala do empresário · assinatura de contrato · aeroporto · estádio · gol · cabeçada · pênalti · título · convocação · hospital · fisioterapia · festa · entrevista/redes sociais · clássico · vaia · Copa · casa da família · despedida

### 6.6 Detalhes

taça (estadual, nacional, continental, Copa — formas genéricas) · bola · placar · faixa de capitão (amarelo braçadeira) · bandeirão de torcida · microfone · celular · maca · contrato e caneta · mala.

## 7. Entregas em lotes

| Lote | Conteúdo | Objetivo |
|---|---|---|
| 1 | Boneco-base, poses 1 e 2, rosto + 2 cabelos + 1 barba nos 3 ângulos, cenário vestiário | Validar o fluxo: recolor, proporção e montagem funcionando no jogo |
| 2 | Poses restantes, todas as cabeças | Avatar completo |
| 3 | Cenários e detalhes | Todas as cenas |
| 4 | Ajustes finais | Revisão no jogo antes do lançamento |

Cada lote passa no **validador automático** (`npm run art:check -- <pasta>`: camadas, nomes, cores-chave, elementos proibidos, peso) antes da revisão visual. Você recebe o relatório com o que corrigir, arquivo por arquivo.

## 8. Checklist por arquivo

- [ ] Nome no padrão `categoria__peca__variante__angulo.svg`
- [ ] Grupos com os `id` da seção 5.2, na ordem certa
- [ ] Áreas personalizáveis só com as cores-chave exatas
- [ ] Demais cores só da paleta + lista fixa
- [ ] Sem raster, fonte, script ou gradiente
- [ ] Dentro do orçamento de peso
- [ ] Nada que lembre pessoa, clube ou marca real
