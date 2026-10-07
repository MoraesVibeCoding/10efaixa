# T25e: eventos modulares e sorteio por contexto (SPEC 6.13c) — decisões tomadas dentro do SPEC aprovado

> Origem: a decisão v2.52 (fazer todas as histórias primeiro) e a tabela da T25e do SPEC. Nada aqui muda regra de jogo já aprovada; define o formato em dados. Validação: no fim, na página de leitura.

## Diagnóstico
Os 25 eventos de hoje disparam por código (festa, polêmica, casa...), não pelas `condicoes` do catálogo; só os 20 marcos e a reunião/proposta têm tela própria. Para a T25b (80+ eventos) precisa de um **sorteio de catálogo por contexto**, e para o texto não soar igual em carreiras diferentes, **texto em camadas**.

## Peças
1. **Etiquetas de contexto** (`src/data/contextTags.json`, `src/engine/contextTags.ts`): a situação do jogador em palavras de motor — jovem, veterano, ídolo, vilão, moral baixa, salário atrasado, no banco, posição disputada, convocado, subindo/caindo de divisão, fora do eixo, empresário que pressiona, clube de coração, capitão e as memórias da T25d. Cada uma é uma condição sobre o contexto (`contextCtx`); a **ordem do arquivo é a prioridade**.
2. **Texto em camadas** (`src/engine/contextText.ts`; textos em `src/i18n/pt-BR/events.json`): `texto` (base) + **abertura** (frase pela etiqueta mais forte que o evento conhece) + **até 2 frases de contexto** (etiquetas que o evento conhece, por prioridade) + **ajuste das consequências** por etiqueta em dados (`ajustes`, efeitos extras só em campos já existentes). Evento sem camada continua igual ao de hoje.
3. **Sorteio de catálogo** (`src/engine/contextDraw.ts`): eventos com `"sorteio": true` entram por condição, **peso × peso do temperamento × reforço por etiqueta**; o evento **não repete** na carreira salvo `recorrente`; cota por semestre em dados (`context.json`). Usa **gerador próprio** (semente da carreira + ano + semestre), então não desloca nenhum sorteio do resto da carreira.
4. **Proposta com contexto:** a tela de contratos ganha 1 frase de contexto sob o apoio (etiqueta mais forte da situação).

## Teste
Sorteio de **10 mil contextos** por evento do catálogo: texto completo (sem parâmetro faltando), dentro do limite de tamanho (`limiteTexto` em `context.json`), sem etiqueta citada que não valha; peso por temperamento muda a frequência na direção certa; nenhum evento repete.

## Fora do escopo desta etapa
Escrever os 55+ eventos novos (T25b, em lotes, com a skill de narrativa; o usuário valida no fim) e usar memórias nos textos (T25b).
