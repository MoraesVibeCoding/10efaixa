# Simulação — mentalidade (proposta SPEC 6.17)

50 carreiras: 10 por posição (atacante, meia, zagueiro, lateral, goleiro), mentalidades alternadas (cada posição usa as 4, duas delas 3 vezes). Temperamento Frio em todas, altura média da posição, compleição atlética. Cada carreira roda **duas vezes com a mesma semente**: neutra → com mentalidade. Δ = com − sem.

**Todas:** Δ pico -0,1 · Δ idade do pico -0,4 · Δ idade final 0,1 · Δ nota de legado 1,6. Amostra pequena: as diferenças por grupo são indicativas, não calibração (a mesma semente diverge nos sorteios depois da primeira decisão).

### Por mentalidade
| Grupo | Carreiras | Δ pico | Δ idade do pico | Δ idade final | Δ nota de legado |
| --- | --: | --: | --: | --: | --: |
| fominha | 13 | 0,0 | -0,1 | -0,2 | 0,5 |
| capitao | 13 | 0,0 | -0,5 | -0,5 | -0,1 |
| professor | 12 | -0,4 | -0,8 | 0,9 | 2,2 |
| maquina | 12 | 0,1 | -0,4 | 0,1 | 4,1 |

### Por posição
| Grupo | Carreiras | Δ pico | Δ idade do pico | Δ idade final | Δ nota de legado |
| --- | --: | --: | --: | --: | --: |
| atacante | 10 | -0,3 | -0,7 | -0,7 | 5,0 |
| meia | 10 | 0,0 | -0,8 | 1,4 | 0,9 |
| zagueiro | 10 | 0,0 | -0,3 | 0,2 | 2,0 |
| lateral | 10 | -0,1 | -0,1 | -0,7 | 5,1 |
| goleiro | 10 | 0,0 | -0,3 | 0,2 | -5,0 |

### As 50 carreiras (neutra → com mentalidade)
| Posição | Mentalidade | Pico | Idade do pico | Idade final | Nota de legado | Veredito |
| --- | --- | --: | --: | --: | --: | --- |
| atacante | fominha | 85 → 85 | 28 → 27.5 | 32 → 33 | 12.1 → 13.8 | rodadoDoInterior |
| atacante | capitao | 87 → 87 | 22 → 22 | 38 → 32 | 19.6 → 23.2 | jogadorDeSerieB |
| atacante | professor | 88 → 85 | 31.5 → 26 | 33 → 31 | 29.6 → 21.3 | rodadoDoInterior |
| atacante | maquina | 93 → 93 | 24.5 → 24 | 35 → 35 | 28.4 → 73.8 | lendaDoFutebolBrasileiro |
| atacante | fominha | 95 → 95 | 22.5 → 23 | 40 → 40 | 90.4 → 90.2 | lendaDoFutebolBrasileiro |
| atacante | capitao | 89 → 89 | 22.5 → 22.5 | 35 → 35 | 26.6 → 26.6 | titularDeSerieA |
| atacante | professor | 89 → 89 | 26 → 26.5 | 31 → 31 | 19.8 → 27.3 | titularDeSerieA |
| atacante | maquina | 88 → 88 | 22 → 22 | 36 → 36 | 22 → 22.2 | titularDeSerieA |
| atacante | fominha | 85 → 85 | 24 → 23 | 34 → 34 | 17 → 16.7 | jogadorDeSerieB |
| atacante | capitao | 89 → 89 | 22 → 21.5 | 36 → 36 | 27.2 → 27.2 | titularDeSerieA |
| meia | capitao | 84 → 84 | 23 → 22.5 | 31 → 34 | 21.2 → 27.7 | promessaQueNaoVingou |
| meia | professor | 82 → 82 | 27 → 26.5 | 31 → 38 | 11.4 → 19.3 | jogadorDeSerieB |
| meia | maquina | 87 → 87 | 23 → 22.5 | 37 → 38 | 27.1 → 29 | titularDeSerieA |
| meia | fominha | 88 → 88 | 23.5 → 23.5 | 30 → 30 | 15.7 → 15.9 | titularDeSerieA |
| meia | capitao | 82 → 82 | 22.5 → 21.5 | 35 → 35 | 21 → 13.9 | titularDeSerieA |
| meia | professor | 83 → 83 | 24.5 → 23.5 | 37 → 37 | 18.6 → 19.2 | titularDeSerieA |
| meia | maquina | 88 → 88 | 30.5 → 30.5 | 35 → 31 | 23.2 → 11.9 | titularDeSerieA |
| meia | fominha | 85 → 85 | 25 → 23.5 | 34 → 34 | 18.5 → 18.5 | rodadoDoInterior |
| meia | capitao | 81 → 81 | 21 → 20.5 | 38 → 38 | 21.5 → 21.5 | titularDeSerieA |
| meia | professor | 88 → 88 | 27 → 24.5 | 32 → 39 | 16.3 → 26.5 | titularDeSerieA |
| zagueiro | professor | 91 → 91 | 22.5 → 22.5 | 36 → 36 | 54.3 → 60.6 | craqueDaSelecao |
| zagueiro | maquina | 86 → 86 | 27 → 25.5 | 37 → 30 | 18.2 → 12 | titularDeSerieA |
| zagueiro | fominha | 81 → 81 | 23.5 → 24 | 33 → 33 | 14.8 → 14.6 | titularDeSerieA |
| zagueiro | capitao | 83 → 83 | 23 → 23 | 32 → 32 | 13.7 → 13.7 | jogadorDeSerieB |
| zagueiro | professor | 95 → 95 | 23.5 → 24 | 34 → 37 | 58.7 → 47.3 | craqueDaSelecao |
| zagueiro | maquina | 89 → 89 | 23 → 22 | 34 → 37 | 36.3 → 54.7 | titularDeSerieA |
| zagueiro | fominha | 94 → 94 | 25 → 26 | 35 → 35 | 48.9 → 54.1 | craqueDaSelecao |
| zagueiro | capitao | 82 → 82 | 22.5 → 21 | 35 → 34 | 18.5 → 16.8 | titularDeSerieA |
| zagueiro | professor | 98 → 98 | 23.5 → 23 | 36 → 35 | 96.6 → 96.4 | lendaMundial |
| zagueiro | maquina | 87 → 87 | 24 → 23.5 | 32 → 37 | 15.2 → 25.3 | titularDeSerieA |
| lateral | maquina | 83 → 84 | 27 → 28.5 | 35 → 34 | 9 → 9.3 | titularDeSerieA |
| lateral | fominha | 88 → 88 | 22.5 → 22.5 | 38 → 38 | 21.2 → 60.3 | titularDeSerieA |
| lateral | capitao | 86 → 86 | 24 → 23.5 | 31 → 31 | 10.5 → 12.9 | titularDeSerieA |
| lateral | professor | 84 → 82 | 27 → 27.5 | 31 → 32 | 12.1 → 9.3 | rodadoDoInterior |
| lateral | maquina | 89 → 89 | 23.5 → 22.5 | 34 → 37 | 31.4 → 34.2 | titularDeSerieA |
| lateral | fominha | 79 → 78 | 27.5 → 27 | 37 → 32 | 16.6 → 8.1 | jogadorDeSerieB |
| lateral | capitao | 87 → 87 | 23.5 → 23.5 | 34 → 34 | 17.2 → 17.6 | titularDeSerieA |
| lateral | professor | 88 → 88 | 25 → 24 | 35 → 31 | 33.3 → 49.7 | titularDeSerieA |
| lateral | maquina | 90 → 90 | 23 → 23 | 38 → 37 | 66.9 → 58.9 | craqueDaSelecao |
| lateral | fominha | 91 → 92 | 25 → 25 | 33 → 33 | 35.1 → 43.9 | craqueDaSelecao |
| goleiro | fominha | 89 → 89 | 22 → 22 | 36 → 34 | 48.6 → 20.2 | titularDeSerieA |
| goleiro | capitao | 84 → 84 | 21 → 20.5 | 40 → 39 | 27.4 → 30.4 | titularDeSerieA |
| goleiro | professor | 94 → 94 | 22.5 → 22.5 | 31 → 31 | 50.3 → 48.7 | craqueDaSelecao |
| goleiro | maquina | 86 → 86 | 23 → 23 | 33 → 35 | 28.1 → 21.4 | titularDeSerieA |
| goleiro | fominha | 85 → 85 | 22 → 22.5 | 32 → 32 | 26.6 → 19.2 | titularDeSerieA |
| goleiro | capitao | 87 → 87 | 24 → 23.5 | 36 → 36 | 35.6 → 25 | titularDeSerieA |
| goleiro | professor | 84 → 84 | 21 → 21 | 35 → 35 | 15.3 → 16.6 | titularDeSerieA |
| goleiro | maquina | 88 → 88 | 24 → 22.5 | 33 → 33 | 32.8 → 34.7 | jogadorDeSerieB |
| goleiro | fominha | 88 → 88 | 22 → 22 | 33 → 37 | 43.9 → 40.4 | titularDeSerieA |
| goleiro | capitao | 81 → 81 | 21.5 → 21 | 31 → 30 | 12.3 → 14.8 | promessaQueNaoVingou |
