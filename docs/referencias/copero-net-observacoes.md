# copero.net — duas carreiras completas (Normal × Futebol é vida)

Jogado em 2026-10-02 em https://copero.net/pt, celular (390 × 844), com navegador automatizado. Mesmo perfil nas duas: meia-atacante brasileiro, camisa 10, base no Fluminense, da criação à aposentadoria (16 a 40 anos, "21/21"). Nada enviado para o ranking público.

Complementa `copero-observacoes.md` (copero.io). **Nada é copiado:** nem texto, nem imagem, nem tela. Os prints ficaram fora do repositório porque mostram escudos oficiais.

## 1. Números das duas carreiras

| | Normal | Futebol é vida |
|---|---|---|
| OVR inicial → pico → final | 63 → 88 → 64 | 68 → 95 → 77 |
| Clubes | 10 (Fluminense, Fortaleza, Flamengo ×2, Atlético de Madrid, Leverkusen, Inter, Al-Hilal, Slavia, Atlético-MG, Baník) | 8 (Fluminense, Benfica, Inter ×3, Barcelona, PSG, PSV, Atlético de Madrid, Hajduk) |
| Jogos / gols / assistências | 661 / 198 / 225 | 823 / 286 / 353 |
| Títulos | 14 | 46 |
| Pontos | 15.801 | 44.860 |
| Decisões na carreira | ~28 (≈1,3 por temporada) | ~126 (≈6 por temporada) |
| Eventos diferentes vistos | 28 | 116 |
| Escolhas que "deram certo" | 18 de 28 (64%) | 101 de 126 (80%) |

As duas carreiras tiveram o robô escolhendo opções em rodízio, sem estratégia. Mesmo assim, o "Futebol é vida" gerou uma lenda (OVR 95, 46 títulos).

## 2. Fluxo (igual nos dois modos)

1. **Criação, numa tela só:** modo de carreira, nome na camisa, número, pé, país (carrossel) e posição num **campinho clicável**. Os atributos vêm prontos ("Valores prontos").
2. **Três propostas de base**, cada uma com liga, ambição ("meio da tabela", "presença na Sul-Americana") e **minutos esperados** ("~1.350 min"). No Normal, uma delas era do exterior (West Ham); no outro modo, Rennes.
3. **Só no Futebol é vida: o papel tático.** Para MEI, as opções são Meia ofensivo, Trequartista, Enganche e Atacante sombra, cada uma com uma frase. Técnicos, transferências e lesões podem mudar esse papel depois.
4. **Temporadas:** uma sequência de decisões, cada uma presa a uma **rodada** ("RODADA 13"). Por cima ficam a posição na liga e as fases da copa nacional e da continental (8.º · QF · SF).
5. **Resultado** em sobreposição, que se fecha com "toque para continuar".
6. **Fim de temporada:** posição final e "um novo troféu entrou para a galeria", que se pula com "toque para pular".
7. **Janela de transferências** como um evento a mais: 2 propostas mais "Ficar onde está", com salário semanal e anos de contrato.
8. **Fim de carreira:** histórico, totais, sala de troféus, honrarias e carta para compartilhar. Nesse ponto aparece o convite para o ranking e para "guardar na sua sala de troféus" (conta).

## 3. Tela de decisão

- **Cabeçalho fixo:** OVR em número dentro de um cartão de medalha, bandeira, número/posição, clube, idade, valor (€), contrato (€/sem · anos) e "Reiniciar".
- **Faixa de competições:** três mini-cartões (liga, copa, continental).
- **Cena ilustrada** (pintura digital, jogador genérico) com um selo de rodada, a categoria ("⚡ No carro do empresário", "Prova tática") e o título.
- **Texto:** no Futebol é vida, de 3 a 5 frases literárias; no Normal, de 1 a 2 frases diretas.
- **Opções:** rótulo, uma frase de consequência e uma **barra de sucesso/fracasso em %** (por exemplo, 55% | 45%). No Normal, o % aparece também no rótulo ("75%: à moda antiga.").
- **Abas embaixo:** Decisão, Torneios (tabela resumida: top 3 + a sua posição, com saldo) e Carreira (histórico por idade: clube, OVR, jogos, gols, assistências, mais a linha da Seleção).

## 4. Resultado da escolha

- "Opção · A escolha deu certo/errado" e um parágrafo que conta o que aconteceu.
- **Efeitos com número:** Minutos −0,5%, Valor +0,7%, Finalização +0,6%, Jogos +4, mais medidores escondidos ("Agente", "Peso no clube", "Seleção").
- Uma marca "**A história futura mudou**" quando a escolha liga um evento posterior; aparece com frequência.
- Mesmo com 88% de chance, a escolha pode dar errado: o resultado é sorteado.

## 5. Extras

- **Honrarias** com nome: Clube dos cem, Cem gols, Andarilho, O malas-prontas, Tríplice coroa, Rei do lamaçal, Sair pela porta da frente…
- **Evento secreto** com lenda real: no Normal, "Dennis Bergkamp pidió verte a solas", **em espanhol dentro da versão pt-BR** (falha de tradução).
- Evento com estátua de lenda real ("Inauguração da estátua · Sócrates").
- **Carta final** para compartilhar: OVR de pico, totais, trajetória por escudos e troféus, com opção de mostrar o nome completo, além de PNG, link e ranking.
- O ranking aceita apelido e mensagem e sugere um apelido automático ("O Poeta da Base").

## 6. Problemas que vimos (e que o 10eFaixa já evita ou precisa evitar)

| No copero.net | No 10eFaixa |
|---|---|
| Escudos oficiais e nomes de marcas (RB Bragantino) | Emblemas originais (SPEC v2.26); nome do Bragantino na revisão jurídica |
| Lendas reais como personagens (Bergkamp, Sócrates) | Lendas só como texto em `inspiracao`, atrás da flag |
| Texto em espanhol na versão pt-BR | Todo texto em `src/i18n/pt-BR`, com teste que barra texto solto |
| Percentual exato em toda opção | Faixas em texto (decisão do usuário) |
| ~6 decisões por temporada no modo narrativo: muitas parecem repetidas e cansam no fim | Ritmo da T51 (ainda a definir) |
| Texto às vezes com cara de tradução automática ("O clube assinou o você escrito num papel") | Skill de narrativa + revisão humana |
| A barra de 100%/0% em decisões sem risco é ruído visual | Mostrar risco só quando existe (tarja v2.26) |

## 7. Ideias para o 10eFaixa (só propostas: nada entra sem aprovação no SPEC)

1. **Minutos esperados na proposta** ("~1.350 min"): ajuda a decidir entre clube grande e titularidade. Combina com os cartões de mercado comparáveis da T51.
2. **Selo de rodada/momento na cena** ("Rodada 13", "Pré-temporada"): dá a sensação de calendário sem tela extra.
3. **"A história mudou"** no resultado quando a escolha liga um evento futuro. É um sinal barato de consequência.
4. **Faixa de competições** no topo (liga · copa · continental) em vez de uma tela de tabela à parte.
5. **Honrarias com nome bem-humorado** para a T55 (janela de conquistas), escritas por nós e sem marcas.
6. **Papel tático** escolhido no começo e mudado por eventos. Hoje o 10eFaixa tem arquétipo; um papel por posição seria uma extensão.
7. **Dois ritmos de carreira** (curta × narrativa) como uma opção futura, pensando em quem quer partidas rápidas.
8. **Efeitos com rótulo, mas sem número** (por exemplo, "Minutos ↓", "Valor ↑") no nosso resultado, para respeitar a regra de não mostrar números de atributos.
