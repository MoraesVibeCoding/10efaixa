"""Recorta o fundo verde dos emblemas enviados pelo usuário (2026-10-09) e gera as peças do jogo.

Uso: python3 docs/arte/emblemas/recortar.py
Lê docs/arte/emblemas/<clube>/*.jpeg (a primeira imagem da pasta; pasta sem imagem fica de fora) e grava
src/assets/emblemas/<clube>.webp: fundo transparente, recorte justo, quadrado de 256 px.

O fundo é removido por preenchimento a partir das bordas (só o verde ligado à borda sai; o verde de dentro do
emblema, como no globo e no círculo da Chapecoense, fica). Na borda do recorte, o verde que vazou vira
transparência parcial e perde o tom verde.
"""
import glob
import os
from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, '..', '..', '..', 'src', 'assets', 'emblemas')
SIZE = 256
TOLERANCIA = 70  # diferença máxima de cor para o preenchimento do fundo
MARCA = (255, 0, 255)
# clubes com fundo preso em áreas fechadas (dentro da âncora, dos remos e das cordas do Corinthians): ali o verde do
# fundo sai em toda a imagem. Nunca no Coritiba, onde o verde de dentro do globo faz parte do desenho.
CHAVE_GLOBAL = {'corinthians': 45}


def recortar(path: str, chave_global: int | None = None) -> Image.Image:
    rgb = Image.open(path).convert('RGB')
    w, h = rgb.size
    bg = rgb.getpixel((2, 2))
    marcado = rgb.copy()
    for xy in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        if max(abs(a - b) for a, b in zip(marcado.getpixel(xy), bg)) <= TOLERANCIA:
            ImageDraw.floodfill(marcado, xy, MARCA, thresh=TOLERANCIA)
    fundo = Image.eval(ImageChops.difference(marcado, Image.new('RGB', (w, h), MARCA)).convert('L'), lambda v: 255 if v == 0 else 0)
    if chave_global is not None:
        perto = Image.eval(ImageChops.difference(rgb, Image.new('RGB', (w, h), bg)).convert('L'), lambda v: 255 if v <= chave_global else 0)
        fundo = ImageChops.lighter(fundo, perto)
    borda = fundo.filter(ImageFilter.MaxFilter(5))
    dom = max(1, bg[1] - max(bg[0], bg[2]))
    out = Image.new('RGBA', (w, h))
    px, fp, bp, op = rgb.load(), fundo.load(), borda.load(), out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if fp[x, y]:
                op[x, y] = (0, 0, 0, 0)
            elif bp[x, y]:
                verde = max(0, g - max(r, b))
                a = 255 - min(255, round(255 * verde / dom))
                op[x, y] = (r, min(g, max(r, b)), b, a)
            else:
                op[x, y] = (r, g, b, 255)
    caixa = out.getchannel('A').getbbox()
    out = out.crop(caixa)
    lado = max(out.size)
    quadro = Image.new('RGBA', (lado, lado), (0, 0, 0, 0))
    quadro.paste(out, ((lado - out.width) // 2, (lado - out.height) // 2))
    # redimensiona com alfa pré-multiplicado (sem halo escuro na borda)
    return quadro.convert('RGBa').resize((SIZE, SIZE), Image.LANCZOS).convert('RGBA')


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    for pasta in sorted(glob.glob(os.path.join(ROOT, '*', ''))):
        clube = os.path.basename(os.path.dirname(pasta))
        imgs = sorted(glob.glob(os.path.join(pasta, '*.jp*g')) + glob.glob(os.path.join(pasta, '*.png')))
        if not imgs:
            continue
        destino = os.path.join(OUT, f'{clube}.webp')
        recortar(imgs[0], CHAVE_GLOBAL.get(clube)).save(destino, 'WEBP', quality=90, method=6)
        print(clube, os.path.getsize(destino), 'bytes')


if __name__ == '__main__':
    main()
