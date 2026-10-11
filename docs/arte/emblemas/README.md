# Emblemas dos clubes (T49d, SPEC v2.26)

Emblemas **originais** que evocam o nome ou a cidade de cada clube da Série A. Gerados com `python3 docs/arte/gerar-emblemas.py`; um prompt por pasta.

## Imagens enviadas pelo usuário (SPEC v2.86)

As imagens que o usuário colocou nas pastas dos clubes (2026-10-09) entram no jogo: `python3 docs/arte/emblemas/recortar.py` recorta o fundo verde e grava `src/assets/emblemas/<clube>.webp`. Pasta sem imagem fica com o emblema que já existia (desenho ou genérico). Por decisão do usuário (risco assumido por ele), estas imagens entram mesmo repetindo elementos de escudos oficiais ou mascotes; **nenhuma vai ao lançamento público sem revisão jurídica**.

## Regras (CLAUDE.md e SPEC, seção 11)

- Nunca o escudo oficial nem elemento, forma ou disposição dele, monograma, mascote oficial, estrelas ou ano de fundação.
- Sem texto dentro do emblema.
- Cores por troca: magenta = cor 1 do clube, ciano = cor 2; contorno marinho e detalhes creme.
- Duas versões no jogo: completa e simplificada (legível em 18 px).
- **Revisão jurídica antes do lançamento.**

## Antes de gerar cada um

A coluna "Evitar" veio da memória do assistente e **não foi conferida** em fonte (sites bloqueados no ambiente de desenvolvimento). Para cada clube, compare o símbolo proposto com o escudo oficial atual e os antigos e com os mascotes. Pontos já sabidos para conferir:

- **Coritiba:** se a araucária já apareceu em algum escudo do clube.
- **Remo:** se há remos no escudo oficial (o símbolo proposto é uma canoa).
- **Red Bull Bragantino:** o nome do clube inclui uma marca registrada de empresa; o emblema não pode lembrar touro nem a marca. Vale levar à revisão jurídica também o uso do nome no jogo.
- **Belo Horizonte e Porto Alegre:** dois clubes por cidade; os símbolos foram escolhidos para não se confundirem (serra × lua; pôr do sol × globo).

| Clube | Forma | Símbolo | Conceito |
|---|---|---|---|
| Flamengo | escudo | chama | usuário |
| Fluminense | círculo | rio entre morros ('flumen' é rio em latim) | proposta |
| Vasco da Gama | escudo | astrolábio do navegador que dá nome ao clube | proposta |
| Botafogo | escudo | morro e enseada do bairro que dá nome ao clube | proposta |
| Palmeiras | hexágono | palmeira | usuário |
| Corinthians | círculo | capitel de coluna coríntia (o nome vem do estilo grego) | proposta |
| São Paulo | escudo | silhueta de arranha-céus da cidade | proposta |
| Santos | círculo | vela e ondas de cidade portuária | usuário |
| Red Bull Bragantino | escudo | colinas da serra perto de Bragança Paulista, com sol | proposta |
| Mirassol | círculo | sol nascente ('mira o sol') | proposta |
| Atlético-MG | escudo | serra que contorna Belo Horizonte | proposta |
| Cruzeiro | círculo | lua crescente sobre a lagoa (sem estrelas) | proposta |
| Grêmio | escudo | pôr do sol sobre o lago da cidade | proposta |
| Internacional | círculo | globo com meridianos (o nome 'Internacional') | proposta |
| Athletico-PR | escudo | raio | proposta |
| Coritiba | quadrado arredondado | araucária, árvore-símbolo do Paraná | usuário |
| Bahia | escudo | farol à beira-mar de Salvador | proposta |
| Vitória | círculo | ramo de louros da vitória | proposta |
| Remo | escudo | canoa e ondas do rio de Belém | proposta |
| Chapecoense | círculo | espiga de trigo sobre os campos do oeste catarinense | proposta |
