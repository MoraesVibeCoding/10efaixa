#!/usr/bin/env python3
"""Autoteste de processar_uniformes_serie_a.py:  python3 docs/arte/test_processar_uniformes_serie_a.py"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import processar_uniformes_serie_a as p  # noqa: E402

MAGENTA = np.array([255, 0, 255], np.float32) / 255


def peca(h=200, w=160, fundo=MAGENTA, cor=(0.1, 0.4, 0.8)):
    """Retângulo azul com uma listra branca no meio, sobre fundo chapado, com uma borda suavizada de 2 px."""
    img = np.broadcast_to(fundo, (h, w, 3)).copy()
    img[40:160, 30:130] = cor
    img[90:100, 30:130] = (1, 1, 1)
    for k, a in ((39, 0.5), (160, 0.5)):  # borda mistura com o fundo
        img[k, 30:130] = np.array(cor) * a + fundo * (1 - a)
    return img


def test_recorta_no_contorno_e_sem_fundo():
    tex, mask = p.recorta_uniforme(peca())
    assert tex.shape[:2] == mask.shape
    assert 118 <= tex.shape[0] <= 124 and 98 <= tex.shape[1] <= 104   # contorno da peça (com a borda suave de 1 px)
    assert mask[tex.shape[0] // 2, tex.shape[1] // 2]


def test_nenhum_pixel_da_textura_e_magenta_nem_na_borda():
    tex, _ = p.recorta_uniforme(peca())
    magenta = (np.minimum(tex[..., 0], tex[..., 2]) - tex[..., 1]) > 0.3
    assert not magenta.any()


def test_fundo_que_nao_e_magenta_tambem_sai():
    tex, mask = p.recorta_uniforme(peca(fundo=np.array([0.65, 0.2, 0.35], np.float32)))
    assert mask.mean() > 0.9 or tex.shape[0] <= 124


def test_listra_central_sobrevive():
    tex, _ = p.recorta_uniforme(peca())
    meio = tex[tex.shape[0] // 2 - 4: tex.shape[0] // 2 + 4, tex.shape[1] // 2]
    assert (meio > 0.9).all() or meio.max() > 0.9


def test_redimensiona_para_a_largura_pedida_mantendo_proporcao():
    tex, _ = p.recorta_uniforme(peca())
    pequeno = p.redimensiona(tex, 50)
    assert pequeno.shape[1] == 50 and abs(pequeno.shape[0] - round(tex.shape[0] * 50 / tex.shape[1])) <= 1


def test_cor_principal_do_calcao_e_a_cor_dominante():
    tex = np.zeros((10, 10, 3), np.float32)
    tex[:] = (0.1, 0.4, 0.8)
    tex[:2] = (1, 1, 1)
    assert p.cor_principal(tex) == '#1A66CC'


def test_dados_dos_20_clubes():
    ids = ['athletico-pr', 'atletico-mg', 'bahia', 'botafogo', 'chapecoense', 'corinthians', 'coritiba', 'cruzeiro', 'flamengo', 'fluminense',
           'gremio', 'internacional', 'mirassol', 'palmeiras', 'bragantino', 'remo', 'santos', 'sao-paulo', 'vasco', 'vitoria']
    assert p.CLUBES == ids


if __name__ == '__main__':
    for nome, fn in list(globals().items()):
        if nome.startswith('test_'):
            fn()
    print('ok')
