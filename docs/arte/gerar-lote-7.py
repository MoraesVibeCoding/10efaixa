"""Gera os prompt.md do lote 7 da arte: cenas que as decisões pedem e o catálogo ainda não tem (auditoria das cenas, SPEC v2.94).
Rode: python3 docs/arte/gerar-lote-7.py

Reaproveita as funções e os textos de gerar-lotes-3-5.py (estilo, figurinos, plano de cores, cortes) sem rodar a parte dele que
escreve arquivos, do mesmo jeito que gerar-lote-6.py: os lotes 1 a 6 e as imagens não são tocados. Só jogador de linha (o goleiro
fica para depois). Escreve:
  cenas/<NN-nome>/<corte>/prompt.md e cenas/<NN-nome>/prompt-6-cortes.md
  nanobanana-lote7/NNN_<grupo>_<cena>_<corte>.md  (um arquivo por foto que ainda não tem imagem.jpeg)
"""
import glob
import os
import types

HERE = os.path.dirname(os.path.abspath(__file__))
BASE_SCRIPT = os.path.join(HERE, 'gerar-lotes-3-5.py')
OUT_NB = os.path.join(HERE, 'nanobanana-lote7')


def load_base():
    """Carrega só as definições de gerar-lotes-3-5.py (o código dele que escreve arquivos começa em `n = 0`)."""
    src = open(BASE_SCRIPT, encoding='utf-8').read()
    marker = '\nn = 0\n'
    assert src.count(marker) == 1, 'gerar-lotes-3-5.py mudou: ajuste o ponto de corte em load_base()'
    mod = types.ModuleType('lotes_3_5')
    mod.__file__ = BASE_SCRIPT
    exec(compile(src[:src.index(marker)], BASE_SCRIPT, 'exec'), mod.__dict__)
    return mod


B = load_base()
CUTS, STADIUM, OPP = B.CUTS, B.STADIUM, B.OPP

# ---------------------------------------------------------------- lote 7: cenas que faltam para as decisões
LOTE7 = [
    dict(folder='35-escola', nome='Escola', clothing='casual',
         usada='Decisão entre a prova da escola e o treino; a família cobra o boletim.',
         setting="A school classroom in the late morning. Rows of plain wooden desks and chairs, a large plain green chalkboard on the front wall with nothing written on it, and tall windows letting in soft daylight. Pale walls and a wooden floor.",
         pose="He sits at a desk in the middle of the room, in the centre of the frame, with his back to the camera, sitting upright, his right hand holding a plain pencil over a blank sheet of paper on the desk, his head slightly bowed towards the sheet.",
         others="At the front, slightly out of focus, a teacher in a plain dark-green cardigan stands beside the chalkboard with a plain closed book in one hand, watching the class. In the rows around him, two other students in plain light-grey tops sit at their desks, also bent over blank sheets.",
         gold='the daylight coming through the windows',
         camera='The camera is at seated eye level, about two metres behind him, looking towards the chalkboard.',
         position='His head is no lower than 55% of the way down from the top edge.', floor='the wooden floor',
         must=['The chalkboard, the papers and the walls are completely blank: no writing, no drawings, no numbers and no school emblem.'],
         check=['Lousa, folhas e paredes em branco', 'Professor de cardigã verde-escuro liso']),
    dict(folder='36-nutricionista', nome='Nutricionista', clothing='casual',
         usada='Dieta, rotina de alimentação e cuidado com o corpo.',
         setting="A nutritionist's office at a football club, in bright daylight. A plain light-wood desk, a small plain bookshelf with a few plain books, a potted green plant and a wide window. Pale walls and a light floor.",
         pose="He sits in a chair in front of the desk, in the centre of the frame, with his back to the camera, sitting upright, both hands resting on his knees, his head turned slightly towards the desk.",
         others="Across the desk, slightly out of focus, the nutritionist, a woman in a plain white coat, holds a blank sheet of paper and looks at him. On the desk between them is a plain white plate with green vegetables, an orange and slices of banana.",
         gold='the banana and the daylight through the window',
         camera='The camera is at seated eye level, about two metres behind him, looking at the desk and the window.',
         position='His head is no lower than 55% of the way down from the top edge.', floor='the light floor',
         colour=['Food and plants use only natural green, orange and pale yellow: no pink, no purple and no cyan food.'],
         must=['The sheet of paper, the books and the walls have no text, no charts and no numbers.', 'No brand or label on any food or object.'],
         check=['Nutricionista de jaleco branco liso', 'Prato com legumes, laranja e banana', 'Folha em branco']),
    dict(folder='37-grade-do-tunel', nome='Grade do túnel', clothing='kit',
         usada='Encontro com um torcedor mirim antes do jogo; gestos de carinho e fama.',
         setting="The entrance of the players' tunnel of a football stadium on a late afternoon, just before a match. A tall metal railing runs along the side of the tunnel mouth, and behind it a small crowd of fans waits. Warm low sun on the stand outside, concrete walls in navy shadow inside.",
         pose="He stands in the mouth of the tunnel, in the centre of the frame, with his back to the camera, upright, slightly turned towards the railing on his right side, one hand reaching out towards it without touching anything.",
         others="Behind the railing, slightly out of focus, a small boy of about eight in an old, plain light-grey football shirt with nothing on it looks up at him with a big smile, and his father stands behind him filming with a phone held at chest height. A security guard in a plain dark-grey jacket stands at the side with one arm half raised. One team-mate in the same magenta-and-cyan kit waits further inside the tunnel.",
         gold='the low afternoon sun on the stand outside',
         camera='The camera is inside the tunnel, at chest height, a few metres behind him, looking out at the railing and the stand.',
         floor='the concrete floor of the tunnel',
         must=['No signs, no arrows and no writing on the walls, the railing or the boy\'s shirt.', 'The stadium is invented and does not copy any real stadium.',
               "Nobody's hand or arm is on the back of the main character."],
         check=['Menino de camisa cinza lisa atrás da grade', 'Pai filmando, segurança de jaqueta cinza-escura', 'Nenhuma mão nas costas do jogador']),
    dict(folder='38-gramado-chuva', nome='Gramado na chuva', clothing='kit',
         usada='Jogo em gramado ruim, chuva forte e bola que não rola.',
         setting="A football stadium in the afternoon under heavy rain. The sky is low and dark grey, the floodlights are on, and the pitch is soaked: puddles of brown water and patches of mud on the grass, with a thin mist rising from the ground.",
         pose="He stands on the pitch, in the centre of the frame, with his back to the camera, feet apart in the mud, both hands on his hips, his head tilted down to look at a plain white football that sits half buried in a puddle at his feet.",
         others="Ahead of him, slightly out of focus, two team-mates in the same magenta-and-cyan kit, their shirts and shorts soaked and splashed with mud, jog on the spot. In the far stand, a few spectators sit under plain light-grey umbrellas. " + OPP,
         gold='the floodlight glow',
         camera='The camera is at waist height, a few metres behind him, looking up the pitch through the rain.',
         floor='the wet, muddy grass',
         colour=['The rain, the mist and the puddles are grey, brown or white only; the shirt and shorts stay clearly magenta and cyan.'],
         must=['No text in the puddles or on the pitch markings.', 'The stadium is invented and does not copy any real stadium.'],
         check=['Chuva e lama, camisa ainda magenta e calção ainda ciano', 'Bola meio afundada na poça', 'Guarda-chuvas cinza lisos']),
    dict(folder='39-centro-de-treinamento', nome='Portão do centro de treinamento', clothing='casual',
         usada='Visita do ex-treinador da base e encontros na entrada do clube.',
         setting="The entrance of a football club's training centre on an early morning. A low modern building with a wide glass door, a short paved path, a few small trees, and training pitches visible in the distance, under a pale sky.",
         pose="He stands on the paved path in front of the glass door, in the centre of the frame, with his back to the camera, upright, arms relaxed at his sides, looking at the older man in front of him.",
         others="In front of him, slightly out of focus, an older man in a plain flat cap and a plain dark-brown jacket stands by the door, smiling and lifting one hand in a small wave. Further away, small figures in plain training tops run on the distant pitches.",
         gold='the early morning sun',
         camera='The camera is at chest height, a few metres behind him, looking at the door and the older man.',
         floor='the paved path',
         must=['No signs, no letters, no crest and no writing on the building, the door or the walls.', 'The older man is an original fictional person who does not resemble any real coach.'],
         check=['Senhor de boné liso e jaqueta marrom-escura', 'Portão de vidro sem placa nem texto']),
]


def write(path, text):
    full = os.path.join(HERE, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(text)


def nanobanana_md(n, rel, cut, block):
    """Mesmo formato de gerar-lote-6.py: um arquivo por foto, só com o prompt."""
    ref = ("\nOpcional: anexe `cenas/04-penalti/%s/imagem.jpeg` e acrescente no fim do prompt: `Use the attached image "
           "only as a reference for the painting style and for the player's hair. Do not copy its scene.`\n" % cut)
    return (f"# {n:03d} — {rel}\n\nNano Banana 2: conversa nova, cole o prompt abaixo e gere **uma** imagem na maior "
            f"resolução (formato indicado no prompt).{ref}\nSalve como `{rel}/imagem.jpeg`.\n\n## Prompt\n\n```\n{block}\n```\n")


def main():
    n = 0
    for s in LOTE7:
        for cut in CUTS:
            write(f"cenas/{s['folder']}/{cut}/prompt.md", B.scene_md(s, cut)); n += 1
        write(f"cenas/{s['folder']}/prompt-6-cortes.md", B.batch_md(s)); n += 1
    os.makedirs(OUT_NB, exist_ok=True)
    for old in glob.glob(os.path.join(OUT_NB, '*.md')):
        os.remove(old)
    k = 0
    for s in LOTE7:
        for cut in CUTS:
            rel = f"cenas/{s['folder']}/{cut}"
            if os.path.exists(os.path.join(HERE, rel, 'imagem.jpeg')):
                continue
            k += 1
            block = B.scene_prompt(s, cut).strip('`').strip()
            with open(os.path.join(OUT_NB, f"{k:03d}_cenas_{s['folder']}_{cut}.md"), 'w', encoding='utf-8') as f:
                f.write(nanobanana_md(k, rel, cut, block))
    print(n, 'prompts em cenas/;', k, 'arquivos em', os.path.relpath(OUT_NB, os.getcwd()))


if __name__ == '__main__':
    main()
