#!/usr/bin/env python3
"""Autoteste de gerar_camadas_teste.py:  python3 docs/arte/test_gerar_camadas_teste.py"""
import os
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gerar_camadas_teste as g  # noqa: E402

_saida = tempfile.mkdtemp()
g.gerar(_saida)


def lido(pasta):
    return open(os.path.join(_saida, pasta, 'prompt.md'), encoding='utf-8').read()


def test_quatro_camadas_e_readme():
    assert sorted(g.CAMADAS) == ['01-fundo-treino', '02-jogador-curto', '03-jogador-coque', '04-bola']
    for c in g.CAMADAS:
        assert os.path.exists(os.path.join(_saida, c, 'prompt.md')), c
    assert os.path.exists(os.path.join(_saida, 'README.md'))


def test_fundo_nao_tem_gente_nem_cores_de_troca():
    t = lido('01-fundo-treino')
    assert 'No people at all' in t and 'No ball' in t
    corpo = t.split('COLOUR PLAN')[1].split('COMPOSITION')[0]
    assert 'No magenta' in corpo and 'no cyan' in corpo.lower()


def test_jogador_e_recortavel_e_so_o_uniforme_troca():
    for c in ('02-jogador-curto', '03-jogador-coque'):
        t = lido(c)
        assert '#00B140' in t, c                      # fundo verde chapado, como os retratos
        assert 'magenta' in t and 'cyan' in t, c      # cores-chave do uniforme
        assert 'no cast shadow' in t and 'no ground' in t, c
        assert 'brown skin' in t, c                   # base que o código recolore
        assert 'seen entirely from behind' in t, c
        assert '12%' in t and '75%' in t, c           # mesmo posicionamento da cena de treino


def test_formatos_de_cabelo_dos_dois_jogadores():
    assert 'short curly dark-brown hair' in lido('02-jogador-curto')
    assert 'gathered into a neat bun' in lido('03-jogador-coque')
    assert 'bun' not in lido('02-jogador-curto')


def test_bola_isolada_e_sem_marca():
    t = lido('04-bola')
    assert '#00B140' in t and 'plain white football' in t and 'no pattern' in t


def test_regras_gerais_em_todos():
    for c in g.CAMADAS:
        t = lido(c)
        assert 'No text' in t and 'No logos' in t and 'No watermark' in t, c
        assert 'imagem.jpeg' in t, c


if __name__ == '__main__':
    for nome, fn in list(globals().items()):
        if nome.startswith('test_'):
            fn()
    print('ok')
