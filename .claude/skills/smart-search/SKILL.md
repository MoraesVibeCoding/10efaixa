---
name: smart-search
description: Perform precise code searches before reading files. Use when locating symbols, implementations, usages, routes, database tables, configuration, or tests.
---

# Smart Search

## Objective

Find relevant code with minimal context consumption.

## Search order

1. Exact identifier
2. Function/component/class name
3. Route or endpoint
4. Database table/column
5. Error message
6. Import relationship
7. Related concept

## Prefer

- exact symbol searches
- references/usages
- imports
- exports
- route definitions
- schema definitions
- tests

## Avoid

Broad searches that return hundreds of files.

When search returns many results:

1. narrow the term
2. restrict the directory
3. search by symbol
4. inspect references
5. only then open files

## Never

Dump large search results into the conversation.

Use search results to identify the next file to inspect.

## No 10eFaixa

Ordem: `graphify query "<pergunta>"` → busca exata pelo símbolo (Grep) → abrir o arquivo. Texto visível ao jogador se acha em `src/i18n/pt-BR/*.json` pela chave; números de balanceamento em `src/data/*.json`.
