#!/usr/bin/env python3
"""Piloto B (SPEC v2.100): monta a cena por camadas a partir de `montagem.json`.

Passos: tira o fundo verde de cada elemento, ajusta escala e posição à caixa-alvo (frações da tela), ancora na base da caixa, desenha uma
sombra de contato sob o elemento e empilha por ordem z sobre o cenário. O uniforme do clube entra depois (src/art/uniformes.ts no jogo).
As dimensões seguem docs/arte/contrato-de-dimensoes.md.

Autoteste:  python3 docs/arte/test_compor_camadas.py
"""
import json

import numpy as np
from PIL import Image, ImageFilter

TRABALHO = (2304, 1856)     # altura, largura (contrato de dimensões)
ENTREGA = (1341, 1080)
TOLERANCIA = 0.005          # diferença relativa de razão aceita


def confere_dimensoes(shape, referencia=TRABALHO, tolerancia=TOLERANCIA):
    """Lista de problemas (vazia = ok). Aceita o tamanho de trabalho, a metade dele e o de entrega, pela razão largura/altura."""
    h, w = shape[:2]
    razao = w / h
    ok = [referencia[1] / referencia[0], TRABALHO[1] / TRABALHO[0], ENTREGA[1] / ENTREGA[0]]
    if not any(abs(razao - r) / r <= tolerancia for r in ok):
        return [f'razão {razao:.4f} fora do contrato (0,8056 ± {tolerancia * 100:.1f}%)']
    return []


def chave_verde(img, dist_ini=28, dist_fim=68):
    """img uint8 HxWx3 sobre fundo chapado. Devolve (rgb float 0..1, alfa float 0..1). A cor do fundo vem dos cantos (aceita o verde que a IA devolveu)."""
    a = img.astype(np.float32)
    n = max(2, min(12, min(a.shape[:2]) // 10))
    cantos = np.concatenate([a[:n, :n].reshape(-1, 3), a[:n, -n:].reshape(-1, 3), a[-n:, :n].reshape(-1, 3), a[-n:, -n:].reshape(-1, 3)])
    fundo = np.median(cantos, 0)
    dist = np.sqrt(((a - fundo) ** 2).sum(2))
    alfa = np.clip((dist - dist_ini) / (dist_fim - dist_ini), 0, 1)
    rgb = a.copy()
    verde, lim = rgb[..., 1], np.maximum(rgb[..., 0], rgb[..., 2])
    borda = (alfa > 0) & (alfa < 1)
    rgb[..., 1] = np.where(borda & (verde > lim), lim, verde)   # tira o verde que sobra na borda
    return rgb / 255.0, alfa.astype(np.float32)


def ajusta_a_caixa(rgb, alfa, alvo, tela):
    """Recorta o elemento pelo alfa, escala sem deformar para caber na caixa `alvo` ([x0, y0, x1, y1] em frações de `tela` = (altura, largura)),
    centra na horizontal e ancora na base da caixa. Devolve (rgb, alfa) do tamanho da tela."""
    H, W = tela
    ys, xs = np.where(alfa > 0.5)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    caixa_w, caixa_h = (alvo[2] - alvo[0]) * W, (alvo[3] - alvo[1]) * H
    esc = min(caixa_w / (x1 - x0), caixa_h / (y1 - y0))
    nw, nh = max(1, int(round((x1 - x0) * esc))), max(1, int(round((y1 - y0) * esc)))
    corte_rgb = Image.fromarray((np.clip(rgb[y0:y1, x0:x1], 0, 1) * 255).astype(np.uint8)).resize((nw, nh), Image.LANCZOS)
    corte_al = Image.fromarray((np.clip(alfa[y0:y1, x0:x1], 0, 1) * 255).astype(np.uint8)).resize((nw, nh), Image.LANCZOS)
    px = int(round((alvo[0] + alvo[2]) / 2 * W - nw / 2))
    py = int(round(alvo[3] * H - nh))
    out_rgb = np.zeros((H, W, 3), np.float32)
    out_al = np.zeros((H, W), np.float32)
    sx0, sy0 = max(0, -px), max(0, -py)
    dx0, dy0 = max(0, px), max(0, py)
    cw, ch = min(nw - sx0, W - dx0), min(nh - sy0, H - dy0)
    if cw > 0 and ch > 0:
        out_rgb[dy0:dy0 + ch, dx0:dx0 + cw] = np.asarray(corte_rgb, np.float32)[sy0:sy0 + ch, sx0:sx0 + cw] / 255
        out_al[dy0:dy0 + ch, dx0:dx0 + cw] = np.asarray(corte_al, np.float32)[sy0:sy0 + ch, sx0:sx0 + cw] / 255
    return out_rgb, out_al


def sombra_de_contato(alfa, forca=0.45, deriva=0.35):
    """Alfa de uma sombra macia sob a base do elemento (elipse com uma cunha para a direita: a luz vem da esquerda)."""
    H, W = alfa.shape
    ys, xs = np.where(alfa > 0.5)
    if not len(ys):
        return np.zeros_like(alfa)
    base, x0, x1 = ys.max(), xs.min(), xs.max() + 1
    larg = x1 - x0
    sh = Image.new('L', (W, H), 0)
    from PIL import ImageDraw
    d = ImageDraw.Draw(sh)
    d.ellipse([x0 - larg * 0.05, base - max(3, larg * 0.05), x1 + larg * 0.2, base + max(6, larg * 0.14)], fill=255)
    d.polygon([(x0 + larg * 0.25, base - 2), (x0 + larg * 0.75, base - 2), (x1 + larg * deriva, base + larg * 0.1), (x0 + larg * 0.9, base + larg * 0.16)], fill=170)
    sh = sh.filter(ImageFilter.GaussianBlur(max(2, larg * 0.04)))
    sombra = np.asarray(sh, np.float32) / 255 * forca
    return np.minimum(sombra, forca).astype(np.float32)


def empilha(cena, camadas, sombra_cor=(8 / 255, 14 / 255, 26 / 255)):
    """cena: float HxWx3. camadas: lista de (rgb, alfa) em ordem z crescente; cada uma pode vir com sombra por `sombra_de_contato`."""
    out = cena.astype(np.float32).copy()
    for rgb, alfa in camadas:
        a = np.clip(alfa, 0, 1)[..., None]
        out = out * (1 - a) + rgb * a
    return np.clip(out, 0, 1)


def le_montagem(caminho):
    with open(caminho, encoding='utf-8') as f:
        m = json.load(f)
    return sorted(m['camadas'], key=lambda c: c['z'])
