# Copero — o que observei jogando uma carreira inteira

Jogado em 2026-10-02 em https://copero.io/pt, no computador, do começo à aposentadoria: meia-atacante brasileiro, 18 temporadas (16 a 34 anos), 6 clubes em 5 países, 536 jogos, 10 títulos, pico de 71 de overall, 5.802 pontos.

**Outra referência indicada pelo usuário (2026-10-02):** https://copero.net/pt. Ainda não acessada: a rede do ambiente de desenvolvimento bloqueia `copero.net` (e `copero.io`). Quando houver acesso ou prints, registrar aqui o que ela tem de diferente do que está abaixo.

Serve de referência de mecânica e de organização de tela. **Nada do Copero é copiado:** nem texto, nem imagem, nem tela. O Copero usa escudos reais de clubes; o 10eFaixa não pode (SPEC 11).

## 1. Como a carreira anda

Cada temporada tem o mesmo ritmo, em três passos:

1. **Um acontecimento** ("Sua história"), com foto, título, duas ou três linhas de texto e uma ou duas opções.
2. **O fechamento da temporada**, com dois caminhos: seguir para a próxima ou ver as propostas.
3. **O mercado**: três cartões de clube lado a lado, um deles sempre "continuar onde está".

São de duas a três decisões por temporada. A carreira inteira levou cerca de 45 cliques.

## 2. A tela de jogo (computador)

Três colunas fixas, e só a do meio muda:

| Coluna | Conteúdo |
|---|---|
| Esquerda: o jogador | Cartão de OVR, nome, bandeira, número, posição; clube atual; idade, valor de mercado, salário, duração do contrato; jogos, gols e assistências; contador de títulos e prêmios; botão "Atributos do jogador" |
| Meio: a decisão | Faixa "O que aconteceu após sua decisão" no alto, depois o acontecimento atual com as opções |
| Direita: a trajetória | Tabela com uma linha por idade (16 a 39): escudo do clube, OVR daquele ano, jogos e gols. As linhas futuras aparecem vazias |

No alto fica a pontuação parcial da carreira, que sobe a cada temporada.

## 3. As opções de decisão

É o ponto mais forte do jogo. Cada opção diz exatamente o que custa e o que rende:

- **Opção segura:** "Você ganha: confiança do treinador +10" e "Em troca: evolução dos atributos −0,5".
- **Opção de risco:** "Se der certo · 60%: …" e "Se der errado · 40%: …", com uma barrinha verde e vermelha mostrando a chance.
- **Opção de risco físico:** "Risco: 5% de risco extra de lesão".
- **Acontecimento sem escolha:** uma opção só, com o rótulo "Efeito" (lesão, pausa para a família).

As moedas do jogo são poucas e sempre as mesmas: confiança do treinador, evolução dos atributos no fim da temporada, participação nos jogos, risco de lesão.

## 4. O resultado da decisão

Depois de escolher, o resultado não abre em janela: vira uma faixa no alto da coluna do meio ("O que aconteceu após sua decisão"), com uma frase e duas etiquetas de número. A próxima decisão já aparece embaixo.

## 5. O mercado

Três cartões iguais, fáceis de comparar:

- Tipo do contrato e duração ("Assinar contrato · 3 anos", "Continuar · 2 anos", "Renovar contrato").
- Escudo, clube, país e liga.
- **Papel no elenco** em destaque ("Titular", "Na rotação do elenco").
- Minutos previstos, salário anual e **nível do clube** (por exemplo 59/100).

O jogo avisa que os minutos são estimativa.

## 6. Conquistas

Em dois momentos apareceu uma janela escura por cima da tela, com um troféu dourado sob holofotes: "Conquista desbloqueada", nome do jogador, nome da conquista ("Sem fronteiras", "Dar a volta por cima"), quando foi alcançada, e os botões de baixar a imagem e continuar. São 8 conquistas colecionáveis, guardadas no navegador, e três delas viram "desafios" para a próxima carreira (ficar 10 temporadas num clube; subir da segunda para a primeira divisão; três títulos num ano).

## 7. Aposentadoria e tela final

- A partir de uma certa idade aparece "Encerrar minha carreira aos 34", com confirmação em janela sobre a tela desfocada.
- A tela final tem, de cima para baixo: camisa com nome e número, pontuação final, posição no ranking (hoje, semana, mês), conquistas, números da carreira (jogos, gols, assistências, títulos, maior valor de mercado, ganhos), um cartão por clube com a cor do clube no topo, a sala de troféus com "×9" nos repetidos, prêmios individuais, números pela seleção e uma **linha do tempo** de cinco marcos ("16: primeiro contrato", "22: lesão grave", "26: primeiro título", "34: último capítulo").
- A carreira entra sozinha num ranking público ao terminar.

## 8. Criação do jogador

Uma tela só, em três blocos: identidade (a camisa muda ao vivo com o nome, o número e as cores do país), nacionalidade e posição (escolhida tocando num campo desenhado).

## 9. O que vale trazer para o 10eFaixa

| Ideia | Como entra no nosso jogo | Onde |
|---|---|---|
| "Você ganha / Em troca" em cada opção | Já temos a prévia em setas. Vale escrever o rótulo por extenso ("Você ganha", "Em troca") antes das setas | T51 |
| Chance de dar certo, com barrinha | Novo: opções de risco com porcentagem. Pede mudança no motor de eventos (hoje todo efeito é certo) | SPEC, T51 |
| Trajetória por idade | Uma linha por temporada com clube, OVR, jogos e gols. No celular vira uma tela à parte ou uma gaveta | T51 |
| Ritmo fixo da temporada | Acontecimento, fechamento, mercado. Encaixa com os nossos semestres e a reunião com a comissão | T51, T53 |
| Cartões de proposta comparáveis | Papel no elenco, minutos previstos, salário, duração e nível do clube lado a lado. O motor já calcula tudo isso | T51 |
| Janela de conquista | Para rótulos e títulos: troféu, nome da conquista e botão de compartilhar | T55 |
| Linha do tempo da carreira | Cinco a oito marcos na tela final, antes do cartão | T55 |
| Sala de troféus com "×N" | Já adotado na ficha do jogador | feito |
| Desafios para a próxima carreira | Dá motivo para jogar de novo; combina com o nosso desafio diário | T57 |
| Camisa ao vivo na criação | A camisa do clube de coração com nome e número | T50 |

## 10. O que não trazer

- **Escudos reais** de clubes e uniformes de seleção: proibido pelo nosso SPEC.
- **Ranking público com nome:** fora da v1 (sem contas nem ranking online).
- **Overall como único número:** o nosso jogo tem os dez atributos e a negociação com a comissão, que é o diferencial.
- **Visual escuro verde-limão:** já escolhemos o papel creme com verde.

## 11. Onde o 10eFaixa já é mais rico

- Origem do jogador (várzea, peneira, base), temperamento e mentalidade.
- Cena pintada com o jogador de costas, na camisa e no número dele.
- Seleção com camisa 10 e faixa de capitão, veredito e rótulos de legado.
- Zoeira e apelido no fim da carreira.
