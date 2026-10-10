---
name: task-compression
description: Break large development tasks into context-efficient implementation phases while preserving architecture, correctness, and continuity.
---

# Task Compression

## Objective

Execute large development tasks in controlled phases without losing architectural consistency.

## Phase model

### Phase 1 — Understand

Determine:

- objective
- requirements
- constraints
- architecture
- affected systems

Do not implement yet if the task is ambiguous.

### Phase 2 — Plan

Create a concise implementation plan.

Identify:

- files
- dependencies
- database changes
- APIs
- UI
- tests

### Phase 3 — Implement

Implement one coherent unit at a time.

### Phase 4 — Validate

Run targeted checks.

### Phase 5 — Continue

Use the validated state as the source of truth.

Do not repeatedly reconstruct the entire project mentally.

## Context rules

Keep summaries focused on:

- decisions
- changed files
- contracts
- unresolved issues
- validation results

Do not preserve large code excerpts in summaries.

## Important

Never compress away:

- requirements
- constraints
- security assumptions
- API contracts
- database relationships
- test requirements

## No 10eFaixa

A divisão em fases segue a seção 14 do `SPEC.md` (uma tarefa por vez, subtarefas como T55a, T55b…). Ao fim de cada subtarefa, atualize `docs/roadmap.md` (feito, decisões, pendente, validação) — é ele que se lê ao retomar; as notas antigas ficam em `docs/historico/`.
