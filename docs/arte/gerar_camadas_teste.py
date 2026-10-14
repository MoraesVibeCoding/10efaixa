#!/usr/bin/env python3
"""Teste de cena por CAMADAS (SPEC v2.97): 4 prompts separados em docs/arte/camadas-teste/<NN-nome>/prompt.md.

A cena de treino (docs/arte/cenas/11-treino) é refeita em camadas que se juntam depois por código:
  01 fundo sem ninguém  ·  02 jogador correndo (cabelo curto)  ·  03 o mesmo jogador com coque  ·  04 bola.
O jogador sai isolado em fundo verde chapado, com camisa MAGENTA e calção e meiões CIANO, para o código trocar só o uniforme
(e a pele e a cor do cabelo). Mesmo posicionamento da cena de treino atual (cabeça a 12%, pés a 75% da altura) para o jogador
entrar no fundo sem escala nem deslocamento.

Uso:  python3 docs/arte/gerar_camadas_teste.py [pasta de saída]   (padrão: docs/arte/camadas-teste)
Autoteste:  python3 docs/arte/test_gerar_camadas_teste.py
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))

HEAD = '''> **INSTRUCTIONS FOR THE ASSISTANT — READ FIRST**
> Start from a clean slate. Clear and ignore everything from earlier in this conversation and from any previous conversation: earlier prompts, earlier images, earlier styles and earlier corrections. Use only what is written in this file.
> Then generate one image following the section "Prompt" below. The sections in Portuguese are notes for the human reviewer and are not part of the request.
'''
TAIL = '''> **AFTER GENERATING — FINAL STEP**
> Save the generated image in the same folder where this file is stored, with the file name `imagem.jpeg`. If you cannot save it yourself, say so clearly and show the image so that the user can save it manually.
'''
STYLE = '''STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.'''
SIZE = 'Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).'
LIGHT = 'The light comes from the upper left: bright morning sunlight, soft warm highlights on the left side of everything and soft shadows to the right.'
MUST = [
    'No text, letters or numbers anywhere.',
    'No logos, crests, badges, sponsor or brand marks on anything.',
    'No watermark or signature, and no interface elements, frames or borders.',
]


def prompt(*secoes, must=()):
    corpo = [SIZE, '', STYLE] + [x for s in secoes for x in ('', s)]
    corpo += ['', 'MUST NOT APPEAR'] + ['- ' + m for m in list(must) + MUST]
    return '```\n' + '\n'.join(corpo) + '\n```'


FUNDO = prompt(
    '''SETTING
The training ground of a football club on a bright morning, seen from a camera at waist height, looking along a row of small plain white training cones that curves away from the camera towards the horizon. A well-kept grass pitch, a low wire fence, a few trees and a small empty concrete stand in the distance. Clear pale-blue sky. This is a background plate: the scene is completely EMPTY of people.''',
    '''LIGHT
''' + LIGHT + ''' Every cone casts a short soft shadow to its right.''',
    '''COLOUR PLAN - follow it exactly, because software will place a character into this image afterwards
- No magenta and no cyan anywhere in the image.
- The training cones are plain white. There are no orange, yellow or red cones.
- Everything uses pitch green, concrete grey, off-white, pale sky blue and muted natural tones. No purple, no pink, no neon colours.''',
    '''COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height. The ground plane is clearly visible, and the horizon sits at about 45% of the way down from the top edge.
- The centre of the image, about 40% of the width, from 10% to 78% of the height, is open pitch and distant background: leave it free, because a player will be placed there later. The cones run along the left and the right of that open area, never through its middle.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects and no detail, because interface panels will be placed over that area.''',
    must=['No people at all, not even far away or out of focus. No coach, no spectators and no team-mates.', 'No ball, no bibs, no bags and no equipment other than the cones.'])

PLAYER_SETTING = '''CHARACTER SHEET (this is an isolated game sprite, not a scene)
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, {hair}, and an athletic build.
He runs away from the camera, in the centre of the frame, with his back to the camera, body leaning slightly forward, arms out a little for balance but not crossing his back, the right leg lifted and the left foot on the ground, in the middle of a stride.'''

PLAYER_REST = [
    '''CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.''',
    '''THE BACK OF THE SHIRT
From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no hair, no object).''',
    '''BACKGROUND
A perfectly flat, solid, uniform green background (#00B140) behind the whole figure, with no gradient, no texture, no vignette and no floor. There is no ground, no grass and no cast shadow under the player: the player floats on the green. The green appears in only one place: the background; there is no green on the player.''',
    LIGHT,
    '''COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt.
- Cyan appears in one place only: the shorts and socks.
- Boots are plain black. There is no other bright colour on the player.
- Skin is a medium brown, a plain warm tone, with soft shading; hair is dark brown.''',
    '''COMPOSITION - follow these positions
- Vertical 4:5. The whole figure, from the top of the head to the boots, is fully inside the frame.
- The figure is horizontally centred. The top of the head is at about 12% of the way down from the top edge and the boots are at about 75% of the way down.
- At least 8% of empty green on each side. The arms and the lifted leg never touch the edges.
- The camera is at waist height, a few metres behind him.''',
]
PLAYER_MUST = ['The face of the character is not visible: he is seen from behind.',
               'No ground, no grass, no cast shadow, no ball, no cones and no other person.',
               'The character is an original fictional person who does not resemble any real person.',
               'No headband, no cap, no glasses, no earrings, no necklace and no hair accessory.']


def jogador(cabelo):
    return prompt(PLAYER_SETTING.format(hair=cabelo), *PLAYER_REST, must=PLAYER_MUST)


BOLA = prompt(
    '''OBJECT SHEET (this is an isolated game object, not a scene)
One plain white football, seen from slightly above and to the side, resting in the middle of the frame. A smooth white ball with soft grey shading and no pattern, no panels drawn in black, no logo and no text; only a few very faint seam lines.''',
    '''BACKGROUND
A perfectly flat, solid, uniform green background (#00B140) behind the object, with no gradient, no texture and no floor. There is no ground and no cast shadow under the ball: it floats on the green. There is no green on the ball.''',
    LIGHT,
    '''COMPOSITION
- Vertical 4:5. The ball is horizontally centred, about 20% of the image width, with its centre at about 50% of the height, with at least 30% of empty green on each side.''',
    must=['No pattern on the ball: no pentagons, no hexagons and no coloured details.', 'No ground, no grass, no cast shadow and no person.'])

CAMADAS = {
    '01-fundo-treino': ('Fundo do treino, sem ninguém',
                        'Gere primeiro. É o cenário vazio; o jogador e a bola entram por cima. Confira: nenhuma pessoa, nenhuma bola, centro livre, parte de baixo escura, sem magenta nem ciano.',
                        FUNDO, ['Nenhuma pessoa, nem ao longe', 'Sem bola', 'Centro do campo livre', 'Faixa de baixo escura e vazia', 'Cones brancos, sem magenta nem ciano']),
    '02-jogador-curto': ('Jogador correndo, cabelo curto',
                         'Jogador isolado em fundo verde. Mesmo posicionamento da cena de treino atual.',
                         jogador('short curly dark-brown hair, cut close to the head'),
                         ['Fundo verde chapado, sem chão nem sombra', 'Camisa magenta lisa, calção e meiões ciano, chuteira preta', 'Corpo inteiro dentro do quadro, 8% de folga nas laterais', 'Rosto não aparece', 'Sem acessórios']),
    '03-jogador-coque': ('Jogador correndo, coque',
                         'O MESMO jogador e a mesma pose da imagem 02, só com o cabelo trocado. Para manter o corpo igual, anexe a imagem 02 e acrescente no fim do prompt: `Use the attached image only as a reference for the body, the pose, the clothes and the painting style. Change only the hair.`',
                         jogador('long dark-brown hair pulled up and gathered into a neat bun at the crown of the head, with the back of the neck and both ears clear'),
                         ['Mesmo corpo e mesma pose da imagem 02', 'Só o cabelo muda: coque no alto da cabeça', 'Fundo verde chapado, sem chão nem sombra', 'Camisa magenta lisa, calção e meiões ciano']),
    '04-bola': ('Bola isolada',
                'Elemento solto, em fundo verde.',
                BOLA, ['Bola branca lisa, sem desenho, sem marca', 'Fundo verde chapado, sem sombra']),
}


def md(pasta, titulo, nota, bloco, checks):
    chk = ''.join(f'- [ ] {c}\n' for c in checks)
    return f'''# Camada {pasta[:2]} — {titulo}

{HEAD}
**Como gerar:** abra uma conversa nova e gere do zero com o prompt abaixo. {nota}

**Arquivo da imagem:** salve nesta pasta como `imagem.jpeg`.

## Prompt

{bloco}

{TAIL}
## Conferência (para você)

{chk}'''


README = '''# Teste de cena por camadas (SPEC v2.97)

Objetivo: ver se montar a cena em camadas dá uma imagem boa e deixa trocar só o uniforme (e pele e cabelo) por código.
Cena de teste: **treino**, a mesma de `docs/arte/cenas/11-treino`.

| Ordem | Pasta | O que é |
|--:|---|---|
| 1 | `01-fundo-treino` | Campo de treino vazio, sem ninguém |
| 2 | `02-jogador-curto` | Jogador correndo de costas, cabelo curto, em fundo verde |
| 3 | `03-jogador-coque` | O mesmo jogador, com coque (anexar a imagem 2 como referência de corpo e pose) |
| 4 | `04-bola` | Bola branca lisa, em fundo verde |

Salve cada imagem como `imagem.jpeg` na própria pasta e avise. Eu junto as camadas, aplico o uniforme de um clube por código e mostro ao lado da cena atual.

**Por que o uniforme troca fácil:** o jogador sai isolado com camisa magenta e calção e meiões ciano, as cores-chave de sempre. Sem fundo e sem chão, as máscaras saem limpas.
'''


def gerar(saida):
    for pasta, (titulo, nota, bloco, checks) in CAMADAS.items():
        os.makedirs(os.path.join(saida, pasta), exist_ok=True)
        with open(os.path.join(saida, pasta, 'prompt.md'), 'w', encoding='utf-8') as f:
            f.write(md(pasta, titulo, nota, bloco, checks))
    with open(os.path.join(saida, 'README.md'), 'w', encoding='utf-8') as f:
        f.write(README)


if __name__ == '__main__':
    saida = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'camadas-teste')
    gerar(saida)
    print('ok', len(CAMADAS), 'prompts em', os.path.relpath(saida, os.getcwd()))
