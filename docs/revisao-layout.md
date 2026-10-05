# Revisão de layout — tela de decisão, gaveta e resultado (2026-10-02)

Revisão completa do que existe hoje (T49) com as quatro ferramentas instaladas e com todas as ideias já combinadas (SPEC 7, v2.16–v2.25, `docs/referencias/copero-observacoes.md`). Feita com os textos novos dos 25 eventos, em 360×640, 390×844 e 1280×800.

**Nada foi alterado no layout por esta revisão.** Cada item traz a proposta; o que entra e quando é decisão sua.

## As quatro ferramentas e o que cada uma pôde fazer

| Ferramenta | Como foi usada | Limite |
|---|---|---|
| **Vercel Web Interface Guidelines** | Regras atualizadas baixadas do repositório da Vercel e aplicadas linha a linha em `Decision.tsx`, `Decision.css` e `base.css` | — |
| **Vercel React Best Practices** | Regras de re-render, renderização, bundle e JS aplicadas ao código da tela | Metade das regras é de Next.js e servidor: não se aplica |
| **Frontend Design** | Skill oficial lida do repositório da Anthropic (`anthropics/claude-plugins-official`) e aplicada como crítica de direção visual | O plugin ainda não está ativo na sua conta: li o texto, não rodei o plugin |
| **shadcn** | MCP instalado e respondendo; os padrões de `Dialog` e `Drawer` lidos no código-fonte deles (`shadcn-ui/ui`, `apps/v4/registry/new-york-v4/ui`) | A biblioteca deles (`ui.shadcn.com`) está bloqueada pela rede deste ambiente |
| **Magic (21st)** | Não usado | Plugin não ativo e exige a sua chave de API da 21st.dev |

## O que está bom

- Foco visível forte em tudo (contorno de 3px), inclusive no botão do resultado.
- Botões de verdade para toda ação; ícones decorativos com `aria-hidden`; troféus com `alt=""` e nome em texto.
- Barra de progresso com `role="progressbar"` e texto falado ("24 anos").
- Números com `tabular-nums`; dinheiro por `Intl.NumberFormat`; títulos com `text-wrap: balance`.
- `prefers-reduced-motion` respeitado; gaveta com `overscroll-behavior: contain`; área segura do iPhone no pé.
- A identidade é própria: cena pintada, cartão do OVR com a medalha da faixa, caixas com sombra dura verde.

## Achados, por prioridade

### P1 — atrapalham jogar ou ferem acessibilidade

1. **Em celular baixo (360×640) a tela passou a rolar** até 77 px com os textos novos, e a terceira opção fica cortada. A cena encolhe até quase sumir antes disso. `Decision.css:337-344`.
   *Proposta:* em altura até 680 px, a cena vira uma faixa fina e a ficha (idade, tempo de jogo, salário) recolhe para uma linha. Alternativa: aceitar a rolagem, mas com as opções sempre inteiras.

2. **A gaveta e o resultado não prendem o foco.** Os dois se declaram janela (`aria-modal`), mas o Tab escapa para a tela de trás, o fundo continua clicável por teclado e o Esc da gaveta só funciona com o foco dentro dela. `Decision.tsx:161-165` e `:244-245`.
   *Proposta:* usar o `<dialog>` nativo do navegador com `showModal()`, que já traz fundo inerte, Esc e retorno do foco, sem dependência nova. É o mesmo comportamento do `Dialog` e do `Drawer` do shadcn (camada de fundo, título e descrição ligados, botão de fechar, foco devolvido), sem trazer Radix, vaul nem Tailwind.

3. **O resultado some sozinho em 2,6 s.** Quem usa leitor de tela, ou lê devagar, pode perder o ganho e a perda (WCAG 2.2.1, tempo ajustável). `Decision.tsx:240`.
   *Proposta:* no ritmo normal, o resultado fecha só pelo botão "Seguir"; o fechamento automático fica só no ritmo Rápido, que o jogador escolhe (já previsto na T51: "tempo do resultado por ritmo").

4. **Opções que são só ação continuam com "Sem efeito imediato"**: "Aceitar e vestir a camisa do rival" e "Entrar com uma parte grande do que você tem". O maior custo da decisão (virar vilão, arriscar o patrimônio) não aparece. `Decision.tsx:348`.
   *Proposta:* uma linha "Muda" com a consequência em palavras ("vai para o rival", "risco alto no patrimônio"), já prevista na T51.

### P2 — importantes, sem bloquear

5. **No computador, a tela é a coluna do celular com 70% de espaço vazio.** A ideia combinada (Copero, T51) são três colunas:

   ```
   ┌─────────────┬──────────────────────────┬──────────────┐
   │ JOGADOR     │ CENA                     │ TRAJETÓRIA   │
   │ OVR, ficha, │ título + história        │ idade·clube· │
   │ atributos,  │ opção 1                  │ OVR, jogos,  │
   │ títulos     │ opção 2                  │ gols         │
   │             │ opção 3                  │              │
   └─────────────┴──────────────────────────┴──────────────┘
   ```
   No celular, as colunas laterais continuam na gaveta "Minha carreira".

6. **O risco aparece só no texto da opção.** Na lesão, a prévia mostra apenas "Moral ↓", e o que pesa de verdade (tempo fora, recaída) não está em "Em troca".
   *Proposta:* acrescentar à prévia uma linha "Risco: recaída alta" ou "Fora: um ano", gerada pela mesma faixa de `preview.json` usada no texto, para nunca divergir.

7. **Direção visual (Frontend Design).** Dois traços que a skill aponta como "cara de página gerada":
   - **Rótulos pequenos em CAIXA ALTA espaçada em toda parte:** IDADE, TEMPO DE JOGO, VOCÊ GANHA, EM TROCA, MINHA CARREIRA, ATRIBUTOS. *Proposta:* deixar a caixa alta só nos títulos em Big Shoulders e passar os rótulos para minúsculas com peso.
   - **"Meia · Flamengo" com ponto médio.** *Proposta:* "Meia do Flamengo".

   Já o fundo creme, que a skill também cita, foi escolha sua (referência 7a0, v2.19) e fica. A recomendação dela, "ousar num lugar só", combina com o que já temos: cena e cartão do OVR são o destaque, e o resto fica quieto.

8. **A imagem da cena não tem largura e altura no HTML nem prioridade de carga.** Ela pode "pular" ao carregar. `Decision.tsx:288`. *Proposta:* `width`/`height` e `fetchpriority="high"`.

9. **Faltam `<meta name="theme-color">` e `color-scheme: light`** em `index.html`, o que afeta a barra do navegador no celular e os controles nativos.

10. **"Seguir" e "Fechar" não reagem ao passar o mouse** e não têm `touch-action: manipulation` (atraso de toque duplo). `Decision.css:247` e `:288`.

### P3 — polimento

11. `clubOf` procura o clube na lista inteira a cada uso (duas vezes por linha da trajetória). Um mapa por id resolve. `Decision.tsx:63`.
12. `hasText` (`Decision.tsx:379`) existia porque 23 eventos não tinham texto. Agora um teste garante texto em todos, e ele pode sair.
13. O pacote da tela tem 359 kB (111 kB comprimido), porque todos os dados do jogo entram nele. Medir de novo quando a T51 ligar o motor e, se pesar, carregar a gaveta e os dados sob demanda.
14. As fontes não são pré-carregadas. Considerar `preload` da Big Shoulders, que aparece no primeiro quadro.
15. **Ignorado de propósito:** a regra de Title Case da Vercel é do inglês. Em português, a norma é só a primeira letra maiúscula.

## As ideias combinadas e onde cada uma entra

| Ideia | Situação | Onde |
|---|---|---|
| Troféus por competição | Provisórios na gaveta; arte final no lote 5 | feito / arte |
| Risco em palavras, nunca percentual | No texto das opções de lesão e Copa | feito (v2.23); prévia no P2-6 |
| Três colunas no computador | Proposta acima | T51 |
| Ritmo acontecimento → fechamento → mercado | — | T51 |
| Cartões de proposta comparáveis | — | T51 |
| Jogos e gols na trajetória | — | T51 |
| Resultado das escolhas que são só ação | P1-4 | T51 |
| Tempo do resultado por ritmo | P1-3 | T51 |
| Criação com camisa ao vivo | — | T50 |
| Janela de conquista e linha do tempo | — | T55 |

## Sugestão de ordem

1. **T49b (pequena, antes da T50):** P1-1, P1-2, P2-8, P2-9, P2-10. Fecham acessibilidade e celular baixo sem mudar o visual aprovado.
2. **Decisão sua:** P2-7 (caixa alta nos rótulos e o ponto médio), porque mexe na cara da tela.
3. **Na T51, como já previsto:** P1-3, P1-4, P2-5, P2-6.
