---
name: 10efaixa-narrativa
description: Narrativa do 10eFaixa — escreve e revisa os eventos de carreira (o texto da situação, as 3 opções e as consequências) no tom do jogo, com escolhas que pesam de verdade e dentro das regras jurídicas do projeto. Use sempre que a tarefa envolver criar, reescrever ou revisar um evento, dilema, acontecimento, texto de opção, resultado de escolha, manchete ou qualquer texto de história em src/i18n/pt-BR/events.json ou src/data/events.json — mesmo que o pedido não diga "narrativa" (ex.: "o evento da lesão está fraco", "faltou texto no pênalti", "cria o evento da peneira", "as opções estão parecidas").
---

# Narrativa do 10eFaixa

Cada evento é uma **cena curta da vida de um jogador brasileiro**: um parágrafo que coloca o jogador num aperto, três saídas que custam coisas diferentes e um resultado que o jogador sente. O jogo é decidido nessas telas; se a escolha não pesa, o jogo não existe.

**Fontes da verdade, nesta ordem:** `SPEC.md` (6.13 dilemas, 6.18 clube de coração, 6.3 nada de número de atributo, 11 regras jurídicas e a tabela de decisões da seção 17) → `CLAUDE.md` → esta skill. Se divergirem, vale o SPEC — e corrija a skill.

**Diagnóstico de partida:** `docs/revisao-eventos.md` lista os 25 eventos, o que cada opção faz no motor e os problemas encontrados. Leia antes de mexer em evento existente.

## Onde mora cada coisa

| O quê | Arquivo |
|---|---|
| Condição, peso, cena, opções, `jeito`, efeitos, política | `src/data/events.json` |
| Título, texto da situação, texto das opções | `src/i18n/pt-BR/events.json` (`titulo`, `texto`, `opcoes.<id>`) |
| Efeito real escondido em outra tabela | lesão `injuries.json` · Copa `nationalTournaments.json` · investimento `discipline.json` · aumento `money.json` · torcida `idolatry.json` |
| Cena de fundo | `scenes.json` (+ texto alternativo em `src/i18n/pt-BR/scenes.json`) |

Variáveis de texto usam chaves: `{nome}`, `{clube}`. Nunca escreva texto visível no código.

## Tom de voz

A referência aprovada pelo usuário é o texto de `proposta-coracao`:

> "O clube que você via da arquibancada ligou. O salário é menor que o das outras propostas, mas a camisa é aquela. Seu empresário torce o nariz; sua mãe já chorou."

O que faz ele funcionar, e vale para todo evento:

1. **Segunda pessoa, presente, frase curta.** "Você", nunca "o jogador".
2. **Um detalhe concreto vale mais que um adjetivo.** "Dois meses sem ver a cor do dinheiro", não "o clube está em crise financeira".
3. **Os dois lados da balança estão no texto.** O leitor entende o que ganha e o que perde *antes* de ler as opções.
4. **Gente em volta.** Mãe, empresário, técnico, elenco, torcida, a quebrada: cada evento tem pelo menos uma pessoa reagindo.
5. **Português de boleiro, sem caricatura.** "Resenha", "panela", "dar uma passada", "no sacrifício" — sim. Gíria que só uma região entende ou palavrão — não.
6. **Tamanho:** título até ~40 caracteres; texto de **2 a 3 frases, até ~280 caracteres**; opção até ~55 caracteres, começando por verbo ("Pedir para sair", "Bater o pé e ficar").

## Estrutura de um evento

Cada evento segue o formato de *storylet*: um parágrafo de situação, uma escolha e um resultado, liberado pelo estado da carreira (condições em `events.json`), não por uma árvore fixa de ramos.

1. **Gatilho** — a condição que libera o evento. O texto tem de fazer sentido para *qualquer* jogador que cumpra a condição (idade, divisão, clube, posição).
2. **Situação** — quem, o quê e o que está em jogo, em 2–3 frases.
3. **Tensão** — dois valores em choque: dinheiro × camisa, corpo × glória, elenco × diretoria, agora × depois.
4. **Três opções**, cada uma com o `jeito` de um temperamento (`lider`, `frio`, `esquentado`, `resenha`). Quatro temperamentos, três opções: o que fica sem opção segue `politica.padrao`.
5. **Resultado** — o cartão de resultado (SPEC v2.20) mostra "Deu certo" / "Saiu caro" e os ganhos e perdas reais.

Os antigos avisos de um botão só (estirão, traço novo, técnico novo, amadurecimento) **também têm 3 opções** (SPEC v2.23): o acontecimento é o gatilho; a decisão é *como* o jogador reage a ele.

## Regras das opções

1. **Nenhuma opção domina outra.** Se uma opção ganha igual ou mais em tudo e perde igual ou menos em tudo, a outra é inútil. Monte a tabela opção × campo e confira (veja `traicao-coracao` e `polemica-redes` no diagnóstico: são exemplos do erro).
2. **Toda opção tem ganho e custo**, salvo uma opção conscientemente "segura" que troca pouco por pouco. "Sem efeito imediato" na tela é sinal de evento mal desenhado.
3. **Cada opção é um caminho diferente**, não a mesma coisa em intensidades diferentes. Duas opções que levam ao mesmo resultado no motor (ex.: `bater` e `encher-o-pe` no pênalti) viram uma, ou ganham efeitos distintos.
4. **O texto da opção diz o que o jogador faz, sem esconder o custo principal.** Se aceitar corta o salário, a palavra "salário" aparece. Nunca duas opções que o leitor não consegue distinguir ("Aceitar" × "Jogar por amor").
5. **Promessa cumprida.** Se a situação diz que algo aconteceu (sumiu dinheiro), o efeito acontece (patrimônio cai). Se uma opção adia ("pedir um tempo", "mais um ano"), o motor precisa trazer o evento de volta — senão a opção mente.
6. **Risco em palavras, nunca em percentual** (SPEC v2.23). Desde a v2.26 o risco aparece na **tarja da opção** ("Risco de recaída: alto", com medidor), calculado por `riskOf` a partir da tabela do motor e da faixa de `preview.json`; o tempo fora sai por `timeOutOf` ("Fora por um ano"). **O rótulo da opção não repete o risco nem traz número** (teste em `narrative.test.ts`). Evento novo com risco: registre a fonte em `RISK_SOURCES` (`src/engine/preview.ts`).
7. **Nenhum número de atributo** (SPEC 6.3). Fale "a perna pesa", "o fôlego cai", nunca "−3 de físico".

## Regras que nunca se quebram

- **Todos os atletas são fictícios.** Nenhum nome, apelido ou trejeito de pessoa real — jogador, técnico, dirigente, jornalista, empresário.
- **Lendas reais** só no campo `inspiracao`, sob a flag `inspiracaoLendas`. Nunca no texto de evento.
- **Zoeira só com o próprio jogador.** Nunca com clube, torcida, cidade, região ou pessoa real. "O fanático que foi parar no rival" — sim; piada com a torcida do rival — não.
- **Nada de marca registrada** (bebida, aposta, rede social pelo nome, patrocinador). "As redes", "a casa de apostas" — e casa de apostas só como risco, nunca como opção boa.
- **Aparência nunca muda evento.** Nada de texto que dependa de pele, cabelo ou barba.
- **Sem preconceito, sem sexualização, sem violência gráfica.** Lesão é contada pelo que tira do jogador, não pelo sangue.
- **Clubes reais** só como cenário do jogo (nome e cores estilizadas); nunca atribua a um clube real crime, calote ou briga como fato. Salário atrasado e briga de empresário acontecem com "a diretoria", sem acusação ao clube nominal.

## Como trabalhar

1. Leia a seção do SPEC do evento e a linha dele em `docs/revisao-eventos.md`.
2. Escreva a **ficha do evento** antes do texto: gatilho, tensão, e a tabela opção × efeito com os valores reais (inclusive os das tabelas de outros arquivos). Confira a regra 1 (nenhuma domina) na tabela.
3. Escreva título, texto e opções em `src/i18n/pt-BR/events.json`.
4. Ajuste efeitos em `src/data/events.json` só se a ficha pedir — números são balanceamento: mexeu, rode `npm run sim:carreira` e compare com `docs/simulacao-carreira.md`.
5. **TDD:** os testes de dados e de i18n já cobrem chaves faltando e texto solto; acrescente teste quando criar regra nova (ex.: "nenhuma opção domina outra", "todo evento tem `texto`").
6. Revise com o checklist abaixo e mostre ao usuário **a ficha + o texto** para aprovação antes do commit. Texto de evento é decisão de produto.

## Checklist de revisão

- [ ] O texto faz sentido para qualquer jogador que dispare a condição?
- [ ] A tensão está no texto antes das opções?
- [ ] Tem uma pessoa reagindo?
- [ ] 2–3 frases, até ~280 caracteres; opções começam por verbo e cabem em ~55?
- [ ] Três opções, três jeitos diferentes, nenhuma dominada, nenhuma repetida?
- [ ] O custo principal aparece no texto da opção? Risco em palavras?
- [ ] O que o texto promete, o motor cumpre?
- [ ] Zero pessoa real, marca, número de atributo, zoeira com terceiros?

## Referências

Internas (lidas e conferidas):
- `SPEC.md` 6.13, 6.18, 6.3, 11 e seção 17 (v2.17 três opções; v2.20 cartão de resultado; v2.23 decisões da revisão).
- `docs/revisao-eventos.md` (diagnóstico dos 25 eventos, 2026-10-02).
- `docs/referencias/copero-observacoes.md` (seção 3: "Você ganha / Em troca" e moedas fixas de consequência).

Externas — princípios de desenho de escolha. **Status:** encontradas por busca em 2026-10-02; o texto integral **não foi lido** porque `emshort.blog` e `gamedeveloper.com` estão bloqueados pela rede do ambiente. Os princípios acima vêm das fontes internas; estas só confirmam o formato de *storylet* e a ideia de decisão interessante. Ao liberar o acesso, ler e atualizar esta seção.
- Emily Short, "Beyond Branching: Quality-Based and Salience-Based Narrative Structures" (2016-04-12) — https://emshort.blog/2016/04/12/beyond-branching-quality-based-and-salience-based-narrative-structures/ — *storylet*: um ou dois parágrafos, uma escolha e o texto do resultado, liberados por qualidades (variáveis de estado), termo da Failbetter Games.
- Sid Meier, "Interesting Decisions", GDC 2012 (retomando a frase dele de 1989, "um jogo é uma série de decisões interessantes") — https://gamedeveloper.com/design/video-sid-meier-explores-interesting-decisions-in-gameplay
- "Designing interesting decisions (in games) and when not to" — https://www.gamedeveloper.com/design/designing-interesting-decisions-in-games-and-when-not-to-
- inkle, *80 Days* (Jon Ingold, Meg Jayanth) — postmortem: https://gamedeveloper.com/business/postmortem-inkle-s-i-80-days-i- — o problema clássico da narrativa ramificada é convencer o jogador de que a escolha teve impacto.
