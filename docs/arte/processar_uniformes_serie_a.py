#!/usr/bin/env python3
"""Texturas dos uniformes da Série A (SPEC v2.98) a partir das imagens planas enviadas pelo usuário.

Entrada:  docs/arte/uniformes-serie-a/<clube>/{frente,costas,calcao}.jpeg  (peça sobre fundo chapado)
Saída:    src/assets/uniformes/<clube>/camisa.webp   (camisa de costas, recortada no contorno)
          src/assets/uniformes/<clube>/calcao.webp   (calção, recortado no contorno)
          src/data/uniformes.json                    (cor principal do calção por clube, fonte e data)

Cada textura é recortada no contorno da peça e, onde não há tecido (pescoço, quinas), repete o pixel de tecido mais próximo, com uma
erosão de 7 px para não puxar a borda misturada com o fundo. Assim o jogo pode esticá-la no retângulo de cada parte da máscara da
cena sem aparecer fundo. A frente fica guardada para telas futuras; não é usada nas cenas (o jogador aparece de costas).

Uso:  python3 docs/arte/processar_uniformes_serie_a.py
Autoteste:  python3 docs/arte/test_processar_uniformes_serie_a.py
"""
import json
import os

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

HERE = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(HERE, '..', '..'))
ENTRADA = os.path.join(HERE, 'uniformes-serie-a')
SAIDA = os.path.join(RAIZ, 'src', 'assets', 'uniformes')
DADOS = os.path.join(RAIZ, 'src', 'data', 'uniformes.json')

CLUBES = ['athletico-pr', 'atletico-mg', 'bahia', 'botafogo', 'chapecoense', 'corinthians', 'coritiba', 'cruzeiro', 'flamengo', 'fluminense',
          'gremio', 'internacional', 'mirassol', 'palmeiras', 'bragantino', 'remo', 'santos', 'sao-paulo', 'vasco', 'vitoria']
LARGURA_CAMISA = 512
LARGURA_CALCAO = 384
DIST_FUNDO = 70         # distância (0 a 255) da cor do fundo a partir da qual o pixel já é tecido
EROSAO = 7              # px de borda descartados antes de preencher (a borda é mistura com o fundo)


def recorta_uniforme(img):
    """img: HxWx3 float 0..1 com a peça sobre fundo chapado. Devolve (textura recortada no contorno, máscara da peça)."""
    a = img.astype(np.float32) * 255
    n = max(4, min(12, min(a.shape[:2]) // 10))
    cantos = np.concatenate([a[:n, :n].reshape(-1, 3), a[:n, -n:].reshape(-1, 3), a[-n:, :n].reshape(-1, 3), a[-n:, -n:].reshape(-1, 3)])
    fundo = np.median(cantos, 0)
    dist = np.sqrt(((a - fundo) ** 2).sum(2))
    m = ndi.binary_opening(dist > DIST_FUNDO, iterations=2)
    lab, k = ndi.label(m)
    if k == 0:
        raise ValueError('sem uniforme na imagem')
    area = ndi.sum(m, lab, range(1, k + 1))
    m = ndi.binary_fill_holes(lab == (1 + int(np.argmax(area))))
    ys, xs = np.where(m)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    tex, mm = img[y0:y1, x0:x1].astype(np.float32), m[y0:y1, x0:x1]
    nucleo = ndi.binary_erosion(mm, iterations=min(EROSAO, max(1, min(mm.shape) // 20)))
    idx = ndi.distance_transform_edt(~nucleo, return_distances=False, return_indices=True)
    return tex[idx[0], idx[1]], mm


def redimensiona(tex, largura):
    h = max(1, round(tex.shape[0] * largura / tex.shape[1]))
    im = Image.fromarray((np.clip(tex, 0, 1) * 255).round().astype(np.uint8)).resize((largura, h), Image.LANCZOS)
    return np.asarray(im, dtype=np.float32) / 255


def cor_principal(tex):
    """Cor mais comum da textura (quantizada em passos de 8), em #RRGGBB."""
    q = (np.clip(tex, 0, 1).reshape(-1, 3) * 255).round().astype(int)
    chave = (q // 8)
    valores, contagens = np.unique(chave, axis=0, return_counts=True)
    base = valores[int(np.argmax(contagens))]
    sel = (chave == base).all(axis=1)
    r, g, b = q[sel].mean(0).round().astype(int)
    return f'#{r:02X}{g:02X}{b:02X}'


def carrega(caminho):
    return np.asarray(Image.open(caminho).convert('RGB'), dtype=np.float32) / 255


def salva(tex, caminho):
    Image.fromarray((np.clip(tex, 0, 1) * 255).round().astype(np.uint8)).save(caminho, quality=88, method=6)


def main():
    dados = {}
    for clube in CLUBES:
        os.makedirs(os.path.join(SAIDA, clube), exist_ok=True)
        camisa, _ = recorta_uniforme(carrega(os.path.join(ENTRADA, clube, 'costas.jpeg')))
        calcao, _ = recorta_uniforme(carrega(os.path.join(ENTRADA, clube, 'calcao.jpeg')))
        camisa, calcao = redimensiona(camisa, LARGURA_CAMISA), redimensiona(calcao, LARGURA_CALCAO)
        salva(camisa, os.path.join(SAIDA, clube, 'camisa.webp'))
        salva(calcao, os.path.join(SAIDA, clube, 'calcao.webp'))
        dados[clube] = {'calcaoPrincipal': cor_principal(calcao)}
        print('ok', clube, dados[clube]['calcaoPrincipal'])
    out = {
        '_nota': 'Texturas dos uniformes da Série A (SPEC v2.98): camisa de costas e calção, recortados das imagens planas que o usuário gerou (docs/arte/uniformes-serie-a). Reproduzem o desenho das camisas dos clubes, sem escudo, patrocínio ou texto; decisão do usuário em 2026-10-14, risco assumido por ele; nenhum vai ao lançamento público sem revisão jurídica.',
        'fonte': 'imagens geradas pelo usuário em 2026-10-14 (Série A.zip)',
        'conferidoEm': '2026-10-14',
        'clubes': dados,
    }
    with open(DADOS, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
        f.write('\n')


if __name__ == '__main__':
    main()
