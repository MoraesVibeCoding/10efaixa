#!/usr/bin/env python3
"""Pós-processamento dos 10 retratos de visuais (docs/arte/visuais/visual-NN/Image*.jpeg).

Para cada imagem: (1) acha o fundo verde chapado e o torna transparente, sem franja verde nas bordas;
(2) reenquadra em 4:5 estendendo a tela (nunca corta o corpo): cabeça a 10% do topo e margem lateral de pelo menos 8%;
(3) troca a camisa magenta por cinza com a mesma luz e sombra e grava a máscara dela (o jogo pinta com a cor do clube);
(4) grava WebP com transparência em src/assets/visuais/visual-NN.webp e a máscara em visual-NN-camisa.webp.

Uso:
  uv run --with pillow --with numpy python docs/arte/processar_visuais.py [--saida pasta] [--largura 928] [--qualidade 90]
Autoteste:
  uv run --with pillow --with numpy python docs/arte/test_processar_visuais.py

Só mede e mexe em pixels: não reconhece rostos nem altera o personagem. A resolução não aumenta (a menos que --largura
peça uma ampliação por Lanczos, que só serve de provisório: o ideal é gerar de novo em 1856x2304).
"""
import argparse
import glob
import os
import sys

import numpy as np
from PIL import Image

RATIO = 0.8                 # 4:5
HEAD_TOP = 0.10             # topo da cabeça a 10% da altura
SIDE_MIN = 0.08             # margem lateral mínima (fração da largura), medida a 80% da altura
KEY_LO, KEY_HI = 0.30, 0.80  # faixa do "quanto é fundo" em que a transparência é parcial
SHIRT_LO, SHIRT_HI = 10.0, 40.0  # "quanto é magenta" (min(r, b) - g) em que a máscara da camisa é parcial; pele e cabelo ficam abaixo de 0
SHIRT_REF = 95               # percentil do brilho da camisa que vira branco no cinza (o tecido mais claro)


def _corner_color(img):
    h, w, _ = img.shape
    n = max(6, w // 60)
    patches = [img[:n, :n], img[:n, -n:], img[-n:, :n], img[-n:, -n:]]
    return np.mean([p.reshape(-1, 3).mean(0) for p in patches], axis=0)


def _greenness(img):
    """Quanto o pixel é 'verde de chroma': g acima do maior entre r e b."""
    return img[..., 1] - np.maximum(img[..., 0], img[..., 2])


def matte(img):
    """Opacidade 0..1 (0 = fundo). `img` é HxWx3 em float 0..255. O fundo é o verde dos cantos, de qualquer tom."""
    ref = _corner_color(img)
    ref_k = max(float(ref[1] - max(ref[0], ref[2])), 1.0)
    ratio = _greenness(img) / ref_k                     # 1 no fundo, <=0 em pele, cabelo e camisa
    t = np.clip((ratio - KEY_LO) / (KEY_HI - KEY_LO), 0.0, 1.0)
    t = t * t * (3 - 2 * t)                              # suaviza a borda
    return 1.0 - t


def despill(img, alpha):
    """Tira o verde que vaza do fundo nas bordas semitransparentes (g não passa do maior entre r e b)."""
    out = img.copy()
    edge = (alpha > 0.0) & (alpha < 0.98)
    cap = np.maximum(img[..., 0], img[..., 2])
    out[..., 1] = np.where(edge, np.minimum(img[..., 1], cap), img[..., 1])
    return out


def shirt_mask(img, alpha):
    """Quanto cada pixel é camisa (0..1): o magenta chapado do prompt (#CC00AA e suas sombras), só onde há pessoa."""
    mag = np.minimum(img[..., 0], img[..., 2]) - img[..., 1]
    return np.clip((mag - SHIRT_LO) / (SHIRT_HI - SHIRT_LO), 0.0, 1.0) * alpha


def neutralize(img, t):
    """Troca o magenta da camisa por cinza com a mesma luz e sombra: o tecido mais claro vira branco, para o jogo
    multiplicar pela cor do clube. Fora da máscara nada muda."""
    lum = img[..., 0] * 0.299 + img[..., 1] * 0.587 + img[..., 2] * 0.114
    core = t > 0.9
    ref = max(float(np.percentile(lum[core], SHIRT_REF)), 1.0) if core.any() else 255.0
    gray = np.round(np.clip(lum / ref, 0.0, 1.0) * 255)
    out = img * (1 - t[..., None]) + gray[..., None] * t[..., None]
    return np.where(t[..., None] > 0, np.round(out), img)


def _bbox_rows(alpha):
    rows = np.where((alpha > 0.5).sum(1) > max(2, alpha.shape[1] * 0.01))[0]
    return int(rows[0]), int(rows[-1])


def _side_margin_px(alpha):
    h, w = alpha.shape
    cols = np.where(alpha[int(h * 0.8)] > 0.5)[0]
    return int(min(cols[0], w - 1 - cols[-1])) if len(cols) else 0


def _frame(alpha):
    """Tamanho final (4:5) e posição do retrato nele: cabeça a 10% do topo e margens laterais >= 8%."""
    h, w = alpha.shape
    y_top, _ = _bbox_rows(alpha)
    m = _side_margin_px(alpha)
    t_head = max(0.0, (HEAD_TOP * h - y_top) / (1 - HEAD_TOP))    # folga em cima para a cabeça ficar a 10%
    h2a = h + t_head
    w2a = RATIO * h2a
    p_min = max(0.0, (SIDE_MIN * w - m) / (1 - 2 * SIDE_MIN))     # folga lateral (cada lado) para a margem >= 8%
    p_min = p_min + 1 if p_min > 0 else 0.0                       # +1 px: o arredondamento não pode comer a margem
    w2 = max(w2a, w + 2 * p_min)
    h2 = int(np.ceil(w2 / RATIO))                                  # sempre para cima: nunca corta nem encolhe a margem
    w2 = int(np.ceil(h2 * RATIO))
    return (w2, h2), ((w2 - w) // 2, h2 - h)                       # todo o acréscimo vai no topo: o corte da cintura fica


def _place(rgb, alpha, size, pos):
    h, w = alpha.shape
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    rgba[..., 3] = np.clip(alpha * 255 + 0.5, 0, 255).astype(np.uint8)
    canvas = Image.new('RGBA', size, (0, 0, 0, 0))
    canvas.paste(Image.fromarray(rgba, 'RGBA'), pos)
    return canvas


def processar(im):
    """Imagem PIL (fundo verde) -> RGBA 4:5 com a cabeça a 10% do topo e margens laterais >= 8%."""
    rgb = np.asarray(im.convert('RGB')).astype(float)
    alpha = matte(rgb)
    return _place(despill(rgb, alpha), alpha, *_frame(alpha))


def processar_com_camisa(im):
    """Como `processar`, com a camisa magenta trocada por cinza; devolve também a máscara da camisa (alfa), no mesmo quadro."""
    rgb = np.asarray(im.convert('RGB')).astype(float)
    alpha = matte(rgb)
    t = shirt_mask(rgb, alpha)
    size, pos = _frame(alpha)
    retrato = _place(neutralize(despill(rgb, alpha), t), alpha, size, pos)
    mascara = _place(np.full_like(rgb, 255.0), t, size, pos)
    return retrato, mascara


def medir(rgba):
    a = np.asarray(rgba)[..., 3].astype(float) / 255
    h, w = a.shape
    y_top, _ = _bbox_rows(a)
    m = _side_margin_px(a)
    cols = np.where(a[int(h * 0.8)] > 0.5)[0]
    return {'w': w, 'h': h, 'topo': 100 * y_top / h, 'margem_l': 100 * cols[0] / w if len(cols) else 0.0,
            'margem_r': 100 * (w - 1 - cols[-1]) / w if len(cols) else 0.0, 'transparente': 100 * float((a < 0.02).mean())}


def find_image(folder):
    found = []
    for ext in ('jpeg', 'jpg', 'png'):
        for pat in (f'[Ii]mage*.{ext}', f'[Ii]magem*.{ext}'):
            found.extend(glob.glob(os.path.join(folder, pat)))
    return max(found, key=os.path.getmtime) if found else None


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--fontes', default=os.path.join(here, 'visuais'))
    ap.add_argument('--saida', default=os.path.join(here, '..', '..', 'src', 'assets', 'visuais'))
    ap.add_argument('--largura', type=int, default=0, help='amplia por Lanczos até esta largura (só provisório)')
    ap.add_argument('--qualidade', type=int, default=90)
    args = ap.parse_args()
    os.makedirs(args.saida, exist_ok=True)
    folders = sorted(glob.glob(os.path.join(args.fontes, 'visual-*')))
    if not folders:
        print('nenhuma pasta visual-NN em', args.fontes); return 1
    print(f'{"visual":10} {"origem":>10} {"saída":>10} {"topo%":>6} {"marg L/R%":>10}  nota')
    bad = 0
    for d in folders:
        name = os.path.basename(d)
        src = find_image(d)
        if not src:
            print(f'{name:10} sem imagem'); bad += 1; continue
        im = Image.open(src)
        out, mask = processar_com_camisa(im)
        if args.largura and out.size[0] != args.largura:
            size = (args.largura, int(round(args.largura / RATIO)))
            out, mask = out.resize(size, Image.LANCZOS), mask.resize(size, Image.LANCZOS)
        r = medir(out)
        notes = []
        if not (9.0 <= r['topo'] <= 15.0):
            notes.append('cabeça fora de 9–15%')
        if min(r['margem_l'], r['margem_r']) < 7.9:
            notes.append('margem lateral < 8%')
        if im.size[0] < 900:
            notes.append('origem em baixa resolução (provisório)')
        bad += bool([n for n in notes if 'provisório' not in n])
        out.save(os.path.join(args.saida, f'{name}.webp'), 'WEBP', quality=args.qualidade, alpha_quality=100, method=6)
        mask.save(os.path.join(args.saida, f'{name}-camisa.webp'), 'WEBP', quality=args.qualidade, alpha_quality=100, method=6)
        print(f'{name:10} {im.size[0]}x{im.size[1]:<5} {out.size[0]}x{out.size[1]:<5} {r["topo"]:>6.1f} {r["margem_l"]:>4.0f}/{r["margem_r"]:<4.0f}  {"; ".join(notes) or "OK"}')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
