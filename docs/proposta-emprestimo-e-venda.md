# Proposta: empréstimo e venda pelo empresário com destino à vista (para aprovação)

> Escrito em 2026-10-09, a pedido do usuário. **Nada disto foi implementado.** Depois de aprovado, entra no SPEC como v2.63
> e vira tarefas com teste antes do código (TDD), como as outras.

## O que acontece hoje

| Situação | Como funciona | Problema |
|---|---|---|
| **Empréstimo no início da carreira** (`src/engine/clubLife.ts`, `clubLife.json`) | Até 23 anos e jogando menos de 30% dos minutos, há 50% de chance por semestre de o clube emprestar o jogador para um clube da mesma região com reputação 10 a 40 pontos menor, por 1 temporada (`career.json`). **Não há decisão:** o jogador só descobre na linha do tempo. | O jogador não sabe para onde vai, nem pode dizer não. |
| **Venda fechada pelo empresário** (`empresario-forca-venda`, `src/engine/agent.ts`) | Empresário pouco leal pode "vender" o jogador no meio da temporada. Aceitar só marca "quer sair"; o clube só aparece **na tela de propostas do fim do ano**. | Não diz o clube; e na mesma temporada vêm **duas** decisões de transferência. |
| **Transferências por temporada** | A tela de propostas aparece no máximo 1 vez por temporada, mas a venda forçada soma outra. | Medido em 2026-10-09 (24 carreiras, Normal e Completo): **58 de 323 temporadas (18%)** tiveram duas ou três decisões de transferência; 42 delas foram venda forçada + tela de propostas. |

## O que muda

### 1. Empréstimo vira decisão, com o clube à vista
- Quando o clube decidir emprestar, aparece uma **tela no formato da tela de propostas** (cartões), com **um cartão do clube de destino** e o cartão do clube atual:
  - Clube, emblema, divisão e nível do clube; papel esperado e a marca "jogará mais / menos que hoje" (v2.55); duração do empréstimo (1 temporada); salário segue pago pelo clube dono.
- **Opções**, com "Você ganha / Em troca" como nas decisões:
  1. **Ir emprestado:** mais minutos e evolução mais rápida; em troca, vitrine menor (visibilidade e Seleção) e idolatria parada no clube dono.
  2. **Ficar e brigar por espaço:** mantém a vitrine do clube grande; em troca, poucos minutos e risco de a relação com o técnico cair.
  3. **Pedir ao empresário outro destino:** o empresário tenta um segundo clube (sorteio, pode não haver); custa um pouco de moral se não vier nada.
- No **Rápido**, o temperamento decide, como hoje nas outras decisões, e a linha do tempo mostra o clube.

### 2. Venda pelo empresário mostra o clube comprador
- O empresário escolhe **uma proposta real** do mercado do jogador (o mesmo gerador da tela de propostas), a de maior comissão para ele, e o evento passa a mostrar **o cartão desse clube** (salário, papel, minutos, nível, valor projetado).
- **Opções**, com vantagens e desvantagens:
  1. **Aceitar e ir para o clube X:** a transferência acontece no fim da temporada para esse clube; em troca, a idolatria cai no clube que você deixa (menos do que em "forçar saída").
  2. **Bater o pé e ficar:** a venda cai; ganha idolatria com a torcida; em troca, a relação com a diretoria e o técnico cai e o empresário fica mais insatisfeito.
  3. **Romper com o empresário:** a venda cai e o empresário muda (como hoje: multa sobre o patrimônio e queda de moral).

### 3. No máximo uma decisão de transferência por temporada (pedido do usuário)
- Se houve **venda pelo empresário** ou **empréstimo** na temporada, **a tela de propostas do fim do ano não aparece** nessa temporada (o automático fica no clube, ou já leva ao clube aceito).
- A venda pelo empresário passa a acontecer **no máximo uma vez por temporada** (hoje pode vir nos dois semestres).
- Ofertas especiais seguem fora dessa conta: despedida no clube de coração ou no formador (6.14, 6.18).

## Critérios de aceitação (para os testes)
1. Ninguém é emprestado sem uma decisão na tela (Normal e Completo) ou do temperamento (Rápido); a view da decisão traz o clube de destino.
2. A venda pelo empresário traz o clube comprador; aceitar leva exatamente a esse clube no fim da temporada.
3. Em nenhuma temporada há mais de uma decisão de transferência na tela (medido em 1000 carreiras, os três ritmos).
4. Os números (chances, efeitos, idolatria, moral) ficam em `clubLife.json`, `agents.json` e `events.json`, não no código.
5. Textos novos em `src/i18n/pt-BR`, escritos com a skill de narrativa e aprovados por você.
6. A carreira continua determinística: mesma semente e mesmas escolhas dão a mesma carreira.

## Perguntas para você decidir
1. No empréstimo, a opção 3 ("pedir outro destino") entra, ou ficam só "ir" e "ficar"?
2. "Bater o pé" na venda: além da relação com a diretoria, deve haver chance de o clube **forçar** a venda mesmo assim?
3. Se o jogador recusa o empréstimo, o clube pode oferecer de novo no semestre seguinte, ou só uma vez por temporada?
4. Saves antigos: as escolhas salvas não têm essas decisões novas. Proposta: a versão do save sobe e o save antigo vira "carreira de outra versão" (como na v2.48), em vez de tentar converter.
