# Continuação: estado do projeto e próximos passos

> **Histórico.** O estado atual (2026-10-06) está em `docs/historico/current-task.md`.

Atualizado em 2026-10-03. Leia antes de continuar numa sessão nova. A fonte da verdade continua sendo o `SPEC.md`, hoje na **v2.33**, e as regras de trabalho estão no `CLAUDE.md`.

## Onde estamos

- **Branch de trabalho:** `marco-6-produto-bvkf7j`. Tudo enviado ao GitHub.
- **Verificação:** 751 testes, typecheck e build passando.
- **Feito no Marco 6:**
  - **T48:** máquina de estados das telas.
  - **T49, T49b, T49c e T49d:** visual, acessibilidade, figurinha, layout da decisão e emblemas.
  - **T50:** criação em duas telas mais o tipo de início (v2.30), com a figurinha ao vivo e o visual sorteado e editável. No computador, as duas telas viram uma página.
  - **T51 (a):** o motor para em cada decisão. `src/state/careerRun.ts` refaz a carreira com as escolhas já feitas, porque o motor é determinístico. O save será criação + semente + escolhas.
  - **v2.32:** competições com nomes não oficiais (`src/i18n/pt-BR/competitions.json`), com teste de guarda.
  - **v2.33:** valor de mercado em € nos selos da decisão.
  - **T51 (b):** o jogo roda de ponta a ponta: criação → carreira com as decisões (`Career`, `careerView.ts`) → resumo do fim com "Nova carreira". O `App` deixou de ser a amostra da T49. A cena ainda é a amostra (assinatura de contrato) em toda decisão.

## Próximo passo: T51 (resto)

Pendências anotadas na T51 (b):
- **Abertura, sorteio e ritmo** (fluxo da T48) ainda não têm tela: hoje "Voltar" no 1º passo e "Nova carreira" voltam à criação limpa.
- **Bundle** principal com 534 kB (171 kB gzip): passou do aviso de 500 kB ao trazer o motor; dividir na tarefa de desempenho.
- **favicon.ico** dá 404 (já antes da T51 b); entra com os ícones.
- Nomes "Copa nacional" (copa de liga estrangeira) e "Copa Nacional" (Brasil) podem aparecer juntos no resumo; vale rever os nomes.

Depois, na ordem:
1. **T51:** selo de momento, "isso vai pesar", efeitos em setas, faixa de competições, cartões de mercado com minutos e nível em faixa (o mercado ainda é automático: `chooseOffer` em `career.ts`), resumo da virada de temporada.
2. **T50f e T51b:** sonho da carreira; retorno da evolução e idolatria em faixas.
3. **Motor de histórias:** T25d (memória), T25c (marcos), T25e (eventos modulares e proposta com contexto), T25b (80 ou mais eventos em lotes, com aprovação ⛳).
4. **Sistemas:** T52 e T52b, T53, T54, T54b; T29b (2ª divisão europeia, depois do repositório de consulta do usuário).
5. **Final:** T55 ⛳, T56 a T59, T60 ⛳, T61 ⛳.

## Combinados com o usuário

- **Idioma:** conversar em pt-BR, com respostas diretas.
- **TDD:** mostrar o Red e terminar com o log de testes, typecheck e build.
- **Commits:** atômicos, com o ID da tarefa.
- **Navegador:** conferir no Chromium (`/opt/pw-browsers/chromium`, playwright-core no scratchpad) que as telas não rolam em 390×844. Use uma página temporária `tmp-*.html` na raiz, servida pelo `vite`, e **apague depois**. Prints nunca na raiz do repositório.
- **Guarda do i18n:** o teste acusa `=>`, `>=` e genéricos entre tags JSX como texto solto. Envolva com chaves ou leve a lógica para um `.ts`.
- **FM26:** só como pista de fatos (confirmados em fonte oficial e citados) e conferência de ordem de grandeza. Nada copiado nem no repositório.
- **Arte:** o usuário gera as 206 imagens de `docs/arte/pendentes/`; `python3 docs/arte/gerar-pendentes.py --recolher` leva cada uma para o destino. O avatar em camadas pintadas e as comemorações ainda não têm prompt (dependem do lote piloto ⛳).
- **Revisão jurídica antes do lançamento:** nomes de clubes, emblemas, nomes de competições, o nome "Red Bull Bragantino" e os artigos femininos de 11 clubes.
