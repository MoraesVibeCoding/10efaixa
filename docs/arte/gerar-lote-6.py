"""Gera os prompt.md do lote 6 da arte: marcos da carreira (SPEC v2.29, 6.13b) e papel em campo (v2.28, 6.2).
Rode: python3 docs/arte/gerar-lote-6.py

Reaproveita as funções e os textos de gerar-lotes-3-5.py (estilo, figurinos, plano de cores, cortes) sem rodar
a parte dele que escreve arquivos: os lotes 1 a 5 e as imagens não são tocados.
Escreve:
  cenas/<NN-nome>/<corte>/prompt.md e cenas/<NN-nome>/prompt-6-cortes.md
  cenas-goleiro/<NN-nome>/<corte>/prompt.md e cenas-goleiro/<NN-nome>/prompt-6-cortes.md
  nanobanana-lote6/NNN_<grupo>_<cena>_<corte>.md  (um arquivo por foto que ainda não tem imagem.jpeg)
"""
import glob
import os
import types

HERE = os.path.dirname(os.path.abspath(__file__))
BASE_SCRIPT = os.path.join(HERE, 'gerar-lotes-3-5.py')
OUT_NB = os.path.join(HERE, 'nanobanana-lote6')


def load_base():
    """Carrega só as definições de gerar-lotes-3-5.py.

    O script antigo escreve os arquivos dos lotes 3 a 5 no nível do módulo (a partir de `n = 0`). Um import comum
    reescreveria esses prompts; por isso o código é cortado nesse ponto e só a parte de definições é executada."""
    src = open(BASE_SCRIPT, encoding='utf-8').read()
    marker = '\nn = 0\n'
    assert src.count(marker) == 1, 'gerar-lotes-3-5.py mudou: ajuste o ponto de corte em load_base()'
    mod = types.ModuleType('lotes_3_5')
    mod.__file__ = BASE_SCRIPT
    exec(compile(src[:src.index(marker)], BASE_SCRIPT, 'exec'), mod.__dict__)
    return mod


B = load_base()
CUTS, STADIUM, OPP = B.CUTS, B.STADIUM, B.OPP

TEAM_GK = 'in plain magenta shirts, cyan shorts and cyan socks, with blank shirts'
ARMBAND = ("On his LEFT upper arm he wears a plain bright yellow (#FFC21A) captain's armband: a simple smooth band "
           "around the sleeve, with no letter, no symbol and nothing printed on it. It sits on the outside of the arm, "
           "seen from the side, and does not cover any part of the back of the shirt.")
ARMBAND_COLOUR = ["Bright yellow (#FFC21A) appears in one place only: the plain captain's armband on his left upper arm."]
ARMBAND_MUST = ['The armband has no letter, no text, no symbol and no stripes: it is plain yellow.',
                "Nobody's hand or arm is on the back of the main character."]
TROPHY = ('a simple gold cup of original design: a round bowl with two curved handles, a short stem and a square dark '
          'base, like a generic sports-day trophy')
TROPHY_MUST = ['The trophy is a generic cup of original design and does not copy any real trophy.']
INVENTED_STADIUM = ['The stadium is invented and does not copy any real stadium.']

# ---------------------------------------------------------------- lote 6: marcos da carreira e papel em campo
LOTE6 = [
    dict(folder='26-estreia', nome='Estreia', clothing='kit', gk=True,
         usada='Marco: estreia profissional, estreia no clube novo e estreia na Seleção (primeira entrada em campo).',
         setting="The players' tunnel of a large football stadium at night, seen from inside, at the moment the teams walk out. Plain concrete walls and ceiling in navy shadow. At the far end, a tall rectangular opening shows the brightly floodlit pitch, a strip of green grass and a full stand.",
         pose="He has just reached the end of the tunnel and steps out onto the grass for the first time, in the centre of the frame, with his back to the camera, upright, arms relaxed at his sides, head lifted to take in the stand in front of him.",
         others="A little ahead of him, slightly out of focus, two team-mates in the same magenta-and-cyan kit jog out onto the pitch. The bright light from the pitch outlines his shoulders and hair. In the stand seen through the opening, the crowd is on its feet. " + STADIUM,
         others_gk="A little ahead of him, slightly out of focus, two team-mates " + TEAM_GK + ", jog out onto the pitch. The bright light from the pitch outlines his shoulders and hair. In the stand seen through the opening, the crowd is on its feet. " + STADIUM,
         gold='the floodlight glow coming through the opening',
         camera="The camera is inside the tunnel, at chest height, a few metres behind him, looking straight out at the bright opening.",
         floor="the concrete floor of the tunnel",
         must=['No signs, no arrows and no writing on the tunnel walls.'] + INVENTED_STADIUM,
         check=['Câmera dentro do túnel, saída iluminada à frente', 'Companheiros à frente, ninguém entre a câmera e o jogador']),
    dict(folder='27-capitao', nome='Braçadeira de capitão', clothing='kit', gk=True,
         usada='Marco: primeira braçadeira de capitão (no clube e na Seleção).',
         setting="The home dressing room of a football club, minutes before a match. Plain wooden benches along the walls, open wooden lockers with plain magenta shirts hanging on pegs, and warm white ceiling lights. Muted navy and grey walls.",
         pose="He stands in the centre of the frame, with his back to the camera, upright and still, his left arm held slightly away from his body so that an older team-mate can fasten the captain's armband around his left upper arm. His right arm hangs relaxed at his side.",
         pose_extra=ARMBAND,
         others="Standing at his LEFT side and turned towards him, seen in profile with his face half in shadow and turned down towards the armband, a veteran team-mate in his thirties in the same magenta-and-cyan kit, with short greying hair, uses both hands to close the yellow armband on the main character's left upper arm. His hands touch only the armband, at the side of the arm. Further away, slightly out of focus, three team-mates in the same kit sit on a bench lacing their boots.",
         others_gk="Standing at his LEFT side and turned towards him, seen in profile with his face half in shadow and turned down towards the armband, a veteran team-mate in his thirties wearing a plain magenta shirt, cyan shorts and cyan socks, with short greying hair, uses both hands to close the yellow armband on the goalkeeper's left upper arm, over the long rose-pink sleeve. His hands touch only the armband, at the side of the arm. Further away, slightly out of focus, three team-mates in the same magenta-and-cyan kit sit on a bench lacing their boots.",
         gold="the captain's armband; the ceiling lights are warm white",
         camera='The camera is at chest height, about two metres behind him, looking straight across the dressing room.',
         floor='the dressing-room floor',
         colour=ARMBAND_COLOUR + ['The shirts hanging in the lockers are plain magenta with nothing printed on them; they count as team shirts.'],
         must=ARMBAND_MUST + ['The veteran stands beside him, never between the camera and the back of the main character.'],
         check=['Braçadeira amarela lisa no braço esquerdo, sem "C" nem texto', 'Veterano de perfil ao lado, rosto pouco visível; mãos só na braçadeira', 'Nada cobre as costas da camisa']),
    dict(folder='28-cobranca-falta', nome='Cobrança de falta', clothing='kit',
         usada='Marco: assumir a bola parada (primeira falta como cobrador do time).',
         setting='A full football stadium at night, during a free kick about twenty-two metres from goal, slightly to the left of centre. Floodlights shine from above.',
         pose="He stands three steps behind the ball, in the centre of the frame, with his back to the camera, upright and calm, both arms relaxed at his sides, studying the wall and the goal before his run-up.",
         others="A plain white football rests on the grass a short distance in front of him. About nine metres beyond the ball, slightly out of focus, a wall of four opponents stands shoulder to shoulder, arms down. " + OPP + " Behind the wall is the goal, with a goalkeeper in a plain dark-grey kit crouched on the line, slightly to one side. " + STADIUM,
         gold='the floodlight glow',
         camera='The camera is at waist height, a few metres behind him, looking over the ball, at the wall and the goal.',
         floor='the grass',
         must=['No referee spray lines, no markings on the grass other than plain white pitch lines.'],
         check=['Bola parada à frente, barreira de 4 adversários de cinza, goleiro de cinza-escuro', 'Braços soltos ao lado do corpo']),
    dict(folder='29-final', nome='Final', clothing='kit', gk=True,
         usada='Marco: primeira final ou jogo do título (campeonato e copa).',
         setting='A packed football stadium at night, moments before the kick-off of a final. Floodlights shine from above and thin white smoke drifts across the stands. The teams are walking out along a short path of grass from the tunnel to the pitch.',
         pose="He walks away from the camera along the path towards the pitch, in the centre of the frame, with his back to the camera, upright and focused, arms relaxed at his sides, his head turned very slightly to the right towards the trophy without touching it.",
         others="A few steps ahead of him, on his right side, the trophy stands on a plain dark navy pedestal about waist high: " + TROPHY + ". Further ahead, slightly out of focus, two team-mates in the same magenta-and-cyan kit walk onto the pitch, and on the left, walking in a parallel line, two opponents. " + OPP + " " + STADIUM,
         others_gk="A few steps ahead of him, on his right side, the trophy stands on a plain dark navy pedestal about waist high: " + TROPHY + ". Further ahead, slightly out of focus, two team-mates " + TEAM_GK + ", walk onto the pitch, and on the left, walking in a parallel line, two opponents. " + OPP + " " + STADIUM,
         gold='the trophy and the floodlight glow',
         camera='The camera is at chest height, a few metres behind him, looking along the path towards the pitch and the stand.',
         floor='the grass',
         colour=['The smoke from the stands is white or light grey only: no coloured smoke.'],
         must=TROPHY_MUST + ['Nobody touches the trophy.'],
         check=['Taça genérica dourada num pedestal azul-marinho, à direita, na metade de cima', 'Taça não lembra nenhum troféu real', 'Fumaça branca, sem cor']),
    dict(folder='30-escalacao', nome='Escalação', clothing='kit',
         usada='Marco: primeira vez titular (ver o próprio lugar no quadro da escalação).',
         setting="The home dressing room of a football club, a couple of hours before a match. On the far wall hangs a large tactics board: a plain green rectangle with a simple white outline of a football pitch, and on it eleven small round white magnets and eleven small round dark-grey magnets placed in two formations. Plain magenta shirts hang on pegs on both sides of the board. Warm white ceiling lights, muted navy and grey walls.",
         pose="He stands a couple of metres in front of the board, in the centre of the frame, with his back to the camera, upright, arms relaxed at his sides, head slightly raised, looking at the board.",
         others="To the right of the board, slightly out of focus, the head coach in his fifties, in a plain dark navy tracksuit top, rests one finger on a white magnet on the board and looks at the player. On the left, further away, two team-mates in the same magenta-and-cyan kit sit on a bench.",
         gold='nothing; the ceiling lights are warm white',
         camera='The camera is at chest height, about three metres behind him, looking straight at the board.',
         position='His feet are no lower than 75% of the way down from the top edge. The whole board is above his shoulders or beside his head, never hidden behind his back.',
         floor='the dressing-room floor',
         colour=['The magnets on the board are only plain white and plain dark grey: no coloured magnets.',
                 'The shirts hanging on the pegs are plain magenta with nothing printed on them; they count as team shirts.'],
         must=['The tactics board shows only the pitch outline and the round magnets: no names, no numbers, no letters, no initials and no writing of any kind.'],
         check=['Quadro tático verde só com linhas do campo e ímãs brancos e cinza-escuro, sem texto, nome ou número', 'Camisas penduradas magenta, lisas']),
    dict(folder='31-hino', nome='Hino', clothing='kit', gk=True,
         usada='Marco: estreia na Seleção principal e primeira Copa (perfilado durante o hino).',
         setting='A full football stadium at night, during the national anthems before an international match. The teams are lined up on the pitch facing the main stand. Floodlights shine from above.',
         pose="He stands in a straight line with his team-mates, in the centre of the frame, with his back to the camera, upright and still, head slightly lifted, his right hand placed flat on the left side of his chest (in front of him, out of view) and his left arm straight down at his side.",
         others="On his left and on his right, three team-mates on each side stand in the same line, also seen from behind in the same magenta-and-cyan kit with blank shirts, each with his right hand on his chest, with a small gap between each player so that nobody touches him. In front of each player stands a young mascot child of about eight, in a plain off-white T-shirt and off-white shorts, also facing the stand; the children are smaller and further from the camera, so they never cover the backs of the players. Far to the left, slightly out of focus, the opposing team stands in its own line. " + OPP + " " + STADIUM,
         others_gk="On his left and on his right, three team-mates on each side stand in the same line, seen from behind " + TEAM_GK + ", each with his right hand on his chest, with a small gap between each player so that nobody touches him. In front of each player stands a young mascot child of about eight, in a plain off-white T-shirt and off-white shorts, also facing the stand; the children are smaller and further from the camera, so they never cover the backs of the players. Far to the left, slightly out of focus, the opposing team stands in its own line. " + OPP + " " + STADIUM,
         gold='the floodlight glow',
         camera='The camera is at chest height, a few metres behind the line of players, looking straight at the main stand.',
         floor='the grass',
         must=['No national flags, no country names, no anthem lyrics and no real tournament trophy.',
               'No arms around shoulders: nobody touches the main character.'] + INVENTED_STADIUM,
         check=['Mão direita no peito (fora da vista), braço esquerdo solto', 'Crianças de branco à frente, menores, sem cobrir as costas', 'Sem bandeira nacional']),
    dict(folder='32-exterior', nome='Estreia no exterior', clothing='kit', gk=True,
         usada='Marco: estreia no exterior (primeiro jogo num clube europeu).',
         setting='A steep, enclosed European football stadium on a freezing winter night, just before kick-off. Fine snow falls through the beams of the cold white floodlights, and a thin dusting of snow lies on the roofs of the stands and along the edges of the pitch. The grass in the middle of the pitch is green.',
         pose="He stands on the pitch near the touchline, in the centre of the frame, with his back to the camera, shoulders slightly raised against the cold, both arms close to his body, looking up at the stand as a small cloud of his breath rises in front of his head.",
         others="In the stand in front of him, slightly out of focus, the crowd is wrapped in plain light-grey coats, hats and scarves, with small clouds of breath above them. " + STADIUM + " On the pitch, small and blurred, a few team-mates in the same magenta-and-cyan kit warm up.",
         others_gk="In the stand in front of him, slightly out of focus, the crowd is wrapped in plain light-grey coats, hats and scarves, with small clouds of breath above them. " + STADIUM + " On the pitch, small and blurred, a few team-mates " + TEAM_GK + ", warm up.",
         gold='nothing; the light is cold white',
         camera='The camera is at waist height, a few metres behind him, looking up at the stand.',
         floor='the grass',
         colour=['The snow and his breath are white; the scarves and hats of the crowd are light grey with no colours and no stripes.'],
         must=['No flags of any country, no city names and no club scarves with colours or writing.'] + INVENTED_STADIUM,
         check=['Neve fina e respiração visível', 'Torcida de cinza, cachecóis lisos', 'Faixa de baixo escura mesmo com neve']),
    dict(folder='33-prancheta', nome='Prancheta do técnico', clothing='kit',
         usada='Papel em campo: o técnico propõe um novo papel ("quero você mais recuado") e a reunião sobre a função.',
         setting="The training ground of a football club on an overcast morning, at the edge of the pitch. A well-kept grass pitch, a low wire fence, a few trees and a small empty concrete stand in the distance.",
         pose="He stands in the centre of the frame, with his back to the camera, upright, arms relaxed at his sides, head tilted slightly down towards the clipboard the coach is showing him.",
         others="Facing him, about one metre in front of him and slightly to the right, stands the head coach, a man in his fifties in a plain dark navy tracksuit with no badge, holding up a plain clipboard at chest height and turned towards the player, pointing at it with a pen. On the clipboard is a simple drawing of half a pitch with a few circles and curved arrows in black marker. Further away, slightly out of focus, four team-mates in the same magenta-and-cyan kit pass a plain white football to each other.",
         gold='nothing; the light is soft overcast daylight',
         camera='The camera is at chest height, about two metres behind him, looking past his right shoulder at the coach and the clipboard.',
         floor='the grass',
         colour=['The clipboard is plain light grey and the sheet is white with black lines only.'],
         must=['The clipboard drawing has only lines, circles and arrows: no letters, no numbers, no names and no writing of any kind.',
               "The coach's tracksuit has no badge, no crest, no stripes and no initials."],
         check=['Prancheta só com setas e círculos, sem texto', 'Técnico de agasalho azul-marinho liso', 'Prancheta visível ao lado do jogador, sem cobrir as costas']),
    dict(folder='34-assistencia', nome='Assistência', clothing='kit',
         usada='Marco: primeira assistência (o companheiro comemora o gol com quem deu o passe).',
         setting='A full football stadium at night, two seconds after a goal. Floodlights shine from above.',
         pose="He stands in the centre of the frame, with his back to the camera, both arms raised at shoulder height and spread out to the sides with open hands, ready to receive the team-mate who is running to him.",
         others="Two steps in front of him and facing him, a team-mate in the same magenta-and-cyan kit, the scorer, runs towards him with his arms wide open and a big smile, about to hug him; at this moment his hands have not reached the main character yet. Further back, slightly out of focus, the goal: the plain white football rests in the back of the net and a goalkeeper in a plain dark-grey kit sits on the grass. Two more team-mates in the same kit run in from the left. " + STADIUM,
         gold='the floodlight glow',
         camera='The camera is at waist height, a few metres behind him, looking towards the goal.',
         floor='the grass',
         must=["Nobody's hand or arm is on the back of the main character: the hug has not happened yet.",
               'The scorer is an original fictional person who does not resemble any real player.'],
         check=['Companheiro de frente correndo para abraçar, ainda sem encostar', 'Braços abertos para os lados, sem cobrir as costas', 'Bola na rede e goleiro adversário de cinza-escuro']),
]


def for_kind(s, goleiro):
    """Monta a cena final: o goleiro troca o figurino, os companheiros descritos e a referência ao gesto."""
    s = dict(s)
    if goleiro:
        s['clothing'] = 'gk'
        s['others'] = s.get('others_gk', s['others'])
        s['usada'] = s['usada'].rstrip('.') + ', quando o jogador é goleiro.'
    if s.get('pose_extra'):
        s['pose'] = s['pose'] + '\n' + s['pose_extra']
    return s


SCENES = [('cenas', for_kind(s, False)) for s in LOTE6] + \
         [('cenas-goleiro', for_kind(s, True)) for s in LOTE6 if s.get('gk')]


def write(path, text):
    full = os.path.join(HERE, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(text)


def nanobanana_md(n, rel, cut, block):
    """Mesmo formato de gerar-nanobanana.py: um arquivo por foto, só com o prompt."""
    ref = ("\nOpcional: anexe `cenas/04-penalti/%s/imagem.jpeg` e acrescente no fim do prompt: `Use the attached image "
           "only as a reference for the painting style and for the player's hair. Do not copy its scene.`\n" % cut)
    return (f"# {n:03d} — {rel}\n\nNano Banana 2: conversa nova, cole o prompt abaixo e gere **uma** imagem na maior "
            f"resolução (formato indicado no prompt).{ref}\nSalve como `{rel}/imagem.jpeg`.\n\n## Prompt\n\n```\n{block}\n```\n")


def main():
    n = 0
    for base, s in SCENES:
        for cut in CUTS:
            write(f"{base}/{s['folder']}/{cut}/prompt.md", B.scene_md(s, cut, goleiro=(base == 'cenas-goleiro'))); n += 1
        write(f"{base}/{s['folder']}/prompt-6-cortes.md", B.batch_md(s)); n += 1

    # um .md por foto que ainda falta; a pasta é só deste lote, então os arquivos antigos dela são refeitos
    os.makedirs(OUT_NB, exist_ok=True)
    for old in glob.glob(os.path.join(OUT_NB, '*.md')):
        os.remove(old)
    k = 0
    for base, s in SCENES:
        for cut in CUTS:
            rel = f"{base}/{s['folder']}/{cut}"
            if os.path.exists(os.path.join(HERE, rel, 'imagem.jpeg')):
                continue
            k += 1
            block = B.scene_prompt(s, cut).strip('`').strip()
            with open(os.path.join(OUT_NB, f"{k:03d}_{base}_{s['folder']}_{cut}.md"), 'w', encoding='utf-8') as f:
                f.write(nanobanana_md(k, rel, cut, block))
    print(n, 'prompts em cenas/ e cenas-goleiro/;', k, 'arquivos em', os.path.relpath(OUT_NB, os.getcwd()))


if __name__ == '__main__':
    main()
