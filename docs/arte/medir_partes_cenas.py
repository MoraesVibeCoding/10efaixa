#!/usr/bin/env python3
"""Mede as partes das máscaras de uniforme de cada cena (SPEC v2.98) e grava em src/data/cenasArte.json.

O jogo vai esticar a textura do uniforme do clube no retângulo de cada parte da máscara (a camisa do jogador, as dos companheiros, o
calção, os meiões). Aqui se mede onde cada parte está:
  camisa: lista de caixas [x0, y0, x1, y1] (frações da imagem), a maior primeiro (a do jogador);
  calcao: lista de [papel, x0, y0, x1, y1], o maior bloco primeiro, com papel
          'calcao' = calção do jogador, 'meiao' = meião do jogador, 'resto' = companheiros ao fundo (calção e meiões juntos).
O vazamento da máscara do calção sobre o céu (14 das 96 máscaras) não vira parte e portanto não é pintado: as mesmas regras do gerador de
docs/cenas (bloco que encosta no topo, cobre a largura, é enorme ou termina no alto da imagem é descartado).

Uso:  python3 docs/arte/medir_partes_cenas.py
Autoteste:  python3 docs/arte/test_medir_partes_cenas.py
"""
import json
import os
import re

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

HERE = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(HERE, '..', '..'))
DADOS = os.path.join(RAIZ, 'src', 'data', 'cenasArte.json')
CENAS = os.path.join(RAIZ, 'src', 'assets', 'cenas')

PISO_CAMISA = 0.35        # abaixo disto a máscara da camisa é ruído de borda (até 0,28 no topo de uma cena)
AREA_MIN_CAMISA = 0.00025  # fração da imagem: camisa menor que isto (jogador minúsculo ao longe) não ganha textura
LIMIAR_BLOCO = 0.85       # alfa a partir do qual um pixel do calção conta (o calção de verdade é ~1; o vazamento em gradiente fica abaixo de 0,7)
AREA_MIN_CALCAO = 0.00012
FAIXA_TOPO = 0.03         # bloco que encosta nesta faixa de cima é vazamento sobre o céu
LARGURA_MAX = 0.5         # calção e meiões de um jogador nunca passam desta fração da largura (vazamento cobre 1,0)
BASE_MIN = 0.20           # bloco que termina acima desta fração da altura é céu, janela ou refletor
AREA_MAX = 0.12           # o maior calção ocupa 3,9% da imagem; o vazamento ocupa de 10% a 27%
PAD = 0.006               # folga em volta de cada caixa, para a borda suave da máscara não ficar sem textura


def _caixas(mask):
    """Componentes conexos da máscara booleana: lista de (área em px, y0, y1, x0, x1)."""
    lab, n = ndi.label(mask)
    out = []
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        if sl is None:
            continue
        area = int((lab[sl] == i).sum())
        out.append((area, sl[0].start, sl[0].stop, sl[1].start, sl[1].stop))
    return out


def _norm(y0, y1, x0, x1, h, w, pad):
    x0n, y0n, x1n, y1n = max(0.0, x0 / w - pad), max(0.0, y0 / h - pad), min(1.0, x1 / w + pad), min(1.0, y1 / h + pad)
    return [round(x0n, 4), round(y0n, 4), round(x1n, 4), round(y1n, 4)]


def partes_camisa(alfa, pad=0.0):
    h, w = alfa.shape
    cs = [c for c in _caixas(alfa >= PISO_CAMISA) if c[0] >= AREA_MIN_CAMISA * h * w]
    cs.sort(key=lambda c: -c[0])
    return [_norm(c[1], c[2], c[3], c[4], h, w, pad) for c in cs]


def partes_calcao(alfa, pad=0.0):
    if alfa is None:
        return []
    h, w = alfa.shape
    topo = max(1, int(h * FAIXA_TOPO))
    blocos = []
    for area, y0, y1, x0, x1 in _caixas(alfa >= LIMIAR_BLOCO):
        if area < AREA_MIN_CALCAO * h * w:
            continue
        if y0 < topo or (x1 - x0) / w > LARGURA_MAX or area / (h * w) > AREA_MAX or y1 / h < BASE_MIN:
            continue  # vazamento sobre o céu
        blocos.append((area, y0, y1, x0, x1))
    if not blocos:
        return []
    blocos.sort(key=lambda b: -b[0])
    _, my0, my1, mx0, mx1 = blocos[0]
    mh, mw = my1 - my0, mx1 - mx0
    saida = [['calcao', *_norm(my0, my1, mx0, mx1, h, w, pad)]]
    for _, y0, y1, x0, x1 in blocos[1:]:
        cx = (x0 + x1) / 2
        meiao = (mx0 - 0.5 * mw <= cx <= mx1 + 0.5 * mw) and y0 >= my0 + 0.4 * mh   # abaixo do calção, na altura do jogador
        saida.append(['meiao' if meiao else 'resto', *_norm(y0, y1, x0, x1, h, w, pad)])
    return saida


def alfa(caminho):
    return np.asarray(Image.open(caminho).convert('RGBA'), dtype=np.float32)[..., 3] / 255.0


def main():
    dados = json.load(open(DADOS, encoding='utf-8'))
    for cena, d in dados['cenas'].items():
        for corte, c in d['cortes'].items():
            base = os.path.join(CENAS, cena, corte)
            partes = {
                'camisa': partes_camisa(alfa(base + '-camisa.webp'), PAD),
                'calcao': partes_calcao(alfa(base + '-calcao.webp') if c['calcao'] else None, PAD),
            }
            c['partes'] = '@@' + json.dumps(partes, ensure_ascii=False) + '@@'   # uma linha por corte, no resto do arquivo o formato não muda
        print('ok', cena)
    nota = dados.get('_nota', '')
    if 'partes' not in nota:
        dados['_nota'] = nota + ' v2.98: `partes` = caixas (frações da imagem) de cada parte da máscara, medidas por docs/arte/medir_partes_cenas.py; o jogo estica a textura do uniforme do clube em cada caixa.'
    texto = json.dumps(dados, ensure_ascii=False, indent=1)
    texto = re.sub(r'"@@(.*?)@@"', lambda mo: json.loads('"' + mo.group(1) + '"'), texto)
    with open(DADOS, 'w', encoding='utf-8') as f:
        f.write(texto + '\n')


if __name__ == '__main__':
    main()
