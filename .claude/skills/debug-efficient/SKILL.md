---
name: debug-efficient
description: Debug failures using evidence-driven incremental investigation. Use for runtime errors, test failures, build failures, TypeScript errors, and production issues.
---

# Efficient Debugging

## Objective

Resolve bugs using evidence instead of broad exploration.

## Workflow

1. Capture the exact error.
2. Identify the failing file/symbol.
3. Reproduce if possible.
4. Trace the smallest relevant execution path.
5. Form a concrete hypothesis.
6. Make the smallest diagnostic or corrective change.
7. Run the relevant test/check.
8. Confirm the result.
9. Only expand investigation if evidence requires it.

## Avoid

Do not inspect the entire codebase because of a localized error.

Do not make multiple speculative changes at once.

Do not repeatedly rerun unrelated test suites.

## When evidence changes

Update the hypothesis instead of continuing with the previous assumption.

## No 10eFaixa

Equivale ao passo 7 do `CLAUDE.md` ("Falhou, pare"): reproduzir isolado, achar a causa raiz, corrigir pontualmente e deixar um teste de regressão.
