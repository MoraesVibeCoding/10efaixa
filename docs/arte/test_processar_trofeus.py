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



def test_vao_grande_preso_some_so_com_o_limite_do_trofeu():
    """Relato do usuário (2026-10-11): o fundo azul preso entre as alças e a taça ficava. Com o limite padrão o vão grande fica;
    com o limite do troféu (VAO_MAX_POR_TROFEU), sai."""
    img = np.zeros((200, 200, 3), np.uint8)
    img[:] = BG
    img[40:160, 40:160] = (212, 175, 55)   # anel dourado
    img[60:140, 60:140] = BG               # vão de fundo preso dentro do anel (16% da imagem)
    assert alfa(img)[100, 100] == 1        # padrão: vão grande fica (pode ser parte azul do desenho)
    assert alfa(img, 0.2)[100, 100] == 0   # limite do troféu: sai


def test_base_cinza_escura_perto_do_azul_fica_opaca_com_o_matiz():
    """Relato (2026-10-11, troféu da Liga Espanhola): a base cinza-escura fica a ~20 do azul do fundo e saía meio transparente.
    Com o peso de matiz do troféu (MATIZ_POR_TROFEU), o azul a mais do fundo separa os dois e a base fica opaca."""
    img = np.zeros((200, 200, 3), np.uint8)
    img[:] = BG
    img[60:140, 80:120] = (200, 205, 215)  # taça prateada
    img[140:170, 70:130] = (27, 35, 44)    # base cinza-escura, perto do fundo em RGB
    assert alfa(img)[155, 100] < 1         # padrão: a base vaza (o defeito)
    a = alfa(img, matiz=3)
    assert a[155, 100] == 1 and a[5, 5] == 0

if __name__ == '__main__':
    test_fundo_transparente_e_base_escura_opaca()
    test_saida_quadrada_com_transparencia()
    print('ok')
