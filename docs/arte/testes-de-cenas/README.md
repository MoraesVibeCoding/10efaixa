# Testes de cenas por camadas (SPEC v2.99)

**Objetivo:** descobrir se montar cada cena em camadas (cenário, elementos fixos, figurantes, jogador e objetos) dá imagens melhores e mais flexíveis do que gerar a cena inteira de uma vez.
São **5 cenas de tipos diferentes** e **25 camadas** no total. Cada camada tem `prompt.md`; salve a imagem na mesma pasta como `imagem.jpeg`.

| Cena | Tipo | Camadas | Pastas |
|---|---|--:|---|
| `01-treino` | Treino | 6 | 01-cenario, 03-companheiros, 03-tecnico, 04-jogador-correndo-curto, 04-jogador-correndo-coque, 05-bola |
| `02-estadio` | Estádio | 6 | 01-cenario, 03-adversarios, 03-companheiros, 04-jogador-conduzindo-curto, 04-jogador-conduzindo-coque, 05-bola |
| `03-vestiario` | Vestiário | 4 | 01-cenario, 02-fixo-camisas, 04-jogador-sentado-no-banco-curto, 04-jogador-sentado-no-banco-coque |
| `04-penalti` | Pênalti | 5 | 01-cenario, 03-goleiro, 04-jogador-parado-curto, 04-jogador-parado-coque, 05-bola-na-marca |
| `05-casa-familia` | Em casa com a família | 4 | 01-cenario, 02-fixo-sofa-com-a-familia, 04-jogador-no-banquinho-curto, 04-jogador-no-banquinho-coque |

**Por que estas cinco:** treino (corrida), estádio (muita gente), vestiário (jogador sentado, interação), pênalti (goleiro) e casa da família (roupa civil).

## Regras que valem para tudo
- Mesma tela em todas as camadas: 4:5, 1856×2304.
- Cada cena tem uma **ficha** (câmera, luz, paleta, mapa de posições) colada **igual** nos prompts da cena.
- Elementos soltos: **fundo verde chapado #00B140**, sem chão e sem sombra (a sombra eu faço por código).
- O jogador sai de costas, com **camisa magenta e calção e meiões ciano**, em dois formatos de cabelo: **curto** e **coque**. Pele marrom e cabelo castanho-escuro de propósito (o código recolore pele e cor do cabelo).
- Onde jogador e objeto se tocam (banco, banquinho, sofá), os dois saem na mesma camada.
- Nada de texto, logos, escudos, patrocínio, rosto do jogador ou pessoa real.

## Como gerar (por cena)
1. Gere o **cenário** primeiro.
2. Gere o **jogador de cabelo curto** anexando o cenário como referência de câmera, luz e escala.
3. Gere o **coque** anexando o jogador curto (instrução dentro do arquivo).
4. Gere os **fixos, figurantes e objetos**, anexando o cenário como referência.
5. Salve cada um como `imagem.jpeg` na própria pasta e avise.

## Como vamos decidir se houve melhoria real
Para cada cena eu monto as camadas (`montagem.json`: posição, escala e ordem), aplico 4 uniformes da Série A e 2 tons de pele, e preenchemos juntos `avaliacao.md`:
acabamento, integração do jogador, mesmo corpo nos dois cabelos, uniforme sem vazamento, história da cena. **Melhoria real** = empata ou ganha em 4 de 5 critérios, sem nota abaixo de 3, com esforço razoável.

## Observação sobre a montagem
Cada camada traz o alvo (caixa em frações da tela). Eu ajusto automaticamente escala e posição de cada elemento para a caixa; o `montagem.json` guarda isso. Nada disso muda o jogo.
