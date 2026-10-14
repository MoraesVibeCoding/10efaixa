# Lista de cenas do 10eFaixa (2026-10-14)

Fontes: `src/data/cenasArte.json` (cenas no jogo), `docs/arte/cenas/<NN-nome>/curto/prompt.md` (momento e descrição), `docs/auditoria-cenas.md` (uso nas decisões).
**Uniforme:** `kit` = camisa e calção do clube pintados por código; `casual` = roupa comum (camisa de time com calça); `sem camisa` = jogador sem camisa. Todas as cenas são de costas.

## 1. Cenas que já estão no jogo (21)

Cada uma com 6 formatos de cabelo pintados (126 imagens). Falta o formato novo (degradê alto, tranças, coque): 3 imagens por cena.

| Nº | Cena (momento) | Descrição breve | Decisões hoje |
|--:|---|---|--:|
| 01 | Título | Jogador de costas apontando para o céu, taça ao fundo. Título estadual, de copa ou de liga. | 1 |
| 02 | Vestiário | Sem camisa, sentado de costas no banco, olhando a camisa pendurada no armário. Decisões de elenco e conversa com o técnico. | 13 |
| 03 | Assinatura de contrato | Jogador de costas à mesa, diante do contrato. Propostas, renovação e transferência. | 2 |
| 04 | Pênalti | De costas diante da bola e do gol. O pênalti decisivo em jogo grande. | 2 |
| 05 | Várzea | De costas num campinho de terra. Início de carreira. | 1 |
| 06 | Sala do empresário | Conversas com o empresário: propostas, aumento, troca de empresário. | 5 |
| 07 | Reunião com a comissão | Reunião semestral com a comissão técnica: foco de treino e mudança de posição. | 3 |
| 08 | Em casa com a família | Estirão, compra da casa, conselhos e vida fora do campo. | 7 |
| 09 | Despedida | Jogo de despedida e aposentadoria. | 0 (fim da carreira) |
| 10 | Mundial de Seleções | Convocação que vira o Mundial e os momentos do torneio. | 3 |
| 11 | Treino | Treinos, evolução de atributos e bola parada. | 9 |
| 12 | Gol | Gol decisivo, gol em clássico e comemoração. | 7 |
| 13 | Hospital | Lesão grave e a decisão do tratamento. | 1 |
| 14 | Festa | Tentação da noite, festa com o elenco e polêmicas fora de campo. | 2 |
| 15 | Entrevista | Depois do jogo, declaração polêmica e redes sociais. | 4 |
| 16 | Convocação | Convocação para a Seleção e convite de outra seleção. | 3 |
| 17 | Rua do bairro | Origem na rua do bairro e a visita do olheiro. | 1 |
| 18 | Peneira | Peneira no clube, no começo da carreira. | 1 |
| 19 | Banco de reservas | Fase na reserva, perda de espaço e espera pela chance. | 3 |
| 20 | Aeroporto | Transferência para outro estado ou exterior, e a volta ao Brasil. | 2 |
| 21 | Estádio | Jogo comum da temporada, estreia e sequência de titular. | 20 |

Total: **90 decisões em 20 das 21 cenas**. Estádio, vestiário e treino concentram 47%.

## 2. Cenas a acrescentar (18)

Todas têm prompt e nenhuma tem imagem. Cada uma terá os 9 formatos de cabelo (162 imagens). A coluna "Decisões" é a proposta da auditoria e só vale depois da imagem existir e do "DE ACORDO" do usuário.

| Nº | Cena (momento) | Descrição breve | Decisões propostas |
|--:|---|---|--:|
| 22 | Cabeçada | Lance aéreo, gol de cabeça e bola parada. | 0 (espera evento) |
| 23 | Fisioterapia | Recuperação de lesão e volta gradual aos treinos. | 0 (espera evento) |
| 24 | Clássico | Clássico contra o rival: provocação, decisão e pressão da torcida. | 3 |
| 25 | Vaia | Má fase, vaia da torcida, idolatria em queda. | 1 |
| 26 | Estreia | Primeira entrada em campo: estreia profissional, no clube novo ou na Seleção. | 1 |
| 27 | Braçadeira de capitão | Primeira braçadeira de capitão, no clube e na Seleção. | 2 |
| 28 | Cobrança de falta | Assumir a bola parada: primeira falta como cobrador do time. | 2 |
| 29 | Final | Primeira final ou jogo do título, em campeonato e copa. | 2 |
| 30 | Escalação | Primeira vez titular: ver o próprio nome no quadro da escalação. | 1 |
| 31 | Hino | Estreia na Seleção principal e primeira Copa, perfilado durante o hino. | 1 |
| 32 | Estreia no exterior | Primeiro jogo num clube europeu. | 1 |
| 33 | Prancheta do técnico | O técnico propõe um novo papel ("quero você mais recuado") e a reunião sobre a função. | 2 |
| 34 | Assistência | Primeira assistência: o companheiro comemora o gol com quem deu o passe. | 1 |
| 35 | Escola | Prova da escola ou treino; a família cobra o boletim. Roupa casual. | 1 |
| 36 | Nutricionista | Dieta, rotina de alimentação e cuidado com o corpo. Roupa casual. | 1 |
| 37 | Grade do túnel | Encontro com um torcedor mirim antes do jogo; carinho e fama. | 1 |
| 38 | Gramado na chuva | Jogo em gramado ruim, chuva forte e bola que não rola. | 1 |
| 39 | Portão do centro de treinamento | Visita do ex-treinador da base na entrada do clube. Roupa casual. | 1 |

Com as 22 trocas acima e mais 2 decisões que passam para a Várzea (projeto social e jogo beneficente), **24 decisões (27%)** mudam de cena e a cena mais repetida cai de 20 para 10 usos.

## 3. Contas

| O quê | Imagens |
|---|--:|
| Já pintadas (21 cenas × 6 formatos) | 126 |
| Formatos novos nas 21 cenas atuais (21 × 3) | 63 |
| 18 cenas novas × 9 formatos | 162 |
| **A gerar** | **225** |

Pele (4 tons), cor do cabelo e uniforme do clube são aplicados por código. Prompts em `docs/arte/cenas-novas/<NN-nome>/<formato>/prompt.md`.
