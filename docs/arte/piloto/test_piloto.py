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
