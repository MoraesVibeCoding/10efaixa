#!/usr/bin/env python3
"""Autoteste do processar_trofeus: fundo ligado às bordas some; peça escura dentro do troféu fica opaca."""
import os
import sys
import tempfile

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from processar_trofeus import alfa, processa  # noqa: E402

BG = (20, 37, 65)


def cena():
    img = np.zeros((200, 200, 3), np.uint8)
    img[:] = BG
    img[60:140, 80:120] = (212, 175, 55)   # troféu dourado
    img[140:160, 70:130] = (12, 12, 16)    # base preta
    return img


def test_fundo_transparente_e_base_escura_opaca():
    a = alfa(cena())
    assert a[5, 5] == 0 and a[195, 100] == 0
    assert a[100, 100] == 1 and a[150, 100] == 1


def test_saida_quadrada_com_transparencia():
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'x.png')
        Image.fromarray(cena()).save(p)
        out = processa(p, 64)
        assert out.size == (64, 64) and out.mode == 'RGBA'
        assert out.getpixel((0, 0))[3] == 0
        assert out.getpixel((32, 32))[3] == 255


if __name__ == '__main__':
    test_fundo_transparente_e_base_escura_opaca()
    test_saida_quadrada_com_transparencia()
    print('ok')
