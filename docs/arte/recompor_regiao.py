#!/usr/bin/env python3
"""Piloto A (SPEC v2.100): editar a pintura atual e recompor SÓ a região autorizada.

A IA de imagem não garante que respeita uma máscara pixel a pixel; a garantia vem daqui:
    final = M * editada + (1 - M) * original
Onde M = 0 o resultado é o original byte a byte. A máscara de caixa tem rampa só DENTRO da caixa, então nada passa dos limites pedidos.
Para trocar cabelo curto por coque, tranças ou cabelo longo, a caixa precisa incluir o espaço que o cabelo novo ocupa (ombro, nuca, o
alto da cabeça sobre o fundo) e a região do cabelo antigo.

Uso (exemplo):  python3 docs/arte/recompor_regiao.py original.png editada.png saida.png 0.30,0.08,0.70,0.34 [borda_px]
Autoteste:  python3 docs/arte/test_recompor_regiao.py
"""
import sys

import numpy as np
from PIL import Image


def mascara_retangular(shape, caixa, borda_px=4):
    """Máscara float 0..1 (h, w): 1 no miolo da caixa, rampa linear nos `borda_px` de dentro, 0 fora. `caixa` = [x0, y0, x1, y1] em frações."""
    h, w = shape
    x0, y0, x1, y1 = int(round(caixa[0] * w)), int(round(caixa[1] * h)), int(round(caixa[2] * w)), int(round(caixa[3] * h))
    m = np.zeros((h, w), np.float32)
    if x1 <= x0 or y1 <= y0:
        return m
    ys, xs = np.arange(y0, y1), np.arange(x0, x1)
    b = max(1, int(borda_px))
    rampa_y = np.minimum(1.0, np.minimum(ys - y0 + 1, y1 - ys) / (b + 1))
    rampa_x = np.minimum(1.0, np.minimum(xs - x0 + 1, x1 - xs) / (b + 1))
    m[y0:y1, x0:x1] = np.minimum(rampa_y[:, None], rampa_x[None, :])
    return m


def recompoe(original, editada, mascara):
    """uint8 HxWx3 (ou 4); `mascara` float HxW. Devolve uint8; onde a máscara é 0, igual ao original."""
    if original.shape != editada.shape or mascara.shape != original.shape[:2]:
        raise ValueError('original, editada e máscara precisam ter o mesmo tamanho')
    m = np.clip(mascara.astype(np.float32), 0, 1)[..., None]
    mistura = editada.astype(np.float32) * m + original.astype(np.float32) * (1 - m)
    saida = np.rint(mistura).astype(np.uint8)
    saida = np.where(m == 0, original, saida)
    return np.where(m == 1, editada, saida)


def relatorio(original, final, mascara):
    """Quantos pixels diferem do original fora e dentro da região (máscara > 0)."""
    diferem = (original != final).any(axis=-1)
    dentro = mascara > 0
    return {'fora_diferentes': int((diferem & ~dentro).sum()), 'dentro_diferentes': int((diferem & dentro).sum()), 'dentro_total': int(dentro.sum())}


def main(argv):
    if len(argv) < 5:
        print(__doc__)
        return 1
    orig = np.asarray(Image.open(argv[1]).convert('RGB'))
    edit = np.asarray(Image.open(argv[2]).convert('RGB').resize((orig.shape[1], orig.shape[0]), Image.LANCZOS))
    caixa = [float(v) for v in argv[4].split(',')]
    m = mascara_retangular(orig.shape[:2], caixa, int(argv[5]) if len(argv) > 5 else 4)
    final = recompoe(orig, edit, m)
    Image.fromarray(final).save(argv[3])
    print(relatorio(orig, final, m))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
