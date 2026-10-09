# Roadmap do 10eFaixa

> Atualizado em 2026-10-08 (SPEC v2.60, catálogo com 84 eventos). Fonte da verdade: `SPEC.md` (seção 14 traz a lista completa de tarefas). Validação do usuário: `docs/validacao-final.md`.

## Já implementado

| Marco | O que está pronto |
|---|---|
| **1 — Motor núcleo** (T01–T13b) | PRNG com semente, 10 atributos e overall por posição, 21 estilos (3 por posição), biotipo e estirão, criação do jogador, curvas de idade, evolução por semestre, reunião, traços por foco, i18n pt-BR, apelidos, simulação em massa e recalibração por origem |
| **2 — Brasil** (T14–T24b) | Calendário real, 4 séries e rivais, clube de coração, estaduais, copas e Libertadores/Sul-Americana, início por origem (base, peneira, várzea), minutos/forma/moral, clássicos e idolatria, vida de clube, camisa 10 e faixa; carreira integrada e determinística |
| **3 — Carreira e mercado** (T25–T34, parcial) | Motor de eventos; **marcos (T25c)**: 20 marcos com ritmo, figurinhas e álbum; **memória (T25d)** e **eventos modulares (T25e)**: etiquetas de contexto, texto em camadas, sorteio de catálogo; empresário, contratos e multa, valor de mercado e propostas; **tela de contratos (T28b–m)** com papel por idade, minutos em curva contínua e marca "jogará mais/menos"; 6 ligas europeias; lesões, mudança de posição, disciplina, retorno ao clube e aposentadoria |
| **4 — Seleção e legado** (T35–T41b) | Seleção, efeito e decaimento, Copa do Mundo/Copa América/Olimpíadas, dupla nacionalidade, prêmios, nota de legado, vereditos, manchetes e prévia de consequências |
| **5 — Avatar, cenas e arte** (T42–T47) | Skill de arte, avatar em camadas, compositor de cenas, catálogo de cenas, validador de entregas, arte provisória completa, cenas pintadas na decisão e na criação; **18 troféus criados pelo usuário** processados em WebP (selo, gaveta e linha do tempo) |
| **6 — Produto** (T48–T57, T61 parcial) | Máquina de estados, tokens e tema, criação, decisão com cena, selo de momento e "isso vai pesar", **reunião em 3 ideias (v2.53) com a 1ª opção sempre aceita (v2.58)**, ritmos Rápido/Normal/Completo, save versionado, **reiniciar carreira em qualquer tela**, **"Sua carreira" ano a ano com gols, assistências e troféus (v2.60)**, cartão 1080×1350, compartilhamento, desafio do dia e link da carreira; ícone e manifesto (PWA parcial); link de teste na Vercel |
| **Regras novas recentes** | Clubes de elite mundial (v2.59), 6 níveis de reputação com minutos decrescentes em clube maior (v2.54–55), troféu dentro do selo (v2.56) |

Verificação atual: 1284 testes passando, typecheck e build OK, `verify` do CI verde.

## A fazer (na ordem prevista)

### 1. Fila atual de histórias e equilíbrio
| Item | O que falta |
|---|---|
| **T25b — catálogo de eventos** | **Meta atingida: 84 eventos** (20 marcos, 25 originais, 39 de sorteio em 3 lotes: campo e postura, campo/clube/vida, campo/rotina/vida). Lotes 1 e 2 aprovados; lote 3 aguarda aprovação. Falta só a medida final do equilíbrio de decisões |
| **Equilíbrio das decisões** | Reduzir reuniões, contratos e vida pessoal e aumentar as decisões de campo (`docs/revisao-equilibrio-decisoes.md`); medir depois da T25b |
| **Etiquetas raras** | `perdeuFinal`, `trocouPeloRival`, `noClubeDeCoracao`, `foraDoEixo` quase nunca aparecem; ajustar ou ligar a eventos |
| **"Bola parada"** | Ligar o progresso do foco ao marco "assumir a bola parada" |
| **Manchete do cartão** | Marco na manchete final |
| **Resumo da temporada (v2.61)** | **Feito:** card com números do ano, Over de-para, atributos em palavras e comentário do técnico (Normal e Completo); reuniões com rótulo de fim e meio de temporada |

### 2. Tarefas pendentes do SPEC
| ID | Tarefa |
|---|---|
| **T29b** | 2ª divisão das 6 ligas europeias (clubes, formato, acesso e rebaixamento, com fonte e data) |
| **T50f** | Sonho da carreira escolhido na criação |
| **T54b** | Último jogo e "Obrigado por tudo" |
| **T58** | Apoio (Apoia.se), aviso legal e página de privacidade |
| **T59** | Vercel Web Analytics + Sentry, sem dados pessoais |
| **T60** | Integração da arte final gerada por IA (⛳ parada obrigatória) |
| **T61** | PWA completo, domínio 10efaixa.com e E2E finais (⛳) |

### 3. Qualidade e fechamento
- **Validação final** com 1000+ carreiras (T28f, simulação pareada de estilos) e sanidade da seção 9.3.
- **Sua validação** de todas as histórias e textos, na lista `docs/validacao-final.md` (contratos, marcos, memória, contexto, reunião, elite, linha do tempo, troféus).
- **Bug em aberto (iPhone/Safari):** "A comissão topou" não sai ao tocar em Seguir; suspeita no `<dialog>`. Precisa da versão do iOS ou da sua autorização para trocar por aviso comum.
- **Revisão jurídica** de clubes, emblemas e nomes (os 7 clubes de elite incluídos) antes do lançamento.
- **Dívidas técnicas:** tema escuro e cartão em canvas com cores antigas; lado (esquerdo/direito) fora da figurinha e dos textos; tom de pele das cenas pintadas; bundle acima de 500 kB; simulação de legado com semente correlacionada.
- **Conferir visual:** prévia da Vercel está indisponível por limite diário; conferir troféus e linha do tempo quando liberar.

## Pontos de parada (⛳) à frente
T60 (cenas com arte final) e T61 (lançamento), além do fim de cada marco e de qualquer mudança de escopo.
