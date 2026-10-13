#!/usr/bin/env python3
"""Cenas com o uniforme genérico do jogador de linha (docs/cenas/<cena>/<corte>.webp).

O jogo guarda cada cena com a camisa e o calção em cinza e pinta as cores do clube por cima, com duas máscaras
(`<corte>-camisa.webp` e `<corte>-calcao.webp`). Aqui a mesma pintura sai com o uniforme genérico, nas cores-chave que a IA de
imagem entende como "troque por isto": camisa MAGENTA (#FF00FF); calção e meiões CIANO (#00FFFF). A luz e as dobras da pintura
ficam. O goleiro não entra (uniforme dele é outro).

Defeito das máscaras do jogo: em 14 das 96 máscaras de calção a máscara vaza sobre o céu (alfa até 1,0, colado ao topo), o que
tingiria a cena inteira. `limpa_calcao` guarda só os blocos de alfa forte que não encostam no topo, não cobrem a largura da imagem não são enormes e não terminam no alto da imagem.

Uso:  python3 docs/arte/gerar_cenas_genericas.py [--saida docs/cenas]
Autoteste:  python3 docs/arte/test_gerar_cenas_genericas.py
"""
import argparse
import json
import os
from collections import deque

import numpy as np
from PIL import Image

MAGENTA = (1.0, 0.0, 1.0)
CIANO = (0.0, 1.0, 1.0)
PISO_CAMISA = 0.35        # abaixo disto a máscara da camisa é ruído de borda (até 0,28 no topo de uma cena)
LIMIAR_BLOCO = 0.85       # alfa a partir do qual um pixel da máscara do calção conta como calção (o calção de verdade é ~1; o vazamento em gradiente fica abaixo de 0,7)
FAIXA_TOPO = 0.03         # fração de altura: bloco que encosta nesta faixa é vazamento sobre o céu
LARGURA_MAX = 0.5         # fração da largura: calção e meiões de um jogador nunca passam disto (nos 96 arquivos o maior é 0,5); vazamento cobre 1,0
BASE_MIN = 0.20          # fração de altura: bloco que termina acima disto é risco de céu, janela ou refletor (nos 96 arquivos os riscos terminam em até 0,16; o primeiro calção de verdade, de um companheiro ao fundo, termina em 0,27 ou mais)
AREA_MAX = 0.12           # fração da imagem: nos 96 arquivos o maior calção ocupa 3,9%; o vazamento ocupa de 10% a 27%


def reamostra(mascara, shape):
    h, w = shape
    if mascara.shape == (h, w):
        return mascara
    img = Image.fromarray((np.clip(mascara, 0, 1) * 255).astype(np.uint8))
    return np.asarray(img.resize((w, h), Image.LANCZOS), dtype=np.float32) / 255.0


def limpa_calcao(alfa):
    """Alfa do calção sem o vazamento: só ficam os blocos (conexos, alfa >= LIMIAR_BLOCO) que não encostam no topo."""
    h, w = alfa.shape
    fg = alfa >= LIMIAR_BLOCO
    visto = np.zeros_like(fg)
    manter = np.zeros_like(fg)
    topo = max(1, int(h * FAIXA_TOPO))
    for y0, x0 in np.argwhere(fg):
        if visto[y0, x0]:
            continue
        bloco, fila, encosta = [], deque([(y0, x0)]), False
        visto[y0, x0] = True
        while fila:
            y, x = fila.popleft()
            bloco.append((y, x))
            encosta |= y < topo
            for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= ny < h and 0 <= nx < w and fg[ny, nx] and not visto[ny, nx]:
                    visto[ny, nx] = True
                    fila.append((ny, nx))
        ys, xs = zip(*bloco)
        largo = (max(xs) - min(xs) + 1) / w > LARGURA_MAX
        enorme = len(bloco) / (h * w) > AREA_MAX
        alto = (max(ys) + 1) / h < BASE_MIN
        if not (encosta or largo or enorme or alto):
            manter[ys, xs] = True
    # a borda suave do calção de verdade (alfa < LIMIAR_BLOCO) volta junto dos pixels a até 2 de distância dos blocos mantidos
    perto = manter.copy()
    for _ in range(2):
        cresce = perto.copy()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)):
            cresce |= np.roll(np.roll(perto, dy, 0), dx, 1)
        perto = cresce
    return np.where(perto, alfa, 0.0).astype(np.float32)


def tinta(pintura, mascara, cor):
    """Cor-chave com a luz da pintura: o brilho do cinza modula a cor (90% do cinza vira a cor cheia)."""
    lum = (0.299 * pintura[..., 0] + 0.587 * pintura[..., 1] + 0.114 * pintura[..., 2])
    dentro = lum[mascara > 0.5]
    ref = np.percentile(dentro, 90) if dentro.size else 1.0
    return np.clip(lum / max(ref, 1e-3), 0, 1)[..., None] * np.array(cor, np.float32)


def uniforme_generico(pintura, camisa, calcao):
    """`pintura` HxWx3 float 0..1; máscaras de alfa 0..1 em qualquer resolução (ou None para sem calção). Devolve HxWx3 uint8."""
    shape = pintura.shape[:2]
    cam = reamostra(camisa, shape)
    cam = np.where(cam >= PISO_CAMISA, cam, 0.0)[..., None]
    saida = pintura * (1 - cam) + tinta(pintura, cam[..., 0], MAGENTA) * cam
    if calcao is not None:
        cal = reamostra(limpa_calcao(calcao), shape)[..., None]
        saida = saida * (1 - cal) + tinta(pintura, cal[..., 0], CIANO) * cal
    return (np.clip(saida, 0, 1) * 255).round().astype(np.uint8)


def alfa(caminho):
    return np.asarray(Image.open(caminho).convert('RGBA'), dtype=np.float32)[..., 3] / 255.0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--saida', default='docs/cenas')
    ap.add_argument('--entrada', default='src/assets/cenas')
    args = ap.parse_args()
    cenas = json.load(open('src/data/cenasArte.json', encoding='utf-8'))['cenas']
    for cena, d in cenas.items():
        os.makedirs(os.path.join(args.saida, cena), exist_ok=True)
        for corte, c in d['cortes'].items():
            base = os.path.join(args.entrada, cena, corte)
            pintura = np.asarray(Image.open(base + '.webp').convert('RGB'), dtype=np.float32) / 255.0
            calcao = alfa(base + '-calcao.webp') if c.get('calcao') else None
            rgb = uniforme_generico(pintura, alfa(base + '-camisa.webp'), calcao)
            Image.fromarray(rgb).save(os.path.join(args.saida, cena, corte + '.webp'), quality=95, method=6)
        print('ok', cena)


if __name__ == '__main__':
    main()
