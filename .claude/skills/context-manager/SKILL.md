---
name: context-manager
description: Optimize context usage without reducing reasoning quality. Use when tasks involve multiple files, long conversations, debugging sessions, refactoring, or large repositories.
---

# Context Manager

## Objective

Reduce unnecessary context consumption while preserving full reasoning quality, correctness, testing, architecture analysis, and implementation depth.

Never sacrifice correctness merely to save tokens.

## Rules

1. Do not read entire directories unless necessary.
2. Do not read files unrelated to the current task.
3. Before opening a file, determine why it is relevant.
4. Prefer targeted searches over broad file reading.
5. When a relevant symbol is known, locate that symbol first.
6. Read surrounding code only when required to understand behavior.
7. Do not repeatedly reread files already understood.
8. Do not repeatedly inspect unchanged files.
9. Do not reproduce large file contents in responses.
10. Do not include unchanged code in explanations or patches.

## Context hierarchy

Prefer:

1. Exact symbol search
2. Relevant function/class/component
3. Direct dependencies
4. Tests covering the behavior
5. Related configuration
6. Broader architecture only if necessary

## Never skip

Do not omit information required for:

- correctness
- security
- type safety
- database integrity
- authentication
- authorization
- race conditions
- edge cases
- testing
- deployment safety

## Before large tasks

Determine:

- objective
- affected subsystem
- likely files
- required dependencies
- required tests

Then inspect only the necessary context.

## After implementation

Verify the changed behavior using the smallest meaningful validation set before expanding validation.

## No 10eFaixa

- `SPEC.md` é a fonte da verdade: leia só a seção da tarefa (busque o ID, ex.: `grep -n "T55" SPEC.md`), nunca o arquivo inteiro.
- Para entender o código, rode `graphify query "<pergunta>"` antes de abrir arquivos (regra do `CLAUDE.md`).
- Ao retomar uma tarefa longa, leia `docs/current-task.md` antes do histórico da conversa.
