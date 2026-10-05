"""Gera um .md independente por imagem que ainda falta, só com o prompt (sem salvar no Drive).
Rode: python3 docs/arte/gerar-nanobanana.py  -> docs/arte/nanobanana/"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'nanobanana')
CUTS = ['curto', 'cacheado-medio', 'liso-medio', 'cacheado-grande', 'liso-grande', 'careca']
GROUPS = ['cenas', 'cenas-goleiro']

def targets():
    for g in GROUPS:
        for scene in sorted(os.listdir(os.path.join(HERE, g))):
            p = os.path.join(HERE, g, scene)
            if os.path.isdir(p):
                for c in CUTS:
                    yield g, scene, c
    for t in sorted(os.listdir(os.path.join(HERE, 'trofeus'))):
        if os.path.isdir(os.path.join(HERE, 'trofeus', t)):
            yield 'trofeus', t, None

os.makedirs(OUT, exist_ok=True)
n = 0
for g, scene, cut in targets():
    d = os.path.join(HERE, g, scene, *([cut] if cut else []))
    if os.path.exists(os.path.join(d, 'imagem.jpeg')) or not os.path.exists(os.path.join(d, 'prompt.md')):
        continue
    block = re.search(r'```\n(.*?)\n```', open(os.path.join(d, 'prompt.md')).read(), re.S).group(1)
    n += 1
    rel = os.path.relpath(d, HERE)
    name = f"{n:03d}_{g}_{scene}" + (f"_{cut}" if cut else '')
    ref = '' if g == 'trofeus' else '\nOpcional: anexe `cenas/04-penalti/%s/imagem.jpeg` e acrescente no fim do prompt: `Use the attached image only as a reference for the painting style and for the player\'s hair. Do not copy its scene.`\n' % cut
    open(os.path.join(OUT, name + '.md'), 'w').write(
        f"# {n:03d} — {rel}\n\nNano Banana 2: conversa nova, cole o prompt abaixo e gere **uma** imagem na maior resolução (formato indicado no prompt).{ref}\nSalve como `{rel}/imagem.jpeg`.\n\n## Prompt\n\n```\n{block}\n```\n")
print(n, 'arquivos em', OUT)
