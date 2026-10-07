# T25b — lote 1: campo e postura em campo (15 eventos)

> Para aprovação (2026-10-07). Cada evento entra pelo **sorteio de catálogo** (`sorteio: true`), com texto em camadas (abertura + contexto por etiqueta). Setas: uma = efeito pequeno, duas = grande. Nada de número na tela. As cenas **Vaia** e **Clássico** ainda não têm arte pintada, então os dois eventos usam a cena do estádio por enquanto.

## A arquibancada vaia  (`vaia-da-torcida`)

- **Quando:** idade >= 18 e moral < 0.7; importância 7, cena `estadio`.
- **Situação:** Dois erros seguidos e a vaia desce da arquibancada inteira, alta o bastante para você ouvir em campo. A bola volta para você no meio-campo. No banco, o técnico não tira os olhos de você.
- Abertura *vilao*: Com a torcida já desconfiada, a vaia vem mais rápida e mais forte.
- Abertura *jovem*: Com poucos anos de carreira, cada assobio ainda dói.
- Contexto *idolo*: Para quem já foi aplaudido de pé ali, a vaia machuca mais.
- Contexto *moralBaixa*: A cabeça já andava pesada, e agora o estádio inteiro confirma.

| Opção | Jeito | Efeitos |
|---|---|---|
| Rebater a vaia com um gesto para a arquibancada | esquentado | torcida ↓↓, moral ↑↑, disciplina ↓↓ |
| Erguer a mão e pedir paciência à torcida | lider | torcida ↑↑, moral ↓↓ |
| Baixar a cabeça e pedir a bola de novo | frio | moral ↑, disciplina ↑, torcida ↓ |

Padrão do automático: **Baixar a cabeça e pedir a bola de novo**

## Faltam dois minutos para o fim  (`cera-no-fim`)

- **Quando:** idade >= 18; importância 7, cena `estadio`.
- **Situação:** Vitória por um a zero e dois minutos para o apito. O técnico faz sinal com as duas mãos para você segurar a bola. A torcida, de pé, quer ver o time atrás do segundo gol.
- Abertura *capitao*: Com a faixa no braço, o time inteiro olha para o que você fizer agora.
- Abertura *campeaoNoAno*: Com o título na esquina, ninguém quer abrir a porta para a virada.
- Contexto *noBanco*: Quem vem do banco sabe o valor de cada minuto em campo.
- Contexto *veterano*: Você já viu jogo ganho escapar nos acréscimos, e sabe como dói.

| Opção | Jeito | Efeitos |
|---|---|---|
| Cavar uma falta perto da bandeirinha | resenha | técnico ↑↑, torcida ↓, disciplina ↓ |
| Segurar a bola no ataque, sem cera | frio | técnico ↑, moral ↑ |
| Ir atrás do segundo gol e ignorar o sinal | esquentado | torcida ↑↑, técnico ↓↓, moral ↑ |

Padrão do automático: **Segurar a bola no ataque, sem cera**

## Pênalti marcado contra você  (`penalti-contra-voce`)

- **Quando:** idade >= 18; importância 8, cena `estadio`.
- **Situação:** O árbitro aponta a marca do pênalti por uma mão que você jura que não foi. O adversário já comemora, a bola está no ponto e o árbitro leva a mão ao bolso do cartão.
- Abertura *vilao*: Para quem já tem fama de problema, qualquer reclamação soa pior.
- Abertura *idolo*: Um ídolo discutindo com o árbitro vira assunto antes de o jogo acabar.
- Contexto *capitao*: Com a faixa no braço, o time espera que você seja o primeiro a manter a calma.
- Contexto *moralBaixa*: Num dia já ruim, a injustiça parece pessoal.

| Opção | Jeito | Efeitos |
|---|---|---|
| Cercar o árbitro e reclamar no limite | esquentado | disciplina ↓↓, torcida ↑, moral ↑ |
| Chamar o capitão para falar por você | lider | técnico ↑, disciplina ↑, moral ↓ |
| Engolir o lance e voltar para a posição | frio | moral ↓↓, disciplina ↑↑ |

Padrão do automático: **Engolir o lance e voltar para a posição**

## Microfone depois da derrota  (`entrevista-pos-derrota`)

- **Quando:** idade >= 18 e moral < 0.75; importância 6, cena `entrevista`.
- **Situação:** Perdeu em casa, e o repórter da beira do campo vem direto até você. A torcida ainda grita lá em cima. Qualquer frase vira manchete antes de o ônibus sair.
- Abertura *idolo*: Quem é ídolo pesa cada palavra: a torcida lê tudo duas vezes.
- Abertura *jovem*: Jovem ainda, você sabe que uma frase solta persegue por meses.
- Contexto *empresarioPressiona*: Seu empresário manda mensagem: fala pouco e não cita ninguém.
- Contexto *capitao*: Com a faixa no braço, a sua resposta vale pelo grupo todo.

| Opção | Jeito | Efeitos |
|---|---|---|
| Culpar a arbitragem e o gramado | esquentado | torcida ↑↑, disciplina ↓↓, técnico ↓ |
| Assumir a sua parte e pedir desculpa | lider | técnico ↑↑, torcida ↑, moral ↓ |
| Falar o básico e seguir para o vestiário | frio | disciplina ↑, torcida ↓, moral ↓ |

Padrão do automático: **Falar o básico e seguir para o vestiário**

## Marcação dura no clássico  (`marcacao-dura-no-classico`)

- **Quando:** idade >= 19; importância 8, cena `estadio`.
- **Situação:** No clássico, o marcador te dá pancada em toda dividida, e o árbitro deixa o jogo correr. Aos vinte minutos você já tem a canela marcada. Os dois bancos olham para você.
- Abertura *idolo*: Em clássico, a torcida espera que o seu ídolo não abaixe a cabeça.
- Abertura *veterano*: Você já levou muita pancada em clássico e sabe como o jogo vira.
- Contexto *vilao*: Com a torcida em cima de você, qualquer recuo vira assunto na segunda.
- Contexto *capitao*: Com a faixa no braço, o time copia a sua reação.

| Opção | Jeito | Efeitos |
|---|---|---|
| Devolver na dividida, com tudo | esquentado | torcida ↑↑, disciplina ↓↓, moral ↑ |
| Tirar a bola rápido e deixar o juiz resolver | frio | moral ↓, disciplina ↑↑ |
| Chamar o capitão e segurar a cabeça do time | lider | técnico ↑↑, torcida ↑, moral ↓ |

Padrão do automático: **Tirar a bola rápido e deixar o juiz resolver**

## Silêncio no vestiário  (`vestiario-pos-derrota`)

- **Quando:** idade >= 18 e moral < 0.7; importância 7, cena `vestiario`.
- **Situação:** Derrota em casa e vestiário mudo. Alguém joga a garrafa na parede, outro tira a chuteira devagar. Ninguém levanta a cabeça, e o técnico ainda não entrou.
- Abertura *capitao*: Com a faixa no braço, o silêncio cobra uma palavra sua.
- Abertura *veterano*: Você já viu muita derrota assim, e sabe que o que se diz agora fica.
- Contexto *posicaoDisputada*: Sua vaga está em disputa, e qualquer palavra será lida como posição.
- Contexto *moralBaixa*: Com a moral no chão, qualquer silêncio parece dar razão à derrota.

| Opção | Jeito | Efeitos |
|---|---|---|
| Levantar a voz e cobrar cada um | esquentado | técnico ↑↑, moral ↓↓, disciplina ↓ |
| Passar de um em um e dar a mão | lider | moral ↑↑, técnico ↓ |
| Tomar banho e sair quieto, sem falar nada | frio | moral ↓, disciplina ↑ |

Padrão do automático: **Tomar banho e sair quieto, sem falar nada**

## O técnico não te olha  (`banco-sem-olhar`)

- **Quando:** idade >= 18 e minutosFracao < 0.4; importância 7, cena `banco-de-reservas`.
- **Situação:** Terceiro jogo seguido no banco. O técnico mexe no time duas vezes e não olha para o seu lado. Na arquibancada, a sua família mostra a camisa com o seu número.
- Abertura *jovem*: Com poucos anos de carreira, ficar de fora parece um recado.
- Abertura *veterano*: Você já viu essa cena antes e sabe como ela costuma acabar.
- Contexto *empresarioPressiona*: Seu empresário já ligou duas vezes: se não jogar, ele procura outro lugar.
- Contexto *salarioAtrasado*: Sem jogar e sem receber, a paciência vai acabando.

| Opção | Jeito | Efeitos |
|---|---|---|
| Bater na porta do técnico e pedir conversa | lider | técnico ↑↑, moral ↓ |
| Treinar mais forte e esperar a chance | frio | disciplina ↑↑, moral ↓, técnico ↑ |
| Reclamar no grupo do elenco e rir da situação | resenha | moral ↑↑, técnico ↓↓, disciplina ↓ |

Padrão do automático: **Treinar mais forte e esperar a chance**

## O gol que não entrou  (`gol-feito-perdido`)

- **Quando:** idade >= 17; importância 6, cena `gol`.
- **Situação:** Cara a cara com o goleiro e o gol aberto, você chuta por cima do travessão. O estádio inteiro põe a mão na cabeça. Dois minutos depois, a bola volta a passar por você.
- Abertura *jovem*: Aos poucos anos de carreira, um gol perdido ainda dura a semana inteira.
- Abertura *veterano*: Com a idade, você aprendeu que gol perdido se esquece jogando.
- Contexto *idolo*: Para quem é esperança da torcida, o gol perdido pesa em dobro.
- Contexto *posicaoDisputada*: Com a vaga em disputa, o técnico vai lembrar desse lance.

| Opção | Jeito | Efeitos |
|---|---|---|
| Pedir a bola de novo e tentar outra vez | esquentado | moral ↑↑, torcida ↑, técnico ↓ |
| Levantar a mão e pedir desculpa ao grupo | lider | técnico ↑, moral ↓, disciplina ↑ |
| Rir de si mesmo e seguir o jogo | resenha | moral ↑, torcida ↑, disciplina ↓ |

Padrão do automático: **Levantar a mão e pedir desculpa ao grupo**

## Comemoração fora do combinado  (`comemoracao-fora-do-combinado`)

- **Quando:** idade >= 17; importância 6, cena `gol`.
- **Situação:** Gol aos quarenta do segundo tempo, e você sai correndo para a torcida. Dá para tirar a camisa, dançar na bandeirinha ou correr para o banco. O árbitro já está de olho.
- Abertura *idolo*: O estádio canta o seu nome, e a vontade é de dar tudo.
- Abertura *jovem*: Nos primeiros anos de gols, qualquer comemoração vira vídeo.
- Contexto *noClubeDeCoracao*: Gol com a camisa do clube de coração tem outro peso.
- Contexto *capitao*: Com a faixa no braço, a comemoração também fala pelo time.

| Opção | Jeito | Efeitos |
|---|---|---|
| Tirar a camisa e subir no alambrado | esquentado | torcida ↑↑, disciplina ↓↓, moral ↑↑ |
| Chamar o time para dançar na bandeirinha | resenha | moral ↑↑, torcida ↑, disciplina ↓ |
| Correr para abraçar o banco inteiro | lider | técnico ↑↑, moral ↑ |

Padrão do automático: **Correr para abraçar o banco inteiro**

## Você não volta para o segundo tempo  (`substituido-no-intervalo`)

- **Quando:** idade >= 18 e minutosFracao >= 0.6; importância 7, cena `banco-de-reservas`.
- **Situação:** Na volta do intervalo, o técnico avisa que você não entra para o segundo tempo. Diz que o time precisa de mais marcação. O seu substituto já aquece, e a torcida estranha.
- Abertura *capitao*: Capitão é o último a querer sair e o primeiro a ser olhado quando sai.
- Abertura *veterano*: Você já viu técnico mexer em muita gente, e sabe que passa.
- Contexto *empresarioPressiona*: Seu empresário já avisou que isso não pode virar rotina.
- Contexto *moralBaixa*: Com a moral baixa, ser trocado soa como um veredito.

| Opção | Jeito | Efeitos |
|---|---|---|
| Sair sem reclamar e torcer do banco | frio | técnico ↑↑, moral ↓ |
| Chutar a garrafa e sentar longe do banco | esquentado | moral ↑, técnico ↓↓, disciplina ↓↓ |
| Pedir a explicação ao técnico depois do jogo | lider | técnico ↑, moral ↓, disciplina ↑ |

Padrão do automático: **Sair sem reclamar e torcer do banco**

## Jogo grande, bola pesada  (`jogo-grande-bola-pesada`)

- **Quando:** idade >= 19 e minutosFracao >= 0.5; importância 9, cena `estadio`.
- **Situação:** Decisão de campeonato, casa cheia, e a bola vale mais do que de costume. No intervalo o time perde por um gol, e o técnico quer saber quem pede a bola no segundo tempo.
- Abertura *idolo*: A casa cheia grita o seu nome antes mesmo de a bola rolar.
- Abertura *jovem*: Nunca jogou um jogo assim, e todo mundo sabe.
- Contexto *convocado*: Com a Seleção olhando, um jogo desses vale mais que um mês de treino.
- Contexto *empresarioPressiona*: Seu empresário já avisou que um jogo assim muda o valor do seu passe.

| Opção | Jeito | Efeitos |
|---|---|---|
| Pedir a bola e assumir o jogo | esquentado | torcida ↑↑, moral ↑, técnico ↓ |
| Jogar simples e fazer o time rodar a bola | frio | técnico ↑↑, moral ↑ |
| Reunir o time e gritar que a virada vem | lider | moral ↑↑, torcida ↑, disciplina ↓ |

Padrão do automático: **Jogar simples e fazer o time rodar a bola**

## O técnico te poupa do clássico  (`poupado-no-classico`)

- **Quando:** idade >= 21 e minutosFracao >= 0.6; importância 7, cena `banco-de-reservas`.
- **Situação:** Duas partidas pesadas em quatro dias, e o preparador pede descanso. O técnico diz que você começa no banco no clássico. A torcida vai querer saber por quê.
- Abertura *idolo*: Para o ídolo, ficar fora do clássico é notícia no dia seguinte.
- Abertura *capitao*: Capitão fora do clássico é recado, e todo mundo vai querer entender qual.
- Contexto *veterano*: O corpo já pede o que o técnico está dando: um jogo de folga.
- Contexto *posicaoDisputada*: Com a vaga em disputa, descansar pode ser entregar o lugar.

| Opção | Jeito | Efeitos |
|---|---|---|
| Aceitar o descanso e agradecer ao preparador | frio | moral ↓, disciplina ↑↑, técnico ↑ |
| Pedir para começar jogando e assumir o risco | esquentado | moral ↑↑, torcida ↑, técnico ↓↓ |
| Defender a decisão do técnico na imprensa | lider | técnico ↑↑, torcida ↓, moral ↓ |

Padrão do automático: **Aceitar o descanso e agradecer ao preparador**

## Atraso no treino da manhã  (`atraso-no-treino`)

- **Quando:** idade >= 18; importância 5, cena `treino`.
- **Situação:** O despertador não tocou, e você chega vinte minutos depois do aquecimento. O elenco já está em campo e o técnico olha o relógio de braços cruzados. O preparador anota o seu nome.
- Abertura *jovem*: No começo da carreira, todo atraso vira exemplo para o grupo.
- Abertura *veterano*: Veterano atrasado pesa mais: o elenco repara no exemplo que você dá.
- Contexto *capitao*: Com a faixa no braço, o seu atraso pesa mais que o dos outros.
- Contexto *moralBaixa*: Com a cabeça longe do clube, o despertador virou o de menos.

| Opção | Jeito | Efeitos |
|---|---|---|
| Assumir o erro e aceitar a multa | lider | disciplina ↑, técnico ↑, moral ↓ |
| Inventar o trânsito e entrar no treino | resenha | moral ↑, técnico ↓↓, disciplina ↓↓ |
| Entrar calado e correr mais que todos | frio | disciplina ↑↑, moral ↓ |

Padrão do automático: **Assumir o erro e aceitar a multa**

## O garoto novo no vestiário  (`garoto-novo-no-vestiario`)

- **Quando:** idade >= 29; importância 5, cena `vestiario`.
- **Situação:** Chegou um garoto da base, tímido, com a chuteira ainda limpa. Ele senta no canto e olha para você. O elenco brinca com ele, e o técnico espera ver quem toma a frente.
- Abertura *veterano*: Você já foi esse garoto, e lembra de quem estendeu a mão.
- Abertura *idolo*: Para o ídolo, cada gesto com o garoto vira história no vestiário.
- Contexto *capitao*: Com a faixa no braço, a primeira impressão do garoto é a que você der.
- Contexto *posicaoDisputada*: Ele pode ser o seu concorrente, e todo mundo sabe.

| Opção | Jeito | Efeitos |
|---|---|---|
| Chamar o garoto e mostrar como funciona | lider | técnico ↑↑, moral ↑, disciplina ↓ |
| Entrar na brincadeira e batizar o garoto | resenha | moral ↑↑, técnico ↓, disciplina ↓ |
| Manter a distância e cuidar do seu jogo | frio | disciplina ↑, moral ↓ |

Padrão do automático: **Chamar o garoto e mostrar como funciona**

## Intervalo perdendo por dois  (`intervalo-perdendo-por-dois`)

- **Quando:** idade >= 18; importância 7, cena `vestiario`.
- **Situação:** Dois a zero no intervalo, e o vestiário está num buraco. O técnico está de costas, rabiscando no quadro. Todo mundo olha para o chão, menos você.
- Abertura *capitao*: Com a faixa no braço, é você quem precisa quebrar o silêncio.
- Abertura *idolo*: A torcida que canta o seu nome espera a virada, e você sabe disso.
- Contexto *veterano*: Você já virou jogo assim, e sabe que o primeiro a falar muda o clima.
- Contexto *moralBaixa*: Com a cabeça já pesada, falar parece mais difícil que correr.

| Opção | Jeito | Efeitos |
|---|---|---|
| Cobrar do grupo e dividir as responsabilidades | esquentado | moral ↑, técnico ↓, disciplina ↓ |
| Apoiar o técnico e repetir o plano dele | lider | técnico ↑↑, moral ↓ |
| Propor o ajuste que você viu em campo | frio | moral ↑, técnico ↓↓ |

Padrão do automático: **Apoiar o técnico e repetir o plano dele**
