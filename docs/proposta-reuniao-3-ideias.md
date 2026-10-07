# Proposta: reunião com a comissão em 3 ideias (SPEC 6.5) — aguardando "DE ACORDO"

> Nada foi codado. Origem: desenho do usuário em 2026-10-07. Decisões do usuário: o cartão 1 não mostra rótulo nem dica de confiança; a regra muda de verdade (necessidade do clube pela posição, efeito na confiança do técnico); **só os três cartões**, sem seleção livre. O card do jogador do topo não muda.

## Objetivos
1. Trocar a seleção livre de 12 focos por **3 cartões prontos** (principal + secundário em cada).
2. Fazer a escolha **ter consequência**: a comissão agrada mais do foco óbvio e menos do ousado; a confiança do técnico (relação) muda com a escolha e a resposta.

## Os três cartões (todos calculados pelo motor, com os atributos do jogador)
| # | Ideia | Como se monta | Mostra |
|---|---|---|---|
| 1 | **Óbvia** (lógica do técnico) | `autoProposal`: os dois focos que mais rendem Over na posição naquele semestre (a mesma da reunião automática) | título "Vou treinar o X e o Y", descrição dos atributos; **sem rótulo e sem dica de confiança** |
| 2 | **Mescla** (posição + diferencial) | principal = o 1º foco óbvio; secundário = o **diferencial seu**: o atributo mais forte do jogador entre os que a posição pede menos (peso abaixo da mediana) e que não está no cartão 1 | título e descrição; dica de agrado em palavras |
| 3 | **Ousada** (minha escolha) | os **dois atributos mais fortes** do jogador (os mais confortáveis), quando não coincidem com os cartões 1 e 2; se coincidirem, o 2º e o 3º mais fortes | título e descrição; dica de agrado em palavras ("pode ou não agradar") |
- Cartões **distintos**: se dois saírem iguais, o motor troca o foco repetido pelo próximo da lista de cada ideia (teste cobre as 7 posições × estilos).
- Dica de agrado em **palavras** ("muito provável", "possível", "pouco provável"), nunca em percentual (SPEC v2.23). Vem da **chance real** de a comissão concordar, calculada do mesmo modelo que decide a resposta.
- Focos possíveis continuam os de hoje: 10 atributos, Bola parada, Perna ruim. Textos mostram só nomes de atributo, sem número.

## Regra (dados em `meeting.json`)
- **Necessidade do clube** (hoje sorteada entre os 12 focos, escondida do jogador): passa a ser **sorteada pelos pesos da posição** (`positionWeights`), com **a mesma quantidade de sorteios** do motor (não desloca a sequência da semente).
- **Resposta:** continua aceita / contraproposta / recusa. Aceita se o score (moral, relação, Seleção) ≥ `acceptFrom` **ou** o foco principal = necessidade do clube; abaixo disso, contrapropõe a necessidade como principal e o desejo vira secundário (como hoje).
- **Confiança do técnico (relação):** aceita o cartão **1** → `+relação`; aceita o **2** → pequeno `+`; aceita o **3** → `−` ou neutro (depende do quanto o principal está longe da necessidade); contraproposta → leve `−`; recusa → nada. Números em dados.
- **Prévia:** o resultado da escolha mostra a relação como as outras ("isso vai pesar na próxima reunião").
- **Automática** (Rápido e semestres sem tela): usa o cartão 1, como hoje.

## Tela
- Cabeçalho "Sala de reuniões" · **Reunião com a comissão** · fala do treinador (texto em pt-BR, com os atributos do cartão 1 mencionados só pelo nome).
- 3 cartões selecionáveis (`radiogroup`/`radio`), com ícone, título, descrição e dica; o cartão 1 sem rótulo e sem dica. Rodapé fixo **Propor ao técnico**. Mantém a resposta da comissão (diálogo) como está.
- WCAG 2.1 AA: foco visível, teclado, nome acessível completo; dica em texto, não só cor; `prefers-reduced-motion`.

## Estratégia de teste
- **Unitários (~80%):** montagem dos 3 cartões (distintos, atributos válidos, 7 posições); diferencial seu; ousada = mais fortes; chance de agrado (ordem 1 ≥ 2 ≥ 3 em média); necessidade pela posição (distribuição segue os pesos); relação por cartão e resposta.
- **Integração (~15%):** o motor recusa proposta fora dos 3; escolher o cartão 1 = mesma carreira da reunião automática; save/link com as novas escolhas (`principal|secundario` continua o formato); reunião na tela por ritmo.
- **E2E (~5%):** abrir a reunião, escolher o cartão 2, propor, ver a resposta; captura em 390×844.
- **Equilíbrio:** `npm run sim:estilos`/`sim:carreira` antes e depois (a necessidade por posição muda a taxa de contraproposta e a evolução média); "Lenda" por estilo dentro da faixa atual, com a tolerância combinada.

## Tarefas atômicas (um commit cada, TDD)
| ID | Tarefa | Critério |
|---|---|---|
| T52b | Montagem dos 3 cartões e chance de agrado (puro) | Testes das 7 posições; cartões distintos |
| T52c | Necessidade do clube pela posição, relação por escolha, recusa de proposta fora dos 3 (motor + `careerRun`) | Cartão 1 = carreira automática; simulação pareada dentro da faixa |
| T52d | Tela de 3 cartões (substitui a seleção livre) + textos | WCAG; conferida em 390×844 |

## Risco
A necessidade do clube pela posição **muda o equilíbrio** (mais acordos, menos contrapropostas). Calibro em dados até a simulação pareada voltar à faixa; se não voltar, paro e peço sua decisão.

## Pergunta aberta (decido o recomendado se você não disser)
Ordem de trabalho: esta reunião, a tela de contratos (`docs/proposta-tela-contratos.md`) e os marcos (T25c, em `wip`) mexem no equilíbrio; **recomendo reunião (T52b–d) → contratos (T28g–k) → marcos/catálogo**, medindo o equilíbrio ao fim de cada etapa em vez de só no fim.
