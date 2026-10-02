"""Gera docs/arte/emblemas/<clube>/prompt.md para os 20 clubes da Série A (T49d, SPEC v2.26).

Cada emblema é ORIGINAL: evoca o nome ou a cidade do clube. A lista "Evitar" vem da memória do assistente e
NÃO foi conferida em fonte (sites bloqueados no ambiente): confira antes de gerar e na revisão jurídica.
Rodar: python3 docs/arte/gerar-emblemas.py
"""
from pathlib import Path

ROOT = Path(__file__).parent / "emblemas"

# clube: (nome, forma, símbolo em pt, símbolo em inglês para o prompt, evitar, origem do conceito)
CLUBES = {
    "flamengo": ("Flamengo", "escudo", "chama", "a single stylised flame rising from the bottom, with diagonal bands at the base", "monograma do clube, listras do escudo oficial, urubu (mascote)", "usuário"),
    "fluminense": ("Fluminense", "círculo", "rio entre morros ('flumen' é rio em latim)", "a winding river flowing between two rounded hills", "monograma, forma do escudo oficial, mascote", "proposta"),
    "vasco": ("Vasco da Gama", "escudo", "astrolábio do navegador que dá nome ao clube", "a navigator's astrolabe (a ring with a cross-bar and a pointer)", "cruz de malta, caravela, faixa diagonal do escudo, monograma, mascote", "proposta"),
    "botafogo": ("Botafogo", "escudo", "morro e enseada do bairro que dá nome ao clube", "a tall rounded rock hill over a calm bay with a curved shoreline", "estrela solitária, escudo preto oficial, monograma, mascote", "proposta"),
    "palmeiras": ("Palmeiras", "hexágono", "palmeira", "a single palm tree with a round sun behind it and a band of ground", "letra do escudo oficial, forma redonda do escudo, periquito e porco (mascotes)", "usuário"),
    "corinthians": ("Corinthians", "círculo", "capitel de coluna coríntia (o nome vem do estilo grego)", "the capital of a Corinthian column, with acanthus leaves, seen from the front", "âncora, remos, bandeira estadual do escudo oficial, monograma, mosqueteiro (mascote)", "proposta"),
    "sao-paulo": ("São Paulo", "escudo", "silhueta de arranha-céus da cidade", "a simple skyline of three tall generic skyscrapers", "forma triangular do escudo oficial, monograma, mascote", "proposta"),
    "santos": ("Santos", "círculo", "vela e ondas de cidade portuária", "a sailboat with two triangular sails over two waves", "monograma, listras do escudo oficial, baleia e peixe (mascotes)", "usuário"),
    "bragantino": ("Red Bull Bragantino", "escudo", "colinas da serra perto de Bragança Paulista, com sol", "rolling hills with a rising sun", "touro e qualquer elemento da marca Red Bull (marca registrada de empresa), logotipo, monograma", "proposta"),
    "mirassol": ("Mirassol", "círculo", "sol nascente ('mira o sol')", "a large rising sun with rays over a horizon line", "leão (mascote), monograma, forma do escudo oficial", "proposta"),
    "atletico-mg": ("Atlético-MG", "escudo", "serra que contorna Belo Horizonte", "a mountain ridge with three peaks over a city line", "galo (mascote), monograma, estrelas", "proposta"),
    "cruzeiro": ("Cruzeiro", "círculo", "lua crescente sobre a lagoa (sem estrelas)", "a crescent moon above a calm lake with gentle ripples", "constelação e estrelas (estão no escudo oficial), raposa (mascote), monograma", "proposta"),
    "gremio": ("Grêmio", "escudo", "pôr do sol sobre o lago da cidade", "a setting sun touching a wide lake, with long reflection lines", "mosqueteiro (mascote), monograma, estrelas", "proposta"),
    "internacional": ("Internacional", "círculo", "globo com meridianos (o nome 'Internacional')", "a stylised globe with two meridians and the equator", "monograma, saci (mascote), estrelas", "proposta"),
    "athletico-pr": ("Athletico-PR", "escudo", "raio", "a bold lightning bolt crossing the badge diagonally", "furacão (apelido e mascote), monograma, listras do escudo oficial", "proposta"),
    "coritiba": ("Coritiba", "quadrado arredondado", "araucária, árvore-símbolo do Paraná", "a single araucaria tree (umbrella-shaped pine) over rolling hills", "monograma, mascote; CONFERIR se a araucária já apareceu em algum escudo do clube", "usuário"),
    "bahia": ("Bahia", "escudo", "farol à beira-mar de Salvador", "a striped lighthouse on rocks by the sea", "monograma, estrela, mascote", "proposta"),
    "vitoria": ("Vitória", "círculo", "ramo de louros da vitória", "a laurel wreath, open at the top", "leão (mascote), monograma, listras do escudo oficial", "proposta"),
    "remo": ("Remo", "escudo", "canoa e ondas do rio de Belém", "a long river canoe over two river waves", "remos cruzados (CONFERIR se estão no escudo oficial), leão (mascote), monograma", "proposta"),
    "chapecoense": ("Chapecoense", "círculo", "espiga de trigo sobre os campos do oeste catarinense", "a single wheat ear standing over rolling farm fields", "índio (mascote), monograma, forma do escudo oficial", "proposta"),
}

SHAPES = {"escudo": "a classic shield", "círculo": "a circle", "hexágono": "a hexagon", "quadrado arredondado": "a rounded square"}

PROMPT = """# Emblema — {nome}

> **INSTRUCTIONS FOR THE ASSISTANT — READ FIRST**
> Start from a clean slate. Ignore everything from earlier conversations, prompts and images. Use only what is written in this file.
> Generate one image following the section "Prompt" below. The sections in Portuguese are notes for the human reviewer and are not part of the request.

**Usado em:** figurinha, mercado de propostas, trajetória e tela final (SPEC v2.26).
**Símbolo:** {simbolo} · **Forma:** {forma} · **Conceito:** {origem}.
**Evitar (do escudo real e dos mascotes):** {evitar}.
**Conferir antes de gerar:** a lista acima veio da memória do assistente, não de fonte conferida. Compare com o escudo oficial atual e os antigos; se o símbolo ou a forma lembrar algum, troque antes de gerar. Revisão jurídica antes do lançamento.

**Arquivo da imagem:** salve nesta pasta como `imagem.png`. O código faz duas versões: a completa e a simplificada (só a silhueta, legível em 18 px).

## Prompt

```
Create a square 1:1 image, about 1024 x 1024 pixels.

WHAT IT IS
An original sports club emblem for a fictional football career game. It is a new design, not a copy or a variation of any real club crest, logo, mascot or brand. No letters, no numbers, no text, no stars, no dates anywhere.

SHAPE
The emblem is {shape}, centred, filling about 80% of the image.

SYMBOL
Inside the emblem: {symbol_en}. One symbol only, large and simple, readable even when the emblem is shown very small.

STYLE
Flat bold badge: solid colour areas, no gradients, no texture, no 3D, no shine. A thick dark navy outline (#14213D) around the whole emblem and around the symbol. Clean geometric shapes.

COLOUR PLAN - follow it exactly, because software will recolour this image with the club colours
- Colour 1 of the club: pure magenta (#FF00FF).
- Colour 2 of the club: pure cyan (#00FFFF).
- Details may use cream (#F2F4EF) and the navy outline (#14213D). No other colours.

BACKGROUND
Perfectly flat chroma-key green (#00B140) from edge to edge around the emblem, with crisp edges and no shadow, because software will cut the emblem out.
```
"""

README = """# Emblemas dos clubes (T49d, SPEC v2.26)

Emblemas **originais** que evocam o nome ou a cidade de cada clube da Série A. Gerados com `python3 docs/arte/gerar-emblemas.py`; um prompt por pasta.

## Regras (CLAUDE.md e SPEC, seção 11)

- Nunca o escudo oficial nem elemento, forma ou disposição dele, monograma, mascote oficial, estrelas ou ano de fundação.
- Sem texto dentro do emblema.
- Cores por troca: magenta = cor 1 do clube, ciano = cor 2; contorno marinho e detalhes creme.
- Duas versões no jogo: completa e simplificada (legível em 18 px).
- **Revisão jurídica antes do lançamento.**

## Antes de gerar cada um

A coluna "Evitar" veio da memória do assistente e **não foi conferida** em fonte (sites bloqueados no ambiente de desenvolvimento). Para cada clube, compare o símbolo proposto com o escudo oficial atual e os antigos e com os mascotes. Pontos já sabidos para conferir:

- **Coritiba:** se a araucária já apareceu em algum escudo do clube.
- **Remo:** se há remos no escudo oficial (o símbolo proposto é uma canoa).
- **Red Bull Bragantino:** o nome do clube inclui uma marca registrada de empresa; o emblema não pode lembrar touro nem a marca. Vale levar à revisão jurídica também o uso do nome no jogo.
- **Belo Horizonte e Porto Alegre:** dois clubes por cidade; os símbolos foram escolhidos para não se confundirem (serra × lua; pôr do sol × globo).

| Clube | Forma | Símbolo | Conceito |
|---|---|---|---|
{linhas}
"""

def main():
    ROOT.mkdir(parents=True, exist_ok=True)
    linhas = []
    for cid, (nome, forma, simbolo, symbol_en, evitar, origem) in CLUBES.items():
        d = ROOT / cid
        d.mkdir(exist_ok=True)
        (d / "prompt.md").write_text(PROMPT.format(nome=nome, simbolo=simbolo, forma=forma, origem=origem, evitar=evitar, shape=SHAPES[forma], symbol_en=symbol_en), encoding="utf-8")
        linhas.append(f"| {nome} | {forma} | {simbolo} | {origem} |")
    (ROOT / "README.md").write_text(README.format(linhas="\n".join(linhas)), encoding="utf-8")
    print(f"{len(CLUBES)} prompts em {ROOT}")

if __name__ == "__main__":
    main()
