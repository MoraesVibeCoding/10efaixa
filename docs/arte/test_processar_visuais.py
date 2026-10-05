#!/usr/bin/env python3
"""Autoteste do pós-processamento dos visuais (docs/arte/processar_visuais.py).
Uso: uv run --with pillow --with numpy python docs/arte/test_processar_visuais.py
Cria imagens sintéticas (fundo verde, corpo magenta, cabeça cor de pele) e confere cada etapa."""
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
import processar_visuais as pv  # noqa: E402

GREEN = (15, 170, 72)


def fake(w=400, h=500, head_top=0.04, side=0.06, bg=GREEN):
    """Pessoa sintética: cabeça (elipse cor de pele) e camisa magenta, sobre fundo verde chapado."""
    im = np.zeros((h, w, 3), dtype=np.uint8); im[:] = bg
    cx = w // 2
    top = int(h * head_top)
    for y in range(top, top + int(h * 0.20)):          # cabeça
        r = int(w * 0.11 * np.sqrt(max(0.0, 1 - ((y - top - h * 0.10) / (h * 0.10)) ** 2)))
        im[y, cx - r:cx + r] = (200, 150, 120)
    x0, x1 = int(w * side), int(w * (1 - side))
    im[int(h * 0.30):, x0:x1] = (204, 0, 170)           # camisa
    return Image.fromarray(im)


def test_matte_remove_fundo_e_mantem_pessoa():
    a = pv.matte(np.asarray(fake()).astype(float))
    assert a[2, 2] == 0 and a[-3, 2] == 0, 'cantos do fundo devem ficar transparentes'
    assert a[300, 200] == 1.0, 'camisa opaca'
    assert a[60, 200] == 1.0, 'rosto opaco'


def test_despill_tira_verde_da_borda():
    img = np.asarray(fake()).astype(float)
    a = pv.matte(img)
    out = pv.despill(img, a)
    edge = (a > 0.05) & (a < 0.95)
    if edge.any():
        assert (out[..., 1][edge] <= np.maximum(out[..., 0], out[..., 2])[edge] + 1).all(), 'sem verde dominante na borda'


def test_reenquadra_cabeca_a_10_por_cento_sem_cortar_o_corpo():
    im = fake(head_top=0.04)
    out = pv.processar(im)
    rgba = np.asarray(out)
    assert out.mode == 'RGBA'
    w, h = out.size
    assert abs(w / h - 0.8) < 0.01, f'proporção {w}x{h}'
    rows = np.where(rgba[..., 3].max(1) > 128)[0]
    assert 9.0 <= 100 * rows[0] / h <= 11.0, f'topo da cabeça a {100 * rows[0] / h:.1f}%'
    assert rows[-1] == h - 1, 'o corte da cintura (base) é preservado'
    assert out.size[1] > im.size[1], 'a tela cresceu em vez de cortar'


def test_margem_lateral_minima_de_8_por_cento():
    out = pv.processar(fake(side=0.02))
    rgba = np.asarray(out); w, h = out.size
    cols = np.where(rgba[int(h * 0.8), :, 3] > 128)[0]
    assert 100 * cols[0] / w >= 7.9 and 100 * (w - 1 - cols[-1]) / w >= 7.9


def test_ja_enquadrada_nao_muda_de_forma():
    out = pv.processar(fake(head_top=0.10, side=0.12))
    w, h = out.size
    assert abs(w / h - 0.8) < 0.01
    rows = np.where(np.asarray(out)[..., 3].max(1) > 128)[0]
    assert 9.0 <= 100 * rows[0] / h <= 11.0


def test_fundo_com_tom_diferente_tambem_sai():
    a = pv.matte(np.asarray(fake(bg=(20, 150, 60))).astype(float))
    assert a[2, 2] == 0


if __name__ == '__main__':
    fails = 0
    for name, fn in sorted(globals().items()):
        if name.startswith('test_') and callable(fn):
            try:
                fn(); print('ok  ', name)
            except Exception as e:  # noqa: BLE001
                fails += 1; print('FALHA', name, '->', repr(e))
    sys.exit(1 if fails else 0)
