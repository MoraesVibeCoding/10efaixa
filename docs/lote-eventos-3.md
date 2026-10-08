# T25b — lote 3: campo, rotina e vida (9 eventos)

> Para aprovação (2026-10-08). Mesmo formato dos lotes 1 e 2. Com este lote o catálogo chega a 84 eventos (meta: 80 ou mais).

## Confusão no meio do campo  (`confusao-no-meio-do-campo`)

- **Quando:** idade >= 18; importância 7, cena `estadio`.
- **Situação:** Uma dividida mais forte e os dois times se empurram no meio do campo. O árbitro apita sem parar, e o banco de reservas invade a linha lateral. Alguém puxa o seu braço.
- Abertura *capitao*: Com a faixa no braço, o juiz vem falar primeiro com você.
- Abertura *vilao*: Com a fama que você tem, o árbitro já vai direto no seu nome.
- Contexto *moralBaixa*: Com a cabeça quente, a confusão parece o lugar certo para descarregar.
- Contexto *veterano*: Você já viu muita briga começar assim e sabe como termina.

| Opção | Jeito | Efeitos |
|---|---|---|
| Entrar no meio para apartar a briga | lider | técnico ↑↑, torcida ↑, moral ↓ |
| Entrar na confusão e defender o companheiro | esquentado | torcida ↑↑, disciplina ↓↓, moral ↑ |
| Sair de perto e esperar o árbitro resolver | frio | disciplina ↑↑, moral ↓, torcida ↓ |

Padrão do automático: **Entrar no meio para apartar a briga**

## O técnico grita da beira  (`tecnico-grita-da-beira`)

- **Quando:** idade >= 18; importância 6, cena `estadio`.
- **Situação:** O técnico berra o seu nome da lateral, com o dedo em riste, na frente do estádio inteiro. Você errou uma marcação, mas o grito veio de longe e sem explicação. A câmera já está em você.
- Abertura *veterano*: Você já levou muito grito e sabe separar o técnico do homem.
- Abertura *jovem*: No começo de carreira, o primeiro grito do técnico fica na cabeça.
- Contexto *posicaoDisputada*: Com a vaga em disputa, qualquer resposta vira argumento contra você.
- Contexto *moralBaixa*: Com a moral baixa, o grito pesa mais que o erro.

| Opção | Jeito | Efeitos |
|---|---|---|
| Responder na lata, de longe | esquentado | moral ↑, técnico ↓↓, disciplina ↓↓ |
| Fazer sinal de entendido e voltar à posição | frio | técnico ↑↑, moral ↓ |
| Deixar a conversa para o intervalo | lider | técnico ↑, moral ↓, disciplina ↑ |

Padrão do automático: **Deixar a conversa para o intervalo**

## Um toque leve na área  (`toque-leve-na-area`)

- **Quando:** idade >= 18; importância 6, cena `estadio`.
- **Situação:** Aos quarenta do segundo tempo, no empate, o zagueiro encosta de leve em você dentro da área. Dá para cair e pedir o pênalti. O árbitro está a cinco metros, e o estádio já grita.
- Abertura *veterano*: Você já viu muito jogo decidido num toque que ninguém viu.
- Abertura *jovem*: Aprendendo o jogo, você ouve de todo lado que isso faz parte.
- Contexto *capitao*: Com a faixa no braço, o que você fizer vira exemplo para a molecada.
- Contexto *empresarioPressiona*: Seu empresário avisou: gol e pênalti contam, o resto ninguém lembra.

| Opção | Jeito | Efeitos |
|---|---|---|
| Cair e pedir o pênalti | resenha | torcida ↑↑, disciplina ↓↓, técnico ↑ |
| Seguir o lance e tentar a finalização | frio | moral ↑, disciplina ↑, torcida ↓ |
| Levantar e dizer ao árbitro que foi só um toque | lider | disciplina ↑↑, técnico ↑, torcida ↓↓, moral ↓ |

Padrão do automático: **Seguir o lance e tentar a finalização**

## O adversário caído e a bola rolando  (`adversario-caido-e-bola-rolando`)

- **Quando:** idade >= 18; importância 5, cena `estadio`.
- **Situação:** Um jogador do outro time cai com a mão no joelho, mas o árbitro manda o jogo seguir. Você está de frente para o gol, com a bola nos pés. O estádio inteiro pede o ataque.
- Abertura *capitao*: Capitão pensa no que o time vai dizer de si depois.
- Abertura *veterano*: Com a idade, você sabe que o jogo dura noventa minutos e a fama dura anos.
- Contexto *idolo*: Para o ídolo, o aplauso da torcida e o do adversário contam do mesmo jeito.
- Contexto *moralBaixa*: Com a moral baixa, a vontade é de aproveitar cada chance.

| Opção | Jeito | Efeitos |
|---|---|---|
| Chutar a bola para fora e parar o jogo | lider | torcida ↓, moral ↑↑, disciplina ↑ |
| Seguir o ataque e finalizar | esquentado | torcida ↑↑, moral ↑, disciplina ↓ |
| Pedir ao árbitro para parar o jogo | frio | técnico ↑, disciplina ↑, moral ↓ |

Padrão do automático: **Pedir ao árbitro para parar o jogo**

## O convite do psicólogo do clube  (`psicologo-do-clube`)

- **Quando:** idade >= 18 e moral < 0.7; importância 5, cena `vestiario`.
- **Situação:** O clube contratou um psicólogo, e o técnico sugere uma conversa com você. Você anda calado, e no elenco todo mundo reparou. A primeira sessão é na terça, antes do treino.
- Abertura *veterano*: Com os anos de estrada, ninguém precisa te explicar o que é pressão.
- Abertura *jovem*: No começo de carreira, falar da cabeça ainda parece fraqueza.
- Contexto *lesaoGrave*: Depois da lesão grave, a cabeça demora mais que o joelho para voltar.
- Contexto *salarioAtrasado*: Com o salário atrasado, pensar em outra coisa que não dinheiro é luxo.

| Opção | Jeito | Efeitos |
|---|---|---|
| Aceitar e ir já na terça | lider | moral ↑↑, técnico ↓ |
| Recusar e desabafar com a família | resenha | moral ↑, disciplina ↑ |
| Ir só uma vez, para ver como é | frio | moral ↑, técnico ↑, disciplina ↓ |

Padrão do automático: **Ir só uma vez, para ver como é**

## A dieta do nutricionista  (`dieta-do-nutricionista`)

- **Quando:** idade >= 21; importância 4, cena `treino`.
- **Situação:** O nutricionista entrega o novo cardápio: nada de frito, nada de refrigerante, sobremesa só no domingo. O churrasco da família é no sábado. O preparador já avisou que vai pesar todo mundo na segunda.
- Abertura *veterano*: Com os anos, o corpo já não perdoa o que você comia aos dezoito.
- Abertura *jovem*: Aos vinte e poucos, ninguém acha que sobremesa pesa.
- Contexto *capitao*: Com a faixa no braço, o seu prato vira exemplo no refeitório.
- Contexto *moralBaixa*: Com a moral baixa, a comida vira o único conforto do dia.

| Opção | Jeito | Efeitos |
|---|---|---|
| Seguir o cardápio à risca, até no churrasco | frio | disciplina ↑↑, moral ↓ |
| Negociar um dia livre por mês com o nutricionista | lider | disciplina ↑, técnico ↑, moral ↑ |
| Aproveitar o churrasco e compensar na semana | resenha | moral ↑↑, disciplina ↓↓ |

Padrão do automático: **Negociar um dia livre por mês com o nutricionista**

## Foto na mesa do jantar  (`foto-na-mesa-do-jantar`)

- **Quando:** idade >= 18 e idolatria >= 25; importância 4, cena `casa-familia`.
- **Situação:** Num jantar de domingo com a família, um torcedor se aproxima da mesa com o celular. Atrás dele, mais quatro esperam a vez. Sua mãe está no meio da sobremesa, e o prato esfriou.
- Abertura *idolo*: Quando o ídolo senta à mesa, o restaurante inteiro fica de olho.
- Abertura *vilao*: Para quem a torcida vaiou na semana, até a foto vira teste.
- Contexto *empresarioPressiona*: Seu empresário diz que cada foto bem tirada vale mais que um comercial.
- Contexto *noClubeDeCoracao*: Com a camisa do clube de coração, todo olhar na rua vira cobrança.

| Opção | Jeito | Efeitos |
|---|---|---|
| Atender todos, mesmo com o prato esfriando | lider | torcida ↑↑, moral ↓, disciplina ↑ |
| Fazer uma piada, tirar uma foto e voltar à mesa | resenha | torcida ↑, moral ↑ |
| Pedir, seco, que deixem o jantar em paz | esquentado | torcida ↓↓, moral ↑, disciplina ↑ |

Padrão do automático: **Atender todos, mesmo com o prato esfriando**

## Voo atrasado na véspera  (`voo-atrasado-na-vespera`)

- **Quando:** idade >= 18; importância 5, cena `aeroporto`.
- **Situação:** O voo do time atrasa cinco horas, e o jogo é amanhã às quatro da tarde. O elenco se espalha pelo aeroporto, cansado e de cara fechada. O preparador sugere dormir cedo, mas o saguão está cheio de torcedores.
- Abertura *capitao*: Com a faixa no braço, o grupo olha para você para saber o ânimo.
- Abertura *veterano*: Você já dormiu em muito saguão e sabe que ninguém joga bem sem descanso.
- Contexto *foraDoEixo*: Longe dos grandes centros, voo atrasado é parte do calendário.
- Contexto *campeaoNoAno*: Com o título à vista, ninguém quer perder o sono por causa de um voo.

| Opção | Jeito | Efeitos |
|---|---|---|
| Reunir o elenco e dormir no primeiro hotel | lider | técnico ↑↑, moral ↓, disciplina ↑ |
| Animar o grupo com resenha até o embarque | resenha | moral ↑↑, disciplina ↓, torcida ↑ |
| Ir sozinho para o hotel e se isolar | frio | disciplina ↑↑, moral ↓, técnico ↓ |

Padrão do automático: **Reunir o elenco e dormir no primeiro hotel**

## O elogio do adversário  (`elogio-do-adversario`)

- **Quando:** idade >= 20 e idolatria >= 20; importância 4, cena `entrevista`.
- **Situação:** Depois do jogo, o craque do time rival diz na entrevista que você é o melhor da posição que ele já enfrentou. O repórter te mostra o vídeo e pergunta o que você acha. Os seus companheiros olham de longe.
- Abertura *idolo*: Elogio de adversário vale mais que o de torcedor, e todo mundo sabe.
- Abertura *convocado*: Quem veste a camisa da Seleção aprende a pesar até um elogio.
- Contexto *empresarioPressiona*: Seu empresário já recortou o vídeo para mostrar a outros clubes.
- Contexto *capitao*: Com a faixa no braço, o elogio é um pouco do time todo.

| Opção | Jeito | Efeitos |
|---|---|---|
| Retribuir o elogio com respeito | lider | torcida ↑, técnico ↑, moral ↑ |
| Agradecer em uma frase e mudar de assunto | frio | torcida ↑, disciplina ↑ |
| Brincar que ele só estava sendo gentil | resenha | moral ↑↑, torcida ↑, disciplina ↓ |

Padrão do automático: **Retribuir o elogio com respeito**
