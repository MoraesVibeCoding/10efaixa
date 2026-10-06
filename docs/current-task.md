# Tarefa atual

> Estado para retomar depois de compactar a conversa (skill `task-compression`). A fonte da verdade continua sendo o `SPEC.md`; aqui fica só o andamento.

## Objetivo

**T55 — Cartão final 1080×1350** (SPEC 6.15, linha da T55 na seção 14). Termina num ⛳: capturas do cartão para aprovação do usuário.

## Decisões (SPEC v2.42)

- Cartão desenhado em **Canvas 2D**, exportado em PNG (base da T56).
- **Versão narrativa** abre primeiro; um botão troca para a estatística.
- Avatar com a camisa do **clube do auge** (`peakClubId`) e o número usado nesse clube.
- Frases de "Sua história" saem do **resultado da carreira** (a memória da T25d não existe).
- **Código da carreira** curto `10F-XXXX-XXXX` (assinatura); os dados para refazer vão no link da T56.
- **10 honrarias** aprovadas (`src/data/honors.json`, textos em `legacy.honraria`), no máximo 3 no cartão.
- Sem sonho da carreira no cartão até a T50f existir.

## Feito

- **T55a** (`ef286c7`): `honorsOf`/`honorFacts`, `peakAttributes`, `peakClubId` e `honors` no resultado, `careerCode`.
- **T55b** (`b288982`): `storyOf` e `storyHighlights` (`src/engine/story.ts`, pesos em `story.json`), tela `Historia` antes do resumo do fim.

## Em andamento — T55c (modelo do cartão)

- `storyText` saiu de `Historia.tsx` para `src/ui/screens/storyText.ts` (o cartão também usa).
- Teste `src/share/cardModel.test.ts` escrito e falhando (Red); falta `src/share/cardModel.ts` e os textos `ui.cartao.*` (texto alternativo das duas versões).
- Contrato: `cardModel(result, codigo)` → `nome, apelido, numero, posicao, clubeAuge, overall, veredito, rotulo, manchete, comentario, honrarias[≤3], frases[≤4], clubes[], numeros[jogos, gols, assistencias, titulos, patrimonio], radar[10 {id, nome, valor}], codigo, alt {narrativa, estatistica}`.

## Pendente

- **T55d:** desenho em Canvas 2D 1080×1350 nas duas versões, com o "10"/número bem enquadrado nas costas; tela do cartão no lugar do resumo atual (`CareerEnd`).
- ⛳ Capturas do cartão para aprovação.

## Validação (último commit, T55b)

- `npm test`: 926 passando, 4 pulados · typecheck limpo · build OK.
