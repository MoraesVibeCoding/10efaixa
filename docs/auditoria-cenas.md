# Auditoria das cenas (2026-10-13)

Pedido do usuário: ver quais imagens de cena o jogo usa hoje, se elas combinam com o momento da decisão, se repetem demais, e já deixar prontas as novas.

Fonte dos números: `src/data/events.json` (campo `cena` de cada decisão), `src/data/cenasArte.json` (as 21 cenas com imagem no jogo) e os textos de `src/i18n/pt-BR/events.json`.

## 1. Como está hoje

- **90 decisões** usam **20 das 21 cenas** com imagem. A `despedida` não é usada por nenhuma decisão (ela é do fim da carreira).
- **Três cenas ficam com 47% das decisões** (42 de 90): estádio 20, vestiário 13 e treino 9.

| Cena | Decisões | % |
|---|--:|--:|
| estadio | 20 | 22% |
| vestiario | 13 | 14% |
| treino | 9 | 10% |
| casa-familia | 7 | 8% |
| gol | 7 | 8% |
| sala-empresario | 5 | 6% |
| entrevista | 4 | 4% |
| reuniao-comissao, copa, convocacao, banco-de-reservas | 3 cada | 3% |
| assinatura-contrato, festa, penalti, aeroporto | 2 cada | 2% |
| hospital, titulo, varzea, peneira, rua-do-bairro | 1 cada | 1% |

## 2. Decisões que a cena atual não representa bem

O catálogo já previa **13 cenas** (`docs/arte/cenas/22` a `34`, com prompts escritos e **nenhuma imagem gerada**) que resolvem a maior parte. Faltam mais **5** (lote 7, prompts criados nesta auditoria). Total de imagens a gerar **por corte de cabelo (como os prompts estão escritos hoje): 18 cenas × 6 cortes = 108**. Veja a seção 6: o usuário informou que o trabalho passou a ser por **padrão de jogador**, o que muda essa conta.

| Decisão | Cena hoje | Cena sugerida | Situação da imagem |
|---|---|---|---|
| estreia-profissional | estadio | **26-estreia** (túnel, primeira entrada em campo) | prompt pronto, sem imagem |
| estreia-selecao | estadio | **31-hino** | prompt pronto, sem imagem |
| primeiro-classico, primeiro-classico-no-clube, marcacao-dura-no-classico | estadio | **24-classico** | prompt pronto, sem imagem |
| primeira-final, jogo-grande-bola-pesada | estadio | **29-final** | prompt pronto, sem imagem |
| vaia-da-torcida | estadio | **25-vaia** | prompt pronto, sem imagem |
| camisa-no-tunel | estadio | **37-grade-do-tunel** (menino de camisa velha na grade) | lote 7, prompt novo |
| jogo-no-gramado-ruim | estadio | **38-gramado-chuva** | lote 7, prompt novo |
| primeira-bracadeira, bracadeira-no-clube | vestiario | **27-capitao** | prompt pronto, sem imagem |
| primeira-titularidade | vestiario | **30-escalacao** (nome na lista) | prompt pronto, sem imagem |
| assumir-faltas, bola-parada-no-clube | treino | **28-cobranca-falta** | prompt pronto, sem imagem |
| tecnico-pede-sacrificio | treino | **33-prancheta** | prompt pronto, sem imagem |
| mudanca-posicao | reuniao-comissao | **33-prancheta** (o técnico chama com a prancheta) | prompt pronto, sem imagem |
| dieta-do-nutricionista | treino | **36-nutricionista** | lote 7, prompt novo |
| professor-da-base | casa-familia | **39-centro-de-treinamento** (ele aparece na porta do centro) | lote 7, prompt novo |
| prova-ou-treino | casa-familia | **35-escola** | lote 7, prompt novo |
| projeto-social-convida | casa-familia | **varzea** (o texto fala em campinho de terra) | já existe |
| primeira-assistencia | gol | **34-assistencia** | prompt pronto, sem imagem |
| estreia-exterior | aeroporto | **32-exterior** | prompt pronto, sem imagem |
| jogo-beneficente | festa | **varzea** (é um jogo, não uma festa) | já existe |

**24 decisões (27%) mudariam de cena.** Com isso a cena mais repetida cai de 20 para 10 usos (estádio e vestiário).

**Sem decisão ainda:** `22-cabecada` (lance aéreo) e `23-fisioterapia` (recuperação de lesão) têm prompt mas nenhuma decisão do catálogo as pede. Gerar só quando houver evento (ex.: gol de cabeça, volta de lesão), ou tirar do catálogo.

## 3. Ordem sugerida para gerar (do maior alívio ao menor)

1. **24-classico** (3 decisões), **33-prancheta** (2), **28-cobranca-falta** (2), **29-final** (2), **27-capitao** (2).
2. **26-estreia**, **31-hino**, **25-vaia**, **30-escalacao**, **34-assistencia**, **32-exterior** (1 cada).
3. **35-escola**, **36-nutricionista**, **37-grade-do-tunel**, **38-gramado-chuva**, **39-centro-de-treinamento** (1 cada).

Cada cena: 6 imagens (um corte de cabelo cada). Prompts em `docs/arte/cenas/<NN-nome>/` (um por corte e um `prompt-6-cortes.md`) e um arquivo por foto em `docs/arte/nanobanana-lote6/` (cenas 26 a 34) e `docs/arte/nanobanana-lote7/` (cenas 35 a 39). Gerador do lote 7: `python3 docs/arte/gerar-lote-7.py`.

## 4. Regras para trocar a cena de uma decisão

1. **Só depois da imagem pronta.** Hoje, quando não acha a imagem da cena, o componente `CenaPintada` não desenha nada (`if (!art) return null`). Trocar o campo `cena` antes da imagem existir deixa a decisão sem cena.
2. Cada cena nova entra no jogo pelo mesmo caminho das 21 atuais (arquivos em `src/assets/cenas/<cena>/`, 6 cortes, máscaras de camisa e de calção, medidas em `cenasArte.json` e texto alternativo em `scenes.alt.<cena>`).
3. A troca do campo `cena` em `events.json` é uma mudança de conteúdo e precisa do "DE ACORDO" do usuário, decisão por decisão ou em bloco (a tabela da seção 2 é a proposta).

## 5. Dois pontos que apareceram na conferência

- **Roupa civil.** `sala-empresario`, `casa-familia`, `hospital`, `festa` e `aeroporto` não têm calção na pintura, mas o jogo pinta a camisa do clube nelas. O usuário pediu roupa casual nas cenas fora do ambiente do clube; isso muda o código de pintura e fica para outra tarefa.
- **Máscara do calção que vaza sobre o céu** em 14 das 96 máscaras (treino, peneira, assinatura do contrato, estádio, rua do bairro): no jogo, calção escuro escurece o fundo e calção colorido o tinge. Não corrigido no jogo; o gerador de `docs/cenas/` descarta esses blocos.

## 6. Atualização do mesmo dia: a unidade é o padrão de jogador, não o corte de cabelo

Informação do usuário (2026-10-13): o trabalho não é mais por corte de cabelo; são **10 padrões de jogador** (os 10 visuais prontos, com cor, cabelo e outras características), que podem aumentar.

Conferido no código: hoje o jogo escolhe a cena pelo corte de cabelo (6 cortes, `cutForVisual` em `src/ui/screens/cenaArte.ts`; `visuais.json` aponta cada visual para um corte). Os 10 visuais têm **pele de `t1` a `t10`**, cabelo, cor de cabelo e barba; os prompts atuais das cenas descrevem sempre **pele marrom**. Ou seja, hoje a cena só acerta a pele de parte dos visuais.

Contas com **N padrões** (N = 10 hoje):

| O quê | Por corte (hoje) | Por padrão |
|---|--:|--:|
| 18 cenas novas (13 previstas + 5 do lote 7) | 108 | **18 × N = 180** |
| 21 cenas atuais em versão genérica (`docs/cenas`) | 126 | **21 × N = 210** (não existem por padrão; teriam de ser geradas) |
| Refazer por clube só as 5 cenas mais usadas (62% das decisões), Série A | 600 | **5 × N × 20 = 1.000** |

**Pendente de decisão do usuário:** refazer os prompts (lote 7 primeiro, como modelo) por padrão de jogador, descrevendo pele, cabelo, cor e barba de cada visual a partir de `visuais.json`, e depois ligar a cena ao visual no código. Os arquivos atuais (por corte) continuam valendo até lá.
