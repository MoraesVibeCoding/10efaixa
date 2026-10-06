# Revisão dos eventos de carreira — para aprovação

Levantamento de **todos os 25 eventos** que existem hoje (`src/data/events.json` + textos em `src/i18n/pt-BR/events.json`), com a pergunta, as opções e as consequências **reais** no motor. Nada aqui foi alterado ainda: é o retrato do que está no jogo, mais os problemas que encontrei.

**Como ler as consequências** (escala que o jogador vê no resultado da escolha):
- **Moral**, **Relação com o técnico**, **Disciplina**: 0 a 100 pontos (no dado é 0–1; "+0,05" = +5 pontos).
- **Torcida** (idolatria no clube atual) e **Torcida do coração**: −100 a +100.
- **Patrimônio**: em % do que o jogador tem.
- **Jeito**: o temperamento que a opção representa; é a escolha automática quando o jogador não decide (simulação).

**Legenda dos problemas:** 🔴 quebra a decisão · 🟡 fraca ou confusa · ⚪ falta texto

---

## Resumo do diagnóstico

1. **⚪ Só 2 dos 25 eventos têm texto de história** (`salario-atrasado` e `proposta-coracao`). Os outros 23 só têm título e botões: o jogador decide sem contexto.
2. **🟡 4 eventos não são decisões, são avisos com um botão só** (`estirao-grande`, `traco-desbloqueado`, `troca-tecnico`, `amadurecimento`). A regra v2.17 diz "toda decisão tem 3 opções". Proposta: tratá-los como **acontecimento** (cartão de notícia, sem escolha) — que já é um dos ritmos previstos para a T51.
3. **🟡 Opções quase iguais** em vários eventos (diferença de 2–3 pontos de moral): a escolha não pesa.
4. **🔴 Consequências invisíveis**: em `copa-penalti`, `investir` e `lesao-grave`, o que realmente muda (chance de gol, ganho/perda em R$, tempo fora e risco de recaída) está em outra tabela e **não aparece** em "Você ganha / Em troca".
5. **🟡 Eventos que faltam** para a carreira "da várzea à aposentadoria": peneira, primeiro contrato profissional, estreia, banco/reserva, convocação, ir para o exterior, aposentadoria. (A cena 18 já é a peneira, mas não existe evento dela.)

---

## Fase: formação (até 18 anos)

### 1. `estirao-grande` — "Esticou de vez!"
- **Quando:** sorteou estirão grande e tem até 18 anos. Peso 10. Cena: casa da família.
- **Texto:** ⚪ nenhum.
- **Opções:** "Bora pro treino" → Moral +5.
- **Problema:** 🟡 aviso, não decisão.

### 2. `traco-desbloqueado` — "Treino que vira talento"
- **Quando:** desbloqueou um traço. Peso 10. Cena: treino.
- **Texto:** ⚪ nenhum (nem diz qual traço).
- **Opções:** "Comemorar a evolução" → Moral +5.
- **Problema:** 🟡 aviso, não decisão.

## Fase: clube e vestiário

### 3. `troca-tecnico` — "Técnico novo no CT"
- **Quando:** o clube trocou de técnico. Peso 5. Cena: reunião da comissão.
- **Texto:** ⚪ nenhum.
- **Opções:** "Se apresentar ao novo técnico" → Relação com o técnico volta a 50.
- **Problema:** 🟡 aviso. Daria uma boa decisão (chegar cedo e mostrar serviço / esperar a chance / ir pela panela do elenco).

### 4. `mudanca-posicao` — "O técnico quer você em outra posição"
- **Quando:** há proposta de mudança de posição. Peso 6. Cena: reunião da comissão.
- **Texto:** ⚪ nenhum (não diz **qual** posição).
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Aceitar a nova posição | líder | muda de posição |
  | Recusar e seguir onde está | esquentado | Relação técnico −5 |
  | Aceitar, mas pedir garantia de sequência | frio | muda de posição; Relação técnico −3 |
- **Problema:** 🟡 a "garantia" só custa e não dá nada a mais.

### 5. `amadurecimento` — "Mudou de postura"
- **Quando:** o temperamento amadureceu. Peso 10. Cena: vestiário.
- **Texto:** ⚪ nenhum (não diz de qual jeito para qual).
- **Opções:** "Seguir em frente, mais maduro" → Moral +5, Disciplina +10.
- **Problema:** 🟡 aviso, não decisão.

### 6. `festa` — "Convite para a festa"
- **Quando:** convite de festa. Peso 5. Cena: festa.
- **Texto:** ⚪ nenhum.
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Ir pra resenha | resenha | Moral +8, Disciplina −10 |
  | Ficar em casa e descansar | frio | Moral −2, Disciplina +3 |
  | Dar uma passada, só para marcar presença | líder | Moral +3, Disciplina −3 |
- **Problema:** nenhum grave. Falta o risco (foto vazada, véspera de jogo).

### 7. `polemica-redes` — "Polêmica nas redes"
- **Quando:** sorteou polêmica. Peso 5. Cena: entrevista.
- **Texto:** ⚪ nenhum (não diz **qual** polêmica).
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Postar a resposta | esquentado | Disciplina −10, Torcida +3, Relação técnico −5 |
  | Deixar pra lá | frio | Disciplina +2 |
  | Responder na zoeira e virar a página | resenha | Torcida +3, Disciplina −3 |
- **Problema:** 🟡 "zoeira" domina "postar" (mesmo ganho, menor custo). Lembrar a regra: zoeira só com o próprio jogador.

## Fase: dinheiro e empresário

### 8. `salario-atrasado` — "Salário atrasado de novo"
- **Quando:** clube atrasou salário. Peso 6. Cena: sala do empresário.
- **Texto:** "Dois meses sem ver a cor do dinheiro. O elenco está dividido e a diretoria pede paciência."
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Pedir para sair | frio | pede saída (vai ao mercado); Relação técnico −10 |
  | Ficar e esperar | líder | Moral −10, Torcida +5 |
  | Cobrar a diretoria na frente do elenco | esquentado | Relação técnico −5, Torcida +3, Disciplina −2 |
- **Problema:** 🟡 a cena (sala do empresário) não combina com cobrar a diretoria.

### 9. `empresario-forca-venda` — "Empresário fechou venda sem avisar"
- **Quando:** sorteio de evento do empresário. Peso 7. Cena: sala do empresário.
- **Texto:** ⚪ nenhum (não diz para onde).
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Aceitar a transferência | frio | transfere |
  | Bater o pé e ficar | líder | Moral −5, Relação técnico +5 |
  | Trocar de empresário | esquentado | troca de empresário |

### 10. `empresario-some-dinheiro` — "Sumiu dinheiro da conta"
- **Quando:** sorteio de evento do empresário. Peso 7. Cena: sala do empresário.
- **Texto:** ⚪ nenhum (não diz quanto sumiu, e o patrimônio não cai).
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Trocar de empresário | frio | troca; Moral −5 |
  | Dar outra chance | resenha | Moral −10 |
  | Cobrar cara a cara e exigir o dinheiro de volta | esquentado | Moral −3, Disciplina −2 |
- **Problema:** 🔴 o dinheiro some na história mas **não** no patrimônio; "dar outra chance" não tem risco de repetir.

### 11. `empresario-briga-clube` — "Empresário brigou com a diretoria"
- **Quando:** sorteio de evento do empresário. Peso 6. Cena: reunião da comissão.
- **Texto:** ⚪ nenhum.
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Ficar do lado do empresário | esquentado | Relação técnico −10 |
  | Ficar do lado do clube | líder | Relação técnico +5, Moral −3 |
  | Não se meter | frio | Moral −2 |
- **Problema:** 🟡 a briga é com a **diretoria**, mas quem reage é o **técnico**.

### 12. `renovacao` — "Hora de renovar o contrato"
- **Quando:** falta 1 ano ou menos de contrato. Peso 8. Cena: assinatura.
- **Texto:** ⚪ nenhum (não mostra a proposta de salário nem a duração).
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Renovar | líder | renova com o aumento padrão |
  | Renovar pedindo aumento | esquentado | renova com +10% extra; Relação técnico −3 |
  | Não renovar | frio | sai livre no fim; Moral −2 |
- **Problema:** 🟡 pedir aumento quase sempre compensa (sem risco do clube recusar).

### 13. `casa-da-familia` — "A casa da família"
- **Quando:** patrimônio ≥ R$ 2 mi e ainda não comprou. Peso 9. Cena: casa da família.
- **Texto:** ⚪ nenhum.
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Comprar a casa da família | líder | Patrimônio −15%, Moral +10 |
  | Comprar e fazer a festa de inauguração | resenha | Patrimônio −18%, Moral +10, Disciplina −2 |
  | Comprar financiado e deixar o dinheiro rendendo | frio | Patrimônio −7%, Moral +7 |
- **Problema:** 🟡 as três opções compram a casa; não existe "ainda não".

### 14. `investir` — "Proposta de investimento"
- **Quando:** patrimônio ≥ R$ 5 mi, 10% de chance. Peso 4. Cena: sala do empresário.
- **Texto:** ⚪ nenhum (não diz em quê).
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Investir | esquentado | aplica 20% do patrimônio: no fim do ano volta entre −60% e +100% disso |
  | Guardar o dinheiro | frio | nada |
  | Ouvir quem entende antes de decidir | líder | Moral +2 (e não investe) |
- **Problema:** 🔴 o risco não aparece na tela; "ouvir quem entende" não leva a uma segunda escolha.

## Fase: clube do coração e rivais

### 15. `proposta-rival` — "O rival bateu na porta"
- **Quando:** proposta do rival do clube atual. Peso 8. Cena: sala do empresário.
- **Texto:** ⚪ nenhum.
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Aceitar e ir para o rival | esquentado | transfere; Torcida do clube antigo −60 |
  | Recusar e ficar | líder | Torcida +5, Moral −5 |
  | Usar a proposta como trunfo e pedir valorização | frio | Relação técnico −3, Moral +2 |
- **Problema:** 🟡 o "trunfo" não traz aumento de salário.

### 16. `proposta-coracao` — "O clube do coração chamou"
- **Quando:** proposta do clube do coração. Peso 9. Cena: assinatura.
- **Texto:** "O clube que você via da arquibancada ligou. O salário é menor que o das outras propostas, mas a camisa é aquela. Seu empresário torce o nariz; sua mãe já chorou."
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Aceitar a proposta | líder | transfere |
  | Jogar por amor (salário menor) | resenha | transfere; Salário ×0,7; Torcida do coração +10 |
  | Recusar | frio | Moral −5 |
- **Problema:** 🔴 o texto diz que o salário **já** é menor, mas "Aceitar" mantém o salário e "Jogar por amor" corta 30%. As duas primeiras se confundem (é o "Sem efeito imediato" que você viu no print).

### 17. `traicao-coracao` — "Proposta do rival do seu clube do coração"
- **Quando:** proposta do rival do clube do coração. Peso 8. Cena: sala do empresário.
- **Texto:** ⚪ nenhum.
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Aceitar mesmo assim | frio | transfere; Torcida do coração −40 |
  | Recusar | líder | Moral −5 |
  | Recusar e avisar em público que essa camisa não veste | esquentado | Torcida do coração +10, Disciplina −2 |
- **Problema:** 🟡 "recusar em público" é melhor que "recusar" em tudo.

### 18. `jogo-contra-coracao` — "Gol contra o clube do coração"
- **Quando:** marcou contra o clube do coração. Peso 7. Cena: gol.
- **Texto:** ⚪ nenhum.
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Comemorar | esquentado | Torcida do coração −15, Torcida +5 |
  | Não comemorar, por respeito | líder | Torcida do coração +5, Torcida −3 |
  | Comemorar discreto, com os companheiros | frio | Torcida do coração −5, Torcida +2 |
- **Problema:** nenhum grave. Bom dilema.

## Fase: lesão

### 19. `lesao-grave` — "Lesão grave"
- **Quando:** sofreu lesão grave. Peso 10. Cena: hospital.
- **Texto:** ⚪ nenhum (não diz qual lesão).
- | Opção | Jeito | Consequência real |
  |---|---|---|
  | Operar e voltar com calma | frio | 2 semestres fora; 5% de recaída; −1 em velocidade/físico; Moral −10 |
  | Tratamento conservador | resenha | 1 semestre fora; 20% de recaída; −2; Moral −5 |
  | Voltar antes da hora, no sacrifício | líder | meio semestre fora; 45% de recaída; −3; Torcida +5 |
- **Problema:** 🔴 tempo fora e risco de recaída **não aparecem** na tela, e são o coração da decisão.

## Fase: Seleção

### 20. `dupla-nacionalidade` — "Outra seleção quer você"
- **Quando:** convite de outra seleção. Peso 10. Cena: convocação.
- **Texto:** ⚪ nenhum (não diz qual país nem por quê).
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Aceitar (decisão definitiva) | frio | troca de seleção para sempre; Moral +5 |
  | Esperar a Seleção Brasileira | líder | Moral +2 |
  | Pedir um tempo para pensar | resenha | Moral −2 (na prática recusa) |
- **Problema:** 🔴 é o evento mais importante para o objetivo do jogo (a camisa 10 da Seleção) e não tem texto. "Pedir um tempo" não volta depois.

### 21. `copa-sacrificio` — "No sacrifício pela Seleção"
- **Quando:** torneio de seleção, 50% de chance. Peso 10. Cena: copa.
- **Texto:** ⚪ nenhum.
- | Opção | Jeito | Consequência real |
  |---|---|---|
  | Jogar mesmo sentindo dor | líder | Moral +5; time +2 de força; 25% de risco de lesão |
  | Ficar fora e se recuperar | frio | Moral −5; sem efeito no time |
  | Entrar só no segundo tempo | resenha | Moral +2; time +1; 12% de risco |
- **Problema:** 🔴 o risco de lesão não aparece.

### 22. `copa-fora-posicao` — "O treinador pede você fora de posição"
- **Quando:** torneio de seleção, 50% de chance. Peso 10. Cena: copa.
- **Texto:** ⚪ nenhum.
- | Opção | Jeito | Consequência real |
  |---|---|---|
  | Jogar onde o time precisa | líder | Moral +2; time +1 |
  | Dizer que só rende na sua posição | esquentado | Moral −5; fica fora até o fim do torneio |
  | Aceitar agora e pedir a posição no próximo jogo | frio | Moral +1; time +1 |
- **Problema:** 🔴 "recusar" tira o jogador do torneio e a tela não avisa.

### 23. `copa-penalti` — "O pênalti decisivo"
- **Quando:** decisão por pênaltis num torneio. Peso 10. Cena: pênalti.
- **Texto:** ⚪ nenhum.
- | Opção | Jeito | Consequência real |
  |---|---|---|
  | Pegar a bola e bater | líder | bate: acerto de 50% a 92% (base 70%, sobe com Mental) |
  | Deixar para um companheiro | resenha | Moral −2 |
  | Tomar a bola e encher o pé | esquentado | bate (mesma chance de "bater") |
- **Problema:** 🔴 "bater" e "encher o pé" são idênticas; a tela mostra "Sem efeito imediato" na hora mais dramática do jogo.

## Fase: fim de carreira

### 24. `retorno-formador` — "O clube que te revelou quer você de volta"
- **Quando:** proposta do clube formador no fim da carreira. Peso 9. Cena: despedida.
- **Texto:** ⚪ nenhum.
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Voltar para casa e encerrar a carreira lá | líder | despedida; Moral +10; Torcida +15 |
  | Agradecer e seguir onde está | frio | Moral −3 |
  | Dizer que ainda tem lenha: mais um ano | esquentado | Moral +2 |
- **Problema:** 🟡 "mais um ano" não marca a volta para o ano seguinte.

### 25. `realizar-sonho` — "O clube do coração quer a sua despedida"
- **Quando:** proposta de despedida no clube do coração. Peso 9. Cena: despedida.
- **Texto:** ⚪ nenhum.
- | Opção | Jeito | Consequência |
  |---|---|---|
  | Realizar o sonho | resenha | despedida; Moral +10; Torcida +15 |
  | Agradecer e seguir onde está | frio | Moral −3 |
  | Aceitar e pedir a faixa de capitão | líder | igual a "realizar" + Relação técnico −3 |
- **Problema:** 🟡 a faixa de capitão só custa; não aparece na despedida.

---

## Decisões que preciso de você

1. **Avisos (4 eventos):** viram cartão de notícia sem escolha, ou ganham 3 opções de verdade?
2. **Consequências escondidas** (lesão, pênalti, investimento, copa): mostrar na opção o tempo fora, a chance e o risco em palavras ("risco alto de recaída"), ou em número?
3. **Eventos novos** (peneira, primeiro contrato, estreia, banco, convocação, exterior, aposentadoria): entram agora ou depois da T51?
4. **Texto:** todos os 25 ganham um parágrafo de história de 2–3 frases no tom do `proposta-coracao`?
