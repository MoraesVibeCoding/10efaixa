---
name: codebase-navigator
description: Navigate large codebases efficiently before implementation. Use when locating features, understanding architecture, finding dependencies, or deciding which files need modification.
---

# Codebase Navigator

## Objective

Find the smallest relevant set of files before implementation.

## Workflow

### Step 1 — Locate

Search for:

- feature name
- component name
- function
- route
- API endpoint
- database table
- schema
- test
- configuration

### Step 2 — Trace

Follow only direct relationships:

component
→ hook
→ service
→ database/API
→ test

Do not explore unrelated branches.

### Step 3 — Confirm

Before modifying code, identify:

- source of truth
- consumers
- dependencies
- tests
- configuration

### Step 4 — Modify

Change the smallest appropriate set of files.

### Step 5 — Verify

Run targeted validation.

Expand investigation only if validation fails or evidence indicates hidden dependencies.

## Rules

Do not read:

- node_modules
- generated files
- build output
- lockfiles unless dependency resolution is relevant
- unrelated feature directories

unless explicitly necessary.

Do not assume architecture from filenames alone.

Use search results and imports to establish relationships.

## No 10eFaixa

Camadas (ver `CLAUDE.md`): `src/engine` (regras puras) → `src/data` (JSON) → `src/i18n/pt-BR` (textos) → `src/state` → `src/ui` → `src/share`. Comece por `graphify query`/`graphify path`; não abra `graphify-out/GRAPH_REPORT.md` salvo para revisão ampla de arquitetura.
