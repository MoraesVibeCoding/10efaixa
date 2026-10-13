#!/usr/bin/env python3
"""Autoteste do processar_uniformes: fundo magenta ligado às bordas some, a peça fica opaca e a borda não guarda franja rosa."""
import os
import sys
import tempfile

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from processar_uniformes import processa, recortar  # noqa: E402

BG = (252, 20, 244)  # o magenta que a IA devolve não é exatamente #FF00FF


def camisa():
    img = np.zeros((200, 200, 3), np.uint8)
    img[:] = BG
    img[40:180, 50:150] = (240, 240, 240)   # corpo branco
    img[90:110, 50:150] = (8, 120, 68)      # faixa verde
    img[150:170, 60:140] = (20, 20, 20)     # detalhe quase preto
    return img


def test_fundo_magenta_some_e_a_peca_fica_opaca():
    a = recortar(camisa())[..., 3]
    assert a[5, 5] == 0 and a[195, 195] == 0 and a[100, 20] == 0
    assert a[60, 100] == 255 and a[100, 100] == 255 and a[160, 100] == 255


def test_cor_da_peca_nao_muda():
    rgba = recortar(camisa())
    assert tuple(rgba[100, 100, :3]) == (8, 120, 68)      # verde da faixa
    assert tuple(rgba[160, 100, :3]) == (20, 20, 20)      # peça escura perto do fundo em luminosidade


def test_borda_suave_nao_guarda_franja_rosa():
    img = camisa()
    img[40:180, 49] = ((np.array(BG) + np.array([240, 240, 240])) // 2)  # pixel de borda: meio fundo, meio camisa
    rgba = recortar(img)
    r, g, b, a = (int(v) for v in rgba[100, 49])
    assert 0 < a < 255
    assert r - g < 25 and b - g < 25          # a cor do pixel de borda volta a ser da camisa (cinza claro), não rosa


def test_verde_da_camisa_perto_do_fundo_verde_continua_valendo():
    """O fundo é magenta justamente para não comer camisas verdes (Palmeiras, Chapecoense)."""
    img = camisa()
    img[40:180, 50:150] = (0, 150, 70)
    a = recortar(img)[..., 3]
    assert a[100, 100] == 255 and a[5, 5] == 0


def test_saida_quadrada_com_transparencia():
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'x.png')
        Image.fromarray(camisa()).save(p)
        out = processa(p, 64)
        assert out.size == (64, 64) and out.mode == 'RGBA'
        assert out.getpixel((0, 0))[3] == 0
        assert out.getpixel((32, 32))[3] == 255


def test_enquadramento_original_e_mantido():
    """Frente, costas e calção do mesmo clube têm de se encaixar: nada de recorte justo por peça."""
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'x.png')
        Image.fromarray(camisa()).save(p)
        a = np.array(processa(p, 100))[..., 3]
        ys, xs = np.where(a > 127)
        assert (xs.min(), xs.max(), ys.min(), ys.max()) == (25, 74, 20, 89)


if __name__ == '__main__':
    for nome, fn in list(globals().items()):
        if nome.startswith('test_'):
            fn()
    print('ok')
