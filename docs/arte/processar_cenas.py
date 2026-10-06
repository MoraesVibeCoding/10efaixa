#!/usr/bin/env python3
"""Pós-processamento das cenas pintadas (docs/arte/cenas/<NN-cena>/<corte>/imagem.jpeg) para o jogo (T60a).

Para cada imagem: (1) reduz para --largura px (WebP); (2) troca a camisa magenta e o calção ciano por cinza com a
mesma luz e sombra e grava a máscara de cada um (o jogo pinta com o padrão e as cores do clube, como na figurinha);
(3) mede a camisa do protagonista (faixa central) para o número nas costas, que só aparece quando ele está de
uniforme (calção ciano logo abaixo da camisa).

Saída: src/assets/cenas/<cena>/<corte>.webp, <corte>-camisa.webp e <corte>-calcao.webp (máscaras no alfa) e
src/data/cenasArte.json (medidas em frações da imagem).

Uso:
  uv run --with pillow --with numpy python docs/arte/processar_cenas.py [--largura 1080] [--qualidade 80]

Só mede e mexe em pixels: não altera o personagem. Camisas penduradas, torcida e companheiros de magenta também viram
o uniforme do clube (é o mesmo time).
"""
import argparse
import glob
import json
import os
import sys

import numpy as np
from PIL import Image

RAIZ = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
ORIGEM = os.path.join(RAIZ, 'docs', 'arte', 'cenas')
DESTINO = os.path.join(RAIZ, 'src', 'assets', 'cenas')
DADOS = os.path.join(RAIZ, 'src', 'data', 'cenasArte.json')

MAG_LO, MAG_HI = 10.0, 40.0    # magenta: min(r, b) - g (o mesmo critério dos visuais)
CIA_LO, CIA_HI = 20.0, 50.0    # ciano: min(g, b) - r
REF = 95                        # percentil do brilho do tecido que vira branco no cinza
MASCARA = 0.5                   # as máscaras saem na metade da largura da cena (são suaves; o navegador amplia)
SEM_NUMERO = {'vestiario'}      # o protagonista está sem camisa; a camisa central é a pendurada no armário


def mask_mag(img):
    return np.clip((np.minimum(img[..., 0], img[..., 2]) - img[..., 1] - MAG_LO) / (MAG_HI - MAG_LO), 0.0, 1.0)


def mask_cia(img):
    return np.clip((np.minimum(img[..., 1], img[..., 2]) - img[..., 0] - CIA_LO) / (CIA_HI - CIA_LO), 0.0, 1.0)


def neutralize(img, t):
    """Troca a cor da máscara por cinza com a mesma luz: o tecido mais claro vira branco (o jogo multiplica pela cor)."""
    lum = img[..., 0] * 0.299 + img[..., 1] * 0.587 + img[..., 2] * 0.114
    core = t > 0.9
    ref = max(float(np.percentile(lum[core], REF)), 1.0) if core.any() else 255.0
    gray = np.clip(lum / ref, 0.0, 1.0) * 255
    out = img * (1 - t[..., None]) + gray[..., None] * t[..., None]
    return np.where(t[..., None] > 0, np.round(out), img)


def numero(mag, cia, cena):
    """Centro e altura do número nas costas (frações da imagem), ou None se o protagonista não está de uniforme."""
    if cena in SEM_NUMERO:
        return None
    h, w = mag.shape
    yy, xx = np.mgrid[0:h, 0:w]
    sel = (mag > 0.6) & (xx > w * 0.3) & (xx < w * 0.7)
    if sel.sum() < w * h * 0.005:
        return None
    ys, xs = np.where(sel)
    x0, x1 = np.percentile(xs, [2, 98])
    y0, y1 = np.percentile(ys, [2, 98])
    sw, sh = x1 - x0, y1 - y0
    # uniforme: calção ciano logo abaixo da camisa, na mesma coluna
    faixa = (xx > x0) & (xx < x1) & (yy > y1) & (yy < y1 + sh * 0.6)
    if (cia[faixa] > 0.6).mean() < 0.08:
        return None
    return [round(float((x0 + x1) / 2 / w), 4), round(float((y0 + sh * 0.46) / h), 4), round(float(sh * 0.40 / h), 4)]


def alfa(mask, size):
    m = Image.fromarray(np.round(mask * 255).astype(np.uint8), 'L').resize(size, Image.LANCZOS)
    out = Image.new('RGBA', size, (255, 255, 255, 0))
    out.putalpha(m)
    return out


def processar(src, largura):
    im = Image.open(src).convert('RGB')
    alto = round(im.height * largura / im.width)
    img = np.asarray(im.resize((largura, alto), Image.LANCZOS)).astype(float)
    mag, cia = mask_mag(img), mask_cia(img)
    cena = neutralize(neutralize(img, mag), cia)
    return Image.fromarray(cena.astype(np.uint8)), mag, cia


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--largura', type=int, default=1080)
    ap.add_argument('--qualidade', type=int, default=80)
    args = ap.parse_args()
    dados = {'_nota': 'Gerado por docs/arte/processar_cenas.py (T60a). numero = [centro x, centro y, altura] em frações da imagem, só quando o protagonista está de uniforme; calcao = há máscara do calção.', 'cenas': {}}
    total = 0
    for pasta in sorted(glob.glob(os.path.join(ORIGEM, '[0-9][0-9]-*'))):
        cena = os.path.basename(pasta)[3:]
        for img in sorted(glob.glob(os.path.join(pasta, '*', 'imagem.jpeg'))):
            corte = os.path.basename(os.path.dirname(img))
            out, mag, cia = processar(img, args.largura)
            os.makedirs(os.path.join(DESTINO, cena), exist_ok=True)
            base = os.path.join(DESTINO, cena, corte)
            out.save(base + '.webp', 'WEBP', quality=args.qualidade, method=6)
            mw, mh = round(out.width * MASCARA), round(out.height * MASCARA)
            alfa(mag, (mw, mh)).save(base + '-camisa.webp', 'WEBP', quality=args.qualidade, method=6)
            tem_calcao = bool((cia > 0.6).mean() > 0.002)
            if tem_calcao:
                alfa(cia, (mw, mh)).save(base + '-calcao.webp', 'WEBP', quality=args.qualidade, method=6)
            dados['cenas'].setdefault(cena, {'largura': out.width, 'altura': out.height, 'cortes': {}})
            dados['cenas'][cena]['cortes'][corte] = {'numero': numero(mag, cia, cena), 'calcao': tem_calcao}
            total += 1
            print(f'{cena}/{corte}', file=sys.stderr)
    with open(DADOS, 'w', encoding='utf-8') as f:
        json.dump(dados, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(f'{total} cenas processadas em {DESTINO}')


if __name__ == '__main__':
    main()
