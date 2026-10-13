#!/usr/bin/env python3
"""Pós-processamento dos uniformes dos clubes (docs/arte/uniformes/<clube>/{camisa-frente,camisa-costas,calcao}.jpeg|png),
peça sozinha sobre fundo magenta chapado (SPEC v2.93).

Para cada imagem: (1) acha o fundo pela cor dos cantos e o torna transparente, só na região ligada às bordas (assim uma camisa
verde ou preta nunca some com o fundo); (2) na borda da peça, separa a cor do tecido da mistura com o magenta (sem franja rosa);
(3) mantém o enquadramento original, sem recorte justo, para a frente, as costas e o calção do clube se encaixarem; (4) grava
WebP com transparência em src/assets/uniformes/<clube>/<peça>.webp (padrão 512 px).

Uso:  python3 docs/arte/processar_uniformes.py [--saida pasta] [--tamanho 512]
Autoteste:  python3 docs/arte/test_processar_uniformes.py
"""
import argparse
import glob
import os

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

PECAS = ('camisa-frente', 'camisa-costas', 'calcao')
TOL = 60.0       # distância (maior diferença entre canais) até o fundo para ainda contar como fundo
BORDA = 3        # largura, em pixels, da faixa de transição na borda da peça
MARCA = 128


def cor_do_fundo(img):
    n = max(4, img.shape[1] // 60)
    cantos = [img[:n, :n], img[:n, -n:], img[-n:, :n], img[-n:, -n:]]
    return np.mean([c.reshape(-1, 3).mean(0) for c in cantos], axis=0)


def fundo_ligado(img, bg):
    """Máscara booleana do fundo ligado às bordas (preenchimento a partir das bordas, em C pelo Pillow)."""
    h, w, _ = img.shape
    perto = (np.abs(img.astype(float) - bg).max(axis=2) <= TOL).astype(np.uint8) * 255
    m = Image.fromarray(perto, 'L').copy()  # a cópia: a imagem de fromarray divide memória com o numpy e o floodfill não grava nela
    sementes = [(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)] + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)]
    for xy in sementes:
        if m.getpixel(xy) == 255:
            ImageDraw.floodfill(m, xy, MARCA)
    return np.array(m) == MARCA


def recortar(img):
    """RGBA (uint8) com o fundo transparente e a borda limpa. `img` é HxWx3 uint8."""
    bg = cor_do_fundo(img)
    h, w, _ = img.shape
    fundo = fundo_ligado(img, bg)
    # faixa de transição: pixels que não são fundo mas estão a até BORDA pixels dele
    m = Image.fromarray(fundo.astype(np.uint8) * 255, 'L')
    perto = np.array(m.filter(ImageFilter.MaxFilter(2 * BORDA + 1))) > 0
    miolo = ~perto                       # tecido puro, longe do fundo
    faixa = perto & ~fundo
    # cor do tecido na faixa = a do tecido puro mais próximo (espalha o miolo para fora, um pixel por vez)
    cor = img.astype(float)
    cheio = miolo.copy()
    for _ in range(BORDA + 1):
        soma = np.zeros((h, w, 3))
        n = np.zeros((h, w))
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)):
            viz = np.roll(np.roll(cheio, dy, 0), dx, 1)
            soma += np.where(viz[..., None], np.roll(np.roll(cor, dy, 0), dx, 1), 0)
            n += viz
        novo = ~cheio & (n > 0)
        cor[novo] = soma[novo] / n[novo, None]
        cheio |= novo
    # alfa da faixa: quanto o pixel se afasta do fundo na direção do tecido (mistura p = a*F + (1-a)*B)
    f_b = cor - bg
    den = np.maximum((f_b ** 2).sum(axis=2), 1.0)
    a = np.clip(((img.astype(float) - bg) * f_b).sum(axis=2) / den, 0, 1)
    out = np.zeros((h, w, 4), np.uint8)
    out[..., :3] = img
    out[..., 3] = 255
    out[faixa, :3] = np.clip(cor[faixa], 0, 255).astype(np.uint8)
    out[faixa, 3] = np.round(a[faixa] * 255).astype(np.uint8)
    out[fundo, 3] = 0
    out[fundo, :3] = 0
    return out


def processa(caminho, tamanho):
    img = np.array(Image.open(caminho).convert('RGB'))
    return Image.fromarray(recortar(img), 'RGBA').convert('RGBa').resize((tamanho, tamanho), Image.LANCZOS).convert('RGBA')


def achar(pasta, peca):
    for ext in ('jpeg', 'jpg', 'png'):
        achados = glob.glob(os.path.join(pasta, f'{peca}.{ext}'))
        if achados:
            return achados[0]
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--saida', default='src/assets/uniformes')
    ap.add_argument('--tamanho', type=int, default=512)
    args = ap.parse_args()
    for pasta in sorted(glob.glob('docs/arte/uniformes/*/')):
        clube = os.path.basename(pasta.rstrip('/'))
        for peca in PECAS:
            fonte = achar(pasta, peca)
            if not fonte:
                print('falta', clube, peca)
                continue
            destino = os.path.join(args.saida, clube)
            os.makedirs(destino, exist_ok=True)
            processa(fonte, args.tamanho).save(os.path.join(destino, peca + '.webp'), quality=90, method=6)
            print('ok', clube, peca)


if __name__ == '__main__':
    main()
