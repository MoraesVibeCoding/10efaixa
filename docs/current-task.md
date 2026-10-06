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

- **T55c:** `cardModel(result, codigo)` em `src/share/cardModel.ts` (contrato: `nome, apelido, numero, posicao, clubeAuge, overall, veredito, rotulo, manchete, comentario, honrarias[≤3], frases[≤4], clubes[], numeros[5], radar[10 {id, nome, valor}], codigo, alt {narrativa, estatistica}`); textos `ui.cartao.*`; `storyText` em `src/ui/screens/storyText.ts`.
- **T55d:** `drawCard` (Canvas 2D, 1080×1350, duas versões) e tela `Cartao` no lugar do resumo do fim; refeito no padrão "Álbum com vidro" (figurinha grande + painel de vidro), a pedido do usuário; imagens em `src/ui/screens/cardImages.ts`; medido no Chromium (axe 0).

## Pendente

- ⛳ T55 **aprovada** pelo usuário (2026-10-06).
- Depois: T56 (compartilhar: imagem, download, texto para WhatsApp e link com os dados para refazer a carreira).

## Validação (último commit, T55d)

- `npm test`: 933 passando, 4 pulados · typecheck limpo · build OK.
