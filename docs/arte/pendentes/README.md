# Imagens pendentes

**206 imagens** faltam para concluir a arte que já tem prompt. Cada subpasta é uma imagem, com um `prompt.md` único.

## Como fazer

1. Abra a subpasta, copie o bloco **Prompt** do `prompt.md` e gere numa **conversa nova** do gerador (Nano Banana 2), na maior resolução.
2. Salve a imagem **na própria subpasta** como `imagem.jpeg` (emblemas: `imagem.png`).
3. Ao terminar (ou a cada lote), rode `python3 docs/arte/gerar-pendentes.py --recolher`: cada imagem vai para a pasta definitiva e a subpasta some.
4. Pequenos defeitos não pedem nova geração (decisão de 2026-10-02); anote no README da arte.

## Resumo

| Grupo | Imagens |
|---|---|
| Emblemas dos clubes | 20 |
| Troféus | 18 |
| Cenas (jogador de linha) | 78 |
| Cenas (goleiro) | 90 |

## Dicas

- **Cenas:** para manter o traço, anexe uma cena aprovada do mesmo corte (ex.: `docs/arte/cenas/04-penalti/curto/imagem.jpeg`) e acrescente o pedido de usar só como referência de estilo e cabelo (está em cada `prompt.md`).
- **Cenas com 6 cortes:** se preferir, a pasta da cena (`docs/arte/cenas/<cena>/prompt-6-cortes.md`) pede os 6 cortes numa conversa só; salve cada um na subpasta pendente do corte certo.
- **Emblemas:** confira a lista "Evitar" de cada clube antes de gerar (Coritiba, Remo e Bragantino têm pontos a conferir).
- **Troféus:** nenhum pode lembrar o troféu real; confira um a um.

## Lista

| Pendente | Grupo | Destino |
|---|---|---|
| `001-emblema-athletico-pr` | Emblemas dos clubes | `docs/arte/emblemas/athletico-pr` |
| `002-emblema-atletico-mg` | Emblemas dos clubes | `docs/arte/emblemas/atletico-mg` |
| `003-emblema-bahia` | Emblemas dos clubes | `docs/arte/emblemas/bahia` |
| `004-emblema-botafogo` | Emblemas dos clubes | `docs/arte/emblemas/botafogo` |
| `005-emblema-bragantino` | Emblemas dos clubes | `docs/arte/emblemas/bragantino` |
| `006-emblema-chapecoense` | Emblemas dos clubes | `docs/arte/emblemas/chapecoense` |
| `007-emblema-corinthians` | Emblemas dos clubes | `docs/arte/emblemas/corinthians` |
| `008-emblema-coritiba` | Emblemas dos clubes | `docs/arte/emblemas/coritiba` |
| `009-emblema-cruzeiro` | Emblemas dos clubes | `docs/arte/emblemas/cruzeiro` |
| `010-emblema-flamengo` | Emblemas dos clubes | `docs/arte/emblemas/flamengo` |
| `011-emblema-fluminense` | Emblemas dos clubes | `docs/arte/emblemas/fluminense` |
| `012-emblema-gremio` | Emblemas dos clubes | `docs/arte/emblemas/gremio` |
| `013-emblema-internacional` | Emblemas dos clubes | `docs/arte/emblemas/internacional` |
| `014-emblema-mirassol` | Emblemas dos clubes | `docs/arte/emblemas/mirassol` |
| `015-emblema-palmeiras` | Emblemas dos clubes | `docs/arte/emblemas/palmeiras` |
| `016-emblema-remo` | Emblemas dos clubes | `docs/arte/emblemas/remo` |
| `017-emblema-santos` | Emblemas dos clubes | `docs/arte/emblemas/santos` |
| `018-emblema-sao-paulo` | Emblemas dos clubes | `docs/arte/emblemas/sao-paulo` |
| `019-emblema-vasco` | Emblemas dos clubes | `docs/arte/emblemas/vasco` |
| `020-emblema-vitoria` | Emblemas dos clubes | `docs/arte/emblemas/vitoria` |
| `021-trofeu-continental-principal` | Troféus | `docs/arte/trofeus/continental-principal` |
| `022-trofeu-continental-secundaria` | Troféus | `docs/arte/trofeus/continental-secundaria` |
| `023-trofeu-copa-america` | Troféus | `docs/arte/trofeus/copa-america` |
| `024-trofeu-copa-do-brasil` | Troféus | `docs/arte/trofeus/copa-do-brasil` |
| `025-trofeu-copa-do-mundo` | Troféus | `docs/arte/trofeus/copa-do-mundo` |
| `026-trofeu-copa-do-nordeste` | Troféus | `docs/arte/trofeus/copa-do-nordeste` |
| `027-trofeu-copa-europeia` | Troféus | `docs/arte/trofeus/copa-europeia` |
| `028-trofeu-estadual` | Troféus | `docs/arte/trofeus/estadual` |
| `029-trofeu-liga-europeia` | Troféus | `docs/arte/trofeus/liga-europeia` |
| `030-trofeu-olimpiadas` | Troféus | `docs/arte/trofeus/olimpiadas` |
| `031-trofeu-premio-artilheiro` | Troféus | `docs/arte/trofeus/premio-artilheiro` |
| `032-trofeu-premio-melhor-goleiro` | Troféus | `docs/arte/trofeus/premio-melhor-goleiro` |
| `033-trofeu-premio-melhor-jogador` | Troféus | `docs/arte/trofeus/premio-melhor-jogador` |
| `034-trofeu-premio-revelacao` | Troféus | `docs/arte/trofeus/premio-revelacao` |
| `035-trofeu-serie-a` | Troféus | `docs/arte/trofeus/serie-a` |
| `036-trofeu-serie-b` | Troféus | `docs/arte/trofeus/serie-b` |
| `037-trofeu-serie-c` | Troféus | `docs/arte/trofeus/serie-c` |
| `038-trofeu-serie-d` | Troféus | `docs/arte/trofeus/serie-d` |
| `039-cena-22-cabecada-curto` | Cenas (jogador de linha) | `docs/arte/cenas/22-cabecada/curto` |
| `040-cena-22-cabecada-cacheado-medio` | Cenas (jogador de linha) | `docs/arte/cenas/22-cabecada/cacheado-medio` |
| `041-cena-22-cabecada-liso-medio` | Cenas (jogador de linha) | `docs/arte/cenas/22-cabecada/liso-medio` |
| `042-cena-22-cabecada-cacheado-grande` | Cenas (jogador de linha) | `docs/arte/cenas/22-cabecada/cacheado-grande` |
| `043-cena-22-cabecada-liso-grande` | Cenas (jogador de linha) | `docs/arte/cenas/22-cabecada/liso-grande` |
| `044-cena-22-cabecada-careca` | Cenas (jogador de linha) | `docs/arte/cenas/22-cabecada/careca` |
| `045-cena-23-fisioterapia-curto` | Cenas (jogador de linha) | `docs/arte/cenas/23-fisioterapia/curto` |
| `046-cena-23-fisioterapia-cacheado-medio` | Cenas (jogador de linha) | `docs/arte/cenas/23-fisioterapia/cacheado-medio` |
| `047-cena-23-fisioterapia-liso-medio` | Cenas (jogador de linha) | `docs/arte/cenas/23-fisioterapia/liso-medio` |
| `048-cena-23-fisioterapia-cacheado-grande` | Cenas (jogador de linha) | `docs/arte/cenas/23-fisioterapia/cacheado-grande` |
| `049-cena-23-fisioterapia-liso-grande` | Cenas (jogador de linha) | `docs/arte/cenas/23-fisioterapia/liso-grande` |
| `050-cena-23-fisioterapia-careca` | Cenas (jogador de linha) | `docs/arte/cenas/23-fisioterapia/careca` |
| `051-cena-24-classico-curto` | Cenas (jogador de linha) | `docs/arte/cenas/24-classico/curto` |
| `052-cena-24-classico-cacheado-medio` | Cenas (jogador de linha) | `docs/arte/cenas/24-classico/cacheado-medio` |
| `053-cena-24-classico-liso-medio` | Cenas (jogador de linha) | `docs/arte/cenas/24-classico/liso-medio` |
| `054-cena-24-classico-cacheado-grande` | Cenas (jogador de linha) | `docs/arte/cenas/24-classico/cacheado-grande` |
| `055-cena-24-classico-liso-grande` | Cenas (jogador de linha) | `docs/arte/cenas/24-classico/liso-grande` |
| `056-cena-24-classico-careca` | Cenas (jogador de linha) | `docs/arte/cenas/24-classico/careca` |
| `057-cena-25-vaia-curto` | Cenas (jogador de linha) | `docs/arte/cenas/25-vaia/curto` |
| `058-cena-25-vaia-cacheado-medio` | Cenas (jogador de linha) | `docs/arte/cenas/25-vaia/cacheado-medio` |
| `059-cena-25-vaia-liso-medio` | Cenas (jogador de linha) | `docs/arte/cenas/25-vaia/liso-medio` |
| `060-cena-25-vaia-cacheado-grande` | Cenas (jogador de linha) | `docs/arte/cenas/25-vaia/cacheado-grande` |
| `061-cena-25-vaia-liso-grande` | Cenas (jogador de linha) | `docs/arte/cenas/25-vaia/liso-grande` |
| `062-cena-25-vaia-careca` | Cenas (jogador de linha) | `docs/arte/cenas/25-vaia/careca` |
| `063-cena-26-estreia-curto` | Cenas (jogador de linha) | `docs/arte/cenas/26-estreia/curto` |
| `064-cena-26-estreia-cacheado-medio` | Cenas (jogador de linha) | `docs/arte/cenas/26-estreia/cacheado-medio` |
| `065-cena-26-estreia-liso-medio` | Cenas (jogador de linha) | `docs/arte/cenas/26-estreia/liso-medio` |
| `066-cena-26-estreia-cacheado-grande` | Cenas (jogador de linha) | `docs/arte/cenas/26-estreia/cacheado-grande` |
| `067-cena-26-estreia-liso-grande` | Cenas (jogador de linha) | `docs/arte/cenas/26-estreia/liso-grande` |
| `068-cena-26-estreia-careca` | Cenas (jogador de linha) | `docs/arte/cenas/26-estreia/careca` |
| `069-cena-27-capitao-curto` | Cenas (jogador de linha) | `docs/arte/cenas/27-capitao/curto` |
| `070-cena-27-capitao-cacheado-medio` | Cenas (jogador de linha) | `docs/arte/cenas/27-capitao/cacheado-medio` |
| `071-cena-27-capitao-liso-medio` | Cenas (jogador de linha) | `docs/arte/cenas/27-capitao/liso-medio` |
| `072-cena-27-capitao-cacheado-grande` | Cenas (jogador de linha) | `docs/arte/cenas/27-capitao/cacheado-grande` |
| `073-cena-27-capitao-liso-grande` | Cenas (jogador de linha) | `docs/arte/cenas/27-capitao/liso-grande` |
| `074-cena-27-capitao-careca` | Cenas (jogador de linha) | `docs/arte/cenas/27-capitao/careca` |
| `075-cena-28-cobranca-falta-curto` | Cenas (jogador de linha) | `docs/arte/cenas/28-cobranca-falta/curto` |
| `076-cena-28-cobranca-falta-cacheado-medio` | Cenas (jogador de linha) | `docs/arte/cenas/28-cobranca-falta/cacheado-medio` |
| `077-cena-28-cobranca-falta-liso-medio` | Cenas (jogador de linha) | `docs/arte/cenas/28-cobranca-falta/liso-medio` |
| `078-cena-28-cobranca-falta-cacheado-grande` | Cenas (jogador de linha) | `docs/arte/cenas/28-cobranca-falta/cacheado-grande` |
| `079-cena-28-cobranca-falta-liso-grande` | Cenas (jogador de linha) | `docs/arte/cenas/28-cobranca-falta/liso-grande` |
| `080-cena-28-cobranca-falta-careca` | Cenas (jogador de linha) | `docs/arte/cenas/28-cobranca-falta/careca` |
| `081-cena-29-final-curto` | Cenas (jogador de linha) | `docs/arte/cenas/29-final/curto` |
| `082-cena-29-final-cacheado-medio` | Cenas (jogador de linha) | `docs/arte/cenas/29-final/cacheado-medio` |
| `083-cena-29-final-liso-medio` | Cenas (jogador de linha) | `docs/arte/cenas/29-final/liso-medio` |
| `084-cena-29-final-cacheado-grande` | Cenas (jogador de linha) | `docs/arte/cenas/29-final/cacheado-grande` |
| `085-cena-29-final-liso-grande` | Cenas (jogador de linha) | `docs/arte/cenas/29-final/liso-grande` |
| `086-cena-29-final-careca` | Cenas (jogador de linha) | `docs/arte/cenas/29-final/careca` |
| `087-cena-30-escalacao-curto` | Cenas (jogador de linha) | `docs/arte/cenas/30-escalacao/curto` |
| `088-cena-30-escalacao-cacheado-medio` | Cenas (jogador de linha) | `docs/arte/cenas/30-escalacao/cacheado-medio` |
| `089-cena-30-escalacao-liso-medio` | Cenas (jogador de linha) | `docs/arte/cenas/30-escalacao/liso-medio` |
| `090-cena-30-escalacao-cacheado-grande` | Cenas (jogador de linha) | `docs/arte/cenas/30-escalacao/cacheado-grande` |
| `091-cena-30-escalacao-liso-grande` | Cenas (jogador de linha) | `docs/arte/cenas/30-escalacao/liso-grande` |
| `092-cena-30-escalacao-careca` | Cenas (jogador de linha) | `docs/arte/cenas/30-escalacao/careca` |
| `093-cena-31-hino-curto` | Cenas (jogador de linha) | `docs/arte/cenas/31-hino/curto` |
| `094-cena-31-hino-cacheado-medio` | Cenas (jogador de linha) | `docs/arte/cenas/31-hino/cacheado-medio` |
| `095-cena-31-hino-liso-medio` | Cenas (jogador de linha) | `docs/arte/cenas/31-hino/liso-medio` |
| `096-cena-31-hino-cacheado-grande` | Cenas (jogador de linha) | `docs/arte/cenas/31-hino/cacheado-grande` |
| `097-cena-31-hino-liso-grande` | Cenas (jogador de linha) | `docs/arte/cenas/31-hino/liso-grande` |
| `098-cena-31-hino-careca` | Cenas (jogador de linha) | `docs/arte/cenas/31-hino/careca` |
| `099-cena-32-exterior-curto` | Cenas (jogador de linha) | `docs/arte/cenas/32-exterior/curto` |
| `100-cena-32-exterior-cacheado-medio` | Cenas (jogador de linha) | `docs/arte/cenas/32-exterior/cacheado-medio` |
| `101-cena-32-exterior-liso-medio` | Cenas (jogador de linha) | `docs/arte/cenas/32-exterior/liso-medio` |
| `102-cena-32-exterior-cacheado-grande` | Cenas (jogador de linha) | `docs/arte/cenas/32-exterior/cacheado-grande` |
| `103-cena-32-exterior-liso-grande` | Cenas (jogador de linha) | `docs/arte/cenas/32-exterior/liso-grande` |
| `104-cena-32-exterior-careca` | Cenas (jogador de linha) | `docs/arte/cenas/32-exterior/careca` |
| `105-cena-33-prancheta-curto` | Cenas (jogador de linha) | `docs/arte/cenas/33-prancheta/curto` |
| `106-cena-33-prancheta-cacheado-medio` | Cenas (jogador de linha) | `docs/arte/cenas/33-prancheta/cacheado-medio` |
| `107-cena-33-prancheta-liso-medio` | Cenas (jogador de linha) | `docs/arte/cenas/33-prancheta/liso-medio` |
| `108-cena-33-prancheta-cacheado-grande` | Cenas (jogador de linha) | `docs/arte/cenas/33-prancheta/cacheado-grande` |
| `109-cena-33-prancheta-liso-grande` | Cenas (jogador de linha) | `docs/arte/cenas/33-prancheta/liso-grande` |
| `110-cena-33-prancheta-careca` | Cenas (jogador de linha) | `docs/arte/cenas/33-prancheta/careca` |
| `111-cena-34-assistencia-curto` | Cenas (jogador de linha) | `docs/arte/cenas/34-assistencia/curto` |
| `112-cena-34-assistencia-cacheado-medio` | Cenas (jogador de linha) | `docs/arte/cenas/34-assistencia/cacheado-medio` |
| `113-cena-34-assistencia-liso-medio` | Cenas (jogador de linha) | `docs/arte/cenas/34-assistencia/liso-medio` |
| `114-cena-34-assistencia-cacheado-grande` | Cenas (jogador de linha) | `docs/arte/cenas/34-assistencia/cacheado-grande` |
| `115-cena-34-assistencia-liso-grande` | Cenas (jogador de linha) | `docs/arte/cenas/34-assistencia/liso-grande` |
| `116-cena-34-assistencia-careca` | Cenas (jogador de linha) | `docs/arte/cenas/34-assistencia/careca` |
| `117-cena-goleiro-01-titulo-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/01-titulo/curto` |
| `118-cena-goleiro-01-titulo-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/01-titulo/cacheado-medio` |
| `119-cena-goleiro-01-titulo-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/01-titulo/liso-medio` |
| `120-cena-goleiro-01-titulo-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/01-titulo/cacheado-grande` |
| `121-cena-goleiro-01-titulo-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/01-titulo/liso-grande` |
| `122-cena-goleiro-01-titulo-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/01-titulo/careca` |
| `123-cena-goleiro-04-penalti-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/04-penalti/curto` |
| `124-cena-goleiro-04-penalti-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/04-penalti/cacheado-medio` |
| `125-cena-goleiro-04-penalti-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/04-penalti/liso-medio` |
| `126-cena-goleiro-04-penalti-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/04-penalti/cacheado-grande` |
| `127-cena-goleiro-04-penalti-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/04-penalti/liso-grande` |
| `128-cena-goleiro-04-penalti-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/04-penalti/careca` |
| `129-cena-goleiro-09-despedida-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/09-despedida/curto` |
| `130-cena-goleiro-09-despedida-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/09-despedida/cacheado-medio` |
| `131-cena-goleiro-09-despedida-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/09-despedida/liso-medio` |
| `132-cena-goleiro-09-despedida-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/09-despedida/cacheado-grande` |
| `133-cena-goleiro-09-despedida-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/09-despedida/liso-grande` |
| `134-cena-goleiro-09-despedida-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/09-despedida/careca` |
| `135-cena-goleiro-10-copa-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/10-copa/curto` |
| `136-cena-goleiro-10-copa-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/10-copa/cacheado-medio` |
| `137-cena-goleiro-10-copa-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/10-copa/liso-medio` |
| `138-cena-goleiro-10-copa-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/10-copa/cacheado-grande` |
| `139-cena-goleiro-10-copa-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/10-copa/liso-grande` |
| `140-cena-goleiro-10-copa-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/10-copa/careca` |
| `141-cena-goleiro-11-treino-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/11-treino/curto` |
| `142-cena-goleiro-11-treino-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/11-treino/cacheado-medio` |
| `143-cena-goleiro-11-treino-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/11-treino/liso-medio` |
| `144-cena-goleiro-11-treino-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/11-treino/cacheado-grande` |
| `145-cena-goleiro-11-treino-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/11-treino/liso-grande` |
| `146-cena-goleiro-11-treino-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/11-treino/careca` |
| `147-cena-goleiro-12-defesa-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/12-defesa/curto` |
| `148-cena-goleiro-12-defesa-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/12-defesa/cacheado-medio` |
| `149-cena-goleiro-12-defesa-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/12-defesa/liso-medio` |
| `150-cena-goleiro-12-defesa-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/12-defesa/cacheado-grande` |
| `151-cena-goleiro-12-defesa-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/12-defesa/liso-grande` |
| `152-cena-goleiro-12-defesa-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/12-defesa/careca` |
| `153-cena-goleiro-21-estadio-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/21-estadio/curto` |
| `154-cena-goleiro-21-estadio-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/21-estadio/cacheado-medio` |
| `155-cena-goleiro-21-estadio-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/21-estadio/liso-medio` |
| `156-cena-goleiro-21-estadio-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/21-estadio/cacheado-grande` |
| `157-cena-goleiro-21-estadio-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/21-estadio/liso-grande` |
| `158-cena-goleiro-21-estadio-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/21-estadio/careca` |
| `159-cena-goleiro-22-saida-do-gol-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/22-saida-do-gol/curto` |
| `160-cena-goleiro-22-saida-do-gol-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/22-saida-do-gol/cacheado-medio` |
| `161-cena-goleiro-22-saida-do-gol-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/22-saida-do-gol/liso-medio` |
| `162-cena-goleiro-22-saida-do-gol-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/22-saida-do-gol/cacheado-grande` |
| `163-cena-goleiro-22-saida-do-gol-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/22-saida-do-gol/liso-grande` |
| `164-cena-goleiro-22-saida-do-gol-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/22-saida-do-gol/careca` |
| `165-cena-goleiro-24-classico-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/24-classico/curto` |
| `166-cena-goleiro-24-classico-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/24-classico/cacheado-medio` |
| `167-cena-goleiro-24-classico-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/24-classico/liso-medio` |
| `168-cena-goleiro-24-classico-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/24-classico/cacheado-grande` |
| `169-cena-goleiro-24-classico-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/24-classico/liso-grande` |
| `170-cena-goleiro-24-classico-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/24-classico/careca` |
| `171-cena-goleiro-25-vaia-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/25-vaia/curto` |
| `172-cena-goleiro-25-vaia-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/25-vaia/cacheado-medio` |
| `173-cena-goleiro-25-vaia-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/25-vaia/liso-medio` |
| `174-cena-goleiro-25-vaia-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/25-vaia/cacheado-grande` |
| `175-cena-goleiro-25-vaia-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/25-vaia/liso-grande` |
| `176-cena-goleiro-25-vaia-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/25-vaia/careca` |
| `177-cena-goleiro-26-estreia-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/26-estreia/curto` |
| `178-cena-goleiro-26-estreia-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/26-estreia/cacheado-medio` |
| `179-cena-goleiro-26-estreia-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/26-estreia/liso-medio` |
| `180-cena-goleiro-26-estreia-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/26-estreia/cacheado-grande` |
| `181-cena-goleiro-26-estreia-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/26-estreia/liso-grande` |
| `182-cena-goleiro-26-estreia-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/26-estreia/careca` |
| `183-cena-goleiro-27-capitao-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/27-capitao/curto` |
| `184-cena-goleiro-27-capitao-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/27-capitao/cacheado-medio` |
| `185-cena-goleiro-27-capitao-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/27-capitao/liso-medio` |
| `186-cena-goleiro-27-capitao-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/27-capitao/cacheado-grande` |
| `187-cena-goleiro-27-capitao-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/27-capitao/liso-grande` |
| `188-cena-goleiro-27-capitao-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/27-capitao/careca` |
| `189-cena-goleiro-29-final-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/29-final/curto` |
| `190-cena-goleiro-29-final-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/29-final/cacheado-medio` |
| `191-cena-goleiro-29-final-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/29-final/liso-medio` |
| `192-cena-goleiro-29-final-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/29-final/cacheado-grande` |
| `193-cena-goleiro-29-final-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/29-final/liso-grande` |
| `194-cena-goleiro-29-final-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/29-final/careca` |
| `195-cena-goleiro-31-hino-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/31-hino/curto` |
| `196-cena-goleiro-31-hino-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/31-hino/cacheado-medio` |
| `197-cena-goleiro-31-hino-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/31-hino/liso-medio` |
| `198-cena-goleiro-31-hino-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/31-hino/cacheado-grande` |
| `199-cena-goleiro-31-hino-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/31-hino/liso-grande` |
| `200-cena-goleiro-31-hino-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/31-hino/careca` |
| `201-cena-goleiro-32-exterior-curto` | Cenas (goleiro) | `docs/arte/cenas-goleiro/32-exterior/curto` |
| `202-cena-goleiro-32-exterior-cacheado-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/32-exterior/cacheado-medio` |
| `203-cena-goleiro-32-exterior-liso-medio` | Cenas (goleiro) | `docs/arte/cenas-goleiro/32-exterior/liso-medio` |
| `204-cena-goleiro-32-exterior-cacheado-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/32-exterior/cacheado-grande` |
| `205-cena-goleiro-32-exterior-liso-grande` | Cenas (goleiro) | `docs/arte/cenas-goleiro/32-exterior/liso-grande` |
| `206-cena-goleiro-32-exterior-careca` | Cenas (goleiro) | `docs/arte/cenas-goleiro/32-exterior/careca` |

Fora desta pasta (sem prompt ainda): avatar em camadas pintadas da figurinha (T42b–T44b) e as 8 comemorações. Dependem do lote piloto ⛳.
