# Eventos reescritos — para aprovação

Reescrita dos 25 eventos com a skill `10efaixa-narrativa` (SPEC v2.23). **Gerado a partir de `src/data/events.json` e `src/i18n/pt-BR/events.json`**: o que está aqui é exatamente o que o jogo faz.

A coluna *Consequência (dados)* mostra os números internos só para a sua revisão. **O jogador nunca vê percentual**: ele vê setas na opção, o risco em palavras e o ganho e a perda no cartão de resultado.

Jeito = o temperamento que escolhe aquela opção sozinho na simulação; ★ marca a escolha padrão de quem não tem opção própria.

## Esticou de vez!  ·  `estirao-grande`

> Em seis meses você passou o seu irmão mais velho e a calça do uniforme virou bermuda. O corpo ainda não sabe o que fazer com tanta perna: a bola, que era amiga, agora foge do pé.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Ficar depois do treino para reaprender o corpo | Líder | Disciplina +5; Relação com o técnico +5; Moral −3 |
| Seguir o plano do preparador, sem pressa | Frio ★ | Disciplina +3; Moral −2 |
| Tirar onda com a altura nova na escola | Resenha | Moral +8; Disciplina −3 |

## Treino que vira talento  ·  `traco-desbloqueado`

> Aquele movimento que você repetiu mil vezes no fim do treino saiu no jogo, sem pensar. O auxiliar anotou na prancheta. No vestiário, já tem gente pedindo para você ensinar.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Ensinar o lance aos mais novos depois do treino | Líder | Relação com o técnico +5; Disciplina +3; Moral −3 |
| Guardar o segredo e seguir repetindo | Frio ★ | Disciplina +5; Relação com o técnico −2 |
| Postar o lance em câmera lenta nas redes | Resenha | Moral +8; Torcida +3; Disciplina −5 |

## Técnico novo no CT  ·  `troca-tecnico`

> A diretoria demitiu o técnico depois da terceira derrota seguida. O novo chegou de agasalho fechado até o pescoço e avisou que ninguém tem lugar garantido. Quem era reserva voltou a sonhar.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Chegar primeiro ao CT e se apresentar | Líder | Relação com o técnico recomeça em 60; Moral −3 |
| Esperar a chance e mostrar serviço no treino | Frio ★ | Relação com o técnico recomeça em 50; Disciplina +3; Moral −2 |
| Cobrar explicação se for para o banco | Esquentado | Relação com o técnico recomeça em 40; Moral +5 |

## O rival bateu na porta  ·  `proposta-rival`

> O maior rival do seu clube fez uma proposta que dobra o seu salário. A notícia vazou antes de você atender o telefone. No treino, a torcida pendurou uma faixa na grade: "Aqui não tem traidor".

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Aceitar e vestir a camisa do rival | Esquentado | vai para o rival; transfere |
| Recusar e beijar o escudo no próximo jogo | Líder ★ | Torcida +8; Moral −5 |
| Usar a proposta para pedir aumento aqui | Frio | Salário +10%; Torcida −5; Relação com o técnico −3 |

## Salário atrasado de novo  ·  `salario-atrasado`

> Dois meses sem ver a cor do dinheiro. O elenco está dividido, o roupeiro já pediu dinheiro emprestado e a diretoria só pede paciência.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Pedir para sair na próxima janela | Frio | pede para sair; Relação com o técnico −10 |
| Ficar e segurar o elenco junto | Líder ★ | Moral −10; Torcida +5 |
| Cobrar a diretoria na frente de todo mundo | Esquentado | Relação com o técnico −5; Torcida +3; Disciplina −2 |

## O clube do coração chamou  ·  `proposta-coracao`

> O clube que você via da arquibancada ligou. O salário é menor que o das outras propostas, mas a camisa é aquela. Seu empresário torce o nariz; sua mãe já chorou.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Assinar pelo salário que eles podem pagar | Líder | transfere; Salário −15%; Torcida do coração +5 |
| Jogar por amor, ganhando bem menos | Resenha ★ | transfere; Salário −30%; Torcida do coração +10; Moral +5 |
| Agradecer e seguir onde está | Frio | Moral −5; Torcida do coração −5 |

## O rival do seu clube do coração  ·  `traicao-coracao`

> O rival do time que você torce desde criança quer te contratar, e paga bem. No bairro onde você cresceu, a notícia chegou antes do almoço. Seu tio avisou: se vestir aquela camisa, nem precisa aparecer no Natal.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Aceitar: futebol é profissão | Frio | transfere; Torcida do coração −40 |
| Recusar em silêncio | Líder ★ | Torcida do coração +3; Moral −3 |
| Recusar e dizer em público que não veste essa | Esquentado | Torcida do coração +10; Disciplina −5 |

## Gol contra o clube do coração  ·  `jogo-contra-coracao`

> Bola na área, você chega primeiro e estufa a rede contra o time que aprendeu a amar na arquibancada. Os companheiros vêm correndo. No setor visitante, tem gente que você conhece pelo nome.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Comemorar com a torcida do seu clube | Esquentado | Torcida do coração −15; Torcida +5 |
| Não comemorar, por respeito | Líder ★ | Torcida do coração +5; Torcida −3 |
| Comemorar discreto, só com os companheiros | Frio | Torcida do coração −5; Torcida +2 |

## Venda fechada sem você saber  ·  `empresario-forca-venda`

> Você soube pelo jornal: seu empresário acertou a sua venda e já recebeu a parte dele. A diretoria diz que o negócio está fechado. Ninguém perguntou o que você queria.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Aceitar a transferência e fazer as malas | Frio | transfere; Moral −3 |
| Bater o pé e ficar no clube | Líder ★ | Moral −5; Relação com o técnico +5 |
| Romper com o empresário | Esquentado | troca de empresário; Moral +3 |

## Sumiu dinheiro da conta  ·  `empresario-some-dinheiro`

> O extrato chegou e a conta não fecha: falta uma parte do que você juntou. Seu empresário fala em "taxa de investimento" e muda de assunto. Seu pai, que nunca reclama, ficou calado no almoço.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Trocar de empresário e chamar um advogado | Frio ★ | troca de empresário; Moral −5 |
| Acreditar na explicação e seguir com ele | Resenha | Moral −2; Disciplina −2 |
| Cobrar cara a cara o dinheiro de volta | Esquentado | Moral +2; Disciplina −5 |

## Empresário brigou com a diretoria  ·  `empresario-briga-clube`

> Seu empresário e o presidente bateram boca por causa da sua renovação. O técnico, que ficou no meio, quer saber de que lado você está antes do próximo jogo.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Ficar do lado do empresário | Esquentado | Relação com o técnico −10; Moral +3 |
| Ficar do lado do clube | Líder ★ | Relação com o técnico +5; Moral −3 |
| Não se meter e deixar os dois se entenderem | Frio | Relação com o técnico −2; Disciplina +2 |

## Hora de renovar o contrato  ·  `renovacao`

> Falta um ano de contrato e a diretoria chamou para conversar. A proposta traz um aumento pelo que você evoluiu. Seu empresário acha que dá para pedir mais; o técnico quer saber se pode contar com você.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Renovar nas condições oferecidas | Líder ★ | renova; Relação com o técnico +3 |
| Renovar, mas pedir um aumento maior | Esquentado | renova; pede aumento maior; Relação com o técnico −5 |
| Não renovar e sair livre no fim do contrato | Frio | não renova; Moral −2; Torcida −5 |

## Lesão grave  ·  `lesao-grave`

> O joelho fez um barulho que você nunca tinha ouvido. O médico do clube mostra a ressonância e explica três caminhos. Seu empresário quer você em campo logo; sua mãe quer você inteiro.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Operar e parar um ano: risco baixo de recaída | Frio | 2 semestre(s) fora, recaída 5%, perda física 1; Moral −10 |
| Tratar sem cirurgia, seis meses: risco médio | Resenha | 1 semestre(s) fora, recaída 20%, perda física 2; Moral −5 |
| Voltar no sacrifício: risco muito alto | Líder ★ | 0.5 semestre(s) fora, recaída 45%, perda física 3; Torcida +5 |

## O técnico quer você em outra posição  ·  `mudanca-posicao`

> O técnico te chamou no canto do campo com a prancheta na mão. Falta gente na outra posição e ele acha que você rende lá. Pode ser o caminho para jogar mais, ou para virar quebra-galho.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Topar e aprender a nova função | Líder ★ | muda de posição; Relação com o técnico +8; Moral −3 |
| Recusar: seu lugar é onde sempre jogou | Esquentado | Relação com o técnico −8; Moral +3 |
| Topar, mas pedir sequência na nova posição | Frio | muda de posição; Relação com o técnico −2; Moral +2 |

## Convite para a festa  ·  `festa`

> Sábado tem aniversário do lateral, numa casa com piscina e som alto. Domingo tem jogo às quatro da tarde. Metade do elenco já confirmou presença no grupo.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Ir e ficar até o fim | Resenha ★ | Moral +8; Disciplina −10 |
| Ficar em casa e dormir cedo | Frio | Moral −2; Disciplina +3 |
| Dar uma passada e sair antes da meia-noite | Líder | Moral +3; Disciplina −3 |

## Polêmica nas redes  ·  `polemica-redes`

> Um corte de dez segundos da sua entrevista viralizou fora de contexto. Nos comentários, já tem gente pedindo a sua saída. No grupo do elenco, silêncio.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Postar a sua versão, sem filtro | Esquentado | Disciplina −10; Torcida +6; Relação com o técnico −5 |
| Ficar quieto e esperar a poeira baixar | Frio ★ | Disciplina +2; Torcida −3 |
| Rir de si mesmo num vídeo e virar a página | Resenha | Torcida +3; Disciplina −3 |

## A casa da família  ·  `casa-da-familia`

> Pela primeira vez, a conta tem dinheiro para tirar a família do aluguel. Sua mãe já escolheu o bairro, mas não pede nada. O corretor manda fotos todo dia.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Comprar a casa à vista | Líder ★ | Patrimônio −15%; Moral +10; compra a casa |
| Comprar financiada e deixar o dinheiro rendendo | Frio | Patrimônio −7%; Moral +7; compra a casa |
| Ainda não: primeiro curtir um pouco o dinheiro | Resenha | Patrimônio −3%; Moral +3; Disciplina −3 |

## Proposta de investimento  ·  `investir`

> Um conhecido do seu empresário oferece sociedade numa rede de academias que "não tem como dar errado". O retorno pode ser grande; o prejuízo também. Ele quer resposta até sexta.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Entrar com uma parte grande do que você tem | Esquentado ★ | investe parte do patrimônio (retorno incerto) |
| Guardar o dinheiro onde está | Frio | Disciplina +3 |
| Pagar um consultor para analisar antes | Líder | Patrimônio −1%; Disciplina +5 |

## Mudou de postura  ·  `amadurecimento`

> Teve um jogo em que você perdeu a cabeça e o time pagou. Teve outro em que você segurou a onda e decidiu. Os mais velhos do elenco perceberam a diferença antes de você.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Assumir a voz no vestiário | Líder | Disciplina +8; Relação com o técnico +5; Moral −3 |
| Seguir quieto e deixar o jogo falar | Frio ★ | Disciplina +10; Moral −2 |
| Comemorar a fase com a família e os amigos | Resenha | Moral +8; Disciplina +3 |

## O clube que te revelou te quer de volta  ·  `retorno-formador`

> O clube que te revelou quer você de volta para encerrar a carreira em casa. O salário é bem menor, mas o estádio onde você estreou ainda tem a sua foto na parede. Seus filhos nunca te viram jogar lá.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Voltar para casa e encerrar a carreira lá | Líder ★ | encerra a carreira lá; Moral +10; Torcida +15 |
| Agradecer e seguir onde está | Frio | Moral −2 |
| Recusar: ainda tem lenha para um clube grande | Esquentado | Moral +5; Torcida −5 |

## O clube do coração quer a sua despedida  ·  `realizar-sonho`

> O clube do seu coração quer que você encerre a carreira lá, com estádio cheio e camisa com o seu nome. É o sonho do menino da arquibancada. O corpo pede descanso; a cabeça ainda pede jogo.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Realizar o sonho | Resenha ★ | encerra a carreira lá; Moral +10; Torcida +15 |
| Agradecer e seguir onde está | Frio | Moral −3 |
| Aceitar e pedir a faixa de capitão | Líder | encerra a carreira lá; Moral +10; Torcida +20; Relação com o técnico −5 |

## No sacrifício pela Seleção  ·  `copa-sacrificio`

> A coxa ainda reclama do último jogo e o médico da Seleção fez cara feia. É jogo decisivo e o treinador espera a sua resposta. O país inteiro vai assistir.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Jogar desde o início: risco alto de lesão | Líder ★ | Moral +5; time +2 de força; risco de lesão 25% |
| Ficar fora e se recuperar para a próxima fase | Frio | Moral −5 |
| Entrar no segundo tempo: risco médio de lesão | Resenha | Moral +2; time +1 de força; risco de lesão 12% |

## Fora de posição na Seleção  ·  `copa-fora-posicao`

> Faltou um jogador na outra posição e o treinador da Seleção quer você lá, na véspera do jogo. Não é onde você brilha. Mas é a Seleção, e a fila de quem quer o seu lugar é grande.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Jogar onde o time precisa | Líder ★ | Moral +2; time +1 de força |
| Recusar e ficar fora do resto do torneio | Esquentado | Moral +5; fica fora do resto do torneio |
| Jogar lá, mas do seu jeito, sem mudar o estilo | Frio | Moral +4 |

## O pênalti decisivo  ·  `copa-penalti`

> Disputa de pênaltis, última cobrança. Se fizer, a Seleção avança; se errar, o país inteiro lembra o seu nome por anos. O capitão olha para você com a bola na mão.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Pedir a bola ao capitão e bater | Líder ★ | Moral +2; bate o pênalti (acerto pela cabeça, de 50% a 92%) |
| Deixar para quem treinou as cobranças | Resenha | Moral −2; Disciplina +3 |
| Tomar a bola de quem ia bater e encher o pé | Esquentado | Moral +5; Disciplina −5; bate o pênalti (acerto pela cabeça, de 50% a 92%) |

## Outra seleção quer você  ·  `dupla-nacionalidade`

> A federação do país dos seus avós mandou uma carta: querem você na próxima convocação, e lá você seria titular. A Seleção Brasileira ainda nem sabe o seu nome. Aceitar é para sempre.

| Opção | Jeito | Consequência (dados) |
|---|---|---|
| Aceitar e defender outro país para sempre | Frio | troca de seleção para sempre; Moral +5 |
| Recusar e esperar a camisa amarela | Líder ★ | Moral +2 |
| Recusar e se oferecer à Seleção nas redes | Resenha | Moral +2; Torcida +5; Disciplina −3 |
