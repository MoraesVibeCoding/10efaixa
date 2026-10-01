# 10eFaixa — Especificação do Produto (SPEC.md)

> Versão 2.11 (declínio por idade mais tardio; Marco 4) · Status: **aprovado para implementação**. Todas as decisões de produto e design estão fechadas.
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
- **Divisões inferiores da Europa:** fora; só a 1ª divisão das 6 ligas.
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

### 6.2 Arquétipos (16)

O arquétipo define a **distribuição dos pontos** entre os atributos e **1 traço especial**. O nome é próprio; a descrição cita a lenda que inspira o estilo (regras na seção 11).

| Grupo | Arquétipo | Estilo de | Destaques | Traço |
|---|---|---|---|---|
| Atacante | Matador de área | Romário | Finalização, Mental | Faro de gol |
| Atacante | Arrancador | Ronaldo | Velocidade, Drible, Finalização | Arrancada |
| Atacante | Mágico | Neymar | Habilidade, Drible, Passe | Ambidestro ou Bola parada |
| Atacante | Centroavante de força | Adriano | Força, Finalização (chute potente), jogo aéreo; pouca Velocidade | Bomba |
| Meio | 10 clássico | Zico | Passe, Habilidade, Finalização | Camisa 10 (bola parada) |
| Meio | Regente | Falcão | Passe longo, Mental, Marcação | Dono do meio |
| Meio | Volante raiz | Dunga | Marcação, Força, Físico | Carrinho preciso |
| Meio | Motorzinho | Bruno Guimarães | Agilidade, Passe rápido, Físico | Pulmão |
| Defesa | Xerifão | Lúcio | Força, Marcação, jogo aéreo | Líder de zaga |
| Defesa | Zagueiro técnico | Thiago Silva | Passe, Mental, Marcação | Saída de bola |
| Defesa | Lateral apoiador | Cafu | Velocidade, Físico, Passe | Ala ofensivo |
| Defesa | Lateral foguete | Roberto Carlos | Velocidade, chute forte, bola parada | Canhão |
| Defesa | Lateral construtor | Filipe Luís | Passe, Mental, Marcação; joga por dentro | Lateral por dentro |
| Goleiro | Paredão | Marcos | Reflexo, posicionamento | Milagre |
| Goleiro | Goleiro-líbero | Rogério Ceni | Jogo com os pés, saída do gol | Saída rápida + cobrador latente |
| Goleiro | Pegador de pênalti | Taffarel | Reflexo, Mental | Pegador de pênalti |

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

### 6.5 Reunião com a comissão técnica (meio da temporada do clube)

- O jogador propõe **1 foco principal e 1 secundário** (10 atributos, "Bola parada" ou "Perna ruim").
- **Respostas:** aceita (principal com bônus alto, secundário com bônus menor), contrapropõe (o clube precisa de outra coisa) ou recusa (moral baixa ou relação ruim com o técnico).
- **Custos:** atributos sem foco em manutenção (leve queda com a idade); foco pesado em Físico aumenta risco de lesão.
- **Influências:** relação com o técnico, moral, status de Seleção.
- **Ritmo Rápido:** reunião automática pelo arquétipo, a menos que o jogador abra a tela.

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

**Dados de clubes:** nomes reais, **escudos estilizados** (cores e iniciais). Reputação (1–100) é **dado próprio**, calibrado com referências públicas; bases como a do FM26 são só referência de ordem de grandeza e não devem ser copiadas.

### 6.10 Mundo: Europa (simulação média)

- **Ligas (1ª divisão):** Inglaterra (Premier League, 20), Espanha (LaLiga, 20), Itália (Serie A, 20), Alemanha (Bundesliga, 18), França (Ligue 1, 18), Portugal (Primeira Liga, 18). Conferir na fonte oficial ao montar os dados.
- **Competições:** liga + copa nacional + Champions League e Europa League.
- **Detalhe:** posição final, campanha nas copas e participação do jogador.
- **Rivalidades manuais** para os grandes clássicos das 6 ligas.
- Nomes reais, escudos estilizados.

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

### 6.14 Aposentadoria

A carreira termina no primeiro destes gatilhos:
1. O jogador **decide parar** (a partir dos 30).
2. **Lesão ou queda física** força a aposentadoria.
3. O **overall cai ao nível do overall inicial** da criação (decisão consciente: faz parte da história de cada origem).
4. **40 anos** (limite absoluto).

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

**Rótulos (1 principal no cartão, raridade comum → lendária):** Ídolo de um clube só, Rodado (6+ clubes), Rei do estadual, Carrasco de clássico, Torcedor que virou ídolo, Diamante da várzea, Oriundo campeão, Goleiro artilheiro, Craque esquecido, Ganhou muito e gastou tudo, Aposentadoria tranquila, Herói da Copa, Vilão da Copa e o mais raro: **10eFaixa**.

**Tom:** manchete **séria** + comentário com **zoeira**, sempre mirando o próprio jogador, nunca clubes, torcidas ou pessoas reais.
> Exemplo: **"Do terrão de Madureira à faixa de capitão no Maracanã"** — *Perna ruim? Nunca vimos. Folga? Também não.*

**Cartão (1080×1350):** o **avatar do jogador no auge** com a camisa e o número gigante, nome e apelido; faixa amarela com veredito e rótulo; clubes com cores estilizadas; jogos, gols, assistências, títulos e patrimônio; radar dos 10 atributos com os números do **pico** revelados; **código da carreira**; texto alternativo.

**Compartilhamento:** compartilhamento nativo do celular com a imagem (verificar suporte na documentação oficial, com fallback), texto pronto para WhatsApp, download como alternativa.

**Desafio diário:** todos jogam com a **mesma semente do dia**; comparação pelo cartão e pelo código. **Sem ranking online na v1.**

### 6.16 Ritmos e save

| Ritmo | Duração alvo | Decisões |
|---|---|---|
| Rápido | ~5 min | Só momentos-chave; reunião automática |
| Normal | ~15 min | Momentos-chave + reunião anual |
| Completo | livre | Todas as reuniões e dilemas |

- **Salvamento automático a cada temporada**, com versão do schema e migração. Uma carreira ativa por vez.
- Save corrompido ou incompatível: mensagem clara e opção de recomeçar, sem travar o jogo.

---

### 6.17 Módulo "Quem é você" (aparência, biotipo, identidade e cenas)

**Regra de ouro:** tom de pele, cabelo, barba e acessórios são **só visuais** e **nunca** alteram atributos ou eventos. Só o **biotipo** (altura e compleição) afeta o jogo.

**Aparência (só visual)**
- ~10 tons de pele; 8 tipos de cabelo (raspado, curto, cacheado, crespo, black power, dread, moicano, longo) com cores; barbas; acessórios (faixa de cabelo, cor da chuteira).
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
- Formato **SVG**, com orçamento de peso por cena definido na T43 e carregamento sob demanda.

**Produção da arte**
- **Ilustrador humano** faz a arte final no modelo **boneco-base**: ~10 poses, 3 ângulos de cabeça (frente, perfil, três quartos); cabelos, barbas e acessórios como peças separadas por ângulo; camadas nomeadas.
- **Recolor por código:** tom de pele e cores do uniforme são aplicados pelo código; o artista desenha cada peça uma vez.
- **Altura e compleição** por ajuste de proporção do boneco, sem desenhos extras.
- **Skill do projeto no Claude Code** (`.claude/skills/10efaixa-arte/SKILL.md`) com três funções: gerar **arte provisória** em SVG no formato final de camadas; manter o **briefing de arte** (`docs/briefing-arte.md`) atualizado; **conferir cada entrega** do ilustrador (camadas, nomes, tamanho, cores recoloríveis) com script automático.
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
| Cal de campo | `#F2F4EF` | Fundo |
| Marinho de vestiário | `#14213D` | Texto e base escura |
| Amarelo braçadeira | `#FFC21A` | Único destaque |
| Verde gramado | `#1E7B4F` | Só evolução positiva |
| Vermelho cartão | `#D62839` | Só lesão, queda e alerta |
| Cinza de linha | `#C9CFC6` | Divisores |

- **Tipografia:** Big Shoulders Display (números e títulos) + Atkinson Hyperlegible (texto). Confirmar licença no Google Fonts; sempre com fallback.
- **Layout:** mobile-first, uma decisão por tela, alinhado à esquerda; botões dizem o que acontece ("Aceitar proposta", "Ficar no clube").
- **Ilustrações:** cenas e avatar seguem a paleta do jogo, com as cores do clube aplicadas nos uniformes (6.17).
- **Movimento:** um único momento animado (o número "carimbando" na abertura); respeitar `prefers-reduced-motion`.
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
- Nenhum número de atributo aparece antes do cartão final.
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

- **Clubes:** nomes reais, **escudos estilizados**. Escudos oficiais só com licença ou parceria.
- **Lendas nos arquétipos:** só texto descritivo ("estilo de jogo como o de Romário"), sem foto, rosto, caricatura ou sugestão de apoio; tom respeitoso. Campo `inspiracao`, controlado pela flag `inspiracaoLendas`.
- **Atletas da carreira:** todos fictícios.
- **Nome do jogador:** filtro de palavras bloqueadas, incluindo nomes de pessoas reais conhecidas.
- **Seleção e prêmios:** sem escudo da CBF; prêmios com nomes descritivos, nunca marcas registradas.
- **Avatares e cenas:** arte original; nenhum rosto, visual característico ou comemoração marca registrada de pessoa real.
- **Ilustrador:** contrato por escrito com **cessão dos direitos patrimoniais** para uso comercial, incluindo a Fase 2.
- **Transfermarkt:** apenas consulta manual como referência, respeitando os termos de uso.
- **Aviso fixo:** projeto independente, sem afiliação com clubes, ligas, federações ou atletas.
- **Apoio:** Apoia.se, seguindo as regras da plataforma e obrigações fiscais aplicáveis.

---

## 12. Fases

| Fase | Conteúdo | Receita |
|---|---|---|
| **1 (este SPEC)** | Jogo completo da v1, lançado só com a arte final do ilustrador | Botão discreto "Apoie o projeto" (Apoia.se) na tela de resultado |
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
| T26 | Empresário | 3 perfis; eventos; troca com custo |
| T27 | Contratos, bicho, multa e renovação | Moedas corretas; patrimônio em R$; € 1 = R$ 6,00 configurável |
| T28 | Valor de mercado, salários, propostas e janelas | Faixas com fonte e data; salário como % do valor |
| T29 | Dados das 6 ligas europeias + rivais | Número de clubes conferido na fonte oficial |
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

### Marco 5 — Avatar, cenas e arte
| ID | Tarefa | Critério de aceitação |
|---|---|---|
| T42 | Skill de arte do projeto + briefing do ilustrador | `.claude/skills/10efaixa-arte/SKILL.md` e `docs/briefing-arte.md` com boneco-base, poses, ângulos, camadas, paleta e lista de peças ⛳ |
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
| T50 | Telas de criação (aparência, biotipo, temperamento, comemoração, filtro) | Operáveis por teclado e leitor de tela; faixa de altura por posição |
| T51 | Tela de semestre/temporada e decisões com cena | Uma decisão por tela; cena ao fundo; só faixas e estrelas |
| T52 | Tela da reunião com a comissão | Foco principal e secundário; resposta exibida |
| T53 | Ritmos Rápido, Normal e Completo | Durações dentro das metas em E2E cronometrado |
| T54 | Save e load versionados | Invariante de save da 9.2 |
| T55 | Geração do cartão 1080×1350 | Avatar no auge, radar de 10 atributos, elementos da 6.15, texto alternativo ⛳ |
| T56 | Compartilhamento com fallback | Nativo quando suportado; download; texto para WhatsApp |
| T57 | Desafio diário | Mesma semente do dia; sem ranking online |
| T58 | Apoio (Apoia.se), aviso legal e página de privacidade | Botão só na tela de resultado |
| T59 | Vercel Web Analytics + Sentry sem dados pessoais | Eventos do funil; nenhum dado pessoal |
| T60 | Integração da arte final do ilustrador | Todas as peças finais passam no validador; nenhuma peça provisória restante ⛳ |
| T61 | PWA, deploy na Vercel, domínio e E2E finais | Instalável; CI verde; 10efaixa.com; E2E das jornadas principais ⛳ |

---

## 15. Pontos de revisão humana (⛳)

O Claude Code **para e pede aprovação** nestes momentos:

| Momento | O que apresentar |
|---|---|
| Após T13 | Relatório das 10 mil carreiras: overall, tetos, diamantes brutos, efeito da altura |
| Após T40 | Distribuição de vereditos, rótulos e idade média de aposentadoria por origem |
| Após T41 | Amostra de manchetes, comentários e apelidos para revisão de tom |
| Após T42 | Briefing de arte para enviar ao ilustrador |
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
| 2026-10-01 | Escopo | **Mentalidade** (aprovada pelo usuário, opção A): 4º campo da criação, opcional no motor — Fominha · Capitão · Professor · Máquina. Muda o caminho até o teto (multiplicador de crescimento por atributo, ruído e perda por idade), nunca o teto. Números em `src/data/mentality.json` (±15%) | Pendente: efeitos em lesões/polêmicas/atrito (Máquina e Fominha), mudança ao longo da carreira, tela na T50 e calibração na T13. Simulação de 50 carreiras em docs/simulacao-mentalidade.md |
| 2026-09-30 | T14 | Sedes reais conferidas: Copa 2026 (EUA, Canadá, México), 2030 (Marrocos, Portugal, Espanha + centenário), 2034 (Arábia Saudita) — FIFA; Olimpíadas 2028 LA, 2032 Brisbane — COI. Demais sedes sorteadas por semente | Fontes e data em src/data/calendar.json |
| 2026-09-30 | T14 | **Não verificado:** a CONMEBOL não anunciou a próxima Copa América masculina; ciclo assumido a cada 4 anos a partir de 2028 ("entre as Copas", 6.11). Sedes futuras repetem as 5 últimas reais em ordem (2015 Chile, 2016 EUA, 2019 Brasil, 2021 Brasil, 2024 EUA), decisão do usuário. Janelas de transferência modeladas por momento do semestre; datas exatas a conferir na T28 | Marcado `verificado: false` no JSON; revisar quando houver anúncio oficial |
