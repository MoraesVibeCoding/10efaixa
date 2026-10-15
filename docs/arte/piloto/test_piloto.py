#!/usr/bin/env python3
"""Autoteste do piloto de cenas pela API (v3.00): prompt, conferência automática e recorte 4:5."""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from piloto import conferir, custo_estimado, destino_no_jogo, extrai_bloco, montar_prompt, recorta_4x5, tracos_visual  # noqa: E402

CENA_MD = """# Cena
## Prompt
````
STYLE
Painted.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks.
The back of the magenta shirt is fully visible: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it.
One team-mate in the same magenta-and-cyan kit watches. Opponents wear plain light-grey shirts.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only.
- Cyan appears in one place only.

COMPOSITION
Vertical.
````
"""

VISUAL_MD = """CHARACTER (this image only)
- Skin: very dark brown skin (deep, cool undertone). Even tone, no freckles.
- Hair: a medium-sized rounded black afro, about 6 cm long, evenly shaped.
- Facial hair: a short, full, neatly trimmed black beard.
"""

KIT = {'camisa': 'black body with red shoulders', 'calcao': 'black with a red side panel', 'meiao': 'black with red stripes'}


def test_extrai_bloco_aceita_tres_ou_quatro_crases():
    assert extrai_bloco(CENA_MD).startswith('STYLE')
    assert extrai_bloco('x\n```\nABC\n```\n') == 'ABC'


def test_tracos_do_visual_pegam_a_primeira_frase():
    t = tracos_visual(VISUAL_MD)
    assert t == {'pele': 'very dark brown skin (deep, cool undertone)',
                 'cabelo': 'a medium-sized rounded black afro, about 6 cm long, evenly shaped',
                 'barba': 'a short, full, neatly trimmed black beard'}


def test_prompt_troca_magenta_e_ciano_pelo_kit_e_tira_o_plano_de_cor():
    p = montar_prompt(extrai_bloco(CENA_MD), tracos_visual(VISUAL_MD), KIT)
    assert 'magenta' not in p.lower() and 'cyan' not in p.lower()
    assert 'COLOUR PLAN' not in p and 'recolour' not in p
    assert 'very dark brown skin' in p and 'afro' in p
    assert 'black body with red shoulders' in p
    assert 'Opponents wear plain light-grey shirts' in p
    assert 'COMPOSITION' in p
    assert 'smooth, flat' not in p and 'showing the club jersey design' in p


def fundo(h=100, w=80):
    img = np.zeros((h, w, 3), np.uint8)
    img[:] = (40, 60, 50)
    img[int(h * 0.7):] = (10, 14, 20)
    return img


def test_conferir_aprova_cena_limpa():
    assert conferir(fundo()) == []


def test_conferir_reprova_sobra_de_magenta_e_ciano():
    img = fundo()
    img[10:30, 10:30] = (230, 20, 220)
    img[40:55, 10:30] = (20, 220, 230)
    assert conferir(img) == ['magenta', 'ciano']


def test_conferir_reprova_faixa_de_baixo_clara():
    img = fundo()
    img[int(100 * 0.7):] = (200, 200, 200)
    assert conferir(img) == ['faixa-clara']


def test_recorte_4x5_mantem_o_topo():
    img = np.zeros((1536, 1024, 3), np.uint8)
    img[0, 0] = 255
    out = recorta_4x5(img)
    assert out.shape[:2] == (1280, 1024)
    assert out[0, 0, 0] == 255


def test_destino_no_jogo_tira_o_numero_da_cena():
    assert destino_no_jogo('12-gol', 1, 'athletico-pr') == 'gol/athletico-pr/visual-01.webp'
    assert destino_no_jogo('22-cabecada', 5, 'athletico-pr') == 'cabecada/athletico-pr/visual-05.webp'


def test_custo_estimado_usa_o_valor_por_imagem_entregue():
    # US$ 2,53 no painel da OpenAI por 29 imagens entregues em 2026-10-14 (as falhas já entram no valor)
    assert custo_estimado(29, 0.087) == 2.52
    assert custo_estimado(8700, 0.087) == 756.9


def test_modo_generico_mantem_magenta_e_ciano_e_troca_so_o_jogador():
    p = montar_prompt(extrai_bloco(CENA_MD), tracos_visual(VISUAL_MD), None)
    assert 'magenta' in p and 'cyan' in p and 'COLOUR PLAN' in p
    assert 'very dark brown skin' in p and 'Image 1' in p
    assert 'club' not in p.lower()


def test_conferir_generico_aceita_magenta_e_ciano():
    img = fundo()
    img[10:30, 10:30] = (230, 20, 220)
    assert conferir(img, generico=True) == []


def test_recolorir_troca_magenta_e_ciano_mantendo_a_sombra():
    from piloto import recolorir
    img = fundo()
    img[10:20, 10:30] = (230, 20, 220)   # magenta claro
    img[20:30, 10:30] = (115, 10, 110)   # magenta na sombra
    img[40:50, 10:30] = (20, 220, 230)   # ciano
    out = recolorir(img, magenta=(200, 16, 46), ciano=(20, 20, 22))
    claro, sombra, ciano = out[15, 20].astype(int), out[25, 20].astype(int), out[45, 20].astype(int)
    assert claro[0] > 150 and claro[1] < 60 and claro[2] < 80      # vermelho
    assert sombra[0] < claro[0]                                      # sombra preservada
    assert ciano.max() < 60                                          # ciano virou escuro
    assert (out[60:, :] == img[60:, :]).all()                        # resto da cena intacto


def test_recolorir_ignora_pontos_soltos_da_cor_no_fundo():
    from piloto import recolorir
    img = fundo(200, 160)
    img[100:160, 40:100] = (20, 220, 230)   # calção ciano
    img[10:13, 120:123] = (30, 140, 200)    # pontinho azulado da janela
    out = recolorir(img, ciano=(20, 20, 22))
    assert out[130, 70].max() < 60
    assert (out[10:13, 120:123] == img[10:13, 120:123]).all()


def test_recolorir_pega_a_luz_de_borda_colada_e_poupa_o_fundo_laranja():
    from piloto import recolorir
    img = fundo(200, 160)
    img[60:140, 40:100] = (230, 20, 220)    # camisa magenta
    img[60:140, 34:40] = (240, 120, 125)    # luz de borda salmão, colada na camisa (6 px)
    img[60:140, 100:106] = (247, 180, 88)   # céu laranja do pôr do sol, colado do outro lado
    out = recolorir(img, magenta=(22, 22, 24))
    assert out[100, 35].max() < 120                                   # filete trocado
    assert (out[60:140, 100:106] == img[60:140, 100:106]).all()       # céu intacto
