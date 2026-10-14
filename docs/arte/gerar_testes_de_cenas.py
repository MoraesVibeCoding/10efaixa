#!/usr/bin/env python3
"""Testes de cenas por camadas (SPEC v2.99): 5 cenas, 25 prompts em docs/arte/testes-de-cenas/<cena>/<camada>/prompt.md.

Cada cena é pedida em partes que o código junta depois (cenário, elementos fixos, figurantes, jogador, objetos), todas na MESMA tela
(4:5, 1856x2304) e com a MESMA "ficha da cena" (câmera, luz, mapa de posições), colada igual em todos os prompts da cena. O jogador sai
em fundo verde chapado, com camisa magenta e calção e meiões ciano (cores-chave: o uniforme do clube entra por código), nos dois formatos
de cabelo do teste (curto e coque) para provar que o corpo não muda. Onde jogador e objeto se tocam (banco, banquinho, sofá), os dois
saem na mesma camada.

Cenas: treino (corrida), estádio (muita gente), vestiário (sentado), pênalti (goleiro) e casa da família (roupa civil).
Pele marrom e cabelo castanho-escuro de propósito: são a base que o código recolore.

Uso:  python3 docs/arte/gerar_testes_de_cenas.py [pasta de saída]   (padrão: docs/arte/testes-de-cenas)
Autoteste:  python3 docs/arte/test_gerar_testes_de_cenas.py
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))

HEAD = '''> **INSTRUCTIONS FOR THE ASSISTANT — READ FIRST**
> Start from a clean slate. Clear and ignore everything from earlier in this conversation and from any previous conversation: earlier prompts, earlier images, earlier styles and earlier corrections. Use only what is written in this file (and the image the user attaches, if any).
> Then generate one image following the section "Prompt" below. The sections in Portuguese are notes for the human reviewer and are not part of the request.
'''
TAIL = '''> **AFTER GENERATING — FINAL STEP**
> Save the generated image in the same folder where this file is stored, with the file name `imagem.jpeg`. If you cannot save it yourself, say so clearly and show the image so that the user can save it manually.
'''
SIZE = 'Create a vertical 4:5 portrait image at the highest resolution available (1856 x 2304 pixels). Every layer of this scene uses exactly this canvas.'
STYLE = '''STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.'''
VERDE = '''BACKGROUND
A perfectly flat, solid, uniform green background (#00B140) behind everything in this image, with no gradient, no texture, no vignette and no floor. There is no ground, no grass and no cast shadow: the elements float on the green. The green appears in one place only: the background; there is no green on the elements.'''
MUST = ['No text, letters or numbers anywhere.',
        'No logos, crests, badges, sponsor or brand marks on anything.',
        'No watermark or signature, and no interface elements, frames or borders.',
        'Every person is an original fictional character who does not resemble any real person.']
CABELOS = {
    'curto': ('curto', 'short curly dark-brown hair, cut close to the head'),
    'coque': ('coque', 'long dark-brown hair pulled up and gathered into a neat bun at the crown of the head, with the back of the neck and both ears clear'),
}
KIT = 'plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots'
COSTAS_CAMISA = 'From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no hair, no object).'
JOGADOR_MUST = ['The face of the character is not visible: he is seen from behind.',
                'No ground, no grass, no cast shadow and no other person.',
                'No headband, no cap, no glasses, no earrings, no necklace and no hair accessory.']
CENARIO_MUST = ['No people at all, not even far away or out of focus.']
VERDE_MUST = ['No ground, no grass and no cast shadow.']


def camada(pasta, papel, titulo, o_que, fundo, alvo, cores, must, checks, z, ref=None, nota=''):
    return dict(pasta=pasta, papel=papel, titulo=titulo, o_que=o_que, fundo=fundo, alvo=alvo, cores=cores, must=must, checks=checks, z=z, ref=ref, nota=nota)


def jogador(cena_prefixo, pose_pasta, pose, roupa, alvo, cores, extra_checks, z=30, ref='01-cenario'):
    """Duas camadas de jogador (curto e coque) com o mesmo texto, trocando só o cabelo."""
    out = []
    for fmt, (nome, cabelo) in CABELOS.items():
        corpo = (f'One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, {cabelo}, and an athletic build.\n'
                 f'{pose}\n{roupa}')
        nota = ('O MESMO jogador e a mesma pose da camada de cabelo curto, só com o cabelo trocado. Anexe a imagem do cabelo curto e acrescente no fim do prompt: '
                '`Use the attached image only as a reference for the body, the pose, the clothes and the painting style. Change only the hair.`') if fmt == 'coque' else ''
        out.append(camada(f'{pose_pasta}-{nome}', 'jogador', f'Jogador {nome}', corpo, VERDE, alvo, cores, JOGADOR_MUST,
                          [f'Cabelo {nome}', 'Fundo verde chapado, sem chão nem sombra', *extra_checks, 'Rosto não aparece', 'Sem acessórios'], z, ref=ref, nota=nota))
    return out


CENAS = {}

# ---------------------------------------------------------------- 01 treino
CENAS['01-treino'] = dict(
    nome='Treino', original='11-treino', clothing='kit',
    ficha='''Camera: at waist height, a few metres behind the player, looking along a row of small white training cones that curves away towards the horizon. The horizon sits at 45% of the way down from the top edge.
Light: bright morning sunlight from the upper left; warm soft highlights on the left of everything and soft short shadows to the right.
Palette: pitch green, concrete grey, off-white, pale sky blue and muted natural tones. Magenta appears only on shirts and cyan only on shorts and socks of the players. No purple, no pink, no neon.
Placement map (fractions of the canvas, x from the left and y from the top): the main player is horizontally centred, head top at 12% and boots at 75%; the team-mates group is on the left, between x 6% and 34% and y 38% and 52%; the coach is on the right, between x 70% and 80% and y 36% and 56%; the ball is just ahead of the player's lifted foot, between x 58% and 68% and y 66% and 76%.
The lower 40% of the canvas is calm and dark: the grass fading into deep navy shadow, with no objects, because interface panels go over that area.''',
    camadas=[
        camada('01-cenario', 'cenario', 'Cenário do treino, sem ninguém',
               'The training ground of a football club on a bright morning: a well-kept grass pitch, a low wire fence, a few trees and a small empty concrete stand in the distance, under a clear pale-blue sky. A row of small plain white training cones curves away from the camera towards the horizon, running along the left of the open centre and then the right of it. The scene is completely empty of people.',
               None, None,
               'No magenta and no cyan anywhere. The cones are plain white: no orange, yellow or red cones.',
               CENARIO_MUST + ['No ball, no bibs, no bags and no equipment other than the cones.',
                               'The open area between x 30% and 70%, from y 10% to y 78%, is free pitch and distant background: no cones and no objects there.'],
               ['Nenhuma pessoa', 'Sem bola', 'Centro do campo livre', 'Faixa de baixo escura e vazia', 'Cones brancos'], 0),
        camada('03-companheiros', 'figurantes', 'Três companheiros trotando', 'Three team-mates jogging side by side in a small group, seen from the front, small and slightly out of focus, each in the plain kit below. They are the same size as people about 25 metres from the camera.',
               VERDE, [0.06, 0.38, 0.34, 0.52], 'Magenta only on their shirts, cyan only on their shorts and socks, boots black.',
               VERDE_MUST + ['No ball.'], ['Três jogadores no mesmo grupo', 'Camisa magenta lisa, calção e meiões ciano', 'Pequenos, ao fundo'], 20, ref='01-cenario',
               nota='Camisa magenta, calção e meiões ciano: ' + KIT),
        camada('03-tecnico', 'figurantes', 'Técnico de braços cruzados', 'A coach standing still with his arms crossed, seen from the front, small and slightly out of focus, in a plain dark navy tracksuit with a whistle on a cord, watching. No badge, emblem or stripes on the tracksuit.',
               VERDE, [0.70, 0.36, 0.80, 0.56], 'Navy tracksuit, plain; the whistle cord is white.', VERDE_MUST, ['Agasalho azul-marinho liso, sem escudo nem listras', 'Apito no cordão', 'Braços cruzados'], 20, ref='01-cenario'),
        *jogador('01-treino', '04-jogador-correndo',
                 'He runs away from the camera, in the centre of the frame, with his back to the camera, body leaning slightly forward, arms out a little for balance but not crossing his back, the right leg lifted and the left foot on the ground, in the middle of a stride.',
                 f'He wears a {KIT}. {COSTAS_CAMISA}', [0.32, 0.12, 0.68, 0.75],
                 'Magenta only on the shirt; cyan only on the shorts and socks; boots black. Skin medium brown, hair dark brown.', ['Camisa magenta lisa, calção e meiões ciano', 'Corpo inteiro dentro do quadro, 8% de folga nas laterais']),
        camada('05-bola', 'objeto', 'Bola', 'One plain white football, seen from slightly above and to the side. A smooth white ball with soft grey shading, no pattern and no panels drawn in black; only a few very faint seam lines.',
               VERDE, [0.58, 0.66, 0.68, 0.76], 'White and soft grey only.', VERDE_MUST + ['No pattern: no pentagons, no hexagons and no coloured details.'], ['Bola branca lisa, sem desenho'], 40, ref='01-cenario'),
    ])

# ---------------------------------------------------------------- 02 estádio
CENAS['02-estadio'] = dict(
    nome='Estádio', original='21-estadio', clothing='kit',
    ficha='''Camera: at waist height, a few metres behind the player, looking up the pitch towards the opponents' goal. The horizon (the far goal line) sits at 38% of the way down from the top edge.
Light: a night match under floodlights from above; cool white light on the pitch, warm yellow only on the floodlight glow itself; soft shadows pointing slightly to the right and towards the camera.
Palette: navy blue, concrete grey, off-white, pitch green. The crowd and the flags are light grey and mid grey. Magenta appears only on the shirts and cyan only on the shorts and socks of the player's team. Opponents wear plain light grey. No purple, no pink, no neon.
Placement map (fractions of the canvas): the main player is horizontally centred, head top at 12% and boots at 75%; the two opponents are ahead of him, between x 18% and 80% and y 38% and 68%; the two team-mates run on the far left and far right, between x 3% and 97% and y 38% and 62%; the ball is just ahead of the player's right foot, between x 50% and 60% and y 66% and 76%.
The lower 40% of the canvas is calm and dark: the grass fading into deep navy shadow, with no objects, because interface panels go over that area.''',
    camadas=[
        camada('01-cenario', 'cenario', 'Estádio lotado, sem jogadores',
               'A full football stadium at night in the middle of a league match, seen from pitch level. Floodlights shine from above. A large scoreboard above the stand is a plain dark panel with nothing shown on it. Beyond the pitch, the opponents\' goal with its net stands at the far end. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. The pitch is empty: no players, no referee, no ball.',
               None, None,
               'Crowd, flags, banners and stands in light grey and mid grey; the sky is deep navy; warm yellow only on the floodlight glow; no magenta and no cyan anywhere.',
               CENARIO_MUST + ['No ball and no players on the pitch.', 'The open area between x 18% and 82%, from y 10% to y 78%, shows only pitch and the far goal: nobody stands there.'],
               ['Nenhum jogador em campo', 'Torcida cinza com bandeiras cinza lisas', 'Placar escuro sem nada escrito', 'Faixa de baixo escura e vazia'], 0),
        camada('03-adversarios', 'figurantes', 'Dois adversários fechando', 'Two opponents closing in, side by side but apart from each other, in a low defensive stance with knees bent and arms slightly open, seen from the front, slightly out of focus. They wear plain light-grey shirts, light-grey shorts and light-grey socks.',
               VERDE, [0.18, 0.38, 0.80, 0.68], 'Light grey and mid grey only (no magenta, no cyan). Boots black.', VERDE_MUST + ['No ball.', 'No stripes or marks on the grey kit.'], ['Dois adversários separados, de frente', 'Uniforme cinza claro liso'], 20, ref='01-cenario'),
        camada('03-companheiros', 'figurantes', 'Dois companheiros pedindo a bola', 'Two team-mates far apart from each other: one on the far left and one on the far right of the canvas, each running forward and asking for the ball with one arm raised, small and slightly out of focus, seen from the front. They wear the plain kit below.',
               VERDE, [0.03, 0.38, 0.97, 0.62], 'Magenta only on shirts, cyan only on shorts and socks, boots black.', VERDE_MUST + ['No ball.', 'Nobody in the middle of the canvas: the area between x 20% and 80% is empty green.'],
               ['Um à esquerda e um à direita, nada no meio', 'Camisa magenta lisa, calção e meiões ciano'], 20, ref='01-cenario', nota='Uniforme: ' + KIT),
        *jogador('02-estadio', '04-jogador-conduzindo',
                 'He runs away from the camera, in the centre of the frame, with his back to the camera, body leaning forward, arms out for balance but not crossing his back, the right leg stretched forward in mid-stride as if about to touch a ball (there is no ball in this image).',
                 f'He wears a {KIT}. {COSTAS_CAMISA}', [0.30, 0.12, 0.70, 0.75],
                 'Magenta only on the shirt; cyan only on the shorts and socks; boots black. Skin medium brown, hair dark brown.', ['Camisa magenta lisa, calção e meiões ciano', 'Sem bola na imagem']),
        camada('05-bola', 'objeto', 'Bola', 'One plain white football, seen from slightly above and to the side, a smooth white ball with soft grey shading, no pattern and no panels drawn in black, only a few very faint seam lines.',
               VERDE, [0.50, 0.66, 0.60, 0.76], 'White and soft grey only.', VERDE_MUST + ['No pattern: no pentagons, no hexagons and no coloured details.'], ['Bola branca lisa, sem desenho'], 40, ref='01-cenario'),
    ])

# ---------------------------------------------------------------- 03 vestiário
CENAS['03-vestiario'] = dict(
    nome='Vestiário', original='02-vestiario', clothing='kit',
    ficha='''Camera: straight behind the player, at the height of his shoulders, about three metres back, looking horizontally; no tilt, no low angle, no close-up.
Light: a single bare light bulb hangs from the ceiling above the centre locker and is the only light source: soft, cool white light from above, soft shadows falling straight down.
Palette: navy-blue lockers, grey concrete walls and floor, dark brown wooden bench. Magenta appears only on the shirts hanging in the lockers. Cyan appears only on the player's shorts and socks. Boots are black. No gold, no yellow, no red, no green.
Placement map (fractions of the canvas): five open-front lockers side by side, each 18% wide, at x 1%-19%, 21%-39%, 41%-59%, 61%-79% and 81%-99%, with their interiors from y 10% to y 40%; the centre locker (x 41%-59%) has a navy-blue door swung open towards the right; one magenta shirt hangs inside each locker, centred in it, from y 14% to y 34%; the player sits on a bench in the centre of the canvas, head top at 30%, bench seat at 60% and boots at 72%.
The lower 28% of the canvas is empty concrete floor fading into deep navy shadow, with no objects, because interface panels go over that area.''',
    camadas=[
        camada('01-cenario', 'cenario', 'Vestiário com armários vazios',
               'A modest, slightly worn dressing room of a Brazilian football club, before a match. The back wall is a straight row of five open-front lockers seen head-on, with navy-blue frames and pale grey concrete interiors, positioned exactly as in the placement map. The centre locker has a navy-blue metal door swung open towards the right. A single bare light bulb hangs from the ceiling above the centre locker. Two or three plain grey sports bags rest on the locker shelves and on the floor at the far left and far right. The lockers are EMPTY: no shirts and no hangers. There is no bench and nobody in the room. Walls and floor are bare grey concrete.',
               None, None,
               'Lockers navy blue and grey; walls, floor and bags grey; no magenta, no cyan, no gold, no yellow, no red and no green anywhere.',
               CENARIO_MUST + ['No shirts, no clothes, no hangers and no bench.', 'The open area between x 20% and 80%, from y 40% to y 80%, is bare floor: no objects there.'],
               ['Cinco armários, o do centro com a porta aberta', 'Armários vazios, sem camisa', 'Sem banco e sem ninguém', 'Parte de baixo de concreto escuro e vazia'], 0),
        camada('02-fixo-camisas', 'fixo', 'As cinco camisas pendentes',
               'Five plain bright magenta short-sleeved football shirts, each hanging flat on a metal hanger and facing the camera, in a row at the x positions of the five lockers (centres at x 10%, 30%, 50%, 70% and 90%), each from y 14% to y 34% of the canvas and about 14% wide. Nothing else is in the image.',
               VERDE, [0.03, 0.14, 0.97, 0.34], 'Magenta only on the five shirts; the hangers are dark grey metal.',
               VERDE_MUST + ['The shirts are smooth and plain: no number, no stripes and no neckline detail other than a simple round neck.'],
               ['Cinco camisas magenta lisas, de frente', 'Alinhadas com os cinco armários (centros 10, 30, 50, 70 e 90%)'], 10, ref='01-cenario',
               nota='O uniforme do clube entra nestas camisas por código, como no jogador.'),
        *jogador('03-vestiario', '04-jogador-sentado-no-banco',
                 'He is SEATED on a dark wooden bench that runs across the foreground, exactly in the centre of the frame. He is sitting, not standing. His back is straight, his hands rest on his thighs and his head is tilted slightly up, looking at the shirt in front of him: a quiet moment before putting the shirt on. The bench is part of this image (a plain dark brown wooden bench about 60% of the canvas wide); the player and the bench are one element.',
                 'He is shirtless: bare back, bare shoulders and bare arms. He wears plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and both socks are clearly lit and fully visible below the bench.',
                 [0.20, 0.28, 0.80, 0.72],
                 'Cyan only on the shorts and socks; boots black; the bench is dark brown wood. Skin medium brown, hair dark brown.', ['Sem camisa, costas nuas', 'Calção e meiões ciano', 'Banco de madeira escura junto na imagem', 'Corpo inteiro e banco dentro do quadro']),
    ])
# no vestiário o jogador está sem camisa: o prompt acima não pede camisa magenta; o teste exige magenta só nos jogadores de camisa

# ---------------------------------------------------------------- 04 pênalti
CENAS['04-penalti'] = dict(
    nome='Pênalti', original='04-penalti', clothing='kit',
    ficha='''Camera: at waist height, a few metres behind the player, looking straight at the goal.
Light: a night match under floodlights from above; cool white light on the pitch, warm yellow only on the floodlight glow; soft shadows pointing slightly to the right and towards the camera.
Palette: pitch green, navy blue, concrete grey, off-white. The crowd, the flags, the banners and the stands are light grey and mid grey; the sky is plain deep navy. Magenta appears only on the player's shirt and cyan only on his shorts and socks. The goalkeeper wears rose pink (#F0569B) with orange gloves. No purple, no neon.
Placement map (fractions of the canvas): the goal is centred, its posts at x 26% and x 74%, the crossbar at y 34% and the goal line at y 55%; the goalkeeper crouches on the goal line between x 43% and 57% and y 39% and 56%; the penalty spot is at x 50%, y 66%, with the ball on it between x 46% and 54% and y 62% and 69%; the main player stands a few steps behind the ball, horizontally centred, head top at 14% and boots at 75%.
The lower 40% of the canvas is calm and dark: the grass fading into deep navy shadow, with no objects, because interface panels go over that area.''',
    camadas=[
        camada('01-cenario', 'cenario', 'Gol e torcida, sem ninguém',
               'A football stadium at night during a decisive match, seen from the penalty area. The goal with its white posts, crossbar and net stands exactly as in the placement map, the penalty area markings are visible on the pitch, and behind the goal a softly blurred crowd in neutral light-grey clothes holds plain light-grey flags. Floodlights shine from above. The goal is EMPTY and the pitch has no players, no goalkeeper and no ball. There is no penalty spot ball.',
               None, None,
               'Crowd, flags, banners and stands light grey and mid grey; the sky is plain deep navy lit only by white floodlights; warm yellow only on the floodlight glow; no magenta and no cyan.',
               CENARIO_MUST + ['No goalkeeper and no ball.', 'The area between x 30% and 70%, from y 56% to y 80%, shows only the pitch markings and grass: nothing stands there.'],
               ['Gol vazio e centralizado', 'Sem goleiro nem bola', 'Torcida cinza com bandeiras cinza lisas', 'Faixa de baixo escura e vazia'], 0),
        camada('03-goleiro', 'figurantes', 'Goleiro agachado na linha', 'A goalkeeper crouched on the goal line, small and slightly out of focus, seen from the front, knees bent, both arms slightly open and ready to dive, in a plain rose pink long-sleeved shirt, rose pink shorts and rose pink socks, with plain orange gloves and black boots.',
               VERDE, [0.43, 0.39, 0.57, 0.56], 'Rose pink (#F0569B) only on the shirt, shorts and socks; orange only on the gloves; boots black. No magenta and no cyan.',
               VERDE_MUST + ['No ball.', 'No stripes, badge or text on the goalkeeper kit.'], ['Goleiro rosa de manga longa, luvas laranja', 'Agachado, de frente, pequeno'], 20, ref='01-cenario'),
        *jogador('04-penalti', '04-jogador-parado',
                 'He stands upright and still, in the centre of the frame, with his back to the camera, feet apart at shoulder width, arms relaxed at his sides, shoulders tense, head slightly raised as if looking at the goal.',
                 f'He wears a {KIT}. {COSTAS_CAMISA}', [0.34, 0.14, 0.66, 0.75],
                 'Magenta only on the shirt; cyan only on the shorts and socks; boots black. Skin medium brown, hair dark brown.', ['Em pé, parado, de costas', 'Camisa magenta lisa, calção e meiões ciano']),
        camada('05-bola-na-marca', 'objeto', 'Bola na marca do pênalti', 'One plain white football resting on the grass, seen from slightly above and from behind, a smooth white ball with soft grey shading, no pattern and no panels drawn in black, only a few very faint seam lines.',
               VERDE, [0.46, 0.62, 0.54, 0.69], 'White and soft grey only.', VERDE_MUST + ['No pattern: no pentagons, no hexagons and no coloured details.'], ['Bola branca lisa, sem desenho'], 40, ref='01-cenario'),
    ])

# ---------------------------------------------------------------- 05 casa da família (roupa civil)
CENAS['05-casa-familia'] = dict(
    nome='Em casa com a família', original='08-casa-familia', clothing='casual',
    ficha='''Camera: at seated eye level, about two metres behind the player, looking straight at the sofa.
Light: early evening; warm, cosy light from a switched-on floor lamp and the last daylight through the window; soft shadows pointing slightly to the right.
Palette: navy blue, concrete grey, off-white, muted beige and natural tones; warm yellow or gold only on the warm light of the floor lamp. Magenta appears only on the player's shirt. There is no cyan anywhere. No purple, no neon.
Placement map (fractions of the canvas): the sofa with the family seated on it is centred, between x 14% and 86% and y 26% and 54%; the coffee table is in front of the sofa, between x 34% and 66% and y 52% and 60%; the floor lamp stands on the left, at x 6% to 14%; the shelf with picture frames is on the right wall, between x 82% and 98% and y 14% and 40%; the window with a curtain is on the back wall above the sofa, between x 34% and 66% and y 6% and 24%; the player sits on a wooden stool in the foreground, horizontally centred, head top at 30% and the seat of the stool at 60%.
The lower 40% of the canvas is calm and dark: the living-room floor fading into deep navy shadow, with no objects, because interface panels go over that area.''',
    camadas=[
        camada('01-cenario', 'cenario', 'Sala de casa, sem sofá e sem ninguém',
               'The modest living room of a Brazilian family home, in the early evening, seen from the middle of the room. A small coffee table with a coffee pot and plain cups, a floor lamp switched on, a shelf with a few plain picture frames whose pictures are too blurred to read, and a window with a curtain, all positioned exactly as in the placement map. There is NO sofa in this image: the wall behind the coffee table is bare apart from the window. The room is completely empty of people.',
               None, None,
               'Warm yellow or gold only on the warm light of the floor lamp; no magenta and no cyan anywhere.',
               CENARIO_MUST + ['No sofa, no stool and no chairs.', 'The open area between x 14% and 86%, from y 26% to y 52%, shows only the wall and the window: leave it free for the sofa.'],
               ['Sala sem sofá e sem ninguém', 'Mesinha com bule e xícaras', 'Abajur ligado, estante com porta-retratos borrados', 'Faixa de baixo escura e vazia'], 0),
        camada('02-fixo-sofa-com-a-familia', 'fixo', 'Sofá com a família sentada',
               'A simple sofa with three people seated on it, seen from the front: his mother and father, both in their fifties, smiling, in plain everyday clothes in muted beige, grey and navy, and a younger sister of about twelve sitting on the arm of the sofa. The sofa and the people are one element. No one stands, and the people look at the camera.',
               VERDE, [0.14, 0.26, 0.86, 0.54], 'Muted beige, grey and navy clothes; a plain sofa in a muted warm tone. No magenta and no cyan.',
               VERDE_MUST + ['No text or pictures on any clothes.'], ['Mãe, pai e irmã de 12 anos no sofá, juntos na mesma imagem', 'Roupas lisas em bege, cinza e azul-marinho', 'Todos de frente, sorrindo'], 10, ref='01-cenario'),
        *jogador('05-casa-familia', '04-jogador-no-banquinho',
                 'He is seated on a wooden stool in the foreground, in the centre of the frame, with his back to the camera, sitting upright and relaxed, facing his family. The stool is part of this image (a plain wooden stool with four legs); the player and the stool are one element.',
                 'He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue tracksuit trousers and plain white trainers. He wears nothing over the shirt: no jacket, no backpack, no bag strap. There is no cyan anywhere in the image. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no hair, no object).',
                 [0.34, 0.28, 0.66, 0.70],
                 'Magenta only on the shirt; trousers dark navy blue; trainers white. Skin medium brown, hair dark brown.', ['Camisa magenta lisa, calça azul-marinho, tênis branco', 'Banquinho de madeira junto na imagem', 'Nenhum ciano']),
    ])


def ficha_bloco(cena):
    return f'''SCENE SHEET (identical in every layer of this scene — it keeps the layers consistent with each other)
{cena['ficha']}
'''


def prompt_bloco(cena, c):
    partes = [SIZE, '', STYLE, '', ficha_bloco(cena).rstrip('\n'), '', 'THIS LAYER', c['o_que']]
    if c['fundo']:
        partes += ['', c['fundo'], '', 'PLACEMENT FOR THIS LAYER',
                   f'The element(s) of this layer stand where the placement map above says, inside the box from x {round(c["alvo"][0]*100)}% to x {round(c["alvo"][2]*100)}% and from y {round(c["alvo"][1]*100)}% to y {round(c["alvo"][3]*100)}% of the canvas, and nowhere else. Everything outside that box is empty green. At least 3% of empty green on each side of the box.']
    else:
        partes += ['', 'BACKGROUND', 'This is the full background plate: the whole canvas is painted, with no green key colour anywhere.']
    partes += ['', 'COLOUR PLAN', '- ' + c['cores'], '- Everything uses the palette of the scene sheet. No other bright colour.']
    partes += ['', 'MUST NOT APPEAR'] + ['- ' + m for m in c['must'] + MUST]
    return '```\n' + '\n'.join(partes) + '\n```'


def md_camada(cena_id, cena, c):
    ref = f'\n**Referência opcional:** anexe `{c["ref"]}/imagem.jpeg` e acrescente no fim do prompt: `Use the attached image only as a reference for the camera, the light, the scale and the painting style. Do not copy its content.`\n' if c['ref'] else ''
    nota = f'\n**Atenção:** {c["nota"]}\n' if c['nota'] else ''
    chk = ''.join(f'- [ ] {x}\n' for x in c['checks'])
    return f'''# {cena["nome"]} — camada {c["pasta"]}: {c["titulo"]}

{HEAD}
**Papel na montagem:** {c["papel"]} (ordem z {c["z"]}). **Cena de origem:** `docs/arte/cenas/{cena["original"]}`.
{ref}{nota}
**Como gerar:** abra uma conversa nova e gere do zero com o prompt abaixo. Salve nesta pasta como `imagem.jpeg`.

## Prompt

{prompt_bloco(cena, c)}

{TAIL}
## Conferência (para você)

{chk}'''


def readme_cena(cena_id, cena):
    linhas = '\n'.join(f'| {i} | `{c["pasta"]}` | {c["papel"]} | {c["titulo"]} |' for i, c in enumerate(cena['camadas'], 1))
    ordem = [c['pasta'] for c in cena['camadas'] if c['papel'] == 'cenario'] + [c['pasta'] for c in cena['camadas'] if c['papel'] == 'jogador' and c['pasta'].endswith('curto')] + \
            [c['pasta'] for c in cena['camadas'] if c['papel'] == 'jogador' and c['pasta'].endswith('coque')] + \
            [c['pasta'] for c in cena['camadas'] if c['papel'] not in ('cenario', 'jogador')]
    ordem_txt = '\n'.join(f'{i}. `{p}`' for i, p in enumerate(ordem, 1))
    return f'''# Teste de cena por camadas — {cena["nome"]}

Cena de comparação no jogo: `docs/arte/cenas/{cena["original"]}` (corte curto).
Roupa do jogador: {'camisa de clube (magenta) e calção e meiões (ciano), trocados por código' if cena['clothing'] == 'kit' else 'camisa de clube (magenta) com calça e tênis civis; a camisa troca por código'}.

## Camadas

| # | Pasta | Papel | O que é |
|--:|---|---|---|
{linhas}

## Ordem para gerar
{ordem_txt}

Cada camada vem com a mesma **ficha da cena** (câmera, luz, mapa de posições); por isso o código consegue empilhar sem ajuste manual de escala.

## Ficha da cena
{cena['ficha']}

## Depois de gerar
Avise; eu junto as camadas (`montagem.json`), aplico o uniforme de 4 clubes e 2 tons de pele por código e preencho `avaliacao.md` com você.
'''


def avaliacao(cena):
    return f'''# Avaliação — {cena["nome"]} (camadas × cena atual)

Compare a cena montada com `docs/arte/cenas/{cena["original"]}/curto`. Nota de 1 (pior) a 5 (melhor), para cada um. Marque também quem ganha.

| Critério | Cena atual | Camadas | Quem ganha |
|---|--:|--:|---|
| Acabamento pintado (a imagem parece boa?) | | | |
| Jogador integrado (luz, sombra, borda; não parece recortado) | | | |
| Mesmo corpo nos dois cabelos (curto e coque) | | | |
| Uniforme de 4 clubes sem vazamento nem emenda | | | |
| Cena conta a história (tem todos os elementos) | | | |

## Esforço e custo (registre uma linha por camada)

| Camada | Tentativas | Minutos de intervenção humana | Custo (R$ ou US$) | Motivo de rejeição (das tentativas descartadas) |
|---|--:|--:|--:|---|
''' + '\n'.join(f'| `{c["pasta"]}` | | | | |' for c in cena['camadas']) + f'''

Meta de esforço: no máximo {len(cena["camadas"]) + 3} tentativas no total para aprovar todas as camadas.

## Verificações objetivas (marque depois de rodar o compositor)
- [ ] Pixels idênticos fora da região editada (no arquivo de trabalho, antes do WebP com perdas).
- [ ] Máscaras sem vazamento em céu, torcida ou adversários.
- [ ] Calção e meiões independentes.
- [ ] Padrão do uniforme aplicado só nas regiões previstas.
- [ ] Dimensões e canais iguais ao contrato (`docs/arte/contrato-de-dimensoes.md`).
- [ ] Alerta de OCR ou de logotipo: nenhum (filtro de risco, não certificação).

## Leitura a 360 px (largura de celular)
- [ ] O cabelo é distinguível. - [ ] A camisa preta conserva volume. - [ ] A pele clara conserva contorno. - [ ] O jogador sentado ou parado está integrado ao objeto.

**Melhoria real?** Sim, se as camadas empatam ou ganham em 4 dos 5 critérios e nenhum cai abaixo de 3.
**Observações:**
'''


def readme_geral():
    linhas = []
    for cid, c in CENAS.items():
        nomes = ', '.join(x['pasta'] for x in c['camadas'])
        linhas.append(f'| `{cid}` | {c["nome"]} | {len(c["camadas"])} | {nomes} |')
    total = sum(len(c['camadas']) for c in CENAS.values())
    return f'''# Testes de cenas por camadas (SPEC v2.99)

**Objetivo:** descobrir se montar cada cena em camadas (cenário, elementos fixos, figurantes, jogador e objetos) dá imagens melhores e mais flexíveis do que gerar a cena inteira de uma vez.
São **5 cenas de tipos diferentes** e **{total} camadas** no total. Cada camada tem `prompt.md`; salve a imagem na mesma pasta como `imagem.jpeg`.

| Cena | Tipo | Camadas | Pastas |
|---|---|--:|---|
{chr(10).join(linhas)}

**Por que estas cinco:** treino (corrida), estádio (muita gente), vestiário (jogador sentado, interação), pênalti (goleiro) e casa da família (roupa civil).

## Regras que valem para tudo
- Mesma tela em todas as camadas: 4:5, 1856×2304.
- Cada cena tem uma **ficha** (câmera, luz, paleta, mapa de posições) colada **igual** nos prompts da cena.
- Elementos soltos: **fundo verde chapado #00B140**, sem chão e sem sombra (a sombra eu faço por código).
- O jogador sai de costas, com **camisa magenta e calção e meiões ciano**, em dois formatos de cabelo: **curto** e **coque**. Pele marrom e cabelo castanho-escuro de propósito (o código recolore pele e cor do cabelo).
- Onde jogador e objeto se tocam (banco, banquinho, sofá), os dois saem na mesma camada.
- Nada de texto, logos, escudos, patrocínio, rosto do jogador ou pessoa real.

## Como gerar (por cena)
1. Gere o **cenário** primeiro.
2. Gere o **jogador de cabelo curto** anexando o cenário como referência de câmera, luz e escala.
3. Gere o **coque** anexando o jogador curto (instrução dentro do arquivo).
4. Gere os **fixos, figurantes e objetos**, anexando o cenário como referência.
5. Salve cada um como `imagem.jpeg` na própria pasta e avise.

## Como vamos decidir se houve melhoria real
Para cada cena eu monto as camadas (`montagem.json`: posição, escala e ordem), aplico 4 uniformes da Série A e 2 tons de pele, e preenchemos juntos `avaliacao.md`:
acabamento, integração do jogador, mesmo corpo nos dois cabelos, uniforme sem vazamento, história da cena. **Melhoria real** = empata ou ganha em 4 de 5 critérios, sem nota abaixo de 3, com esforço razoável.

## Observação sobre a montagem
Cada camada traz o alvo (caixa em frações da tela). Eu ajusto automaticamente escala e posição de cada elemento para a caixa; o `montagem.json` guarda isso. Nada disso muda o jogo.
'''


def montagem(cena_id, cena):
    return {
        'cena': cena_id, 'comparacao': f"docs/arte/cenas/{cena['original']}", 'tela': [1856, 2304],
        'nota': 'alvo = caixa [x0, y0, x1, y1] em frações da tela onde o elemento deve ficar (o código ajusta escala e posição a ela); null = tela inteira. z = ordem de baixo para cima.',
        'camadas': [{'pasta': c['pasta'], 'papel': c['papel'], 'z': c['z'], 'fundo': 'verde #00B140' if c['fundo'] else 'cena', 'alvo': c['alvo']} for c in sorted(cena['camadas'], key=lambda c: c['z'])],
    }


def gerar(saida):
    os.makedirs(saida, exist_ok=True)
    with open(os.path.join(saida, 'README.md'), 'w', encoding='utf-8') as f:
        f.write(readme_geral())
    total = 0
    for cid, cena in CENAS.items():
        for c in cena['camadas']:
            pasta = os.path.join(saida, cid, c['pasta'])
            os.makedirs(pasta, exist_ok=True)
            with open(os.path.join(pasta, 'prompt.md'), 'w', encoding='utf-8') as f:
                f.write(md_camada(cid, cena, c))
            total += 1
        base = os.path.join(saida, cid)
        with open(os.path.join(base, 'README.md'), 'w', encoding='utf-8') as f:
            f.write(readme_cena(cid, cena))
        with open(os.path.join(base, 'avaliacao.md'), 'w', encoding='utf-8') as f:
            f.write(avaliacao(cena))
        with open(os.path.join(base, 'montagem.json'), 'w', encoding='utf-8') as f:
            json.dump(montagem(cid, cena), f, ensure_ascii=False, indent=1)
            f.write('\n')
    return total


if __name__ == '__main__':
    saida = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'testes-de-cenas')
    print('ok', gerar(saida), 'camadas em', os.path.relpath(saida, os.getcwd()))
