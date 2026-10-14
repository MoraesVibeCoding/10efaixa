#!/usr/bin/env python3
"""Autoteste de gerar_cenas_novas.py:  python3 docs/arte/test_gerar_cenas_novas.py"""
import glob
import os
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gerar_cenas_novas as g  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
_cache = {}


def gerados():
    if not _cache:
        saida = tempfile.mkdtemp()
        g.gerar(saida)
        for p in glob.glob(os.path.join(saida, '*', '*', 'prompt.md')):
            cena, formato = p.split(os.sep)[-3:-1]
            _cache[(cena, formato)] = open(p, encoding='utf-8').read()
        _cache['saida'] = saida
    return {k: v for k, v in _cache.items() if k != 'saida'}


def test_total_e_distribuicao():
    ger = gerados()
    assert len(g.FORMATOS) == 9 and len(g.FORMATOS_NOVOS) == 3
    cenas = sorted({c for c, _ in ger})
    assert len(cenas) == 39, len(cenas)
    for c in cenas:
        n = int(c[:2])
        esperado = set(g.FORMATOS) if n >= 22 else set(g.FORMATOS_NOVOS)
        assert {f for cc, f in ger if cc == c} == esperado, c
    assert len(ger) == 21 * 3 + 18 * 9 == 225


def test_cada_prompt_traz_so_o_cabelo_do_formato():
    for (cena, formato), t in gerados().items():
        _, cabelo = g.FORMATOS[formato]
        assert cabelo in t, (cena, formato)
        if formato != 'curto':
            assert g.CABELO_CURTO not in t, (cena, formato)
        assert 'brown skin' in t, (cena, formato)  # a pele marrom é a base que o código recolore
        if formato in g.SOLTO_NAO_VALE:
            assert 'loose, not tied' not in t.replace('loose and not tied', ''), (cena, formato)


def test_titulo_e_sem_acessorio():
    for (cena, formato), t in gerados().items():
        assert f'formato {g.FORMATOS[formato][0]}' in t.splitlines()[0], (cena, formato)
        assert 'corte Curto' not in t, (cena, formato)
        assert 'headband' not in t.split('MUST NOT APPEAR')[0], (cena, formato)  # sem acessório no jogador (boné de figurante é outra coisa)


def test_descricoes_dos_seis_formatos_antigos_batem_com_os_prompts_existentes():
    for formato in ('cacheado-medio', 'liso-medio', 'cacheado-grande', 'liso-grande', 'careca'):
        antigo = open(os.path.join(HERE, 'cenas', '22-cabecada', formato, 'prompt.md'), encoding='utf-8').read()
        assert g.FORMATOS[formato][1] in antigo, formato


def test_primeira_leva_sao_as_cinco_cenas_mais_usadas_com_os_tres_formatos_novos():
    assert g.PRIMEIRA_LEVA == ['11-treino', '21-estadio', '02-vestiario', '08-casa-familia', '12-gol']
    ger = gerados()
    for c in g.PRIMEIRA_LEVA:
        for f in g.FORMATOS_NOVOS:
            assert (c, f) in ger
    readme = open(os.path.join(_cache['saida'], 'README.md'), encoding='utf-8').read()
    assert '225' in readme and '11-treino/degrade-alto' in readme


if __name__ == '__main__':
    for nome, fn in list(globals().items()):
        if nome.startswith('test_'):
            fn()
    print('ok')
