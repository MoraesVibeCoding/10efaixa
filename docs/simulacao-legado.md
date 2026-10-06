# Sanidade da simulação — SPEC 9.3 (T40)

8400 carreiras: 400 por origem × posição (a SPEC pede 10 mil por célula; rode `SIM_LEGADO=10000 npm run sim:legado` para a amostra cheia). Ritmo Rápido, decisões automáticas.

## Critérios
| Critério | Medido | Meta | Ok |
| --- | --: | --: | --: |
| "Lenda mundial" | 0.40% | ≤ 1% | ✅ |
| Faixas de veredito que aparecem | 8 de 8 | 8 | ✅ |
| Maior faixa de veredito | 29.8% | ≤ 35% | ✅ |
| Auge, todas as origens | 5.5 · 9.6 · 59.9 · 24.1 | 5 · 10 · 60 · 25 (±2) | ✅ |
| Auge, baseGrande | 5.3 · 9.3 · 61.6 · 23.5 | 5 · 10 · 60 · 25 (±2) | ✅ |
| Auge, peneira | 5.0 · 9.9 · 59.4 · 25.1 | 5 · 10 · 60 · 25 (±2) | ✅ |
| Auge, varzea | 6.4 · 9.8 · 58.8 · 23.7 | 5 · 10 · 60 · 25 (±2) | ✅ |
| Diamante bruto (várzea) | 3.0% | 2% a 4% | ✅ |
| Idade média de aposentadoria por origem | 35.2 · 35.2 · 35.2 | 30 a 39 | ✅ |
| "Lenda do futebol brasileiro" ou mais, por posição | 4.1 · 4.7 · 5.9 · 6.8 · 6.3 · 6.6 · 7.4 | comparável (menor ≥ metade da maior) | ✅ |
| Tempo por carreira | 36.6 ms | < 50 ms | ✅ |

Altura (efeito mensurável e equilibrado): medida no relatório da T13, `docs/simulacao-T13.md`.

## Veredito (% das carreiras)
| Grupo | lendaMundial | lendaDoFutebolBrasileiro | craqueDaSelecao | idoloDeClube | titularDeSerieA | promessaQueNaoVingou | rodadoDoInterior | jogadorDeSerieB | Nota média |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| todas | 0.4% | 5.6% | 4.8% | 22.6% | 29.8% | 6.8% | 13.9% | 16.0% | 29.3 |
| baseGrande | 0.5% | 6.0% | 4.5% | 20.9% | 33.5% | 12.2% | 8.5% | 13.9% | 29.6 |
| peneira | 0.3% | 4.6% | 4.8% | 23.6% | 29.0% | 5.0% | 15.3% | 17.4% | 28.7 |
| varzea | 0.5% | 6.1% | 5.3% | 23.3% | 27.0% | 3.3% | 17.9% | 16.7% | 29.6 |
| goleiro | 0.1% | 4.0% | 5.8% | 19.0% | 28.3% | 2.3% | 18.3% | 22.2% | 27.0 |
| zagueiro | 0.3% | 4.4% | 4.5% | 22.0% | 26.8% | 4.7% | 17.8% | 19.6% | 27.9 |
| lateral | 0.6% | 5.3% | 4.8% | 19.1% | 26.9% | 4.6% | 19.5% | 19.2% | 27.8 |
| volante | 0.4% | 6.3% | 4.7% | 22.7% | 30.0% | 6.5% | 14.4% | 15.0% | 29.7 |
| meia | 0.7% | 5.7% | 4.8% | 23.5% | 32.4% | 8.3% | 10.5% | 14.1% | 29.6 |
| ponta | 0.3% | 6.3% | 4.7% | 24.8% | 33.0% | 8.8% | 9.6% | 12.6% | 31.3 |
| atacante | 0.5% | 6.9% | 4.5% | 27.3% | 31.6% | 12.7% | 7.1% | 9.5% | 31.8 |

## Componentes da nota (média, 0–1) por posição
| Posição | selecao | titulos | premios | numeros | idolatria | longevidade |
| --- | --: | --: | --: | --: | --: | --: |
| goleiro | 0.12 | 0.28 | 0.11 | 0.72 | 0.44 | 0.59 |
| zagueiro | 0.12 | 0.30 | 0.13 | 0.74 | 0.46 | 0.61 |
| lateral | 0.13 | 0.29 | 0.12 | 0.74 | 0.44 | 0.61 |
| volante | 0.14 | 0.31 | 0.13 | 0.76 | 0.47 | 0.62 |
| meia | 0.13 | 0.33 | 0.15 | 0.73 | 0.49 | 0.63 |
| ponta | 0.13 | 0.34 | 0.15 | 0.85 | 0.48 | 0.64 |
| atacante | 0.14 | 0.34 | 0.19 | 0.79 | 0.52 | 0.65 |

## Rótulos (% das carreiras; "principal" = o que vai no cartão)
| Rótulo | Tem | Principal |
| --- | --: | --: |
| dezEFaixa | 1.6% | 1.6% |
| heroiDaCopa | 3.5% | 3.1% |
| oriundoCampeao | 0.3% | 0.1% |
| goleiroArtilheiro | 0.0% | 0.0% |
| torcedorQueVirouIdolo | 0.0% | 0.0% |
| diamanteDaVarzea | 1.0% | 0.7% |
| vilaoDaCopa | 2.8% | 2.3% |
| idoloDeUmClubeSo | 0.3% | 0.2% |
| craqueEsquecido | 0.3% | 0.3% |
| ganhouMuitoEGastouTudo | 14.0% | 13.1% |
| carrascoDeClassico | 13.1% | 8.2% |
| reiDoEstadual | 25.3% | 15.6% |
| aposentadoriaTranquila | 36.1% | 16.7% |
| rodado | 39.5% | 13.5% |
| operarioDaBola | 10.9% | 10.9% |
| cascaGrossa | 4.1% | 4.1% |
| boleiroRaiz | 9.4% | 9.4% |

## Diagnóstico: do teto ao auge
| Grupo | Teto (potencial) | Auge | Teto − auge | Idade do auge | Minutos 16–24 | Minutos na carreira | Convocado para a principal | Prêmios (média) | Títulos (média) |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| baseGrande | 87.1 | 86.9 | 0.2 | 24.2 | 0.60 | 0.72 | 44.3% | 3.3 | 7.1 |
| peneira | 87.1 | 86.7 | 0.4 | 24.7 | 0.66 | 0.76 | 41.9% | 3.5 | 6.5 |
| varzea | 87.3 | 86.9 | 0.4 | 24.6 | 0.63 | 0.75 | 44.6% | 4.2 | 6.2 |
| goleiro | 87.1 | 86.1 | 0.9 | 24.6 | 0.58 | 0.72 | 46.2% | 2.9 | 6.1 |
| zagueiro | 87.1 | 86.4 | 0.7 | 24.5 | 0.59 | 0.73 | 44.0% | 3.4 | 6.3 |
| lateral | 87.3 | 86.4 | 0.9 | 24.6 | 0.60 | 0.72 | 42.3% | 3.0 | 6.3 |
| volante | 87.2 | 86.8 | 0.4 | 24.1 | 0.63 | 0.74 | 46.2% | 3.4 | 6.5 |
| meia | 87.2 | 87.4 | -0.2 | 25.8 | 0.65 | 0.76 | 44.5% | 3.9 | 6.8 |
| ponta | 87.1 | 87.1 | 0.1 | 23.3 | 0.66 | 0.76 | 41.0% | 3.9 | 7.0 |
| atacante | 87.2 | 87.6 | -0.4 | 24.7 | 0.68 | 0.77 | 40.9% | 5.4 | 7.2 |

## Distribuição (percentis) — base para calibrar tetos e cortes
| Medida | p10 | p25 | p50 | p75 | p90 | p99 |
| --- | --: | --: | --: | --: | --: | --: |
| Nota de legado | 14 | 18 | 25 | 35 | 52 | 85 |
| Idolatria máxima | 11 | 22 | 42 | 69 | 97 | 100 |
| Jogos | 540 | 629 | 740 | 860 | 973 | 1152 |
| Temporadas na elite | 1 | 5 | 10 | 13 | 15 | 18 |
| Títulos | 1 | 3 | 6 | 9 | 13 | 22 |
| Prêmios | 0 | 0 | 2 | 5 | 9 | 23 |
| Convocações (principal) | 0 | 0 | 0 | 8 | 20 | 30 |
| Clubes | 3 | 4 | 5 | 6 | 9 | 12 |

## Outros números
| Origem | Auge <80 | Camisa 10 no clube | Capitão no clube | Patrimônio mediano (R$ mi) | Títulos (média) | Convocado para a principal |
| --- | --: | --: | --: | --: | --: | --: |
| baseGrande | 0.4% | 28.4% | 48.5% | 360.1 | 7.1 | 44.3% |
| peneira | 0.6% | 32.8% | 52.0% | 350.1 | 6.5 | 41.9% |
| varzea | 1.3% | 34.3% | 51.8% | 369.7 | 6.2 | 44.6% |
