"""Zip plano para gerador de imagens em lote: um .md por imagem pendente, sem subpastas.

Rodar:  python3 docs/arte/gerar-zip-lote.py [saida.zip]
Nome de cada arquivo = <nnn>-<grupo>-<peça>.md, o mesmo código da subpasta em docs/arte/pendentes/
(ex.: 041-cena-22-cabecada-liso-medio.md). O conteúdo é o prompt.md original, sem alteração.
Devolva as imagens com o MESMO nome-base (041-cena-22-cabecada-liso-medio.jpeg) para o --recolher.
"""
import os
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
PEND = os.path.join(HERE, 'pendentes')
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'lote-pendentes.zip')

dirs = sorted(d for d in os.listdir(PEND) if os.path.isfile(os.path.join(PEND, d, 'prompt.md')))
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for d in dirs:
        z.write(os.path.join(PEND, d, 'prompt.md'), f'{d}.md')
print(f'{len(dirs)} prompts em {out}')
