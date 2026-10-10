# Proposta: início de carreira e criação mais curta (para aprovação)

> Escrito em 2026-10-09, depois da revisão de design das telas iniciais (`/impeccable critique`, nota 24/40).
> Escolhas do usuário: começar pelo **início da carreira**, atacar **toda a lista** e **tirar escolhas da criação**.
> **Nada disto foi implementado.** Depois de aprovado, entra no SPEC (v2.67 em diante) e vira PRs com teste antes do código.

## 1. O primeiro ano deixa de passar sozinho (prioridade 1)

### Hoje
- Na várzea e na base, o primeiro ano (16 anos) não tem decisão: o motor só pergunta com o jogador num time profissional.
- A primeira tela da carreira já é aos 17, num clube profissional, com o Over saltando (ex.: 40 na revelação → 55) e o resumo da temporada dos 16 mostrando 0 jogos, 0 gols.
- A origem escolhida (várzea, peneira, base) nunca aparece na tela.

### Proposta
1. **Marco "Primeiro passo"**, a primeira decisão da carreira, aos 16, **um por origem**, com cena própria (várzea, peneira, base) e 3 opções com o jeito de cada temperamento, como os outros marcos. Exemplos de tensão (textos finais com a skill de narrativa, para sua aprovação):
   - **Várzea:** o time do bairro te quer de titular todo domingo; um olheiro apareceu no último jogo.
   - **Peneira:** passou na peneira, mas no alojamento ninguém te conhece e a saudade aperta.
   - **Base:** chegou no clube grande; o treinador da base te vê como reserva do filho de um diretor.
   - Efeitos pequenos (moral, relação com o técnico, Mental), números em `events.json`.
2. **Uma decisão no segundo semestre dos 16** também, para o primeiro ano ter ao menos 2 telas antes do salto para o profissional: um evento de base ou várzea já existente do catálogo, liberado para essas fases.
3. **O resumo do primeiro ano vira um cartão narrado** ("Um ano no time do bairro: 22 jogos no campo de terra, e o olheiro voltou"), sem os quadrinhos 0/0/0, quando o jogador não jogou como profissional.

### Critérios de aceitação
1. Toda carreira mostra o marco "Primeiro passo" da sua origem como primeira decisão, aos 16.
2. Nenhum resumo de temporada mostra 0 jogos, 0 gols, 0 assistências em quadrinhos.
3. O Over entre a revelação e a primeira tela muda no máximo o que um semestre permite.
4. Save sobe de versão (as escolhas antigas não incluem o marco novo).

## 2. Criação mais curta: comemoração e mentalidade saem da criação

### Hoje
Cerca de 13 escolhas antes de jogar. O passo 3 tem 7 grupos e rola até 382 px no celular comum (691 px no pequeno).

### Proposta
- **Comemoração** sai da criação e vira escolha no marco **"primeiro gol"** (o marco já existe): as opções do marco passam a ser 3 comemorações, cada uma com o jeito de um temperamento. Sem gol na carreira, a manchete usa uma comemoração padrão.
- **Mentalidade** (fominha, capitão, professor, máquina) sai da criação e vira o marco **"Que profissional você vai ser?"** na estreia profissional. Até lá, o jogador é neutro; depois, o efeito de evolução passa a valer daí em diante (hoje vale desde os 16).
- A criação fica com **3 passos**: "Quem é ele" (nome, número, estado, clube de coração), "Seu visual" e "Em campo" (posição, estilo, perna, altura, compleição, temperamento), mais a origem.

### Pergunta
A mentalidade tem **4 opções** e as decisões do jogo têm **3**. Qual caminho?
- (a) O marco mostra as 3 que combinam com o temperamento do jogador (a 4ª nunca aparece para ele).
- (b) O marco é exceção à regra das 3 opções e mostra as 4.
- (c) Uma das 4 mentalidades sai do jogo.

## 3. Ajustes de tela (sem mudar regra do jogo)
1. **Revelação:**
   - Destaca os 2 ou 3 pontos mais fortes do estilo, em vez de 10 linhas iguais.
   - Para quem começa, a palavra mais baixa vira "Cru" em vez de "Fraco".
   - O nome quebra em duas linhas na figurinha.
   - O foco vai para o título, que não fica escondido em 360 px.
   - Ganha uma cena pintada ao fundo.
2. **Ritmo:**
   - Ganha uma cena ao fundo.
   - O título e o rótulo do grupo deixam de dizer a mesma frase.
   - O tempo do Normal fica igual ao do produto: "Uns 15 minutos".
3. **Passo "Em campo":** a barra de altura ganha área de toque de 44 px e o fundo do painel vai até o fim do conteúdo.
4. **Erro da camisa 10:** a mensagem ocupa a linha inteira, embaixo dos campos.
5. **Rótulos com 14 px no mínimo**, e um só estilo de botão principal em todas as telas (verde cheio).
6. **"Reiniciar carreira"** fica escondido durante a criação, porque ainda não há carreira.

## Ordem dos PRs
1. Início de carreira (seção 1).
2. Criação mais curta (seção 2).
3. Ajustes de tela (seção 3).

## Respostas do usuário (2026-10-09)
1. Proposta **aprovada**.
2. Mentalidade: **(b)** o marco "Que profissional você vai ser?" é exceção à regra das 3 opções e mostra as 4.
3. Pedido junto: revisar todas as telas com `/impeccable` (enquadramento, fontes e pontos de elevação da experiência, como animações e efeitos).
