---
name: test-targeting
description: Select the smallest meaningful test and validation scope for code changes without compromising correctness.
---

# Test Targeting

## Objective

Validate changes efficiently while preserving confidence.

## Validation hierarchy

### Level 1

Run the directly affected test.

### Level 2

Run related tests.

### Level 3

Run typecheck.

### Level 4

Run lint/build when relevant.

### Level 5

Run the broader test suite when:

- shared infrastructure changed
- database schema changed
- authentication changed
- core utilities changed
- public APIs changed
- configuration changed
- previous tests indicate regression
- task explicitly requires full validation

## Important

Never skip validation merely to reduce token or execution usage.

Prefer targeted validation first.

Expand scope when evidence requires it.

## No 10eFaixa

O ciclo do `CLAUDE.md` continua valendo: teste novo falhando primeiro (Red), depois o teste direcionado (`npx vitest run <arquivo>`). **Antes de cada commit**, a prova de conclusão é a suíte inteira (`npm test`), `npm run typecheck` e `npm run build` passando — o nível 5 é obrigatório no fechamento de tarefa, não opcional.
