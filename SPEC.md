# 10eFaixa — Especificação do Produto (SPEC.md)

> Versão 2.53 (reunião com a comissão em 3 ideias, T52b–d; v2.52: histórias e decisões: aprovação no fim, não por lote; T28e propostas completas, T25c/d/e e T25b em sequência; v2.51: linha do tempo por idade antes do cartão, T55f–i: "Sua carreira" no lugar de "Sua história", exceção do Over em número estendida a essa tela; v2.50: tela de propostas de clube, T28b–f: sempre que houver oferta na janela, só aceitar e ficar na v1; v2.49: desafio do dia e link da carreira, T57: semente do dia no fuso de Brasília, link no fragmento da URL sem nome nem apelido, rever carreira só leitura; v2.48: estilos revistos: 3 por posição, Ousado, Ponta artilheiro, Ponta trabalhador, Enganche, Zagueiro de cobertura e Goleiro seguro, estilos equilibrados por simulação; v2.47: fluidez: números que rolam, transições de 300 ms, carimbos de título, acesso e rebaixamento com celebração curta no título, aviso legal sobre nomes de clubes; v2.46: posição Ponta, lado do lateral e da ponta, campo com 9 camisas, escolhas sem deslizar e o visual "moderno e fluido" mesclado à referência do usuário; v2.45: cenas pintadas na decisão, no corte de cabelo do visual e no uniforme do clube; v2.44: link de teste protegido na Vercel antes da T61; v2.43: compartilhar: imagem da versão na tela, texto com nome e apelido, link da carreira adiado para a T57; v2.42: cartão final: honrarias, código curto + link, "Sua história" pelo resultado, camisa do clube do auge; v2.41: evolução do semestre e idolatria em palavras na tela; v2.40: reunião com a comissão por ritmo, com sugestão do preparador; v2.39: save a cada decisão, pergunta antes de apagar, momento-chave por peso no Rápido; v2.38: prévia curta no ritmo Rápido; Barcelona-BA; vidro só em três lugares; v2.37: figurinha sempre com o uniforme do clube, padrão tradicional; v2.36: visual da criação: 10 personagens prontos, "Visual 1" a "Visual 10"; v2.35: criação em quatro telas: o visual ganha tela própria; v2.34: visual "Álbum com vidro": figurinha com moldura por faixa, vidro só em sobreposições, decisão com cena inteira; v2.33: valor de mercado em € nos selos da decisão; v2.32: competições com nomes não oficiais; v2.31: motor de histórias: memória da carreira, eventos modulares, idolatria em faixas, retorno da evolução, "Sua história", último jogo, sonho da carreira; 2ª divisão nas 6 ligas europeias; v2.30: criação em duas telas + tipo de início; v2.29: marcos da carreira: primeiras vezes na carreira, em cada clube e na Seleção; v2.28: papel em campo, minutos e nível do clube na proposta, momento e "isso vai pesar", decisões por ritmo e catálogo ampliado) · Status: **aprovado para implementação**. Todas as decisões de produto e design estão fechadas.
> Este documento é a fonte da verdade para o Claude Code. Nenhuma mudança de escopo sem atualizar este arquivo primeiro.

---

## 1. Visão

**10eFaixa** é um simulador de carreira de jogador de futebol, focado no futebol brasileiro, jogado no navegador (mobile-first). O jogador cria um atleta (aparência, biotipo e temperamento), escolhe estado natal, origem (várzea, peneira ou base de clube) e estilo, e vive a carreira dos 16 anos até a aposentadoria, tomando decisões que mudam a evolução física e técnica, os clubes, o dinheiro, a Seleção e o legado.

O objetivo máximo simbólico dá nome ao jogo: **vestir a camisa 10 e usar a faixa de capitão da Seleção Brasileira**.

**Referência de gênero:** simuladores de carreira em navegador como o Copero (carreira em minutos, decisões por capítulo, cartão final compartilhável). O 10eFaixa se diferencia por: (a) foco no futebol brasileiro, com mais detalhe no Brasil do que na Europa; (b) evolução de atributos acompanhada e negociada com a comissão técnica; (c) identidade brasileira (várzea, peneira, Copinha, estaduais, bicho, salário atrasado, clássicos).

## 2. Problema e público

- **Problema:** simuladores de carreira populares são centrados no futebol europeu e tratam o Brasil como detalhe. Falta um jogo rápido, compartilhável e na língua do torcedor brasileiro.
- **Público:** torcedores brasileiros de 14 a 40 anos, que jogam no celular e compartilham no WhatsApp e nas redes.

## 3. Objetivos

1. Carreira completa jogável no celular, sem cadastro, em três ritmos (Rápido ~5 min, Normal ~15 min, Completo livre).
2. Cartão final compartilhável que gere curiosidade e novas partidas.
3. Validar diversão e retenção antes de qualquer monetização.
4. Motor separado da interface, pronto para virar app depois.

## 4. Não-objetivos (v1)

- **Anúncios e monetização:** só na Fase 2. Na v1, apenas apoio voluntário pelo Apoia.se.
- **Modo técnico/dirigente:** v1 é só carreira de jogador.
- **Contas, login, multiplayer e ranking online:** fora; save local no navegador.
- **App nativo:** fora; v1 é site (PWA).
- **Partidas lance a lance:** fora; simulação por semestre com momentos de decisão.
- **Divisões inferiores da Europa:** só a 1ª e a 2ª divisão das 6 ligas (v2.31); 3ª divisão em diante, fora.
- **Futebol feminino:** fora da v1, registrado como futuro (motor preparado, ver 5).
- **Outros idiomas:** fora; v1 só em português do Brasil, com textos preparados para tradução.

## 5. Stack e princípios técnicos

- **Stack (T01 concluída):** Vite 8, React 19, TypeScript 7 em modo estrito, Vitest 5 + Testing Library + jsdom, GitHub Actions (typecheck, testes, build). Confirmar versões na documentação oficial antes de atualizar.
- **Hospedagem:** Vercel, domínio **10efaixa.com** (registrador a definir).
- **Repositório fechado** na Fase 1.
- **Motor puro:** toda regra em `src/engine`, TypeScript puro, sem React e sem DOM. Funções puras e determinísticas.
- **Aleatoriedade com semente:** PRNG próprio. Mesma semente + mesmas decisões = mesma carreira. Habilita testes, o código da carreira e o desafio diário.
- **Dados, não código:** clubes, competições, arquétipos, curvas de evolução, eventos e textos em JSON validado por schema. Isso também prepara o motor para o futebol feminino e outros idiomas.
- **Textos (i18n):** nenhum texto de interface ou narrativa escrito direto no código; tudo em arquivos de texto `pt-BR`.
- **Estrutura:**
  ```
  src/
    engine/     regras puras (jogador, evolução, calendário, temporada, eventos, veredito)
    data/       JSON de clubes, ligas, arquétipos, eventos, calendário + schemas
    i18n/       textos pt-BR
    state/      máquina de estados da carreira, save/load
    ui/         telas React
    share/      cartão e compartilhamento
  ```

---

## 6. Design do jogo

### 6.1 Criação do jogador

Ordem: nome → número da camisa → estado natal → clube de coração (opcional) → posição → arquétipo → aparência → biotipo (altura e compleição) → temperamento → comemoração → origem → perna boa → (sorteio) nível inicial, potencial oculto, possível dupla nacionalidade → (na base) apelido dado pelo jogo.

Detalhes de aparência, biotipo, temperamento, apelido e cenas na seção 6.17.

**Telas da criação (v2.30; v2.35, decisão do usuário):** os campos acima ficam em **quatro telas, sem rolar no celular a partir de 390×844**: "quem é ele" (identidade), "seu visual" (avatar-herói, miniaturas e cores; v2.35), "em campo e cabeça" e tipo de início; no computador (≥ 64rem) "quem é ele" e "seu visual" viram uma página só, lado a lado.
1. **Quem é ele** (nada aqui mexe nos atributos): figurinha ao vivo; nome; número; estado natal; clube de coração; comemoração.
2. **Seu visual** (v2.35; v2.36; nada aqui mexe nos atributos): o jogador escolhe entre **10 personagens prontos**, deslizando de lado (setas e fileira de miniaturas), chamados só **"Visual 1" a "Visual 10"**; o visual inicial vem **sorteado** (PRNG com semente) e pode ser trocado. Sem ajuste peça por peça: saem tom de pele, cor do cabelo, barba, faixa e chuteira (fixa por visual) e o botão "Sortear".
3. **Em campo e cabeça** (tudo que pesa no jogo): posição (campinho), estilo (arquétipos da posição), perna boa, altura (só a faixa da posição), compleição, temperamento e mentalidade.
4. **Tipo de início:** origem (base, peneira ou várzea) e **sonho da carreira** (v2.31): Seleção, virar ídolo, jogar na Europa ou um clube só. O sonho muda o peso de alguns eventos e o veredito final diz se ele se realizou; não mexe em atributos. Depois vêm o sorteio e o primeiro clube; ao assinar, a figurinha ganha o uniforme e o emblema do clube (apresentação).

- **Nome:** passa por **filtro de palavras bloqueadas** (palavrões, ofensas e nomes de pessoas reais conhecidas). Nome recusado mostra mensagem clara pedindo outro.
- **Estado natal:** qualquer um dos 27 estados.
- **Clube de coração (opcional):** qualquer clube brasileiro das Séries A–D, ou "Nenhum". Clubes do estado natal aparecem primeiro. Efeitos na seção 6.18.
- **Posições:** Goleiro, Zagueiro, Lateral, Volante, Meia, Atacante.
- **Perna boa:** direita ou esquerda. A perna ruim pode evoluir pelo treino até o traço "Ambidestro".

**Origem (nível inicial e teto):**

| Origem | Overall inicial | Perfil (nasce melhor em) | Crescimento | Como começa |
|---|---|---|---|---|
| Base de clube grande | 45–55 | Físico e fundamentos (Passe, Finalização, Jogo aéreo) | Equilibrado | Três ofertas de clubes do estado ou da região, com prós e contras (minutos, estrutura, concorrência) |
| Peneira | 38–50 | Mental e físico | Equilibrado | Peneiras em clubes do estado: passa de primeira, tenta de novo ou vai para um clube menor. Alta variância |
| Várzea | 30–42 | Mental e técnica (Habilidade, Drible) | Mais forte em fundamentos e físico, para alcançar as outras origens | Time fictício do bairro até um olheiro levar para um clube pequeno ou médio. **3% de "diamante bruto"** (bônus de teto) |

- **Potencial (teto) igual para todas as origens:** a origem muda o *perfil* dos atributos, não a chance de chegar ao topo. Meta do auge da carreira (decisões automáticas, seção 9.3): **5% com 95+, 10% com 90–94, 60% com 85–89, 25% com 80–84**. O diamante bruto da várzea ganha bônus de teto por cima disso.

- Estado com poucos clubes: as ofertas vêm dos estados vizinhos.
- **Potencial oculto:** o jogador vê a estimativa do olheiro, que fica mais precisa a cada temporada.
- **Dupla nacionalidade:** ~5%, sorteada na criação ou descoberta no meio da carreira (Itália e Portugal; Espanha e Alemanha como raridade).
- Valores aprovados como ponto de partida; ajuste fino pelos testes de simulação (9.3).

### 6.2 Arquétipos (21: 3 por posição, v2.48)

O arquétipo define a **distribuição dos pontos** entre os atributos e **1 traço especial**. O nome é próprio; a descrição cita a lenda que inspira o estilo (regras na seção 11). **v2.48:** cada posição tem exatamente 3 estilos, cada estilo pertence a uma só posição, e os números ficam calibrados para que, na mesma posição, nenhum estilo tenha menos da metade da chance de "Lenda" do melhor (simulação).

| Posição | Arquétipo | Estilo de | Destaques | Traço |
|---|---|---|---|---|
| Atacante | Matador de área | Romário | Finalização, Mental | Faro de gol |
| Atacante | Arrancador | Ronaldo | Velocidade, Drible, Finalização | Arrancada |
| Atacante | Centroavante de força | Adriano | Força, Finalização (chute potente), jogo aéreo; pouca Velocidade | Bomba |
| Ponta | Ousado | Neymar | Drible, Habilidade, Velocidade | Firula |
| Ponta | Ponta artilheiro | Rivellino | Finalização, Habilidade, Drible | Chute de fora |
| Ponta | Ponta trabalhador | Jairzinho | Velocidade, Físico, Finalização; volta para marcar | Vai e volta |
| Meia | Maestro | Zico | Passe, Habilidade, Finalização | Camisa 10 (bola parada) |
| Meia | Enganche | Kaká | Condução: Velocidade, Passe, Finalização | Condução |
| Meia | Mágico | Ronaldinho | Habilidade, Drible, Passe | Ambidestro ou Bola parada |
| Volante | Volante raiz | Dunga | Marcação, Força, Físico | Carrinho preciso |
| Volante | Regente | Falcão | Passe longo, Mental, Marcação | Dono do meio |
| Volante | Motorzinho | Bruno Guimarães | Agilidade, Passe rápido, Físico | Pulmão |
| Lateral | Lateral apoiador | Cafu | Velocidade, Físico, Passe | Ala ofensivo |
| Lateral | Lateral foguete | Roberto Carlos | Velocidade, chute forte, bola parada | Canhão |
| Lateral | Lateral construtor | Júnior | Passe, Mental, Marcação; joga por dentro | Lateral por dentro |
| Zagueiro | Xerifão | Lúcio | Força, Marcação, jogo aéreo | Líder de zaga |
| Zagueiro | Zagueiro técnico | Thiago Silva | Passe, Mental, Marcação | Saída de bola |
| Zagueiro | Zagueiro de cobertura | Aldair | Marcação, Velocidade, Mental | Leitura de jogo |
| Goleiro | Paredão | Marcos | Reflexo, posicionamento | Milagre |
| Goleiro | Goleiro-líbero | Rogério Ceni | Jogo com os pés, saída do gol | Saída rápida + cobrador latente |
| Goleiro | Goleiro seguro | Dida | Posicionamento, jogo aéreo, Mental | Posicionamento |

**Papel em campo (v2.28):** o arquétipo é **como o jogador nasceu** (distribuição e traço, fixos); o **papel em campo** é **como o técnico o usa**. Começa igual ao arquétipo e pode virar outro arquétipo **da mesma posição** (ex.: Maestro usado como Enganche) por troca de técnico, pela reunião com a comissão (6.5) ou por evento próprio ("O novo técnico quer você mais recuado"). Fora do papel de origem: **menos minutos no início** e **bônus de evolução nos destaques do novo papel**, que somem com a adaptação (semestres no papel). Aparece como selo na figurinha ("Maestro · jogando de Enganche"). Na mudança de posição (6.6) o papel recomeça na posição nova. Números em dados, calibrados na 9.3. Não altera atributos diretamente nem o traço.

**Bola parada para goleiro:** o Goleiro-líbero nasce com o traço latente "Cobrador". Com "Bola parada" como foco de treino, evolui ao longo das temporadas; desbloqueado, vira cobrador de faltas e pênaltis e os gols contam na carreira. Outros goleiros podem tentar, com evolução bem mais lenta. Conquista: "Goleiro artilheiro".

### 6.3 Atributos

Dez atributos, escala interna 1–99:
- **Técnicos:** Finalização, Passe, Habilidade, Drible.
- **Físicos:** Força, Velocidade, Físico.
- **Defesa e cabeça:** Marcação, Mental.
- **Jogo aéreo:** cabeceio, impulsão e disputa pelo alto. O **teto depende da altura** (6.17).

**Goleiros traduzem atributos:** Habilidade = mãos e encaixe; Velocidade = reflexo e agilidade; Passe = jogo com os pés; Jogo aéreo = saída do gol em cruzamentos e bolas altas; Força, Físico e Mental iguais. Finalização só importa com o traço de cobrador.

**Overall:** média ponderada por posição (pesos em dados, calibráveis). Jogo aéreo pesa muito para zagueiro, centroavante e goleiro.

**Exibição:** durante a carreira, só **estrelas e faixas**; números aparecem só no cartão final.

| Faixa interna | Rótulo | Estrelas |
|---|---|---|
| 1–49 | Fraco | ★ |
| 50–64 | Regular | ★★ |
| 65–74 | Bom | ★★★ |
| 75–84 | Muito bom | ★★★★ |
| 85–94 | Excelente | ★★★★½ |
| 95–99 | Lendário | ★★★★★ |

### 6.4 Evolução

Aplicada **a cada semestre**, com metade do ganho anual por vez (constantes em configuração):

```
Δ = base
    × curvaIdade(atributo, idade)
    × multiplicadorFoco(atributo)
    × qualidadeComissão(clube)
    × fatorMinutos
    × fatorMoral
    × (1 − (atual / teto)^k)      // retorno decrescente perto do teto
    + ruído(semente)
```

**Curvas de idade (forma):**
- Velocidade e Físico: crescem até ~23, platô 23–30, queda a partir de ~31, queda forte após ~35.
- Força: cresce até ~27, queda lenta após ~33.
- Técnicos: crescem até ~30, queda lenta.
- Marcação: cresce até ~31.
- Mental: cresce até ~33, quase não cai.
- Jogo aéreo: cresce até ~28; a impulsão cai após ~32, com o posicionamento segurando parte da queda.

**Invariantes (viram testes):** nenhum atributo passa do teto nem sai de 1–99; sem minutos e sem foco, jogador de 30+ não evolui fisicamente.

**Retorno da evolução (v2.31; v2.41: na primeira decisão depois do semestre, uma linha "Neste semestre: …" no alto da faixa de baixo):** no fim de cada semestre, até duas frases sobre o que mais mudou, **sem número** ("Você está ficando mais rápido", "Seu passe melhorou bastante", "O físico começou a pesar"). Limiares e frases em dados.

### 6.5 Reunião com a comissão técnica (meio da temporada do clube)

- O jogador propõe **1 foco principal e 1 secundário** (10 atributos, "Bola parada" ou "Perna ruim").
- **Respostas:** aceita (principal com bônus alto, secundário com bônus menor), contrapropõe (o clube precisa de outra coisa) ou recusa (moral baixa ou relação ruim com o técnico).
- **Custos:** atributos sem foco em manutenção (leve queda com a idade); foco pesado em Físico aumenta risco de lesão.
- **Influências:** relação com o técnico, moral, status de Seleção.
- **Ritmo Rápido:** reunião sempre automática (v2.40: sem botão para abrir a tela; quem quer mexer no treino joga no Normal).
- **Na tela (v2.40):** Normal, 1 reunião por temporada (a do meio do ano, 2º semestre); Completo, as 2. As outras usam a proposta automática. Só com clube (na várzea não há comissão). A tela abre com a **sugestão do preparador** já marcada (a mesma proposta da reunião automática); o jogador confirma ou troca. A resposta da comissão (aceita, contrapropõe ou recusa) aparece em seguida.

### 6.6 Mudança de posição

- O **técnico pode propor** (meia recua para volante após os 30; ponta vira centroavante; lateral vira zagueiro).
- O **jogador pode pedir**; se o técnico discordar, caem moral e relação.
- Overall recalculado pelos pesos da nova posição; o arquétipo vira "estilo de origem" e mantém o traço.

### 6.7 Número da camisa

- O jogador escolhe um número na criação e o mantém ao trocar de clube se estiver livre; se não, recebe outro.
- **A 10 do clube** é evento, quando o jogador vira a referência do time (melhor do elenco e querido pela torcida). A **faixa de capitão do clube** funciona do mesmo jeito.
- Na **Seleção**, a 10 e a faixa são degraus próprios (6.11).
- No cartão final aparece o número mais usado na carreira.

---
### 6.8 Calendário

- **Anos reais**, a partir do ano do relógio do aparelho. Começando em 2026, a primeira Copa possível de um jogador de 16 anos é a de 2030.
- **Ano dividido em 2 semestres**, cada liga no seu calendário real:
  - **Brasil, 1º semestre:** estaduais, início do Brasileirão, Copa do Brasil, fase de grupos das copas continentais, Copa do Nordeste.
  - **Brasil, 2º semestre:** fim do Brasileirão e mata-matas.
  - **Europa:** temporada de agosto a maio; o 2º semestre é a primeira metade e o 1º semestre do ano seguinte é a segunda metade.
- **Janelas de transferência** do Brasil e da Europa em momentos diferentes; a janela do meio do ano é a ida natural do Brasil para a Europa.
- **Sedes:** Copas com sede já definida usam a real (2030: Espanha, Portugal e Marrocos; 2034: Arábia Saudita); as seguintes são sorteadas. Olimpíadas: 2028 Los Angeles, 2032 Brisbane; depois, sorteadas. Confirmar calendário da Copa América e demais datas na fonte oficial ao montar os dados.

### 6.9 Mundo: Brasil (foco, mais detalhado)

- **Divisões nacionais:** Séries A, B, C e D, com acesso e rebaixamento.
- **Estaduais completos** (fase inicial + mata-mata, com divisões de acesso): **SP, RJ, MG, RS, PR, SC, BA, PE, CE, GO**. Clubes de outros estados nas Séries A–D disputam um **estadual simplificado** (só o resultado final).
- **Copas:** Copa do Brasil, Copa do Nordeste, Libertadores e Sul-Americana (vagas conforme regras oficiais, conferidas na implementação).
- **Base:** categorias de base, **Copinha** e promoção ao profissional (primeiro contrato).
- **Clássicos e torcida:** rivalidades **manuais nas Séries A e B** e **automáticas por cidade nas Séries C e D**. Atuações em clássicos alteram idolatria; o jogador pode virar **ídolo ou vilão** de uma torcida.
- **Vida de clube:** troca de técnicos, **salário atrasado** (dá direito de pedir para sair), empréstimos.
- **Datas FIFA:** o Brasileirão não para; convocado desfalca o clube e pode gerar atrito.

**Dados de clubes:** nomes reais, **emblemas originais** (seção 11; v2.26). Reputação (1–100) é **dado próprio**, calibrado com referências públicas; bases como a do FM26 são só referência de ordem de grandeza e não devem ser copiadas. **Uso combinado (v2.31):** o FM26 pode servir de **pista** para fatos públicos (nome, cidade, estádio, divisão, formato), sempre confirmados e citados na fonte oficial; e de **conferência** de ordem de grandeza de reputação, salário e valor. Nenhum arquivo, número ou dado de atleta do FM entra no repositório.

### 6.10 Mundo: Europa (simulação média)

- **2ª divisão (v2.31):** Championship, LaLiga 2, Serie B, 2. Bundesliga, Ligue 2 e Liga Portugal 2, com acesso e rebaixamento entre a 1ª e a 2ª (formato, número de clubes, vagas e playoffs conferidos no regulamento oficial, com fonte e data). Clubes da 2ª usam o escudo genérico nas cores do clube.

- **Ligas (1ª divisão):** Inglaterra (Premier League, 20), Espanha (LaLiga, 20), Itália (Serie A, 20), Alemanha (Bundesliga, 18), França (Ligue 1, 18), Portugal (Primeira Liga, 18). Conferir na fonte oficial ao montar os dados.
- **Competições:** liga + copa nacional + Champions League e Europa League.
- **Detalhe:** posição final, campanha nas copas e participação do jogador.
- **Rivalidades manuais** para os grandes clássicos das 6 ligas.
- Nomes reais, emblemas originais (seção 11).

### 6.11 Seleção Brasileira

**Degraus:** Sub-17 → Sub-20 → Olímpica (Sub-23) → Principal (lista → reserva → titular → camisa 10 → capitão).

**Nota de visibilidade:**
```
visibilidade = overall + forma + minutos
             + pesoLiga (5 grandes > Série A > Série B...)
             + reputação
             + preferênciasDoTreinador
```
- **Treinador fictício**, trocado entre ciclos, com preferências (Europa, Brasileirão ou forma recente).
- **Calendário:** Copa do Mundo a cada 4 anos; Copa América e Eliminatórias entre elas; Olimpíadas para a Sub-23.
- **Copa do Mundo:** grupos + mata-mata, com 1–2 momentos de decisão (jogar no sacrifício, bater o pênalti decisivo, jogar fora de posição).

**Efeito Seleção (cresce por degrau):**
- **Status:** reputação e selo no perfil ("Convocado", "Titular", "Camisa 10", "Capitão").
- **Elenco:** mais minutos no clube, reunião com a comissão mais favorável, peso de liderança.
- **Mercado:** multiplicador no valor, mais propostas, melhores salários.
- **Atributos:** bônus de Mental em jogos grandes; pequena evolução extra nas datas FIFA.
- **Contrapartidas:** desfalque do clube, desgaste e risco de lesão, queda de reputação se for cortado ou virar vilão.
- **Duração:** bônus de status **cai aos poucos** sem novas convocações; títulos com a Seleção são permanentes.

**Dupla nacionalidade:** convite só enquanto o Brasil ainda não convocou. Aceitar é **definitivo** (simplificação consciente da regra da FIFA). Conquistas: "Oriundo campeão", "Escolheu o Brasil e esperou".

### 6.12 Dinheiro, empresário, contratos e propostas

**Moeda:** contratos na moeda do clube (R$ no Brasil, € na Europa; libra convertida para €). **Patrimônio sempre em R$.** Câmbio **fixo: € 1 = R$ 6,00**, configurável. **Sem inflação.**

**Calibração:** **Transfermarkt como única referência, consultada manualmente** para montar **faixas de valor de mercado por liga e divisão** (sem cópia em massa e sem raspagem automática). **Salário anual estimado como porcentagem do valor de mercado**, diferente por liga, calibrado nos testes para ficar plausível. Citar a fonte e a data da consulta no arquivo de dados.

**Empresário (escolhido na base):**
| Perfil | Influência | Lealdade | Comissão |
|---|---|---|---|
| Pai ou tio | Baixa | Alta | Baixa |
| Agente local | Média | Média | Média |
| Grande agência | Alta | Variável | Alta |
- Eventos: força venda sem avisar, some com dinheiro, briga com o clube. Trocar tem custo e atrito.

**Contrato:** duração, salário, luvas, **bicho**, multa rescisória (maior para o exterior). Renovação é evento. Salário atrasado permite pedir para sair.

**Propostas e janelas:** cada proposta mostra clube, liga, salário, **papel prometido** (titular, rodízio, aposta) e qualidade da comissão. Opções: aceitar, recusar, mandar o empresário negociar (pode melhorar ou sumir), forçar saída (dinheiro, risco de virar vilão). Inclui a **tentação do dinheiro fácil** (ligas fora do eixo: muito salário, pouca visibilidade).

**Minutos e nível do clube na proposta (v2.28):** cada proposta mostra, **em faixa de texto e sem número**, os **minutos previstos** (pelo papel prometido e o nível do jogador no elenco, `minutes.json`; "muitos minutos", "rodízio", "poucos minutos") e o **nível do clube** (pela reputação). Legenda: "os dois pesam na sua evolução". É a regra que já existe em 6.4: **mais minutos, mais evolução** (`fatorMinutos`), mas **clube de nível baixo evolui menos** (`qualidadeComissão`). Os minutos são previsão, não promessa: podem mudar com forma, lesão e técnico.

**Vida fora de campo:** comprar a casa da família, festas, investir. Afeta patrimônio, moral e disciplina.

### 6.13 Dilemas e eventos de carreira

| Dilema | Decisão | Consequências |
|---|---|---|
| Europa cedo × ficar no Brasil | Aceitar proposta jovem ou ficar | Comissão melhor × minutos e Seleção |
| Empresário e propostas | Ver 6.12 | Dinheiro × carreira |
| Lesão grave | Operar, tratamento conservador, ou voltar antes da hora | Tempo fora × risco de recaída |
| Ir para o rival | Aceitar ou recusar | Salário alto; vira vilão para a torcida antiga |
| Retorno ao clube formador | Proposta do clube no fim da carreira **ou** pedido do jogador após os 30 (pode ser recusado) | Menos dinheiro, mais idolatria |
| Clube de coração | Proposta do clube de coração, ida para um rival dele, jogo contra ele, encerrar a carreira nele (6.18) | Moral e idolatria × dinheiro; pode virar vilão da própria torcida |
| Disciplina | Festas, redes sociais, cartões e suspensões | Moral, relação com técnico, convocação |
| Mudança de posição | Ver 6.6 | Estende carreira, muda overall |

Para quem veio da várzea ou peneira, "clube formador" = primeiro clube profissional.

**Momento e consequência (v2.28):**
- **Selo de momento na cena:** semestre + momento do calendário ("1º semestre · Estadual", "Janela do meio do ano", "Reta final do Brasileirão"). Campo `momento` nos dados do evento; o motor escolhe um coerente com o semestre (6.8). Sem "rodada": o motor simula por semestre.
- **"Isso vai pesar":** quando a opção escolhida mexe num medidor que outra parte do motor lê, o resultado diz **onde** pesa (relação com o técnico → "vai pesar na próxima reunião com a comissão"; disciplina → "a Seleção vai lembrar disso"; idolatria → "a torcida não esquece"). Mapa medidor → frase em dados; teste garante que todo medidor citado é lido pelo motor.
- **Efeitos do resultado com setas, sem número** ("Minutos ↑", "Valor ↓", "Moral ↓").
- **Catálogo e repetição:** um evento não se repete na mesma carreira, salvo os recorrentes marcados nos dados (janela, renovação, lesão).

### 6.13b Marcos da carreira (v2.29)

Momentos de **primeira vez** viram cena com 3 opções (uma por jeito), como os dilemas, mas quase sem escolha errada: a escolha decide **como o jogador vive o momento**.

**Uma vez por carreira:** estreia profissional; primeira vez titular; primeiro gol; primeira assistência; assumir as faltas; assumir os pênaltis; primeira final ou jogo do título (campeonato e copa); primeiro título; primeiro clássico; primeira braçadeira de capitão; primeira convocação (por degrau, 6.11); estreia na Seleção principal; primeiro gol pela Seleção; primeira Copa; estreia no exterior.

**Uma vez por clube e na Seleção:** estreia, primeiro gol, primeiro clássico, primeira braçadeira e assumir a bola parada. Cada transferência ganha o seu arco.

**Efeitos:**
- **Mais cabeça do que técnica:** bônus pequeno de evolução em **Mental** (nunca soma direto no atributo), moral, idolatria no clube e relação com o técnico.
- **Cobrador do time:** "assumir a bola parada" torna o jogador cobrador do clube atual. Alguns gols a mais por temporada (como o goleiro cobrador, 6.2) e progresso do traço "Bola parada". Perder pênalti decisivo pesa em moral e idolatria. Perde a função ao trocar de clube.
- Números em dados, calibrados na 9.3. Aparência nunca entra.

**Encaixe nos ritmos (6.16):**
- O marco tem **prioridade** sobre evento comum e **ocupa uma das vagas** da temporada (não soma).
- **Marcos de carreira** aparecem em todos os ritmos, inclusive no Rápido.
- **Marcos de clube** aparecem no Normal e no Completo; no Rápido, escolha automática pelo temperamento.
- O registro das primeiras vezes vai no save.

**Narrativa e álbum:**
- Variações pelo contexto (ex.: primeiro gol num clássico ≠ num jogo comum).
- Cada marco vira figurinha no **álbum da carreira** ("Primeiro gol · Fluminense · 2027") e pode alimentar a manchete do cartão final (6.15).

### 6.13c Motor de histórias (v2.31)

O jogo conta histórias com continuidade: o passado volta, o contexto muda o texto e a personalidade muda o que acontece.

- **Memória da carreira:** o motor guarda memórias com ano, clube e idade (ex.: `perdeuFinal`, `recusouEuropa`, `trocouPeloRival`, `lesaoGrave`, `foiCapitao`, `primeiroGol` e os marcos da 6.13b). Eventos podem exigir ou evitar memórias nas condições e citar o passado no texto ("Sete anos depois daquela final..."). Memórias vão no save.
- **Eventos modulares:** um evento-base ganha variações pelo contexto. O motor marca a situação com etiquetas (jovem, veterano, no banco, ídolo, vilão, moral baixa, salário atrasado, convocado, subindo de divisão, fora do eixo, empresário que pressiona, posição disputada, memórias). O texto é montado em camadas: **abertura** pela etiqueta mais forte, **até duas frases de contexto** e **consequências das opções ajustadas** ao contexto. Inclui a **proposta com contexto** (idade, posição, clube, divisão, nível, moral, empresário, torcida, clube de coração, rivalidade, salário, titularidade, Seleção, temperamento). Regras e frases em dados; teste sorteia 10 mil contextos e garante texto completo, coerente e dentro do tamanho da tela.
- **Temperamento muda o tipo de história:** o peso de sorteio dos eventos varia por temperamento (esquentado: clássicos, cartões, brigas, protagonismo; líder: vestiário, braçadeira, entrevistas; resenha: elenco, festas, imprensa; frio: pressão, pênaltis, decisões calmas). Pesos em dados.
- **Idolatria em faixas:** a idolatria em cada clube aparece **só em palavras**: Desconhecido → Promessa → **Conhecido** → Querido → Ídolo → Lenda (e o lado negativo: Contestado → Vilão). v2.41: "Conhecido" no lugar de "Titular", que já é o selo do papel no elenco. Na tela: selo "Torcida: …" na caixa do jogador (com clube) e a faixa de cada clube na trajetória de "Minha carreira". Limiares em dados (`idolatry.json`). Alimenta eventos, despedida, retorno, transferência e rivalidade.

### 6.14 Aposentadoria

A carreira termina no primeiro destes gatilhos:
1. O jogador **decide parar** (a partir dos 30).
2. **Lesão ou queda física** força a aposentadoria.
3. O **overall cai ao nível do overall inicial** da criação (decisão consciente: faz parte da história de cada origem).
4. **40 anos** (limite absoluto).

**O último jogo (v2.31):** antes do veredito, uma cena especial com a última partida (começar jogando, entrar no segundo tempo, usar a braçadeira, ficar no banco, anunciar a despedida depois do jogo), e depois a tela **"Obrigado por tudo"**. A escolha entra na história e na manchete.

### 6.15 Veredito, prêmios, rótulos e cartão

**Nota de legado (0–100), pesos iniciais:**
| Componente | Peso |
|---|---|
| Seleção (convocações, titular, 10, faixa, títulos) | 35 |
| Títulos (Copa do Mundo > Libertadores/Champions > ligas nacionais > copas > estaduais) | 30 |
| Prêmios individuais | 15 |
| Números ajustados por posição (defensores e goleiros contam jogos sem sofrer gol e desarmes) | 12 |
| Idolatria | 5 |
| Longevidade e patrimônio | 3 |

**Veredito (8 faixas):** Promessa que não vingou · Rodado do interior · Jogador de Série B · Titular de Série A · Ídolo de clube · Craque da Seleção · Lenda do futebol brasileiro · Lenda mundial.

**Prêmios (nomes descritivos):** Melhor do Mundo, Craque da Copa, Artilheiro, Seleção do Campeonato, Revelação, Craque do Brasileirão, Craque do Estadual.

**Rótulos (1 principal no cartão, raridade comum → lendária):** Ídolo de um clube só, Rodado (6+ clubes), Rei do estadual, Carrasco de clássico, Torcedor que virou ídolo, Diamante da várzea, Oriundo campeão, Goleiro artilheiro, Craque esquecido, Ganhou muito e gastou tudo, Aposentadoria tranquila, Herói da Copa, Vilão da Copa e o mais raro: **10eFaixa**. Quem não conquista nenhum recebe um **rótulo de reserva** (Operário da bola, Casca-grossa ou Boleiro raiz), para todo cartão ter rótulo (v2.14).

**Honrarias (v2.28):** conquistas de carreira com nome bem-humorado, escritas pelo projeto, **zoando só o próprio jogador** (ex.: "Rodou mais que mala de rodoviária" por 6+ clubes, "Fiel até o último contrato" por um clube só); critérios e textos em dados, nomes passam pelo filtro de palavras; aparecem no álbum da carreira e no cartão final.

**Tom:** manchete **séria** + comentário com **zoeira**, sempre mirando o próprio jogador, nunca clubes, torcidas ou pessoas reais.
> Exemplo: **"Do terrão de Madureira à faixa de capitão no Maracanã"** — *Perna ruim? Nunca vimos. Folga? Também não.*

**Cartão (1080×1350):** o **avatar do jogador no auge** com a camisa e o número gigante, nome e apelido; faixa amarela com veredito e rótulo; clubes com cores estilizadas; jogos, gols, assistências, títulos e patrimônio; radar dos 10 atributos com os números do **pico** revelados; **código da carreira** (v2.42: assinatura curta `10F-XXXX-XXXX` de semente, ritmo, criação e escolhas; identifica e compara; os dados para refazer a carreira vão num link, adiado para a T57 pela v2.43); texto alternativo. O avatar veste a camisa do **clube do auge** (onde teve o maior overall).

**Linha do tempo por idade (v2.51, T55f–i; proposta em `docs/proposta-linha-do-tempo.md`):** a tela antes do cartão deixa de ser a lista de frases e vira **"Sua carreira"**: uma linha por temporada com idade, clube (emblema original) e divisão, **Over em número** e os títulos do ano; o auge é destacado e a troca de clube vira separador. As frases seguem no cartão narrativo (`storyOf` fica). Cada temporada do resultado ganha o campo aditivo `age` (derivado, sem sorteio). Sem lesões, Seleção ou gráfico.

**"Sua história" e duas versões do cartão (v2.31):** antes do cartão, uma linha do tempo em frases montada da memória da carreira ("Começou na várzea aos 16", "Recusado em duas peneiras", "Virou ídolo onde passou nove temporadas", "Recusou a Europa aos 24"). O cartão tem duas versões: **narrativo** (manchete, rótulo, sonho realizado ou não e as 3 a 4 frases mais marcantes; é o padrão para compartilhar) e **estatístico** (os números da carreira e o radar).

**Compartilhamento:** compartilhamento nativo do celular com a imagem (verificar suporte na documentação oficial, com fallback), texto pronto para WhatsApp, download como alternativa.

**Desafio diário:** todos jogam com a **mesma semente do dia**; comparação pelo cartão e pelo código. **Sem ranking online na v1.**

**Desafio do dia e link da carreira (v2.49, T57; proposta em `docs/proposta-T57.md`):** a semente do dia vem da data em `America/Sao_Paulo` (UTC−3 fixo) passada como parâmetro, nunca lida dentro do motor; cada pessoa cria o próprio jogador. O cartão leva o selo "Desafio de DD/MM" e o botão "Copiar link". O **link** vai no fragmento da URL (`#c=`, não enviado ao servidor) com versão, semente, ritmo, criação, visual e escolhas, **sem nome nem apelido** (privacidade); a leitura é estrita (versão, tamanho, tipos e ids validados; link inválido cai numa tela de erro). Quem abre **revê a carreira** em modo só leitura, sem gravar o save, e pode jogar o mesmo desafio. Fora: ranking, mesmo jogador inicial, contas, analytics do desafio.

### 6.16 Ritmos e save

| Ritmo | Duração alvo | Decisões |
|---|---|---|
| Rápido | ~5 min | Só momentos-chave (**até 1 por temporada**: o evento de **maior peso** que aconteceu nela, pelo peso de cada evento nos dados; v2.39); reunião automática |
| Normal | ~20 min | **2 a 3 decisões por temporada** + reunião anual |
| Completo | livre | **Pelo menos 6 decisões por temporada** (3 por semestre) + todas as reuniões e dilemas |

- **v2.28:** quantidade por temporada em dados (`flow.json`), por ritmo. Normal passa de ~15 para ~20 min pelo número maior de decisões. Fora do Completo, os eventos que não aparecem são decididos pela escolha automática do temperamento (como no Rápido).
- **Virada de temporada:** resumo curto (posição final e troféus) que se pula com um toque; no Rápido fecha sozinho.

- **Salvamento automático a cada decisão** (v2.39; antes, a cada temporada): o save guarda criação, semente, ritmo e escolhas, e a carreira é refeita a partir deles; ao voltar, o jogo abre exatamente na decisão em que parou. Versão do schema e migração. Uma carreira ativa por vez: com uma salva, "Nova carreira" **pergunta antes** de apagar ("Começar outra apaga a carreira de [nome]"), com "Apagar e começar" e "Cancelar".
- Save corrompido ou incompatível: mensagem clara e opção de recomeçar, sem travar o jogo.

---

### 6.17 Módulo "Quem é você" (aparência, biotipo, identidade e cenas)

**Regra de ouro:** tom de pele, cabelo, barba e acessórios são **só visuais** e **nunca** alteram atributos ou eventos. Só o **biotipo** (altura e compleição) afeta o jogo.

**Aparência (só visual)**
- ~10 tons de pele; 8 tipos de cabelo (raspado, curto, cacheado, crespo, black power, dread, moicano, longo) com cores; barbas; acessórios (faixa de cabelo, cor da chuteira).
- **Visuais prontos (v2.36):** na criação, a aparência é um dos **10 visuais prontos** (`src/data/visuais.json`), originais e ficcionais, sem nome (só "Visual N"). Cada visual guarda as peças da arte provisória (pele, cabelo, cor, barba, faixa, chuteira) para o busto em SVG e a imagem pintada `src/assets/visuais/visual-NN.webp`. Os tons de pele, cabelos e barbas acima continuam sendo as peças da arte provisória e do recolor; só deixam de ser escolhidos um a um.
- **Uniforme na figurinha (v2.37):** da assinatura do primeiro contrato em diante a figurinha **sempre** veste a camisa do clube atual; na criação, antes do clube, a camisa é neutra. A camisa segue o **padrão tradicional e as cores** do clube (nunca o modelo de uma temporada), aplicados por código sobre a camisa dos retratos (máscara + multiplicação, que preserva luz e dobras). Nunca entram escudo, patrocinador, marca de fornecedor nem grafismo de modelo. **Seleções**, mesma regra: nos eventos da Seleção a figurinha veste o país (Brasil e os países da dupla nacionalidade). **v1:** os 20 da Série A com padrão (`kits.json`), demais clubes com camisa lisa nas cores de cadastro; novas versões detalham liga por liga.
- **Envelhece com a carreira:** fios grisalhos e entradas surgem com a idade. O cartão final mostra o jogador no auge.
- Avatar **original**, nunca imitando o rosto ou o visual característico de pessoas reais.

**Biotipo (afeta o jogo pelo teto dos atributos, com troca)**

| Posição | Faixa de altura escolhível |
|---|---|
| Goleiro | 1,82 a 2,00 m |
| Zagueiro | 1,78 a 1,98 m |
| Volante | 1,70 a 1,90 m |
| Lateral | 1,65 a 1,85 m |
| Meia | 1,62 a 1,85 m |
| Atacante | 1,62 a 1,95 m |

- **Mais alto:** teto maior de Jogo aéreo (e alcance do goleiro); teto menor de Velocidade e Drible.
- **Mais baixo:** teto maior de Drible e agilidade; teto menor de Jogo aéreo.
- **Compleição:** franzino (mais agilidade, menos Força, mais lesões por choque), atlético (equilibrado), forte (mais Força, menos Velocidade). Pode mudar **um degrau** na carreira (ex.: foco longo em Força leva de franzino a atlético); ninguém vira franzino depois dos 30.
- **Estirão:** a altura escolhida é a **prevista**. Até os 18 anos varia de −3 a +6 cm, com **5% de chance de estirão grande** (até +10 cm). Pode sair um pouco da faixa da posição, e vira evento narrado.
- Na mudança de posição, a altura continua a mesma.
- Valores de efeito no teto em dados, calibrados pelos testes de simulação.

**Identidade**
- **Apelido:** **dado pelo jogo na base**, a partir de origem, cidade e estilo (ex.: sufixos, cidade natal, característica marcante). Passa pelo mesmo filtro do nome. Aparece nas manchetes e no cartão.
- **Comemoração de gol:** escolhida na criação a partir de uma lista de comemorações genéricas; citada nas manchetes e desenhada nas cenas de gol.
- **Temperamento:** Frio (menos cartões, mais frieza em pênaltis; torcida demora a se apegar), Esquentado (raça em clássicos, mais cartões e polêmicas), Líder (caminho curto para a faixa, bônus de Mental, atrito com técnico na fase ruim), Resenha (querido no elenco, mais tentação de festas). **Pode amadurecer** com idade e eventos (ex.: esquentado vira líder após suspensão longa ou aos 30+), sempre como evento narrado.

**Cenas ilustradas (toda decisão tem imagem)**
- Cada momento de decisão exibe uma **cena montada em camadas**: cenário + **o avatar do jogador** numa pose + **companheiros** gerados pelo mesmo sistema, com uniforme nas **cores do clube** (sem escudo oficial) + detalhes (taça, bola, placar, faixa, torcida).
- **Cenas padrão são reaproveitadas** entre carreiras; mudam só o avatar, companheiros e cores.
- **Catálogo inicial:** ~25 cenários (várzea, peneira, treino, vestiário, reunião com a comissão, sala do empresário, assinatura de contrato, aeroporto, estádio, gol, cabeçada, pênalti, título, convocação, hospital, fisioterapia, festa, entrevista/redes sociais, clássico, vaia, Copa, casa da família, despedida) e ~10 poses.
- Toda cena tem **texto alternativo** gerado a partir do momento; animações respeitam `prefers-reduced-motion`.
- Formato **raster pintado (WebP) em camadas**, com orçamento de peso por cena e carregamento sob demanda (v2.12; a arte provisória em SVG vale até a T43b–T45b).

**Produção da arte**
- **Arte final gerada por IA** (v2.12, decisão do usuário), em estilo de **ilustração pintada semi-realista** (referência de qualidade e layout: `docs/referencias/estilo-layout-2026-10-01.webp`), na **paleta original da seção 7**. O usuário gera as imagens com a própria conta; o Claude Code escreve os prompts e processa as peças. Modelo de camadas mantido: ~10 poses de corpo, cabeças em 3 ângulos (frente, perfil, três quartos), cabelos, barbas e acessórios como peças separadas por ângulo.
- **Recolor por máscara:** tom de pele, cabelo e cores do uniforme são aplicados pelo código sobre a pintura, preservando luz e sombra; cada peça é gerada uma vez, com as áreas recoloríveis em cores de chroma.
- **Altura e compleição** por escala da figura inteira (vertical e horizontal), sem desenhos extras.
- **Skill do projeto no Claude Code** (`.claude/skills/10efaixa-arte/SKILL.md`) com três funções: gerar **arte provisória** no formato de camadas; manter o **guia de produção da arte** (`docs/briefing-arte.md`, com os prompts) atualizado; **conferir cada lote** gerado (nomes, tamanho, máscaras, peso) com script automático.
- **Lançamento só com a arte final**; até lá o código avança com a arte provisória.

### 6.18 Clube de coração

Opcional, escolhido na criação entre os clubes brasileiros (Séries A–D). Quem escolhe "Nenhum" não tem estes efeitos. Todos os números em dados.

| Momento | Efeito |
|---|---|
| Proposta do clube de coração | Aparece em destaque. Aceitar dá bônus de moral e idolatria inicial maior. Opção "jogar por amor": salário menor, mais idolatria |
| Proposta de um rival do clube de coração | Dilema de "traição": aceitar gera evento com a torcida do coração e pode tornar o jogador vilão dela |
| Jogo contra o clube de coração | Decisão (ex.: comemorar ou não o gol), com efeito na idolatria dos dois lados |
| Clássicos defendendo o clube de coração | Pesam o dobro na idolatria; temperamento Esquentado amplifica |
| Fim de carreira | Gatilho "realizar o sonho": proposta de encerrar a carreira no clube de coração (como o retorno ao clube formador) |
| Cartão final | Rótulo "Torcedor que virou ídolo" se for ídolo no clube de coração |

Zoeira só com o próprio jogador (ex.: "o fanático que foi parar no rival"), nunca com o clube ou a torcida.

---

## 7. Identidade visual e interface

**Conceito:** "10 e Faixa" é a camisa e a braçadeira. O **número gigante** é o elemento memorável; a **faixa** horizontal carrega informação (progresso, faixas de atributo, veredito).

| Cor | Hex | Uso |
|---|---|---|
| Papel | `#EEE9DF` | Fundo (v2.19; era Cal de campo `#F2F4EF`) |
| Marinho de vestiário | `#14213D` | Texto e base escura |
| Verde gramado | `#1E7B4F` | Cor de base: botões, sombras das caixas, opção escolhida, progresso (v2.19) |
| Amarelo braçadeira | `#FFC21A` | Marca: abertura e faixa de capitão (deixou de ser o destaque das telas na v2.19) |
| Vermelho cartão | `#D62839` | Só lesão, queda e alerta |
| Cinza de linha | `#C9CFC6` | Divisores |

- **Tipografia:** Big Shoulders Display (números e títulos) + Atkinson Hyperlegible (texto). Confirmar licença no Google Fonts; sempre com fallback.
- **Layout:** mobile-first, uma decisão por tela, alinhado à esquerda; botões dizem o que acontece ("Aceitar proposta", "Ficar no clube").
- **Superfícies (v2.34):** superfície sólida com borda fina e sombra suave (borda grossa e sombra dura da v2.19 saem). **Vidro fosco** (blur com saturação) **só** em três lugares (v2.38: a prévia fixa da criação saiu na v2.35): caixa do jogador e faixa de baixo da decisão, e modal de revelação do overall; no máximo 2 camadas de vidro por tela; fallback sólido sem `backdrop-filter` ou com redução de transparência; contraste de texto conferido no pior fundo, nos dois temas.
- **Figurinha (v2.34):** o jogador é uma figurinha com moldura metálica pela faixa de `bands.json` (bronze até 49, prata 50–64, ouro 65–74, platina 75–84, esmeralda 85–94, diamante 95–99), com o Over em número e a tarja de nome e camisa. Ouro e metais são cor de **raridade**, nunca de texto corrido. O selo "Diamante bruto" (bônus de teto da várzea) é dourado; a moldura diamante é roxa: os textos nunca confundem os dois.
- **Criação (v2.34):** avatar-herói grande com setas e fileira de miniaturas; cor em círculo, opção curta em pílula, estilo de jogo em cartão com selo "Ativo"; a figurinha ao vivo fica no passo "quem é ele" (v2.35; a prévia fixa em vidro saiu, v2.38). A aparência continua sem afetar atributos.
- **Decisão (v2.34, variação B):** a cena ocupa a tela; a caixa do jogador (figurinha pequena, Over em número, idade, tempo de clube, salário, valor e títulos) fica em vidro no topo, sempre à vista; embaixo, faixa de vidro com título, texto, três opções de uma linha com medidor de risco de 4 segmentos e, só da opção marcada, "Você ganha / Em troca". **Confirmar escolha** só nos ritmos Normal e Completo; no Rápido, tocar já decide, e por isso cada opção mostra numa linha a **prévia curta** (o campo e as setas de ganho e custo; v2.38), para ninguém decidir sem ver o que ganha e o que dá em troca. Sem rolagem a partir de 390×844 nos 25 eventos.
- **Ilustrações:** cenas e avatar seguem a paleta do jogo, com as cores do clube aplicadas nos uniformes (6.17).
- **Movimento (v2.34):** dois momentos animados: o número "carimbando" na abertura e a figurinha "colando" na revelação do overall; ambos desligados com `prefers-reduced-motion`.
- **Tom de voz:** direto, coloquial, frases curtas, sabor de narração de rádio. Erros explicam o que houve e como resolver.
- **Acessibilidade:** WCAG 2.1 AA — teclado, foco visível, contraste, leitores de tela, tema escuro.

---
## 8. Métricas de sucesso (Fase 1)

| Métrica | Meta inicial | Como medir |
|---|---|---|
| Carreiras iniciadas que chegam ao fim | ≥ 60% | Evento início × evento veredito |
| Carreiras concluídas compartilhadas | ≥ 15% | Clique em compartilhar/baixar |
| Tempo médio por ritmo | Rápido ≤ 6 min, Normal ≤ 18 min | Início → veredito |
| Retorno em 7 dias | ≥ 10% | Visitante que volta, sem identificar a pessoa |
| Tela com maior abandono | identificar e corrigir | Funil por tela |

**Gatilho para a Fase 2:** ~10 mil carreiras concluídas por mês com retorno em 7 dias ≥ 10%.

---

## 9. Qualidade e testes

### 9.1 Regras
- **TDD obrigatório:** teste falhando → código mínimo → refatorar.
- **Pirâmide:** ~80% unitários, ~15% integração (fluxo com semente), ~5% E2E (Playwright, jornadas no celular).
- Toda regra com efeito numérico tem teste.

### 9.2 Invariantes
- Atributos entre 1 e 99, nunca acima do teto.
- Mesma semente + mesmas decisões = carreira idêntica.
- Idade entre 16 e 40; toda carreira termina com veredito válido.
- Nenhum número dos 10 atributos aparece antes do cartão final. Exceção (v2.16): o **overall geral** aparece em número na tela de decisão.
- Save → load devolve estado idêntico; save antigo migra ou falha com mensagem clara.
- Nome bloqueado nunca chega ao cartão.
- Nenhum texto de interface fora dos arquivos `i18n`.
- Aparência (pele, cabelo, barba, acessórios) nunca altera atributos nem eventos.
- Altura escolhida sempre dentro da faixa da posição; estirão dentro de −3 a +10 cm.
- Toda decisão tem cena associada, e toda cena tem texto alternativo.
- Apelido gerado nunca contém palavra bloqueada.

### 9.3 Sanidade da simulação (10 mil carreiras por origem × posição, ritmo Rápido, decisões automáticas)
- "Lenda mundial" ≤ 1%; todas as 8 faixas de veredito aparecem.
- Auge de overall (todas as origens juntas e cada origem separada, ±2 p.p.): 5% com 95+, 10% com 90–94, 60% com 85–89, 25% com 80–84.
- "Diamante bruto" entre 2% e 4% das carreiras de várzea.
- Idade média de aposentadoria por origem entre 30 e 39 (reportada em log).
- Defensores e goleiros alcançam "Lenda do futebol brasileiro" em proporção comparável a atacantes.
- Altura tem efeito mensurável e equilibrado: altos dominam Jogo aéreo, baixos dominam Drible, sem uma faixa de altura vencer em todas as posições.
- Uma carreira completa simulada em < 50 ms no CI.

---

## 10. Infraestrutura, observabilidade e privacidade

- **Hospedagem:** Vercel, preview automático por pull request, produção a partir de `main` com CI verde. Domínio **10efaixa.com**.
- **Rollback:** promover o deploy anterior na Vercel.
- **Lançamento progressivo:** funcionalidades novas atrás de flags de configuração (ex.: `inspiracaoLendas`, `desafioDiario`).
- **Analytics:** **Vercel Web Analytics**, sem cookies e sem dados pessoais (LGPD), com eventos do funil da seção 8.
- **Erros:** **Sentry**, configurado para **não enviar dados pessoais**, com contexto mínimo (tela, versão, semente). Conferir as opções de privacidade na documentação oficial.
- **v1 sem servidor próprio:** métricas RED e OpenTelemetry completos entram na Fase 2, com backend.
- **Página de privacidade** simples explicando o que é medido.

---

## 11. Regras jurídicas e de marca

> Não é aconselhamento jurídico. Revisar com advogado antes da Fase 2.

- **Clubes:** nomes reais e **emblemas originais** (v2.26): cada emblema evoca o **nome ou a cidade** do clube (chama, vela e ondas, palmeira…), num traço próprio do jogo. **Proibido:** o escudo oficial ou qualquer elemento dele, sua forma e disposição, monograma, mascote oficial, estrelas ou ano de fundação. Clube sem emblema próprio usa o **escudo genérico** (formato, padrão nas cores do clube, sigla quando couber). Cada emblema tem versão completa e simplificada (legível em 18 px). **Revisão jurídica obrigatória antes do lançamento.** Escudos oficiais só com licença ou parceria.
- **Competições (v2.32):** nenhuma liga, copa, torneio ou prêmio usa nome oficial ou marca (Brasileirão, Libertadores, Copa do Mundo, Olimpíadas, Champions, Premier League etc.). Nomes descritivos, sem imitação, em `src/i18n/pt-BR/competitions.json` (lista em `docs/competicoes-nomes.md`); os dados citam a competição real só em notas e fontes. Teste de guarda barra nome oficial nos textos do jogo. Revisão jurídica antes do lançamento.
- **Lendas nos arquétipos:** só texto descritivo ("estilo de jogo como o de Romário"), sem foto, rosto, caricatura ou sugestão de apoio; tom respeitoso. Campo `inspiracao`, controlado pela flag `inspiracaoLendas`.
- **Atletas da carreira:** todos fictícios.
- **Nome do jogador:** filtro de palavras bloqueadas, incluindo nomes de pessoas reais conhecidas.
- **Seleção e prêmios:** sem escudo da CBF; prêmios com nomes descritivos, nunca marcas registradas.
- **Avatares e cenas:** arte original; nenhum rosto, visual característico ou comemoração marca registrada de pessoa real.
- **Arte gerada por IA:** só ferramentas cujos termos permitam **uso comercial**; registro por peça (ferramenta, plano, data, prompt) em `docs/arte-registro.csv`; prompts nunca citam pessoa, clube, marca ou artista. A titularidade de direitos sobre arte de IA é incerta no Brasil: **validar com advogado antes do lançamento**. Se algum ilustrador retocar peças, contrato por escrito com cessão dos direitos patrimoniais.
- **Transfermarkt:** apenas consulta manual como referência, respeitando os termos de uso.
- **Aviso fixo:** projeto independente, sem afiliação com clubes, ligas, federações ou atletas.
- **Apoio:** Apoia.se, seguindo as regras da plataforma e obrigações fiscais aplicáveis.

---

## 12. Fases

| Fase | Conteúdo | Receita |
|---|---|---|
| **1 (este SPEC)** | Jogo completo da v1, lançado só com a arte final validada | Botão discreto "Apoie o projeto" (Apoia.se) na tela de resultado |
| **2** | Ranking online com antitrapaça, backend, observabilidade completa | Anúncios só entre carreiras e na tela de resultado; revisão jurídica; escudos licenciados se possível |
| **3** | App nativo reaproveitando o motor | A definir |
| **Futuro** | Carreira feminina; outros idiomas | A definir |

---

## 13. Dados a conferir na implementação

Não são decisões pendentes: são dados oficiais a conferir e citar (fonte + data) na tarefa correspondente.

| Dado | Fonte | Tarefa |
|---|---|---|
| Formato de cada um dos 10 estaduais e suas divisões de acesso | Federações estaduais | T18 |
| Número de clubes e regras das Séries A–D | CBF | T15, T16 |
| Vagas e formato de Copa do Brasil, Copa do Nordeste, Libertadores e Sul-Americana | CBF e CONMEBOL | T19 |
| Número de clubes das 6 ligas europeias e das copas europeias | Sites oficiais das ligas e da UEFA | T29 |
| Calendário de Copa do Mundo, Copa América e Olimpíadas | FIFA, CONMEBOL, COI | T14 |
| Faixas de valor de mercado por liga e divisão | Transfermarkt (consulta manual) | T28 |
| Licença das fontes | Google Fonts | T49 |

---

## 14. Plano de tarefas para o Claude Code

Cada tarefa é atômica, com teste escrito antes do código e **um commit por tarefa**. Só iniciar a próxima com a anterior verde no CI. ⛳ = ponto de revisão humana (seção 15).

**Ordem de execução:** segue a numeração, com uma exceção: **T42 e T43 são executadas logo após a T13** (fim do Marco 1), para o ilustrador começar cedo com briefing e formato de entrega definidos. Os IDs não mudam.

### Marco 1 — Motor núcleo
| ID | Tarefa | Critério de aceitação |
|---|---|---|
| T01 | Esqueleto Vite + React + TS estrito + Vitest + CI | ✅ Concluída (commit `2e6dabe`) |
| T02 | PRNG com semente | Mesma semente, mesma sequência; sementes diferentes divergem; distribuição uniforme em teste simples |
| T03 | Tipos dos 10 atributos e conversão para faixa/estrelas | Todas as bordas da tabela 6.3 testadas |
| T04 | Pesos por posição e overall | Casos conhecidos por posição, incluindo tradução do goleiro e Jogo aéreo |
| T05 | Dados e schema dos 16 arquétipos | JSON válido; distribuição e traço por arquétipo; campo `inspiracao` |
| T06 | Biotipo: altura por posição, compleição e efeito nos tetos | Faixas da 6.17 validadas; efeitos vindos de dados; aparência sem efeito algum |
| T07 | Criação do jogador (estado, origem, nível, teto, perna, dupla nacionalidade, temperamento, comemoração, filtro de nome) | Faixas da 6.1; 3% ±0,5% de diamante bruto em 100 mil sorteios; ~5% de dupla nacionalidade; nome bloqueado recusado |
| T08 | Estirão | −3 a +6 cm; 5% ±0,5% de estirão grande até +10 cm; só até os 18 |
| T09 | Curvas de idade (incluindo Jogo aéreo) | Formas da 6.4 verificadas |
| T10 | Evolução por semestre + mudança de compleição | Invariantes da 9.2; retorno decrescente; compleição muda no máximo um degrau |
| T11 | Lógica da reunião com a comissão | Aceita, contrapropõe e recusa conforme moral, relação e status; foco físico aumenta risco de lesão |
| T11b | Progressão de traços por foco | Foco em Bola parada leva a Cobrador (goleiro; Goleiro-líbero mais rápido) ou Bola parada (linha); foco em Perna ruim leva a Ambidestro; desbloqueio vira evento |
| T12 | Infraestrutura de textos (i18n pt-BR) + gerador de apelido | Todo texto vem de arquivo; apelido gerado por origem, cidade e estilo, sempre filtrado |
| T13 | Harness de simulação em massa | Roda 10 mil carreiras e gera relatório, incluindo efeito da altura ⛳ |
| T13b | Recalibração por origem | Teto igual entre origens; perfil e crescimento por origem; faixas 6.3 novas; auge na meta da 9.3 ⛳ |

### Marco 2 — Brasil
| ID | Tarefa | Critério de aceitação |
|---|---|---|
| T14 | Calendário: anos reais, semestres, janelas, sedes | Ano inicial pelo relógio; Copas e Olimpíadas nos anos corretos; sedes reais onde definidas |
| T15 | Schema de clubes + Séries A e B + rivais manuais | 40 clubes válidos; reputação, UF, cidade, cores; rivais definidos |
| T16 | Séries C e D + rivais automáticos por cidade | Clubes válidos com fonte citada |
| T16b | Clube de coração na criação | Opcional ("Nenhum"); só clubes brasileiros A–D; clubes do estado primeiro; guardado no jogador. Efeitos de 6.18 entram em T20, T22, T25/T28, T34 e T39 |
| T17 | Liga com acesso e rebaixamento | Tabela coerente com a força dos clubes |
| T18 | 10 estaduais completos + estadual simplificado | Formato por estado vindo de dados; campeão sempre definido |
| T19 | Copas: Copa do Brasil, Copa do Nordeste, Libertadores, Sul-Americana | Chaveamento e vagas coerentes |
| T20 | Início por origem: ofertas de base, peneira, várzea; Copinha e promoção | Ofertas do estado ou vizinhos; peneira com três desfechos; primeiro contrato |
| T21 | Minutos, forma e moral | Minutos dependem do overall relativo e do papel prometido |
| T22 | Clássicos, torcida, ídolo e vilão | Idolatria muda com clássicos e escolhas; temperamento influencia |
| T23 | Vida de clube: técnicos, salário atrasado, empréstimo | Salário atrasado habilita pedir para sair |
| T24 | Número da camisa, a 10 e a faixa do clube | Número mantido se livre; a 10 e a faixa só por evento |
| T24b | Integração da carreira | Uma carreira completa liga criação, início por origem, temporadas (ligas, estaduais, copas), minutos, evolução, reunião, traços, idolatria, vida de clube e camisa; determinística; relatório em massa com tempo por carreira |

### Marco 3 — Carreira e mercado
| ID | Tarefa | Critério de aceitação |
|---|---|---|
| T25 | Motor de eventos e dilemas (cada evento aponta para uma cena) | Condições e efeitos determinísticos; evento sem cena falha no teste |
| T25d | Memória da carreira (v2.31, 6.13c) | Memórias com ano, clube e idade; condições de evento por memória; citação do passado no texto; no save; integra os marcos da T25c |
| T25e | Eventos modulares e proposta com contexto (v2.31, 6.13c) | Etiquetas de contexto em dados; texto em camadas (abertura, contexto, consequências); temperamento muda o peso de sorteio; teste de 10 mil contextos sem frase faltando nem texto longo demais |
| T25b | Catálogo ampliado de eventos (v2.28; escrito já no formato modular da T25e) | **Pelo menos 80 eventos** escritos com a skill `10efaixa-narrativa`, em lotes de ~15 aprovados pelo usuário; todo evento com `momento` e cena; inclui os que faltam da v2.23 (peneira, primeiro contrato, estreia, banco, convocação, exterior, aposentadoria) e os de papel em campo; nenhum evento repete na carreira salvo os recorrentes; nenhuma opção domina outra (`narrative.test.ts`) ⛳ por lote |
| T25c | Motor de marcos da carreira (v2.29, 6.13b) | Detecta as primeiras vezes (carreira, clube, Seleção) a partir do motor; cada marco uma vez por carreira ou por clube, registrado no save; prioridade na vaga de decisão; marcos de carreira também no Rápido; cobrador de linha (gols em `stats`, progresso de "Bola parada"); efeitos sobretudo em Mental, moral, idolatria e relação; ~20 marcos escritos com a skill de narrativa (lote próprio, ⛳), contados nos 80 da T25b; figurinha no álbum |
| T26 | Empresário | 3 perfis; eventos; troca com custo |
| T27 | Contratos, bicho, multa e renovação | Moedas corretas; patrimônio em R$; € 1 = R$ 6,00 configurável |
| T28 | Valor de mercado, salários, propostas e janelas | Faixas com fonte e data; salário como % do valor |
| T29 | Dados das 6 ligas europeias + rivais | Número de clubes conferido na fonte oficial |
| T29b | 2ª divisão das 6 ligas europeias (v2.31) | Clubes, formato, acesso, rebaixamento e playoffs com fonte e data; faixas de valor e salário da 2ª; simulação da 9.3 sem desvio do auge |
| T30 | Temporada europeia | Classificações e campanhas coerentes |
| T31 | Lesões e decisão de lesão grave | Três opções; compleição influencia o risco |
| T32 | Mudança de posição | Proposta e pedido; overall recalculado; altura mantida |
| T33 | Disciplina, vida fora de campo e amadurecimento do temperamento | Temperamento afeta cartões e eventos; amadurece por idade e eventos |
| T34 | Retorno ao clube formador e aposentadoria | 4 gatilhos da 6.14 |

### Marco 4 — Seleção e legado
| ID | Tarefa | Critério de aceitação |
|---|---|---|
| T35 | Seleção: visibilidade, degraus, treinador | Convocação segue a nota |
| T36 | Efeito Seleção e decaimento | Bônus por degrau; cai sem convocação; títulos permanentes |
| T37 | Copa do Mundo, Copa América e Olimpíadas com momentos de decisão | Calendário da T14 |
| T38 | Dupla nacionalidade | Escolha definitiva |
| T39 | Prêmios | Nomes descritivos |
| T40 | Nota de legado, veredito e rótulos | Pesos da 6.15; sanidade 9.3 ⛳ |
| T41 | Manchetes e comentários (com apelido e comemoração) | Manchete séria + zoeira sobre o próprio jogador ⛳ |
| T41b | Prévia de consequências por opção de decisão (estilo Copero) | Cada opção informa, em faixas e estrelas, os efeitos prováveis (minutos, espaço no elenco, salário, contrato); nenhum número de atributo; requisito da T51 |

### Marco 5 — Avatar, cenas e arte
| ID | Tarefa | Critério de aceitação |
|---|---|---|
| T42 | Skill de arte do projeto + briefing do ilustrador | `.claude/skills/10efaixa-arte/SKILL.md` e `docs/briefing-arte.md` com boneco-base, poses, ângulos, camadas, paleta e lista de peças ⛳ |
| T42b | Guia de produção v4 + lote piloto (1 pose, cabeça em 1 ângulo com 2 cabelos e 1 barba, 1 cenário) | Piloto gerado pelo usuário, processado e montado numa cena; decide se o formato segue ⛳ |
| T43b | Formato raster e validador (nomes, dimensões, alfa, máscaras, peso, arquivo de âncoras) | Validador aponta cada erro por arquivo; piloto passa |
| T44b | Motor do avatar raster: recolor por máscara, escala por altura e compleição, cabeça montada, envelhecimento | Mesmos critérios da T44, sobre as peças pintadas |
| T45b | Compositor de cenas raster | Mesmos critérios da T45; cena dentro do orçamento de peso |
| T43 | Especificação de formato e validador de entregas | Script aponta camada faltando, nome errado, cor não recolorível e peso acima do orçamento |
| T44 | Motor do avatar | Camadas combinadas; recolor de pele e uniforme; proporção por altura e compleição; envelhecimento |
| T45 | Compositor de cenas | Cenário + avatar + companheiros nas cores do clube + detalhes; texto alternativo gerado |
| T46 | Catálogo de cenas ligado aos eventos | Toda decisão da T25 tem cena; cenas padrão reaproveitadas |
| T47 | Arte provisória de todo o catálogo, gerada pela skill | Passa no validador da T43 |

### Marco 6 — Produto
| ID | Tarefa | Critério de aceitação |
|---|---|---|
| T48 | Máquina de estados do fluxo de telas | Todas as transições testadas; nenhum estado sem saída |
| T49 | Tokens visuais, fontes e tema escuro | Contraste AA; fallback de fontes ⛳ |
| T49b | Acessibilidade e celular baixo da tela de decisão (`docs/revisao-layout.md`, P1 e P2) | Gaveta e resultado como `<dialog>` modal (foco preso, Esc, foco devolvido); resultado só fecha sozinho no ritmo Rápido; sem rolagem em 360×640 com os textos da v2.25; cena com largura e altura e `fetchpriority`; `theme-color` e `color-scheme`; hover e `touch-action` em todo botão |
| T49c | Figurinha e novo layout da decisão (v2.26) | Figurinha com fundo de faixas do clube e recorte de álbum no lugar da caixa do jogador; opções com tarja de risco (palavra e medidor de 4 segmentos, faixa de `preview.json`); "Álbum da carreira" com conquistas e espaços vazios; computador em duas colunas; rótulos sem caixa alta; contraste AA conferido por teste; **sem rolagem a partir de 390×844** nos 25 eventos; em tela mais baixa a rolagem é aceita, sem opção cortada pela metade (v2.27) ⛳ |
| T49d | Emblemas dos clubes (v2.26) | Emblemas originais de Flamengo, Santos, Palmeiras e Coritiba em SVG provisório (completo e simplificado) e escudo genérico para os demais; prompts dos 20 da Série A em `docs/arte/emblemas/`; nenhum elemento de escudo oficial (checklist por clube) |
| T50 | Telas de criação (aparência, biotipo, temperamento, comemoração, filtro) | Operáveis por teclado e leitor de tela; faixa de altura por posição |
| T50f | Sonho da carreira (v2.31, 6.1) | Escolhido no tipo de início; muda pesos de eventos; veredito diz se realizou; sem efeito em atributos |
| T51 | Tela de semestre/temporada e decisões com cena | Uma decisão por tela; cena ao fundo; só faixas e estrelas; **selo de momento**; resultado com **"isso vai pesar"** e **efeitos em setas**; faixa de competições (liga · copa · continental); cartões de mercado com **minutos previstos e nível do clube em faixa**; resumo da virada de temporada que se pula (v2.28) |
| T51b | Retorno da evolução e idolatria em faixas (v2.31) | Até duas frases por semestre sem número; faixas de idolatria em palavras na tela e nos eventos |
| T52 | Tela da reunião com a comissão | Foco principal e secundário; resposta exibida |
| T52b | Papel em campo (v2.28, 6.2) | Papel começa igual ao arquétipo; muda só para arquétipo da mesma posição (técnico, reunião ou evento); menos minutos e bônus de evolução enquanto se adapta, em dados; selo na figurinha; recomeça na mudança de posição; save migrado; simulação da 9.3 sem desvio de auge por posição |
| T53 | Ritmos Rápido, Normal e Completo | Durações dentro das metas em E2E cronometrado; decisões por temporada da 6.16 (Rápido até 1, Normal 2–3, Completo ≥ 6) lidas de `flow.json` |
| T54 | Save e load versionados | Invariante de save da 9.2 |
| T54b | Último jogo e "Obrigado por tudo" (v2.31, 6.14) | Cena com as opções da 6.14; escolha entra na história e na manchete |
| T55 | Geração do cartão 1080×1350 | Avatar no auge, radar de 10 atributos, elementos da 6.15 (com as honrarias da v2.28), **versões narrativa e estatística** e tela "Sua história" (v2.31), texto alternativo ⛳ |
| T56 | Compartilhamento com fallback | Nativo quando suportado; download; texto para WhatsApp |
| T57a | Semente do dia (v2.49) | `dailySeed(data)` determinística, fuso de Brasília |
| T57b | Codec do link da carreira | Ida e volta idêntica; rejeita versão, tamanho, tipos e ids inválidos; sem nome nem apelido; carreira Completa real ≈ 2,4 mil caracteres (limite 3 mil; a estimativa de 1,5 kB da proposta estava baixa) |
| T57c | Desafio na Abertura, `desafio` no save e selo no cartão | Criação usa a semente do dia; carreira livre inalterada |
| T57d | Tela "Rever carreira" por link | Só leitura, não grava save, link inválido tratado, "Jogar este desafio" |
| T57e | "Copiar link" no cartão | Texto copiado = link da T57b; aria-live; sem ranking online |
| T58 | Apoio (Apoia.se), aviso legal e página de privacidade | Botão só na tela de resultado |
| T59 | Vercel Web Analytics + Sentry sem dados pessoais | Eventos do funil; nenhum dado pessoal |
| T60 | Integração da arte final (gerada por IA) | Todas as peças finais passam no validador; nenhuma peça provisória restante ⛳ |
| T61 | PWA, deploy na Vercel, domínio e E2E finais | Instalável; CI verde; 10efaixa.com; E2E das jornadas principais ⛳ |

---

## 15. Pontos de revisão humana (⛳)

O Claude Code **para e pede aprovação** nestes momentos:

| Momento | O que apresentar |
|---|---|
| Após T13 | Relatório das 10 mil carreiras: overall, tetos, diamantes brutos, efeito da altura |
| Após T40 | Distribuição de vereditos, rótulos e idade média de aposentadoria por origem |
| Após T41 | Amostra de manchetes, comentários e apelidos para revisão de tom |
| Após T42 | Guia de produção da arte (prompts) |
| Após T42b | Lote piloto gerado e montado no jogo |
| Após T49 e T55 | Capturas do visual e do cartão |
| Após T60 | Cenas com a arte final, antes do lançamento |
| Fim de cada marco | Resumo, logs de testes e próximos passos |
| Qualquer mudança de escopo | Proposta de alteração deste SPEC antes de codar |

---

## 16. Regras de trabalho para o Claude Code

1. **Uma tarefa por vez**, na ordem do plano. Apresentar o plano da tarefa (3 linhas) antes de codar.
2. **TDD:** mostrar o teste falhando (Red) antes de implementar.
3. **Fonte oficial:** não adivinhar APIs nem dados; consultar a documentação ou fonte atual e citar o link no commit ou no arquivo de dados.
4. **Commits atômicos**, blocos de revisão de até ~100 linhas.
5. **Falhou, para:** reproduzir, localizar a causa, reduzir, corrigir e criar teste de regressão.
6. **Revisão antes de concluir:** correção, segurança, performance, legibilidade e testabilidade.
7. **Prova de conclusão:** log do terminal com 100% dos testes, typecheck e build passando.
8. **Chesterton:** não remover código existente sem entender e documentar por que ele está lá.
9. **Mudança de escopo ou ponto crítico/irreversível:** parar e pedir validação humana.

---

## 17. Decisões de implementação

Decisões aprovadas durante a implementação. Complementam as seções acima.

| Data | Tarefa | Decisão | Motivo |
|---|---|---|---|
| 2026-09-30 | T02 | PRNG `mulberry32` com estado de 32 bits exposto (`state()`) | Simples, determinístico; estado permite save/load (T54) |
| 2026-09-30 | T03 | Guarda automática: teste falha se `Math.random` aparecer em `src/engine` | Garante a regra de aleatoriedade com semente |
| 2026-09-30 | T04 | Pesos por posição somam 100; Atacante com Jogo aéreo moderado (10) | "Centroavante" é arquétipo, não posição; não penalizar pontas |
| 2026-09-30 | T05 | Campo opcional `overallWeightBonus` no arquétipo, somado aos pesos da posição; Centroavante de força: +10 Jogo aéreo | Cumpre "Jogo aéreo pesa muito para centroavante" (6.3) |
| 2026-09-30 | T05 | Arquétipo pode valer para mais de uma posição (Mágico: atacante/meia; Regente e Motorzinho: volante/meia) | Toda posição com ≥2 arquétipos |
| 2026-09-30 | T05 | Schema = tipo TypeScript + validador próprio, checado ao carregar e nos testes; sem biblioteca | Sem dependência nova; reavaliar (ex.: zod) se T15/T25 pedirem |
| 2026-09-30 | T05 | Flags de configuração em `src/data/flags.json` | Um lugar só para `inspiracaoLendas`, `desafioDiario` etc. |
| 2026-09-30 | — | Scan HawkScan só a partir da T48 (primeira tela servida) | Antes disso não há aplicação para escanear |
| 2026-09-30 | T07 | Lista de nomes bloqueados em `src/data/blockedWords.json`, por palavra inteira após normalização; nomes comuns só bloqueados na combinação famosa | Evitar recusar nomes comuns (Ronaldo, Vinícius); lista revisada na T41 |
| 2026-09-30 | T10 | "Manutenção" sem foco: cresce ×0,8 enquanto a curva sobe; cai inteiro quando desce. Foco amortece a queda (principal ×0,5, secundário ×0,75) | Interpretação de 6.5 ("atributos sem foco em manutenção") |
| 2026-09-30 | T10 | Ruído multiplica só o crescimento; nunca cria ganho com curva ≤ 0 | Garante o invariante "30+ sem minutos e sem foco não evolui fisicamente" |
| 2026-09-30 | T10 | Ordem por semestre: compleição → altura e tetos (idade do início do semestre) → atributos → idade +0,5; 2 sorteios fixos por atributo | Determinismo e fronteiras (30 anos, 18 anos) sem ambiguidade |
| 2026-09-30 | T10 | Teto que cai (compleição/altura) corta o atributo na hora | Invariante "nunca acima do teto"; queda máxima pequena |
| 2026-09-30 | T10 | Compleição: foco principal em Força empurra para forte; em Velocidade/Drible, para franzino; 4 semestres; contador limitado a ±4 | "Foco longo" da 6.17, calibrável |
| 2026-09-30 | T10 | "Muda um degrau na carreira" = nunca a mais de um degrau da compleição da criação; pode ir e voltar (ex.: atlético → forte → atlético → franzino); franzino nunca vira forte | Aprovado pelo usuário após revisão cross-model (Gemini); mais realista para quem muda o treino |
| 2026-09-30 | T11 | Reunião determinística: piso de moral/relação (recusa direta), pontuação ponderada (moral 0,4, relação 0,4, Seleção 0,2) com limiares de recusa e aceite; saída traz `reason` da recusa | Testável; UI escolhe o texto pelo motivo |
| 2026-09-30 | T11 | Contraproposta: necessidade do clube vira foco principal, desejo principal do jogador vira secundário (o secundário original sai); resposta do jogador à contraproposta fica para a T52 | Simples; registrar a perda do secundário |
| 2026-09-30 | T11 | `clubNeed` escondido do jogador na UI | Evita estratégia dominante (propor sempre o que o clube quer) |
| 2026-09-30 | T11 | Uma reunião por temporada é garantida por quem chama (máquina de estados, T48) | Motor puro não guarda histórico de reuniões |
| 2026-09-30 | T11b | Nova tarefa: progressão de traços por foco (Bola parada → Cobrador/Bola parada; Perna ruim → Ambidestro) | Prometido em 6.1/6.2 sem tarefa no plano; achado da revisão cross-model (Gemini) |
| 2026-09-30 | T13b | Teto igual entre origens; origem define perfil (base: físico + fundamentos; peneira: mental + físico; várzea: mental + técnica) e crescimento (várzea mais forte em fundamentos e físico); overall inicial por origem mantido | Pedido do usuário após o relatório da T13 (ninguém chegava a 85) |
| 2026-09-30 | T13b | Meta do auge: 5% 95+, 10% 90–94, 60% 85–89, 25% 80–84; faixas 6.3 sobem (Lendário = 95–99) para as estrelas seguirem diferenciando o topo | Aprovado pelo usuário |
| 2026-09-30 | T13b | Diamante bruto mantido como bônus de teto para 3% da várzea | Aprovado pelo usuário |
| 2026-09-30 | T13b | Calibração: evolução base 6/semestre, k = 6; faixas de teto 1 ponto acima da meta do auge, pesos 8/5/61/26; várzea +35% de crescimento em fundamentos e físico; diamante +6 de teto | 10 mil carreiras: auge 4,6% / 10,3% / 60,6% / 24,4%; auge médio igual entre origens (86,4–86,9) aos ~26 anos (docs/simulacao-T13.md) |
| 2026-09-30 | T13b | Troca aceita: crescimento mais lento empurra o auge para depois dos 27, mas abre distância até o teto e derruba o 95+. Escolhido auge aos ~26 | Medido na varredura de calibração |
| 2026-09-30 | T42 | Briefing aprovado. Extras: expressões faciais (4), cabelos com entradas e rugas para envelhecimento, cenários "banco de reservas" e "rua do bairro"; recolor por cores-chave exatas | Aprovado pelo usuário no ⛳ da T42 |
| 2026-09-30 | T16b | Nova funcionalidade: clube de coração (6.18), opcional, só clubes brasileiros; campo na T16b (após T16, quando existem as Séries A–D) | Pedido do usuário; aprovado |
| 2026-09-30 | T17 | Acesso e rebaixamento mantidos na v1 (Séries A–D e divisões de acesso dos estaduais), como no plano original. Uma remoção para o futuro foi proposta e revertida no mesmo dia | Decisão do usuário |
| 2026-09-30 | T17 | Regras de 2026 valem para todos os anos (sem a expansão da Série C para 24/28). Para manter a C com 20, a Série D dá 2 vagas (finalistas) em vez de 6 | Decisão do usuário; ajuste de consistência proposto por mim, configurável em leagues.json |
| 2026-09-30 | T17 | Temporada: partida sem gols (V/E/D pela diferença de força, mando +3); desempate por pontos, vitórias e chave sorteada; empate em ida e volta vai aos pênaltis ponderados; grupos da D por ordem geográfica de UF; chaveamento da D em pares de grupos (1º×4º…); PRNG separado por temporada e série | Revisão doubt-driven com revisor interno + Codex + Gemini; parâmetros em leagues.json (match) |
| 2026-09-30 | T18 | Estaduais: 1ª divisão real (participantes e formato 2026 das federações) + acesso simplificado (rebaixados vão à divisão de acesso; sobem os mais fortes dela, tantos quantos caíram; elite de tamanho fixo). ~120 clubes só estaduais em clubs.json (divisao null) | Decisão do usuário; aproximações por estado registradas em states.json |
| 2026-09-30 | T18 | **Não verificado:** Cearense (site da FCF não entrega o conteúdo); usa os clubes cearenses da base, formato genérico e sem acesso até conferir | Revisar na FCF |
| 2026-09-30 | T19 | Copas com formatos de 2026: Copa do Brasil (126; cotas por federação, Série A na 5ª fase), Copa do Nordeste (20; grupos cruzados), Libertadores (47) e Sul-Americana (44). Estrangeiros: 77 clubes reais participantes de 2026 como pool por país; vagas redistribuídas por força a cada ano | Decisão do usuário (clubes reais); sorteios por pareamento de força ou semente |
| 2026-09-30 | T19 | **Não verificado:** ordem do Ranking Nacional de Federações (cotas da Copa do Brasil); 2ª vaga da Copa do Brasil na Libertadores (CBF ainda estudava, tratada como Fase 2); Copa Verde não modelada (vaga vai ao clube mais forte fora) | Registrado em cups.json |
| 2026-09-30 | T15+ | Reputação de clubes na escala 1–100 (6.9 corrigida) | Confirmado pelo usuário |
| 2026-09-30 | T20–T24 | Início por origem com vizinhos do IBGE; minutos pelo nível do elenco estimado pela reputação; idolatria −100..100 (ídolo ≥ 75, vilão ≤ −50); salário atrasado dá direito de sair a partir do 1º atraso; a 10 é reservada na chegada | Regras em start/minutes/idolatry/clubLife/shirt.json |
| 2026-09-30 | T24b | Nova tarefa de integração antes do Marco 3; transferências e aposentadoria provisórias até T28 e T34 | Pedido do usuário no fechamento do Marco 2 |
| 2026-09-30 | T24b | Carreira integrada (18 ms/carreira). Achados para a T40: com minutos reais, 7% terminam abaixo de 80 (peneira 20%), ~13 títulos por carreira, 33% camisa 10, 63% capitão — recalibrar depois do mercado (T28), que muda minutos e trajetória | docs/simulacao-carreira.md (npm run sim:carreira) |
| 2026-09-30 | Marco 3 | Transfermarkt: consulta manual de poucas páginas de resumo por liga (sem listas de jogadores), com fonte e data | Decisão do usuário (T28) |
| 2026-09-30 | Marco 3 | UCL/UEL: clubes das 6 ligas + participantes reais de 2025/26 de outras ligas como pool por país (fonte UEFA) | Decisão do usuário (T29/T30) |
| 2026-09-30 | Marco 3 | Decisões automáticas (simulação e ritmo Rápido) por política de temperamento | Decisão do usuário (T25+) |
| 2026-10-01 | T28/T29 | T29 executada antes da T28 (as propostas precisam dos clubes europeus). Copas UEFA com participantes de 2026/27 (temporada atual), não 2025/26 | Ordem de dependência; mesma regra aprovada, edição mais recente |
| 2026-10-01 | T29 | Escala 1–100 por liga + `bonusNivel` por liga (Premier +12, LaLiga +10, Serie A/Bundesliga +9, Ligue 1 +7, Portugal +3, outras +3, fora do eixo −4 a −8) para comparar elencos entre ligas | Evita rebaixar a reputação de todos os clubes brasileiros já calibrados |
| 2026-10-01 | T29 | Ligas fora do eixo com poucos clubes reais: Arábia Saudita, MLS, J1, Catar (fontes oficiais) e China (**não verificada**: só Wikipédia) | Decisão do usuário |
| 2026-10-01 | T28 | Valor de mercado: curva exponencial no overall × fator de idade, ancorada na média da Série A (Transfermarkt, 4 páginas de resumo consultadas em 2026-10-01); salário = % do valor por liga com piso; Séries C/D com cobertura incompleta no Transfermarkt | Faixas e fontes em market.json |
| 2026-10-01 | T28 | Propostas por janela (Brasil × Europa) entre clubes cujo nível de elenco combina com o jogador; escolha automática por pesos de temperamento + dilemas da T25; integração na carreira junto com a T30 | Sem temporada europeia, jogador na Europa não teria campeonato |
| 2026-10-01 | T24b | Carreira com mercado (T28), empresário (T26), contratos (T27), dilemas (T25) e Europa (T30); transferência provisória removida. Europa simulada só quando o jogador está lá; ligas sem simulação (pool UEFA, fora do eixo, outros sul-americanos) com título por chance | 22 ms/carreira; 5,5 clubes e 5,7 títulos por carreira; 30% das temporadas na Europa |
| 2026-10-01 | T28 | Margem mínima para a proposta vencer a opção de ficar (2 pontos) e chance de proposta fora do eixo 12%/ano | Sem margem, o jogador trocava de clube quase todo ano (8,1 clubes por carreira) |
| 2026-10-01 | T33 | Cartões por temperamento (Frio ×0,6; Esquentado ×1,6); vermelho e suspensão longa tiram minutos do semestre seguinte. Vida fora de campo como eventos do catálogo (festa, polêmica nas redes, casa da família, investir, amadurecimento), com novo efeito `mul`. Amadurecimento: Esquentado → Líder aos 30 ou após suspensão longa; Resenha → Líder aos 32. Líder: +15% de crescimento em Mental e atrito com o técnico quando o time vai mal | Números em discipline.json; calibrar na T40 |
| 2026-10-01 | T34 | Aposentadoria no fim de cada temporada, primeiro gatilho que valer: 40 anos; físico (3 lesões graves ou velocidade+físico ≤ 50% do auge, a partir dos 30); overall ≤ overall inicial (a partir dos 26, para não encerrar quem ainda não evoluiu); decisão (a partir dos 30; na simulação, chance que cresce com a idade, com poucos minutos e pelo temperamento) | Números em retirement.json |
| 2026-10-01 | T34 | Despedida: proposta única a partir dos 33 (35%/ano) para encerrar a carreira no clube de coração ("realizar o sonho", prioridade) ou no clube formador; quem aceita não sai mais. Clube formador = primeiro clube da carreira (para várzea e peneira, o primeiro clube profissional) | Eventos `retorno-formador` e `realizar-sonho`, cena `despedida` |
| 2026-10-01 | T34 | **Achado para a T40:** a curva de idade derruba velocidade e físico para menos da metade do auge aos 34–35 e o overall perde ~4 pontos/ano depois dos 32; por isso ~55% das carreiras terminam pelo gatilho físico, idade média final ~34 e ninguém chega aos 40 | docs/simulacao-carreira.md |
| 2026-10-01 | T09/T34 | Declínio por idade mais tardio (v2.11): Velocidade/Físico platô até 30, queda a partir de ~31 e forte após ~35; Força cai após ~33; Jogo aéreo após ~32; técnicos e Marcação caem mais devagar | Pedido do usuário no fechamento do Marco 3: antes, o overall perdia ~4 pontos/ano depois dos 32 e ninguém chegava aos 40 |
| 2026-10-01 | T35 | Convocação determinística pela nota de visibilidade (sem sorteio): principal em qualquer idade (lista 110 · reserva 112 · titular 114); abaixo dela, o degrau de base da idade (Sub-17 73 · Sub-20 91 · Olímpica 105). Camisa 10 (118) só para meia/atacante titular; faixa (116) exige 8 convocações e 26 anos. Treinador fictício troca depois de cada Copa, com preferência Europa, Brasileirão ou forma | Números em nationalTeam.json. Em 300 carreiras: 38% chegam à principal, 11% titulares, 2% camisa 10, 6% capitães, 2% 10 e faixa |
| 2026-10-01 | T36 | Efeito Seleção por prestígio (0–1): sobe ao nível do degrau e decai 15% por semestre sem convocação. Dá minutos no clube, peso na reunião, valor de mercado (+30% no topo) e mais propostas; convocação ativa para a principal dá Mental extra, desfalque no clube e +10% de risco de lesão; ser cortado derruba a moral | Números em nationalTeam.json |
| 2026-10-01 | T37 | Torneios de seleções: só o caminho do Brasil é simulado (3 jogos de grupo + mata-mata do formato, campo neutro); adversário de cada fase sorteado de uma fatia cada vez mais forte das seleções. Formatos: Copa de 48 (FIFA), Copa América 2024 (CONMEBOL). **Não verificado:** grupos do torneio olímpico masculino de 12 seleções (LA28) | Fontes e data em nationalTournaments.json; forças das seleções são balanceamento do jogo, não ranking oficial |
| 2026-10-01 | T37 | Momentos de decisão: 1 garantido no 3º jogo do grupo (jogar no sacrifício ou jogar fora de posição) e o pênalti decisivo no primeiro mata-mata empatado. Bater e converter numa campanha de título = Herói; bater e perder = Vilão (prestígio cai pela metade). Título com a Seleção entra em `titles` com clube `selecao` e não decai | Eventos `copa-sacrificio`, `copa-fora-posicao`, `copa-penalti` |
| 2026-10-01 | T38 | Dupla nacionalidade: o direito vem do sorteio da criação (6.1, T07: ~5%, Itália/Portugal e raridade Espanha/Alemanha) ou é descoberto no meio da carreira por 5 temporadas na liga de um desses países. Convite único, a partir dos 20 anos, só sem convocação pela principal do Brasil e quando a outra seleção já convocaria (corte menor para seleções mais fracas). Aceitar é definitivo: convocação e torneios passam a ser pela outra seleção (sem Copa América; Eurocopa fora do escopo). Decisão automática: recusa, exceto o Frio | dualNationality.json |
| 2026-10-01 | T39 | Números da temporada por posição (jogos pelos minutos; gols, assistências e desarmes pela posição e pelo overall acima do nível da liga; jogos sem sofrer gol para goleiro, zagueiro, lateral e volante). Prêmios: nota = overall + forma + minutos, com ruído, contra um corte por prêmio; Artilheiro pelos gols; Revelação até 21 anos e uma vez só; Craque da Copa só para titular a partir da semifinal | stats.json e awards.json; nomes em i18n/pt-BR/awards.json. Em 300 carreiras: 3,5 prêmios por carreira, Melhor do Mundo 1,3% |
| 2026-10-01 | T40 | Nota de legado com os pesos da 6.15 (35 · 30 · 15 · 12 · 5 · 3): cada componente vai de 0 a 1 contra um teto em dados. Números ajustados por posição = média de min(1, número ÷ referência) dos números que contam para a posição (goleiro: jogos sem sofrer gol; zagueiro: + desarmes; atacante: gols e assistências…) | legacy.json; calibrado com `npm run sim:legado` |
| 2026-10-01 | T40 | Veredito = primeira faixa, de cima para baixo, com nota mínima e requisito: Lenda mundial (92 + Copa do Mundo ou Melhor do Mundo) · Lenda do futebol brasileiro (62 + convocado) · Craque da Seleção (42 + foi titular) · Ídolo de clube (26 + idolatria ≥ 75) · Titular de Série A (8+ temporadas na elite) · Promessa que não vingou (convocado na base da Seleção, nunca na principal) · Rodado do interior (6+ clubes) · Jogador de Série B (sem requisito) | Em 36 mil carreiras: 0,5% · 5,3% · 4,8% · 10,2% · 47,9% · 12,0% · 7,1% · 12,2% |
| 2026-10-01 | T40 | Rótulos em ordem de raridade (o primeiro atendido é o principal do cartão); carreira pode terminar sem rótulo (~30%). Novos rastros na carreira: clássicos decisivos, total ganho e gols de goleiro cobrador | Na simulação automática nunca aparecem: Goleiro artilheiro (exige treinar bola parada), Torcedor que virou ídolo (exige clube de coração), Ídolo de um clube só e Ganhou muito e gastou tudo (dependem de escolhas do jogador) |
| 2026-10-01 | T40 | **Foco automático** (simulação e ritmo Rápido): os dois atributos em que o foco rende mais overall (peso da posição × curva da idade × espaço até o teto). Antes usava os 2 mais fortes do arquétipo e goleiros/defensores ficavam 2–3,6 pontos abaixo do teto | Causa do viés por posição medido na 9.3 |
| 2026-10-01 | T40 | **Peneira entra na base do clube** (minutos de base até a promoção), como a base de clube grande, em vez de ir direto ao profissional como "promessa". Antes ficava 3,9 pontos abaixo do teto e 17–20% terminavam com auge < 80 | Chance igual entre origens (decisão do usuário, T13b) |
| 2026-10-01 | T40 | Recalibrado: faixas de potencial 95–99 · 91–94 · 86–89 · 81–85 com pesos 6 · 6 · 60 · 28; idolatria por semestre 12 → 5 e por clássico 10 → 6 (a mediana da idolatria máxima era 95); faixa de capitão no clube exige idolatria 60 e 4 temporadas (Líder: 40 e 2); camisa 10 da Seleção 121 e faixa 119 (10eFaixa em 1,4% das carreiras); ajuste de convocação por posição (goleiro +1,5 … atacante −0,3) | A meta do auge passou a ser medida na carreira integrada; o teste antigo do simulador sem clubes foi substituído por um guarda em career.test.ts |
| 2026-10-01 | T40 | Sanidade 9.3 medida com 2.000 carreiras por origem × posição (36 mil): os 10 critérios passam. **Pendente:** a amostra cheia da SPEC (10 mil por célula, ~1 h) com `SIM_LEGADO=10000 npm run sim:legado` | docs/simulacao-legado.md |
| 2026-09-30 | T42/T47 | Troféus: arte original que evoca o tipo do troféu real (taça com orelhas, globo, salva…), nunca cópia do desenho; lista mínima no briefing 6.7 | Pedido do usuário; desenhos de troféus reais são protegidos (seção 11). Réplicas só com revisão jurídica/licença |
| 2026-10-01 | T41 | Manchete (séria) e comentário (zoeira) escolhidos por veredito, 2 de cada, em `i18n/pt-BR/headlines.json`, citando apelido, nome e comemoração. O apelido passa a ser gerado no fim da carreira (`CareerResult.nickname`) para não alterar o PRNG das demais decisões | Textos do próprio jogador apenas; amostra para revisão de tom no ⛳ da T41 |
| 2026-10-01 | T44 | Motor do avatar em `src/art/avatar.ts` (puro): recolor por cores-chave exatas; altura = escala vertical (÷180 cm) e compleição = escala horizontal por grupo em torno do pivô (franzino 0,88/0,85/0,92 · forte 1,18/1,2/1,08 em tronco/braço/perna); grisalho de 30 a 45 anos (até 85%), entradas aos 35, rugas aos 36; cabelo-tras atrás do rosto, cabelo-frente à frente | Números em `src/data/avatar.json`; testado com peças fictícias — a arte provisória vem na T47 |
| 2026-10-01 | T45 | Compositor em `src/art/scene.ts`: avatar com os pés na base do slot, centrado, altura = altura do slot × `data-escala`; até 4 companheiros (aparência sorteada pelo PRNG, uniforme e torcida nas cores do clube); figuras entram antes da camada `frente`; texto alternativo por cena em `i18n/pt-BR/scenes.json` | Catálogos de aparência dos companheiros em avatar.json; testado com cenário fictício (arte na T47) |
| 2026-10-01 | T46 | Catálogo em `src/art/sceneCatalog.ts` + `scenes.json`: cada um dos 25 cenários define pose, expressão, detalhes e nº de companheiros (poses, expressões e detalhes do briefing 6.1–6.6); evento → cena por `sceneOf`; uma definição por cenário, reaproveitada entre eventos e carreiras; goleiro usa pose própria no pênalti | `allFiles()` lista as peças que a T47 precisa gerar |
| 2026-10-01 | Escopo | **Mentalidade** (aprovada pelo usuário, opção A): 4º campo da criação, opcional no motor — Fominha · Capitão · Professor · Máquina. Muda o caminho até o teto (multiplicador de crescimento por atributo, ruído e perda por idade), nunca o teto. Números em `src/data/mentality.json` (±30%, v2) | Pendente: efeitos em lesões/polêmicas/atrito (Máquina e Fominha), mudança ao longo da carreira, tela na T50 e calibração na T13. Simulação de 50 carreiras em docs/simulacao-mentalidade.md |
| 2026-10-01 | T47 | Arte provisória: 154 peças geradas por `src/art/provisional.ts` (`npm run art:generate` → `src/assets/art/provisoria/`): 10 poses (6 com luvas e mangas de goleiro), 78 peças de cabeça, 5 uniformes, 8 comemorações, 25 cenários, 10 detalhes e 18 troféus; todas passam no validador. Só paleta e cores-chave (nenhuma cor fixa nova) | Luvas e mangas-longas ainda não acompanham a compleição no motor do avatar; troféus provisórios são formas genéricas |
| 2026-10-01 | Arte (v2.12) | **Arte final = ilustração pintada semi-realista, gerada por IA**, com as camadas e a personalização mantidas (recolor por máscara) e a **paleta original** da seção 7. A imagem `docs/referencias/estilo-layout-2026-10-01.webp` vale como referência de qualidade e de layout (cena ao fundo, painéis de interface por cima), não de cores nem de escudos | Decisão do usuário. Substitui "ilustrador humano" e "vetorial chapado". Novas tarefas T42b, T43b, T44b e T45b; T43–T47 seguem valendo para a arte provisória |
| 2026-10-01 | Arte (v2.12) | **Risco registrado:** geradores de imagem não entregam camadas nem personagem idêntico entre poses. O formato só é confirmado depois do lote piloto (T42b ⛳); se o encaixe de cabelos e barbas sobre a cabeça não ficar aceitável, a alternativa é reduzir a personalização a personagens prontos | Por isso o piloto vem antes do retrabalho do código |
| 2026-10-01 | Decisões | **"Estilo Copero"** = esquema de decisões do jogo Copero, uma das inspirações do projeto (esclarecido pelo usuário). Entendimento, a confirmar: antes de decidir, o jogador vê o contexto e as consequências prováveis de cada opção (minutos previstos, espaço no elenco, salário, duração do contrato); depois, um "o que aconteceu"; a frequência das decisões muda com o ritmo. Inspiração de mecânica apenas: nenhum texto, nome, marca ou tela do Copero é copiado | Fonte consultada em 2026-10-01: https://copero.io/pt. Afeta a T51 (tela de decisão) e pede uma prévia por opção no motor |
| 2026-10-01 | Arte | Geração da arte final **adiada**: o projeto segue pelo Marco 6 com a arte provisória. Em aberto, sem decisão: (1) plano de imagens — proposta D: cenas genéricas com o jogador de costas (cores do clube e número aplicados pelo código) + avatar por camadas só como retrato de frente na criação e no cartão; (2) serviço de geração — testados/avaliados: API do Google (sem cota no plano gratuito; Nano Banana Pro a US$ 0,134 por imagem), Codex CLI, Yeri.ai (teste em docs/arte-teste). Skill `baoyu-image-gen` instalada no projeto | Decisão do usuário: ver alternativas em paralelo |
| 2026-10-01 | T48 | Fluxo de telas como máquina de estados pura, com a tabela de transições em `src/data/flow.json` (validada na carga: tela inicial e destinos existem, nenhuma tela sem saída). 15 telas: abertura, save inválido, criação (13 passos na ordem da 6.1, com a mentalidade), sorteio, ritmo, início de carreira, temporada, decisão e resultado da decisão (estilo Copero), reunião e resultado, torneio, aposentadoria, veredito e cartão. Evento que a tela não aceita não muda o estado | `src/state/flow.ts` |
| 2026-10-01 | T48→T51 | **Pendência de arquitetura:** `simulateCareer` roda a carreira inteira de uma vez com decisões automáticas. Para o jogo interativo, proposta a confirmar na T51: a carreira recebe a lista de decisões já tomadas e para na primeira decisão sem resposta; como a simulação é determinística e leva ~20 ms, refazer do começo a cada escolha é barato, e o save passa a ser só criação + semente + lista de decisões | Evita reescrever o motor em passos e simplifica o save (T54) |
| 2026-10-01 | Arte (v2.13) | **Plano de imagens aprovado:** cada cena mostra o jogador **de costas**, gerada uma vez por **corte de cabelo** (6: curto, cacheado médio, liso médio, cacheado grande, liso grande, careca). O código troca **tom de pele** (6), **cor do cabelo** (preto, castanho escuro, castanho claro, loiro, ruivo; grisalho com a idade), **uniforme** (padrão e cores do clube) e escreve o **número do jogador**, sempre visível. **Retrato de frente** nos mesmos 6 cortes para criação, apresentação no clube e cartão. Substitui a montagem do avatar por peças (cabeça, cabelo e barba separados) | Decisão do usuário, depois de teste: de uma imagem saíram 6 jogadores diferentes por código (docs/arte-teste/troca-de-cor-pele-cabelo-uniformes.jpg). Saem da v1: barba, faixa de cabelo, expressões, e altura/compleição no desenho (continuam no motor) |
| 2026-10-01 | Arte (v2.13) | **Geração:** Gemini (Nano Banana 2), manual, pelo plano Google AI Pro do usuário; a API fica como alternativa quando o faturamento for ativado. Uniforme gerado em magenta (camisa) e ciano (calção e meião), torcida e bandeiras em cinza, para a troca por código. Estilo aprovado: o traço das 5 cenas de teste. Um prompt por pasta em `docs/arte/` | ~175 imagens: 25 cenários × 6 cortes, 6 retratos, 18 troféus, 1 abertura; mais as versões de goleiro |
| 2026-10-01 | Arte (v2.13) | **Uniformes:** `src/data/kits.json` com padrão e cores dos 20 clubes da Série A (lisa, listras verticais, listras finas, faixas horizontais, listras diagonais, faixa diagonal, faixa no peito); demais clubes usam camisa lisa nas cores de clubs.json. **Goleiro:** um uniforme só para todos os clubes — rosa, manga longa, luvas laranja. Das imagens de referência só entram padrão e cores: nenhum escudo, patrocinador, marca de fornecedor nem aparência de pessoa real | Referência do usuário em docs/referencias/camisas-serie-a-2026-10-01.jpg |
| 2026-10-01 | Arte (v2.13) | **Pendente:** termos de uso comercial das imagens geradas no aplicativo Gemini e validação jurídica antes do lançamento; retrabalho do código de arte (T43b–T45b) para o novo formato: máscaras de troca por cena, pele, cabelo, padrões de uniforme e número; T42b (lote piloto) considerada cumprida pelas 5 cenas de teste | O protótipo de troca de cor é só de teste (docs/arte-teste/teste-troca-de-cor.py) |
| 2026-10-01 | T40 (v2.14) | **Rótulos de reserva** (decisão do usuário): quem não conquista nenhum dos 14 rótulos recebe o primeiro que couber de `rotulosReserva` em `legacy.json`: Operário da bola (700+ jogos), Casca-grossa (18+ anos de carreira), Boleiro raiz (sem requisito). Raridade comum; nunca aparecem junto de um rótulo conquistado; cada um tem comentário próprio | Antes, ~30% dos cartões saíam sem rótulo |
| 2026-10-01 | T40 (v2.14) | **Vereditos redistribuídos** (decisão do usuário: "espalhar o meio"): Ídolo de clube passa a pedir nota 22 e idolatria ≥ 55 (era 26 e 75); Titular de Série A passa a pedir 10+ temporadas na elite (era 8). O topo não muda. Novo critério no relatório: nenhuma faixa acima de 35% | Titular de Série A era 47,9% das carreiras; números novos em docs/simulacao-legado.md |
| 2026-10-01 | T41b (v2.14) | **Estilo Copero confirmado** (decisão do usuário): prévia em faixas e estrelas das consequências prováveis de cada opção, e tela de "o que aconteceu" depois da escolha. Vira a T41b, antes da T51 | Só mecânica; nada do Copero é copiado |
| 2026-10-01 | T49 (v2.14) | **Tema** (decisão do usuário): escuro nas telas com cena (decisão, temporada, veredito, cartão); as telas de formulário seguem a preferência do aparelho (`prefers-color-scheme`) | Combina com os 40% de baixo escuros das cenas |
| 2026-10-01 | T41b | Prévia em `src/engine/preview.ts`: para cada opção, os efeitos numéricos viram **campo + sentido (sobe, desce, muda) + intensidade (1 a 3)**, pela fração do efeito sobre a faixa do campo (limites em `src/data/preview.json`). Escolhas que são a própria ação (aceitar, renovar, operar) não entram. Proposta de clube: minutos previstos pelo papel (titular, rodízio, aposta), salário em faixa contra o atual (menor, parecido, maior, muito maior) e anos de contrato. Textos em `i18n/pt-BR/preview.json` | Nenhum número de atributo nem valor exato aparece; a tela é da T51 |
| 2026-10-02 | Arte (v2.13) | **Lotes 1 e 2 concluídos:** 30 cenas (5 cenários × 6 cortes) e 6 retratos de frente, em 1856×2304, em `docs/arte/`. **Prompts dos lotes 3 a 5 escritos** (199 arquivos, gerados por `docs/arte/gerar-lotes-3-5.py`): 20 cenários restantes × 6 cortes; 10 cenas de jogo em versão de goleiro × 6 cortes; 18 troféus (1:1, fundo marinho); abertura. Nas cenas fora de campo o jogador usa a camisa do clube com calça ou calção azul-marinho | Simplificações: goleiro só tem versão própria nas cenas de jogo; as cenas `gol` e `cabecada` viram `defesa` e `saída do gol` para o goleiro. O rosa do goleiro (#F0569B) fica perto do magenta das máscaras: separar por máscara de região no código de arte (T43b) |
| 2026-10-02 | T49 | Tokens visuais em `src/ui/theme/tokens.json` (paleta do SPEC, papéis por tema, tipo, espaço, toque), convertidos em variáveis CSS por `theme.ts`. Claro por padrão, escuro pela preferência do aparelho, e `data-tema="escuro"` nas telas com cena. Verde e vermelho ganham versões clareadas no tema escuro (`#63D7A0`, `#FF8E97`) e escurecidas no claro (`#18683F`, `#B81E2E`) para passar em contraste; o amarelo fica só na faixa de progresso e na opção escolhida. Todo par de cor usado em tela é conferido por teste (4,5:1 texto; 3:1 gráfico). Fontes hospedadas no próprio site (sem chamada a servidor de terceiros): Big Shoulders Display e Atkinson Hyperlegible, ambas com licença OFL-1.1 | Pacotes `@fontsource-variable/big-shoulders-display` 5.3.0 e `@fontsource/atkinson-hyperlegible` 5.3.0 (https://fontsource.org/docs/getting-started/install). Registro de produto para o design em `PRODUCT.md`; direção da tela em `.impeccable/surfaces/` |
| 2026-10-02 | T49 | **Tela de decisão (amostra):** estrutura "Número gigante" escolhida pelo usuário: cena no topo, faixa amarela de progresso, idade em número gigante, título e história, e as opções como faixas de largura inteira com a prévia em setas. A opção escolhida vira a braçadeira amarela. Pedido do usuário na revisão: cena menor, mais espaço para a história, e cada opção mostra o temperamento a que remete ("Jeito: Líder"), marcando o do próprio jogador ("Seu jeito"). Hoje o rótulo sai da política automática de cada evento (`temperamentsFor`) | **Em aberto, mudança de escopo a decidir:** o usuário quer 3 opções em todo evento, cada uma ligada a um perfil. O catálogo atual tem 17 eventos com 2 opções, 4 com 1 e 4 com 3; falta definir qual perfil (temperamento ou mentalidade, ambos com 4 valores) e como 4 perfis viram 3 opções. Em celular de 360×640, três opções com história longa pedem rolagem |
| 2026-10-02 | T49 (v2.15) | **Segunda revisão do usuário ("muito impessoal"):** a tela de decisão ganha uma faixa do jogador com escudo estilizado (cores e sigla do clube), nome, posição, clube, **nível geral em estrelas e faixa** e o **resumo dos títulos** conquistados até ali (total e as três competições de maior peso). O tema escuro das telas com cena passa de marinho para **cinza neutro** (`#1F2227`), para o painel não disputar com as cores dos clubes; o marinho segue como cor de texto no tema claro e na abertura | O nível geral aparece só em estrelas e faixa ("Muito bom"), nunca em número: a regra "nenhum número de atributo antes do cartão final" continua valendo. Se o usuário quiser o número do overall na tela, é mudança dessa regra e precisa ser decidida |
| 2026-10-02 | T49 (v2.16) | **Terceira revisão do usuário.** (1) **Overall em número** na faixa do jogador ("Over 78"), no lugar das estrelas, que ele achou fracas. É exceção à regra de não mostrar números: vale só para o overall geral; os 10 atributos seguem em faixas e estrelas até o cartão final. (2) **Títulos como mini troféus**, um por competição vencida, com balão translúcido de quantidade quando há mais de um; sai o texto "3 títulos". (3) Número da camisa reposicionado na cena de amostra | Regra alterada também no CLAUDE.md e no PRODUCT.md. Os mini troféus são um ícone único tingido por metal (ouro, prata, bronze, pelo peso do título em legacy.json), provisório até a arte dos 18 troféus do lote 5. O overall sobe e desce a cada semestre: a T51 precisa mostrar a variação |
| 2026-10-02 | T41c (v2.17) | **Três opções por decisão, cada uma ligada a um temperamento** (decisão do usuário). Os 21 eventos de decisão passam a ter exatamente 3 opções; cada opção tem um `jeito` (Frio, Esquentado, Líder ou Resenha), sem repetir dentro do evento. O temperamento que fica sem opção própria segue `politica.padrao`. A escolha automática (simulação e ritmo Rápido) passa a ser a opção do jeito do jogador; some o mapa `politica.temperamento`. Os 4 eventos só narrados (estirão, traço, técnico novo, amadurecimento) seguem com 1 opção. A tela mostra "Jeito: Líder" em cada opção e "Seu jeito" na que combina com o jogador | 17 opções novas, só com efeitos em campos que já existiam. Em "A casa da família" sai "Deixar para depois" e entram duas formas de comprar (com festa; financiado): com a regra nova, um jogador Frio no automático nunca compraria a casa. **Pendente para a T51:** o motor ainda trata várias decisões por identificador fixo (salário atrasado, empresário, renovação); os efeitos numéricos das opções novas só passam a valer por inteiro quando a carreira aplicar a opção escolhida de forma genérica |
| 2026-10-02 | T49 | **Revisão independente de design** (skill impeccable) aplicada: tema escuro em cinza realmente neutro (`#212222`), história em largura inteira, número da idade em 5,5rem, "Over" numa linha só, faixa de progresso entre a faixa do jogador e o número, troféus ao lado do nome em tom único (ouro, prata e bronze pareciam pódio), temperamento na linha de consequências | Em celular de 360×640 a terceira opção ainda pede rolagem |
| 2026-10-02 | T49 (v2.18) | **Ficha do jogador** (pedidos do usuário): tira fina com as duas cores do clube; escudo, nome, posição e clube; o **Over dentro de uma moeda** cuja medalha segue a faixa de overall de `bands.json`: bronze (até 49), prata (50–64), ouro (65–74), platina (75–84), esmeralda (85–94) e diamante (95–99); e uma ficha em três células: **tempo de jogo** (papel no elenco), **salário por mês** e **títulos** (mini troféus). O número da idade diminuiu para 3,75rem | Cores das medalhas em `tokens.json` (`medalha`), com o número conferido por teste em 4,5:1 nas duas metades da moeda. O nome "esmeralda" para a quinta faixa foi escolha minha, para a escada ter seis degraus até o diamante |
| 2026-10-02 | T49 (v2.19) | **Novo visual, a pedido do usuário**, com o jogo 7a0 (modo claro) como referência de cor e tipografia e **verde no lugar do laranja**: fundo de papel creme (`#EEE9DF`), tinta marinho, verde gramado como cor de base; tudo que se lê em bloco ou se toca é uma caixa de borda de 2px com sombra dura verde, sem desfoque. As telas com cena passam a usar o **tema claro**. **Over em cartão** (rótulo OVR sobre o número, canto arredondado, degradê da faixa de overall: bronze, prata, ouro, platina, esmeralda e diamante, este em roxo). **Troféus** com etiqueta "×N" no canto de baixo quando há mais de um título da competição; cabem cinco na linha, ou quatro e um contador. A idade sai do número grande e vai para a ficha (Idade, Tempo de jogo, Salário/mês). A opção escolhida desce sobre a própria sombra e enche de verde; "Seu jeito" vem em etiqueta verde | Substitui as decisões de tema escuro (v2.14), cinza neutro (v2.15) e moeda de metal (v2.18). As fontes continuam Big Shoulders Display e Atkinson Hyperlegible: são da mesma família visual das do 7a0 (título condensado pesado, texto sem serifa) e já eram as do projeto; não copiei as fontes dele. Nada do 7a0 é reproduzido: só a direção de cor clara, tipografia pesada e caixas com sombra dura. O tema escuro continua nos tokens, mas nenhuma tela o usa. Os mini troféus seguem como ícone único até a arte do lote 5 |
| 2026-10-02 | T49/T51 (v2.20) | **Pedidos do usuário:** (1) as opções deixam de mostrar o "jeito": ficam só o texto e o resumo das consequências. O campo `jeito` continua nos dados, porque é ele que decide a escolha automática. (2) **Resultado da escolha:** depois de escolher, um cartão menor aparece por cima da tela, que fica com desfoque leve (4px), dizendo se deu certo ou saiu caro e mostrando o **ganho e a perda reais** de cada campo ("Moral −10 pontos", "Salário −30%", "Patrimônio −R$ 300 mil"). Some sozinho depois de 2,6 s (`resultadoMs` em `preview.json`) ou pelo botão "Seguir", e a carreira vai para a próxima decisão. (3) Prompts das artes do cartão do Over em `docs/arte/cartoes-over/prompt.md` | O resultado usa `outcomeOf` e `outcomeVerdict` (`src/engine/preview.ts`): a diferença real antes e depois da opção, já com os limites de cada campo. Moral, relação com o técnico, disciplina e prestígio aparecem em pontos de 0 a 100. Estes são números de situação (moral, torcida, dinheiro), não dos 10 atributos, que seguem sem número. Pendente para a T51: escolhas que são só a ação (aceitar proposta, operar) ainda aparecem como "Decisão tomada", sem dizer o que aconteceu depois; o tempo de 2,6 s deve acompanhar o ritmo escolhido |
| 2026-10-02 | T49/T51 (v2.21) | **Pedido do usuário, depois de uma carreira completa jogada no Copero** (`docs/referencias/copero-observacoes.md`): (1) **caixa do jogador compacta**, em duas linhas: escudo, nome, posição, clube e cartão do Over em cima; idade e papel no elenco embaixo. (2) **Gaveta "Minha carreira":** a caixa inteira é um botão que abre, do pé da tela, idade, tempo de jogo, salário, os títulos pelo nome (com ×N) e a **trajetória** (uma linha por temporada fechada: idade, clube, overall), da mais recente para a mais antiga. Fecha pelo botão, por Esc ou tocando fora. (3) **Opções com "Você ganha" e "Em troca":** a prévia sai em linhas rotuladas, ganho em cima e custo embaixo; efeito que só muda (sem sentido de ganho ou perda) fica na linha "Muda". (4) A seta à direita das opções saiu, para o texto ter a largura toda | A tela de decisão passa a caber sem rolagem em 360×640 nos cinco eventos da amostra; a cena encolhe até 4rem quando falta altura. A trajetória mostra só o que o motor guarda por temporada hoje (clube e overall); jogos e gols por temporada ficam para a T51. O campo "Carinho da torcida do clube do coração" virou "Torcida do coração" na prévia e no resultado. Ficam para as tarefas das telas: cartões de proposta comparáveis e fechamento da temporada (T51), janela de conquista e linha do tempo (T55), três colunas em tela larga (T51). **Chance de dar certo** nas opções: não entra agora; decidir depois da T51 |
| 2026-10-02 | T49/T51 (v2.22) | **Pedido do usuário:** (1) a **ficha** (idade, tempo de jogo, salário do mês) volta a ficar sempre à vista, no pé da caixa do jogador; o convite "Minha carreira" sobe para baixo do clube. (2) A gaveta "Minha carreira" passa a mostrar os **atributos do momento**: os dez, um por linha, com a faixa em palavra ("Muito bom") e numa barra de seis degraus, um por faixa de `bands.json`. Depois vêm os títulos e a trajetória | Os atributos seguem **sem número** (seção 6.3): só a faixa. A ficha saiu da gaveta para não repetir o que já está na tela. Em celular baixo (até 680 px de altura) os espaços apertam para a tela seguir cabendo sem rolagem em 360×640 |
| 2026-10-02 | T49/T25 (v2.23) | **Revisão dos eventos com o usuário** (`docs/revisao-eventos.md`, os 25 eventos com pergunta, opções e consequências reais). Decisões: (1) os 4 avisos (`estirao-grande`, `traco-desbloqueado`, `troca-tecnico`, `amadurecimento`) passam a ter **3 opções de verdade**; (2) as consequências que hoje ficam escondidas (tempo fora e recaída na lesão, risco de lesão e saída do torneio na Copa, chance no pênalti, risco do investimento) aparecem na opção **em palavras** ("risco alto de recaída"), **nunca em percentual**; (3) os eventos que faltam (peneira, primeiro contrato, estreia, banco, convocação, exterior, aposentadoria) **ficam para depois da T51**; (4) **títulos com o troféu da competição** na gaveta "Minha carreira": peça provisória de `src/assets/art/provisoria/detalhe/` por `src/data/trophyArt.json`, até a arte do lote 5 | Liga Europa e copa nacional europeia ainda sem peça própria: usam o ícone genérico. A reescrita dos textos dos eventos espera a definição da skill de narrativa. Achado de passagem: o salário compacto saía "R$ 180,0 mil" em alguns motores (ICU); `minimumFractionDigits: 0` fixa "R$ 180 mil" |
| 2026-10-02 | Ferramentas (v2.24) | **Pedido do usuário:** skills de front e de narrativa. (1) **Vercel React Best Practices** e **Web Design Guidelines** em `.claude/skills/vercel-*` (MIT, origem em `ORIGEM.md`). (2) **shadcn MCP** em `.mcp.json`, conforme a documentação oficial (repositório shadcn-ui/ui, `apps/v4/content/docs/(root)/mcp.mdx`, commit 295a1f1): **só para consulta** de padrões de componentes acessíveis; o projeto **não adota Tailwind nem componentes shadcn** (o visual é CSS próprio com tokens, v2.19). (3) **Skill `10efaixa-narrativa`**: tom de voz, estrutura de *storylet*, regras das opções (nenhuma dominada, custo à vista, risco em palavras) e checklist; toda reescrita de evento passa por ela e pela aprovação do usuário | Frontend Design e 21st (Magic) são plugins da conta: o usuário ativa pelo cartão; a chave da 21st.dev fica com ele. As fontes externas da skill de narrativa (emshort.blog, gamedeveloper.com) estão bloqueadas pela rede do ambiente: entram como referência encontrada por busca, não lida |
| 2026-10-02 | T25 (v2.25) | **Os 25 eventos reescritos** com a skill `10efaixa-narrativa` (`docs/eventos-reescrita.md`, gerado dos dados): todos com situação de 2–3 frases e 3 opções (os 4 avisos viraram decisões); nenhuma opção domina outra (teste `narrative.test.ts`, que inclui lesão e Copa); risco em palavras pela faixa de `preview.json` (`risco`: baixo < 10%, médio < 25%, alto < 40%, senão muito alto). Mudanças de regra: clube do coração com desconto também em "Assinar" (−15%; por amor −30%), lido dos dados (`heartSalaryFactor`, antes 0,7 fixo no código); trunfo do rival pede +10% de salário; casa da família ganha "Ainda não"; Copa fora de posição "do seu jeito" não soma força; recusar volta a dar moral; salário atrasado passa para a cena do vestiário. **Aprovado pelo usuário em 2026-10-02** | Simulação de 300 carreiras: auge sem mudança; casa da família 100% → 94% (o Resenha adia); patrimônio mediano R$ 400 mi → 360 mi. Ids de opção que o motor usa foram mantidos; "amadurecimento" passa a usar a escolha do novo temperamento |
| 2026-10-02 | T49/T51 (v2.26) | **Aprovado pelo usuário ("De acordo"), depois de 6 rodadas de esboços** (`docs/revisao-layout.md` e as imagens enviadas na conversa): (1) **Figurinha** no lugar da caixa do jogador: retrato pintado, número, cartão do OVR e emblema do clube; fundo creme com **faixas nas cores do clube** na altura dos ombros (de `kits.json`) e **recorte de álbum** (contorno branco e linha marinho), que separa a camisa da faixa em qualquer cor. No celular ela sobe 64 px sobre a cena, com título e selos (idade, papel, salário) ao lado; no computador, figurinha e álbum à esquerda, cena e decisão à direita, três opções lado a lado. (2) **Opções com tarja de risco**: palavra e medidor de 4 segmentos num tom só, mais o efeito e o tempo fora em palavras. (3) **Álbum da carreira**: títulos conquistados em cromo e os que faltam (Série A, Libertadores, Seleção, Camisa 10) tracejados. (4) **Mercado** em cartões comparáveis (papel, salário, contrato, nível do clube; o atual tracejado), na T51. (5) **Paleta creme mantida** (v2.19); verde como texto só em `#18683F` (o `#1E7B4F` dá 4,34:1 sobre o papel). Rótulos pequenos sem caixa alta; "Meia do Flamengo" sem ponto médio. (6) **Emblemas originais** no lugar dos escudos estilizados (seção 11), a partir dos conceitos do usuário para Flamengo (chama), Santos (vela e ondas), Palmeiras (palmeira) e Coritiba (araucária) | Regra alterada também no CLAUDE.md. **A conferir antes da arte final:** se a araucária já apareceu em algum escudo do Coritiba (se sim, troca o símbolo). A figurinha depende da troca de cor da arte (verde-recorte vira transparente, magenta vira a cor do clube), testada nos esboços; no jogo ela é da T43b, e até lá a figurinha usa o retrato com fundo do papel. Camisa listrada na figurinha fica para o código de arte (hoje cor lisa). Clube com primeira cor branca precisa de linha fina entre o creme e a faixa. Ordem: T49b, T49c, T49d, depois T50 |
| 2026-10-02 | T49b | **Acessibilidade da tela de decisão:** com a gaveta ou o resultado abertos, a cena, a faixa de progresso e o painel ficam `inert` (WHATWG; Chrome 102, Firefox 112, Safari 15.5, conforme `mdn/browser-compat-data` `api/HTMLElement.json`); Esc fecha a gaveta ou segue o resultado de qualquer ponto; o foco volta para a caixa do jogador. O resultado **só fecha sozinho no ritmo Rápido** (prop `ritmo`); no normal, pelo botão ou Esc (WCAG 2.2.1). Cena com `width`/`height` 4:5 e `fetchpriority="high"`; `theme-color` e `color-scheme` no `index.html`; hover e `touch-action` em Seguir e Fechar | Não usei `<dialog>.showModal()` porque o jsdom 30 não o implementa (a classe é vazia) e o teste conferiria uma simulação. O jsdom também não aplica `inert`: o navegador de verdade (Chromium, script Playwright) pegou o foco voltando antes de o painel deixar de ser inerte, corrigido e com teste de regressão. **Em aberto:** com os textos da v2.25, os 25 eventos rolam em 360×640 (de 6 a 130 px), mesmo com a cena no mínimo; decidir na T49c |
| 2026-10-02 | T49c (v2.27) | **Decisão do usuário (opção 1):** em telas baixas (como 360×640) a tela de decisão **pode rolar**; a partir de 390×844 cabe sem rolagem nos 25 eventos. Os textos dos eventos não encolhem e a história não é recolhida | 360×640 é raro hoje; encurtar textos ou esconder a história tiraria o que o usuário aprovou na v2.25 |
| 2026-10-02 | T49c | **Figurinha e novo layout implementados** (aprovados pelo usuário: "siga o plano original"): `riskOf`/`timeOutOf` (`src/engine/preview.ts`) leem risco e tempo fora das tabelas de lesão e Copa; tarja "Risco de recaída: baixo" com medidor e "Fora por um ano"; rótulos de lesão e Copa encurtados (o risco mora na tarja). Componente `Figurinha` com o **busto da arte provisória de camadas** (`portrait.ts`, peças carregadas sob demanda), faixas de `kits.json` e recorte de álbum; ela é o botão de "Minha carreira". Selos (idade, papel, salário/mês) ao lado do título. Álbum da carreira (`src/data/album.json`) no computador. `clubs.json` ganha `artigo: "a"` em 11 clubes de nome feminino ("meia da Portuguesa") | Medido no navegador: **0 de 25 eventos rolam** em 390×844, 430×932 e 1280×800 (a cena encolhe até 7,5rem quando falta altura); 360×640 rola, como decidido. Achados corrigidos com teste: verde de destaque usado como texto na faixa dos atributos (4,34:1, vinha da v2.22) e a figurinha por cima da gaveta (camadas). **Lista de artigo feminino a conferir pelo usuário:** Chapecoense, Ponte Preta, Ferroviária, Portuguesa, Portuguesa-RJ, Inter de Limeira, Tuna Luso, Caldense, Anapolina, Aparecidense, Cabofriense. O retrato pintado e o emblema na figurinha chegam na T43b e na T49d |
| 2026-10-02 | T49c | **Retrato da figurinha (decisão do usuário: plano original):** a figurinha segue com o **busto da arte provisória** até a T44b. Os retratos pintados de `docs/arte/retratos/` não entram antes: têm um só rosto (pele morena média, cabelo castanho-escuro, sem barba) e só variam o corte, então não respeitariam a aparência escolhida na criação; e dependem da troca de cor da arte pintada (T44b) e do processamento de peso (T43b) | Atalho de usar o retrato só pelo corte foi oferecido e recusado |
| 2026-10-02 | T49d | **Emblemas dos clubes:** categoria `emblema` no formato da arte (viewBox 100, grupo `emblema`, até 8 KB, sem texto) e briefing v6 (seção 6.8). Peças provisórias geradas por `provisional.ts` para Flamengo (chama), Santos (vela e ondas), Palmeiras (palmeira) e Coritiba (araucária), completas e simplificadas, e o **escudo genérico** (faixas nas cores do clube; sigla por cima em HTML) para os demais; desenhadas com as cores-chave do uniforme, trocadas pelas de `kits.json` no componente `Emblema` (simplificado abaixo de 40 px, `src/data/emblems.json`). Emblema na trajetória (no lugar do escudo de duas cores) e no canto da figurinha. **Prompts dos 20 da Série A** em `docs/arte/emblemas/` (gerados por `docs/arte/gerar-emblemas.py`): magenta = cor 1, ciano = cor 2, fundo verde de recorte | **A conferir antes de gerar:** a lista "Evitar" de cada clube (elementos do escudo e mascotes) veio da memória do assistente, sem fonte conferida (sites bloqueados); araucária do Coritiba e remos do Remo em especial. O nome "Red Bull Bragantino" inclui marca registrada de empresa: levar à revisão jurídica. Os 16 símbolos propostos e o encaminhamento dos pontos a conferir foram **aprovados pelo usuário em 2026-10-02** ("autorizo seguir conforme indicou") |
| 2026-10-02 | T49 | **Arte dos cartões do Over** gerada pelo usuário (6 imagens em `docs/arte/cartoes-over/`) e em uso na tela: recortadas para a face do cartão e reduzidas para 256×256 em `src/assets/cartoes-over/`. Bronze e esmeralda saíram mais escuros que o previsto, então o número é branco neles (e no diamante); nos outros três, escuro | Legibilidade medida no centro de cada arte: contraste mediano de 5 ou mais em todas. O ouro veio com margem branca e a esmeralda sobre fundo preto com um "1" solto na borda: os dois saem no recorte |
| 2026-09-30 | T14 | Sedes reais conferidas: Copa 2026 (EUA, Canadá, México), 2030 (Marrocos, Portugal, Espanha + centenário), 2034 (Arábia Saudita) — FIFA; Olimpíadas 2028 LA, 2032 Brisbane — COI. Demais sedes sorteadas por semente | Fontes e data em src/data/calendar.json |
| 2026-09-30 | T14 | **Não verificado:** a CONMEBOL não anunciou a próxima Copa América masculina; ciclo assumido a cada 4 anos a partir de 2028 ("entre as Copas", 6.11). Sedes futuras repetem as 5 últimas reais em ordem (2015 Chile, 2016 EUA, 2019 Brasil, 2021 Brasil, 2024 EUA), decisão do usuário. Janelas de transferência modeladas por momento do semestre; datas exatas a conferir na T28 | Marcado `verificado: false` no JSON; revisar quando houver anúncio oficial |
| 2026-10-02 | v2.28 | **Ideias do copero.net incorporadas** (`docs/referencias/copero-net-observacoes.md`; aprovadas pelo usuário): (1) proposta mostra **minutos previstos e nível do clube em faixa**: a regra já existia na 6.4 (mais minutos, mais evolução; clube fraco, menos evolução) e agora aparece na escolha; (2) **selo de momento** na cena; (3) **"isso vai pesar"** no resultado, dizendo onde a escolha pesa; (6) **papel em campo** junto com o arquétipo (6.2, T52b). Também: efeitos em setas, faixa de competições, resumo da virada que se pula e **honrarias bem-humoradas** (6.15). **Decisões por temporada** (pedido do usuário): Completo ≥ 6, Normal 2–3, Rápido até 1; Normal passa a ~20 min. Para não repetir, **catálogo ampliado para ≥ 80 eventos** (T25b) | No copero.net o modo narrativo teve ~6 decisões por temporada e 116 eventos distintos numa carreira; com os 25 eventos atuais, 6 por temporada repetiriam cada evento ~5 vezes. |
| 2026-10-02 | v2.29 | **Marcos da carreira** (pedido e aprovação do usuário): primeiras vezes na carreira, em cada clube e na Seleção (estreia, titular, gol, assistência, bola parada, pênaltis, finais, título, clássico, capitão, convocação, Copa, exterior), com efeito sobretudo mental; tarefa T25c | O motor já tinha papel, capitão (clube e Seleção), gols, finais e pênaltis; faltava o registro das primeiras vezes e o cobrador de linha (só o goleiro tinha) |
| 2026-10-02 | T50 (v2.30) | **Criação em duas telas + tipo de início** (decisão do usuário, depois da proposta de tela única): tela 1 "quem é ele" (identidade e visual, nada mexe em atributos), tela 2 "em campo e cabeça" (tudo que pesa no jogo), tela 3 origem. Sem rolar a partir de 390×844; uma tela só no computador. Visual na própria tela (sem gaveta), sorteado ao abrir, botão "Sortear" ao lado do título e editável | Físico foi para a tela 2 porque a faixa de altura depende da posição (6.17) e o físico pesa no jogo. O assistente de 13 passos das fatias T50a/T50b vira 3 passos; campo de nome, grupos de escolha e figurinha ao vivo são reaproveitados |
| 2026-10-02 | T50 | **Criação concluída (v2.30):** tela 1 "quem é ele" (figurinha ao vivo, nome com filtro, número, estado, clube de coração com os do estado primeiro, comemoração, visual sorteado pela semente com "Sortear" e editável); tela 2 "em campo e cabeça" (campinho, estilo da posição com traço e inspiração, perna, altura na faixa da posição, compleição, temperamento e mentalidade, com frases de efeito e sem números); tela 3 tipo de início (três cartões). Entrega `CreationInput` validado pelo `createPlayer`; o visual vai à parte. No computador, telas 1 e 2 numa página (1280×800 sem rolar) | Conferido no Chromium: 390×844 sem rolar nas três telas; 360×640 rola (aceito). Token `toque.compacto` (48 px) nas faixas de escolha. **Pendente:** ligar a criação ao app (a abertura ainda mostra a amostra da decisão) junto com a T51; mentalidade é opcional (neutra) |
| 2026-10-02 | v2.31 | **Análise do produto (`Analise_10eFaixa.pdf`, enviada pelo usuário) e escolhas do usuário para a v1:** memória da carreira (T25d), eventos modulares com proposta com contexto (T25e, antes do catálogo T25b), idolatria em faixas e retorno da evolução (T51b), temperamento muda o peso dos eventos, "Sua história" e cartão narrativo + estatístico (T55), último jogo (T54b), sonho da carreira (T50f). **2ª divisão** nas 6 ligas europeias (T29b). FM26 só como pista de fatos e conferência de ordem de grandeza, nada copiado | Ficaram fora da v1 (não escolhidos): desafio diário com o mesmo jogador inicial e regra explícita de monetização. Comparar histórias com amigos fica para a Fase 2 (precisa de ligação entre aparelhos) |
| 2026-10-02 | v2.32 | **Competições com nomes não oficiais** (pedido e aprovação do usuário): Nacional · Série A–D, Copa Nacional, Copa Regional do Nordeste, Estadual {UF}, Copa de Juniores, Copa Continental e Copa Continental 2, Mundial de Seleções, Continental de Seleções, Torneio Sub-23 dos Jogos, Liga Inglesa/Espanhola/Italiana/Alemã/Francesa/Portuguesa, Copa Europeia, **Copa Europeia 2** (o usuário trocou de "Liga Europeia", perto demais de "Liga Europa"), ligas fora do eixo pelo país; prêmio "Craque do Nacional". `competitions.json` + teste de guarda; títulos dos prompts de arte trocados | Registros no INPI não conferidos (rede bloqueada): revisão jurídica antes do lançamento |
| 2026-10-02 | v2.33 | **Valor de mercado em euros nos selos da decisão** (pedido do usuário), junto de idade, tempo de jogo e salário do mês: "Valor € 12,5 mi". Calculado como no mercado (overall, idade e efeito Seleção) e entregue na foto da decisão (`DecisionView.marketValueEUR`). Não é atributo, então aparece em número | Em 390×844 o selo novo fez um evento rolar 13 px: a cena passa a encolher até 6,5rem (era 7,5rem), ainda recebendo a figurinha. Medido no Chromium: 0 de 25 eventos rolam em 390×844, 430×932 e 1280×800 |
| 2026-10-05 | v2.34 | **Visual "Álbum com vidro"** (aprovado pelo usuário em 2026-10-05 sobre exemplo visual: criação, revelação e decisão na variação B; proposta em `docs/proposta-visual-v2.34.md`). Figurinha com moldura por faixa de overall; vidro só em sobreposições (prévia da criação, caixa do jogador e faixa de baixo da decisão, revelação); superfície sólida com borda fina e sombra suave no lugar de borda grossa e sombra dura (v2.19); dois momentos animados; decisão com cena inteira; confirmar escolha só nos ritmos Normal e Completo; tarja de risco mantida; Oswald e Inter da referência **não** entram | Tipografia, paleta base e regras de números e aparência não mudam. Molduras provisórias: as 6 artes de `docs/arte/cartoes-over/` (JPG quadrado); versão com transparência a pedir ao ilustrador. Cena por evento depende da T46/T51. Tarefas T49e a T49j, T50g e T51c. `DESIGN.md` será regenerado ao fim (T49j), pois descreve a build anterior |
| 2026-10-05 | T50g (v2.35) | **O visual ganha tela própria na criação** (decisão do usuário ao ver que o avatar-herói grande da v2.34 não cabe, sem rolar, junto da identidade): ordem quemE → visual → emCampo → origem em `flow.json`; no computador, quemE e visual numa página; "Sortear" e os 6 grupos de visual saem da tela 1 | Mantém "sem rolar em 390×844" em cada tela. O avatar-herói usa o busto provisório em SVG; o retrato pintado entra quando o avatar por camadas estiver pronto |
| 2026-10-05 | T50g (v2.36) | **10 visuais prontos no lugar da escolha peça por peça** (decisão do usuário; proposta em `docs/proposta-visuais-v2.36.md`): "Visual 1" a "Visual 10", escolhidos deslizando de lado, sem nomes; saem pele, cor do cabelo, barba, faixa, chuteira e "Sortear"; visual inicial sorteado pela semente. Retratos originais gerados pelo usuário a partir de prompts em `docs/arte/visuais/` | **Assumido pelo usuário ao mandar seguir com as imagens provisórias**, a confirmar: sem ajuste livre; cenas passam de 6 para 10 variações por tipo (+67%) ou ficam sem rosto. Imagens provisórias: Visual 01 em 928×1152 e 02 a 10 em 412×512; trocar por 1856×2304 sem mexer em código. O pós-processamento (enquadramento e fundo `#00B140`) ainda não foi feito: topo da cabeça a 4,5% a 9,2% e fundo um pouco mais escuro que o valor-chave |
| 2026-10-06 | T50i (v2.37) | **Figurinha sempre com o uniforme do clube, padrão tradicional** (decisão do usuário): da assinatura em diante, camisa no padrão e nas cores tradicionais do clube, sem escudo, patrocinador, marca de fornecedor nem modelo da temporada; o mesmo para seleções (Brasil e dupla nacionalidade) nos eventos da Seleção. v1: Série A com padrão, demais clubes lisos; liga por liga nas versões seguintes. Prompt de referência de camisa (sem o nome do time) entregue ao usuário. Tarefas T50i (padrões na camada da camisa), T50j (cores dos clubes) e T50k (seleções) | **Achado:** 218 dos 278 clubes brasileiros e os 246 de fora estavam com o marinho e branco provisório (`#14213D`/`#FFFFFF`), e os de fora nem eram lidos pelo `kitOf` (caíam no cinza). Decidido: o assistente preenche as cores como **estimativa, a conferir**, com data, e lista as dúvidas para o usuário revisar. Desenhos muito característicos (ex.: faixa diagonal) entram na revisão jurídica antes do lançamento. Gola e punhos na cor de detalhe dependem de novas imagens dos visuais (gola e punhos em ciano) |
| 2026-10-06 | T50j | **Cores dos clubes:** dos 464 clubes no marinho/branco provisório, 214 preenchidos com segurança e 60 como prováveis; 190 desconhecidos (175 de estaduais) seguem no provisório. Listas em `src/data/coresRevisao.json` e `docs/revisao-cores-clubes.md` | Estimativa do assistente, sem fonte conferida (sites bloqueados na sessão); **o usuário confere** as prováveis e informa as desconhecidas |
| 2026-10-06 | T50k | **Camisas das seleções:** Brasil, Itália, Portugal, Espanha e Alemanha em `kits.json` (`selecoes`, uniforme `selecao:<país>`); eventos com `contexto: "selecao"` em `events.json` (as três da Copa); o motor passa a nacionalidade atual na visão da decisão; a figurinha veste o país nesses eventos, com emblema e linha do clube | Cores das seleções: estimativa do assistente, a conferir. `dupla-nacionalidade` fica com a camisa do clube (o jogador ainda não trocou de seleção) |
| 2026-10-06 | T49j ⛳ | **Marco aprovado pelo usuário em 2026-10-06 ("Aprovo").** **Verificação do visual v2.34 no Chromium:** 52 capturas (criação, revelação, decisão, gaveta e resultado; 360×640, 390×844 e 1280×800; claro e escuro) com **0 violações do axe-core 4.14 (WCAG 2.1 A/AA)** e nenhuma rolagem lateral; 390×844 e 1280×800 sem rolagem. **Corrigido:** em 360×640 o "Confirmar escolha" ficava cortado e inalcançável (decisão com `overflow: hidden`); agora a página rola e cena, gaveta e resultado são fixos. `DESIGN.md` regenerado (frontmatter gerado do `tokens.json`) | **A decidir pelo usuário:** (1) a SPEC 7 ainda lista vidro na "prévia fixa da criação", que não existe desde a v2.35; (2) no ritmo Rápido tocar já decide, sem ver "Você ganha / Em troca" (princípio de prévia antes de decidir); (3) o carimbo da abertura espera a tela de abertura; (4) "Barcelona" (`barcelona-ba`) se confunde com o espanhol; (5) na revelação em 360×640 o diálogo abre rolado até o botão (título e figurinha acima, a uma rolagem) |
| 2026-10-06 | v2.38 | **Decisões do usuário sobre os pontos da T49j:** (1) a "prévia fixa da criação" sai da lista do vidro (não existe desde a v2.35); (2) no ritmo Rápido cada opção mostra a **prévia curta** (campo e setas) no próprio botão, já que tocar decide; (3) o Barcelona da Bahia passa a se chamar **"Barcelona-BA"**, como os outros homônimos (Portuguesa-RJ, Inter-SM) | Tarefas: SPEC (esta linha), nome do clube com teste de nomes únicos, prévia curta no Rápido com medição dos 25 eventos |
| 2026-10-06 | T50j (v2.38) | **Cores dos clubes aprovadas pelo usuário** ("Aprovado"): as 60 prováveis ficam; as 190 sem informação recebem duas cores da **bandeira do estado ou do país**, sorteadas por hash fixo do id (`docs/dados/sortear-cores.py`, determinístico). Nenhum clube fica no marinho/branco provisório | Decisão do usuário: "pode ser sorteado, ou as cores da cidade". Bandeira do estado no lugar da cidade: o assistente não conhece as bandeiras municipais com segurança. As sorteadas são trocadas pelas reais quando o usuário informar |
| 2026-10-06 | T48/T53a | **Abertura e tela de ritmo:** abertura com a arte do túnel (`docs/arte/abertura`), o "10" **carimbando** nas costas (segundo momento animado da v2.34; desligado com `prefers-reduced-motion`), a marca no amarelo da braçadeira (`--paleta-*` agora vira variável) e "Nova carreira"; depois da revelação, a escolha **Rápido, Normal (marcado) ou Completo**, que chega à decisão (no Rápido um toque decide). Fluxo: abertura → criação → revelação → ritmo → carreira. Medido no Chromium: 0 violações do axe e nenhuma rolagem em 360×640, 390×844 e 1280×800 | **Falta (T53):** a quantidade de decisões por temporada de cada ritmo; hoje toda decisão chega à tela e o Completo se joga como o Normal. "Continuar" na abertura entra com o save (T54) |
| 2026-10-06 | v2.39 | **Decisões do usuário:** (1) salvar **a cada decisão**, não a cada temporada (o save já é criação + semente + ritmo + escolhas); (2) com carreira salva, "Nova carreira" **pergunta antes** de apagar; (3) no Rápido, o momento-chave da temporada é o evento de **maior peso** (peso por evento nos dados, T53); (4) abertura no computador: **borda da arte suavizada** em degradê para o marinho | Tarefas: T54 (save) e T53 (decisões por ritmo); ajuste da abertura nesta versão |
| 2026-10-06 | T54 | **Salvar e continuar:** `src/state/save.ts` grava no aparelho (localStorage, chave `10efaixa:carreira`) criação, semente, ritmo e escolhas, com versão do formato e tabela de migrações; salva ao começar e a cada decisão e apaga quando a carreira termina. Abertura com "Continuar a carreira de [nome]" e confirmação antes de apagar; save danificado, de outra versão ou com escolha que o motor recusa leva a "Não deu para abrir a carreira salva". Armazenamento indisponível nunca trava. Medido no Chromium: recarregando a página o jogo volta na mesma decisão; 0 violações do axe | Nada sai do aparelho (sem servidor, analytics nem URL) |
| 2026-10-06 | T53 | **Importância dos eventos aprovada pelo usuário.** **Decisões por ritmo:** `flow.json` `decisoesPorTemporada` (Rápido 1, Normal 3, Completo todas) e `importancia` (1–10) em cada evento de `events.json` (Copa, dupla nacionalidade e sonho 10; lesão grave 9; propostas 8; renovação 7 … festa 3). No primeiro evento de cada temporada a temporada é simulada à frente com as escolhas automáticas; os mais importantes vão para a tela e o temperamento decide o resto (`src/state/careerRun.ts`, seleção em cache). Save sobe para a versão 2 (v1 migra para Completo, que mantém a regra antiga). Medido em 5 carreiras: Rápido ~15 decisões (0,9 por temporada), Normal ~38 (2,1), Completo ~51 (2,9); abrir cada decisão até ~100 ms (p95) | **Falta:** o Completo pede pelo menos 6 por temporada, mas o motor gera só ~3 eventos por temporada; depende de ampliar o catálogo (T25b). Reunião anual no Normal e automática no Rápido entram com a T52. O E2E cronometrado das durações fica para quando houver jogadores de teste |
| 2026-10-06 | v2.40 | **Reunião com a comissão (decisões do usuário):** Rápido só automática, sem botão; Normal 1 por temporada (meio do ano); Completo as 2; a tela abre com a sugestão do preparador | Tarefa T52 |
| 2026-10-06 | T52 | **Reunião com a comissão na tela:** a reunião vira decisão da carreira (`reuniao`, escolha "principal\|secundário", gravada no save); `flow.json` `reunioesNaTela` (Rápido nenhuma, Normal o 2º semestre, Completo os 2); só com clube. Tela com os 12 focos (10 atributos, bola parada, perna ruim), aberta com a sugestão do preparador, principal e secundário nunca iguais; resposta da comissão (aceita, contrapropõe ou recusa com o motivo) por cima da tela seguinte, achada no histórico de reuniões da carreira. A simulação automática não muda (mesma carreira com a sugestão). Medido no Chromium: 0 violações do axe; sem rolagem em 390×844 | Ao recarregar a página logo depois de propor, a resposta daquela reunião não reaparece (não vai para o save) |
| 2026-10-06 | v2.41 | **Decisões do usuário (T51b):** frases de evolução numa linha "Neste semestre: …" no alto da faixa de baixo da decisão; faixa de idolatria "Conhecido" no lugar de "Titular"; idolatria como selo "Torcida: …" no topo e por clube na trajetória | Tarefa T51b |
| 2026-10-06 | T51b | **Retorno da evolução e idolatria em palavras:** `semesterFeedback` (até 2 atributos que mais mudaram no semestre; limiares em `feedback.json` calibrados em 1.508 semestres: muda a partir de 2, bastante +5/−4) e `idolBand` (faixas em `idolatry.json`, com "Conhecido"). A visão da decisão traz o último semestre e a idolatria por clube. Na tela: "Neste semestre: Seu passe melhorou bastante." só na primeira decisão depois do semestre; selo "Torcida: …" no topo e coluna "Torcida" na trajetória. Medido no Chromium: 0 de 25 eventos rolam em 390×844 e 430×932 no pior caso (2 frases + selo extra) | A idolatria nos textos dos eventos ("faixas … nos eventos") fica para a revisão de narrativa do catálogo (T25b) |
| 2026-10-06 | v2.42 | **Decisões do usuário (T55):** cartão desenhado em Canvas 2D e exportado em PNG; versão narrativa abre primeiro; avatar com a camisa do clube do auge; frases de "Sua história" montadas do resultado da carreira enquanto a memória (T25d) não existe; **código da carreira** curto (assinatura) no cartão, com os dados completos no link da T56 (um código que refaz a carreira passaria de 60 caracteres); **10 honrarias** escritas com a skill de narrativa e aprovadas: Fiel até o último contrato, Jogou em tudo menos de gandula, Fechou o gol e jogou a chave fora, Taça só a do churrasco de fim de ano, Mais tempo no DM que na concentração, Balançou mais rede que pescador, Garçom de mão cheia, O juiz já sabia o caminho do bolso, Rodou mais que mala de rodoviária, Jogou até a chuteira pedir aposentadoria | O sonho da carreira (T50f) ainda não existe; o cartão narrativo sai sem "sonho realizado" até lá |
| 2026-10-06 | T55a | **Dados do cartão:** honrarias em `honors.json` (critérios sobre os fatos do legado + lesões graves, vermelhos, mudanças de posição, idade final e títulos), da mais rara para a mais comum, no máximo 3 no cartão; cortes calibrados em 400 carreiras simuladas (2% a 12,8% cada; 52,5% sem nenhuma). O resultado da carreira guarda `peakAttributes`, `peakClubId` e `honors`. `careerCode` (FNV-1a, 40 bits, base32 Crockford) | "Fiel até o último contrato" dá 0% na decisão automática (ela sempre troca de clube); só sai com escolhas reais |
| 2026-10-06 | T55b | **"Sua história":** `storyOf` monta as frases do resultado da carreira (início pela origem, primeira taça, ida para a Europa ou o exterior, auge, melhor do mundo, Seleção, Mundial campeão ou herói, ídolo por clube, lesões graves e a despedida, que sempre fecha), em ordem de idade; pesos em `story.json`; `storyHighlights` escolhe as 4 de maior peso para o cartão narrativo. Textos em `legacy.historia`, com singular para n = 1. Tela "Sua história" (lista ordenada, papel e tinta) antes do resumo do fim, com "Ver meu cartão" | Sem a memória da T25d, frases como "Recusado em duas peneiras" ou "Recusou a Europa aos 24" ainda não existem |
| 2026-10-06 | T55c | **Modelo do cartão:** `cardModel(result, codigo)` em `src/share/` reúne em texto pt-BR o que as duas versões desenham: nome, apelido, número usado no clube do auge, posição, Over máximo, veredito e rótulo principal, manchete e comentário, até 3 honrarias, as 4 frases de destaque, clubes em ordem, jogos/gols/assistências/títulos/patrimônio, radar dos 10 atributos do pico em número e o código; mais o texto alternativo de cada versão (`ui.cartao.*`). `storyText` foi para `storyText.ts`, usado pela tela e pelo cartão | Desenho em Canvas fica na T55d |
| 2026-10-06 | T55d | **Cartão 1080×1350 em Canvas 2D** (`src/share/drawCard.ts`): faixa com as cores dos clubes da carreira; retrato do visual com moldura no metal da faixa do Over e a camisa do clube do auge pintada pela máscara (`destination-in` + `multiply`, MDN); número gigante na cor do clube; Over máximo, clube, posição e até 3 honrarias; nome, apelido; faixa amarela com veredito e rótulo; **narrativa:** manchete e as 4 frases (uma linha cada, fonte reduz até caber); **estatística:** jogos, gols, assistências, títulos, patrimônio e o radar dos 10 atributos do pico com os números; rodapé com o código. Tela "Seu cartão" no lugar do resumo provisório do fim (`CareerEnd`, da T51, removido: tudo o que mostrava está no cartão), com a troca História/Números (`aria-pressed`) e o texto alternativo da versão à vista no canvas. Medido no Chromium: 4 carreiras nas duas versões; 0 violações do axe; sem rolagem em 390×844 | O download e o compartilhamento da imagem ficam na T56; clubes fora da Série A saem com camisa lisa nas cores do clube (decisão da v2.37) |
| 2026-10-06 | T55d (visual) | **Cartão no padrão "Álbum com vidro" (v2.34)**, pedido do usuário ao ver a primeira versão (que seguia a descrição antiga, com faixa amarela e papel liso): a **figurinha grande do álbum** (moldura com a textura de metal da faixa, `cartoes-over`; foto com as faixas do clube; retrato no enquadramento do álbum; Over na pastilha; emblema do clube; nome e número na tarja) sobre o fundo nas cores do clube do auge escurecidas; **painel de vidro** com o veredito num **selo amarelo**, rótulo, "apelido · posição · clube" e, na narrativa, manchete, as 4 frases e as honrarias em pílulas; na estatística, os 5 números em linha e o radar. `emblemArt` separado do `Emblema` para o canvas usar a mesma arte. Medido no Chromium: 4 carreiras, 0 violações do axe | A faixa amarela da descrição original da 6.15 virou o selo do veredito |
| 2026-10-06 | ⛳ T55 | **Cartão final aprovado pelo usuário** no padrão "Álbum com vidro" (capturas: narrativa e estatística, Flamengo e Internacional) | Próxima: T56 |
| 2026-10-06 | v2.43 | **Decisões do usuário (T56):** compartilha a **versão do cartão que está na tela**; o texto pronto leva **nome e apelido** (quem compartilha é a própria pessoa); o **link com os dados da carreira fica para a T57** (desafio diário), junto com a tela de rever carreira — o `CLAUDE.md` proíbe dado pessoal em URL e um link agora não levaria a lugar nenhum | A linha da T56 na seção 14 continua: nativo, download e texto |
| 2026-10-06 | T56 | **Compartilhar o cartão** (`src/share/share.ts`): a imagem PNG fica pronta logo depois do desenho (o `navigator.share` exige o toque do usuário, MDN); com `canShare({ files })`, compartilhamento nativo com imagem e texto; cancelar (AbortError) não é erro; sem suporte ou bloqueado, baixa a imagem. Arquivo `10efaixa-<código>.png` (sem o nome digitado). "Copiar texto" para o WhatsApp pela área de transferência. Aviso em `role="status"`. Medido no Chromium: o download entrega PNG 1080×1350; 0 violações do axe; o botão "Compartilhar" só aparece onde há `canShare` | O compartilhamento nativo não pôde ser testado neste ambiente (Chromium sem Web Share); conferir no celular |
| 2026-10-06 | v2.44 | **Decisão do usuário: publicar para teste agora**, antecipando parte da T61: o repositório é importado na Vercel pelo usuário, com o acesso **protegido** (os nomes e cores de clubes reais só podem ir a público depois da revisão jurídica); o trabalho entra na `main` por pull request. Nada de analytics, Sentry, domínio ou PWA ainda (T59/T61) | O lançamento continua dependendo da arte final validada (T60) e da revisão jurídica |
| 2026-10-06 | T61 (parcial) | **Ícone e instalação como app** (pedido do usuário antes do link de teste): arte "10 + faixa de capitão" (escolhida pelo usuário), desenhada em formas (sem fonte), papel sobre marinho com a faixa amarela e o "C"; `docs/arte/icone/icone.mjs` gera `public/icon.svg`, `favicon-32.png`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` e `icon-maskable-512.png` (conteúdo em 80%, zona segura). `manifest.webmanifest` com nome, `start_url`, `display: standalone` e os ícones (requisitos de instalação conferidos na MDN, "Making PWAs installable": sem service worker obrigatório). Medido no Chromium: manifesto e ícones carregam (200), nenhum erro de instalabilidade além do modo anônimo do teste | Funcionar offline (service worker) continua na T61 |
| 2026-10-06 | T61 (parcial) | **Ícone nas cores da Seleção** (pedido do usuário): fundo amarelo, "10" azul, faixa de capitão verde com contorno e "C" brancos; tons de `kits.json` (`selecoes.brasil`), só cores, sem escudo ou marca da CBF. Fundo da tela de abertura do app (`background_color`) em amarelo | — |
| 2026-10-06 | T54 (correção) | **Bug do save achado no teste da versão de produção** (jornada completa no Chromium antes do link de teste): "Continuar a carreira" depois de recarregar dava "Não deu para abrir a carreira salva" nos ritmos Rápido e Normal. Causa: `validateSave` refazia a carreira sem o ritmo salvo e caía no padrão (Completo), com outra sequência de decisões. Correção: refaz no ritmo do save. Teste de regressão com 8 escolhas reais em cada ritmo (o teste antigo validava só um save sem escolhas) | Jornada de produção passou inteira: criação, Rápido, recarregar e continuar, cartão, download, nova carreira, sem erro no console |
| 2026-10-06 | v2.45 / T60a | **Cenas pintadas na decisão** (o usuário testou o link e apontou que a criação e a decisão não seguiam a referência de layout da v2.12, `docs/referencias/estilo-layout-2026-10-01.webp`: cena pintada ao fundo, painéis por cima). As 126 cenas já geradas e aprovadas (21 cenários × 6 cortes) passam a ser usadas: `docs/arte/processar_cenas.py` reduz para 1080 px (WebP), troca a camisa magenta e o calção ciano por cinza com a mesma luz e grava as máscaras, e mede o número nas costas só quando o protagonista está de uniforme (calção ciano logo abaixo da camisa; vestiário fica fora, ele está sem camisa). No jogo, `CenaPintada` monta a pintura em camadas: camisa no padrão e nas cores do clube (ou da seleção na Copa), calção e o número do jogador na cor de maior contraste (detalhe do clube, branco ou marinho). O corte da cena segue o cabelo do visual (`cortes.json`). Os 25 eventos usam 14 cenários, todos gerados. A cena de amostra da T49 saiu | O tom de pele das cenas ainda não acompanha o visual; a criação ganha as cenas na próxima etapa (decisão do usuário: decisão primeiro); 12 cenários sem imagem usam o mais próximo quando entrarem eventos para eles |
| 2026-10-06 | T60b | **Cenas pintadas na criação** (referência de layout da v2.12): cada passo tem a cena ao fundo (`cenasCriacao.json`: "Quem é ele?" e "Seu visual" no vestiário, "Em campo" no treino; no tipo de início, a cena da origem marcada: base → treino, peneira, várzea), no corte de cabelo do visual e com o uniforme neutro (ainda não há clube); a cena é decorativa (fora do leitor de tela). O passo vai num painel de vidro encostado no pé da tela: passo curto mostra a cena em cima, passo longo ocupa a tela sem forçar rolagem. Medido no Chromium: os 4 passos em 390×844 sem rolagem; 0 violações do axe | O tom de pele das cenas ainda não acompanha o visual |
| 2026-10-06 | v2.46 | **Decisões do usuário (revisão do visual com a referência no Lovable):** (1) **visual mesclado no jogo inteiro**: fundo menta claro, cartões brancos arredondados com sombra suave, verde `#006731`, dourado `#DA942C` para destaque, fontes **Oswald** (títulos) e **Inter** (texto), mantendo as cenas pintadas, a figurinha com moldura e as faixas de atributo (sem números antes do cartão final); (2) **escolhas sem deslizar**: as pílulas quebram linha, tudo à vista; (3) **campo da criação maior, em pé, com camisas**: goleiro, zagueiro, lateral esquerdo e direito, volante, meia, ponta esquerda e direita, atacante; a marcada fica dourada com o número do jogador; (4) **nova posição Ponta**: pesos drible 24, velocidade 24, finalização 14, habilidade 12, passe 10, físico 6, mental 5, força 2, marcação 2, jogo aéreo 1; estilos Arrancador e Mágico passam a valer para ponta, mais Ponta driblador (Arrancada) e Ponta invertido (Ambidestro); altura 160–185 cm; números com menos gols e mais assistências que o atacante; vagas próprias na Seleção; de ponta para meia a partir dos 31; (5) **lado** (esquerdo/direito) do lateral e da ponta: só figurinha e narrativa, nunca atributo; saves antigos sem lado valem como direito | Rebalancear com `npm run sim:legado` depois da ponta |
| 2026-10-06 | v2.46 (ponta) | **Ponta no motor:** 7ª posição em `POSITIONS`; pesos, altura 160–185, números por jogo (0,26 gol, 0,22 assistência), referências do legado (260 gols, 220 assistências), visibilidade na Seleção (−0,2) e camisa 10 possível, mudança ponta → meia aos 31; Arrancador e Mágico também de ponta; Ponta driblador (Arrancada, inspiração Garrincha) e Ponta invertido (Ambidestro, inspiração Jairzinho). Simulação de legado com 400 carreiras por célula: "Lenda" ou mais por posição 4,1–7,4% (✅ comparável), ponta com nota média 31,3, entre meia (29,6) e atacante (31,8) | Simulações e carreiras sorteadas mudam (o sorteio de posição tem 7 opções agora) |
| 2026-10-06 | v2.46 (campo) | **Lado, campo com camisas e escolhas sem deslizar:** `side` (esquerdo/direito) na entrada da carreira só para lateral e ponta (opcional: saves antigos seguem válidos; sem lado vale direito); a tela "em campo" tem 9 vagas (`FIELD_SLOTS`) num campo em pé, maior, com camisas brancas e a marcada dourada com o número do jogador; o leitor de tela ouve a vaga por extenso ("Ponta esquerda"). As pílulas quebram linha com o rótulo em cima (antes deslizavam para o passo caber sem rolar; agora o passo pode rolar). Medido no Chromium: 0 violações do axe | O lado ainda não aparece na figurinha nem nos textos dos eventos |
| 2026-10-06 | v2.46 (visual) | **Visual mesclado aplicado:** tokens do tema claro (fundo menta `#E8F6EC`, superfície branca, tinta `#091A11`, gramado `#006731`, borda `#6E8A79` para manter 3:1 nos campos), paleta com ouro, menta, tinta e gramado; fontes Oswald e Inter (Fontsource 5.3.0, OFL-1.1; saem Big Shoulders e Atkinson); raio 14px/22px e sombra suave; títulos em caixa alta, rótulos verdes espaçados, botão principal com sombra verde; o campo usa as cores dos tokens. Contraste conferido por teste em todos os pares; medido no Chromium: 0 violações do axe na criação, no campo, na revelação e na decisão | O tema escuro e o cartão final em canvas ainda usam as cores antigas onde não leem os tokens novos; revisar no próximo passo |
| 2026-10-06 | v2.47 | **Decisões do usuário (pesquisa no copero.com.ar, `docs/referencias/copero-com-ar-observacoes.md`):** (1) **números que rolam** do valor anterior ao novo na ficha da decisão (overall, idade e valor de mercado, ~0,7 s); o leitor de tela recebe só o valor final; (2) **transições de 300 ms**: a decisão nova entra com fade e leve subida, a opção escolhida realça e as outras apagam; (3) **carimbo de momento** (~1,5 s) quando, desde a decisão anterior, o jogador ganhou título, subiu ou caiu de divisão no mesmo clube (Séries A–D); o título ganha brilho e partículas curtos; o momento fica anunciado ao leitor de tela; (4) **aviso legal discreto** na abertura: nomes de clubes só para identificação, sem vínculo nem escudos oficiais. **Logos reais continuam proibidas** (Lei 9.615/98, art. 87; Lei 9.279/96): o aviso não autoriza uso de símbolo. Tempos em `src/data/motion.json`. Tudo respeita `prefers-reduced-motion` (sem rolar, sem partícula; o carimbo aparece sem animação) | Convocação fica de fora do carimbo por ora (o evento da Seleção já marca o momento); 2ª divisão europeia não entra no carimbo (a temporada registra só a liga) |
| 2026-10-06 | v2.48 | **Decisões do usuário (revisão dos estilos depois da Ponta):** 3 estilos por posição, cada um de uma posição só (tabela 6.2). Novos: Ousado (ponta, Neymar), Ponta artilheiro (Rivellino), Ponta trabalhador (Jairzinho: ajuda, apoia, volta para marcar e faz seus gols), Enganche (meia, Kaká), Zagueiro de cobertura (Aldair), Goleiro seguro (Dida). "10 clássico" passa a se chamar **Maestro**; o **Mágico** passa a ser só de meia, inspiração Ronaldinho; o Lateral construtor passa a ter inspiração Júnior. Saem: Pegador de pênalti, Ponta driblador, Ponta invertido; o Arrancador e o Mágico saem da ponta, o Mágico sai do ataque, Regente e Motorzinho saem do meio. **Saves antigos são convertidos** (save v3) para o estilo mais parecido da mesma posição: Pegador de pênalti → Goleiro seguro; Ponta driblador e Mágico na ponta → Ousado; Ponta invertido → Ponta trabalhador; Arrancador na ponta → Ponta artilheiro; Mágico no ataque → Arrancador; Regente e Motorzinho no meio → Maestro. **Equilíbrio:** a simulação de 6 mil carreiras mostrava "Lenda" de 0,4% (Motorzinho no meio) a 23,5% (Mágico no meio); a distribuição de cada estilo é recalibrada para que, em cada posição, o menor fique com pelo menos metade do maior | Como toda recalibração, uma carreira salva pode seguir outro rumo ao ser refeita; se uma escolha salva não couber mais, o jogo mostra o aviso de save inválido (6.16) |
| 2026-10-06 | v2.48 (equilíbrio) | **Medição corrigida:** o desequilíbrio de 0,4% a 23,5% vinha do método (a mesma semente sorteava o estilo e conduzia a carreira, ligando o estilo à sorte da carreira; no jogo o jogador escolhe). Com os 3 estilos de cada posição jogando as mesmas carreiras (`npm run sim:estilos`, 400 por estilo, `docs/simulacao-estilos.md`), "Lenda" ou mais fica entre 4,3% e 7,0% e todas as posições passam no critério (menor ≥ metade do maior). Nenhum número de estilo precisou mudar | O relatório de legado (9.3) usa o mesmo método; correção sugerida como tarefa à parte |
| 2026-10-07 | v2.49 | **Decisões do usuário (T57):** desafio só com a semente do dia (cada um cria o próprio jogador); link da carreira com semente, criação e escolhas **sem nome nem apelido**, no fragmento da URL; mini-spec em `docs/proposta-T57.md` aprovado com "DE ACORDO" | Tarefas T57a a T57e; não há ⛳ no meio |
| 2026-10-07 | T57 (concluída) | **Desafio do dia e link entregues (T57a–e):** `dailySeed`/`dayKeyBR` (`src/engine/daily.ts`); codec `src/share/careerLink.ts` (fragmento `#c=`, sem nome nem apelido, leitura estrita; leva também o código do cartão original e o dia do desafio, porque o código depende do nome e não dá para refazer); `reviewLink` confere as escolhas com o motor (carreira inteira, sem falta nem sobra); `desafio` opcional no save (sem mudar a versão); botão "Desafio do dia" na abertura; selo "Desafio de DD/MM" e "Copiar link" na tela do cartão. Carreira Completa real ≈ 2,4 mil caracteres de link | Fora desta entrega: selo desenhado no PNG do cartão; apelido ao rever vem do nome genérico, não do original |
| 2026-10-07 | v2.50 | **Decisões do usuário (propostas de clube, SPEC 6.12):** a troca de time era automática (`chooseOffer`, T28) e a tela prometida nunca existiu; passa a aparecer **sempre que houver oferta no período das janelas**, com até 3 propostas e "Ficar"; na v1 só **aceitar e ficar** (empresário negocia e forçar saída ficam para a T28e); entra **antes da T58**; no modo automático (simulações) o resultado e o equilíbrio não mudam. Mini-spec em `docs/proposta-tela-de-propostas.md`, aprovado com "DE ACORDO" | Tarefas T28b a T28f |
| 2026-10-07 | v2.51 | **Decisões do usuário (linha do tempo):** trocar "Sua história" por lista vertical por idade com clube e divisão, Over e títulos; frases saem da tela e ficam no cartão; **exceção do Over em número estendida a essa tela** (os 10 atributos seguem sem número); campo `age` em `result.seasons`. Aprovado com "DE ACORDO" | Tarefas T55f a T55i; a ordem com as propostas é decidida em seguida |
| 2026-10-07 | T55f–h (entregues) | **Linha do tempo "Sua carreira":** `age` em `result.seasons` (idade = `evo.age − 1` ao registrar a temporada; a última é `endAge − 1`); `timelineOf` (`src/engine/timeline.ts`: linha por temporada, auge = primeira temporada de maior Over, troca de clube marcada, títulos do ano); tela `LinhaDoTempo` no lugar de `Historia` (idade, clube com emblema, divisão, Over em número, títulos; divisão desconhecida cai em "Outra liga"; conferida em 390×844). `storyOf`/`storyText` ficam, pois alimentam o cartão narrativo | Nome da divisão `SAM` é "Outra liga do continente" ("sul-americana" bate com a marca da copa no guarda de nomes) |
| 2026-10-07 | T28b–d (entregues) | **Tela de propostas de clube:** `rankOffers` (até 3 propostas pela pontuação do temperamento, `chooseOffer` virou a primeira da lista); decisão `proposta-clube` no motor (escolha `aceitar:<clube>` ou `ficar`, conferida contra o que foi mostrado; `ficar` só com clube atual); no automático a sugestão é a escolha de antes, então simulações e equilíbrio não mudam; faixas de minutos e nível do clube em `minutes.json` (sem número na tela); tela `Propostas` (WCAG: foco no título, botão com o nome do clube, emblema decorativo) e chave `propostasNaTela` em `flow.json` ligada nos três ritmos. **A proposta não conta no limite de decisões por temporada** (Rápido pode ter 1 decisão + a proposta). Qualidade da comissão não vira linha própria: acompanha o nível do clube | Propostas do clube de coração e do rival continuam resolvidas pelo temperamento (não aparecem na tela); empresário negocia e forçar saída ficam para a T28e |
| 2026-10-07 | v2.52 | **Decisão do usuário: "faça todas as decisões e histórias primeiro e depois vamos validar".** As paradas ⛳ por lote de ~15 eventos (T25b e a de ~20 marcos da T25c) **ficam dispensadas**: o usuário valida o catálogo inteiro de uma vez no fim (página de leitura com todos os eventos e a simulação pareada T28f). Continuam valendo os testes de cada etapa (nenhuma opção domina outra, nenhuma frase faltando, equilíbrio). Alcance: T28e (propostas completas), T25c (marcos), T25d (memória), T25e (eventos modulares) e T25b (80+ eventos), nessa ordem de dependência; um PR por etapa grande, com CI verde | O que o usuário não aprovou por lote fica marcado "a validar" em `docs/validacao-final.md` |
| 2026-10-07 | T28e (desenho) | **Propostas completas, decididas por mim dentro do mini-spec aprovado:** (1) propostas do **clube de coração** e do **rival** passam a aparecer na tela, com a marca da proposta; coração tem "Aceitar" (salário ×0,85) e "Aceitar por amor" (×0,70 e mais idolatria), os valores já em `events.json`; (2) **empresário negocia** uma proposta: pode melhorar o salário, ficar igual ou sumir (sem clube atual a proposta não some); usa o perfil do empresário (`negotiate`); (3) **forçar saída** (só com contrato por mais de um ano): sai já, mas paga multa de 6 meses de salário, perde 30 de idolatria no clube que deixa, moral e relação com o técnico, e há 35% de risco de virar vilão da torcida; números já planejados em `market.json` (`forcarSaida`). A escolha automática continua a mesma (simulações e equilíbrio não mudam) | Se algum número ou regra desagradar, ajusta-se na validação final |
| 2026-10-07 | v2.53 | **Decisão do usuário (reunião com a comissão em 3 ideias, `docs/proposta-reuniao-3-ideias.md`, "De acordo"):** a seleção livre de 12 focos dá lugar a **3 cartões** calculados pelo motor — (1) **óbvia**: a proposta do preparador pela posição (`autoProposal`), **sem rótulo e sem dica de confiança**; (2) **mescla**: principal óbvio + o **diferencial do jogador** (atributo forte que a posição pede menos); (3) **ousada**: os **dois atributos mais fortes** do jogador, que pode ou não agradar. Dicas de agrado em palavras (nunca percentual). A **necessidade do clube** passa a ser sorteada pelos **pesos da posição** (mesma quantidade de sorteios) e a escolha mexe na **confiança do técnico** (cartão 1 sobe, 2 sobe pouco, 3 cai ou fica neutro; números em `meeting.json`). O motor **recusa proposta fora dos 3 cartões**; a reunião automática (Rápido e semestres sem tela) usa o cartão 1. Card do jogador do topo e diálogo de resposta não mudam | Tarefas T52b–d; medir equilíbrio ao fim de cada etapa; ordem combinada: reunião → tela de contratos (T28g–k, ainda sem aprovação) → marcos e catálogo |
| 2026-10-07 | T52b–d (entregues) | **Reunião em 3 ideias:** `meetingOptions` (`src/engine/meetingOptions.ts`: óbvia = `autoProposal`; mescla = principal óbvio + diferencial do jogador, o mais forte entre os de peso até a mediana da posição; ousada = os dois mais fortes, trocando o segundo se repetir outro cartão; cartões sempre distintos; dica de agrado `muito/possivel/pouco` por `agrado` em `meeting.json`); necessidade do clube sorteada pelos pesos da posição (`drawClubNeed`, um sorteio como antes); confiança do técnico por ideia aceita (`confianca` em `meeting.json`: óbvia +0,01, mescla +0,005, ousada −0,015, contraproposta −0,01); o motor recusa proposta fora dos 3; chave `tresIdeias` ligada; tela `Reuniao` no desenho aprovado (casca da decisão, card do jogador de sempre, 3 cartões `radio`, "Propor ao técnico" só depois de escolher; cartão 1 sem rótulo nem dica). **Equilíbrio medido** (300 carreiras por estilo, pareado): Lenda 5,63% → 5,78%, por estilo 4,3% a 7,0%, dentro da faixa | **Carreiras salvas e links anteriores à v2.53 com reunião na tela não abrem** (a escolha livre deixou de existir); Bola parada e Perna ruim não são mais escolhíveis na reunião |
| 2026-10-07 | v2.54 | **Decisão do usuário (tela de contratos, `docs/proposta-tela-contratos.md`, "De acordo as layouts" e "Siga"):** a tela de propostas vira **cartões selecionáveis + Confirmar escolha**, com renovação como primeiro cartão, salário por mês com % contra o atual, valor projetado (estimativa) e tags de reputação (6 níveis) e papel. O **papel no elenco vira regra do motor por faixa de idade** (8 papéis: até 20 anos Jovem Promessa, Jovem em Rotação, Joia Titular; acima, Composição de Elenco, Reserva Imediato, Disputa de Titularidade, Titular Regular, Titular Absoluto), com minutos e cortes em dados. Perguntas abertas decididas pelo padrão: fazer **antes** dos marcos; bônus só informativos | Tarefas T28g–k; T28g mede o equilíbrio e **para** se sair da faixa de "Lenda" (4,3%–7,0%) |
