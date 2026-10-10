# Tarefa atual

> Atualizado em 2026-10-07, para a próxima sessão. A fonte da verdade continua sendo o `SPEC.md` (hoje na **v2.48**), e as regras de trabalho estão no `CLAUDE.md`.

## Onde estamos

> Texto antigo substituído em 2026-10-07. **Roadmap atualizado: `docs/roadmap.md`.** `main` na v2.60 (PR #20), 1284 testes, typecheck e build OK.

- **Próxima:** T25b (catálogo de 80+ eventos, incluindo os de campo e postura); depois T29b, T50f, T54b, T58, T59, T60 ⛳, T61 ⛳.
- **Bug em aberto (iPhone/Safari):** reunião, "A comissão topou" não sai ao tocar em Seguir (suspeita: `<dialog>`).

## Feito recentemente

| Versão | O que entrou |
|---|---|
| T55 ⛳, T56 | Cartão final 1080×1350 em Canvas (aprovado) e compartilhamento (nativo, download e copiar texto) |
| v2.45, v2.46 | Cenas pintadas na decisão e na criação; posição **Ponta**; lado do lateral e da ponta; campo com 9 camisas; visual mesclado (menta, Oswald e Inter) |
| v2.47 | Fluidez inspirada no copero.com.ar: números que rolam (`useRolling`), transições de 300 ms, carimbos de título, acesso e rebaixamento, e aviso legal na abertura. Tempos em `src/data/motion.json`; tudo respeita `prefers-reduced-motion` |
| v2.48 | Estilos revistos: **3 por posição** (21 no total, tabela 6.2 do SPEC). Saves antigos convertidos (save v3, `src/data/archetypeMigration.json`). Equilíbrio medido com simulação pareada: `npm run sim:estilos` gera `docs/simulacao-estilos.md` ("Lenda" entre 4,3% e 7,0% por estilo) |
| Plugin | `previsao-do-contexto`: faixa no Claude Code com a ocupação da janela de contexto. O repositório virou marketplace (`.claude-plugin/marketplace.json`). Só aparece no terminal e no desktop, não no app do celular |

## Opções em aberto para o usuário decidir

1. **T58** (próxima na ordem do SPEC), ou abrir o PR da T57.
2. **Habilidades dos estilos com efeito real** no motor: hoje o traço especial é só descrição; os efeitos precisam ser aprovados antes de codar.

## Pendências conhecidas

- O **tema escuro** e o **cartão em canvas** ainda usam cores antigas onde não leem os tokens novos (v2.46).
- O **lado** (esquerdo/direito) ainda não aparece na figurinha nem nos textos dos eventos.
- O **tom de pele** das cenas pintadas não acompanha o visual escolhido.
- As simulações de legado (`legacy.report`) usam a mesma semente para sortear a entrada e a carreira, o que correlaciona estilo e sorte; o `archetypes.report` já usa o método pareado. Corrigir antes da próxima calibração.
- Bundle principal acima de 500 kB (aviso do Vite); dividir na tarefa de desempenho.

## Combinados com o usuário

- Conversar em pt-BR. O usuário está no celular: **sempre trazer as opções de decisão** (perguntas com alternativas).
- **Evitar testes desnecessários** no momento, mas manter o TDD do `CLAUDE.md` para código novo.
- **Deploy já autorizado:** com o CI "verify" verde, fazer o merge do PR no `main`.
- Guarda do i18n: em `.tsx`, o teste acusa `=>` e genéricos entre tags JSX; usar funções declaradas e `{' '}` para espaços.
- Conferir telas no Chromium (`/opt/pw-browsers/chromium`) em 390×844; arquivos temporários fora da raiz.

## Ferramentas instaladas na sessão anterior (somem com o container)

Reinstalar só se for usar:
- `pip install ast-outline` (mapa de código por tree-sitter; não foi ligado ao `CLAUDE.md`, o graphify já cumpre esse papel).
- `npm install -g @csepulv/agent-sync`.
- Plugin caveman: `claude plugin marketplace add JuliusBrussee/caveman && claude plugin install caveman@caveman` (respostas curtas; diga "stop caveman" para voltar ao normal).
