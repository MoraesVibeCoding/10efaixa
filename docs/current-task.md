# Tarefa atual

> Atualizado em 2026-10-07, para a próxima sessão. A fonte da verdade continua sendo o `SPEC.md` (hoje na **v2.48**), e as regras de trabalho estão no `CLAUDE.md`.

## Onde estamos

- **Branch de trabalho:** `main` está em dia; os PRs #4 a #8 foram mergeados. Link de teste: https://10efaixa-9vpy.vercel.app (atualiza a partir do `main`).
- **Verificação no `main`:** 985 testes passando (5 pulados de propósito: simulações longas), typecheck limpo e build OK.
- **T57 concluída na branch `claude/eloquent-dirac-qnpqbi`** (SPEC v2.49; ainda sem PR nem merge): desafio do dia, link da carreira (`#c=`, sem nome) e rever carreira. Layout da abertura e do cartão conferido em 390×844 (Playwright instalado como dependência de desenvolvimento).
- **Branch `claude/eloquent-dirac-qnpqbi` (a partir do `main` pós-T57), ainda sem PR:** SPEC v2.50 (propostas de clube): T28b–e **feitas** (propostas completas); falta a T28f (simulação pareada), na validação final. Decisão do usuário (v2.52): fazer toda a fila de decisões e histórias (T25c, T25d, T25e, T25b) e validar tudo no fim; lista em `docs/validacao-final.md` e v2.51 (linha do tempo "Sua carreira", T55f–h **feitas**; falta só conferir no celular real).
- **T25c (marcos) em pausa:** o motor dos marcos (`src/engine/milestones.ts`, `src/data/milestones.json`) está no `main` da branch; os 20 marcos escritos (`events.json` e i18n) estão no commit `d5cdb21` e foram **revertidos** na branch para ficar verde; ao voltar à T25c, `git revert c5d95e8` os traz de volta e há 6 testes a ajustar (agent, events, preview, CenaPintada, careerView).
- **T28g–k (tela de contratos) feitas** na branch `claude/eloquent-dirac-qnpqbi` (SPEC v2.54; ver `docs/validacao-final.md`). Reunião em 3 ideias (T52b–d) já está no `main` (PR #14).
- **T25c (marcos) feita** na branch (20 marcos ligados, ritmos, figurinhas na gaveta e no álbum). Próximas: T25d (memória), T25e (eventos modulares), T25b (80+ eventos).
- **Pedidos em fila (nesta ordem):** reunião em 3 ideias (T52b–d feita, em PR) → tela de contratos (`docs/proposta-tela-contratos.md`, aguarda aprovação) → marcos e catálogo. Feedback de equilíbrio: `docs/revisao-equilibrio-decisoes.md`.
- **Bug em aberto (iPhone/Safari):** na reunião, "A comissão topou" não sai ao tocar em Seguir; não reproduzido no Chromium (36 combinações, toque simulado). Suspeita: `<dialog>` modal no Safari. Falta a versão do iOS ou autorização para trocar por um aviso comum.
- **Próxima tarefa pela ordem da seção 14:** **T58** (Apoia.se, aviso legal e privacidade).

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
