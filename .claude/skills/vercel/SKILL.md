---
name: vercel
description: Efficient deployment and production troubleshooting for the project's Vercel environment.
---

# Vercel

## Principles

Understand the difference between:

- local development
- preview deployment
- production deployment

Before changing deployment configuration:

- identify affected environment
- inspect existing configuration
- inspect environment variables
- inspect build command
- inspect runtime requirements

## Do not

Change production configuration unnecessarily.

Do not expose secrets.

Do not duplicate environment variables into source code.

## Validation

When deployment behavior changes, validate:

- build
- environment configuration
- runtime behavior
- affected routes

## No 10eFaixa

Segredos (chaves do Sentry, tokens) só em variáveis de ambiente, nunca no repositório (`CLAUDE.md`).
