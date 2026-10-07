# Proposta T57 — Desafio diário e link da carreira (SPEC v2.49, aguardando "DE ACORDO")

> Nada foi codado. Se aprovado, a proposta vira a seção 6.15 + linha do registro de decisões do `SPEC.md` (v2.49) e as tarefas abaixo entram na seção 14.

## Objetivos
1. **Desafio do dia:** todos que tocam em "Desafio do dia" jogam com a **mesma semente do dia**, criando o próprio jogador. Comparação pelo cartão e pelo código (SPEC 6.15). Sem ranking, sem servidor.
2. **Link da carreira (adiado da T56):** o cartão ganha "Copiar link". Quem abre o link **revê a carreira** (somente leitura) e pode **jogar o mesmo desafio**.

## Decisões já tomadas (suas)
- Só a semente do dia; cada pessoa cria o próprio jogador.
- Link com semente + criação + escolhas, sem dado pessoal.

## Arquitetura de dados
- **Semente do dia** (`src/engine/daily.ts`, pura): data em `America/Sao_Paulo` (UTC−3 fixo, sem horário de verão) → `YYYY-MM-DD` → hash (FNV-1a já usado no `careerCode`) → semente de 32 bits. Mesma data = mesma semente em qualquer aparelho. Sem `Date.now()` dentro do motor: a data entra como parâmetro.
- **Link** (`src/share/careerLink.ts`, puro): `https://…/#c=<base64url>` com `{ v, seed, ritmo, input, look, visual, choices, desafio? }`.
  - Vai no **fragmento (#)**, que o navegador não envia ao servidor (nada em log da Vercel, analytics ou Sentry).
  - **Sem nome nem apelido** (regra de privacidade do CLAUDE.md): ao rever, o jogador aparece com um nome genérico em `pt-BR`. *Ponto para você confirmar.*
  - Decodificação **estrita**: versão conhecida, tamanho máximo, tipos e ids validados contra os dados (clube, estilo, posição, visual); qualquer falha cai na tela de link inválido (reuso do padrão do `SaveInvalido`). Lei de Hyrum: nenhum campo extra é aceito.
- **Save:** campo opcional `desafio: 'YYYY-MM-DD'` (sem migração; ausente = carreira livre). Rever pelo link **nunca** grava no save.
- **Textos:** tudo em `src/i18n/pt-BR`. Selo "Desafio de DD/MM" no cartão (nome descritivo, sem marca).

## Telas
- **Abertura:** botão "Desafio do dia" ao lado de "Nova carreira". Se já existe carreira salva, mantém a pergunta antes de apagar (v2.39).
- **Cartão:** selo do desafio (se houver) + botão "Copiar link" junto dos de compartilhar.
- **Rever carreira (link):** abre o cartão e "Sua história" só leitura, com "Jogar este desafio" (usa a semente do link) e "Nova carreira".
- Acessibilidade WCAG 2.1 AA: foco visível, rótulos, `aria-live` na confirmação de cópia, `prefers-reduced-motion`.

## Estratégia de teste
- **Unitários (~80%):** `dailySeed` (mesma data = mesma semente; datas vizinhas diferem; virada à meia-noite de Brasília), codec do link (ida e volta; rejeita versão errada, lixo, tamanho excessivo, ids desconhecidos, nome no link), `careerRun` com a semente do dia reproduz a mesma carreira.
- **Integração (~15%):** Abertura→criação com a semente do dia; cartão com selo e cópia do link; link válido abre "rever" sem tocar no save; link inválido mostra a tela de erro.
- **E2E (~5%):** abrir link → ver cartão → jogar o desafio.

## Limites do escopo (fora)
Ranking online, mesmo jogador inicial, contas, streaks, notificações, analytics do desafio (T59), múltiplos desafios por dia, link que reabre carreira em andamento.

## Tarefas atômicas (um commit por tarefa, TDD)
| ID | Tarefa | Critério de aceitação |
|---|---|---|
| T57a | `dailySeed(data)` | Determinística; fuso de Brasília; testes vermelhos antes |
| T57b | Codec do link (`careerLink`) | Ida e volta idêntica; todas as rejeições acima; sem nome/apelido; ≤ ~3 mil caracteres (medido ≈ 2,4 mil; a estimativa de 1,5 kB estava baixa) |
| T57c | Desafio na Abertura + `desafio` no save + selo no cartão | Criação usa a semente do dia; selo só quando é desafio; carreira livre inalterada |
| T57d | Tela "Rever carreira" por link | Somente leitura, não grava save, link inválido tratado, "Jogar este desafio" |
| T57e | "Copiar link" no cartão + SPEC v2.49 + `current-task.md` | Texto copiado = link da T57b; aria-live; log 100% testes, typecheck e build |

Plano macro: T57a → T57b → T57c → T57d → T57e. Sem ponto de parada ⛳ no meio (a T57 não está na seção 15).
