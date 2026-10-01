# Relatório de simulação — T13

10000 carreiras (16→35 anos, reunião automática pelo arquétipo, contexto sorteado; sem clubes ainda). Semente 2026.
Tempo médio por carreira: **0.155 ms** (meta < 50 ms).

## Por origem
| Origem | n | Overall inicial | Teto médio | Auge médio | p10 | p50 | p90 | Máx | Idade do auge | % ≥75 | % ≥85 |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| baseGrande | 3330 | 50 | 87.1 | 86.3 | 82 | 86 | 90 | 98 | 25.7 | 100 | 74.9 |
| peneira | 3266 | 44.1 | 87.1 | 86 | 82 | 86 | 90 | 97 | 26.3 | 100 | 71.8 |
| varzea | 3404 | 36.1 | 87.2 | 86.5 | 82 | 86 | 92 | 98 | 26.6 | 100 | 74.3 |

Diamante bruto na várzea: **3.00%** (meta 2–4%).

## Auge por faixa (meta 9.3: 5% · 10% · 60% · 25%)
| Grupo | 95+ | 90–94 | 85–89 | 80–84 | Ganho em fundamentos e físico |
| --- | --: | --: | --: | --: | --: |
| todas | 3% | 8.8% | 61.8% | 26.2% | — |
| baseGrande | 3.1% | 8.1% | 63.6% | 25.1% | +35.6 |
| peneira | 2.1% | 8.6% | 61.1% | 28% | +41.1 |
| varzea | 3.8% | 9.6% | 60.8% | 25.6% | +50.9 |

## Por posição
| Posição | n | Auge médio |
| --- | --: | --: |
| goleiro | 1690 | 86.5 |
| zagueiro | 1703 | 86.3 |
| lateral | 1604 | 86 |
| volante | 1676 | 86.2 |
| meia | 1676 | 86.4 |
| atacante | 1651 | 86.2 |

## Efeito da altura (terços da faixa da posição; valores no auge)
| Posição | Altura | n | Overall | Jogo aéreo | Drible | Velocidade |
| --- | --- | --: | --: | --: | --: | --: |
| goleiro | baixo | 387 | 86.4 | 88.9 | 68.9 | 87.4 |
| goleiro | medio | 524 | 86.5 | 91.6 | 67 | 86 |
| goleiro | alto | 779 | 86.6 | 94.1 | 65.2 | 84.3 |
| zagueiro | baixo | 420 | 86 | 87.5 | 71.9 | 75.9 |
| zagueiro | medio | 581 | 86.4 | 90.2 | 70.2 | 74.7 |
| zagueiro | alto | 702 | 86.3 | 92.9 | 67.4 | 72.3 |
| lateral | baixo | 401 | 86 | 67.3 | 84.5 | 91.8 |
| lateral | medio | 555 | 86 | 71.2 | 83.3 | 90.5 |
| lateral | alto | 648 | 86 | 75.4 | 81.7 | 89.6 |
| volante | baixo | 410 | 86.1 | 72.1 | 78.5 | 81.1 |
| volante | medio | 555 | 86.3 | 75.7 | 77.1 | 79.9 |
| volante | alto | 711 | 86.2 | 79 | 74.9 | 78.6 |
| meia | baixo | 427 | 86.5 | 67.5 | 87.5 | 82 |
| meia | medio | 589 | 86.4 | 71.7 | 85.7 | 81.1 |
| meia | alto | 660 | 86.4 | 76.4 | 83.7 | 79.8 |
| atacante | baixo | 428 | 86 | 75.6 | 89.3 | 84.1 |
| atacante | medio | 550 | 86.2 | 80.5 | 87.1 | 83.4 |
| atacante | alto | 673 | 86.3 | 85.9 | 84.5 | 81 |
