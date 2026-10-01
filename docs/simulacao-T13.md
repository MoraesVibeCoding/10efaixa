# Relatório de simulação — T13

10000 carreiras (16→35 anos, reunião automática pelo arquétipo, contexto sorteado; sem clubes ainda). Semente 2026.
Tempo médio por carreira: **0.152 ms** (meta < 50 ms).

## Por origem
| Origem | n | Overall inicial | Teto médio | Auge médio | p10 | p50 | p90 | Máx | Idade do auge | % ≥75 | % ≥85 |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| baseGrande | 3330 | 50 | 87.7 | 86.9 | 82 | 87 | 92 | 98 | 25.7 | 100 | 76.5 |
| peneira | 3266 | 44.1 | 87.7 | 86.5 | 82 | 86 | 91 | 97 | 26.4 | 100 | 74.3 |
| varzea | 3404 | 36.1 | 87.8 | 87 | 82 | 87 | 93 | 98 | 26.7 | 100 | 76.6 |

Diamante bruto na várzea: **3.00%** (meta 2–4%).

## Auge por faixa (meta 9.3: 5% · 10% · 60% · 25%)
| Grupo | 95+ | 90–94 | 85–89 | 80–84 | Ganho em fundamentos e físico |
| --- | --: | --: | --: | --: | --: |
| todas | 5% | 10.1% | 60.7% | 24.1% | — |
| baseGrande | 5.2% | 9.5% | 61.9% | 23.5% | +36.2 |
| peneira | 3.8% | 9.4% | 61.1% | 25.5% | +41.7 |
| varzea | 6% | 11.4% | 59.2% | 23.3% | +51.6 |

## Por posição
| Posição | n | Auge médio |
| --- | --: | --: |
| goleiro | 1690 | 87 |
| zagueiro | 1703 | 86.8 |
| lateral | 1604 | 86.6 |
| volante | 1676 | 86.8 |
| meia | 1676 | 86.9 |
| atacante | 1651 | 86.7 |

## Efeito da altura (terços da faixa da posição; valores no auge)
| Posição | Altura | n | Overall | Jogo aéreo | Drible | Velocidade |
| --- | --- | --: | --: | --: | --: | --: |
| goleiro | baixo | 387 | 86.8 | 89.4 | 69.6 | 87.7 |
| goleiro | medio | 524 | 86.9 | 92.1 | 67.9 | 86.3 |
| goleiro | alto | 779 | 87.1 | 94.3 | 66.2 | 84.8 |
| zagueiro | baixo | 420 | 86.5 | 88 | 72.6 | 76.4 |
| zagueiro | medio | 581 | 86.9 | 90.7 | 71.1 | 75.3 |
| zagueiro | alto | 702 | 86.8 | 93.2 | 68.3 | 73 |
| lateral | baixo | 401 | 86.5 | 68.2 | 85.2 | 92.1 |
| lateral | medio | 555 | 86.7 | 72.2 | 84.1 | 90.8 |
| lateral | alto | 648 | 86.5 | 76.1 | 82.3 | 89.9 |
| volante | baixo | 410 | 86.7 | 72.9 | 79.3 | 81.5 |
| volante | medio | 555 | 86.9 | 76.4 | 77.9 | 80.3 |
| volante | alto | 711 | 86.7 | 79.7 | 75.7 | 79.1 |
| meia | baixo | 427 | 87 | 68.3 | 88 | 82.4 |
| meia | medio | 589 | 86.9 | 72.4 | 86.2 | 81.5 |
| meia | alto | 660 | 86.9 | 77.1 | 84.3 | 80.3 |
| atacante | baixo | 428 | 86.6 | 76.5 | 89.9 | 84.6 |
| atacante | medio | 550 | 86.6 | 81.1 | 87.5 | 83.7 |
| atacante | alto | 673 | 86.9 | 86.5 | 85.1 | 81.5 |
