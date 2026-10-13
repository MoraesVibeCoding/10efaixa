#!/usr/bin/env python3
"""Gera os prompt.md dos Visuais 11 a 20 (SPEC v2.95; tabela em docs/proposta-mais-visuais.md, seção 3).

Cada prompt é o do Visual 04 (docs/arte/visuais/visual-04/prompt.md) com três trocas: o título e a numeração, o bloco
"CHARACTER (this image only)" e, nos visuais de cabelo claro, duas linhas do plano de cor. Estilo, linha, corpo, camisa, fundo,
luz e composição ficam idênticos aos dos 10 atuais para formarem um conjunto só e o pós-processamento tratar todos do mesmo
jeito. Os personagens são originais e ficcionais: nenhum prompt cita ou se baseia em pessoa real.

Uso:  python3 docs/arte/gerar_visuais_11_20.py [pasta de saída]   (padrão: docs/arte/visuais)
Autoteste:  python3 docs/arte/test_gerar_visuais_11_20.py
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, 'visuais', 'visual-04', 'prompt.md')

PELE = {
    't1': 'very light skin with a soft pink-peach undertone (about #F9DCC4)',
    't2': 'light skin with a warm peach undertone (about #F1C8A5)',
    't3': 'light olive-tan skin (about #E5B48A)',
    't4': 'medium tan skin with a warm undertone (about #D29C6E)',
    't5': 'medium brown skin (about #BC8458)',
    't6': 'brown skin with a warm undertone (about #A66E45)',
    't7': 'deep golden-brown skin (about #8D5A38)',
    't8': 'dark brown skin (about #734629)',
    't9': 'very dark brown skin (about #5A351F)',
    't10': 'deepest dark brown skin with a cool-neutral undertone (about #402415)',
}
BARBA = {
    None: 'clean-shaven: no beard, no moustache, no stubble.',
    'rala': 'light, even stubble beard on the cheeks and chin, about 3 mm long; no moustache styling.',
    'cavanhaque': 'a short goatee on the chin with a thin moustache joined to it; cheeks clean-shaven.',
    'cheia': 'a full beard, short and neatly trimmed (about 2 cm), covering cheeks, jaw and chin.',
    'bigode': 'a thin, neat moustache only; cheeks and chin clean-shaven.',
}
FAIXA = {
    None: 'No glasses, no earrings, no necklace, no headband, no cap, no hair accessories.',
    'white': 'He wears a plain white fabric headband across the forehead, with no logo, no text and no stripes. No glasses, no earrings, no necklace, no cap.',
    'black': 'He wears a plain black fabric headband across the forehead, with no logo, no text and no stripes. No glasses, no earrings, no necklace, no cap.',
}

# Cada ficha: o que o README mostra (`ficha`) e o que o prompt pede. `claro` = cabelo loiro, ruivo ou descolorido (muda o plano de cor).
FICHAS = {
    11: dict(idade=22, rosto='oval face with a softly rounded jaw', pele='t2', sobrancelha='straight, medium-thick, dark brown', nariz='narrow, straight nose; medium lips',
             cabelo='a medium-length mohawk: the sides and back are cropped very short, and a central strip about 6 cm tall runs from the forehead to the nape, styled upright, dyed a golden blond (about #D9B568). The cropped sides show the natural dark-brown scalp tone.',
             cor_hex='#D9B568', claro=True, barba=None, faixa='white',
             ficha='pele clara de fundo pêssego; rosto oval; moicano médio descolorido (loiro dourado); sem barba; faixa de cabelo branca'),
    12: dict(idade=24, rosto='long oval face with high cheekbones', pele='t9', sobrancelha='straight, thick, black', nariz='broad nose; full lips',
             cabelo='very short, tightly coiled hair, about 2.5 cm, evenly cut all around with a clean natural hairline, bleached to a platinum blond (about #EFE3A3). Ears visible.',
             cor_hex='#EFE3A3', claro=True, barba=None, faixa=None,
             ficha='pele muito escura; rosto oval alongado; cabelo crespo curto descolorido (platinado); sem barba'),
    13: dict(idade=26, rosto='square face with a defined jaw', pele='t5', sobrancelha='straight, thick, dark brown', nariz='medium nose; medium lips',
             cabelo='long, softly wavy hair in a light chestnut brown (about #8A5A32), loose and not tied, falling to the shoulders and tucked behind the ears so that both ears show; centre-parted; the hair stays behind the shoulders and does not cover the shirt collar.',
             cor_hex='#8A5A32', claro=False, barba='cheia', faixa=None,
             ficha='pele média-morena; rosto quadrado; cabelo longo ondulado castanho claro, solto, atrás das orelhas; barba cheia e curta'),
    14: dict(idade=23, rosto='triangular face with a narrow chin', pele='t7', sobrancelha='straight, medium-thick, black', nariz='medium nose; full lips',
             cabelo='a short HIGH FADE: the sides and back are skin-faded up high, almost to the temples, and the top is short and textured, about 3 cm, black. Clean natural hairline. Ears visible.',
             cor_hex='#1C1C1C', claro=False, barba='rala', faixa='black',
             ficha='pele dourada escura; rosto triangular; degradê alto com topo curto preto; barba rala; faixa de cabelo preta'),
    15: dict(idade=21, rosto='oval face with a soft jaw', pele='t1', sobrancelha='straight, medium-thin, light brown', nariz='narrow nose; thin lips',
             cabelo='long, straight hair in a dark blond (about #B58A4B) pulled back and gathered into a neat bun at the crown of the head, forehead and both ears fully clear; a few short strands at the temples only.',
             cor_hex='#B58A4B', claro=True, barba=None, faixa=None,
             ficha='pele muito clara; rosto oval; cabelo longo loiro escuro preso em coque no alto; sem barba'),
    16: dict(idade=25, rosto='oval face with a strong forehead', pele='t10', sobrancelha='straight, thick, black', nariz='broad nose; full lips',
             cabelo='long black braids: tight cornrow braids run back from the hairline across the top of the head, and the braid ends gather behind the head and hang BEHIND the shoulders, never in front of the chest. Both ears fully visible.',
             cor_hex='#1C1C1C', claro=False, barba=None, faixa=None,
             ficha='pele muito escura (a mais escura do conjunto); rosto oval; tranças pretas longas presas atrás; sem barba'),
    17: dict(idade=22, rosto='round face with soft cheeks', pele='t4', sobrancelha='arched, medium-thick, dark brown', nariz='medium nose; medium lips',
             cabelo='medium-length curly hair in a chestnut brown (about #5C3A21), about 6 cm, with soft volume on top, held back off the forehead by the headband, both ears visible.',
             cor_hex='#5C3A21', claro=False, barba='rala', faixa='white',
             ficha='pele morena clara; rosto redondo; cabelo cacheado médio castanho com volume; barba rala; faixa de cabelo branca'),
    18: dict(idade=27, rosto='long face with a strong chin', pele='t8', sobrancelha='straight, thick, black', nariz='broad nose; full lips',
             cabelo='long black locs (dreadlocks), neatly formed, pulled back off the face and falling BEHIND the shoulders, never in front of the chest; the hairline is clean and both ears are fully visible.',
             cor_hex='#1C1C1C', claro=False, barba='cavanhaque', faixa='black',
             ficha='pele escura; rosto alongado; rastas pretas longas para trás; cavanhaque; faixa de cabelo preta'),
    19: dict(idade=28, rosto='square face with a heavy jaw', pele='t6', sobrancelha='straight, thick, dark brown', nariz='medium nose; medium lips',
             cabelo='a short HIGH FADE: the sides and back are skin-faded up high, and the top is short and textured, about 3 cm, in a very dark brown (about #3B2616). Clean natural hairline. Ears visible.',
             cor_hex='#3B2616', claro=False, barba='cheia', faixa=None,
             ficha='pele parda; rosto quadrado, traços maduros; degradê alto com topo curto castanho-escuro; barba cheia e curta'),
    20: dict(idade=20, rosto='triangular face with a pointed chin', pele='t3', sobrancelha='arched, medium-thin, copper-brown', nariz='narrow nose; thin lips',
             cabelo='medium-length curly hair in a natural copper-red auburn (about #9C4A24), about 6 cm, with soft volume on top, covering the top of the ears but leaving the ear lobes visible.',
             cor_hex='#9C4A24', claro=True, barba='bigode', faixa=None,
             ficha='pele clara oliva; rosto triangular; cabelo cacheado médio ruivo acobreado; bigode fino'),
}

LINHA_CABELO = '- Hair, eyebrows and facial hair use only black, dark-brown or brown tones (grey strands only where the character section says so).'
LINHA_CORES = '- No cyan, no blue, no yellow, no gold, no orange and no red anywhere on the person, not even in the eyes.'
PLANO_CLARO_CABELO = '- The hair uses the colour given in the character section; eyebrows and facial hair use black, dark-brown or brown tones.'
PLANO_CLARO_CORES = '- Apart from the hair colour, there is no cyan, no blue, no yellow, no gold, no orange and no red anywhere on the person, not even in the eyes.'
CONF_ORELHAS = '- [ ] Orelhas visíveis. Sem óculos, brinco, colar, boné ou faixa.'
CONF_ORELHAS_FAIXA = '- [ ] Orelhas visíveis. Sem óculos, brinco, colar nem boné; a faixa de cabelo é a da ficha (lisa, sem logo nem texto).'
CONF_CLARO = '- [ ] Cabelo claro: a camisa continua magenta lisa e o fundo verde, sem mancha nem tom de pele ou cabelo vazando para o fundo.'


def personagem(f):
    return '\n'.join([
        'CHARACTER (this image only)',
        f"- Apparent age: {f['idade']} years old.",
        f"- Face shape: {f['rosto']}.",
        f"- Skin: {PELE[f['pele']]}. Even tone, no freckles, no moles, no scars, no tattoos.",
        '- Eyes: DARK BROWN iris (a deep brown, close to black-brown). The iris must NOT be green, blue, grey, hazel or yellow. Both eyes fully visible, looking straight into the camera.',
        f"- Eyebrows: {f['sobrancelha']}.",
        f"- Nose and lips: {f['nariz']}.",
        f"- Hair: {f['cabelo']}",
        f"- Facial hair: {BARBA[f['barba']]}",
        '- Expression: calm and confident, mouth closed, with a very slight smile. Not laughing, not serious, not angry.',
        f"- {FAIXA[f['faixa']]}",
        '- Both ears fully visible (hair never covers them).',
    ])


def gerar(saida):
    t0 = open(BASE, encoding='utf-8').read()
    ini, fim = t0.index('CHARACTER (this image only)'), t0.index('BODY AND POSE')
    for n, f in FICHAS.items():
        t = t0[:ini] + personagem(f) + '\n\n' + t0[fim:]
        t = t.replace('# Visual 04:', f'# Visual {n}:').replace('miniatura "Visual 4"', f'miniatura "Visual {n}"')
        assert LINHA_CABELO in t and LINHA_CORES in t, 'o prompt do Visual 04 mudou: ajuste as linhas do plano de cor'
        if f['claro']:
            t = t.replace(LINHA_CABELO, PLANO_CLARO_CABELO).replace(LINHA_CORES, PLANO_CLARO_CORES)
        assert CONF_ORELHAS in t, 'a conferência do Visual 04 mudou'
        t = t.replace(CONF_ORELHAS, CONF_ORELHAS_FAIXA if f['faixa'] else CONF_ORELHAS)
        if f['claro']:
            t = t.rstrip('\n') + '\n' + CONF_CLARO + '\n'
        pasta = os.path.join(saida, f'visual-{n}')
        os.makedirs(pasta, exist_ok=True)
        with open(os.path.join(pasta, 'prompt.md'), 'w', encoding='utf-8') as out:
            out.write(t)


if __name__ == '__main__':
    saida = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'visuais')
    gerar(saida)
    print('ok', len(FICHAS), 'prompts em', os.path.relpath(saida, os.getcwd()))
