# CLAUDE.md — 10eFaixa

Simulador de carreira do futebol brasileiro no navegador (mobile-first), da várzea à aposentadoria.
**A fonte da verdade é o `SPEC.md`.** Leia a seção relevante antes de cada tarefa. Nada fora do SPEC é implementado sem antes propor a mudança no SPEC e receber aprovação.

## Idioma
- Converse comigo em **português do Brasil**.
- Código, nomes de variáveis e commits podem ser em inglês; **todo texto visível ao jogador fica em `src/i18n/pt-BR`**, nunca escrito direto no código.

## Stack
- Vite 8 · React 19 · TypeScript 7 (modo estrito) · Vitest 5 + Testing Library + jsdom · Playwright (E2E) · GitHub Actions · Vercel.
- Antes de atualizar ou adicionar dependência, confirme a versão e a API na **documentação oficial** e cite o link no commit.

## Comandos
- `npm run dev` servidor local
- `npm test` testes
- `npm run typecheck` TypeScript
- `npm run build` build de produção

## Arquitetura
```
src/engine/   regras puras do jogo (sem React, sem DOM, determinísticas)
src/data/     JSON + schemas (clubes, ligas, arquétipos, eventos, calendário, cenas)
src/i18n/     textos pt-BR
src/state/    máquina de estados da carreira, save/load versionado
src/ui/       telas React
src/share/    cartão e compartilhamento
.claude/skills/10efaixa-arte/   skill de arte (criada na T42)
docs/         briefing de arte e documentação
```
- **Aleatoriedade só pelo PRNG com semente** do projeto. Proibido `Math.random()` no motor.
- **Regras e números de balanceamento em dados/configuração**, não fixos no código.

## Fluxo de trabalho (obrigatório)
1. **Uma tarefa por vez**, na ordem da seção 14 do SPEC. Antes de codar, apresente um plano de até 3 linhas e os critérios de aceitação da tarefa.
2. **TDD:** escreva o teste, **mostre-o falhando (Red)**, implemente o mínimo (Green), refatore.
3. **Pirâmide de testes:** ~80% unitários, ~15% integração, ~5% E2E. Código que importa tem teste.
4. **Commits atômicos**, um por tarefa, com o ID no início: `feat(T02): PRNG com semente`. Blocos de revisão de até ~100 linhas.
5. **Prova de conclusão:** mostre o log com **100% dos testes, typecheck e build passando**. "Parece funcionar" não conta.
6. **Revisão antes de concluir**, como engenheiro sênior: correção, segurança, performance, legibilidade e testabilidade.
7. **Falhou, pare:** reproduza isoladamente, localize a causa raiz, reduza o escopo, corrija pontualmente e crie teste de regressão. Nada de tentativas às cegas.
8. **Cerca de Chesterton:** não remova nem simplifique código sem entender e registrar por que ele existe.
9. **Dúvida em ponto crítico ou irreversível:** pare e pergunte. Questione as próprias suposições antes de agir.

## Pontos de parada obrigatórios (⛳)
Pare e peça minha aprovação nos pontos da seção 15 do SPEC: após T13, T40, T41, T42, T49, T55, T60, no fim de cada marco e em qualquer mudança de escopo.

## Regras que nunca podem ser quebradas
- **Aparência** (tom de pele, cabelo, barba, acessórios) **nunca** altera atributos ou eventos. Só altura e compleição afetam o jogo.
- **Nenhum número dos 10 atributos** aparece ao jogador antes do cartão final (só estrelas e faixas). As únicas exceções são o **overall geral**, mostrado em número na tela de decisão (SPEC v2.16) na linha do tempo "Sua carreira" antes do cartão final (SPEC v2.51) e no card do resumo da temporada, de-para com a variação em % (SPEC v2.61), decisões do usuário.
- **Sem escudos oficiais** de clubes nem da CBF. Clubes usam **emblemas originais** que evocam o nome ou a cidade (SPEC v2.26): nunca o escudo oficial nem elemento, forma ou disposição dele, monograma, mascote oficial, estrelas ou ano de fundação. Revisão jurídica antes do lançamento. **Exceção (SPEC v2.86, decisão do usuário em 2026-10-11, risco assumido por ele):** os emblemas que o usuário enviou em `docs/arte/emblemas/<clube>/` entram no jogo como estão; vários repetem elementos de escudos oficiais ou mascotes, e **nenhum vai ao lançamento público sem revisão jurídica**. Emblema novo feito por nós continua seguindo a regra.
- **Lendas reais** só como texto descritivo no campo `inspiracao`, controlado pela flag `inspiracaoLendas`. Nunca imagem, rosto ou visual característico de pessoa real.
- **Todos os atletas da carreira são fictícios.** Nome e apelido passam pelo filtro de palavras bloqueadas.
- **Prêmios e competições com nomes descritivos** (SPEC v2.32, `src/i18n/pt-BR/competitions.json`), nunca nomes oficiais ou marcas registradas (Brasileirão, Libertadores, Copa do Mundo, Olimpíadas, Champions...).
- **Zoeira só com o próprio jogador**, nunca com clubes, torcidas ou pessoas reais.
- **Dados oficiais** (formatos de campeonatos, número de clubes, calendários, valores de mercado) sempre com **fonte e data** no arquivo de dados. Transfermarkt só por consulta manual, sem raspagem.
- **Privacidade:** nenhum dado pessoal em analytics, Sentry, URLs ou logs. Sem cookies de rastreamento.
- **Segredos** (chaves do Sentry, tokens) nunca no repositório; só em variáveis de ambiente.
- **Acessibilidade WCAG 2.1 AA** em toda tela: teclado, foco visível, contraste, leitor de tela, `prefers-reduced-motion`. Toda cena tem texto alternativo.
- **Arte:** a arte final é pintada e gerada por IA (SPEC v2.12). Enquanto ela não está pronta, usar a arte provisória gerada pela skill, sempre no formato de camadas. O lançamento só acontece com a arte final validada (inclusive juridicamente).

## Definição de pronto
Uma tarefa só está concluída quando: os critérios de aceitação do SPEC são atendidos, os testes novos existem e passaram depois de falhar, typecheck e build passam, o commit está feito e o log foi apresentado.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
