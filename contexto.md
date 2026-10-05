# Contexto — decisões recentes (2026-10-01)

Resumo da retomada da sessão: T40 aprovada → T41 a T47 entregues, mentalidade adicionada e estilo da arte final em aberto. Estado do repositório: `main`, testes 608 passando, typecheck e build verdes.

## Decisões do usuário

| Tema | Decisão |
|---|---|
| T40 (⛳) | Aprovada com a amostra de 2.000 carreiras por célula (36 mil). A amostra cheia de 10 mil por célula (`SIM_LEGADO=10000 npm run sim:legado`, ~1 h) segue **pendente**. |
| T41 (⛳) | Aprovada. Manchete séria + comentário de zoeira só sobre o próprio jogador. **Todo comentário cita a comemoração** (a pedido do usuário) e cada um dos 14 rótulos tem comentário próprio. |
| Nomes bloqueados | Livre para nomes comuns. Bloqueados só palavrões, injúrias discriminatórias (viado, retardado, macaco), apologia ao nazismo (nazista, hitler) e nomes exclusivos de pessoas reais famosas (Neymar, Messi, nomes completos). Liberados: Pelé, Zico, Cafu, Casagrande, Falcão, Sócrates, Romário, Kaká, Rivaldo, Dunga e insultos leves (vagabundo, corno, babaca…). |
| "Estilo copeiro" | O usuário esclareceu que se refere aos **estilos de decisões** tomadas durante a carreira. Entendimento atual: os comentários poderiam refletir as escolhas do jogador. **Não implementado**; seria uma possível T41b, só com confirmação. |
| Mentalidade (escopo novo) | Opção A aprovada: 4º campo da criação, opcional no motor — **Fominha · Capitão · Professor · Máquina**. Muda o caminho até o teto (crescimento por atributo, ruído, perda por idade), nunca o teto. Usuário pediu efeitos maiores: v2 com até ±30%. |
| Estilo da arte final | **Em aberto.** Usuário pediu desenho mais realista, "mesmo com menos nitidez". Exemplos A (vetor semi-realista), B (raster pintado), C (híbrido) e D (mais realista) foram mostrados; ainda não escolheu o caminho. |

## Entregas (commits)

| Item | Commit | O que fez |
|---|---|---|
| T41 | `5976b09`, `1356162` | `headline.ts` + `i18n/pt-BR/headlines.json`; apelido, manchete e comentário saem em `CareerResult` (`nickname`, `headline`, `comment`), sorteados no fim da carreira para não mudar o PRNG anterior. |
| Nomes | `b8de449` | `blockedWords.json` revisado; testes do filtro atualizados. |
| T44 | `865d964` | Motor do avatar (`src/art/avatar.ts`, dados em `avatar.json`): recolor por cores-chave exatas, altura = escala vertical, compleição = escala horizontal por grupo, envelhecimento (grisalho 30–45 anos, entradas aos 35, rugas aos 36), ordem de camadas do cabelo. |
| T45 | `8626af9` | Compositor de cenas (`src/art/scene.ts`): avatar e até 4 companheiros nos slots, uniformes e torcida nas cores do clube, detalhes, texto alternativo (`i18n/pt-BR/scenes.json`). |
| T46 | `7edac74` | Catálogo (`sceneCatalog.ts` + `scenes.json`): 25 cenários com pose, expressão, detalhes e companheiros; evento → cena; `allFiles()` lista as peças. |
| Mentalidade | `510fd34`, `998d188`, `f6d79d8` | `mentality.ts` + `mentality.json`; campo opcional `mentality` na criação; relatório em `docs/simulacao-mentalidade.md` (50 carreiras, 10 por posição, pares com/sem). O `f6d79d8` corrige um teste que ficou vermelho no commit anterior (arredondamento). |
| T47 | `fdce760` | 154 peças provisórias geradas por `src/art/provisional.ts` (`npm run art:generate` → `src/assets/art/provisoria/`), todas passam no `art:check`. |

## Achados e limites conhecidos

- **Mentalidade:** com ±30% o pico quase não muda (o teto é o mesmo); o efeito aparece na idade do pico (Professor −1,3 ano) e na nota de legado (Máquina +7,5). Amostra de 50 é indicativa, não calibração. Pendente: efeitos em lesões, polêmicas e atrito com o técnico, mudança de mentalidade ao longo da carreira, tela na T50 e calibração na T13.
- **Avatar:** luvas e mangas-longas do goleiro ainda não acompanham a compleição; peça de cabeça ausente é pulada em silêncio (a cobertura é garantida pelo teste da T47, não pelo `art:check`).
- **Compositor:** se o cenário não tiver `slot-jogador`, o avatar não é desenhado, sem aviso.
- **Arte realista:** código não chega a realismo de verdade. Caminhos possíveis: ilustrador com pintura digital, imagens de IA com retoque (direitos autorais incertos no Brasil, validar com advogado) ou personagem 3D renderizado. Em qualquer um o recolor por cores-chave deixa de valer para as peças realistas.
- **Ambiente:** `timeout` não existe no macOS; comandos longos devem rodar em segundo plano com saída em arquivo.

## Pendências e próximos passos

1. **Decidir o estilo da arte final** (A, B, C, ilustrador, IA ou 3D). Depende disso: briefing v4 e registro no SPEC (seção 17).
2. Confirmar se o "estilo copeiro" vira a T41b (comentários refletindo as decisões da carreira).
3. Amostra cheia da T40 (10 mil por célula).
4. **T48** — máquina de estados do fluxo de telas (sem UI visual).
5. **T49** — tokens visuais, fontes e tema escuro (⛳ ponto de parada). Toda UI do Marco 6 passa pela skill `impeccable`.
6. Calibração da mentalidade na T13 e tela da mentalidade na T50.
