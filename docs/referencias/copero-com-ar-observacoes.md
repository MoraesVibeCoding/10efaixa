# copero.com.ar — "Convertite en leyenda": fluidez e efeitos

Jogado em 2026-10-06 em https://copero.com.ar/juegos/simulador-carrera, celular (390 × 844), navegador automatizado, em português. Várias carreiras completas (ponta, Brasil e Colômbia), de 16 a 40 anos. Pedido do usuário: "o nosso é mais completo em decisões, mas gostei da fluidez e dos efeitos".

Complementa `copero-observacoes.md` (copero.io) e `copero-net-observacoes.md`. **Nada é copiado:** nem texto, nem imagem, nem tela. Prints fora do repositório (nomes de clubes reais). As bandeiras e escudos vêm de `media.copero.com.ar`, que estava bloqueado na rede durante a sessão.

## 1. Ritmo

- **Uma carreira leva de 30 s a 2 min** jogando direto: a carreira anda de **2 em 2 anos**, com **uma decisão por vez**; entre uma e outra, a temporada se simula sozinha (~2 s) e os números se atualizam na tela.
- **Criação em 3 telas curtas**: nacionalidade (lista com busca), identidade (nome, número, perna) e posição num campo com **12 posições** (PE, CA, PD, ME, MEI, MD, LE, MC, LD, VOL, ZAG, GOL).
- Fim: "Sua carreira chegou ao fim" com jogos, gols, assistências e títulos (troféus em ícone), "Ver resumo" e "Jogar novamente".

## 2. Uma tela só para a carreira inteira

- **Topo fixo**: o Over num bloco grande na cor da faixa (laranja, prata, ouro), seleção, número, posição, clube, idade e valor de mercado.
- **Tabela da carreira sempre visível**: uma linha por período (idade, clube, OVR, jogos, gols, assistências), com as **idades futuras já desenhadas e vazias** (16, 18 … 38) que vão se preenchendo; a linha atual pulsa ("Escolhendo clube…", "Decisão de carreira…"). Uma linha da seleção fica no pé da tabela.
- **Cartão de decisão embaixo**, sempre no mesmo lugar: título, uma frase e 2 ou 3 opções lado a lado (com foto ao fundo, ou o clube da proposta), cada uma com as consequências em **pílulas verde/vermelha** ("Titular durante o próximo período", "−2 OVR temporário"). Em algumas, a consequência vem com **percentual** ("Titular 50% / Rotação baixa 50%").

## 3. Efeitos (medidos pelas animações da página)

| Efeito | Duração | Onde |
|---|---|---|
| Entrada de tela/cartão (fade + leve subida) | 300 ms | cada decisão nova, cada linha nova da tabela |
| Pulso da linha pendente | 2 s, contínuo | "Decisão de carreira…" |
| **Números rolando** (idade, valor de mercado, Over) | ~0,5–1 s | a cada período |
| **Carimbo de evento** (ícone grande + rótulo, ex.: "REBAIXAMENTO") por cima da tabela, depois marca pequena na linha | ~1,5 s | rebaixamento, acesso, título |
| **Celebração de troféu**: véu, brilho e partículas | 0,9–1,8 s | título; os troféus ficam como ícones na tabela |
| Cartão escolhido realça e os outros apagam | 300 ms | ao decidir |

## 4. O que vale aproveitar no 10eFaixa (proposta)

Em ordem de impacto na sensação de fluidez, sem perder o que temos a mais (decisões com peso, cenas pintadas, figurinha, reunião, idolatria):

1. **Trajetória visível na decisão**: uma faixa compacta da carreira (temporadas como linhas ou blocos que se preenchem), em vez de só na gaveta "Minha carreira". Mostra o progresso sem abrir nada.
2. **Números que rolam**: Over, idade, valor e salário animam do valor antigo ao novo (respeitando `prefers-reduced-motion`).
3. **Carimbo de momento**: título, acesso, rebaixamento, convocação e lesão grave entram como carimbo por ~1,5 s e deixam uma marca na temporada. Combina com os marcos da carreira (T25c) e o álbum.
4. **Celebração de título** curta (brilho + partículas), uma vez por título; o troféu vai para a trajetória.
5. **Transições de 300 ms** entre decisões (o cartão escolhido realça, o próximo entra), no lugar da troca seca de tela.
6. **Linha pendente pulsando** enquanto a temporada "joga" (estado de espera visível no ritmo Rápido).
7. **Aviso legal discreto** sobre nomes de clubes usados só para identificação (útil para a revisão jurídica do SPEC 11).

**Não aproveitar:** percentuais nas consequências (o SPEC v2.23 decidiu risco só em palavras) e números de atributo antes do cartão final.
