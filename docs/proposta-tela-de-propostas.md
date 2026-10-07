# Proposta: tela de propostas de clube (SPEC 6.12) — aguardando "DE ACORDO"

> Nada foi codado. Origem: relato do usuário em 2026-10-07 ("fiz a carreira completa, mas em nenhum momento tive a opção de receber propostas, e era mudado de time automaticamente").

## Diagnóstico (confirmado no código)
- `src/engine/career.ts` (~linha 527–548): a cada temporada o motor gera as ofertas (`generateOffers`, Brasil e Europa) e **escolhe sozinho** com `chooseOffer` (pesos do temperamento). O jogador nunca vê a oferta.
- Só viram tela: renovação, proposta do clube de coração, proposta do rival, retorno ao formador e "realizar o sonho" (eventos de `events.json`).
- O SPEC 6.12 promete a tela: clube, liga, salário, papel prometido, comissão, minutos e nível do clube em faixas, e as opções aceitar, recusar, empresário negocia e forçar saída. A T28 (decisão de 2026-10-01) integrou "escolha automática" como solução provisória e a tela nunca foi feita. **É uma lacuna entre o SPEC e a entrega, não um erro de cálculo.**

## Objetivos
1. Quando o jogador tem proposta, ele **vê e escolhe**: aceitar uma delas ou ficar.
2. Cada proposta mostra, só em faixas e sem número de atributo: clube e liga, salário (valor em moeda do clube), contrato, papel prometido, minutos previstos e nível do clube (v2.28), com a legenda "os dois pesam na sua evolução".
3. O resultado continua determinístico (mesma semente + mesmas escolhas = mesma carreira) e o save/link seguem funcionando.

## Proposta de escopo (a confirmar)
- **Quando aparece (decisão do usuário, 2026-10-07):** **sempre que houver oferta, no período das janelas de transferência**, mesmo que ela não vença "ficar" pela margem do `chooseOffer`. Sem oferta, não há tela. A margem de 2 pontos continua valendo só para o modo automático (simulações).
- **Quantas:** até 3 propostas (as melhores pela mesma pontuação do `chooseOffer`) mais "Ficar no clube". Com a regra acima, a tela pode aparecer quase toda temporada, então o limite de decisões do Rápido (1 por temporada) precisa de regra de prioridade; a confirmar na T28f.
- **Ritmos:** a proposta tem peso alto (como as do coração e do rival, importância 8), então aparece no Rápido, no Normal e no Completo. Se o limite de decisões por temporada for estourado, ela tem prioridade.
- **Opções v1:** aceitar uma proposta · ficar · mandar o empresário negociar (pode melhorar ou sumir; usa o perfil do empresário) · **forçar saída** só quando o jogador já "quer sair" (salário atrasado, moral).
- **Fora da v1:** leilão entre clubes, mais de uma janela por temporada, contraproposta do jogador com valores livres.

## Arquitetura de dados
- Nova decisão `proposta-clube` no motor, no mesmo molde da reunião: a escolha é um texto validado (`aceitar:<clubId>`, `ficar`, `negociar`, `forcar-saida`), conferida contra as ofertas daquela temporada (as opções são dinâmicas, então não cabem no mapa fixo de `events.json`).
- `ask()` do motor passa a receber essa decisão; sem escolha ainda, a carreira para nela (como já faz com os eventos).
- Se nenhuma escolha for dada (simulações de balanceamento), vale o `chooseOffer` atual: **os relatórios de simulação e o equilíbrio não mudam**.
- Texto das propostas em `src/i18n/pt-BR`, faixas de minutos e nível do clube em `minutes.json`; nada fixo no código.

## Estratégia de teste
- **Unitários (~80%):** ofertas montadas para a tela (quantidade, ordem, faixas, moeda), validação da escolha (rejeita clube que não está na lista), `negociar` e `forcar-saida` determinísticos, "sem oferta, sem tela".
- **Integração (~15%):** carreira com as escolhas da tela fecha igual à carreira com `chooseOffer` quando o jogador escolhe a mesma que o automático; save e link com escolhas novas; Rápido/Normal/Completo mostram a tela quando há oferta.
- **E2E (~5%):** uma carreira até a primeira proposta, aceitar e ver o novo clube.
- Simulação pareada (`npm run sim:estilos`) antes e depois: o equilíbrio dos estilos não pode mudar quando o jogador segue o automático.

## Tarefas atômicas (propostas)
| ID | Tarefa | Critério |
|---|---|---|
| T28b | Ofertas da temporada expostas ao motor como decisão `proposta-clube` | Sem escolha, a carreira para; com a escolha do automático, resultado idêntico ao atual |
| T28c | Visão da proposta (faixas, moeda, papel, minutos, nível do clube) | Textos pt-BR, sem número de atributo, teste de 10 mil contextos sem frase faltando |
| T28d | Tela de propostas (WCAG 2.1 AA, teclado, leitor de tela) | Uma por tela de cartão, "Ficar" sempre visível, foco no título |
| T28e | Empresário negocia e forçar saída | Resultado determinístico; "forçar saída" só com `wantsOut` |
| T28f | Ritmos, save/link e simulação pareada | Equilíbrio dos estilos inalterado no automático |

## Perguntas de escopo (para você decidir)
1. ~~Quando aparece~~ **Decidido:** sempre que houver oferta, no período das janelas.
2. Entram já na v1 "empresário negocia" e "forçar saída", ou só aceitar e ficar primeiro?
3. Isso entra **antes da T58** ou depois, no Marco do jogo (ordem do SPEC)?
