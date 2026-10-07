# Proposta: tela "Propostas de contrato" redesenhada (SPEC 6.12) — aguardando "DE ACORDO"

> Nada foi codado. Origem: desenho enviado pelo usuário em 2026-10-07 (cartões com cabeçalho do clube, financeiro com %, tags de reputação e papel). Decisões do usuário: o **papel novo vira regra do motor**; o clube atual entra **como primeiro cartão** ("Renovação"/"Seu time atual"); a projeção de valor é **estimativa**. O card do jogador no topo **não muda**.

## Objetivos
1. Trocar a tela de propostas (T28d) por **cartões selecionáveis** + **"Confirmar escolha"**, com os itens do desenho.
2. Papel no elenco por **faixa de idade**, com 8 estados, como regra do motor (minutos, moral, evolução).
3. Reputação do clube em **6 níveis** (estrelas).
4. Mostrar **salário por mês com % contra o atual** e **projeção de valor** (estimativa).
5. Juntar **renovação** e **mudança de clube** numa tela só.

## Desenho da tela (mobile, 390 px)
- Cabeçalho: "Mercado de transferências aberto" · **Propostas de contrato** · frase de apoio. (O card do jogador do topo, o atual.)
- **Cartão**, 3 linhas (até 3 propostas + o clube atual):
  1. **Cabeçalho:** emblema original · nome do clube (negrito) + "Liga • País" · selo **Renovação** / **Seu time atual** / **Nova Proposta**.
  2. **Financeiro:** `€ 38,0 mil/mês (+27%)` (verde = aumento, vermelho = redução; também com seta e texto, não só cor) · `Valor: € 9,5 mi (+15%)`.
  3. **Tags:** reputação (★) e papel.
- Toque no cartão = seleciona (`role="radio"` num `radiogroup`) e abre o **detalhe**: salário anual, anos de contrato, bônus, e as ações extras **Negociar com o empresário**, **Forçar a saída** (contrato longo) e **Aceitar por amor** (clube de coração). Rodapé fixo: **Confirmar escolha**.
- Marcas de proposta do coração e do rival continuam (selo extra no cartão).
- **Escudos e ligas no jogo:** emblemas **originais** e nomes **descritivos** de ligas (CLAUDE.md e SPEC v2.26/v2.32). As logos reais do desenho são ilustração.

## Reputação em 6 níveis
Sem Expressão (1★) · Baixa (2★) · Média (3★) · Boa (4★) · Alta (5★) · Clube Gigante (6★). Limites por **reputação efetiva** em `minutes.json` (`faixas.nivelClube`, hoje 4 faixas), calibrados pela distribuição dos 392 clubes e conferidos por teste (cada nível tem clubes; ordem coerente: gigantes europeus no topo, estaduais na base). Substitui as 4 faixas da T28c.

## Papel no elenco (regra do motor)
- **Até 20 anos:** Jovem Promessa · Jovem em Rotação · Joia Titular.
- **Acima de 20:** Composição de Elenco · Reserva Imediato · Disputa de Titularidade · **Titular Regular** · **Titular Absoluto** (os dois últimos já previstos).
- O papel sai da diferença entre o Over do jogador e o nível do elenco do clube (`roleFor`), com cortes por faixa de idade em dados. O papel de **proposta** usa a mesma função, com o elenco do clube que propõe.
- Cada papel tem **minutos esperados** em `minutes.json` (`papel`), que alimentam minutos, moral prometida×real e evolução (já ligados hoje). A pontuação da escolha automática (`ROLE_SCORE`) ganha um valor por papel.
- Migração: os 4 papéis atuais (`titular`, `rodizio`, `reserva`, `promessa`) viram os novos por tabela de conversão; saves e links refazem a carreira pelas escolhas, então não precisam de migração de dados, mas **a carreira muda** (equilíbrio): ver Risco.

## Projeção de valor (estimativa)
Valor de mercado projetado = valor do Over projetado depois de **uma temporada** naquele clube, usando as mesmas regras de evolução (minutos pelo papel, nível do clube pela comissão), com sorteio neutro (sem ruído). Mostrado só como estimativa ("previsão, não promessa"), em % contra o valor de hoje. Não muda a carreira.

## Renovação junto com as propostas
- O clube atual é sempre o **primeiro cartão**: "**Renovação**" quando o contrato acaba (com a oferta de renovação do motor) ou "**Seu time atual**" com o contrato vigente. Substitui o botão "Ficar no clube".
- Ações do detalhe do clube atual: **Renovar** e **Pedir aumento** (as opções que o evento `renovacao` tem hoje). "Não renovar" = escolher outro cartão.
- Sem propostas na janela, o evento `renovacao` continua como hoje (tela própria).

## Estratégia de teste
- **Unitários (~80%):** `roleFor` por faixa de idade (os 8 papéis, bordas); minutos por papel; reputação (6 níveis, distribuição); salário % (verde/vermelho/zero, moeda); projeção de valor (determinística, ≥ 0, coerente com minutos e nível).
- **Integração (~15%):** cartão lido por leitor de tela (selo, financeiro, tags); selecionar + confirmar escolhe o clube certo; detalhe mostra as ações certas por contexto; renovação como primeiro cartão; carreira jogada pela tela.
- **E2E (~5%):** abrir proposta → selecionar → confirmar; captura em 390×844.
- **Equilíbrio:** `npm run sim:estilos` e `sim:carreira` antes e depois; "Lenda" por estilo dentro da faixa atual (4,3% a 7,0%) com tolerância a definir; relatório em `docs/`.

## Risco (importante)
Papel como regra do motor **muda minutos, moral e evolução**, logo o equilíbrio medido. Ajusto os números em dados até a simulação pareada voltar à faixa; se não voltar, **paro e peço sua decisão**. Por isso a T28g vem antes da tela.

## Tarefas atômicas (uma por commit, TDD)
| ID | Tarefa | Critério |
|---|---|---|
| T28g | Papel por idade como regra do motor (8 papéis, minutos em dados, `roleFor`, ofertas e escolha automática) | Testes unitários; simulação pareada dentro da faixa; **parada se sair dela** |
| T28h | Reputação em 6 níveis (dados + teste de distribuição) | Cada nível usado; ordem coerente |
| T28i | Modelo do cartão: salário mensal com %, valor projetado, tags (puro) | Testes de % e projeção determinística |
| T28j | Renovação como primeiro cartão (motor: escolha `renovar`/`aumento` na decisão de propostas) | Carreira com a mesma escolha do automático não muda |
| T28k | Tela de contratos (cartões `radio`, detalhe, confirmar, textos pt-BR) | WCAG 2.1 AA; conferida em 390×844 |

## Perguntas ainda abertas (decido o recomendado se você não disser)
1. Ordem: fazer isto **antes** de continuar os marcos/catálogo (T25c/d/e/b)? *Recomendo antes, porque muda o motor e o equilíbrio.*
2. Bônus no detalhe: só **texto informativo** (luvas e bicho do contrato, que já existem) ou valores novos? *Recomendo informativo.*
