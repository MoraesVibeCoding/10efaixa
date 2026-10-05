"""Pasta única com as imagens que faltam para concluir a arte do jogo: docs/arte/pendentes/.

Cada subpasta é UMA imagem, com um prompt.md único (copiado do prompt original da peça).
Gere a imagem e salve-a NA PRÓPRIA SUBPASTA (imagem.jpeg, .jpg, .png ou .webp).

Rodar:
  python3 docs/arte/gerar-pendentes.py            # (re)monta a pasta com o que ainda falta
  python3 docs/arte/gerar-pendentes.py --recolher # leva cada imagem salva para a pasta definitiva e limpa a subpasta

A ordem dos números segue a prioridade do jogo (emblemas e troféus primeiro, depois as cenas).
Não toca em nenhuma imagem já existente nas pastas definitivas.
"""
import os
import re
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'pendentes')
CUTS = ['curto', 'cacheado-medio', 'liso-medio', 'cacheado-grande', 'liso-grande', 'careca']
IMG = re.compile(r'^imagem\.(jpe?g|png|webp)$', re.I)
DEST = 'destino.txt'

# (rótulo, pasta-base, subpastas por corte?) na ordem de prioridade
GROUPS = [
    ('emblema', 'emblemas', False),
    ('trofeu', 'trofeus', False),
    ('cena', 'cenas', True),
    ('cena-goleiro', 'cenas-goleiro', True),
]


def has_image(folder):
    return os.path.isdir(folder) and any(IMG.match(f) for f in os.listdir(folder))


def missing():
    """Peças com prompt.md e sem imagem, na ordem de prioridade."""
    for label, base, by_cut in GROUPS:
        root = os.path.join(HERE, base)
        for item in sorted(os.listdir(root)):
            path = os.path.join(root, item)
            if not os.path.isdir(path):
                continue
            targets = [(os.path.join(path, c), f'{item}-{c}') for c in CUTS] if by_cut else [(path, item)]
            for folder, name in targets:
                if os.path.exists(os.path.join(folder, 'prompt.md')) and not has_image(folder):
                    yield label, folder, name


def build():
    if os.path.isdir(OUT):
        kept = [d for d in os.listdir(OUT) if os.path.isdir(os.path.join(OUT, d)) and has_image(os.path.join(OUT, d))]
        if kept:
            sys.exit(f'Há imagens salvas em pendentes/ ainda não recolhidas ({len(kept)}). Rode com --recolher antes.')
        shutil.rmtree(OUT)
    os.makedirs(OUT)
    rows = []
    for n, (label, folder, name) in enumerate(missing(), 1):
        sub = f'{n:03d}-{label}-{name}'
        d = os.path.join(OUT, sub)
        os.makedirs(d)
        rel = os.path.relpath(folder, os.path.dirname(HERE))  # a partir de docs/
        original = open(os.path.join(folder, 'prompt.md'), encoding='utf-8').read()
        head = (f'<!-- pendente {n:03d} · destino: docs/{rel} -->\n'
                f'> **Pendente {n:03d}.** Gere a imagem e salve **nesta mesma pasta** como `imagem.jpeg` '
                f'(ou `.png`). Depois o comando `python3 docs/arte/gerar-pendentes.py --recolher` leva a imagem para `docs/{rel}/`.\n\n')
        open(os.path.join(d, 'prompt.md'), 'w', encoding='utf-8').write(head + original)
        open(os.path.join(d, DEST), 'w', encoding='utf-8').write(os.path.relpath(folder, HERE) + '\n')  # relativo a docs/arte: vale em qualquer máquina
        rows.append((sub, label, f'docs/{rel}'))
    write_readme(rows)
    print(f'{len(rows)} imagens pendentes em {OUT}')


def write_readme(rows):
    count = {}
    for _, label, _ in rows:
        count[label] = count.get(label, 0) + 1
    names = {'emblema': 'Emblemas dos clubes', 'trofeu': 'Troféus', 'cena': 'Cenas (jogador de linha)', 'cena-goleiro': 'Cenas (goleiro)'}
    lines = [
        '# Imagens pendentes',
        '',
        f'**{len(rows)} imagens** faltam para concluir a arte que já tem prompt. Cada subpasta é uma imagem, com um `prompt.md` único.',
        '',
        '## Como fazer',
        '',
        '1. Abra a subpasta, copie o bloco **Prompt** do `prompt.md` e gere numa **conversa nova** do gerador (Nano Banana 2), na maior resolução.',
        '2. Salve a imagem **na própria subpasta** como `imagem.jpeg` (emblemas: `imagem.png`).',
        '3. Ao terminar (ou a cada lote), rode `python3 docs/arte/gerar-pendentes.py --recolher`: cada imagem vai para a pasta definitiva e a subpasta some.',
        '4. Pequenos defeitos não pedem nova geração (decisão de 2026-10-02); anote no README da arte.',
        '',
        '## Resumo',
        '',
        '| Grupo | Imagens |',
        '|---|---|',
        *[f'| {names[k]} | {v} |' for k, v in count.items()],
        '',
        '## Dicas',
        '',
        '- **Cenas:** para manter o traço, anexe uma cena aprovada do mesmo corte (ex.: `docs/arte/cenas/04-penalti/curto/imagem.jpeg`) e acrescente o pedido de usar só como referência de estilo e cabelo (está em cada `prompt.md`).',
        '- **Cenas com 6 cortes:** se preferir, a pasta da cena (`docs/arte/cenas/<cena>/prompt-6-cortes.md`) pede os 6 cortes numa conversa só; salve cada um na subpasta pendente do corte certo.',
        '- **Emblemas:** confira a lista "Evitar" de cada clube antes de gerar (Coritiba, Remo e Bragantino têm pontos a conferir).',
        '- **Troféus:** nenhum pode lembrar o troféu real; confira um a um.',
        '',
        '## Lista',
        '',
        '| Pendente | Grupo | Destino |',
        '|---|---|---|',
        *[f'| `{s}` | {names[l]} | `{d}` |' for s, l, d in rows],
        '',
        'Fora desta pasta (sem prompt ainda): avatar em camadas pintadas da figurinha (T42b–T44b) e as 8 comemorações. Dependem do lote piloto ⛳.',
        '',
    ]
    open(os.path.join(OUT, 'README.md'), 'w', encoding='utf-8').write('\n'.join(lines))


def collect():
    moved = 0
    for sub in sorted(os.listdir(OUT)):
        d = os.path.join(OUT, sub)
        if not os.path.isdir(d):
            continue
        imgs = [f for f in os.listdir(d) if IMG.match(f)]
        if not imgs:
            continue
        dest = os.path.join(HERE, open(os.path.join(d, DEST), encoding='utf-8').read().strip())
        if has_image(dest):
            print(f'pulado (o destino já tem imagem): {sub}')
            continue
        img = imgs[0]
        shutil.move(os.path.join(d, img), os.path.join(dest, 'imagem' + os.path.splitext(img)[1].lower()))
        shutil.rmtree(d)
        moved += 1
    print(f'{moved} imagens recolhidas')
    build()


if __name__ == '__main__':
    collect() if '--recolher' in sys.argv else build()
