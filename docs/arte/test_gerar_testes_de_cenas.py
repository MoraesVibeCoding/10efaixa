#!/usr/bin/env python3
"""Autoteste de gerar_testes_de_cenas.py:  python3 docs/arte/test_gerar_testes_de_cenas.py"""
import glob
import json
import os
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gerar_testes_de_cenas as g  # noqa: E402

SAIDA = tempfile.mkdtemp()
g.gerar(SAIDA)
CENAS = ['01-treino', '02-estadio', '03-vestiario', '04-penalti', '05-casa-familia']


def prompts():
    return sorted(glob.glob(os.path.join(SAIDA, '*', '*', 'prompt.md')))


def lido(p):
    return open(p, encoding='utf-8').read()


def test_cinco_cenas_e_25_camadas():
    assert sorted(d for d in os.listdir(SAIDA) if os.path.isdir(os.path.join(SAIDA, d))) == CENAS
    assert len(prompts()) == 25
    contagem = {c: len(glob.glob(os.path.join(SAIDA, c, '*', 'prompt.md'))) for c in CENAS}
    assert contagem == {'01-treino': 6, '02-estadio': 6, '03-vestiario': 4, '04-penalti': 5, '05-casa-familia': 4}


def test_cada_cena_tem_readme_montagem_e_avaliacao():
    for c in CENAS:
        for f in ('README.md', 'montagem.json', 'avaliacao.md'):
            assert os.path.exists(os.path.join(SAIDA, c, f)), (c, f)
    assert os.path.exists(os.path.join(SAIDA, 'README.md'))


def test_ficha_da_cena_e_identica_em_todas_as_camadas_da_cena():
    for c in CENAS:
        fichas = set()
        for p in glob.glob(os.path.join(SAIDA, c, '*', 'prompt.md')):
            t = lido(p)
            assert 'SCENE SHEET' in t, p
            fichas.add(t.split('SCENE SHEET')[1].split('THIS LAYER')[0])
        assert len(fichas) == 1, c


def test_camadas_soltas_em_verde_chapado_sem_chao_nem_sombra():
    for p in prompts():
        pasta = os.path.basename(os.path.dirname(p))
        t = lido(p)
        if pasta.startswith('01-cenario'):
            assert 'No people at all' in t and 'No text' in t, p
            assert '#00B140' not in t.split('MUST NOT APPEAR')[0].split('BACKGROUND')[1], p
        else:
            assert '#00B140' in t and 'no cast shadow' in t and 'no ground' in t, p


def test_jogador_de_costas_pele_marrom_e_so_curto_ou_coque_sem_acessorio():
    jogadores = [p for p in prompts() if '/04-jogador' in p]
    assert len(jogadores) == 10
    formatos = set()
    for p in jogadores:
        t = lido(p)
        assert 'seen entirely from behind' in t and 'brown skin' in t, p
        assert 'headband' not in t.split('MUST NOT APPEAR')[0], p
        formatos.add('curto' if 'short curly dark-brown hair' in t else 'coque' if 'neat bun' in t else '?')
    assert formatos == {'curto', 'coque'}


def test_uniforme_nas_cores_chave_e_roupa_casual_na_casa():
    for p in prompts():
        t = lido(p)
        if '/04-jogador' in p and '05-casa-familia' not in p:
            assert 'magenta' in t and 'cyan' in t, p
        if '/04-jogador' in p and '05-casa-familia' in p:
            assert 'magenta' in t and 'tracksuit trousers' in t and 'There is no cyan' in t, p


def test_regras_gerais_em_todos_os_prompts():
    for p in prompts():
        t = lido(p)
        for frase in ('No text, letters or numbers', 'No logos', 'No watermark', 'imagem.jpeg'):
            assert frase in t, (p, frase)


def test_montagem_json_valido_e_aponta_para_camadas_que_existem():
    for c in CENAS:
        m = json.load(open(os.path.join(SAIDA, c, 'montagem.json'), encoding='utf-8'))
        assert m['tela'] == [1856, 2304]
        zs = [camada['z'] for camada in m['camadas']]
        assert zs == sorted(zs) and m['camadas'][0]['pasta'].startswith('01-cenario')
        for camada in m['camadas']:
            assert os.path.isdir(os.path.join(SAIDA, c, camada['pasta'])), (c, camada['pasta'])
            if camada['alvo']:
                x0, y0, x1, y1 = camada['alvo']
                assert 0 <= x0 < x1 <= 1 and 0 <= y0 < y1 <= 1, (c, camada)
        assert sum(1 for k in m['camadas'] if k['papel'] == 'jogador') == 2


def test_avaliacao_registra_esforco_custo_e_motivo_de_rejeicao():
    for c in CENAS:
        t = lido(os.path.join(SAIDA, c, 'avaliacao.md'))
        for termo in ('Tentativas', 'Minutos de intervenção humana', 'Custo', 'Motivo de rejeição', '360 px', 'Pixels idênticos fora da região editada'):
            assert termo in t, (c, termo)


def test_readme_geral_lista_as_25_camadas_e_o_protocolo():
    t = lido(os.path.join(SAIDA, 'README.md'))
    assert '25' in t and 'avaliacao.md' in t and 'curto' in t and 'coque' in t
    for c in CENAS:
        assert c in t


if __name__ == '__main__':
    for nome, fn in list(globals().items()):
        if nome.startswith('test_'):
            fn()
    print('ok')
