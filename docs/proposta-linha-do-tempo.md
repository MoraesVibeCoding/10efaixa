# Proposta: linha do tempo por idade antes do cartão (SPEC 6.15) — aguardando "DE ACORDO"

> Nada foi codado. Origem: o usuário não gostou da tela "Sua história" (frases em lista) e pediu uma linha do tempo de idade, com Over e títulos (2026-10-07). Escolhas já feitas: lista vertical por idade; troca pelas frases; cada linha mostra também clube e divisão.

## Objetivo
Trocar a tela "Sua história" por **"Sua carreira"**: uma lista vertical, uma linha por temporada, com **idade, clube e divisão, Over e títulos do ano**, que leva ao cartão final.

## Desenho
- Cabeçalho: nome do jogador e "Sua carreira".
- Cada linha: **idade** em destaque ("24 anos"), **emblema original + nome do clube** e a divisão em texto, **Over** em número e, quando houver, os **títulos do ano** (nomes descritivos de `competitions.json`, nunca oficiais).
- Marcas: o **auge** (maior Over) recebe um destaque; mudança de clube vira um separador sutil. Sem lesões e sem Seleção (fora do escopo, como você escolheu).
- Rola se a carreira for longa; o botão "Ver cartão" fica sempre visível no rodapé.
- As frases de hoje saem desta tela, **mas continuam no cartão narrativo** (Cerca de Chesterton: `storyOf` alimenta o cartão e não é removido).

## Regras do projeto que esta tela toca (precisam de aprovação)
- **Over em número antes do cartão final:** o CLAUDE.md só abre a exceção do overall na tela de decisão. Esta tela vem depois do fim da carreira, logo antes do cartão, que já revela os números do pico. **Proposta: estender a exceção do overall a esta tela.** Os 10 atributos continuam sem número.
- Todo texto em `src/i18n/pt-BR`; WCAG 2.1 AA: lista semântica (`<ol>`), cada linha lida como uma frase ("Aos 24 anos, no Flamengo, Série A, Over 78, campeão de..."), foco no título, contraste dos tokens atuais.

## Dados (sem mexer no balanceamento)
- `result.seasons` já tem ano, clube, divisão e Over. **Falta a idade:** proposta de campo aditivo `age` em cada temporada (`evo.age − 1` no ponto em que a temporada é registrada). É derivado, sem sorteio novo: a mesma semente dá a mesma carreira, e as simulações de equilíbrio não mudam.
- Títulos do ano: `result.titles` filtrado por `year`.
- Saves e links não mudam (a carreira é refeita a partir das escolhas).

## Estratégia de teste
- **Unitários:** `timelineOf(result)` (uma linha por temporada, idade crescente, títulos do ano certo, auge marcado uma vez, separador de clube só na troca); campo `age` bate com o `peakAge` e com o `endAge`.
- **Integração:** a tela mostra as linhas e o botão "Ver cartão"; o link "rever carreira" abre a mesma tela; teclado e leitor de tela (rótulos).
- Regressão: a suíte atual (inclusive `report` de simulação) continua igual com o campo novo.

## Tarefas atômicas
| ID | Tarefa | Critério |
|---|---|---|
| T55f | Campo `age` em `result.seasons` | Idade da última temporada = `endAge`; nenhum resultado existente muda |
| T55g | `timelineOf(result)` (modelo da tela) | Testes unitários acima |
| T55h | Tela "Sua carreira" no lugar de "Sua história" | Linhas, auge, títulos, WCAG, i18n; conferido em 390×844 |
| T55i | SPEC v2.51 e `current-task.md` | Registro da decisão e da exceção do Over |

## Limites (fora)
Gráfico de evolução, lesões e Seleção na linha, compartilhar a tela como imagem, mudança no cartão final.
