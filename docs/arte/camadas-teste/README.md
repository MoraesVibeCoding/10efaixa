# Teste de cena por camadas (SPEC v2.97)

Objetivo: ver se montar a cena em camadas dá uma imagem boa e deixa trocar só o uniforme (e pele e cabelo) por código.
Cena de teste: **treino**, a mesma de `docs/arte/cenas/11-treino`.

| Ordem | Pasta | O que é |
|--:|---|---|
| 1 | `01-fundo-treino` | Campo de treino vazio, sem ninguém |
| 2 | `02-jogador-curto` | Jogador correndo de costas, cabelo curto, em fundo verde |
| 3 | `03-jogador-coque` | O mesmo jogador, com coque (anexar a imagem 2 como referência de corpo e pose) |
| 4 | `04-bola` | Bola branca lisa, em fundo verde |

Salve cada imagem como `imagem.jpeg` na própria pasta e avise. Eu junto as camadas, aplico o uniforme de um clube por código e mostro ao lado da cena atual.

**Por que o uniforme troca fácil:** o jogador sai isolado com camisa magenta e calção e meiões ciano, as cores-chave de sempre. Sem fundo e sem chão, as máscaras saem limpas.
