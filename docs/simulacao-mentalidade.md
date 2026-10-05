# Simulação — mentalidade (proposta SPEC 6.17)

50 carreiras: 10 por posição (atacante, meia, zagueiro, lateral, goleiro), mentalidades alternadas (cada posição usa as 4, duas delas 3 vezes). Temperamento Frio em todas, altura média da posição, compleição atlética. Cada carreira roda **duas vezes com a mesma semente**: neutra → com mentalidade. Δ = com − sem.

**Todas:** Δ pico -0,0 · Δ idade do pico -0,6 · Δ idade final 0,3 · Δ nota de legado 3,1. Amostra pequena: as diferenças por grupo são indicativas, não calibração (a mesma semente diverge nos sorteios depois da primeira decisão).

### Por mentalidade
| Grupo | Carreiras | Δ pico | Δ idade do pico | Δ idade final | Δ nota de legado |
| --- | --: | --: | --: | --: | --: |
| fominha | 13 | 0,2 | 0,2 | 0,6 | 0,5 |
| capitao | 13 | 0,0 | -0,7 | -0,7 | 2,2 |
| professor | 12 | -0,3 | -1,3 | 0,3 | 2,5 |
| maquina | 12 | 0,0 | -0,8 | 0,8 | 7,5 |

### Por posição
| Grupo | Carreiras | Δ pico | Δ idade do pico | Δ idade final | Δ nota de legado |
| --- | --: | --: | --: | --: | --: |
| atacante | 10 | -0,2 | -1,1 | -1,5 | 8,4 |
| meia | 10 | -0,2 | -0,7 | 1,2 | 0,6 |
| zagueiro | 10 | 0,0 | -0,7 | 0,3 | 4,9 |
| lateral | 10 | 0,2 | -0,6 | 0,3 | 6,0 |
| goleiro | 10 | 0,0 | -0,1 | 1,0 | -4,4 |

### As 50 carreiras (neutra → com mentalidade)
| Posição | Mentalidade | Pico | Idade do pico | Idade final | Nota de legado | Veredito |
| --- | --- | --: | --: | --: | --: | --- |
| atacante | fominha | 85 → 87 | 28 → 26 | 32 → 33 | 12.1 → 27.9 | rodadoDoInterior |
| atacante | capitao | 87 → 87 | 22 → 22 | 38 → 32 | 19.6 → 23.2 | jogadorDeSerieB |
| atacante | professor | 88 → 85 | 31.5 → 25.5 | 33 → 31 | 29.6 → 21.3 | rodadoDoInterior |
| atacante | maquina | 93 → 93 | 24.5 → 24 | 35 → 35 | 28.4 → 73.6 | lendaDoFutebolBrasileiro |
| atacante | fominha | 95 → 95 | 22.5 → 23 | 40 → 35 | 90.4 → 86.6 | lendaDoFutebolBrasileiro |
| atacante | capitao | 89 → 89 | 22.5 → 22.5 | 35 → 33 | 26.6 → 34.5 | titularDeSerieA |
| atacante | professor | 89 → 88 | 26 → 24.5 | 31 → 31 | 19.8 → 29.3 | titularDeSerieA |
| atacante | maquina | 88 → 88 | 22 → 22 | 36 → 36 | 22 → 23 | titularDeSerieA |
| atacante | fominha | 85 → 85 | 24 → 23 | 34 → 34 | 17 → 18.4 | jogadorDeSerieB |
| atacante | capitao | 89 → 89 | 22 → 21.5 | 36 → 35 | 27.2 → 39 | promessaQueNaoVingou |
| meia | capitao | 84 → 84 | 23 → 22.5 | 31 → 34 | 21.2 → 27.7 | promessaQueNaoVingou |
| meia | professor | 82 → 81 | 27 → 26.5 | 31 → 35 | 11.4 → 13.7 | rodadoDoInterior |
| meia | maquina | 87 → 87 | 23 → 22.5 | 37 → 37 | 27.1 → 26.5 | titularDeSerieA |
| meia | fominha | 88 → 88 | 23.5 → 23 | 30 → 30 | 15.7 → 16.4 | titularDeSerieA |
| meia | capitao | 82 → 82 | 22.5 → 21.5 | 35 → 35 | 21 → 14.4 | titularDeSerieA |
| meia | professor | 83 → 83 | 24.5 → 23.5 | 37 → 35 | 18.6 → 18.3 | titularDeSerieA |
| meia | maquina | 88 → 87 | 30.5 → 30.5 | 35 → 40 | 23.2 → 24 | titularDeSerieA |
| meia | fominha | 85 → 85 | 25 → 24.5 | 34 → 36 | 18.5 → 19.4 | promessaQueNaoVingou |
| meia | capitao | 81 → 81 | 21 → 20.5 | 38 → 38 | 21.5 → 21.5 | titularDeSerieA |
| meia | professor | 88 → 88 | 27 → 25 | 32 → 32 | 16.3 → 18.3 | titularDeSerieA |
| zagueiro | professor | 91 → 91 | 22.5 → 22.5 | 36 → 36 | 54.3 → 60.6 | craqueDaSelecao |
| zagueiro | maquina | 86 → 86 | 27 → 24 | 37 → 33 | 18.2 → 21.9 | titularDeSerieA |
| zagueiro | fominha | 81 → 81 | 23.5 → 24.5 | 33 → 33 | 14.8 → 14.3 | titularDeSerieA |
| zagueiro | capitao | 83 → 83 | 23 → 22.5 | 32 → 32 | 13.7 → 13.7 | jogadorDeSerieB |
| zagueiro | professor | 95 → 95 | 23.5 → 23 | 34 → 40 | 58.7 → 67.2 | lendaDoFutebolBrasileiro |
| zagueiro | maquina | 89 → 89 | 23 → 22 | 34 → 37 | 36.3 → 44.6 | titularDeSerieA |
| zagueiro | fominha | 94 → 94 | 25 → 25 | 35 → 35 | 48.9 → 56.2 | craqueDaSelecao |
| zagueiro | capitao | 82 → 82 | 22.5 → 21 | 35 → 34 | 18.5 → 16.8 | titularDeSerieA |
| zagueiro | professor | 98 → 98 | 23.5 → 23 | 36 → 35 | 96.6 → 96.4 | lendaMundial |
| zagueiro | maquina | 87 → 87 | 24 → 23.5 | 32 → 32 | 15.2 → 32.4 | titularDeSerieA |
| lateral | maquina | 83 → 84 | 27 → 27 | 35 → 40 | 9 → 14.2 | titularDeSerieA |
| lateral | fominha | 88 → 88 | 22.5 → 22.5 | 38 → 38 | 21.2 → 44.6 | titularDeSerieA |
| lateral | capitao | 86 → 86 | 24 → 22.5 | 31 → 31 | 10.5 → 20.5 | titularDeSerieA |
| lateral | professor | 84 → 85 | 27 → 25 | 31 → 32 | 12.1 → 14.9 | jogadorDeSerieB |
| lateral | maquina | 89 → 89 | 23.5 → 22.5 | 34 → 34 | 31.4 → 57.4 | titularDeSerieA |
| lateral | fominha | 79 → 79 | 27.5 → 28 | 37 → 37 | 16.6 → 16.7 | rodadoDoInterior |
| lateral | capitao | 87 → 87 | 23.5 → 22.5 | 34 → 34 | 17.2 → 18.7 | titularDeSerieA |
| lateral | professor | 88 → 88 | 25 → 24 | 35 → 33 | 33.3 → 40.8 | titularDeSerieA |
| lateral | maquina | 90 → 90 | 23 → 22.5 | 38 → 37 | 66.9 → 54.3 | craqueDaSelecao |
| lateral | fominha | 91 → 91 | 25 → 26 | 33 → 33 | 35.1 → 30.9 | titularDeSerieA |
| goleiro | fominha | 89 → 89 | 22 → 22.5 | 36 → 34 | 48.6 → 21.4 | titularDeSerieA |
| goleiro | capitao | 84 → 84 | 21 → 20.5 | 40 → 39 | 27.4 → 31 | titularDeSerieA |
| goleiro | professor | 94 → 94 | 22.5 → 22.5 | 31 → 31 | 50.3 → 48.7 | craqueDaSelecao |
| goleiro | maquina | 86 → 86 | 23 → 22.5 | 33 → 35 | 28.1 → 21.5 | titularDeSerieA |
| goleiro | fominha | 85 → 85 | 22 → 25 | 32 → 40 | 26.6 → 22.5 | titularDeSerieA |
| goleiro | capitao | 87 → 87 | 24 → 22.5 | 36 → 36 | 35.6 → 25.2 | titularDeSerieA |
| goleiro | professor | 84 → 84 | 21 → 21 | 35 → 35 | 15.3 → 16.6 | titularDeSerieA |
| goleiro | maquina | 88 → 88 | 24 → 22.5 | 33 → 33 | 32.8 → 34.7 | jogadorDeSerieB |
| goleiro | fominha | 88 → 88 | 22 → 22.5 | 33 → 37 | 43.9 → 40.4 | titularDeSerieA |
| goleiro | capitao | 81 → 81 | 21.5 → 21 | 31 → 30 | 12.3 → 14.8 | promessaQueNaoVingou |
