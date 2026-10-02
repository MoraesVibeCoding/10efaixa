"""Gera os prompt.md dos lotes 3, 4 e 5 da arte (SPEC v2.13). Rode: python3 docs/arte/gerar-lotes-3-5.py
Os lotes 1 e 2 foram escritos e ajustados à mão; este script não toca neles."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))

CUTS = {
    'curto': ('Curto', 'short curly dark-brown hair, cut close to the head'),
    'cacheado-medio': ('Cacheado médio', 'medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck'),
    'liso-medio': ('Liso médio', 'medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck'),
    'cacheado-grande': ('Cacheado grande', 'long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there'),
    'liso-grande': ('Liso grande', 'long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there'),
    'careca': ('Careca', 'a completely shaved, smooth bald head with no hair at all'),
}

HEAD = '''> **INSTRUCTIONS FOR THE ASSISTANT — READ FIRST**
> Start from a clean slate. Clear and ignore everything from earlier in this conversation and from any previous conversation: earlier prompts, earlier images, earlier styles and earlier corrections. Use only what is written in this file.
> Then generate one image following the section "Prompt" below. The sections in Portuguese are notes for the human reviewer and are not part of the request.
'''
TAIL = '''> **AFTER GENERATING — FINAL STEP**
> Save the generated image to Google Drive, in the same folder where this file is stored, with the file name `imagem.jpeg`. If you cannot save to Drive yourself, say so clearly and show the image so that the user can save it to that folder manually.
'''
STYLE = '''STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.'''

CLOTHING = {
    'kit': 'He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.',
    'casual': 'He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue tracksuit trousers and plain white trainers. He wears nothing over the shirt: no jacket, no backpack, no bag strap.',
    'casual-shorts': 'He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue shorts and plain white trainers. He wears nothing over the shirt.',
    'gk': 'He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.',
}
BACK = {
    'kit': 'magenta', 'casual': 'magenta', 'casual-shorts': 'magenta', 'gk': 'rose-pink',
}
COLOUR = {
    'kit': ['Magenta appears in one place only: the shirts of the player and of his team-mates.',
            'Cyan appears in one place only: the shorts and socks of the player and of his team-mates.',
            'Boots are plain black.'],
    'casual': ['Magenta appears in one place only: the shirt of the player.',
               'There is no cyan anywhere in the image.',
               'His trousers are dark navy blue and his trainers are white.'],
    'casual-shorts': ['Magenta appears in one place only: the shirt of the player.',
                      'There is no cyan anywhere in the image.',
                      'His shorts are dark navy blue and his trainers are white.'],
    'gk': ['Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.',
           'Vivid orange appears in one place only: the goalkeeper gloves.',
           'Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.',
           'Boots are plain black.'],
}


def scene_prompt(s, cut):
    nome, hair = CUTS[cut]
    c = s['clothing']
    colour = COLOUR[c] + s.get('colour', []) + [
        f"Warm yellow or gold appears only on: {s['gold']}.",
        'Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.',
    ]
    must = ['No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.',
            'No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.',
            'No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.',
            'No watermark or signature, and no interface elements, frames or borders.',
            'The face of the main character is not visible: he is seen from behind.',
            'Every person is an original fictional character who does not resemble any real person.'] + s.get('must', [])
    return f'''```
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

{STYLE}

SETTING
{s['setting']}

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, {hair}, and an athletic build.
{s['pose']}

CLOTHING
{CLOTHING[c]}

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the {BACK[c]} shirt is fully visible to the camera: one smooth, flat, evenly lit {BACK[c]} surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
{s['others']}

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
''' + '\n'.join('- ' + x for x in colour) + f'''

COMPOSITION - follow these positions
- Vertical 4:5. {s['camera']}
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. {s.get('position', 'His feet are no lower than 75% of the way down from the top edge.')}
- The lower 40% of the image is calm and dark: {s.get('floor', 'the ground')} fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
''' + '\n'.join('- ' + x for x in must) + '\n```'


def scene_md(s, cut, goleiro=False):
    nome, _ = CUTS[cut]
    kit_check = {
        'kit': '- [ ] Magenta só nas camisas; ciano só em calções e meiões; chuteiras pretas',
        'casual': '- [ ] Camisa magenta, calça azul-marinho, tênis branco; nenhum ciano na imagem',
        'casual-shorts': '- [ ] Camisa magenta, calção azul-marinho, tênis branco; nenhum ciano na imagem',
        'gk': '- [ ] Goleiro de rosa (#F0569B), manga longa, luvas laranja; companheiros de magenta e ciano',
    }[s['clothing']]
    extra = ''.join(f'- [ ] {x}\n' for x in s.get('check', []))
    title = f"# Cena {s['folder'][:2]} — {s['nome']}{' (goleiro)' if goleiro else ''} — corte {nome}"
    return f'''{title}

{HEAD}
**Usada em:** {s['usada']}

**Como gerar:** abra uma conversa nova e gere do zero com o prompt abaixo. Para reforçar o traço, anexe uma cena aprovada do lote 1 (por exemplo `cenas/04-penalti/{cut}/imagem.jpeg`) e acrescente no fim: `Use the attached image only as a reference for the painting style and for the player's hair. Do not copy its scene.`

**Arquivo da imagem:** salve nesta pasta como `imagem.jpeg`.

## Prompt

{scene_prompt(s, cut)}

{TAIL}

## Conferência (nota para revisão humana)

- [ ] Formato vertical 4:5, na resolução maior (1856×2304)
- [ ] Jogador de costas, rosto não aparece, cabelo no corte **{nome}**
- [ ] Costas da camisa lisas e livres do ombro à cintura, sem nada na frente
{kit_check}
- [ ] Torcida, bandeiras e adversários em cinza; nada além do uniforme em magenta ou ciano
{extra}- [ ] Sem texto, número, escudo, logo ou marca d'água (nem a estrela do Gemini fora da faixa escura)
- [ ] Parte de baixo (40%) escura e vazia
'''


STADIUM = 'The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.'
OPP = 'Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks.'

# ---------------------------------------------------------------- lote 3: cenários que já têm evento no jogo
LOTE3 = [
    dict(folder='06-sala-empresario', nome='Sala do empresário', clothing='casual',
         usada='Conversas com o empresário: propostas, pedido de aumento, troca de empresário.',
         setting="A small, tidy football agent's office in a Brazilian city, at night. A dark wooden desk in the middle of the room, a brass desk lamp switched on, one closed plain grey folder and one phone lying face down on the desk. Behind the desk, a wide window shows the blurred lights of the city at night. A low shelf with a few plain books without titles. Walls in muted navy and grey.",
         pose="He is seated on a simple chair on the near side of the desk, in the centre of the frame, with his back to the camera, sitting upright with both forearms resting on the desk, listening.",
         others="On the far side of the desk sits the agent: a middle-aged man in a plain dark navy suit and white shirt with no tie, slightly out of focus, hands open on the desk as he explains something. The back of the player's chair is low: it ends below his waist and does not cover his back.",
         gold='the glow of the brass desk lamp and the city lights',
         camera='The camera is at seated eye level, about two metres behind the player, looking straight across the desk.',
         position='The seat of his chair is no lower than 60% of the way down from the top edge.', floor='the office floor',
         must=['No contract with readable writing: any paper is blank.'],
         check=['Encosto da cadeira baixo, sem cobrir as costas', 'Empresário de terno azul-marinho, desfocado']),
    dict(folder='07-reuniao-comissao', nome='Reunião com a comissão', clothing='kit',
         usada='Reunião semestral com a comissão técnica (foco de treino, mudança de posição).',
         setting="A plain meeting room at a football club's training centre, in daylight. A long light-wood table, a white wall with a large blank white tactics board (nothing drawn or written on it), and a wide window showing an empty green training pitch outside.",
         pose="He is seated on a simple stool on the near side of the table, in the centre of the frame, with his back to the camera, leaning slightly forward with his hands on the table, paying attention.",
         others="On the far side of the table sit two members of the coaching staff, slightly out of focus: a head coach in his fifties and a younger assistant, both in plain dark navy tracksuit tops. The assistant holds a clipboard with a blank sheet. A plain white football rests on the table.",
         gold='nothing; the light is neutral daylight',
         camera='The camera is at seated eye level, about two metres behind the player, looking straight across the table.',
         position='The seat of his stool is no lower than 60% of the way down from the top edge. He sits on a stool with no backrest.', floor='the meeting-room floor',
         check=['Quadro tático em branco, sem desenho', 'Banco sem encosto']),
    dict(folder='08-casa-familia', nome='Em casa com a família', clothing='casual',
         usada='Eventos de família: estirão, compra da casa, conselhos, vida fora do campo.',
         setting="The modest living room of a Brazilian family home, in the early evening. A simple sofa, a small coffee table with a coffee pot and plain cups, a floor lamp switched on, a shelf with a few plain picture frames whose pictures are too blurred to read, and a window with a curtain. Warm, cosy light.",
         pose="He is seated on a wooden stool in the foreground, in the centre of the frame, with his back to the camera, sitting upright and relaxed, facing his family.",
         others="Facing him, on the sofa on the far side of the coffee table and slightly out of focus, sit his mother and father, both in their fifties, smiling, in plain everyday clothes in muted beige, grey and navy. A younger sister of about twelve sits on the arm of the sofa. No one stands between the camera and the player.",
         gold='the warm light of the floor lamp',
         camera='The camera is at seated eye level, about two metres behind the player, looking straight at the sofa.',
         position='The seat of his stool is no lower than 60% of the way down from the top edge.', floor='the living-room floor',
         must=['No television picture and no screens with images.'],
         check=['Família ao fundo em roupas de tons neutros', 'Banco sem encosto']),
    dict(folder='09-despedida', nome='Despedida', clothing='kit',
         usada='Jogo de despedida e aposentadoria.',
         setting='A full football stadium at dusk, right after the last match of his career. The sky is deep navy with a thin band of warm light on the horizon, and the floodlights are on.',
         pose="He stands on the centre circle, in the centre of the frame, with his back to the camera, his right arm raised high and his open hand waving goodbye to the crowd, head slightly lifted. His left arm hangs relaxed at his side.",
         others="Further ahead, slightly out of focus, his team-mates in the same magenta-and-cyan kit stand in two short rows, one on each side, applauding him, leaving the middle open. " + STADIUM + " A few fans hold up plain light-grey scarves.",
         gold='the band of light on the horizon and the floodlight glow',
         camera='The camera is at waist height, a few metres behind him, looking straight towards the main stand.',
         floor='the grass',
         check=['Braço direito erguido acenando, sem cobrir as costas']),
    dict(folder='10-copa', nome='Copa do Mundo', clothing='kit',
         usada='Convocação que vira Copa do Mundo e os momentos do torneio (herói ou vilão da Copa).',
         setting='A gigantic, three-tier football stadium at night, minutes before the kick-off of a world tournament match. Every seat is taken. Rows of white floodlights shine from the roof.',
         pose="He stands on the pitch in a straight line with his team-mates, in the centre of the frame, with his back to the camera, feet apart, arms straight down at his sides, head up, looking at the huge stand in front of him.",
         others="On his left and on his right, three team-mates on each side stand in the same line, also seen from behind in the same magenta-and-cyan kit with blank shirts, with a small gap between each player so that nobody touches him. In the stand in front of them the crowd unfurls one enormous plain light-grey flag with nothing on it, and small white fireworks burst above the roof. " + STADIUM,
         gold='the floodlight glow and the sparks of the fireworks',
         camera='The camera is at chest height, a few metres behind the line of players, looking straight at the stand.',
         floor='the grass',
         must=['No arms around shoulders: nobody touches the main character.', 'No national flags, no country names and no real tournament trophy.'],
         check=['Fila de companheiros sem encostar no jogador', 'Bandeirão cinza liso, sem símbolo']),
    dict(folder='11-treino', nome='Treino', clothing='kit',
         usada='Treinos, evolução de atributos e treino de bola parada.',
         setting="The training ground of a football club on a bright morning. A well-kept grass pitch, a low wire fence, a few trees and a small empty concrete stand in the distance. Clear pale-blue sky.",
         pose="He runs away from the camera, in the centre of the frame, with his back to the camera, dribbling a plain white football at his feet between a row of small white training cones, body leaning slightly forward, arms out for balance but not crossing his back.",
         others="Further ahead, slightly out of focus, three team-mates in the same magenta-and-cyan kit jog in a group. To one side stands a coach in a plain dark navy tracksuit with a whistle on a cord, watching with his arms crossed.",
         gold='nothing; the light is natural morning sunlight',
         camera='The camera is at waist height, a few metres behind him, looking along the row of cones.',
         floor='the grass',
         colour=['The training cones are plain white. There are no orange, yellow or red cones or bibs.'],
         check=['Cones brancos (não laranja)', 'Céu claro de manhã; faixa de baixo escurece mesmo assim']),
    dict(folder='12-gol', nome='Gol', clothing='kit',
         usada='Gol decisivo, gol em clássico e comemoração.',
         setting='A full football stadium at night, one second after he has scored. Floodlights shine from above.',
         pose="He runs away from the camera towards the stand behind the goal, in the centre of the frame, with his back to the camera, both arms stretched wide open to the sides at shoulder height, head up, celebrating.",
         others="In front of him, in the stand, the crowd jumps with both arms in the air. To the right, further away and slightly out of focus, the goal: the plain white football rests in the back of the net and a goalkeeper in a plain dark-grey kit kneels on the grass. To the left, two team-mates in the same magenta-and-cyan kit run towards him. " + STADIUM,
         gold='the floodlight glow',
         camera='The camera is at waist height, a few metres behind him, looking towards the stand behind the goal.',
         floor='the grass',
         check=['Braços abertos para os lados, sem cobrir as costas', 'Bola na rede e goleiro adversário de cinza-escuro']),
    dict(folder='13-hospital', nome='Hospital', clothing='casual-shorts',
         usada='Lesão grave e a decisão do tratamento (operar, tratamento conservador, voltar antes).',
         setting="A clean, quiet hospital room in daylight. A hospital bed with white sheets, a window with a half-open blind, a plain bedside cabinet, and a wall monitor whose screen is switched off and dark. Pale grey and off-white walls.",
         pose="He sits on the edge of the bed, in the centre of the frame, with his back to the camera, shoulders slightly dropped, looking towards the window. His right knee is wrapped in a plain white brace. A pair of plain grey crutches leans against the bed beside him.",
         others="Near the window, slightly out of focus, a doctor in a plain white coat stands holding a clipboard with a blank sheet, turned towards him.",
         gold='nothing; the light is cool daylight',
         camera='The camera is at seated eye level, about two metres behind him, looking towards the window.',
         position='The edge of the bed where he sits is no lower than 60% of the way down from the top edge.', floor='the hospital floor',
         must=['No red cross, no medical symbols, no hospital name, no blood and no visible injury.'],
         check=['Joelheira branca e muletas cinza', 'Monitor desligado, sem símbolos médicos']),
    dict(folder='14-festa', nome='Festa', clothing='casual',
         usada='Tentação da noite, festa com o elenco e polêmicas fora de campo.',
         setting="A lively party on the terrace of a house at night. Strings of small warm-white bulbs hang overhead, there is a low table with plain glasses and a plain black loudspeaker, and potted plants along a low wall. The city lights are far away in the dark.",
         pose="He stands in the centre of the frame, with his back to the camera, relaxed, weight on one leg, holding a plain glass of soft drink in his right hand at his side.",
         others="In front of him, slightly out of focus, five friends dance and laugh in a loose group, wearing plain casual clothes in muted grey, navy, off-white and beige. Nobody stands between the camera and the player and nobody touches him.",
         gold='the strings of warm-white bulbs',
         camera='The camera is at chest height, about three metres behind him, looking towards the dancing group.',
         floor='the terrace floor',
         colour=['The party lights are warm white only: no coloured disco lights.'],
         must=['No bottles with labels, no cigarettes and no brand of drink.'],
         check=['Luzes só em branco quente', 'Amigos em roupas de tons neutros']),
    dict(folder='15-entrevista', nome='Entrevista', clothing='kit',
         usada='Entrevista depois do jogo, declaração polêmica e redes sociais.',
         setting="The interview area of a stadium right after a match, at night. Behind the reporters stands a backdrop made of plain mid-grey rectangular panels with nothing printed on them. A bright white camera light points at the player.",
         pose="He stands in the centre of the frame, with his back to the camera, upright, hands on his hips with the elbows pointing out to the sides, answering questions.",
         others="Facing him, slightly out of focus, three reporters in plain dark jackets hold out plain black microphones towards him, and a camera operator holds a plain black video camera on the shoulder. The microphones have no cubes, no flags and no markings.",
         gold='nothing; the light is white',
         camera='The camera is at chest height, about three metres behind him, looking at the reporters.',
         floor='the floor of the interview area',
         must=['No sponsor wall: the backdrop panels are completely blank.'],
         check=['Microfones pretos lisos, painel de fundo em branco', 'Mãos na cintura, cotovelos para os lados, sem cobrir as costas']),
    dict(folder='16-convocacao', nome='Convocação', clothing='casual',
         usada='Convocação para a Seleção (base e principal) e convite de outra seleção.',
         setting="The living room of his home in the afternoon. A sofa, a small table, a window with daylight, and a television on a low cabinet whose screen shows only a soft, blurred, plain blue glow with no picture.",
         pose="He stands in the centre of the frame, with his back to the camera, holding a phone to his right ear with his right hand, while his left fist is raised to the side at head height in a contained celebration.",
         others="In front of him, slightly out of focus, his mother and father, both in their fifties, in plain clothes in muted beige, grey and navy, jump up from the sofa with their arms raised and their mouths open with joy, looking at him.",
         gold='the daylight coming through the window',
         camera='The camera is at chest height, about three metres behind him, looking towards the sofa.',
         floor='the living-room floor',
         must=['The television shows no picture, no person and no writing.', 'No national flags and no country names.'],
         check=['Celular na orelha, punho erguido para o lado', 'TV só com brilho azul, sem imagem']),
]

# ---------------------------------------------------------------- lote 4: cenários restantes do catálogo
LOTE4 = [
    dict(folder='17-rua-do-bairro', nome='Rua do bairro', clothing='kit',
         usada='Origem na rua do bairro e a visita do olheiro.',
         setting="A quiet sloping street in a working-class Brazilian neighbourhood in the late afternoon. Low brick and plaster houses with gates, overhead electric wires, a corner shop with a blank awning, and long warm shadows on the worn asphalt.",
         pose="He stands in the middle of the street, in the centre of the frame, with his back to the camera, his right foot resting on top of a worn plain football, arms relaxed at his sides, looking ahead.",
         others="On the pavement to the right, slightly out of focus, a scout watches him: a middle-aged man in a plain dark navy jacket holding a small notebook with blank pages. Further down the street, one boy in a plain grey T-shirt and grey shorts waits for the ball. A small makeshift goal made of two stones marks the end of the street.",
         gold='the low afternoon sunlight',
         camera='The camera is at waist height, a few metres behind him, looking down the street.',
         floor='the asphalt',
         must=['No cars, no motorcycles and no shop signs with writing.'],
         check=['Olheiro de jaqueta azul-marinho com caderno em branco', 'Sem carros nem placas']),
    dict(folder='18-peneira', nome='Peneira', clothing='kit',
         usada='Peneira no clube, no começo da carreira.',
         setting="An open trial day at a football club's training pitch on a hot, bright morning. A worn grass pitch, a wire fence with parents watching from behind it, and a long folding table at the side of the pitch.",
         pose="He stands at the edge of the pitch, in the centre of the frame, with his back to the camera, holding a plain white football under his left arm against his hip, waiting for his turn, looking at the pitch.",
         others="On the pitch in front of him, slightly out of focus, about twenty boys in plain light-grey T-shirts and dark-grey shorts wait in lines or play a small match. At the folding table sit two coaches in plain dark navy polo shirts with clipboards holding blank sheets. He is the only one in magenta and cyan.",
         gold='nothing; the light is bright daylight',
         camera='The camera is at waist height, a few metres behind him, looking at the pitch.',
         floor='the grass',
         colour=['All the other boys wear light grey and dark grey: only the main character wears magenta and cyan.'],
         check=['Só o jogador de magenta e ciano; os outros garotos de cinza', 'Pranchetas em branco']),
    dict(folder='19-banco-de-reservas', nome='Banco de reservas', clothing='kit',
         usada='Fase na reserva, perda de espaço e espera pela chance.',
         setting="The substitutes' bench of a football stadium during a night match, seen from behind the bench. The bench is a simple row of plain dark seats under a clear curved roof. Beyond it lies the floodlit pitch.",
         pose="He sits on the bench, in the centre of the frame, with his back to the camera, leaning forward with his forearms on his knees, head slightly down, watching the match.",
         others="One team-mate in the same magenta-and-cyan kit sits one empty seat away on his left and another one empty seat away on his right, both also seen from behind. On the touchline, slightly out of focus, the coach stands in a plain dark navy tracksuit with his arms crossed. On the pitch, small blurred players in magenta and cyan and in plain light grey are in play. " + STADIUM,
         gold='the floodlight glow',
         camera='The camera is at seated eye level, about two metres behind the bench, looking at the pitch.',
         position='The seat of the bench is no lower than 60% of the way down from the top edge. The seats have low backrests that end below his waist.', floor='the ground behind the bench',
         check=['Assentos de encosto baixo, sem cobrir as costas', 'Um assento vazio de cada lado do jogador']),
    dict(folder='20-aeroporto', nome='Aeroporto', clothing='casual',
         usada='Transferência para outro estado ou para o exterior, e a volta ao Brasil.',
         setting="The departure hall of a large airport at dawn. A tall wall of glass shows the apron outside, where a single plain white airliner with no markings is parked. The sky outside is pale with the first light of the day. The hall has a polished floor and rows of empty seats.",
         pose="He stands in the centre of the frame, with his back to the camera, upright, looking out through the glass at the aircraft. His right hand holds the raised handle of a plain dark navy wheeled suitcase standing on the floor beside him.",
         others="Far to the sides, a few blurred travellers in plain grey and navy clothes walk by. A departures board hangs from the ceiling: it is a plain dark panel with nothing shown on it.",
         gold='the first light of dawn on the horizon',
         camera='The camera is at chest height, a few metres behind him, looking at the glass wall.',
         floor='the polished floor',
         must=['No airline name, no livery on the aircraft, no flags and no signs with writing.', 'No backpack and no shoulder bag: his back is completely free.'],
         check=['Avião branco sem pintura; painel de voos apagado', 'Sem mochila; mala ao lado']),
    dict(folder='21-estadio', nome='Estádio', clothing='kit',
         usada='Jogo comum da temporada, estreia e sequência de titular.',
         setting='A full football stadium at night, in the middle of a league match. Floodlights shine from above. A large scoreboard above the stand is a plain dark panel with nothing shown on it.',
         pose="He runs away from the camera with the ball, in the centre of the frame, with his back to the camera, a plain white football just ahead of his right foot, body leaning forward, arms out for balance but not crossing his back.",
         others="Ahead of him, slightly out of focus, two opponents close in on him. " + OPP + " On each side, further away, one team-mate in the same magenta-and-cyan kit runs forward asking for the ball. Beyond them is the opponents' goal. " + STADIUM,
         gold='the floodlight glow',
         camera='The camera is at waist height, a few metres behind him, looking up the pitch towards the goal.',
         floor='the grass',
         check=['Adversários de cinza claro', 'Placar apagado, sem números']),
    dict(folder='22-cabecada', nome='Cabeçada', clothing='kit',
         usada='Lance aéreo, gol de cabeça e bola parada.',
         setting='A full football stadium at night, during a corner kick in a tense match. Floodlights shine from above.',
         pose="He is in mid-air, at the highest point of a jump, in the centre of the frame, with his back to the camera, rising above everyone else, his head about to strike a plain white football that is just above and in front of his forehead. His arms are spread out to the sides for lift, and his legs are bent behind him.",
         others="Below him and to the sides, two opponents also jump but are clearly lower than him. " + OPP + " One team-mate in the same magenta-and-cyan kit watches from the side. Beyond them, slightly out of focus, is the goal with a goalkeeper in a plain dark-grey kit on the line. " + STADIUM,
         gold='the floodlight glow',
         camera='The camera is at chest height, a few metres behind him, looking at the goal.',
         position='His whole body is in the air: his boots are no lower than 65% of the way down from the top edge.', floor='the grass',
         check=['Jogador no ar, mais alto que os adversários', 'Braços abertos para os lados, sem cobrir as costas']),
    dict(folder='23-fisioterapia', nome='Fisioterapia', clothing='casual-shorts',
         usada='Recuperação de lesão e volta gradual aos treinos.',
         setting="The physiotherapy room of a football club in daylight. A padded treatment table, a wall bar, a large plain grey exercise ball, a rack of plain black dumbbells, and a wide window. Pale walls and a light-grey floor.",
         pose="He sits on the edge of the treatment table, in the centre of the frame, with his back to the camera, sitting upright, both hands gripping the edge of the table at his sides, slowly stretching out his right leg, which wears a plain white knee brace.",
         others="In front of him and a little to the side, slightly out of focus, a physiotherapist in a plain dark navy polo shirt kneels on one knee, holding the ankle of his right leg and guiding the movement.",
         gold='nothing; the light is soft daylight',
         camera='The camera is at seated eye level, about two metres behind him, looking towards the window.',
         position='The edge of the table where he sits is no lower than 60% of the way down from the top edge.', floor='the floor of the room',
         must=['No medical symbols and no visible injury.'],
         check=['Fisioterapeuta de polo azul-marinho', 'Joelheira branca']),
    dict(folder='24-classico', nome='Clássico', clothing='kit',
         usada='Clássico contra o rival: provocação, decisão e pressão da torcida.',
         setting='A packed football stadium on a late afternoon, seconds before the kick-off of a derby. The low sun gives the sky a warm glow and the floodlights are already on. Thin white smoke drifts across the stands.',
         pose="He stands on the centre spot, in the centre of the frame, with his back to the camera, feet apart, arms relaxed at his sides, a plain white football on the grass just in front of his feet, staring at the opponents' half.",
         others="Ahead of him, slightly out of focus, the opposing team stands spread out across their half, facing him. " + OPP + " In the stand behind them, the crowd holds up one enormous plain light-grey flag with nothing on it. " + STADIUM,
         gold='the low sun and the floodlight glow',
         camera='The camera is at waist height, a few metres behind him, looking straight at the opponents and the stand.',
         floor='the grass',
         colour=['The smoke from the stands is white or light grey only: no coloured smoke.'],
         check=['Fumaça branca, sem cor', 'Bandeirão cinza liso; adversários de cinza']),
    dict(folder='25-vaia', nome='Vaia', clothing='kit',
         usada='Má fase, vaia da torcida, idolatria em queda.',
         setting='A football stadium at night in light rain, right after a bad defeat. The floodlights give a cold white light and the grass is wet and shiny.',
         pose="He walks slowly away from the camera towards the dark mouth of the players' tunnel, in the centre of the frame, with his back to the camera, head down, shoulders slumped, arms hanging loosely at his sides.",
         others="In the stand above the tunnel, the crowd is on its feet with arms thrown up and thumbs pointing down, some turning their backs. " + STADIUM + " Far to one side, one team-mate in the same magenta-and-cyan kit also walks off alone, small and out of focus.",
         gold='nothing; the light is cold white',
         camera='The camera is at waist height, a few metres behind him, looking at the tunnel and the stand above it.',
         floor='the wet grass',
         must=['No objects thrown onto the pitch.'],
         check=['Cabeça baixa, ombros caídos', 'Luz fria, chuva fina']),
]

# ---------------------------------------------------------------- lote 5a: versões de goleiro das cenas de jogo
GK = [
    dict(folder='01-titulo', nome='Título', clothing='gk',
         usada='Evento de título, quando o jogador é goleiro.',
         setting='A football stadium at night, seconds after the final whistle of a cup final that his team has just won. Floodlights shine from above.',
         pose="He stands on the pitch in the centre of the frame, with his back to the camera, his left arm raised straight up, gloved index finger pointing to the night sky, head tilted slightly upwards, in a quiet, emotional celebration. His right arm hangs at his side.",
         others="In front of him, slightly out of focus, four team-mates in plain magenta shirts, cyan shorts and cyan socks, with blank shirts, run towards each other to hug. Further away, on a small plain podium on the pitch, stands a simple gold cup: a round bowl with two curved handles, a short stem and a square dark base, like a generic sports-day trophy. " + STADIUM + " A few small pieces of off-white paper confetti fall through the floodlight beams.",
         gold='the trophy and the floodlight glow',
         camera='The camera is at chest height, a few metres behind him.', floor='the grass',
         must=['The trophy is a generic cup of original design and does not copy any real trophy.']),
    dict(folder='04-penalti', nome='Pênalti', clothing='gk',
         usada='Pênalti decisivo, quando o jogador é goleiro (ele defende).',
         setting='A football stadium at night during a penalty kick in a decisive match, seen from inside the goal. Floodlights shine from above.',
         pose="He stands on the goal line, in the centre of the frame, with his back to the camera, knees bent, body low and balanced, both gloved arms spread wide to the sides, ready to dive.",
         others="In front of him, about eleven metres away and slightly out of focus, a plain white football rests on the penalty spot and an opponent takes his run-up towards it. " + OPP + " Behind the taker, players of both teams wait at the edge of the penalty area. " + STADIUM + " The white goalposts frame the image on the left and right edges; the net is behind the camera and is not visible.",
         gold='the floodlight glow',
         camera='The camera is inside the goal, at waist height, about two metres behind him, looking out at the penalty spot. There is no net between the camera and him.', floor='the grass of the goal mouth',
         check=['Câmera dentro do gol, sem rede na frente do goleiro', 'Braços abertos para os lados']),
    dict(folder='12-defesa', nome='Defesa', clothing='gk',
         usada='Defesa decisiva, quando o jogador é goleiro (no lugar da cena de gol).',
         setting='A full football stadium at night, at the instant of a great save. Floodlights shine from above.',
         pose="He is in full horizontal flight, diving to his right, in the centre of the frame, with his back to the camera, body stretched parallel to the ground, his right gloved hand pushing a plain white football away at the tips of his fingers, his left arm stretched along the same line.",
         others="Beyond him, slightly out of focus, the opponent who took the shot watches with his hands going to his head. " + OPP + " One team-mate in a plain magenta shirt, cyan shorts and cyan socks runs back. " + STADIUM,
         gold='the floodlight glow',
         camera='The camera is inside the goal, at waist height, about three metres behind him, looking out at the pitch. There is no net between the camera and him.',
         position='His whole body is in the air, between 30% and 60% of the way down from the top edge.', floor='the grass of the goal mouth',
         check=['Goleiro em voo horizontal, costas viradas para a câmera', 'Bola na ponta dos dedos']),
    dict(folder='22-saida-do-gol', nome='Saída do gol', clothing='gk',
         usada='Lance aéreo, quando o jogador é goleiro (no lugar da cabeçada).',
         setting='A full football stadium at night, during a corner kick in a tense match. Floodlights shine from above.',
         pose="He is in mid-air, at the highest point of a jump, in the centre of the frame, with his back to the camera, rising above everyone else, both gloved hands stretched straight up above his head, catching a plain white football. One knee is raised for protection.",
         others="Below him and to the sides, two opponents jump but are clearly lower than him. " + OPP + " Two team-mates in plain magenta shirts, cyan shorts and cyan socks stand nearby. " + STADIUM,
         gold='the floodlight glow',
         camera='The camera is at chest height, a few metres behind him, looking out at the pitch.',
         position='His whole body is in the air: his boots are no lower than 65% of the way down from the top edge.', floor='the grass',
         check=['Goleiro no ar, mãos acima da cabeça segurando a bola']),
    dict(folder='21-estadio', nome='Estádio', clothing='gk',
         usada='Jogo comum da temporada, quando o jogador é goleiro.',
         setting='A full football stadium at night, in the middle of a league match. Floodlights shine from above.',
         pose="He stands at the edge of his penalty area, in the centre of the frame, with his back to the camera, feet apart, his right gloved arm stretched out to the side, pointing and organising his defence.",
         others="Ahead of him, slightly out of focus, four team-mates in plain magenta shirts, cyan shorts and cyan socks form a defensive line. Further up the pitch, small and blurred, players of both teams contest the ball. " + OPP + " " + STADIUM,
         gold='the floodlight glow',
         camera='The camera is at waist height, a few metres behind him, looking up the pitch.', floor='the grass',
         check=['Braço estendido para o lado, sem cobrir as costas']),
    dict(folder='24-classico', nome='Clássico', clothing='gk',
         usada='Clássico contra o rival, quando o jogador é goleiro.',
         setting='A packed football stadium on a late afternoon, seconds before the kick-off of a derby. The low sun gives the sky a warm glow and the floodlights are already on. Thin white smoke drifts across the stands.',
         pose="He stands a few steps in front of his goal line, in the centre of the frame, with his back to the camera, feet apart, both gloved arms held out to the sides at waist height with the palms open, focused, looking up the pitch.",
         others="Far ahead of him, slightly out of focus, both teams take their positions for the kick-off: his team-mates in plain magenta shirts, cyan shorts and cyan socks, and the opponents. " + OPP + " In the far stand the crowd holds up one enormous plain light-grey flag with nothing on it. " + STADIUM,
         gold='the low sun and the floodlight glow',
         camera='The camera is at waist height, a few metres behind him, looking up the pitch.', floor='the grass',
         colour=['The smoke from the stands is white or light grey only: no coloured smoke.']),
    dict(folder='10-copa', nome='Copa do Mundo', clothing='gk',
         usada='Copa do Mundo, quando o jogador é goleiro.',
         setting='A gigantic, three-tier football stadium at night, minutes before the kick-off of a world tournament match. Every seat is taken. Rows of white floodlights shine from the roof.',
         pose="He stands on the pitch in a straight line with his team-mates, in the centre of the frame, with his back to the camera, feet apart, gloved arms straight down at his sides, head up, looking at the huge stand in front of him.",
         others="On his left and on his right, three team-mates on each side stand in the same line, seen from behind in plain magenta shirts, cyan shorts and cyan socks with blank shirts, with a small gap between each player so that nobody touches him. In the stand in front of them the crowd unfurls one enormous plain light-grey flag with nothing on it, and small white fireworks burst above the roof. " + STADIUM,
         gold='the floodlight glow and the sparks of the fireworks',
         camera='The camera is at chest height, a few metres behind the line of players, looking straight at the stand.', floor='the grass',
         must=['No arms around shoulders: nobody touches the main character.', 'No national flags, no country names and no real tournament trophy.']),
    dict(folder='25-vaia', nome='Vaia', clothing='gk',
         usada='Má fase e vaia da torcida, quando o jogador é goleiro.',
         setting='A football stadium at night in light rain, right after he has conceded a goal. The floodlights give a cold white light and the grass is wet and shiny.',
         pose="He stands in his goal mouth facing the net, in the centre of the frame, with his back to the camera, head down, shoulders slumped, gloved hands hanging at his sides, looking at a plain white football lying in the back of the net.",
         others="Behind the net, in the stand, the crowd is on its feet with arms thrown up and thumbs pointing down. " + STADIUM,
         gold='nothing; the light is cold white',
         camera='The camera is at waist height, a few metres behind him, on the pitch side, looking at the goal and the stand behind it.', floor='the wet grass',
         must=['No objects thrown onto the pitch.']),
    dict(folder='11-treino', nome='Treino', clothing='gk',
         usada='Treinos, quando o jogador é goleiro.',
         setting="The training ground of a football club on a bright morning. A grass pitch with a full-size goal, a low wire fence, a few trees and a small empty concrete stand in the distance. Clear pale-blue sky.",
         pose="He stands in the middle of the goal mouth, in the centre of the frame, with his back to the camera, knees bent, both gloved hands held forward and to the sides at waist height, ready for the next shot.",
         others="In front of him, about twelve metres away and slightly out of focus, a goalkeeping coach in a plain dark navy tracksuit is about to strike a plain white football, with five more white footballs lined up beside him. A few small white training cones mark the area.",
         gold='nothing; the light is natural morning sunlight',
         camera='The camera is inside the goal, at waist height, about two metres behind him, looking out at the coach. There is no net between the camera and him.', floor='the grass of the goal mouth',
         colour=['The training cones are plain white. There are no orange, yellow or red cones or bibs.']),
    dict(folder='09-despedida', nome='Despedida', clothing='gk',
         usada='Jogo de despedida e aposentadoria, quando o jogador é goleiro.',
         setting='A full football stadium at dusk, right after the last match of his career. The sky is deep navy with a thin band of warm light on the horizon, and the floodlights are on.',
         pose="He stands on the centre circle, in the centre of the frame, with his back to the camera, his right arm raised high, waving goodbye to the crowd with his bare open hand. His left hand, at his side, holds his pair of orange gloves.",
         others="Further ahead, slightly out of focus, his team-mates in plain magenta shirts, cyan shorts and cyan socks stand in two short rows, one on each side, applauding him, leaving the middle open. " + STADIUM,
         gold='the band of light on the horizon and the floodlight glow',
         camera='The camera is at waist height, a few metres behind him, looking straight towards the main stand.', floor='the grass',
         check=['Luvas laranja na mão esquerda; mão direita acenando']),
]

# ---------------------------------------------------------------- lote 5b: troféus
TROPHY_HEAD = '''Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.
'''
TROPHY_TAIL = '''
BACKGROUND
A perfectly flat, uniform, deep navy blue (#14213D) covering the whole background from edge to edge. No gradient, no texture, no vignette, no table, no floor line, no spotlight circle and no cast shadow.

LIGHTING
Soft studio light from the upper left. Clean highlights and gentle shading on the metal. The metal reflects only neutral white and navy tones: no reflected scenery, no reflected people and no coloured reflections.

COMPOSITION - follow these positions
- Square 1:1. The trophy is horizontally centred.
- The top of the trophy is about 10% of the way down from the top edge and its base ends about 90% of the way down.
- There is clear navy space on all four sides; nothing is cropped by the image edge.

MUST NOT APPEAR
- No text, letters, numbers, dates or engraved inscriptions anywhere, including on the base and on any plaque.
- No logos, crests, emblems, flags, country symbols, sponsor or brand marks.
- No human figures, no hands and no faces as part of the trophy, unless the design above says so.
- No ribbons, no confetti, no people and no other objects, unless the design above says so.
- No watermark or signature, and no frames or borders.'''

TROPHIES = [
    ('estadual', 'Campeonato estadual', 'A classic medium-sized gold cup: a round bowl with a slightly flared rim, two curved handles shaped like simple scrolls, a short ribbed stem and a square base of dark polished wood. Friendly and traditional, like the cup of a regional championship.'),
    ('serie-a', 'Campeonato nacional — primeira divisão', 'A tall, slender gold trophy with no bowl and no handles: five narrow vertical blades of polished gold rise from a round base and curve gently inwards, holding a smooth polished gold sphere at the top. The base is a low cylinder of black stone. Modern and imposing.'),
    ('serie-b', 'Campeonato nacional — segunda divisão', 'A silver trophy with no bowl and no handles: three narrow vertical blades of polished silver rise from a round base and curve gently inwards, holding a smooth polished silver sphere at the top. The base is a low cylinder of black stone. Clearly shorter and simpler than a first-division trophy.'),
    ('serie-c', 'Campeonato nacional — terceira divisão', 'A bronze trophy with no bowl and no handles: two broad vertical blades of polished bronze rise from a round base and lean towards each other, holding a small smooth bronze sphere between their tips. The base is a low cylinder of dark wood. Modest in size.'),
    ('serie-d', 'Campeonato nacional — quarta divisão', 'A small, simple trophy of brushed steel: a plain shallow bowl on a short straight stem, with no handles and no ornament, on a small round base of dark wood. Humble and honest.'),
    ('copa-do-brasil', 'Copa nacional', 'A wide gold cup: a broad, shallow, bowl-shaped body with two large semicircular handles, a domed gold lid topped by a small plain gold ball, a short thick stem and a round stepped base of dark wood. Heavy and festive.'),
    ('copa-do-nordeste', 'Copa regional', 'A gold cup with a sun motif: a rounded bowl resting on a stem made of twelve straight gold rays that fan out like a rising sun, with no handles, on a round base of warm dark wood. Bright and cheerful.'),
    ('continental-principal', 'Copa continental principal', 'A tall, noble silver cup: an elongated egg-shaped body with a gold laurel wreath encircling the rim, two thin straight handles that run vertically down the sides, and a long stem wrapped by one spiralling silver band, on a round two-step base of black stone. The most imposing club trophy of the series.'),
    ('continental-secundaria', 'Copa continental secundária', 'A slim silver chalice with no handles: a tall, narrow body that flares smoothly outwards at the rim, one plain gold ring around its middle, and a slender stem on a small round base of black stone. Elegant and lighter than the main continental trophy.'),
    ('copa-do-mundo', 'Copa do Mundo de seleções', 'A solid gold trophy: a smooth gold globe engraved only with a few thin curved meridian lines, resting on top of a gold column that twists upwards like a rope and widens where it meets the globe, on a round two-step base of black marble. There are no human figures and no hands in the design. The grandest trophy of the series.'),
    ('copa-america', 'Copa continental de seleções', 'A silver cup with a fluted body: vertical grooves run all around a tall rounded bowl, with two small angular handles near the rim and a plain silver lid with a flat knob, on a square two-step base of dark wood with no plaques. Old-fashioned and dignified.'),
    ('olimpiadas', 'Medalha de ouro olímpica', 'Not a cup: one round gold medal hanging from a plain off-white ribbon that forms a V going up and out of the top of the image. The face of the medal is embossed with a single laurel branch curving around a small plain football. There are no rings, no torch and no symbols of any real event.'),
    ('liga-europeia', 'Liga nacional europeia', 'A polished silver cup with a domed lid topped by a small plain gold football, a rounded body, two straight vertical handles shaped like flat bars, and a short stem on a round base of black stone. Two plain off-white ribbons are tied to the handles and hang down. There is no crown in the design.'),
    ('copa-europeia', 'Copa europeia de clubes', 'A short, wide silver cup with a hammered texture on its body, a polished gold rim and two large looping handles that curve outwards and downwards to join the lower body, with no lid and almost no stem, on a low round silver foot. Its proportions are clearly its own: short and broad rather than tall.'),
    ('premio-melhor-jogador', 'Prêmio individual — melhor jogador', 'A polished gold ball with a smooth surface divided by a few thin engraved lines, held inside one tilted gold ring that circles it like an orbit, on a plain cylindrical base of deep navy stone with a gold band at the top. There is no rock or rough stone in the design.'),
    ('premio-artilheiro', 'Prêmio individual — artilheiro', 'A gold football boot seen in profile, pointing to the right, plain and smooth, with simple laces and studs and no stripes or marks of any kind, mounted at a slight upward angle on a rectangular base of dark wood.'),
    ('premio-melhor-goleiro', 'Prêmio individual — melhor goleiro', 'A gold goalkeeper glove, upright with the palm facing the viewer and the fingers together and slightly open, plain and smooth with no marks of any kind, mounted by the wrist on a round base of dark wood.'),
    ('premio-revelacao', 'Prêmio individual — revelação', 'A five-pointed gold star with softly rounded points, standing upright on a slender silver stem that rises from a round base of dark wood. Small and bright, like an award for a young newcomer.'),
]


def trophy_md(tid, nome, design):
    return f'''# Troféu — {nome}

{HEAD}
**Usada em:** tela de título, lista de conquistas e cartão final.

**Como gerar:** abra uma conversa nova e gere do zero com o prompt abaixo. Não anexe nem cite nenhum troféu real.

**Arquivo da imagem:** salve nesta pasta como `imagem.jpeg`.

## Prompt

```
{TROPHY_HEAD}
DESIGN
{design}
{TROPHY_TAIL}
```

{TAIL}

## Conferência (nota para revisão humana)

- [ ] Formato quadrado 1:1, na resolução maior
- [ ] Um troféu só, de frente, centralizado, inteiro dentro do quadro
- [ ] Desenho original: **não lembra o troféu real da competição** (se lembrar, refazer)
- [ ] Fundo azul-marinho chapado, sem sombra, mesa nem degradê
- [ ] Sem texto, inscrição, data, escudo, bandeira ou marca
- [ ] Sem marca d'água
'''


OPENING = f'''# Tela de abertura

{HEAD}
**Usada em:** tela de abertura do jogo, atrás do número gigante "10" que a interface desenha.

**Como gerar:** abra uma conversa nova e gere do zero com o prompt abaixo. Para reforçar o traço, anexe uma cena aprovada do lote 1 e acrescente no fim: `Use the attached image only as a reference for the painting style. Do not copy its scene.`

**Arquivo da imagem:** salve nesta pasta como `imagem.jpeg`.

## Prompt

```
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

{STYLE}

SETTING
The players' tunnel of a large football stadium at night, seen from inside. The tunnel is dark, with plain concrete walls and ceiling. At its far end, a tall rectangular opening shows the bright floodlit pitch, a strip of green grass and a blurred, full stand in light grey.

MAIN CHARACTER
One football player, seen entirely from behind as a dark silhouette lit only around his edges by the light coming from the pitch. He is walking away from the camera towards the opening, in the centre of the frame, upright and calm, arms relaxed at his sides. His head is a simple rounded silhouette with very short hair. No face is visible.

CLOTHING
He wears a plain deep navy-blue short-sleeved football shirt, plain navy shorts, plain navy socks and plain black boots. On his LEFT upper arm he wears a plain bright yellow (#FFC21A) captain's armband: a simple smooth band with nothing printed on it. The armband is the only brightly coloured object in the image and it catches the light.

THE BACK OF THE SHIRT
From the shoulders down to the waist, the back of the shirt is one smooth, dark, empty surface with nothing printed on it and nothing covering it. The interface will draw a giant number over it.

OTHER PEOPLE AND OBJECTS
There is nobody else in the tunnel. In the stand seen through the opening, the crowd is a soft blur of light grey with a few plain light-grey flags. A few specks of dust float in the beam of light that enters the tunnel.

COLOUR PLAN - follow it exactly
- Deep navy blue (#14213D) for the tunnel, the shadows and the kit.
- Off-white for the light at the end of the tunnel and the rim light around the player.
- Pitch green only on the strip of grass seen through the opening.
- Bright yellow (#FFC21A) appears in one place only: the captain's armband.
- Light grey for the crowd. No magenta, no cyan, no red, no purple.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking straight down the tunnel at the opening.
- The player is horizontally centred. The top of his head is about 22% of the way down from the top edge and his feet are no lower than 72% of the way down.
- The bright opening is directly in front of him, so that his silhouette stands out against the light.
- The top 15% of the image and the lower 28% are dark, calm and empty, fading into deep navy, because the title and the buttons will be placed over those areas.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on the shirt, the walls, the armband or any sign.
- No logos, crests, badges, sponsor or brand marks.
- No other players, no officials and no mascots.
- No watermark or signature, and no interface elements, frames or borders.
- The player is an original fictional character who does not resemble any real person.
```

{TAIL}

## Conferência (nota para revisão humana)

- [ ] Formato vertical 4:5, na resolução maior (1856×2304)
- [ ] Jogador de costas, em silhueta, sozinho no túnel
- [ ] Faixa de capitão amarela no braço **esquerdo**, lisa, único ponto de cor viva
- [ ] Costas da camisa lisas e escuras, sem número
- [ ] Topo (15%) e base (28%) escuros e vazios
- [ ] Sem texto, escudo, logo ou marca d'água
'''


def batch_md(s):
    """Um arquivo só por cena, pedindo as 6 imagens (uma por corte) na mesma conversa."""
    blocks = '\n\n'.join(
        f"=============== IMAGE {i} OF 6 — file name: {cut}.jpeg ===============\n" + scene_prompt(s, cut).strip('`').strip()
        for i, cut in enumerate(CUTS, 1))
    return f'''# Cena {s['folder'][:2]} — {s['nome']} — os 6 cortes de uma vez

**Usada em:** {s['usada']}

**Como usar:** abra uma conversa nova no Gemini, cole tudo o que está dentro do bloco abaixo e envie. Se ele gerar menos de 6 imagens, responda `Continue with the next image.` até completar.

**Arquivos:** salve cada imagem na pasta do corte correspondente (`curto/`, `cacheado-medio/`…) como `imagem.jpeg`.

## Prompt

````
You will generate 6 SEPARATE images in this conversation. Start from a clean slate: ignore everything from any earlier conversation.

RULES FOR THE WHOLE JOB
1. Generate exactly 6 images, one for each prompt below, in the order given: image 1, then image 2, and so on up to image 6.
2. Each image is a separate, complete, full-size picture. Never combine them into one picture: no grid, no collage, no contact sheet, no split screen, no character sheet.
3. Treat each prompt as independent. For each image, use only the text of its own prompt.
4. The six prompts describe the same scene. The ONLY difference between them is the hair of the main character. Keep the scene, the camera, the colours and the painting style as close as possible across the six images.
5. Do not write any text, caption, label or number inside any image.
6. Before each image, write one short line outside the image with its number and file name, for example: "Image 1 of 6 - curto.jpeg".
7. If you cannot generate all six in one reply, generate as many as you can and stop. When I write "Continue with the next image.", carry on from the next number. Do not start again from image 1.

{blocks}

=============== END OF THE 6 PROMPTS ===============
After the sixth image, write: "All 6 images done." If any image was skipped, say which one.
````

## Conferência (nota para revisão humana)

- [ ] 6 imagens separadas, nenhuma em grade ou colagem
- [ ] Cada corte na ordem: curto, cacheado médio, liso médio, cacheado grande, liso grande, careca
- [ ] Mesma cena nas seis; só o cabelo muda
- [ ] Cada uma passa na conferência do `prompt.md` da sua pasta
'''


def multi_md(scenes):
    """Várias cenas numa conversa só (o Gemini aceita até 20 imagens por pedido): 6 cortes por cena."""
    total = len(scenes) * len(CUTS)
    nl = '\n'
    blocks, table, i = [], [], 0
    for s in scenes:
        for cut in CUTS:
            i += 1
            table.append(f"| {i} | `{s['folder']}/{cut}/` | {s['nome']} | {CUTS[cut][0]} |")
            blocks.append(f"=============== IMAGE {i} OF {total} — scene: {s['folder']} — hair: {cut} — file name: {s['folder']}__{cut}.jpeg ===============\n"
                          + scene_prompt(s, cut).strip('`').strip())
    summary = nl.join(f"- Images {k * 6 + 1} to {k * 6 + 6}: scene \"{s['folder']}\". {s['setting'].split('.')[0]}." for k, s in enumerate(scenes))
    names = ', '.join(s['folder'] for s in scenes)
    changes = ' and '.join(str(k * 6) for k in range(1, len(scenes)))
    return f"""# Cenas {' · '.join(s['folder'] for s in scenes)} — {total} imagens de uma vez

**O que é:** um pedido único para o Gemini gerar as {total} imagens das cenas {names}, seis cortes de cabelo por cena.

**Como usar**
1. Abra uma conversa **nova** no Gemini.
2. Opcional, para aproximar o traço do lote 1: anexe `cenas/04-penalti/curto/imagem.jpeg` e acrescente no fim do texto colado: `Use the attached image only as a reference for the painting style. Do not copy its scene.`
3. Cole tudo o que está dentro do bloco "Prompt" e envie.
4. Se ele parar antes da imagem {total}, responda `Continue with the next image.` até completar.
5. Salve cada imagem na pasta da tabela abaixo, com o nome `imagem.jpeg`.

**Onde salvar cada imagem**

| # | Pasta (dentro de `docs/arte/cenas/`) | Cena | Corte |
|--:|---|---|---|
{nl.join(table)}

## Prompt

````
You will generate {total} SEPARATE images in this conversation. Start from a clean slate: ignore everything from any earlier conversation.

WHAT THIS JOB IS
A set of illustrations for a mobile football career game. There are {len(scenes)} different scenes, and each scene is painted 6 times, once for each hairstyle of the main character:
{summary}
The 6 hairstyles always come in this order: curto (short), cacheado-medio (medium curly), liso-medio (medium straight), cacheado-grande (long curly), liso-grande (long straight), careca (bald).

RULES FOR THE WHOLE JOB
1. Generate exactly {total} images, one for each prompt below, in the order given: image 1, then image 2, and so on up to image {total}.
2. Each image is a separate, complete, full-size picture in vertical 4:5 format. Never combine images into one picture: no grid, no collage, no contact sheet, no split screen, no character sheet, no before-and-after.
3. Treat each prompt as independent. For each image, use only the text of its own prompt. Never carry an object, a person or a background from one scene into another scene.
4. Inside one scene, the ONLY difference between its 6 images is the hair of the main character. Keep the room or place, the camera, the pose, the other people, the colours and the painting style as close as possible across those 6 images.
5. When the scene changes (after images {changes}), start that scene fresh from its own prompt.
6. Before each image, write one short line outside the image with its number and file name, exactly as given in its heading, for example: "Image 1 of {total} - {scenes[0]['folder']}__curto.jpeg".
7. If you cannot generate all {total} in one reply, generate as many as you can and stop. When I write "Continue with the next image.", carry on from the next number. Never start again from image 1 and never skip a number.

RULES THAT APPLY TO EVERY IMAGE
A. PAINTING STYLE. Semi-realistic painted illustration: soft blended shading, visible brush texture and only very thin, subtle linework. Not a comic, not a cartoon, no thick black outlines, no cel shading. All {total} images must look painted by the same artist.
B. THE MAIN CHARACTER IS SEEN FROM BEHIND. His face is never visible. He is horizontally centred and is the largest figure in the image.
C. THE BACK OF HIS SHIRT IS EMPTY AND UNCOVERED from the shoulders to the waist: one smooth, evenly lit surface. No number, no name, no print, and no arm, hand, strap, chair back, person or object in front of it. Software will write a number there afterwards.
D. KEY COLOURS. Bright magenta is used only for the football shirt (and the shirts of team-mates, when the prompt mentions team-mates). Cyan is used only for football shorts and socks, and only when the prompt asks for them. Software will recolour these two colours afterwards, so nothing else in the image may be magenta, pink, purple or cyan.
E. EVERYONE ELSE IS NEUTRAL. Crowds, flags, opponents and bystanders are in light grey, mid grey, navy, beige or off-white, exactly as each prompt says.
F. PLAIN CLOTHES AND OBJECTS. No badge, crest, emblem, logo, brand mark, sponsor or stripes on any clothing or object: shirts, tracksuits, jackets, coats, polo shirts, boots, trainers, balls, bags, glasses, speakers, screens and walls are completely plain.
G. NO WRITING. No text, letters, numbers, signs, labels, captions or watermarks anywhere inside any image. Papers, screens and boards are blank.
H. THE LOWER 40% IS DARK AND EMPTY. In every image the bottom 40% fades into deep navy shadow with no people, no objects and no detail, because interface panels will cover it. The main character and all the action stay in the upper 60%.
I. ORIGINAL PEOPLE. Every person is an original fictional character who does not resemble any real person.

{(nl + nl).join(blocks)}

=============== END OF THE {total} PROMPTS ===============
After image {total}, write: "All {total} images done." If any image was skipped or could not be generated, say exactly which numbers.
````

## Conferência (nota para revisão humana)

- [ ] {total} imagens separadas, nenhuma em grade ou colagem, todas em 4:5 e na resolução maior
- [ ] Ordem dos cortes em cada cena: curto, cacheado médio, liso médio, cacheado grande, liso grande, careca
- [ ] Dentro de cada cena, só o cabelo muda
- [ ] Nenhum distintivo, listra, logo ou texto em roupa, objeto ou parede
- [ ] Traço pintado, sem contorno preto grosso
- [ ] Cada imagem passa na conferência do `prompt.md` da sua pasta
"""


MULTI = [['12-gol', '13-hospital', '14-festa']]  # até 20 imagens por pedido: 3 cenas × 6 cortes


def write(path, text):
    full = os.path.join(HERE, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w') as f:
        f.write(text)


n = 0
for s in LOTE3 + LOTE4:
    for cut in CUTS:
        write(f"cenas/{s['folder']}/{cut}/prompt.md", scene_md(s, cut)); n += 1
for s in GK:
    for cut in CUTS:
        write(f"cenas-goleiro/{s['folder']}/{cut}/prompt.md", scene_md(s, cut, goleiro=True)); n += 1
for tid, nome, design in TROPHIES:
    write(f'trofeus/{tid}/prompt.md', trophy_md(tid, nome, design)); n += 1
write('abertura/prompt.md', OPENING); n += 1
# um arquivo por cena com os 6 cortes na mesma conversa (testado no Gemini em 2026-10-02 com a cena do treino)
for base, scenes in (('cenas', LOTE3 + LOTE4), ('cenas-goleiro', GK)):
    for s in scenes:
        write(f"{base}/{s['folder']}/prompt-6-cortes.md", batch_md(s)); n += 1
by_folder = {s['folder']: s for s in LOTE3 + LOTE4}
for group in MULTI:
    nums = '-'.join(f[:2] for f in group)
    write(f'cenas/prompt-{len(group) * len(CUTS)}-imagens-cenas-{nums}.md', multi_md([by_folder[f] for f in group])); n += 1
print(n, 'arquivos')
