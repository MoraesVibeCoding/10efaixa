# Proposta v2.36: 10 visuais prontos na criação

Estado: **aguardando "DE ACORDO" do usuário.** Nada foi implementado e o `SPEC.md` ainda não foi alterado.

## 1. O que muda

Hoje (v2.30 a v2.35) o jogador monta o visual peça por peça: tom de pele, cabelo, cor do cabelo, barba, faixa de cabelo e chuteira, com "Sortear".

Proposta: a tela **"Seu visual"** passa a mostrar **10 personagens prontos**, escolhidos deslizando de lado (as setas ‹ › e a fileira de miniaturas já feitas na T50g). Cada um se chama só **"Visual 1" a "Visual 10"**.

- Saem os grupos de tom de pele, cor do cabelo, barba, faixa e chuteira. Sai o botão "Sortear".
- O visual inicial vem **sorteado pela semente** (como hoje), e o jogador pode trocar.
- **Aparência continua só cosmética:** nenhum visual traz atributo, posição ou temperamento.
- **Sem nomes** de pessoas (reais ou fictícias): só "Visual N".

## 2. Regra de originalidade (CLAUDE.md)

Os 10 visuais são **originais**. Nenhum é baseado no rosto, no penteado característico ou em qualquer traço identificável de uma pessoa real, e nenhum prompt ou arquivo do repositório cita ou descreve um jogador real. O conjunto cobre a diversidade do Brasil por atributos genéricos (idade, tom de pele, formato de rosto, cabelo, barba). Revisão jurídica antes do lançamento, como já previsto.

## 3. Impacto

| Área | Efeito |
|---|---|
| SPEC 6.1 e 6.17 | Visual deixa de ser editável peça por peça; vira escolha entre 10 |
| `src/data/visuais.json` (novo) | Cada visual: id, e as peças da arte provisória (pele, cabelo, cor, barba, faixa) |
| Arte provisória (SVG) | Cada visual vira uma combinação fixa dessas peças, para o jogo funcionar já |
| Arte pintada | Os 10 retratos novos substituem os 6 por corte de cabelo; sem recolor por código |
| Cenas | Hoje há uma variação por cabelo (6); passariam a ser uma por visual (10): **+67% de cenas por tipo**. Alternativa: cenas com o jogador de costas ou à distância |
| Briefing de arte | Some o lote 2 de cabelos, barbas e faixa por ângulo; entram os 10 retratos e as cenas por visual |
| Testes | Criação, `Choices` (grupos de cor saem desta tela) e `look` |

## 4. Os 10 visuais (fichas)

Idade aparente de 18 a 28 anos, expressão sempre calma e confiante, olhar de frente. Cores de cabelo só dentro da paleta do prompt (preto, castanho-escuro, castanho-médio, castanho-claro, grisalho), para não conflitar com as cores-chave de recolor da camisa.

| # | Rosto | Pele | Olhos | Cabelo | Barba |
|---|---|---|---|---|---|
| Visual 1 | oval, queixo médio | clara com tom oliva | castanho-escuros | curto liso, castanho-médio | nenhuma |
| Visual 2 | largo, maçãs marcadas | média-morena | castanho-escuros | curto cacheado, preto | rala |
| Visual 3 | alongado, queixo fino | parda | castanho-escuros | raspado (careca) | cavanhaque |
| Visual 4 | quadrado, mandíbula forte | escura | castanho-escuros | crespo curto, preto | nenhuma |
| Visual 5 | oval, testa alta | muito escura | castanho-escuros | black power médio, preto | cheia e curta |
| Visual 6 | redondo, bochechas cheias | clara | castanho-claros (mel) | longo liso e solto, castanho-claro | nenhuma |
| Visual 7 | triangular, queixo estreito | morena clara | castanho-escuros | cacheado médio, castanho-escuro | bigode fino |
| Visual 8 | largo, queixo marcado | média | castanho-escuros | dreads curtos, preto | cheia |
| Visual 9 | oval, mandíbula suave | parda-escura | castanho-escuros | curto com laterais baixas, preto | cavanhaque rala |
| Visual 10 | quadrado, traços mais maduros (~28) | clara rosada | castanho-escuros | curto liso, castanho-escuro com fios grisalhos | cheia e aparada |

Cada visual também precisa da **peça provisória equivalente** (SVG) para o jogo rodar antes da arte final; isso é só uma combinação de pele, cabelo, cor, barba e faixa que já existem em `avatar.json`.

## 5. Prompt de cada retrato

O corpo do prompt é o **mesmo dos retratos atuais** (`docs/arte/retratos/curto/prompt.md`): estilo pintado semi-realista, camisa magenta lisa, fundo verde-chroma chapado, luz de estúdio, enquadramento 4:5 do busto, e a frase "original fictional character who does not resemble any real person". Muda só o bloco **SUBJECT/FACE/HAIR**. Gere primeiro o **Visual 1**, aprove o estilo e use como referência de estilo (não de rosto) nos demais.

Modelo do bloco que muda (preencher com a linha da tabela):

```
SUBJECT
One young Brazilian football player, about [IDADE] years old, seen from the FRONT, from the waist up, standing straight and facing the camera squarely. It is an official squad portrait. He is an original fictional character who does not resemble any real person.

FACE - unique to this image
- [FORMATO DE ROSTO].
- [TOM DE PELE], even tone, no freckles, no moles, no scars, no tattoos.
- [COR DOS OLHOS] eyes looking straight into the camera, both eyes fully visible.
- Straight, medium-thick dark eyebrows.
- [BARBA: "Clean-shaven: no beard, no moustache, no stubble." ou a barba da ficha].
- Expression: calm and confident, mouth closed, with a very slight smile.
- No glasses, no earrings, no necklace, no headband, no cap.

HAIR
[CABELO da ficha, com comprimento em cm; orelhas visíveis; nada cobrindo a testa abaixo da linha do cabelo, o pescoço ou os ombros].
```

Prompts completos por visual (um arquivo `prompt.md` por pasta, como os atuais) saem **depois da sua aprovação** das fichas.

## 6. Plano (depois do "DE ACORDO")

1. **T50g.2:** SPEC v2.36 (6.1, 6.17, log) e `visuais.json`, com teste de validação (10 visuais, ids únicos, peças existentes em `avatar.json`).
2. **T50g.3:** tela "Seu visual" com o palco e as 10 miniaturas; sorteio inicial pela semente; "Sortear" e os grupos de cor saem; teclado e leitor de tela ("Visual 3 de 10").
3. **Arte:** gerar os prompts completos dos 10 retratos; depois, os das cenas a partir deles.
4. **T50g.4:** verificação no Chromium (claro, escuro, 360×640, 390×844, 1280×800) e a parada ⛳.

## 7. O que preciso de você

1. As 10 fichas servem, ou quer trocar algum (idade, tom, cabelo, barba)?
2. Confirma que **não há ajuste livre** depois da escolha (nem a chuteira)? A chuteira passaria a ser fixa por visual.
3. As cenas por visual (+67%) ficam como estão, ou prefere cenas que não mostram o rosto?
