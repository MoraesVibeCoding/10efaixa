#!/usr/bin/env python3
"""Autoteste de compor_camadas.py:  python3 docs/arte/test_compor_camadas.py"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import compor_camadas as c  # noqa: E402

VERDE = np.array([0, 177, 64], np.uint8)


def sprite(h=200, w=160, cor=(220, 30, 40)):
    img = np.broadcast_to(VERDE, (h, w, 3)).copy()
    img[40:180, 50:110] = cor
    return img


def test_chave_verde_recorta_o_fundo_e_mantem_o_elemento():
    rgb, alfa = c.chave_verde(sprite())
    assert alfa[100, 80] == 1 and alfa[5, 5] == 0 and alfa[190, 150] == 0
    assert rgb.shape == (200, 160, 3) and rgb.max() <= 1.0


def test_chave_verde_aceita_verde_diferente_do_combinado():
    img = np.broadcast_to(np.array([60, 220, 33], np.uint8), (100, 80, 3)).copy()   # verde-limão que o Gemini já devolveu
    img[20:80, 25:55] = (200, 40, 40)
    _, alfa = c.chave_verde(img)
    assert alfa[50, 40] == 1 and alfa[2, 2] == 0


def test_ajusta_a_caixa_alvo_e_ancora_na_base():
    rgb, alfa = c.chave_verde(sprite())
    tela = (1000, 800)   # altura, largura
    alvo = [0.32, 0.12, 0.68, 0.75]
    cr, ca = c.ajusta_a_caixa(rgb, alfa, alvo, tela)
    assert cr.shape == (1000, 800, 3) and ca.shape == (1000, 800)
    ys, xs = np.where(ca > 0.5)
    assert abs(ys.max() + 1 - 750) <= 2                      # a base do elemento fica na base da caixa
    assert abs((xs.min() + xs.max() + 1) / 2 - 400) <= 2     # centrado na caixa
    assert (ys.max() + 1 - ys.min()) <= 630 + 2              # nunca maior que a altura da caixa
    assert (xs.max() + 1 - xs.min()) <= 288 + 2              # nem que a largura


def test_empilha_poe_o_elemento_sobre_a_cena_e_deixa_o_resto():
    cena = np.full((100, 80, 3), 0.5, np.float32)
    el = np.zeros((100, 80, 3), np.float32)
    el[:, :] = (1.0, 0.0, 0.0)
    al = np.zeros((100, 80), np.float32)
    al[20:60, 30:50] = 1
    out = c.empilha(cena, [(el, al)])
    assert np.allclose(out[40, 40], (1, 0, 0)) and np.allclose(out[5, 5], (0.5, 0.5, 0.5))


def test_sombra_de_contato_fica_sob_os_pes_e_escurece():
    al = np.zeros((200, 160), np.float32)
    al[50:150, 60:100] = 1
    sombra = c.sombra_de_contato(al, forca=0.5)
    assert sombra.shape == al.shape and sombra.max() <= 0.5 + 1e-6
    ys, _ = np.where(sombra > 0.05)
    assert ys.min() >= 135 and ys.max() <= 175               # perto da base (150), não no corpo


def test_sombra_com_elemento_largo_nao_quebra_o_desfoque():
    # regressão: com largura > 50 px o raio do desfoque virava np.float64 e o Pillow recusava
    al = np.zeros((400, 300), np.float32)
    al[50:350, 80:230] = 1
    sombra = c.sombra_de_contato(al)
    assert sombra.shape == al.shape and sombra.max() > 0.1


def test_contrato_de_dimensoes():
    assert c.confere_dimensoes((2304, 1856)) == []
    assert c.confere_dimensoes((1152, 928)) == []                       # metade (testes provisórios)
    assert c.confere_dimensoes((1341, 1080), (1341, 1080)) == []        # tamanho de entrega
    assert c.confere_dimensoes((1000, 1000)) != []                      # quadrada: rejeita
    assert c.confere_dimensoes((2304, 1843)) != []                      # 4:5 exato (0,8) difere 0,7% do contrato (0,8056): recusado


def test_montagem_json_das_cenas_de_teste_e_consumivel():
    base = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'testes-de-cenas')
    for cena in sorted(os.listdir(base)):
        arq = os.path.join(base, cena, 'montagem.json')
        if not os.path.exists(arq):
            continue
        camadas = c.le_montagem(arq)
        assert camadas[0]['papel'] == 'cenario' and [k['z'] for k in camadas] == sorted(k['z'] for k in camadas), cena
        json.dumps(camadas)


if __name__ == '__main__':
    for nome, fn in list(globals().items()):
        if nome.startswith('test_'):
            fn()
    print('ok')
