# Proposta v2.34: visual "Álbum com vidro"

Estado: **aguardando "DE ACORDO" do usuário.** Nada foi implementado e o `SPEC.md` ainda não foi alterado.

Exemplo visual aprovado em 2026-10-05: criação (tela 1), revelação do overall (tela 2) e decisão na variação **B** (cena inteira, opções enxutas). Fonte do exemplo: https://claude.ai/artifact/9rMNZKWhDc9t8S9cpbWrS8

## 1. O que o usuário aprovou

- Base atual mantida: papel, marinho, verde, Big Shoulders Display e Atkinson Hyperlegible.
- O jogador é uma **figurinha** com moldura pela faixa de qualidade (bronze, prata, ouro, platina, esmeralda, diamante), usando as artes de `docs/arte/cartoes-over/`.
- **Vidro fosco só em sobreposições:** prévia fixa da criação, caixa do jogador e faixa de baixo da decisão, modal de revelação.
- **Criação:** avatar-herói grande com setas e fileira de miniaturas; cor em círculo, opção curta em pílula, estilo em cartão com selo "Ativo".
- **Revelação:** figurinha "cola" (um único momento animado), selo "Diamante bruto", atributos só em faixas.
- **Decisão (B):** cena ocupando a tela; caixa do jogador em vidro com figurinha pequena, Over em número, idade, tempo de clube, salário e títulos; faixa de baixo com título, texto, três opções de uma linha e o "Você ganha / Em troca" só da opção marcada.

## 2. Mudanças propostas na SPEC seção 7

| # | Hoje (v2.19 e seguintes) | Proposta (v2.34) |
|---|---|---|
| 1 | Caixas de borda grossa (2px) com sombra dura verde, sem desfoque | Superfície sólida com borda fina e sombra suave. Borda grossa e sombra dura saem |
| 2 | Sem vidro | Vidro fosco (blur + saturação) **só** em: prévia da criação, caixa do jogador e faixa de baixo da decisão, modal de revelação. Fallback sólido sem `backdrop-filter` |
| 3 | Over em cartão com degradê da faixa (v2.19) | Figurinha com moldura metálica pela faixa de `bands.json` (bronze até 49, prata 50–64, ouro 65–74, platina 75–84, esmeralda 85–94, diamante 95–99) |
| 4 | Um único momento animado: o número "carimbando" na abertura | **Dois:** o carimbo na abertura e a figurinha "colando" na revelação. Ambos desligados com `prefers-reduced-motion` |
| 5 | Amarelo: só faixa de progresso e opção escolhida | Sem mudança. O dourado dos metais e do selo "Diamante bruto" é só de raridade |
| 6 | Cena no topo da decisão, texto e opções abaixo (v2.26) | Cena ocupa a tela; texto e opções numa faixa de vidro embaixo |
| 7 | Tema claro nas telas com cena | Claro e escuro, ambos com tokens de vidro e contraste conferido |
| 8 | Tipografia | **Sem mudança** (Big Shoulders + Atkinson). Oswald e Inter da referência não entram |

Regras que **não mudam**: nenhum número de atributo antes do cartão final (o Over geral segue em número, v2.16); aparência nunca altera atributos; sem escudos oficiais; WCAG 2.1 AA; sem rolagem a partir de 390×844 nos 25 eventos.

## 3. Decisões em aberto (preciso da sua resposta)

1. **Confirmar escolha (B):** o exemplo tem o botão "Confirmar escolha" depois de marcar a opção. Hoje a escolha é direta. Isso soma um toque por decisão. Proposta: confirmar só nos ritmos Normal e Completo; no Rápido, tocar já decide.
2. **Tarja de risco (v2.26):** as opções de hoje têm palavra e medidor de 4 segmentos. No exemplo B ela não aparece. Proposta: manter um medidor pequeno à direita de cada opção.
3. **Dois sentidos de "diamante":** a faixa de overall 95–99 (moldura diamante) e o selo "Diamante bruto" (bônus de teto da várzea, 3%). Proposta: manter os dois nomes, mas o selo usa dourado e a moldura usa o roxo da arte, e os textos nunca os confundem.
4. **Arte:** as 6 molduras existem como JPG quadrado. Para a figurinha ficar nítida em vários tamanhos, o ideal é recortar o miolo ou pedir versão com transparência ao ilustrador. Posso usar as atuais como provisórias.
5. **Cena em toda decisão:** hoje a cena é a amostra (assinatura de contrato) em qualquer evento. A variação B depende de a T46/T51 ligar uma cena a cada evento, ou o painel fica sobre uma cena genérica.

## 4. Plano de tarefas (atômicas, uma por vez, TDD)

Todas dependem do "DE ACORDO" desta proposta. Cada uma termina com testes, typecheck e build passando, um commit com o ID e blocos de até ~100 linhas.

| ID | Tarefa | Critério de aceitação |
|---|---|---|
| T49e | Registrar a v2.34 no SPEC (seção 7 e log), `DESIGN.md` e `PRODUCT.md`; corrigir o `DESIGN.md`, desatualizado em relação ao `tokens.json` | Documentos coerentes com os tokens; nenhuma divergência de cor ou fonte |
| T49f | Tokens do álbum: vidro, borda do vidro, scrim, sombra suave, nos temas claro e escuro | Teste de contraste de texto sobre vidro no pior fundo (preto e branco por trás) ≥ 4,5:1 nos dois temas |
| T49g | Superfície de vidro (componente/classe) com fallback sólido | Teste: sem `backdrop-filter`, a superfície fica opaca; no máximo 2 camadas de vidro por tela; **confirmar na documentação oficial** o uso de `backdrop-filter` e de `prefers-reduced-transparency` antes de implementar |
| T49h | Figurinha com moldura por faixa (estender `Figurinha.tsx`), tamanhos pequeno e grande | Faixa vem de `bands.json` (nada fixo no código); nome acessível com Over e faixa; teste das 6 faixas |
| T50g | Criação: avatar-herói com miniaturas, prévia fixa em vidro, seleção por tipo, cartões de estilo "Ativo" | Teclado e leitor de tela; alvos ≥ 44 px; sem rolagem em 390×844 em cada tela; testes da `Creation` atualizados e verdes |
| T49i | Revelação do overall: modal de vidro, figurinha, selo "Diamante bruto", atributos em faixas, animação "colar" | Sem número de atributo; `prefers-reduced-motion` sem animação; foco preso e devolvido (`<dialog>`) |
| T51c | Decisão (variação B): cena inteira, caixa do jogador em vidro, faixa de baixo com opções enxutas e detalhe da marcada | **0 de 25 eventos rolam** em 390×844 e 430×932; Over, idade, tempo, salário e títulos sempre visíveis; "Você ganha / Em troca" da opção marcada |
| T49j | Verificação final e capturas no Chromium (claro e escuro, 360×640, 390×844, 1280×800) ⛳ | Log com testes, typecheck e build; capturas para o seu aval |

Ordem sugerida: T49e, T49f, T49g, T49h, T50g, T49i, T51c, T49j. Pontos de parada ⛳: depois de T50g (criação pronta para ver) e em T49j.

## 5. Riscos

- **Desempenho do blur** em celular modesto (princípio "rápido de verdade"): limite de 2 camadas e fallback sólido.
- **Contraste** sobre vidro varia com o fundo: o teste usa o pior caso, não um fundo fixo.
- **Cena coberta:** a faixa de baixo cobre parte da cena; as cenas atuais já reservam os 40% de baixo escuros.
- **Retrabalho:** a T50 (criação) e a T49c (decisão) já estão concluídas; a v2.34 as reescreve visualmente, sem mexer em motor, estado ou regras.
