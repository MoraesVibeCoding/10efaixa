---
name: minimal-diff
description: Make focused code changes with minimal unnecessary modifications. Use for bug fixes, features, refactors, and maintenance.
---

# Minimal Diff

## Objective

Produce the smallest correct change that solves the requested problem.

## Rules

1. Do not reformat unrelated code.
2. Do not rename unrelated variables.
3. Do not reorganize unrelated imports.
4. Do not refactor unrelated functions.
5. Do not change architecture unless required.
6. Preserve existing conventions.
7. Preserve existing behavior outside the requested scope.

## Before editing

Identify:

- exact bug/feature
- files requiring modification
- dependencies affected
- tests requiring changes

## After editing

Review the diff.

If a changed line is unrelated to the task, revert it unless there is a concrete reason to keep it.

## No 10eFaixa

Ao editar JSON de dados ou i18n por script, confira o `git diff`: reformatar o arquivo inteiro conta como mudança não relacionada e deve ser desfeito.
