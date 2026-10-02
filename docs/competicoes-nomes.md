# Nomes das competições: oficiais × nomes do jogo (v2.32)

**Aprovado pelo usuário em 2026-10-02.** A Europa League chegou a virar "Liga Europeia", mas o usuário trocou para **"Copa Europeia 2"**, porque o primeiro ficava perto demais do nome oficial em português ("Liga Europa"). Aplicado em `src/i18n/pt-BR/competitions.json`, com teste de guarda em `src/i18n/competitions.test.ts`. **Vai para a revisão jurídica antes do lançamento.**

## Regra

- **Sem marcas:** nenhum nome oficial ou marca de competição aparece no jogo.
- **Nomes descritivos:** dizem o que é a competição e onde acontece ("Liga Inglesa", "Copa Continental").
- **Nada de imitação:** nenhum nome é parecido com a marca, nem no som nem na grafia ("Libertadora", "Premiere Liga", "Brasileirinho"). Imitação pode ser vista como tentativa de confundir o público e dá mais problema que um nome neutro.
- **Termos genéricos podem ficar:** palavras como "Série A", "Estadual", "Eliminatórias", "Copa" e "Liga".
- **Clubes seguem com os nomes reais** (SPEC 6.9) e os emblemas originais (v2.26). Esse ponto também vai para a revisão jurídica.
- **Registros a conferir:** não consegui consultar o INPI daqui. A lista "é marca registrada?" precisa ser checada na revisão jurídica.

## Brasil

| Oficial | Nome no jogo (proposta) | Alternativa |
|---|---|---|
| Campeonato Brasileiro Série A ("Brasileirão") | **Nacional · Série A** | Campeonato Nacional A |
| Série B, C e D | **Nacional · Série B / C / D** | — |
| Copa do Brasil | **Copa Nacional** | Copa do País |
| Copa do Nordeste | **Copa Regional do Nordeste** | Taça Regional |
| Campeonatos estaduais (Paulistão, Carioca, Mineiro…) | **Estadual de SP / RJ / MG…** | Campeonato Estadual (SP) |
| Copa São Paulo de Futebol Júnior ("Copinha") | **Copa de Juniores** | Torneio de Verão da Base |

## América do Sul

| Oficial | Nome no jogo (proposta) | Alternativa |
|---|---|---|
| CONMEBOL Libertadores | **Copa Continental** | Copa Continental de Clubes |
| CONMEBOL Sul-Americana | **Copa Continental 2** | Taça Continental |

## Seleções

| Oficial | Nome no jogo (proposta) | Alternativa |
|---|---|---|
| Copa do Mundo da FIFA | **Mundial de Seleções** | Mundial |
| Copa América | **Continental de Seleções** | Torneio Continental |
| Torneio olímpico de futebol / "Olimpíadas" / "ouro olímpico" | **Torneio Sub-23 dos Jogos** e "Ouro no Sub-23" | Mundial Sub-23 |
| Eliminatórias | **Eliminatórias** (genérico) | — |
| Sub-17, Sub-20 | **Mundial Sub-17 / Sub-20** | — |

O termo "olímpico" tem proteção específica na lei brasileira (Lei 9.615/98, art. 15), por isso precisa sair.

## Europa: 1ª divisão

| Oficial | Nome no jogo (proposta) |
|---|---|
| Premier League | **Liga Inglesa** |
| LaLiga | **Liga Espanhola** |
| Serie A (Itália) | **Liga Italiana** |
| Bundesliga | **Liga Alemã** |
| Ligue 1 | **Liga Francesa** |
| Liga Portugal | **Liga Portuguesa** |

## Europa: 2ª divisão (T29b)

| Oficial | Nome no jogo (proposta) |
|---|---|
| EFL Championship | **Segunda Inglesa** |
| LaLiga 2 / Hypermotion | **Segunda Espanhola** |
| Serie B (Itália) | **Segunda Italiana** |
| 2. Bundesliga | **Segunda Alemã** |
| Ligue 2 | **Segunda Francesa** |
| Liga Portugal 2 | **Segunda Portuguesa** |

## Europa: copas

| Oficial | Nome no jogo (proposta) |
|---|---|
| FA Cup, Copa del Rey, Coppa Italia, DFB-Pokal, Coupe de France, Taça de Portugal | **Copa da Inglaterra / da Espanha / da Itália / da Alemanha / da França / de Portugal** |
| UEFA Champions League | **Copa Europeia** |
| UEFA Europa League | **Copa Europeia 2** |

## Ligas fora do eixo

| Oficial | Nome no jogo (proposta) |
|---|---|
| Saudi Pro League | **Liga Saudita** |
| MLS | **Liga Norte-Americana** |
| J1 League | **Liga Japonesa** |
| Qatar Stars League | **Liga do Catar** |
| Chinese Super League | **Liga Chinesa** |

## Prêmios e textos que citam competições

| Hoje | Nome no jogo (proposta) |
|---|---|
| Craque do Brasileirão | **Craque do Nacional** |
| Campeão da Copinha | **Campeão da Copa de Juniores** |
| "numa Copa do Mundo" (texto das cenas) | **"num Mundial"** |

## Como ficou no código

- **Nomes no i18n:** os nomes visíveis passam a vir só do `src/i18n/pt-BR`. Os dados (`leagues.json`, `europe.json`, `cups.json`, `nationalTournaments.json`) guardam apenas ids.
- **Teste de guarda:** uma lista de nomes oficiais proibidos (Brasileirão, Libertadores, Champions, Premier League, Copa do Mundo, Olimpíadas…) faz o teste falhar se algum aparecer em textos do jogo, na arte ou nos prompts.
- **Fontes oficiais nos arquivos de dados:** continuam citando a competição real, com fonte e data, porque ali é referência e não aparece ao jogador.
