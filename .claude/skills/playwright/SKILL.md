---
name: playwright
description: Efficient browser testing with Playwright. Use when creating, modifying, or debugging end-to-end tests.
---

# Playwright

## Principles

Prefer stable user-visible behavior over implementation details.

## Test strategy

Use:

- semantic locators
- accessible roles
- labels
- stable test IDs when appropriate

Avoid brittle selectors.

## Execution

Run the smallest affected test first.

Expand to related suites when:

- shared components changed
- authentication changed
- routing changed
- critical user flows changed

## Debugging

When a test fails:

1. inspect exact failure
2. inspect locator
3. inspect page state
4. reproduce
5. fix root cause
6. rerun affected test

## No 10eFaixa

No ambiente remoto o Chromium já está em `/opt/pw-browsers/chromium`; não rode `playwright install`. Acessibilidade (WCAG 2.1 AA) é critério de aceite: prefira localizadores por papel e nome acessível.
