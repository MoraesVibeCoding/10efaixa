#!/usr/bin/env python3
"""Autoteste de recompor_regiao.py:  python3 docs/arte/test_recompor_regiao.py"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import recompor_regiao as r  # noqa: E402


def imagens(h=60, w=40):
    rng = np.random.default_rng(1)
    original = rng.integers(0, 256, (h, w, 3), dtype=np.uint8)
    editada = rng.integers(0, 256, (h, w, 3), dtype=np.uint8)
    return original, editada


def test_fora_da_mascara_e_identico_ao_original_byte_a_byte():
    original, editada = imagens()
    m = r.mascara_retangular(original.shape[:2], [0.25, 0.1, 0.75, 0.4], borda_px=3)
    final = r.recompoe(original, editada, m)
    fora = m == 0
    assert fora.any() and (final[fora] == original[fora]).all()
    assert r.relatorio(original, final, m)['fora_diferentes'] == 0


def test_dentro_da_mascara_cheia_vira_a_editada():
    original, editada = imagens()
    m = r.mascara_retangular(original.shape[:2], [0.1, 0.1, 0.9, 0.9], borda_px=2)
    final = r.recompoe(original, editada, m)
    centro = m == 1
    assert centro.any() and (final[centro] == editada[centro]).all()


def test_mascara_meia_mistura_as_duas():
    original = np.zeros((4, 4, 3), np.uint8)
    editada = np.full((4, 4, 3), 200, np.uint8)
    final = r.recompoe(original, editada, np.full((4, 4), 0.5, np.float32))
    assert (final == 100).all()


def test_borda_suave_fica_toda_dentro_da_caixa():
    m = r.mascara_retangular((100, 80), [0.25, 0.25, 0.75, 0.75], borda_px=6)
    ys, xs = np.where(m > 0)
    assert xs.min() == 20 and xs.max() == 59 and ys.min() == 25 and ys.max() == 74   # nunca passa da caixa pedida
    assert 0 < m[25, 40] < 1 and m[50, 40] == 1                                        # rampa na borda, cheio no centro


def test_formas_diferentes_dao_erro():
    original, editada = imagens()
    try:
        r.recompoe(original, editada[:-1], np.ones(original.shape[:2], np.float32))
    except ValueError:
        return
    raise AssertionError('devia recusar imagens de tamanhos diferentes')


def test_relatorio_conta_pixels_alterados_fora_e_dentro():
    original, _ = imagens()
    m = r.mascara_retangular(original.shape[:2], [0.25, 0.25, 0.75, 0.75], borda_px=2)
    final = original.copy()
    final[0, 0] = 255 - final[0, 0]          # alteração fora da região
    final[30, 20] = 255 - final[30, 20]      # alteração dentro
    rel = r.relatorio(original, final, m)
    assert rel['fora_diferentes'] == 1 and rel['dentro_diferentes'] == 1


if __name__ == '__main__':
    for nome, fn in list(globals().items()):
        if nome.startswith('test_'):
            fn()
    print('ok')
