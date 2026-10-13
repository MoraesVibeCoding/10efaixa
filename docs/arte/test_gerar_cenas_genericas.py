#!/usr/bin/env python3
"""Autoteste do gerar_cenas_genericas: a camisa vira magenta e o calção ciano, o resto da cena não muda, e a máscara do calção
que vaza sobre o céu (defeito das máscaras do jogo) não tinge a cena."""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from gerar_cenas_genericas import limpa_calcao, uniforme_generico  # noqa: E402


def cena():
    """Pintura 120 x 160: céu claro em cima, jogador cinza (camisa) e calção cinza-claro, chão verde."""
    p = np.zeros((160, 120, 3), np.float32)
    p[:] = (0.9, 0.95, 0.98)                      # céu
    p[100:160] = (0.3, 0.5, 0.2)                  # chão
    p[50:80, 40:80] = (0.6, 0.6, 0.6)             # camisa em cinza
    p[80:100, 45:75] = (0.55, 0.55, 0.55)         # calção em cinza
    return p


def mascaras(vaza_ate=0.0, cheio=False):
    cam = np.zeros((160, 120), np.float32)
    cam[50:80, 40:80] = 1
    cal = np.zeros((160, 120), np.float32)
    cal[80:100, 45:75] = 1
    if vaza_ate:
        cal[:30] = vaza_ate                        # alfa do vazamento sobre o céu, colado ao topo
    if cheio:
        cal[:40] = 1.0
    return cam, cal


def test_camisa_magenta_e_calcao_ciano():
    cam, cal = mascaras()
    o = uniforme_generico(cena(), cam, cal)
    r, g, b = (int(v) for v in o[65, 60])
    assert r > 150 and b > 150 and g < 40         # magenta
    r, g, b = (int(v) for v in o[90, 60])
    assert g > 150 and b > 150 and r < 40         # ciano


def test_resto_da_cena_nao_muda():
    cam, cal = mascaras()
    p = cena()
    o = uniforme_generico(p, cam, cal)
    fora = (cam == 0) & (cal == 0)
    assert np.array_equal(o[fora], (p[fora] * 255).round().astype(np.uint8))


def test_sombra_da_pintura_continua():
    """A luz e as dobras da pintura sobrevivem: onde a camisa é mais escura, o magenta também é."""
    cam, cal = mascaras()
    p = cena()
    p[55:60, 45:75] = (0.3, 0.3, 0.3)             # dobra escura
    o = uniforme_generico(p, cam, cal)
    assert o[57, 60, 0] < o[70, 60, 0]


def test_vazamento_do_calcao_no_ceu_nao_tinge_o_ceu():
    cam, cal = mascaras(vaza_ate=0.6)
    p = cena()
    o = uniforme_generico(p, cam, cal)
    assert np.array_equal(o[:30], (p[:30] * 255).round().astype(np.uint8))
    assert o[90, 60, 1] > 150                     # o calção de verdade continua ciano


def test_vazamento_total_colado_ao_topo_tambem_sai():
    cam, cal = mascaras(cheio=True)
    p = cena()
    o = uniforme_generico(p, cam, cal)
    assert np.array_equal(o[:40], (p[:40] * 255).round().astype(np.uint8))
    assert o[90, 60, 1] > 150


def test_limpa_calcao_mantem_so_o_que_nao_toca_o_topo():
    _, cal = mascaras(cheio=True)
    limpo = limpa_calcao(cal)
    assert limpo[:40].max() == 0 and limpo[90, 60] > 0.9


def test_vazamento_em_gradiente_que_nao_encosta_no_topo():
    """Caso real (treino/cacheado-medio): o alfa do vazamento sobe até ~0,6 a partir de uma altura abaixo do topo."""
    cam, cal = mascaras()
    cal[10:30] = 0.62
    cal[12, 50:55] = 0.9                           # uma ilha mais forte no meio do gradiente
    cal[12, 50:55] = 0.55
    p = cena()
    o = uniforme_generico(p, cam, cal)
    assert np.array_equal(o[:40], (p[:40] * 255).round().astype(np.uint8))
    assert o[90, 60, 1] > 150


def test_faixa_cheia_de_ponta_a_ponta_sai_mesmo_sem_encostar_no_topo():
    cam, cal = mascaras()
    cal[10:30] = 1.0                               # vazamento total, largura da imagem inteira, abaixo da faixa do topo
    p = cena()
    o = uniforme_generico(p, cam, cal)
    assert np.array_equal(o[:40], (p[:40] * 255).round().astype(np.uint8))
    assert o[90, 60, 1] > 150


def test_riscos_fortes_no_alto_da_imagem_nao_viram_calcao():
    """Caso real (treino, assinatura do contrato, estádio): pedaços pequenos de alfa 1 no céu, nas luzes e na janela, que não
    encostam no topo nem cobrem a largura."""
    cam, cal = mascaras()
    cal[8:14, 20:60] = 1.0                         # risco no céu, terminando antes de 20% da altura (32 de 160)
    cal[6:9, 80:100] = 1.0
    p = cena()
    o = uniforme_generico(p, cam, cal)
    assert np.array_equal(o[:32], (p[:32] * 255).round().astype(np.uint8))
    assert o[90, 60, 1] > 150


def test_calcao_pequeno_ao_fundo_continua():
    """Um companheiro longe, no meio da altura, tem calção pequeno e tem de ficar."""
    cam, cal = mascaras()
    cal[60:64, 10:16] = 1.0                        # base em 40% da altura
    o = uniforme_generico(cena(), cam, cal)
    assert o[62, 12, 1] > 150 and o[62, 12, 0] < 40


def test_mascara_em_outra_resolucao_e_reamostrada():
    cam, cal = mascaras()
    cam2 = cam[::2, ::2]                           # metade da resolução, como nos arquivos do jogo
    cal2 = cal[::2, ::2]
    o = uniforme_generico(cena(), cam2, cal2)
    assert o.shape == (160, 120, 3) and o[65, 60, 0] > 150


def test_cena_sem_calcao():
    cam, _ = mascaras()
    o = uniforme_generico(cena(), cam, None)
    assert o[65, 60, 0] > 150 and o[90, 60, 0] == int(round(0.55 * 255))


if __name__ == '__main__':
    for nome, fn in list(globals().items()):
        if nome.startswith('test_'):
            fn()
    print('ok')
