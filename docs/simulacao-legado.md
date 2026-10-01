# Sanidade da simulação — SPEC 9.3 (T40)

36000 carreiras: 2000 por origem × posição (a SPEC pede 10 mil por célula; rode `SIM_LEGADO=10000 npm run sim:legado` para a amostra cheia). Ritmo Rápido, decisões automáticas.

## Critérios
| Critério | Medido | Meta | Ok |
| --- | --: | --: | --: |
| "Lenda mundial" | 0.47% | ≤ 1% | ✅ |
| Faixas de veredito que aparecem | 8 de 8 | 8 | ✅ |
| Auge, todas as origens | 5.1 · 10.4 · 59.7 · 24.2 | 5 · 10 · 60 · 25 (±2) | ✅ |
| Auge, baseGrande | 5.2 · 10.5 · 60.6 · 23.5 | 5 · 10 · 60 · 25 (±2) | ✅ |
| Auge, peneira | 4.4 · 10.8 · 58.8 · 25.2 | 5 · 10 · 60 · 25 (±2) | ✅ |
| Auge, varzea | 5.7 · 9.9 · 59.6 · 23.8 | 5 · 10 · 60 · 25 (±2) | ✅ |
| Diamante bruto (várzea) | 3.0% | 2% a 4% | ✅ |
| Idade média de aposentadoria por origem | 35.2 · 35.2 · 35.3 | 30 a 39 | ✅ |
| "Lenda do futebol brasileiro" ou mais, por posição | 4.8 · 5.6 · 5.1 · 6.1 · 6.6 · 6.5 | comparável (menor ≥ metade da maior) | ✅ |
| Tempo por carreira | 21.0 ms | < 50 ms | ✅ |

Altura (efeito mensurável e equilibrado): medida no relatório da T13, `docs/simulacao-T13.md`.

## Veredito (% das carreiras)
| Grupo | lendaMundial | lendaDoFutebolBrasileiro | craqueDaSelecao | idoloDeClube | titularDeSerieA | promessaQueNaoVingou | rodadoDoInterior | jogadorDeSerieB | Nota média |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| todas | 0.5% | 5.3% | 4.8% | 10.2% | 47.9% | 12.0% | 7.1% | 12.2% | 29.2 |
| baseGrande | 0.6% | 5.7% | 4.7% | 9.2% | 49.8% | 21.5% | 2.1% | 6.4% | 29.6 |
| peneira | 0.3% | 4.6% | 4.5% | 10.5% | 47.9% | 8.4% | 8.5% | 15.3% | 28.6 |
| varzea | 0.5% | 5.7% | 5.2% | 11.0% | 45.9% | 6.2% | 10.6% | 15.0% | 29.4 |
| goleiro | 0.3% | 4.5% | 4.8% | 8.9% | 45.0% | 6.6% | 11.7% | 18.3% | 27.2 |
| zagueiro | 0.4% | 5.2% | 5.1% | 8.9% | 47.5% | 9.5% | 9.3% | 14.1% | 28.7 |
| lateral | 0.4% | 4.7% | 4.8% | 8.0% | 48.0% | 11.6% | 8.6% | 13.9% | 27.8 |
| volante | 0.6% | 5.5% | 4.5% | 11.0% | 48.9% | 13.3% | 5.5% | 10.8% | 29.7 |
| meia | 0.6% | 6.0% | 4.6% | 11.3% | 49.3% | 14.4% | 4.7% | 9.1% | 30.1 |
| atacante | 0.5% | 6.0% | 5.0% | 13.5% | 48.5% | 16.8% | 2.6% | 7.2% | 31.7 |

## Componentes da nota (média, 0–1) por posição
| Posição | selecao | titulos | premios | numeros | idolatria | longevidade |
| --- | --: | --: | --: | --: | --: | --: |
| goleiro | 0.12 | 0.28 | 0.12 | 0.72 | 0.47 | 0.61 |
| zagueiro | 0.13 | 0.30 | 0.13 | 0.74 | 0.49 | 0.63 |
| lateral | 0.12 | 0.29 | 0.12 | 0.74 | 0.46 | 0.62 |
| volante | 0.14 | 0.31 | 0.13 | 0.77 | 0.49 | 0.64 |
| meia | 0.14 | 0.33 | 0.15 | 0.73 | 0.52 | 0.65 |
| atacante | 0.14 | 0.33 | 0.18 | 0.79 | 0.54 | 0.66 |

## Rótulos (% das carreiras; "principal" = o que vai no cartão)
| Rótulo | Tem | Principal |
| --- | --: | --: |
| dezEFaixa | 1.2% | 1.2% |
| heroiDaCopa | 3.3% | 3.0% |
| oriundoCampeao | 0.3% | 0.1% |
| goleiroArtilheiro | 0.0% | 0.0% |
| torcedorQueVirouIdolo | 0.0% | 0.0% |
| diamanteDaVarzea | 1.0% | 0.8% |
| vilaoDaCopa | 2.9% | 2.5% |
| idoloDeUmClubeSo | 0.0% | 0.0% |
| craqueEsquecido | 0.6% | 0.6% |
| ganhouMuitoEGastouTudo | 0.0% | 0.0% |
| carrascoDeClassico | 14.1% | 11.3% |
| reiDoEstadual | 25.4% | 18.3% |
| aposentadoriaTranquila | 41.2% | 21.3% |
| rodado | 29.1% | 10.7% |
| (nenhum rótulo) | 30.3% | — |

## Diagnóstico: do teto ao auge
| Grupo | Teto (potencial) | Auge | Teto − auge | Idade do auge | Minutos 16–24 | Minutos na carreira | Convocado para a principal | Prêmios (média) | Títulos (média) |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| baseGrande | 87.1 | 86.9 | 0.2 | 24.4 | 0.60 | 0.72 | 43.8% | 3.3 | 7.0 |
| peneira | 87.1 | 86.7 | 0.4 | 24.8 | 0.65 | 0.76 | 42.6% | 3.6 | 6.4 |
| varzea | 87.3 | 86.9 | 0.4 | 24.6 | 0.63 | 0.75 | 44.2% | 4.2 | 6.1 |
| goleiro | 87.2 | 86.2 | 1.0 | 24.6 | 0.58 | 0.72 | 44.5% | 3.0 | 5.9 |
| zagueiro | 87.2 | 86.6 | 0.6 | 24.4 | 0.60 | 0.74 | 44.1% | 3.5 | 6.3 |
| lateral | 87.1 | 86.5 | 0.7 | 24.3 | 0.61 | 0.73 | 43.0% | 3.0 | 6.2 |
| volante | 87.2 | 86.8 | 0.4 | 23.8 | 0.64 | 0.75 | 45.4% | 3.5 | 6.5 |
| meia | 87.1 | 87.4 | -0.3 | 25.6 | 0.66 | 0.76 | 42.4% | 4.0 | 6.9 |
| atacante | 87.2 | 87.5 | -0.4 | 24.7 | 0.68 | 0.77 | 41.9% | 5.3 | 7.1 |

## Distribuição (percentis) — base para calibrar tetos e cortes
| Medida | p10 | p25 | p50 | p75 | p90 | p99 |
| --- | --: | --: | --: | --: | --: | --: |
| Nota de legado | 14 | 18 | 25 | 35 | 51 | 87 |
| Idolatria máxima | 15 | 26 | 45 | 70 | 98 | 100 |
| Jogos | 542 | 631 | 740 | 861 | 977 | 1150 |
| Temporadas na elite | 0 | 4 | 11 | 13 | 15 | 18 |
| Títulos | 1 | 3 | 5 | 9 | 14 | 22 |
| Prêmios | 0 | 0 | 2 | 5 | 10 | 23 |
| Convocações (principal) | 0 | 0 | 0 | 9 | 20 | 30 |
| Clubes | 3 | 4 | 5 | 6 | 6 | 8 |

## Outros números
| Origem | Auge <80 | Camisa 10 no clube | Capitão no clube | Patrimônio mediano (R$ mi) | Títulos (média) | Convocado para a principal |
| --- | --: | --: | --: | --: | --: | --: |
| baseGrande | 0.2% | 29.9% | 49.2% | 401.5 | 7.0 | 43.8% |
| peneira | 0.8% | 35.1% | 52.9% | 379.6 | 6.4 | 42.6% |
| varzea | 1.0% | 37.8% | 54.2% | 398.4 | 6.1 | 44.2% |
