# Product

<!-- impeccable:product-schema 1 -->

> Resumo do produto para o trabalho de design. A fonte da verdade é o `SPEC.md`; se houver divergência, vale o SPEC.

## Platform

web

## Users

Torcedores brasileiros de 14 a 40 anos, que jogam no celular e compartilham no WhatsApp e nas redes (SPEC 2).

Situação de uso, confirmada em 2026-10-02: os dois modos, conforme o ritmo escolhido. No ritmo Rápido, sessões curtas com uma mão, em intervalos (ônibus, fila, sofá), com atenção dividida. No ritmo Completo, leitura com calma, com tempo para a narrativa.

## Product Purpose

Simulador de carreira de jogador de futebol, focado no futebol brasileiro, jogado no navegador. O jogador cria um atleta e vive a carreira dos 16 anos à aposentadoria, tomando decisões que mudam evolução, clubes, dinheiro, Seleção e legado. O objetivo simbólico dá nome ao jogo: vestir a camisa 10 e usar a faixa de capitão da Seleção.

Sucesso na Fase 1 (SPEC 8): ao menos 60% das carreiras iniciadas chegam ao fim; ao menos 15% das concluídas são compartilhadas; ritmo Rápido em até 6 minutos e Normal em até 18; retorno em 7 dias de ao menos 10%.

## Positioning

Um simulador de carreira rápido e compartilhável na língua do torcedor brasileiro: várzea, peneira, Copinha, estaduais, bicho, salário atrasado e clássicos, com mais detalhe no Brasil do que na Europa. A evolução do jogador é acompanhada e negociada com a comissão técnica, e não só sorteada.

## Operating Context

- Carreira completa sem cadastro, com save local no navegador.
- Três ritmos: Rápido (~5 min), Normal (~15 min), Completo (livre).
- Uma decisão por tela, sempre com uma cena pintada ao fundo. As cenas têm os 40% de baixo escuros para receber os painéis da interface.
- Antes de decidir, o jogador vê a prévia das consequências de cada opção em sentido e intensidade, nunca em números (T41b).
- No fim, um cartão 1080×1350 para compartilhar, com veredito, rótulo e os números do auge.

## Capabilities and Constraints

- Stack: Vite 8, React 19, TypeScript estrito, Vitest 5. Hospedagem na Vercel, como PWA.
- Motor puro e determinístico em `src/engine`; a interface só lê o estado.
- Todo texto visível ao jogador fica em `src/i18n/pt-BR`, nunca no código.
- Nenhum número de atributo aparece antes do cartão final: só estrelas e faixas.
- Fora da v1: anúncios, contas, ranking online, app nativo, partidas lance a lance, outros idiomas.

## Brand Commitments

- Nome: **10eFaixa**. O número gigante é o elemento memorável; a faixa horizontal carrega informação (progresso, faixas de atributo, veredito).
- Paleta fixa (SPEC 7): Cal de campo `#F2F4EF`, Marinho de vestiário `#14213D`, Amarelo braçadeira `#FFC21A` (único destaque), Verde gramado `#1E7B4F` (só evolução positiva), Vermelho cartão `#D62839` (só lesão, queda e alerta), Cinza de linha `#C9CFC6`.
- Tipografia fixa: Big Shoulders Display (números e títulos) e Atkinson Hyperlegible (texto), sempre com fonte reserva.
- Tema: escuro nas telas com cena, em cinza neutro para não disputar com as cores dos clubes; nas telas de formulário, a preferência do aparelho.
- Movimento: um único momento animado (o número "carimbando" na abertura).
- Tom de voz: direto, coloquial, frases curtas, sabor de narração de rádio. Botões dizem o que acontece ("Aceitar proposta", "Ficar no clube"). Zoeira só com o próprio jogador.
- Sem escudos oficiais, sem marcas, sem imagem de pessoa real.

## Evidence on Hand

- Cenas pintadas em `docs/arte/cenas/` e retratos em `docs/arte/retratos/` (lotes em andamento; uniforme em magenta e ciano para troca de cor por código).
- Tela de abertura em `docs/arte/abertura/imagem.jpeg`.
- Textos reais do jogo em `src/i18n/pt-BR/`.
- Não existem depoimentos, números de uso nem imprensa: nada disso pode ser inventado.

## Product Principles

1. Uma decisão por tela: o jogador sempre sabe o que está decidindo e o que cada opção provoca.
2. Brasil primeiro: linguagem, lugares e situações do futebol brasileiro, sem tradução do europeu.
3. Mistério até o fim: faixas e estrelas durante a carreira, números só no cartão.
4. Feito para compartilhar: o cartão final é o que traz a próxima pessoa.
5. Rápido de verdade: cabe num intervalo, com uma mão, em celular modesto.

## Accessibility & Inclusion

WCAG 2.1 AA em toda tela: teclado, foco visível, contraste, leitor de tela e `prefers-reduced-motion`. Toda cena tem texto alternativo. Aparência (tom de pele, cabelo) nunca altera o jogo.
