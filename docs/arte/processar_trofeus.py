#!/usr/bin/env python3
"""Pós-processamento dos 18 troféus (docs/arte/trofeus/<id>/Image.jpeg ou image.png), fundo azul-marinho chapado.

Para cada imagem: (1) acha o fundo pela cor dos cantos e o torna transparente, só na região ligada às bordas (a base preta do troféu
fica intacta, mesmo escura); (2) corta no troféu com margem e reenquadra em quadrado; (3) grava WebP com transparência em
src/assets/trofeus/<id>.webp (padrão 256 px).

Uso:  uv run --with pillow --with numpy python docs/arte/processar_trofeus.py [--saida pasta] [--tamanho 256]
Autoteste:  uv run --with pillow --with numpy python docs/arte/test_processar_trofeus.py
"""
import argparse
import glob
import os
from collections import deque

import numpy as np
from PIL import Image

TOL_LO, TOL_HI = 22.0, 46.0   # distância ao fundo em que a transparência é total / nenhuma (rampa suave na borda)
VAO_MAX = 0.02                # vão de fundo (fração da imagem) que ainda conta como fundo
MARGEM = 0.06                 # margem em volta do troféu, fração do lado


def fundo(img):
    h, w, _ = img.shape
    n = max(4, w // 60)
    patches = [img[:n, :n], img[:n, -n:], img[-n:, :n], img[-n:, -n:]]
    return np.mean([p.reshape(-1, 3).mean(0) for p in patches], axis=0)


def alfa(img):
    """Alfa 0..1: transparente no fundo ligado às bordas; o resto, opaco."""
    h, w, _ = img.shape
    dist = np.linalg.norm(img.astype(float) - fundo(img), axis=2)
    perto = dist < TOL_HI
    ligado = np.zeros((h, w), bool)
    fila = deque((y, x) for y in range(h) for x in (0, w - 1) if perto[y, x])
    fila.extend((y, x) for x in range(w) for y in (0, h - 1) if perto[y, x])
    for y, x in fila:
        ligado[y, x] = True
    while fila:
        y, x = fila.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and perto[ny, nx] and not ligado[ny, nx]:
                ligado[ny, nx] = True
                fila.append((ny, nx))
    rampa = np.clip((dist - TOL_LO) / (TOL_HI - TOL_LO), 0, 1)
    # vãos de fundo entre as alças e a taça: componentes pequenos da cor do fundo, fora das bordas (as grandes, como uma esfera azul do desenho, ficam)
    parecido = dist < TOL_LO
    visto = ligado.copy()
    for y0 in range(h):
        for x0 in range(w):
            if not parecido[y0, x0] or visto[y0, x0]:
                continue
            comp, fila = [], deque([(y0, x0)])
            visto[y0, x0] = True
            while fila:
                y, x = fila.popleft()
                comp.append((y, x))
                for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                    if 0 <= ny < h and 0 <= nx < w and parecido[ny, nx] and not visto[ny, nx]:
                        visto[ny, nx] = True
                        fila.append((ny, nx))
            if len(comp) < VAO_MAX * h * w:
                for y, x in comp:
                    ligado[y, x] = True
    return np.where(ligado, rampa, 1.0)


def processa(caminho, tamanho):
    img = np.array(Image.open(caminho).convert('RGB'))
    a = alfa(img)
    ys, xs = np.where(a > 0.5)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    lado = int(max(y1 - y0, x1 - x0) * (1 + 2 * MARGEM))
    cy, cx = (y0 + y1) // 2, (x0 + x1) // 2
    rgba = np.dstack([img, (a * 255).astype(np.uint8)])
    tela = Image.new('RGBA', (lado, lado), (0, 0, 0, 0))
    tela.paste(Image.fromarray(rgba, 'RGBA'), (lado // 2 - cx, lado // 2 - cy))
    return tela.resize((tamanho, tamanho), Image.LANCZOS)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--saida', default='src/assets/trofeus')
    ap.add_argument('--tamanho', type=int, default=256)
    args = ap.parse_args()
    os.makedirs(args.saida, exist_ok=True)
    for pasta in sorted(glob.glob('docs/arte/trofeus/*/')):
        fontes = glob.glob(pasta + 'Image.jpeg') + glob.glob(pasta + 'image.png')
        if not fontes:
            print('sem imagem:', pasta)
            continue
        nome = os.path.basename(pasta.rstrip('/'))
        processa(fontes[0], args.tamanho).save(os.path.join(args.saida, nome + '.webp'), quality=90, method=6)
        print('ok', nome)


if __name__ == '__main__':
    main()
