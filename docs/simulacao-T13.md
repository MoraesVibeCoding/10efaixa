# Relatório de simulação — T13

10000 carreiras (16→35 anos, reunião automática pelo arquétipo, contexto sorteado; sem clubes ainda). Semente 2026.
Tempo médio por carreira: **0.156 ms** (meta < 50 ms).

## Por origem
| Origem | n | Overall inicial | Teto médio | Auge médio | p10 | p50 | p90 | Máx | Idade do auge | % ≥75 | % ≥85 |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| baseGrande | 3330 | 50 | 87.7 | 86.8 | 82 | 87 | 92 | 98 | 25.6 | 100 | 76.5 |
| peneira | 3266 | 44.1 | 87.7 | 86.4 | 82 | 86 | 91 | 97 | 26.2 | 100 | 73.8 |
| varzea | 3404 | 36.1 | 87.8 | 86.9 | 82 | 87 | 92 | 98 | 26.3 | 100 | 76.1 |

Diamante bruto na várzea: **3.00%** (meta 2–4%).

## Auge por faixa (meta 9.3: 5% · 10% · 60% · 25%)
| Grupo | 95+ | 90–94 | 85–89 | 80–84 | Ganho em fundamentos e físico |
| --- | --: | --: | --: | --: | --: |
| todas | 4.6% | 10.3% | 60.6% | 24.4% | — |
| baseGrande | 5% | 9.5% | 62% | 23.5% | +36.2 |
| peneira | 3.3% | 9.9% | 60.7% | 26% | +41.7 |
| varzea | 5.5% | 11.4% | 59.2% | 23.8% | +51.6 |

## Por posição
| Posição | n | Auge médio |
| --- | --: | --: |
| goleiro | 1690 | 86.9 |
| zagueiro | 1703 | 86.7 |
| lateral | 1604 | 86.5 |
| volante | 1676 | 86.7 |
| meia | 1676 | 86.8 |
| atacante | 1651 | 86.7 |

## Efeito da altura (terços da faixa da posição; valores no auge)
| Posição | Altura | n | Overall | Jogo aéreo | Drible | Velocidade |
| --- | --- | --: | --: | --: | --: | --: |
| goleiro | baixo | 387 | 86.8 | 89.4 | 69.5 | 87.7 |
| goleiro | medio | 524 | 86.9 | 92 | 67.8 | 86.3 |
| goleiro | alto | 779 | 87.1 | 94.3 | 66.1 | 84.8 |
| zagueiro | baixo | 420 | 86.5 | 88 | 72.5 | 76.4 |
| zagueiro | medio | 581 | 86.8 | 90.6 | 71 | 75.3 |
| zagueiro | alto | 702 | 86.8 | 93.1 | 68.2 | 73 |
| lateral | baixo | 401 | 86.4 | 68.1 | 85 | 92.1 |
| lateral | medio | 555 | 86.6 | 72.1 | 83.9 | 90.8 |
| lateral | alto | 648 | 86.4 | 76.1 | 82.2 | 89.9 |
| volante | baixo | 410 | 86.6 | 72.9 | 79.2 | 81.5 |
| volante | medio | 555 | 86.8 | 76.4 | 77.7 | 80.3 |
| volante | alto | 711 | 86.7 | 79.7 | 75.6 | 79.1 |
| meia | baixo | 427 | 86.9 | 68.3 | 87.9 | 82.4 |
| meia | medio | 589 | 86.8 | 72.4 | 86 | 81.5 |
| meia | alto | 660 | 86.8 | 77.1 | 84.2 | 80.3 |
| atacante | baixo | 428 | 86.5 | 76.4 | 89.7 | 84.6 |
| atacante | medio | 550 | 86.6 | 81.1 | 87.4 | 83.7 |
| atacante | alto | 673 | 86.8 | 86.5 | 85 | 81.5 |
