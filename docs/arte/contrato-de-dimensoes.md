# Contrato de dimensões das imagens (SPEC v2.100)

Existe para que as camadas de uma cena empilhem sem deslocamento. Hoje a documentação diz "4:5", mas **nenhuma imagem do projeto é 4:5 exato**:

| Imagem | Tamanho | Razão | 4:5 exato seria |
|---|---|--:|---|
| Geração pedida à IA | 1856 × 2304 | 0,8056 | 1843 × 2304 |
| Retratos e camadas recebidos | 928 × 1152 | 0,8056 | 922 × 1152 |
| Cena no jogo (`src/assets/cenas`) | 1080 × 1341 | 0,8054 | 1073 × 1341 |
| Máscaras das cenas | 540 × 670 | 0,8060 | 536 × 670 |

## Regras

1. **Razão oficial: a da pintura em `cenasArte.json` (`largura` / `altura`) é a verdade do jogo.** A tela do jogo usa essa razão (`--cena-proporcao`), não 4:5.
2. **Tamanho de trabalho para geração e montagem: 1856 × 2304** (razão 0,8056). Todas as camadas de uma cena têm exatamente esse tamanho (ou 928 × 1152, a metade, nos testes provisórios). Nunca recortar para 4:5.
3. **Tamanho de entrega no jogo: 1080 × 1341** (razão 0,8054), que é o que as cenas atuais usam. Reduzir de 1856 × 2304 para 1080 × 1341 muda a razão em 0,02%: aceito, sem recorte, com reamostragem Lanczos.
4. **Máscaras: metade do tamanho de entrega (540 × 670)**, em alfa 0 a 1, sempre reamostradas para o tamanho da pintura ao usar.
5. **Posições em frações da tela** (0 a 1, x da esquerda, y de cima), nunca em pixels. É o que `montagem.json` e `partes` em `cenasArte.json` usam.
6. **Conferência:** o compositor rejeita camada com razão que difere mais de 0,5% da razão de trabalho, e arquivo que não seja RGB ou RGBA de 8 bits.
7. **Antes da compressão com perdas (WebP), a comparação de pixels é exata** (fora da região editada); depois, aceita-se a diferença de codificação.

## O que isso não muda
O jogo continua lendo `largura` e `altura` de `cenasArte.json`. Esta é uma regra de produção das imagens, sem mudar código.
