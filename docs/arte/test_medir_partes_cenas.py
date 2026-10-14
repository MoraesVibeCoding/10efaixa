#!/usr/bin/env python3
"""Autoteste de medir_partes_cenas.py:  python3 docs/arte/test_medir_partes_cenas.py"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import medir_partes_cenas as m  # noqa: E402


def bloco(alfa, y0, y1, x0, x1, v=1.0):
    alfa[y0:y1, x0:x1] = v


def test_camisa_ordena_por_area_e_descarta_ruido():
    a = np.zeros((100, 80), np.float32)
    bloco(a, 20, 60, 20, 60)        # camisa do jogador
    bloco(a, 30, 40, 5, 13)         # camisa de companheiro (fica)
    bloco(a, 70, 71, 70, 71)        # ruído de 1 px (cai)
    bloco(a, 5, 8, 5, 8, 0.2)       # borda fraca abaixo do piso (cai)
    caixas = m.partes_camisa(a)
    assert caixas == [[0.25, 0.2, 0.75, 0.6], [0.0625, 0.3, 0.1625, 0.4]]


def test_calcao_papeis():
    a = np.zeros((200, 160), np.float32)
    bloco(a, 80, 110, 60, 100)      # calção do jogador
    bloco(a, 115, 170, 62, 72)      # meião esquerdo
    bloco(a, 115, 170, 88, 98)      # meião direito
    bloco(a, 90, 105, 10, 18)       # companheiro ao fundo (calção e meiões juntos)
    bloco(a, 0, 20, 0, 160)         # vazamento sobre o céu: encosta no topo e cobre a largura
    papeis = [(p, c) for p, *c in m.partes_calcao(a)]
    assert [p for p, _ in papeis].count('calcao') == 1
    assert [p for p, _ in papeis].count('meiao') == 2
    assert [p for p, _ in papeis].count('resto') == 1
    assert len(papeis) == 4                                   # o vazamento não vira parte
    assert papeis[0] == ('calcao', [0.375, 0.4, 0.625, 0.55])  # o maior bloco vem primeiro


def test_sem_calcao_devolve_lista_vazia():
    assert m.partes_calcao(np.zeros((50, 50), np.float32)) == []
    assert m.partes_calcao(None) == []


def test_cenas_do_jogo_tem_partes_em_todo_corte():
    import json
    dados = json.load(open(os.path.join(m.RAIZ, 'src', 'data', 'cenasArte.json'), encoding='utf-8'))['cenas']
    for cena, d in dados.items():
        for corte, c in d['cortes'].items():
            assert c['partes']['camisa'], (cena, corte)
            papeis = [p[0] for p in c['partes']['calcao']]
            if c['calcao']:
                assert papeis.count('calcao') == 1, (cena, corte, papeis)
            else:
                assert papeis == [], (cena, corte)


if __name__ == '__main__':
    for nome, fn in list(globals().items()):
        if nome.startswith('test_'):
            fn()
    print('ok')
