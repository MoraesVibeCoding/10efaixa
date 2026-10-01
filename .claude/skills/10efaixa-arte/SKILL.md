---
name: 10efaixa-arte
description: Arte do 10eFaixa — gera arte provisória em SVG no formato final de camadas (avatar, poses, cabeças, cenários, detalhes), mantém o briefing do ilustrador em docs/briefing-arte.md e confere as entregas do ilustrador. Use sempre que a tarefa envolver qualquer peça visual do jogo, cena de evento, avatar, pose, cabelo, uniforme, cenário, recolor, a pasta src/assets/art, o briefing de arte ou uma entrega/lote do ilustrador — mesmo que o pedido não diga "arte" (ex.: "o evento novo precisa de cena", "chegou o lote 2", "faltou o cabelo dread de perfil").
---

# Arte do 10eFaixa

O jogo mostra uma cena ilustrada em toda decisão, montada pelo código a partir de peças SVG em camadas. Um ilustrador humano faz a arte final; até ela chegar, o jogo roda com **arte provisória gerada por esta skill no mesmo formato**, para que trocar provisória por final seja só substituir arquivos.

**Fonte da verdade do formato:** `docs/briefing-arte.md` (seções 4 e 5: cores-chave, boneco-base, nomes, camadas, orçamento de peso; seção 6: lista de peças). Leia antes de qualquer uma das três funções. Se esta skill e o briefing divergirem, vale o briefing — e corrija a divergência.

Regras do projeto que valem para toda peça (CLAUDE.md e SPEC seção 11): arte original, nada que lembre pessoa real, escudo, clube ou marca; aparência (pele, cabelo, barba, acessório) é só visual.

## Onde ficam as peças

```
src/assets/art/
  provisoria/   gerada por esta skill
  final/        entregue pelo ilustrador (mesmos nomes e estrutura)
```

Mesma estrutura nas duas pastas, organizada por categoria do nome do arquivo (`pose/`, `cabelo/`, `cenario/`…). O código prefere `final/` e cai para `provisoria/` quando a peça final ainda não existe.

## Função 1 — Gerar arte provisória

Objetivo: peças **funcionalmente idênticas** às finais (mesmos nomes, grupos, `id`, `data-pivo`, slots, cores-chave), visualmente simples. Não tente fazer arte bonita: formas geométricas legíveis bastam, porque o que importa é o código de avatar e cenas poder ser escrito e testado contra o formato real.

1. Pegue a peça na lista do briefing (seção 6) e o formato na seção 5.
2. Desenhe com primitivas (`rect`, `circle`, `ellipse`, `path` simples) no `viewBox` do boneco-base (400 × 800, pés em `y = 780`, centro `x = 200`) ou do cenário.
3. Pinte áreas personalizáveis **só** com as cores-chave exatas da seção 4.1 (o recolor troca hex exato — uma cor parecida quebra a troca). O resto, só com a paleta do jogo.
4. Grupos na ordem e com os `id` da seção 5.2; membros com `data-pivo`; cenários com os `slot-*`.
5. Para lotes grandes, gere por script determinístico (mesma entrada, mesmo SVG) em vez de escrever arquivo por arquivo: fica reprodutível e revisável.
6. Rode o validador (Função 3) na pasta `provisoria/`. Peça provisória que não passa no validador não serve para nada — o objetivo dela é exercitar o formato.

## Função 2 — Manter o briefing atualizado

O briefing é o contrato com o ilustrador; ele precisa refletir o jogo real.

- Quando um evento novo pedir cena, pose ou detalhe que não está na seção 6, acrescente na lista e diga em qual lote entra.
- Quando o formato mudar (ex.: orçamento de peso fechado na T43, cor nova na lista fixa), atualize as seções 4–5 e suba a versão no topo do documento com data e motivo.
- Mudança de formato depois que o ilustrador começou afeta trabalho já pago: **pare e peça aprovação humana** antes, e registre a decisão na seção 17 do SPEC.

## Função 3 — Conferir entregas

Toda entrega (lote do ilustrador ou provisória) passa pelo validador automático antes da revisão visual. Regras em `src/art/format.json` (mude lá, nunca no código, e reflita no briefing):

```bash
npm run art:check -- src/assets/art/final
```

O relatório aponta camada faltando, nome fora do padrão, cor não recolorível (fora da paleta/cores-chave) e peso acima do orçamento. Ao conferir um lote:

1. Rode o validador e devolva ao ilustrador o relatório em linguagem clara (arquivo, problema, como corrigir), sem jargão de código.
2. Só depois dos erros zerados, faça a revisão visual no jogo (cena montada no celular, ~360 px de largura): legibilidade, recolor de pele e uniforme em vários tons, proporção em alturas e compleições extremas.
3. Confira as regras de originalidade da seção 2 do briefing — essa parte o script não pega.

## Não faça

- Não desenhe variações de altura ou compleição: o código estica o boneco-base.
- Não embuta raster, fonte, script ou gradiente em SVG.
- Não crie cor nova sem acrescentá-la à lista fixa do briefing (o validador recusa).
