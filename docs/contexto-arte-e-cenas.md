# 10eFaixa — contexto do sistema de arte, cenas, visuais e uniformes

Documento para quem não conhece o projeto (por exemplo, um engenheiro de IA ou de imagem) e vai ajudar a achar uma forma melhor de produzir as imagens.
Escrito em 2026-10-14 a partir do repositório `moraesvibecoding/10efaixa` (branch `feat/visuais-11-20`). Onde algo é uma estimativa ou uma suspeita, está marcado.

---

## 0. Resumo em 12 linhas

- **O jogo:** simulador de carreira do futebol brasileiro, no navegador, mobile-first, da várzea à aposentadoria. A cada decisão da carreira aparece uma **cena pintada** ao fundo e, na criação do jogador, um **retrato** escolhido entre alguns "visuais".
- **A arte é pintada por IA** (hoje Nano Banana 2 / Gemini, de forma manual, uma imagem por vez, pelo dono do projeto) e **personalizada por código** (cor da camisa e do calção do clube, número). Pele e cor do cabelo ainda não são personalizadas por código nas cenas.
- **Hoje:** 21 cenas × 6 cortes de cabelo = **126 imagens** em produção; 10 retratos de visuais no jogo e 10 novos prontos (**20 retratos**).
- **O problema:** o jogador pode ter muitas aparências e jogar em qualquer um de **524 clubes**; a conta ingênua dá **centenas de milhares de imagens**. Precisamos de um método em que o conjunto pintado seja pequeno e o resto saia por código ou por uma ferramenta confiável.
- **O que já provamos em protótipo (Python, fora do jogo):** trocar o **tom de pele** por máscara + recolor (4 tons funcionam) e **vestir o uniforme de qualquer clube da Série A** usando uma imagem plana da camisa e do calção como textura, em 3 cenas diferentes.
- **O que está difícil ou sem solução ainda:** o **formato do cabelo** (precisa ser pintado), a **consistência do personagem** entre cenas, **meiões**, detalhes laterais do calção, mangas, e a **qualidade de acabamento** das imagens (queremos que fiquem "realmente boas", não só funcionais).
- **Pergunta para os amigos:** existe uma pipeline melhor do que "gerar à mão e recolorir por código"? Veja a seção 8 (ideias) e a seção 9 (perguntas).

---

## 1. O jogo e onde a arte aparece

| Onde | O que aparece | Arte usada |
|---|---|---|
| Criação do jogador ("Quem é você") | Escolha de **visual** (aparência) entre os prontos; biotipo; origem | Retrato de busto, de frente, por visual (`src/assets/visuais/visual-NN.webp`) |
| Cada decisão da carreira (90 decisões hoje) | Fundo da tela: jogador **de costas** numa situação (vestiário, estádio, treino…), com painéis de interface por cima da metade de baixo | **Cena pintada** (`src/assets/cenas/<cena>/<corte>.webp` + 2 máscaras) |
| Cartão final / figurinhas / álbum | Retrato e dados do jogador, resumo da carreira | Retrato + peças em SVG provisórias; cartões "over" por faixa (bronze a diamante) |
| Clubes | Emblema | Emblemas originais em `src/assets/emblemas` (os enviados pelo usuário entram como estão, com revisão jurídica pendente) ou gerados pelo código |
| Prêmios e competições | Troféus | `src/assets/trofeus/*.webp` |

O jogador da carreira é **sempre fictício**. A aparência (pele, cabelo, barba) é **só cosmética** e nunca muda atributos ou eventos (regra do projeto).

---

## 2. Restrições que não podem ser quebradas

Vêm de `CLAUDE.md`, `SPEC.md` (seção 6.17, v2.12, v2.26, v2.86) e `docs/briefing-arte.md`.

1. **Nada de pessoa real.** Nenhum rosto, penteado-assinatura, tatuagem ou visual reconhecível de um jogador real. Os estilos de cabelo são **famílias de estilo** (degradê alto, rastas, tranças…), nunca a combinação que identifica alguém. Nenhum nome de jogador em prompt ou arquivo. (No Brasil, o uso de imagem de atleta em videogame sem cessão já foi considerado ilícito: art. 20 do Código Civil. Não é parecer jurídico.)
2. **Sem escudos oficiais, logos, patrocínio, marca de fornecedor ou texto na imagem.** Uniforme só com cores e padrão genérico. *(Atenção: ver a seção 5.4. O protótipo de uniformes usa desenhos que repetem camisas reais. Isso precisa de revisão jurídica antes de ir ao público.)*
3. **Nomes descritivos** para competições e prêmios, nunca oficiais.
4. **Acessibilidade WCAG 2.1 AA**: toda cena tem texto alternativo, contraste, `prefers-reduced-motion`.
5. **Mobile primeiro.** A cena aparece com cerca de 360 px de largura. Silhuetas claras; detalhe miúdo some. **Os 40% de baixo da imagem são calmos e escuros** porque painéis entram por cima.
6. **Arte final pintada por IA** (decisão do usuário). Estilo: ilustração semi-realista pintada, luz suave, textura leve de pincel, contorno fino, nem vetor chapado, nem foto, nem cartoon.
7. **Uso comercial:** só ferramentas e planos cujos termos permitam. O briefing prevê registrar cada peça em `docs/arte-registro.csv` (arquivo, ferramenta, plano, data, prompt); esse arquivo ainda não existe no repositório.
8. **Revisão jurídica antes do lançamento público** (emblemas, visuais, uniformes).

---

## 3. Como funciona hoje

### 3.1 Cenas (o coração do sistema)

**Ideia:** uma cena é uma pintura em que o jogador aparece **de costas**. O rosto nunca aparece, então só importam cabelo, pele do pescoço, braços e pernas, camisa, calção e meiões.

**Camadas no navegador** (`src/ui/screens/CenaPintada.tsx`, `src/ui/screens/cenaArte.ts`):

```
┌ pintura (1080×1341 WebP, uniforme em CINZA) ───────────────┐
│  + camada da camisa:  cor/padrão do clube × máscara camisa │  CSS multiply
│  + camada do calção:  cor do clube       × máscara calção  │  CSS multiply
│  + número nas costas (desligado por ora)                   │
└─────────────────────────────────────────────────────────────┘
```

- A pintura guarda a camisa e o calção **em cinza claro**; o código multiplica a cor do clube por cima, recortada pelas **máscaras de alfa** (`<corte>-camisa.webp`, `<corte>-calcao.webp`, 540×670). A luz e as dobras da pintura sobrevivem.
- `src/data/kits.json` guarda por clube: `padrao` (um de 7: `lisa`, `listras-verticais`, `listras-finas`, `faixas-horizontais`, `listras-diagonais`, `faixa-diagonal`, `faixa-no-peito`), `camisa` (1 a 3 cores), `detalhe`, `calcao`, `meiao`. O padrão vira um `repeating-linear-gradient` em CSS (`src/art/kits.ts`). **Limite:** faixas de largura fixa em % do quadro, não da camisa; sem desenho exclusivo; um clube sem cadastro usa camisa lisa nas cores de `clubs.json`.
- `src/data/cenasArte.json`: para cada cena e corte, tamanho, se há calção, e onde cai o número. `src/data/cenaFoco.json`: altura do ponto focal (a cabeça) por cena, para o recorte em foto/álbum.
- **Escolha do arquivo:** `cutForVisual(visual)` lê o `hairStyle` do visual (`visuais.json`) e mapeia para um de **6 cortes** (`cortes.json`: `curto`, `cacheado-medio`, `liso-medio`, `cacheado-grande`, `liso-grande`, `careca`). Ou seja, **hoje a cena depende só do cabelo**, não do visual inteiro.
- Cada arquivo só é baixado quando a cena aparece (`import.meta.glob`). Hoje `src/assets/cenas` pesa 9,5 MB para 126 imagens (+ máscaras).

**Catálogo:** 39 cenas planejadas (ver `docs/lista-de-cenas.md`): **21 no jogo**, **18 só com prompt**. As 90 decisões usam 20 das 21 cenas; estádio (20), vestiário (13) e treino (9) concentram 47%, o que cansa. A auditoria (`docs/auditoria-cenas.md`) propõe mudar 24 decisões para as cenas novas.

**Como uma cena é feita hoje** (manual + código):
1. `docs/arte/gerar-lotes-3-5.py` (e lotes 6, 7) escreve **prompts em inglês** por cena e por corte. Cada prompt traz: estilo, cenário, jogador de costas, roupa, **plano de cores de troca**, composição (jogador no centro, 60% de cima; 40% de baixo escuro e vazio) e uma lista "must not appear" (texto, logos, escudos, rosto, pessoa real).
2. **Plano de cores-chave** (para o código achar o que recolorir): camisa **magenta** #FF00FF, calção e meiões **ciano** #00FFFF, chuteira preta, torcida e bandeiras em cinza claro, nada de roxo/rosa/neon fora do kit. Retratos usam fundo **verde chapado** #00B140.
3. O dono gera cada imagem no **Gemini (Nano Banana 2)**, numa conversa nova, na maior resolução (alvo 1856×2304, formato 4:5). Opcionalmente anexa uma cena aprovada como referência de estilo e cabelo.
4. `docs/arte/processar_cenas.py` (e os outros scripts) trocam o magenta e o ciano por cinza com a mesma luz, gravam as máscaras e salvam WebP.

### 3.2 Visuais (retratos de criação)

- `src/data/visuais.json`: cada visual tem `look` = `{skin t1..t10, hairStyle, hairColor, beard, headband, boots}`. O nome na tela é só "Visual N". Hoje **10 visuais no jogo** (01 a 10), mais **10 retratos novos prontos** (11 a 20) ainda **fora** do jogo (falta gravar em `src/assets`, `visuais.json`, e as peças SVG de degradê alto, coque e tranças).
- **Conjunto de 20** (decidido em 2026-10-13/14): pele **branca 6, parda 8, negra 6**; cabelo **curto 10, médio 6, longo 4**; **sem acessórios** (as faixas de cabelo saíram da ficha dos visuais 11, 14, 17 e 18; os retratos já gerados ainda mostram a faixa). Tabela completa em `docs/proposta-mais-visuais.md`.
- **Retrato:** busto da cintura para cima, de frente, camisa magenta, fundo verde chapado, olhos castanho-escuros (outras cores conflitam com as cores-chave). Gerados em **928×1152** (provisório; o ideal é 1856×2304).
- `docs/arte/processar_visuais.py`: remove o fundo verde com transparência sem franja, reenquadra em 4:5 (cabeça a 10% do topo), troca a camisa magenta por cinza e grava a máscara. `docs/arte/conferir-visuais.py` confere tamanho, margens, topo da cabeça e cantos. Testamos que cabelo **platinado, loiro e ruivo** passam pelo pipeline sem vazar na camisa ou no fundo.
- **Peças provisórias em SVG** (`src/art/*`, `src/assets/art/provisoria`): para onde o jogo ainda monta o busto por código, com um validador próprio (`npm run art:check`) e cores-chave por peça (pele, cabelo, uniforme 1 e 2, chuteira, acessório).

### 3.3 Uniformes dos clubes

- **524 clubes** no total: Série A 20, B 20, C 20, D 96, grandes ligas europeias 114, América do Sul 77, demais 177.
- `kits.json` cobre os **20 da Série A** (padrão e cores, conferidos por imagem de referência do usuário em 2026-10-01); os outros usam camisa lisa nas cores do emblema.
- O uniforme é **sempre aplicado por código** sobre a cena cinza. Não existe imagem de uniforme por clube dentro do jogo.

---

## 4. O que testamos nesta sessão (protótipos em Python, fora do jogo)

Todos são arquivos temporários; nada disso está no repositório do jogo ainda (os scripts de prova estão em `/tmp` da sessão e podem ser refeitos).

### 4.1 Recolor de pele por código
- Máscara de pele automática por cor (matiz, saturação, valor) + componentes conexos perto do centro; recolor mantendo a luminância relativa (a pintura é de pele marrom, o alvo é um tom).
- **Funciona** em braços, pernas e cabeça raspada nos 4 tons testados (`#F1C8A5`, `#BC8458`, `#8D5A38`, `#5A351F`), sem tocar companheiros, uniforme, grama e céu.
- **Defeitos:** parte do cabelo curto marrom entra na máscara (cabelo e pele têm cor parecida); a máscara das pernas pega só trechos; a pele muito clara fica "lavada".
- **Conclusão:** pele e cor do cabelo podem sair por código se cada formato de cabelo tiver sua **máscara de cabelo**.

### 4.2 Uniforme real como textura (20 clubes da Série A × 3 cenas)
- Entrada: 3 imagens por clube geradas pelo usuário (camisa de frente, camisa de costas, calção; fundo magenta). `Série A.zip`.
- Método: remove o fundo da imagem plana, recorta no contorno, **estica a textura no retângulo de cada componente da máscara** (camisa do jogador e dos companheiros; o maior bloco do calção é o calção, os blocos finos são meiões), preenche onde não há tecido com o pixel válido mais próximo (com erosão de 7 px para não puxar a borda magenta) e **multiplica pela sombra da pintura** (luminância normalizada pelo percentil 90 dentro da máscara).
- Cenas testadas: **treino** (corrida), **estádio** (corrida com adversários e torcida), **gol** (braços abertos). Resultado: listras verticais, faixas horizontais, diagonais, faixa no peito e calções com desenho saem **reconhecíveis e com a quantidade certa de listras**, e adversários/torcida não mudam.
- **Defeitos conhecidos:** (a) **meiões**: as imagens não os mostram, então saem na cor do calção; o `kits.json` tem a cor certa e deve ser usada; (b) listra lateral do calção vira um bloco de cor na coxa porque a pose é de lado; (c) detalhes finos (padrão do Athletico-PR) perdem nitidez; (d) mangas recebem o mesmo desenho do tronco e às vezes um detalhe de gola aparece na manga; (e) o mapeamento é por caixa delimitadora, não por geometria do tecido.
- **Não testado ainda:** jogador **sentado** (vestiário, banco), cenas de **roupa casual**, número nas costas, outros cortes de cabelo, os outros 504 clubes.

### 4.3 O que a conta diz
Veja a seção 6.

---

## 5. Problemas em aberto (o que dói)

1. **Formato do cabelo não é recolorível:** longo, coque, tranças, rastas, moicano, degradê. Precisa ser pintado. Hoje há 6 formatos pintados; faltam pelo menos 3 (degradê alto, tranças, coque) em todas as cenas.
2. **Consistência do personagem entre cenas:** cada cena é gerada isolada; o protagonista muda um pouco de corpo, proporção e tom entre as imagens. Não há "o mesmo jogador" em 39 cenas. Só o estilo é mantido por prompt e, às vezes, por imagem de referência.
3. **Qualidade e controle:** a IA muda detalhes que não deveria (luz, fundo, camisa) quando se pede uma variação; por isso hoje cada imagem é gerada do zero e conferida à mão (checklists por cena).
4. **Risco jurídico dos uniformes:** o protótipo reproduz camisas reais (padrão e cores), o que contraria a regra "só padrão genérico" do `kits.json` e do CLAUDE.md. Hoje isso é um teste; para entrar no jogo, precisa de decisão e revisão jurídica (o precedente é a exceção v2.86 dos emblemas, em que o usuário assumiu o risco).
5. **Escala de uniformes:** são 524 clubes; mesmo 3 imagens de referência por clube são 1.572 imagens, feitas à mão.
6. **Recolor sem física:** o multiply deixa pele e tecido "chapados" em cores muito diferentes da pintura original (a pele muito clara some o contorno; uniforme preto perde as dobras).
7. **Cenas sem camisa de clube** (casa, empresário, hospital, festa, aeroporto) ainda pintam a camisa do clube por código; o desejado é roupa casual nas cenas fora do clube (mudança de código pendente).
8. **Máscaras do calção vazam sobre o céu** em 14 das 96 máscaras (corrigido só no gerador de `docs/cenas`, não no jogo).
9. **Resolução:** retratos e cenas estão em 928×1152 ou 412×512 (provisório); o alvo é 1856×2304.

---

## 6. Os números

Definições: **cena** = 39 planejadas; **formato de cabelo** = 9 (6 atuais + degradê alto, tranças, coque); **visual** = 20; **pele** = 10 tons (agrupados em 4); **cor de cabelo** = 8; **clube** = 524.

### 6.1 Onde estamos
| Item | Quantidade |
|---|--:|
| Cenas no jogo | 21 |
| Imagens de cena no jogo (21 × 6 cortes) | 126 |
| Cenas só com prompt | 18 |
| Retratos de visuais no jogo | 10 |
| Retratos novos prontos (fora do jogo) | 10 |
| Clubes com uniforme cadastrado | 20 (de 524) |

### 6.2 Cenário ingênuo (para ilustrar o problema)
| Tudo pintado por combinação | Imagens |
|---|--:|
| Cena × visual (39 × 20) | 780 |
| Cena × visual × clube (39 × 20 × 524) | **408.720** |
| Cena × (4 peles × 9 formatos × 8 cores de cabelo) × clube | **≈ 5,9 milhões** |

Inviável à mão, e caro mesmo automatizado.

### 6.3 Plano atual (aprovado, SPEC v2.96) — o mínimo sensato
- Pele (4 tons), cor do cabelo e uniforme do clube **por código**; só o **formato do cabelo pintado**.
- **225 imagens a gerar** = 21 cenas atuais × 3 formatos novos (63) + 18 cenas novas × 9 formatos (162). As 126 atuais são aproveitadas.
- Primeira leva: 15 imagens (5 cenas mais usadas × 3 formatos novos). Prompts prontos em `docs/arte/cenas-novas/<NN-nome>/<formato>/prompt.md` (225 arquivos).
- Uniformes: 1 entrada em `kits.json` por clube (524) e, se adotarmos as texturas, 2 a 3 imagens planas por clube (até 1.572, feitas à mão).

### 6.4 Mundo ideal (o que queremos de verdade)
O ideal **não** é minimizar imagens; é **maximizar qualidade e consistência com esforço humano quase zero por combinação**:

1. **39 cenas** com acabamento de ilustração de jogo, em 1856×2304, **uma única fonte de verdade por cena** (um "plate" de cenário + uma pose de jogador por cena).
2. **Um jogador consistente** (mesmo corpo e estilo) em todas as cenas, com **9 formatos de cabelo × 4 tons de pele × 8 cores de cabelo** disponíveis sem nova geração manual (≈ 288 variações por cena, **geradas por pipeline**, não à mão).
3. **Qualquer um dos 524 clubes** vestindo a camisa certa (padrão, cores, manga, gola), o calção certo e os meiões certos, com dobras e luz naturais, **sem escudo, patrocínio ou texto**.
4. **Roupa casual** nas cenas civis.
5. **Verificação automática** de cada saída (máscara coerente, nada de texto/logo, fundo intacto, rosto ausente, estilo consistente) e **revisão humana por amostragem**, não imagem a imagem.
6. **Reprodutível:** mudar o estilo ou o enquadramento regenera tudo com um comando.

Ordem de grandeza desse mundo, se tudo vier de pipeline: 39 cenas × 288 aparências ≈ **11.232 imagens-base**, mais a camada de uniforme aplicada em tempo de execução ou em build (524 kits). O que precisamos descobrir é **qual pipeline entrega isso com qualidade**.

---

## 7. Fluxo atual de produção (resumo operacional)

```
prompts (Python)  →  geração manual (Gemini)  →  conferência (checklist + scripts)  →  processamento (WebP + máscaras)  →  jogo
docs/arte/*.py       Nano Banana 2, 4:5          conferir-visuais.py, README por lote     processar_*.py                src/assets/*
```

- Tudo escrito com TDD, commits atômicos por tarefa (`feat(Txx): …`), SPEC como fonte da verdade (`SPEC.md`, versões v2.xx).
- Scripts de apoio: `docs/arte/gerar_cenas_genericas.py` (cena com uniforme genérico magenta/ciano, útil para IA), `gerar_visuais_11_20.py`, `gerar_cenas_novas.py`, `processar_visuais.py`, `conferir-visuais.py`.

---

## 8. Ideias para quem for resolver (seja criativo)

As ideias abaixo são **hipóteses para testar**, não decisões. Todas respeitam as restrições da seção 2.

### 8.1 Mudar o que a IA gera: camadas em vez de cenas inteiras
- **Plate sem jogador + sprite do jogador separado.** Gerar os 39 cenários **vazios** (ou só com figurantes) e o jogador como camada independente (corpo + cabelo + camisa + calção + meiões), composta com sombra projetada e correção de cor. Cabelo, pele e uniforme viram **camadas trocáveis**; a consistência do jogador vem de uma só fonte. Risco: o jogador "colar" na cena; mitigação com sombra, iluminação ambiente e um passo de **img2img com ruído baixo** para unificar o acabamento.
- **Poses por categoria de cena** (em pé, correndo, sentado, braços abertos, ajoelhado): poucas poses reutilizadas em várias cenas.

### 8.2 Edição por máscara (inpainting) em vez de regeneração
Em vez de pedir "troque pele e cabelo" e a IA mexer em tudo: **segmentar** (SAM 2, ou segmentação semântica de pele/cabelo/roupa) e fazer **inpainting só na região da cabeça/cabelo**, deixando o resto **idêntico pixel a pixel**. Ferramentas candidatas: edição de imagem com máscara de Gemini/Nano Banana, gpt-image, Flux Kontext/Fill, ControlNet (canny/depth/lineart) para travar a composição, IP-Adapter para travar o estilo. Resolve o item 3 da seção 5 e cria os 9 formatos a partir de **uma** cena-base.

### 8.3 Estilo e personagem travados por treinamento leve
- **LoRA de estilo** (as 126 cenas aprovadas são um dataset pequeno e coerente) e **LoRA ou referência de personagem** por formato de cabelo, para manter o mesmo jogador entre cenas.
- Verificar a licença/termos de uso comercial do modelo e do treino.

### 8.4 Recolor com física, não multiply
- Decompor a pintura em **albedo e sombreamento** (Retinex, intrinsic decomposition, IC-Light) e recolorir só o albedo; preserva especular e dobras em qualquer tom de pele e de tecido.
- Recolor em espaço **Lab/OKLab** com curva de contraste por tom, em vez de multiplicar a luminância.

### 8.5 Vestir o uniforme: do "esticar textura" ao "try-on"
- **Warp guiado por geometria:** profundidade monocular (Depth Anything, etc.) ou mapa de normais inferido da pintura para deformar a textura com as dobras; separar manga, tronco e gola (cada uma com seu mapeamento).
- **Virtual try-on por difusão** (IDM-VTON, CatVTON ou similares): imagem plana do uniforme + imagem do jogador → jogador vestido. Testar no domínio **pintado** (os modelos foram treinados em fotos) e conferir se o resultado respeita a máscara e não inventa escudo ou texto.
- **Gerar o uniforme sob demanda no build**, por clube, a partir de uma **ficha estruturada** (padrão, cores, detalhes) em vez de uma imagem à mão por clube: um gerador procedural (SVG/canvas) de camisa com listras, faixas, golas e mangas parametrizáveis, que produz a textura plana; assim os 524 clubes saem de dados, sem 1.572 imagens.

### 8.6 O jogador em 3D estilizado (pode ser a grande virada)
Modelo 3D de baixa poligonagem, rigged, com **pele, cabelo (cartões ou strands), camisa, calção, meiões e chuteiras como materiais e meshes intercambiáveis**; poses por animação; câmera de costas; render com **shader pictórico (NPR)** e um passo final de **img2img de baixa intensidade** para dar o acabamento pintado. Cenários continuam 2D pintados. Ganho: **aparência × uniforme × pose × câmera** viram parâmetros; consistência perfeita; zero imagens por combinação. Custo: construir os ativos uma vez e acertar o look "pintado". Verificar licença de qualquer rig ou animação de terceiros.

### 8.7 Compor no cliente (WebGL)
Camadas no navegador com shader: pintura base + albedo recolorível + máscara + textura de uniforme com normal map derivado da pintura. Menos arquivos pesados, mais flexibilidade; exige cuidado com desempenho em celular e com o acabamento.

### 8.8 Qualidade e verificação automática
- Métricas por saída: **SSIM/LPIPS fora da máscara** (nada mudou), coerência da máscara, **OCR** (nenhum texto), detector de **logo/escudo** (nenhum), detecção de rosto (ausente nas cenas de costas), distância de estilo a um conjunto-âncora, regra de cores-chave (nada de magenta/ciano residual).
- **Amostragem humana** (por exemplo 5% de cada lote) em vez de conferir cada imagem.

### 8.9 Reduzir a combinatória pelo design
- Agrupar os 10 tons de pele em 4 e as 8 cores de cabelo em uma paleta menor mantém a diversidade visível no celular (360 px).
- Escolher **formatos de cabelo** que sejam distinguíveis **de costas**, que é o que importa nas cenas.

---

## 9. Perguntas para os especialistas

1. Qual pipeline você escolheria para ter **o mesmo jogador, em 39 cenas, com 9 formatos de cabelo × 4 peles × 8 cores de cabelo**, mantendo acabamento pintado de alta qualidade?
2. **Inpainting por máscara** (8.2) resolve a variação de cabelo sem alterar o resto? Qual ferramenta/modelo você usaria e como travaria o estilo?
3. Vale **3D estilizado + img2img** (8.6) em vez de ilustrações pintadas por combinação? Como manter o "pintado" de forma consistente?
4. Qual a melhor forma de **vestir uniformes arbitrários** em uma figura pintada: warp com profundidade/normais, try-on por difusão, ou composição procedural? Como evitar que o modelo invente escudo, patrocínio ou texto?
5. Como **gerar 524 uniformes a partir de dados** (padrão, cores, detalhes) com qualidade, em vez de imagens à mão?
6. Como **medir automaticamente** que uma imagem está "boa" (estilo, consistência, ausência de texto/logo/rosto)?
7. Quais **termos de uso comercial** e **riscos de propriedade intelectual** devemos checar em cada ferramenta (geração, edição, treinamento de LoRA, try-on)?
8. Qual a **ordem de teste** que dá a resposta mais barata primeiro?

### Critérios de sucesso (propostos)
- Em celular (360 px), as 39 cenas parecem **da mesma obra** e o jogador parece **a mesma pessoa** nas cenas.
- As 20 aparências são distinguíveis (pele e cabelo) de costas.
- Os 524 uniformes são reconhecíveis **sem** escudo, patrocínio ou texto.
- Esforço humano por nova combinação: **zero** (ou conferência por amostragem).
- Tempo de regenerar tudo após mudar o estilo: uma noite, não semanas.

---

## 10. Mapa de arquivos

| Assunto | Onde |
|---|---|
| Regras e fluxo de trabalho | `CLAUDE.md`, `SPEC.md` (v2.12, v2.26, v2.36, v2.86, v2.93 a v2.96) |
| Briefing de arte (estilo, regras, plano de cores) | `docs/briefing-arte.md` |
| Lista das 39 cenas (momento e descrição) | `docs/lista-de-cenas.md` |
| Auditoria de uso das cenas e trocas propostas | `docs/auditoria-cenas.md` |
| 20 visuais e roteiro por liga | `docs/proposta-mais-visuais.md` |
| Prompts dos retratos 01 a 20 | `docs/arte/visuais/visual-NN/prompt.md` e `Image.jpeg` |
| Prompts das cenas por corte (atuais) | `docs/arte/cenas/<NN-nome>/<corte>/prompt.md` |
| Prompts das cenas por formato (novos, 225) | `docs/arte/cenas-novas/<NN-nome>/<formato>/prompt.md` |
| Cenas com uniforme genérico magenta/ciano (para IA) | `docs/cenas/<cena>/<corte>.webp`, `docs/cenas/indice.jpg` |
| Cenas no jogo e máscaras | `src/assets/cenas/<cena>/<corte>(-camisa|-calcao).webp` |
| Retratos no jogo | `src/assets/visuais/visual-NN.webp` e `-camisa.webp` |
| Dados | `src/data/visuais.json`, `kits.json`, `cortes.json`, `cenasArte.json`, `cenaFoco.json`, `clubs.json`, `europe.json`, `foreignClubs.json` |
| Código de cena e uniforme | `src/ui/screens/CenaPintada.tsx`, `cenaArte.ts`, `src/art/kits.ts` |
| Scripts de arte | `docs/arte/processar_*.py`, `gerar_*.py`, `conferir-visuais.py` |

Comandos úteis: `npm test`, `npm run typecheck`, `npm run build`; scripts de arte rodam com `python3 docs/arte/<script>.py` (Pillow e NumPy).
