# T25b — lote 2: campo, clube e vida do jogador (15 eventos)

> Para aprovação (2026-10-08). Mesmo formato do lote 1: sorteio de catálogo, texto em camadas, setas (uma = pequeno, duas = grande).

## O erro do companheiro  (`companheiro-falha-no-gol`)

- **Quando:** idade >= 18; importância 6, cena `estadio`.
- **Situação:** O zagueiro perde a bola na saída e o time toma o gol. Ele fica parado, de mãos na cintura, olhando para o chão. A torcida já vaia, e a bola ainda está no fundo da rede.
- Abertura *capitao*: Capitão grita ou abraça, e o time inteiro aprende com o que você escolher.
- Abertura *veterano*: Você já errou assim e lembra de quem te levantou.
- Contexto *moralBaixa*: Num dia de moral baixa, o erro do colega parece o seu.
- Contexto *vilao*: Com a torcida de pé atrás de você, qualquer grito vira manchete.

| Opção | Jeito | Efeitos |
|---|---|---|
| Gritar com ele na frente da torcida | esquentado | moral ↑, disciplina ↓↓, técnico ↓ |
| Ir até ele e dizer que o jogo continua | lider | técnico ↑↑, moral ↓ |
| Voltar ao meio-campo sem olhar para trás | frio | disciplina ↑, moral ↓ |

Padrão do automático: **Ir até ele e dizer que o jogo continua**

## Um favor para o time  (`tecnico-pede-sacrificio`)

- **Quando:** idade >= 19 e minutosFracao >= 0.3; importância 6, cena `treino`.
- **Situação:** O técnico te chama depois do treino. O time precisa de alguém para fechar a faixa do campo e correr por dois. Não é a função que te deixou conhecido, mas ele diz que a vaga é sua se aceitar.
- Abertura *veterano*: Com a experiência, você sabe que sacrifício bem feito vira crédito.
- Abertura *jovem*: Para quem está começando, dizer não ao técnico custa caro.
- Contexto *posicaoDisputada*: Com a vaga em disputa, recusar pode abrir a porta para o concorrente.
- Contexto *empresarioPressiona*: Seu empresário avisou: fama se faz com gol, não com marcação.

| Opção | Jeito | Efeitos |
|---|---|---|
| Aceitar a função e dar o sangue | lider | técnico ↑↑, moral ↓, torcida ↓ |
| Pedir para seguir na função de sempre | esquentado | moral ↑, técnico ↓↓, torcida ↑ |
| Aceitar por um mês e voltar a conversar | frio | técnico ↑, moral ↓, disciplina ↑ |

Padrão do automático: **Aceitar por um mês e voltar a conversar**

## O menino na saída do túnel  (`camisa-no-tunel`)

- **Quando:** idade >= 18 e idolatria >= 15; importância 5, cena `estadio`.
- **Situação:** Antes do jogo, um menino com a camisa velha do clube te espera na grade do túnel. O pai dele filma com o celular, e a segurança manda andar. O aquecimento já começou.
- Abertura *idolo*: Para o ídolo, cada gesto na grade vira história na cidade.
- Abertura *jovem*: No início de carreira, um pedido assim ainda é raro e dá orgulho.
- Contexto *noClubeDeCoracao*: Você já foi aquele menino na grade, com a camisa do mesmo clube.
- Contexto *campeaoNoAno*: Com o título no ano, os pedidos só aumentam.

| Opção | Jeito | Efeitos |
|---|---|---|
| Parar e dar a camisa de aquecimento | lider | torcida ↑↑, moral ↑, técnico ↓ |
| Acenar e prometer a camisa depois do jogo | frio | torcida ↑, técnico ↑ |
| Tirar uma foto rápida com o menino | resenha | torcida ↑, moral ↑↑, disciplina ↓ |

Padrão do automático: **Acenar e prometer a camisa depois do jogo**

## O reforço da sua posição  (`reforco-para-sua-posicao`)

- **Quando:** idade >= 20 e posicaoDisputada == True; importância 7, cena `vestiario`.
- **Situação:** A diretoria apresenta um reforço para a sua posição. Ele chega com nome na imprensa e salário alto, e o técnico o chama de opção importante. No vestiário, todo mundo olha para o seu primeiro cumprimento.
- Abertura *veterano*: Com a experiência, você sabe que reforço bom puxa o nível de todo mundo.
- Abertura *jovem*: No começo de carreira, ver um nome grande na sua posição assusta.
- Contexto *empresarioPressiona*: Seu empresário avisou: se ele jogar, você precisa de outra casa.
- Contexto *moralBaixa*: Com a moral baixa, o reforço soa como uma resposta que ninguém te deu.

| Opção | Jeito | Efeitos |
|---|---|---|
| Receber o reforço de braços abertos | lider | técnico ↑↑, moral ↓ |
| Provocar na brincadeira e mostrar serviço no treino | esquentado | moral ↑↑, técnico ↓, disciplina ↓ |
| Cumprimentar sem festa e esperar a chance | frio | disciplina ↑, moral ↓ |

Padrão do automático: **Cumprimentar sem festa e esperar a chance**

## Jogo no campo alagado  (`jogo-no-gramado-ruim`)

- **Quando:** idade >= 18; importância 5, cena `estadio`.
- **Situação:** Choveu a semana toda, e o gramado virou poça de lama. A bola não quica e o passe não rola, e o técnico pede só bola longa. Do banco, o preparador avisa que dá para tentar o drible, mas custa fôlego.
- Abertura *veterano*: Você já jogou em muito campo ruim e sabe que quem ri na lama rende mais.
- Abertura *jovem*: Nos primeiros anos, campo ruim ainda é a desculpa mais fácil.
- Contexto *foraDoEixo*: Longe dos grandes centros, gramado ruim é regra, e todo mundo aprende a viver com ele.
- Contexto *campeaoNoAno*: Com o título na esquina, ninguém quer arriscar nada na lama.

| Opção | Jeito | Efeitos |
|---|---|---|
| Seguir o plano e jogar de bola longa | frio | técnico ↑↑, moral ↓ |
| Tentar o drible mesmo na lama | esquentado | moral ↑↑, torcida ↑, técnico ↓↓ |
| Rir da lama e chamar o time para jogar solto | resenha | moral ↑↑, disciplina ↓, torcida ↑ |

Padrão do automático: **Seguir o plano e jogar de bola longa**

## Time com um a menos  (`companheiro-expulso`)

- **Quando:** idade >= 18; importância 7, cena `estadio`.
- **Situação:** Seu companheiro de meio-campo é expulso aos trinta do segundo tempo, e o time segue na frente por um gol. O banco olha para você. O técnico faz o gesto de recuar o time.
- Abertura *capitao*: Com a faixa no braço, o time espera que você diga o que fazer.
- Abertura *veterano*: Você já jogou com um a menos e sabe que o primeiro minuto decide.
- Contexto *campeaoNoAno*: Com um título à vista, qualquer erro agora pesa em dobro.
- Contexto *moralBaixa*: Com a cabeça pesada, o jogo parece mais longo que o normal.

| Opção | Jeito | Efeitos |
|---|---|---|
| Recuar o time e fechar a casinha | frio | técnico ↑↑, torcida ↓, moral ↓ |
| Pressionar a saída e ir atrás do segundo gol | esquentado | torcida ↑↑, técnico ↓↓, moral ↑ |
| Chamar o capitão e reorganizar a marcação | lider | técnico ↑, disciplina ↑, moral ↓ |

Padrão do automático: **Chamar o capitão e reorganizar a marcação**

## Pendurado para o clássico  (`cartao-pendurado`)

- **Quando:** idade >= 18; importância 6, cena `estadio`.
- **Situação:** Você está pendurado com dois amarelos, e o clássico é na semana que vem. Hoje o marcador te provoca em toda disputa. Se levar o terceiro, desfalca o time na partida mais importante.
- Abertura *vilao*: Com a fama que a torcida te deu, o árbitro já está de olho em você.
- Abertura *veterano*: Você já perdeu clássico por cartão bobo e sabe como dói.
- Contexto *capitao*: Com a faixa no braço, desfalcar o time é a pior das opções.
- Contexto *empresarioPressiona*: Seu empresário lembra que um clássico bem jogado vale uma proposta.

| Opção | Jeito | Efeitos |
|---|---|---|
| Jogar no limite e entrar firme nas divididas | esquentado | torcida ↑↑, disciplina ↓↓, moral ↑ |
| Jogar com cautela e evitar a dividida | frio | disciplina ↑↑, torcida ↓, moral ↓ |
| Pedir ao técnico para ser substituído antes | lider | técnico ↑, moral ↓, disciplina ↑ |

Padrão do automático: **Jogar com cautela e evitar a dividida**

## O convite do projeto do bairro  (`projeto-social-convida`)

- **Quando:** idade >= 21 e idolatria >= 20; importância 4, cena `casa-familia`.
- **Situação:** O projeto social do bairro onde você começou te convida para a festa de fim de ano, num campinho de terra. Tem fila de criança com a sua camisa. Mas é o único dia de folga da semana.
- Abertura *idolo*: Ídolo do clube virou orgulho do bairro, e o bairro cobra presença.
- Abertura *jovem*: Nos primeiros anos, o bairro ainda te chama de menino.
- Contexto *noClubeDeCoracao*: O campinho fica a duas ruas do estádio do clube que você sempre torceu.
- Contexto *empresarioPressiona*: Seu empresário prefere a foto no estádio a um campinho de terra.

| Opção | Jeito | Efeitos |
|---|---|---|
| Ir e jogar um tempo com a molecada | lider | torcida ↑↑, moral ↑, técnico ↓ |
| Mandar camisas autografadas e um abraço | frio | torcida ↑, moral ↑ |
| Ficar descansando e prometer ir no ano que vem | resenha | moral ↑, torcida ↓, disciplina ↑ |

Padrão do automático: **Mandar camisas autografadas e um abraço**

## O professor da base aparece  (`professor-da-base`)

- **Quando:** idade >= 25; importância 4, cena `casa-familia`.
- **Situação:** O treinador que te formou aparece na porta do centro de treinamento, mais velho e de boné. Ele quer um tempo de conversa e uma foto para o projeto dele. Você tem compromisso marcado.
- Abertura *veterano*: Os anos passam, e quem te formou envelhece junto com a sua carreira.
- Abertura *idolo*: Para o ídolo, o professor é a parte da história que ninguém conta.
- Contexto *capitao*: Com a faixa no braço, o que você fizer com ele vira exemplo para os garotos.
- Contexto *empresarioPressiona*: Seu empresário olha o relógio, e o professor percebe.

| Opção | Jeito | Efeitos |
|---|---|---|
| Parar tudo e conversar com ele | lider | moral ↑↑, técnico ↓, torcida ↑ |
| Marcar um almoço no domingo | frio | moral ↑, disciplina ↑ |
| Tirar a foto e sair correndo | resenha | torcida ↑, moral ↓, disciplina ↓ |

Padrão do automático: **Marcar um almoço no domingo**

## Portão aberto, torcida em cima  (`portao-aberto-cobranca`)

- **Quando:** idade >= 18 e moral < 0.65; importância 6, cena `treino`.
- **Situação:** O treino é aberto, e a torcida lota a arquibancada para cobrar resultado. Um grupo grita o seu nome com raiva, outro tenta defender. Cada exercício vira plateia.
- Abertura *vilao*: A torcida já tem um culpado, e hoje o treino aberto tem o seu nome.
- Abertura *jovem*: Jovem ainda, você nunca tinha ouvido a torcida tão de perto.
- Contexto *moralBaixa*: Com a moral baixa, cada grito da arquibancada soa como sentença.
- Contexto *capitao*: Com a faixa no braço, a torcida cobra mais de você que de qualquer um.

| Opção | Jeito | Efeitos |
|---|---|---|
| Ir até a grade, ouvir e prometer reação | lider | torcida ↑↑, moral ↓, técnico ↓ |
| Revidar com ironia e provocar de volta | esquentado | torcida ↓↓, moral ↑↑, disciplina ↓↓ |
| Treinar de cabeça baixa, sem olhar para o lado | frio | moral ↓, disciplina ↑, torcida ↓ |

Padrão do automático: **Treinar de cabeça baixa, sem olhar para o lado**

## A pergunta sobre a Seleção  (`pergunta-da-selecao`)

- **Quando:** idade >= 19 e convocado == True; importância 6, cena `entrevista`.
- **Situação:** Na zona mista, o repórter pergunta se você se vê na próxima convocação e se merece mais que o outro da posição. Todo mundo escuta. A resposta vai passar no jornal da noite.
- Abertura *convocado*: Quem já vestiu a camisa da Seleção sabe que cada palavra volta em dobro.
- Abertura *idolo*: Um ídolo pesa cada resposta, porque a torcida quer o melhor para ele.
- Contexto *empresarioPressiona*: Seu empresário combinou duas frases e pediu para você não sair delas.
- Contexto *capitao*: Com a faixa no braço, a resposta vale pelo clube todo.

| Opção | Jeito | Efeitos |
|---|---|---|
| Falar de humildade e do trabalho no clube | frio | torcida ↑, técnico ↑, moral ↓ |
| Cravar que merece e que está pronto | esquentado | torcida ↑↑, moral ↑↑, técnico ↓↓ |
| Brincar com a pergunta e desviar para a torcida | resenha | moral ↑, torcida ↑, disciplina ↓ |

Padrão do automático: **Falar de humildade e do trabalho no clube**

## Jogo beneficente no domingo  (`jogo-beneficente`)

- **Quando:** idade >= 22; importância 4, cena `festa`.
- **Situação:** Uma campanha de arrecadação convida alguns jogadores para um jogo beneficente no domingo de folga. Vai ter televisão, ex-craques e foto com crianças. O preparador avisa que o corpo precisa de descanso.
- Abertura *idolo*: Convite para ídolo é pedido da cidade, e ninguém aceita um não de graça.
- Abertura *veterano*: Com os anos, o descanso ficou tão valioso quanto o jogo.
- Contexto *capitao*: Com a faixa, o grupo espera que você dê o exemplo na campanha.
- Contexto *noClubeDeCoracao*: É a camisa do clube de coração na campanha, e a vontade é de ir.

| Opção | Jeito | Efeitos |
|---|---|---|
| Ir, jogar um tempo e voltar para casa | lider | torcida ↑, moral ↑ |
| Jogar o jogo inteiro e aproveitar a tarde | resenha | moral ↑↑, torcida ↑↑, disciplina ↓ |
| Mandar uma doação e ficar descansando | frio | disciplina ↑, torcida ↑, moral ↓ |

Padrão do automático: **Ir, jogar um tempo e voltar para casa**

## O palpite do seu pai  (`palpite-do-pai`)

- **Quando:** idade <= 24; importância 4, cena `casa-familia`.
- **Situação:** Seu pai liga depois do jogo e diz que o técnico erra na escalação e que você precisa falar com ele. Ele diz isso toda semana, mas hoje a voz está mais firme. A sua mãe, ao fundo, pede calma.
- Abertura *jovem*: Aos vinte e poucos, o pai ainda acha que manda no seu jogo.
- Abertura *idolo*: Mesmo ídolo, em casa você continua sendo o filho dele.
- Contexto *empresarioPressiona*: Seu empresário prefere que a família fale menos, e que a imprensa nem ouça.
- Contexto *moralBaixa*: Com a moral baixa, o palpite cai pior do que cairia.

| Opção | Jeito | Efeitos |
|---|---|---|
| Ouvir com carinho e agradecer o apoio | lider | moral ↑↑, disciplina ↓ |
| Cortar a conversa e pedir para ele não se meter | esquentado | técnico ↑, moral ↓↓ |
| Agradecer e mudar de assunto até desligar | frio | disciplina ↑, moral ↑ |

Padrão do automático: **Agradecer e mudar de assunto até desligar**

## A lista sai e você não está  (`lista-sem-seu-nome`)

- **Quando:** idade >= 20 e idade <= 30 e minutosFracao >= 0.5 e convocado == False; importância 7, cena `convocacao`.
- **Situação:** A convocação é divulgada, e o seu nome não aparece. Seu empresário já tinha dito que dava. No grupo da família, silêncio, e o celular não para de vibrar.
- Abertura *jovem*: No começo de carreira, a primeira lista sem o seu nome dói mais.
- Abertura *veterano*: Você já viu muita lista sem o seu nome e sabe como ela vira combustível.
- Contexto *empresarioPressiona*: Seu empresário já falou com a imprensa antes de falar com você.
- Contexto *posicaoDisputada*: Com a vaga em disputa, o nome do concorrente na lista pesa em dobro.

| Opção | Jeito | Efeitos |
|---|---|---|
| Treinar em dobro e deixar a resposta para o campo | frio | disciplina ↑↑, moral ↓ |
| Pedir ao empresário que descubra o que faltou | lider | moral ↓, disciplina ↑ |
| Reclamar no grupo e provar com gols depois | resenha | moral ↑, torcida ↓, disciplina ↓ |

Padrão do automático: **Treinar em dobro e deixar a resposta para o campo**

## Homenagem antes do jogo  (`homenagem-no-estadio`)

- **Quando:** idade >= 24 e idolatria >= 40; importância 5, cena `estadio`.
- **Situação:** O clube prepara uma homenagem antes da bola rolar: o telão passa lances seus e a torcida canta o seu nome de pé. O árbitro espera no círculo central. Você ainda tem um jogo para jogar.
- Abertura *idolo*: Ídolo de verdade ouve o próprio nome e ainda tem medo de chorar.
- Abertura *veterano*: Com tantos anos de casa, cada homenagem lembra que o fim está mais perto.
- Contexto *noClubeDeCoracao*: Homenagem no clube de coração é o sonho do menino que olhava da arquibancada.
- Contexto *capitao*: Com a faixa no braço, a homenagem é do clube todo, não só sua.

| Opção | Jeito | Efeitos |
|---|---|---|
| Agradecer de peito aberto, com a mão no peito | lider | torcida ↑↑, moral ↑↑, técnico ↓ |
| Acenar curto e se concentrar no jogo | frio | técnico ↑, torcida ↑, moral ↑ |
| Puxar o coro e chamar o time para cantar junto | resenha | moral ↑↑, torcida ↑↑, técnico ↓ |

Padrão do automático: **Acenar curto e se concentrar no jogo**
