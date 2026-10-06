---
name: git-efficient
description: Use Git efficiently to understand changes, history, branches, and diffs without loading unnecessary repository context.
---

# Git Efficient

## Rules

Prefer:

- git status
- git diff
- git diff -- path
- git log -- path
- git blame -- relevant lines

over broad repository history.

When reviewing changes:

1. inspect changed files
2. inspect relevant diff
3. inspect history only when intent is unclear

Do not dump entire commits or repository history into context.

Before finishing:

- verify intended files changed
- inspect diff
- identify accidental modifications
- leave unrelated changes untouched

## No 10eFaixa

Commits atômicos com o ID da tarefa (`feat(T55a): ...`). Desenvolva e faça push só no branch indicado na sessão.
