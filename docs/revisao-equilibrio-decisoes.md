# Revisão: equilíbrio das decisões e reuniões (feedback do usuário)

> Anotado em 2026-10-07. Origem: o usuário jogou a carreira **completa** e sentiu desequilíbrio. Esta nota entra na revisão de reuniões e na validação final (`docs/validacao-final.md`).

## O que o usuário sentiu
1. **Muitas reuniões com a comissão.**
2. **Muitas decisões de contrato e renovação.**
3. **Decisões de vida pessoal na média** (festa, casa, investir, redes).
4. **Pouco jogo mesmo:** faltam decisões **em campo** e de **postura em campo**.

(Antes, no Normal, o usuário já tinha notado que só apareciam renovação e venda não autorizada.)

## O que eu medi (8 carreiras por ritmo, escolhas automáticas, 2026-10-07)
| Ritmo | Decisões por carreira | Reuniões | Renovação | Venda não autorizada |
|---|---|---|---|---|
| Rápido | 15,8 | 0 | 5,1 | 2,1 |
| Normal | 46,8 | **18,4** | 6,6 | 2,4 |
| Completo | 66,8 | **36,8** | 6,6 | 2,5 |

- **Completo: 55% das decisões são reuniões** (36,8 de 66,8); no Normal, 39%.
- Sem as reuniões, o catálogo é de **25 eventos** (~18 aparecem de verdade). Em carreira de ~20 anos, **renovação (6,6)** e **venda não autorizada (2,4)** estão entre os mais frequentes; vida fora de campo (casa 3,6, festa 2,4, investir 1,8, redes 1,3) soma boa parte do resto.
- **Eventos de campo** (pênalti e Copa) aparecem ~1 a 2 vezes por carreira; não há decisão de **postura em campo** (cobrança, discussão com árbitro, cera, entrevista pós-jogo, jogo duro, entrega para o time).
- Desde a T28d existe também a **tela de propostas** (a cada janela com oferta), que soma decisões de contrato.

## Causas prováveis
- A reunião é **fixa em todo semestre com clube** no Completo (2 por ano) e no Normal 1 por ano, independentemente de ter algo a decidir.
- O catálogo é pequeno (25) e concentrado em dinheiro, contrato e vida fora de campo; o SPEC prevê 80+ (T25b) com os de papel em campo, mas só 25 existem.
- Renovação e proposta foram tratadas como telas separadas, e a janela de transferência acontece quase todo ano.

## Ideias para a revisão (a decidir com o usuário; nada foi mudado)
- **Reuniões:** (a) reunião só quando algo muda (novo técnico, lesão, mudança de papel, início do semestre depois de x anos) ou (b) uma por ano no Completo; (c) a nova reunião em **3 ideias** (`docs/proposta-reuniao-3-ideias.md`) já é mais rápida de decidir.
- **Contrato e renovação:** unir **renovação** e **propostas** numa tela só (`docs/proposta-tela-contratos.md`), e **limitar a frequência** (por exemplo, janela só com contrato acabando ou jogador em ascensão; teto de decisões de contrato por carreira).
- **Vida pessoal:** manter, mas com peso menor e cota por carreira.
- **Mais jogo:** criar eventos de **campo** e de **postura** (T25b): pênalti e cobrança, cartão e discussão, entrevista pós-jogo, reação à vaia, postura no vestiário depois de derrota, jogo duro no clássico, entrega para o time, e os marcos da T25c (20 já escritos, em `wip`). Meta de composição por carreira a definir (por exemplo, ≥ 40% das decisões de campo ou de postura).
- **Medir de novo** depois de cada mudança com o mesmo script de contagem, e registrar aqui.
