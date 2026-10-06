---
name: dependency-awareness
description: Analyze dependencies and imports efficiently before modifying shared code, packages, components, hooks, utilities, or APIs.
---

# Dependency Awareness

## Objective

Understand impact without loading unrelated parts of the repository.

Before modifying a shared symbol:

1. Find its definition.
2. Find direct consumers.
3. Determine whether behavior is public/shared.
4. Inspect affected tests.
5. Modify.
6. Validate consumers.

## Dependency expansion

Expand only when:

- the symbol is exported
- multiple packages consume it
- it is part of an API
- it affects database access
- it affects authentication
- tests reveal regressions

Do not recursively inspect every dependency by default.

Stop dependency traversal when sufficient evidence exists to implement safely.

## No 10eFaixa

Mudou um tipo do motor (ex.: `CareerResult` em `src/engine/career.ts`)? Rode `npm run typecheck` para achar todos os consumidores antes de sair lendo arquivos. O motor é determinístico pela semente: um sorteio novo no meio do fluxo muda todas as carreiras — sorteios novos vão por último.
