"""Posição do número nas costas das cenas pintadas (v2.62), a partir da máscara da camisa já processada.

O cálculo antigo (processar_cenas.py, T60a) centrava o número na caixa da máscara inteira: com o jogador de três-quartos,
mangas e braços puxavam o centro para o ombro. Aqui: (1) abre a máscara (erosão + dilatação) para tirar mangas e
braços finos; (2) fica com o maior pedaço perto do centro (o tronco); (3) procura, perto de 38% da altura do tronco,
o retângulo do número que cabe inteiro na camisa (o cabelo comprido cobre a máscara e fica de fora sozinho);
(4) centro e tamanho vêm da parte de baixo das costas, onde braço
erguido e cotovelo não encostam no tronco.

Uso: python3 docs/arte/numero_cenas.py  (reescreve só os "numero" de src/data/cenasArte.json; corte sem uniforme fica null;
corte em que o número não cabe fica null com "numeroEscondido": true, para o próximo cálculo voltar a tentar)
Ajuste manual, se precisar: src/data/cenasArte.json, campo "numeroManual" no corte, que vence o cálculo.
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parents[2]
CENAS = RAIZ / 'src/assets/cenas'
DADOS = RAIZ / 'src/data/cenasArte.json'

ABERTURA = 0.10   # fração da largura da camisa: braço e manga mais finos que isso saem
ALTO_ALVO = 0.38  # o centro do número, de preferência a 38% da altura do tronco (como numa camisa de verdade)
ALTO_MIN = 0.26   # e nunca acima de 26% (gola) nem abaixo de 60%
ALTO_MAX = 0.60
COBERTURA = 0.92  # fração do retângulo do número que tem de estar dentro do tronco
ALTURA_POR_LARGURA = 0.55  # altura do número em relação à largura da parte de baixo das costas
ALTURA_MIN = 0.26  # altura mínima do número em relação à altura do tronco
PROPORCAO = 0.95  # largura de "10" em relação à altura, na fonte de título


def componentes(m):
    """Rótulos 4-conexos sem scipy (busca em largura); devolve a máscara do maior pedaço perto do centro."""
    h, w = m.shape
    rot = np.zeros((h, w), np.int32)
    tam = {}
    atual = 0
    for y0, x0 in zip(*np.nonzero(m)):
        if rot[y0, x0]:
            continue
        atual += 1
        pilha = [(y0, x0)]
        rot[y0, x0] = atual
        n = 0
        while pilha:
            y, x = pilha.pop()
            n += 1
            for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= yy < h and 0 <= xx < w and m[yy, xx] and not rot[yy, xx]:
                    rot[yy, xx] = atual
                    pilha.append((yy, xx))
        tam[atual] = n
    if not tam:
        return None
    # o protagonista está no meio da tela: pesa o tamanho pela distância ao centro
    def nota(k):
        ys, xs = np.nonzero(rot == k)
        return tam[k] / (1 + abs(xs.mean() / w - 0.5) * 4)
    return rot == max(tam, key=nota)


def numero(mask_path):
    a = np.asarray(Image.open(mask_path).getchannel('A'), dtype=np.uint8)
    h, w = a.shape
    m = a > 150
    ys, xs = np.nonzero(m[:, int(w * 0.25):int(w * 0.75)])
    if len(xs) < 50:
        return None
    larg = np.percentile(xs, 98) - np.percentile(xs, 2)
    k = max(3, int(larg * ABERTURA) | 1)
    aberta = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(k)).filter(ImageFilter.MaxFilter(k))
    tronco = componentes(np.asarray(aberta) > 127)
    if tronco is None:
        return None
    ty, tx = np.nonzero(tronco)
    top, bot = ty.min(), ty.max()
    alto = bot - top
    # centro e largura pela parte de baixo das costas (40–70% do tronco): ali braço erguido ou cotovelo não encostam
    mids, largs = [], []
    for y in range(int(top + alto * 0.40), int(top + alto * 0.70)):
        linha = np.nonzero(tronco[y])[0]
        if len(linha) >= 10:
            mids.append((linha.min() + linha.max()) / 2)
            largs.append(linha.max() - linha.min())
    if not mids:
        return None
    cx = float(np.median(mids))
    # cadeira ou mão na frente estreitam a parte de baixo: o número nunca fica menor que uma fração do tronco
    nh = max(float(np.median(largs)) * ALTURA_POR_LARGURA, alto * ALTURA_MIN)
    nw = nh * PROPORCAO
    x0, x1 = int(cx - nw / 2), int(cx + nw / 2)
    # a altura: o lugar mais perto do alvo em que o número cabe inteiro na camisa (cabelo e braço ficam de fora)
    alvo = top + alto * ALTO_ALVO
    linhas = sorted(range(int(top + alto * ALTO_MIN), int(top + alto * ALTO_MAX)), key=lambda y: abs(y - alvo))
    for cobertura in (COBERTURA, 0.8):
        for y in linhas:
            y0, y1 = int(y - nh / 2), int(y + nh / 2)
            if y0 < 0 or y1 >= h or x0 < 0 or x1 >= w:
                continue
            if m[y0:y1, x0:x1].mean() >= cobertura:
                return [round(cx / w, 4), round(y / h, 4), round(nh / 0.85 / h, 4)]
    return None


def main():
    dados = json.loads(DADOS.read_text(encoding='utf-8'))
    for cena, d in dados['cenas'].items():
        for corte, c in d['cortes'].items():
            # só onde o protagonista está de uniforme (numero calculado pelo processar_cenas.py ou escondido aqui antes)
            if c.get('numero') is None and not c.get('numeroEscondido'):
                continue
            novo = c.get('numeroManual') or numero(CENAS / cena / f'{corte}-camisa.webp')
            print(f'{cena}/{corte}: {c["numero"]} -> {novo}')
            c['numero'] = novo
            # sem lugar inteiro na camisa (cabelo ou cadeira na frente): sem número, como de verdade
            if novo is None:
                c['numeroEscondido'] = True
            else:
                c.pop('numeroEscondido', None)
    DADOS.write_text(json.dumps(dados, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
