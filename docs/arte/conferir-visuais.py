#!/usr/bin/env python3
"""Conferidor dos 10 retratos de visuais (docs/arte/visuais/visual-NN/).

Mede, para cada imagem: proporção e tamanho, cor do fundo nos 4 cantos e na imagem toda, posição do topo da cabeça,
margens laterais nos ombros, cor da camisa e se há verde/magenta vazando no corpo. Imprime uma tabela e sai com
código 1 se alguma imagem reprovar. Só mede o que dá para medir sem reconhecer rostos: olhos, barba e "se parece
com alguém" continuam sendo conferência humana (lista no fim de cada prompt.md).

Uso:  python3 docs/arte/conferir-visuais.py [pasta]   (padrão: docs/arte/visuais)
Precisa de Pillow e numpy.  Aceita Image.jpeg, imagem.jpeg, "Image 2.jpeg", .jpg e .png em cada pasta visual-NN.
"""
import glob
import os
import sys

import numpy as np
from PIL import Image

BG = np.array([0, 177, 64], dtype=float)        # #00B140
SHIRT = np.array([204, 0, 170], dtype=float)    # #CC00AA (aproximado)
MIN_LONG_SIDE = 2000
ASPECT = 4 / 5
TOL = {'aspect': 0.01, 'corner': 22, 'corner_spread': 14, 'head_top': (6.0, 14.0), 'side_margin_min': 8.0, 'shirt': 70}


def dist(a, b):
    return float(np.sqrt(((a - b) ** 2).sum()))


def analyse(path):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    a = np.asarray(im).astype(float)
    r = {'w': w, 'h': h, 'fail': [], 'warn': []}

    r['aspect'] = w / h
    if abs(r['aspect'] - ASPECT) > TOL['aspect']:
        r['fail'].append(f'proporção {w}x{h} (esperado 4:5)')
    if max(w, h) < MIN_LONG_SIDE:
        r['fail'].append(f'resolução {w}x{h}: lado maior < {MIN_LONG_SIDE}px')

    n = max(8, w // 60)
    corners = [a[:n, :n], a[:n, -n:], a[-n:, :n], a[-n:, -n:]]
    means = [c.reshape(-1, 3).mean(0) for c in corners]
    r['corner_dist'] = [dist(m, BG) for m in means]
    r['corner_spread'] = max(dist(means[i], means[j]) for i in range(4) for j in range(i + 1, 4))
    if max(r['corner_dist']) > TOL['corner']:
        r['fail'].append(f'fundo longe de #00B140 (máx {max(r["corner_dist"]):.0f})')
    if r['corner_spread'] > TOL['corner_spread']:
        r['fail'].append(f'fundo desigual entre os cantos ({r["corner_spread"]:.0f})')

    ref = np.mean(means, axis=0)
    r['bg_mean'] = ref
    bgmask = np.sqrt(((a - ref) ** 2).sum(2)) < 48
    subject = ~bgmask
    rows = np.where(subject.sum(1) > max(3, w * 0.01))[0]
    r['head_top_pct'] = 100 * rows[0] / h if len(rows) else float('nan')
    lo, hi = TOL['head_top']
    if not (lo <= r['head_top_pct'] <= hi):
        r['fail'].append(f'topo da cabeça a {r["head_top_pct"]:.1f}% (aceito {lo:.0f}% a {hi:.0f}%)')

    row = int(h * 0.80)
    cols = np.where(subject[row])[0]
    if len(cols):
        r['margin_l'], r['margin_r'] = 100 * cols[0] / w, 100 * (w - 1 - cols[-1]) / w
        if min(r['margin_l'], r['margin_r']) < TOL['side_margin_min']:
            r['fail'].append(f'margem lateral {min(r["margin_l"], r["margin_r"]):.1f}% (mínimo {TOL["side_margin_min"]:.0f}%)')
    else:
        r['fail'].append('sem corpo na altura de 80%')

    mag = (a[..., 0] > 140) & (a[..., 2] > 100) & (a[..., 1] < 90) & (a[..., 0] - a[..., 1] > 90)
    r['shirt_px_pct'] = 100 * mag.mean()
    if mag.sum() > 200:
        r['shirt_rgb'] = a[mag].mean(0)
        if dist(r['shirt_rgb'], SHIRT) > TOL['shirt']:
            r['warn'].append(f'camisa {tuple(int(x) for x in r["shirt_rgb"])} longe de #CC00AA')
    else:
        r['fail'].append('camisa magenta não encontrada')

    # verde dentro do corpo: pixels verdes cercados por sujeito (olhos verdes, reflexo no cabelo) — heurística em faixa do rosto
    ys, xs = np.where(subject)
    if len(ys):
        y0, y1, x0, x1 = int(ys.min()), int(h * 0.45), int(xs.min()), int(xs.max())
        face = a[y0:y1, x0:x1]
        g = (face[..., 1] > face[..., 0] + 25) & (face[..., 1] > face[..., 2] + 25) & (face[..., 1] > 60)
        inside = g & subject[y0:y1, x0:x1]
        # remove a borda externa do sujeito: só conta verde com sujeito acima e abaixo (buraco no rosto)
        up = np.roll(subject[y0:y1, x0:x1], 3, 0)
        dn = np.roll(subject[y0:y1, x0:x1], -3, 0)
        lf = np.roll(subject[y0:y1, x0:x1], 3, 1)
        rt = np.roll(subject[y0:y1, x0:x1], -3, 1)
        bgmask_face = bgmask[y0:y1, x0:x1]
        hole = bgmask_face & up & dn & lf & rt
        r['green_in_face_px'] = int(hole.sum())
        if r['green_in_face_px'] > max(6, w * h * 0.00002):
            r['warn'].append(f'{r["green_in_face_px"]} px da cor do fundo dentro do rosto (olho verde?)')
    return r


def find_image(folder):
    """Primeira imagem da pasta: aceita Image.jpeg, imagem.jpeg, "Image 2.jpeg" (cópia do Mac), .jpg e .png; se houver
    mais de uma, usa a mais recente."""
    found = []
    for ext in ('jpeg', 'jpg', 'png'):
        for pat in (f'[Ii]mage*.{ext}', f'[Ii]magem*.{ext}'):
            found.extend(glob.glob(os.path.join(folder, pat)))
    return max(found, key=os.path.getmtime) if found else None


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), 'visuais')
    bad = 0
    print(f'{"visual":10} {"tamanho":>10} {"cantos(Δ)":>10} {"desigual":>8} {"topo%":>6} {"marg L/R%":>10}  resultado')
    for d in sorted(glob.glob(os.path.join(root, 'visual-*'))):
        name = os.path.basename(d)
        p = find_image(d)
        if not p:
            print(f'{name:10} sem imagem'); bad += 1; continue
        r = analyse(p)
        ml = f'{r.get("margin_l", float("nan")):.0f}/{r.get("margin_r", float("nan")):.0f}'
        status = 'OK' if not r['fail'] else 'REPROVADA'
        bad += bool(r['fail'])
        print(f'{name:10} {r["w"]}x{r["h"]:<5} {max(r["corner_dist"]):>10.0f} {r["corner_spread"]:>8.0f} {r["head_top_pct"]:>6.1f} {ml:>10}  {status}')
        for m in r['fail']:
            print(f'    ✗ {m}')
        for m in r['warn']:
            print(f'    ! {m}')
    print('\nconferência humana ainda necessária: olhos castanhos, barba e cabelo da ficha, sem contorno escuro, nenhuma semelhança com pessoa real.')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
