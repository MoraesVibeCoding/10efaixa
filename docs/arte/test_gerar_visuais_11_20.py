#!/usr/bin/env python3
"""Autoteste do gerar_visuais_11_20: os 10 prompts novos são iguais ao do Visual 04 fora do bloco do personagem."""
import os
import sys
import tempfile

sys.path.insert(0, os.path.dirname(__file__))
from gerar_visuais_11_20 import FICHAS, gerar  # noqa: E402

BASE = os.path.join(os.path.dirname(__file__), 'visuais', 'visual-04', 'prompt.md')
TEMPLATE = open(BASE, encoding='utf-8').read()


def fatia(texto, de, ate):
    return texto[texto.index(de):texto.index(ate)]


def gerados():
    with tempfile.TemporaryDirectory() as d:
        gerar(d)
        return {n: open(os.path.join(d, f'visual-{n}', 'prompt.md'), encoding='utf-8').read() for n in range(11, 21)}


def test_gera_os_dez_visuais_novos():
    assert sorted(gerados()) == list(range(11, 21)) and len(FICHAS) == 10


def test_estilo_corpo_fundo_e_composicao_sao_identicos_ao_visual_04():
    for n, t in gerados().items():
        assert fatia(t, 'Create ONE vertical', 'SUBJECT') == fatia(TEMPLATE, 'Create ONE vertical', 'SUBJECT'), n
        assert fatia(t, 'BODY AND POSE', 'CLOTHING') == fatia(TEMPLATE, 'BODY AND POSE', 'CLOTHING'), n
        assert fatia(t, 'BACKGROUND', 'LIGHTING') == fatia(TEMPLATE, 'BACKGROUND', 'LIGHTING'), n
        assert fatia(t, 'COMPOSITION', '```\n\n## Conferência') == fatia(TEMPLATE, 'COMPOSITION', '```\n\n## Conferência'), n


def test_cada_prompt_tem_o_proprio_personagem_e_nao_o_do_visual_04():
    for n, t in gerados().items():
        assert f'# Visual {n}:' in t and '# Visual 04' not in t
        assert 'very short, tightly coiled black hair, about 2 cm' not in t, n
        assert t.count('CHARACTER (this image only)') == 1


def test_olhos_castanho_escuros_e_orelhas_visiveis_em_todos():
    for n, t in gerados().items():
        assert 'DARK BROWN iris' in t and 'must NOT be green, blue, grey, hazel or yellow' in t, n
        assert 'Both ears fully visible' in t, n


def test_personagem_original_sem_citar_ninguem():
    for n, t in gerados().items():
        assert 'ORIGINAL FICTIONAL CHARACTER and does not resemble any real person' in t, n
        assert 'Do not base the face, hair or beard on any real individual' in t, n


def test_cabelo_claro_ajusta_o_plano_de_cor_e_o_escuro_mantem():
    for n, t in gerados().items():
        claro = FICHAS[n]['claro']
        plano = fatia(t, 'COLOUR PLAN', 'COMPOSITION')
        if claro:
            assert 'Apart from the hair colour' in plano and 'only black, dark-brown or brown tones' not in plano, n
            assert FICHAS[n]['cor_hex'] in t, n
        else:
            assert 'only black, dark-brown or brown tones' in plano and 'Apart from the hair colour' not in plano, n


def test_nenhum_visual_usa_faixa_de_cabelo():
    # SPEC v2.96: o conjunto de visuais não tem acessórios (a faixa saiu da ficha dos visuais 11, 14, 17 e 18)
    com = set()
    for n, t in gerados().items():
        person = fatia(t, 'CHARACTER (this image only)', 'BODY AND POSE')
        assert ('plain' in person and 'headband' in person and 'no headband' not in person) == (n in com), n


def test_ficha_do_readme_cobre_os_dez():
    for n, f in FICHAS.items():
        assert f['ficha'].startswith('pele ') and f['idade'] in range(18, 32), n


if __name__ == '__main__':
    for nome, fn in list(globals().items()):
        if nome.startswith('test_'):
            fn()
    print('ok')
