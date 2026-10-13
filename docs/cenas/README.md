# Cenas com o uniforme genérico (jogador de linha)

As **21 cenas** do jogo, em **6 cortes de cabelo** cada (126 imagens), com o uniforme do jogador de linha em cores-chave para uma IA de imagem trocar pelo uniforme de cada clube. **O goleiro não entra** (uniforme dele fica para depois).

- **Camisa: magenta** (`#FF00FF`).
- **Calção e meiões: ciano** (`#00FFFF`).
- A luz e as dobras da pintura ficam; o resto da cena (céu, cenário, rosto, cabelo, pele, companheiros) é igual ao do jogo.
- Companheiros no fundo também vêm em magenta e ciano.
- Formato: **1080 × 1341**, WebP (qualidade 95), o mesmo tamanho e enquadramento que o jogo usa.
- `indice.jpg`: uma folha com as 21 cenas (corte `curto`).

## Pastas

`docs/cenas/<cena>/<corte>.webp`, com `<corte>` em `cacheado-grande`, `cacheado-medio`, `careca`, `curto`, `liso-grande`, `liso-medio`.

Cenas: titulo, vestiario, assinatura-contrato, penalti, varzea, sala-empresario, reuniao-comissao, casa-familia, despedida, copa, treino, gol, hospital, festa, entrevista, convocacao, rua-do-bairro, peneira, banco-de-reservas, aeroporto, estadio.

**Cenas sem calção na pintura** (só a camisa vem em magenta): sala-empresario, casa-familia, hospital, festa, aeroporto. Nelas o jogador está de roupa civil; a camisa magenta marca onde o jogo pinta a camisa do clube hoje.

## Prompt sugerido para a IA de imagem (anexe a cena e as imagens do uniforme)

```
Keep this image exactly as it is (same scene, same player, same pose, same hair, same background, same lighting, same size). Only recolour the clothes: replace the magenta shirt with the shirt in the attached reference images, and replace the cyan shorts and socks with the shorts in the reference. Apply the same change to the people in the background who wear magenta and cyan. Do not add any crest, sponsor, brand mark, number or text.
```

## Como foi gerado

`python3 docs/arte/gerar_cenas_genericas.py` lê a pintura e as duas máscaras de cada cena em `src/assets/cenas/` (`<corte>.webp`, `<corte>-camisa.webp`, `<corte>-calcao.webp`) e grava aqui. Autoteste: `python3 docs/arte/test_gerar_cenas_genericas.py`.

**Defeito das máscaras do jogo, tratado aqui e não corrigido no jogo:** em 14 das 96 máscaras de calção (treino, peneira, assinatura do contrato, estádio, rua do bairro) a máscara vaza sobre o céu, as luzes ou a janela. No jogo isso escurece ou tinge o fundo conforme a cor do calção do clube. O gerador descarta esses blocos; o arquivo do jogo continua como estava.
