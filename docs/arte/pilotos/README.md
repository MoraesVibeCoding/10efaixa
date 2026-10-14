# Pilotos da nova pipeline de cenas (SPEC v2.100)

**Pergunta do piloto:** qual é a menor mudança que dá cenas de qualidade, com o mesmo jogador em todas, 9 formatos de cabelo, 4 tons de pele e 524 uniformes, sem uma nova geração de IA por combinação?
**Regra:** nenhum lote de 225 imagens antes de este piloto responder. Nada do jogo muda; o sistema atual segue como fallback.

Ideias de duas opiniões externas (uma delas aponta a tolerância de 1856×2304 vs 4:5 e a regra "a preservação vem da composição, não da promessa do modelo"). Nada aqui é resultado validado; é protocolo.

## Os três braços

| Braço | O que é | Quando entra |
|---|---|---|
| **A. Editar e recompor** | Pega uma pintura atual aprovada; pede à IA só a cabeça e o cabelo novos; `recompor_regiao.py` cola **só a região autorizada** de volta no original. Pele, cor do cabelo e uniforme por código. | Já |
| **B. Camadas** | Cenário vazio + jogador isolado em fundo verde + figurantes + objetos (as 25 camadas de `docs/arte/testes-de-cenas`); `compor_camadas.py` junta. Uniforme por código. | Já |
| **C. 3D como fonte de geometria** | Um personagem 3D original só para gerar silhueta, máscaras e mapas; a IA dá o acabamento. | **Só se A e B falharem** em consistência do corpo ou no mapeamento da roupa |

## Cenas do piloto (casos difíceis)
- **Gol (comece por esta no braço A):** braços abertos, mangas em posições difíceis. A: `docs/arte/cenas/12-gol/curto/imagem.jpeg` (**1856×2304**, alta resolução); B ainda não tem camadas.
- **Estádio:** movimento, torcida, sobreposição de personagens. A: `docs/arte/cenas/21-estadio/curto/imagem.jpeg`, mas esta imagem tem só **825×1024** (provisória); B: `testes-de-cenas/02-estadio`.
- **Vestiário:** jogador **sentado**, sem camisa; só o braço B tem camadas (`testes-de-cenas/03-vestiario`); A usa `docs/arte/cenas/02-vestiario`. Ainda não testado com uniforme.

Cenas já em camadas além dessas: treino, pênalti e casa da família.

## Matriz do piloto (não precisa esgotar; precisa expor os casos difíceis)
- **Cabelos:** curto, tranças, coque.
- **Peles:** `t2`, `t5`, `t7`, `t9` (clara, morena, parda, negra).
- **Uniformes da Série A** (já temos as texturas): Santos (claro liso), Palmeiras (escuro liso), Flamengo (faixas horizontais), Fluminense (listras verticais), Vasco (diagonal), Mirassol (mangas e gola contrastantes).
- **Cabelo em duas cores extremas** (platinado e preto), só em casos selecionados.

## Braço A, passo a passo
1. Escolha a pintura atual e a caixa de edição (tabela abaixo; vale para o corte `curto`; para cabelo longo, coque ou tranças a caixa **inclui** o ombro e o espaço acima da cabeça).
2. Peça à IA a variante usando o prompt pronto de `docs/arte/pilotos/prompt-edicao-cabelo.md`, anexando a pintura original.
3. Salve a imagem editada e rode:
   `python3 docs/arte/recompor_regiao.py original.png editada.png final.png x0,y0,x1,y1 4`
   O relatório deve dar `fora_diferentes: 0`.
4. Revise a borda e a luz; registre a tentativa.

| Cena | Caixa sugerida de cabelo (x0, y0, x1, y1, em frações) |
|---|---|
| treino | 0.386, 0.012, 0.726, 0.282 |
| estádio | 0.328, 0.046, 0.668, 0.316 |
| gol | 0.332, 0.115, 0.672, 0.385 |
| pênalti | 0.337, 0.027, 0.677, 0.297 |
| vestiário | a medir (o jogador está sem camisa; a máscara da camisa é a das camisas do armário) |

Caixas calculadas pela camisa do jogador em `cenasArte.json` (centro da camisa ± 0,17 de largura; 0,20 acima do topo da camisa até 0,07 abaixo). Ajuste olhando a imagem.

## Braço B, passo a passo
1. Gere as camadas de uma cena na ordem do `README.md` dela (cenário, jogador curto, jogador coque, fixos, figurantes, objetos).
2. Salve cada uma como `imagem.jpeg` na própria pasta.
3. Avise; o compositor lê `montagem.json`, tira o fundo verde, ajusta cada elemento à caixa-alvo, desenha a sombra e empilha; depois o uniforme e a pele entram por código.

## O que registrar em toda tentativa (`registro-do-piloto.csv`)
Braço, cena, cabelo, pele, uniforme, tentativa, minutos de intervenção humana, custo, resultado em 360 px, resultado na resolução de trabalho, aprovada (sim/não), motivo da rejeição.
Cada saída aprovada também entra em `docs/arte-registro.csv` (ferramenta, versão, licença, data, prompt, referências, hash).

## Verificações objetivas
Pixels idênticos fora da região editada (antes do WebP); máscaras sem vazamento; calção e meiões independentes; padrão só nas regiões previstas; dimensões conforme `docs/arte/contrato-de-dimensoes.md`; alerta de OCR e de logotipo como **filtro de risco, não certificação**.
**Revisar 100% das saídas do piloto.** Só passar a amostragem depois de conhecer os erros recorrentes; nova pose, novo formato de cabelo e novo tipo de uniforme sempre passam por revisão.

## Leitura humana (comparação lado a lado, no tamanho do celular)
Parece a mesma pessoa nas cenas? Parece a mesma obra? O cabelo é distinguível a 360 px? A camisa preta conserva volume? A pele clara conserva contorno? O cabelo longo respeita ombros e gola? O jogador sentado está integrado ao banco?

## Regra de decisão
- Se **A** (ou **B**) entrega qualidade e baixa intervenção, aproveitar as pinturas atuais e expandir.
- Se cada nova pose exigir correção recorrente, migrar a geometria do protagonista para **3D**.
- Se o render 3D não integrar na pintura, manter a produção 2D enquanto o acabamento é desenvolvido.
- **Não treinar LoRA nem gerar o catálogo inteiro** antes de esta comparação responder ao gargalo principal.
- "Regenerar tudo em uma noite" só se mede no piloto (geração, composição, validação separadas). Ainda não há dados.

## Licenças (cautelas, a confirmar nos termos oficiais)
CatVTON: uso não comercial. FLUX.1 Fill [dev]: o uso do modelo é não comercial sem licença adicional, embora as saídas possam ser comerciais. Não usar nenhum dos dois na pipeline comercial sem acordo. Uniformes reais: a revisão jurídica continua pendente (SPEC v2.98).
