# Sanidade da simulação — SPEC 9.3 (T40)

36000 carreiras: 2000 por origem × posição (a SPEC pede 10 mil por célula; rode `SIM_LEGADO=10000 npm run sim:legado` para a amostra cheia). Ritmo Rápido, decisões automáticas.

## Critérios
| Critério | Medido | Meta | Ok |
| --- | --: | --: | --: |
| "Lenda mundial" | 0.46% | ≤ 1% | ✅ |
| Faixas de veredito que aparecem | 8 de 8 | 8 | ✅ |
| Maior faixa de veredito | 29.5% | ≤ 35% | ✅ |
| Auge, todas as origens | 5.1 · 10.5 · 59.8 · 24.0 | 5 · 10 · 60 · 25 (±2) | ✅ |
| Auge, baseGrande | 5.2 · 10.6 · 60.6 · 23.4 | 5 · 10 · 60 · 25 (±2) | ✅ |
| Auge, peneira | 4.4 · 10.8 · 59.0 · 25.0 | 5 · 10 · 60 · 25 (±2) | ✅ |
| Auge, varzea | 5.8 · 10.0 · 59.7 · 23.6 | 5 · 10 · 60 · 25 (±2) | ✅ |
| Diamante bruto (várzea) | 3.0% | 2% a 4% | ✅ |
| Idade média de aposentadoria por origem | 35.2 · 35.2 · 35.3 | 30 a 39 | ✅ |
| "Lenda do futebol brasileiro" ou mais, por posição | 4.8 · 5.7 · 5.3 · 6.2 · 6.6 · 6.6 | comparável (menor ≥ metade da maior) | ✅ |
| Tempo por carreira | 22.3 ms | < 50 ms | ✅ |

Altura (efeito mensurável e equilibrado): medida no relatório da T13, `docs/simulacao-T13.md`.

## Veredito (% das carreiras)
| Grupo | lendaMundial | lendaDoFutebolBrasileiro | craqueDaSelecao | idoloDeClube | titularDeSerieA | promessaQueNaoVingou | rodadoDoInterior | jogadorDeSerieB | Nota média |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| todas | 0.5% | 5.4% | 5.0% | 23.4% | 29.5% | 12.4% | 12.1% | 11.8% | 29.3 |
| baseGrande | 0.6% | 5.7% | 5.0% | 21.0% | 33.3% | 22.3% | 5.4% | 6.8% | 29.7 |
| peneira | 0.3% | 4.8% | 4.6% | 24.3% | 28.6% | 8.5% | 14.6% | 14.4% | 28.6 |
| varzea | 0.4% | 5.7% | 5.3% | 24.9% | 26.5% | 6.5% | 16.3% | 14.4% | 29.5 |
| goleiro | 0.3% | 4.5% | 5.2% | 20.5% | 25.9% | 7.0% | 18.2% | 18.5% | 27.4 |
| zagueiro | 0.4% | 5.3% | 5.3% | 22.1% | 28.3% | 10.1% | 15.0% | 13.6% | 28.7 |
| lateral | 0.4% | 4.9% | 5.0% | 20.3% | 28.5% | 12.6% | 14.5% | 13.9% | 27.9 |
| volante | 0.5% | 5.7% | 4.5% | 24.3% | 30.2% | 14.0% | 10.4% | 10.4% | 29.8 |
| meia | 0.6% | 6.0% | 4.7% | 24.8% | 32.4% | 14.6% | 8.6% | 8.2% | 30.1 |
| atacante | 0.5% | 6.1% | 5.1% | 28.3% | 31.5% | 16.4% | 5.8% | 6.3% | 31.8 |

## Componentes da nota (média, 0–1) por posição
| Posição | selecao | titulos | premios | numeros | idolatria | longevidade |
| --- | --: | --: | --: | --: | --: | --: |
| goleiro | 0.12 | 0.28 | 0.12 | 0.72 | 0.45 | 0.61 |
| zagueiro | 0.13 | 0.30 | 0.13 | 0.74 | 0.47 | 0.63 |
| lateral | 0.12 | 0.29 | 0.12 | 0.74 | 0.45 | 0.62 |
| volante | 0.14 | 0.31 | 0.13 | 0.77 | 0.48 | 0.64 |
| meia | 0.14 | 0.33 | 0.15 | 0.73 | 0.51 | 0.65 |
| atacante | 0.14 | 0.34 | 0.18 | 0.79 | 0.52 | 0.66 |

## Rótulos (% das carreiras; "principal" = o que vai no cartão)
| Rótulo | Tem | Principal |
| --- | --: | --: |
| dezEFaixa | 1.2% | 1.2% |
| heroiDaCopa | 3.3% | 3.1% |
| oriundoCampeao | 0.3% | 0.1% |
| goleiroArtilheiro | 0.0% | 0.0% |
| torcedorQueVirouIdolo | 0.0% | 0.0% |
| diamanteDaVarzea | 1.0% | 0.8% |
| vilaoDaCopa | 2.9% | 2.4% |
| idoloDeUmClubeSo | 0.0% | 0.0% |
| craqueEsquecido | 0.5% | 0.5% |
| ganhouMuitoEGastouTudo | 0.0% | 0.0% |
| carrascoDeClassico | 13.5% | 10.8% |
| reiDoEstadual | 24.8% | 18.0% |
| aposentadoriaTranquila | 40.7% | 21.6% |
| rodado | 38.8% | 14.0% |
| operarioDaBola | 12.9% | 12.9% |
| cascaGrossa | 5.2% | 5.2% |
| boleiroRaiz | 9.4% | 9.4% |

## Diagnóstico: do teto ao auge
| Grupo | Teto (potencial) | Auge | Teto − auge | Idade do auge | Minutos 16–24 | Minutos na carreira | Convocado para a principal | Prêmios (média) | Títulos (média) |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| baseGrande | 87.1 | 86.9 | 0.2 | 24.3 | 0.60 | 0.72 | 45.0% | 3.3 | 7.1 |
| peneira | 87.1 | 86.7 | 0.4 | 24.8 | 0.66 | 0.76 | 43.1% | 3.6 | 6.4 |
| varzea | 87.3 | 86.9 | 0.4 | 24.6 | 0.63 | 0.75 | 44.9% | 4.2 | 6.1 |
| goleiro | 87.2 | 86.2 | 1.0 | 24.6 | 0.58 | 0.72 | 44.9% | 3.0 | 6.1 |
| zagueiro | 87.2 | 86.6 | 0.6 | 24.4 | 0.60 | 0.74 | 45.1% | 3.4 | 6.3 |
| lateral | 87.1 | 86.5 | 0.7 | 24.3 | 0.62 | 0.73 | 43.7% | 3.0 | 6.3 |
| volante | 87.2 | 86.8 | 0.4 | 23.8 | 0.64 | 0.75 | 46.2% | 3.4 | 6.6 |
| meia | 87.1 | 87.4 | -0.3 | 25.6 | 0.66 | 0.76 | 43.6% | 3.9 | 6.9 |
| atacante | 87.2 | 87.5 | -0.4 | 24.7 | 0.68 | 0.77 | 42.6% | 5.2 | 7.1 |

## Distribuição (percentis) — base para calibrar tetos e cortes
| Medida | p10 | p25 | p50 | p75 | p90 | p99 |
| --- | --: | --: | --: | --: | --: | --: |
| Nota de legado | 14 | 18 | 25 | 35 | 51 | 87 |
| Idolatria máxima | 12 | 23 | 44 | 70 | 99 | 100 |
| Jogos | 546 | 633 | 740 | 861 | 976 | 1147 |
| Temporadas na elite | 1 | 5 | 10 | 13 | 15 | 18 |
| Títulos | 1 | 3 | 5 | 9 | 14 | 22 |
| Prêmios | 0 | 0 | 2 | 5 | 9 | 23 |
| Convocações (principal) | 0 | 0 | 0 | 9 | 20 | 30 |
| Clubes | 3 | 4 | 5 | 6 | 9 | 12 |

## Outros números
| Origem | Auge <80 | Camisa 10 no clube | Capitão no clube | Patrimônio mediano (R$ mi) | Títulos (média) | Convocado para a principal |
| --- | --: | --: | --: | --: | --: | --: |
| baseGrande | 0.2% | 28.9% | 48.9% | 396.0 | 7.1 | 45.0% |
| peneira | 0.8% | 34.3% | 52.8% | 375.9 | 6.4 | 43.1% |
| varzea | 0.9% | 37.1% | 54.0% | 392.6 | 6.1 | 44.9% |
