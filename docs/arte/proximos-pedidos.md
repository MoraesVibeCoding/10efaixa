# Arte — todos os pedidos que faltam

Todas as imagens que ainda faltam dos lotes 3, 4 e 5, divididas em pedidos de até 18 imagens (o limite do Gemini é 20 por pedido).

**Como usar cada pedido**
1. Abra uma conversa **nova** no Gemini para cada pedido (não reaproveite a conversa do pedido anterior).
2. Opcional, para aproximar o traço do lote 1: anexe `cenas/04-penalti/curto/imagem.jpeg` e acrescente no fim do texto colado: `Use the attached image only as a reference for the painting style. Do not copy its scene.` (não use nos troféus).
3. Cole tudo o que está dentro do bloco do pedido e envie.
4. Se ele parar antes da última imagem, responda `Continue with the next image.` até completar.
5. Salve cada imagem na pasta indicada na tabela do pedido, com o nome `imagem.jpeg`.

## Índice

| Pedido | Conteúdo | Imagens |
|--:|---|--:|
| 1 | Cenas: 15-entrevista · 16-convocacao · 17-rua-do-bairro | 18 |
| 2 | Cenas: 18-peneira · 19-banco-de-reservas · 20-aeroporto | 18 |
| 3 | Cenas: 21-estadio · 22-cabecada · 23-fisioterapia | 18 |
| 4 | Cenas: 24-classico · 25-vaia | 12 |
| 5 | Goleiro: 01-titulo · 04-penalti · 12-defesa | 18 |
| 6 | Goleiro: 22-saida-do-gol · 21-estadio · 24-classico | 18 |
| 7 | Goleiro: 10-copa · 25-vaia · 11-treino | 18 |
| 8 | Goleiro: 09-despedida | 6 |
| 9 | Troféus (18) | 18 |

## Pedido 1 — Cenas: 15-entrevista · 16-convocacao · 17-rua-do-bairro

**Onde salvar cada imagem** (pastas dentro de `docs/arte/`)

| # | Pasta | Cena | Corte |
|--:|---|---|---|
| 1 | `cenas/15-entrevista/curto/` | Entrevista | Curto |
| 2 | `cenas/15-entrevista/cacheado-medio/` | Entrevista | Cacheado médio |
| 3 | `cenas/15-entrevista/liso-medio/` | Entrevista | Liso médio |
| 4 | `cenas/15-entrevista/cacheado-grande/` | Entrevista | Cacheado grande |
| 5 | `cenas/15-entrevista/liso-grande/` | Entrevista | Liso grande |
| 6 | `cenas/15-entrevista/careca/` | Entrevista | Careca |
| 7 | `cenas/16-convocacao/curto/` | Convocação | Curto |
| 8 | `cenas/16-convocacao/cacheado-medio/` | Convocação | Cacheado médio |
| 9 | `cenas/16-convocacao/liso-medio/` | Convocação | Liso médio |
| 10 | `cenas/16-convocacao/cacheado-grande/` | Convocação | Cacheado grande |
| 11 | `cenas/16-convocacao/liso-grande/` | Convocação | Liso grande |
| 12 | `cenas/16-convocacao/careca/` | Convocação | Careca |
| 13 | `cenas/17-rua-do-bairro/curto/` | Rua do bairro | Curto |
| 14 | `cenas/17-rua-do-bairro/cacheado-medio/` | Rua do bairro | Cacheado médio |
| 15 | `cenas/17-rua-do-bairro/liso-medio/` | Rua do bairro | Liso médio |
| 16 | `cenas/17-rua-do-bairro/cacheado-grande/` | Rua do bairro | Cacheado grande |
| 17 | `cenas/17-rua-do-bairro/liso-grande/` | Rua do bairro | Liso grande |
| 18 | `cenas/17-rua-do-bairro/careca/` | Rua do bairro | Careca |

````
You will generate 18 SEPARATE images in this conversation. Start from a clean slate: ignore everything from any earlier conversation.

WHAT THIS JOB IS
A set of illustrations for a mobile football career game. There are 3 different scenes, and each scene is painted 6 times, once for each hairstyle of the main character:
- Images 1 to 6: scene "15-entrevista". The interview area of a stadium right after a match, at night.
- Images 7 to 12: scene "16-convocacao". The living room of his home in the afternoon.
- Images 13 to 18: scene "17-rua-do-bairro". A quiet sloping street in a working-class Brazilian neighbourhood in the late afternoon.
The 6 hairstyles always come in this order: curto (short), cacheado-medio (medium curly), liso-medio (medium straight), cacheado-grande (long curly), liso-grande (long straight), careca (bald).

RULES FOR THE WHOLE JOB
1. Generate exactly 18 images, one for each prompt below, in the order given: image 1, then image 2, and so on up to image 18.
2. Each image is a separate, complete, full-size picture in vertical 4:5 format. Never combine images into one picture: no grid, no collage, no contact sheet, no split screen, no character sheet, no before-and-after.
3. Treat each prompt as independent. For each image, use only the text of its own prompt. Never carry an object, a person or a background from one scene into another scene.
4. Inside one scene, the ONLY difference between its 6 images is the hair of the main character. Keep the room or place, the camera, the pose, the other people, the colours and the painting style as close as possible across those 6 images.
5. When the scene changes (after image number: 6 and 12), start that scene fresh from its own prompt.
6. Before each image, write one short line outside the image with its number and file name, exactly as given in its heading, for example: "Image 1 of 18 - 15-entrevista__curto.jpeg".
7. If you cannot generate all 18 in one reply, generate as many as you can and stop. When I write "Continue with the next image.", carry on from the next number. Never start again from image 1 and never skip a number.

RULES THAT APPLY TO EVERY IMAGE
A. PAINTING STYLE. Semi-realistic painted illustration: soft blended shading, visible brush texture and only very thin, subtle linework. Not a comic, not a cartoon, no thick black outlines, no cel shading. All 18 images must look painted by the same artist.
B. THE MAIN CHARACTER IS SEEN FROM BEHIND. His face is never visible. He is horizontally centred and is the largest figure in the image.
C. THE BACK OF HIS SHIRT IS EMPTY AND UNCOVERED from the shoulders to the waist: one smooth, evenly lit surface. No number, no name, no print, and no arm, hand, strap, chair back, person or object in front of it. Software will write a number there afterwards.
D. KEY COLOURS. Bright magenta is used only for the football shirt (and the shirts of team-mates, when the prompt mentions team-mates). Cyan is used only for football shorts and socks, and only when the prompt asks for them. Software will recolour these two colours afterwards, so nothing else in the image may be magenta, pink, purple or cyan.
E. EVERYONE ELSE IS NEUTRAL. Crowds, flags, opponents and bystanders are in light grey, mid grey, navy, beige or off-white, exactly as each prompt says.
F. PLAIN CLOTHES AND OBJECTS. No badge, crest, emblem, logo, brand mark, sponsor or stripes on any clothing or object: shirts, tracksuits, jackets, coats, polo shirts, boots, trainers, balls, bags, glasses, speakers, screens and walls are completely plain.
G. NO WRITING. No text, letters, numbers, signs, labels, captions or watermarks anywhere inside any image. Papers, screens and boards are blank.
H. THE LOWER 40% IS DARK AND EMPTY. In every image the bottom 40% fades into deep navy shadow with no people, no objects and no detail, because interface panels will cover it. The main character and all the action stay in the upper 60%.
I. ORIGINAL PEOPLE. Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 1 OF 18 — scene: 15-entrevista — hair: curto — file name: 15-entrevista__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The interview area of a stadium right after a match, at night. Behind the reporters stands a backdrop made of plain mid-grey rectangular panels with nothing printed on them. A bright white camera light points at the player.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He stands in the centre of the frame, with his back to the camera, upright, hands on his hips with the elbows pointing out to the sides, answering questions.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Facing him, slightly out of focus, three reporters in plain dark jackets hold out plain black microphones towards him, and a camera operator holds a plain black video camera on the shoulder. The microphones have no cubes, no flags and no markings.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, about three metres behind him, looking at the reporters.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the floor of the interview area fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No sponsor wall: the backdrop panels are completely blank.

=============== IMAGE 2 OF 18 — scene: 15-entrevista — hair: cacheado-medio — file name: 15-entrevista__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The interview area of a stadium right after a match, at night. Behind the reporters stands a backdrop made of plain mid-grey rectangular panels with nothing printed on them. A bright white camera light points at the player.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands in the centre of the frame, with his back to the camera, upright, hands on his hips with the elbows pointing out to the sides, answering questions.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Facing him, slightly out of focus, three reporters in plain dark jackets hold out plain black microphones towards him, and a camera operator holds a plain black video camera on the shoulder. The microphones have no cubes, no flags and no markings.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, about three metres behind him, looking at the reporters.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the floor of the interview area fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No sponsor wall: the backdrop panels are completely blank.

=============== IMAGE 3 OF 18 — scene: 15-entrevista — hair: liso-medio — file name: 15-entrevista__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The interview area of a stadium right after a match, at night. Behind the reporters stands a backdrop made of plain mid-grey rectangular panels with nothing printed on them. A bright white camera light points at the player.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands in the centre of the frame, with his back to the camera, upright, hands on his hips with the elbows pointing out to the sides, answering questions.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Facing him, slightly out of focus, three reporters in plain dark jackets hold out plain black microphones towards him, and a camera operator holds a plain black video camera on the shoulder. The microphones have no cubes, no flags and no markings.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, about three metres behind him, looking at the reporters.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the floor of the interview area fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No sponsor wall: the backdrop panels are completely blank.

=============== IMAGE 4 OF 18 — scene: 15-entrevista — hair: cacheado-grande — file name: 15-entrevista__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The interview area of a stadium right after a match, at night. Behind the reporters stands a backdrop made of plain mid-grey rectangular panels with nothing printed on them. A bright white camera light points at the player.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He stands in the centre of the frame, with his back to the camera, upright, hands on his hips with the elbows pointing out to the sides, answering questions.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Facing him, slightly out of focus, three reporters in plain dark jackets hold out plain black microphones towards him, and a camera operator holds a plain black video camera on the shoulder. The microphones have no cubes, no flags and no markings.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, about three metres behind him, looking at the reporters.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the floor of the interview area fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No sponsor wall: the backdrop panels are completely blank.

=============== IMAGE 5 OF 18 — scene: 15-entrevista — hair: liso-grande — file name: 15-entrevista__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The interview area of a stadium right after a match, at night. Behind the reporters stands a backdrop made of plain mid-grey rectangular panels with nothing printed on them. A bright white camera light points at the player.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He stands in the centre of the frame, with his back to the camera, upright, hands on his hips with the elbows pointing out to the sides, answering questions.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Facing him, slightly out of focus, three reporters in plain dark jackets hold out plain black microphones towards him, and a camera operator holds a plain black video camera on the shoulder. The microphones have no cubes, no flags and no markings.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, about three metres behind him, looking at the reporters.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the floor of the interview area fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No sponsor wall: the backdrop panels are completely blank.

=============== IMAGE 6 OF 18 — scene: 15-entrevista — hair: careca — file name: 15-entrevista__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The interview area of a stadium right after a match, at night. Behind the reporters stands a backdrop made of plain mid-grey rectangular panels with nothing printed on them. A bright white camera light points at the player.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He stands in the centre of the frame, with his back to the camera, upright, hands on his hips with the elbows pointing out to the sides, answering questions.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Facing him, slightly out of focus, three reporters in plain dark jackets hold out plain black microphones towards him, and a camera operator holds a plain black video camera on the shoulder. The microphones have no cubes, no flags and no markings.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, about three metres behind him, looking at the reporters.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the floor of the interview area fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No sponsor wall: the backdrop panels are completely blank.

=============== IMAGE 7 OF 18 — scene: 16-convocacao — hair: curto — file name: 16-convocacao__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The living room of his home in the afternoon. A sofa, a small table, a window with daylight, and a television on a low cabinet whose screen shows only a soft, blurred, plain blue glow with no picture.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He stands in the centre of the frame, with his back to the camera, holding a phone to his right ear with his right hand, while his left fist is raised to the side at head height in a contained celebration.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue tracksuit trousers and plain white trainers. He wears nothing over the shirt: no jacket, no backpack, no bag strap.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, slightly out of focus, his mother and father, both in their fifties, in plain clothes in muted beige, grey and navy, jump up from the sofa with their arms raised and their mouths open with joy, looking at him.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His trousers are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: the daylight coming through the window.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, about three metres behind him, looking towards the sofa.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the living-room floor fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- The television shows no picture, no person and no writing.
- No national flags and no country names.

=============== IMAGE 8 OF 18 — scene: 16-convocacao — hair: cacheado-medio — file name: 16-convocacao__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The living room of his home in the afternoon. A sofa, a small table, a window with daylight, and a television on a low cabinet whose screen shows only a soft, blurred, plain blue glow with no picture.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands in the centre of the frame, with his back to the camera, holding a phone to his right ear with his right hand, while his left fist is raised to the side at head height in a contained celebration.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue tracksuit trousers and plain white trainers. He wears nothing over the shirt: no jacket, no backpack, no bag strap.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, slightly out of focus, his mother and father, both in their fifties, in plain clothes in muted beige, grey and navy, jump up from the sofa with their arms raised and their mouths open with joy, looking at him.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His trousers are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: the daylight coming through the window.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, about three metres behind him, looking towards the sofa.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the living-room floor fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- The television shows no picture, no person and no writing.
- No national flags and no country names.

=============== IMAGE 9 OF 18 — scene: 16-convocacao — hair: liso-medio — file name: 16-convocacao__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The living room of his home in the afternoon. A sofa, a small table, a window with daylight, and a television on a low cabinet whose screen shows only a soft, blurred, plain blue glow with no picture.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands in the centre of the frame, with his back to the camera, holding a phone to his right ear with his right hand, while his left fist is raised to the side at head height in a contained celebration.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue tracksuit trousers and plain white trainers. He wears nothing over the shirt: no jacket, no backpack, no bag strap.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, slightly out of focus, his mother and father, both in their fifties, in plain clothes in muted beige, grey and navy, jump up from the sofa with their arms raised and their mouths open with joy, looking at him.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His trousers are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: the daylight coming through the window.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, about three metres behind him, looking towards the sofa.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the living-room floor fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- The television shows no picture, no person and no writing.
- No national flags and no country names.

=============== IMAGE 10 OF 18 — scene: 16-convocacao — hair: cacheado-grande — file name: 16-convocacao__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The living room of his home in the afternoon. A sofa, a small table, a window with daylight, and a television on a low cabinet whose screen shows only a soft, blurred, plain blue glow with no picture.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He stands in the centre of the frame, with his back to the camera, holding a phone to his right ear with his right hand, while his left fist is raised to the side at head height in a contained celebration.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue tracksuit trousers and plain white trainers. He wears nothing over the shirt: no jacket, no backpack, no bag strap.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, slightly out of focus, his mother and father, both in their fifties, in plain clothes in muted beige, grey and navy, jump up from the sofa with their arms raised and their mouths open with joy, looking at him.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His trousers are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: the daylight coming through the window.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, about three metres behind him, looking towards the sofa.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the living-room floor fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- The television shows no picture, no person and no writing.
- No national flags and no country names.

=============== IMAGE 11 OF 18 — scene: 16-convocacao — hair: liso-grande — file name: 16-convocacao__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The living room of his home in the afternoon. A sofa, a small table, a window with daylight, and a television on a low cabinet whose screen shows only a soft, blurred, plain blue glow with no picture.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He stands in the centre of the frame, with his back to the camera, holding a phone to his right ear with his right hand, while his left fist is raised to the side at head height in a contained celebration.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue tracksuit trousers and plain white trainers. He wears nothing over the shirt: no jacket, no backpack, no bag strap.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, slightly out of focus, his mother and father, both in their fifties, in plain clothes in muted beige, grey and navy, jump up from the sofa with their arms raised and their mouths open with joy, looking at him.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His trousers are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: the daylight coming through the window.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, about three metres behind him, looking towards the sofa.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the living-room floor fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- The television shows no picture, no person and no writing.
- No national flags and no country names.

=============== IMAGE 12 OF 18 — scene: 16-convocacao — hair: careca — file name: 16-convocacao__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The living room of his home in the afternoon. A sofa, a small table, a window with daylight, and a television on a low cabinet whose screen shows only a soft, blurred, plain blue glow with no picture.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He stands in the centre of the frame, with his back to the camera, holding a phone to his right ear with his right hand, while his left fist is raised to the side at head height in a contained celebration.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue tracksuit trousers and plain white trainers. He wears nothing over the shirt: no jacket, no backpack, no bag strap.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, slightly out of focus, his mother and father, both in their fifties, in plain clothes in muted beige, grey and navy, jump up from the sofa with their arms raised and their mouths open with joy, looking at him.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His trousers are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: the daylight coming through the window.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, about three metres behind him, looking towards the sofa.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the living-room floor fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- The television shows no picture, no person and no writing.
- No national flags and no country names.

=============== IMAGE 13 OF 18 — scene: 17-rua-do-bairro — hair: curto — file name: 17-rua-do-bairro__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A quiet sloping street in a working-class Brazilian neighbourhood in the late afternoon. Low brick and plaster houses with gates, overhead electric wires, a corner shop with a blank awning, and long warm shadows on the worn asphalt.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He stands in the middle of the street, in the centre of the frame, with his back to the camera, his right foot resting on top of a worn plain football, arms relaxed at his sides, looking ahead.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On the pavement to the right, slightly out of focus, a scout watches him: a middle-aged man in a plain dark navy jacket holding a small notebook with blank pages. Further down the street, one boy in a plain grey T-shirt and grey shorts waits for the ball. A small makeshift goal made of two stones marks the end of the street.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the low afternoon sunlight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking down the street.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the asphalt fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No cars, no motorcycles and no shop signs with writing.

=============== IMAGE 14 OF 18 — scene: 17-rua-do-bairro — hair: cacheado-medio — file name: 17-rua-do-bairro__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A quiet sloping street in a working-class Brazilian neighbourhood in the late afternoon. Low brick and plaster houses with gates, overhead electric wires, a corner shop with a blank awning, and long warm shadows on the worn asphalt.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands in the middle of the street, in the centre of the frame, with his back to the camera, his right foot resting on top of a worn plain football, arms relaxed at his sides, looking ahead.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On the pavement to the right, slightly out of focus, a scout watches him: a middle-aged man in a plain dark navy jacket holding a small notebook with blank pages. Further down the street, one boy in a plain grey T-shirt and grey shorts waits for the ball. A small makeshift goal made of two stones marks the end of the street.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the low afternoon sunlight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking down the street.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the asphalt fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No cars, no motorcycles and no shop signs with writing.

=============== IMAGE 15 OF 18 — scene: 17-rua-do-bairro — hair: liso-medio — file name: 17-rua-do-bairro__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A quiet sloping street in a working-class Brazilian neighbourhood in the late afternoon. Low brick and plaster houses with gates, overhead electric wires, a corner shop with a blank awning, and long warm shadows on the worn asphalt.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands in the middle of the street, in the centre of the frame, with his back to the camera, his right foot resting on top of a worn plain football, arms relaxed at his sides, looking ahead.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On the pavement to the right, slightly out of focus, a scout watches him: a middle-aged man in a plain dark navy jacket holding a small notebook with blank pages. Further down the street, one boy in a plain grey T-shirt and grey shorts waits for the ball. A small makeshift goal made of two stones marks the end of the street.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the low afternoon sunlight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking down the street.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the asphalt fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No cars, no motorcycles and no shop signs with writing.

=============== IMAGE 16 OF 18 — scene: 17-rua-do-bairro — hair: cacheado-grande — file name: 17-rua-do-bairro__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A quiet sloping street in a working-class Brazilian neighbourhood in the late afternoon. Low brick and plaster houses with gates, overhead electric wires, a corner shop with a blank awning, and long warm shadows on the worn asphalt.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He stands in the middle of the street, in the centre of the frame, with his back to the camera, his right foot resting on top of a worn plain football, arms relaxed at his sides, looking ahead.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On the pavement to the right, slightly out of focus, a scout watches him: a middle-aged man in a plain dark navy jacket holding a small notebook with blank pages. Further down the street, one boy in a plain grey T-shirt and grey shorts waits for the ball. A small makeshift goal made of two stones marks the end of the street.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the low afternoon sunlight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking down the street.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the asphalt fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No cars, no motorcycles and no shop signs with writing.

=============== IMAGE 17 OF 18 — scene: 17-rua-do-bairro — hair: liso-grande — file name: 17-rua-do-bairro__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A quiet sloping street in a working-class Brazilian neighbourhood in the late afternoon. Low brick and plaster houses with gates, overhead electric wires, a corner shop with a blank awning, and long warm shadows on the worn asphalt.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He stands in the middle of the street, in the centre of the frame, with his back to the camera, his right foot resting on top of a worn plain football, arms relaxed at his sides, looking ahead.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On the pavement to the right, slightly out of focus, a scout watches him: a middle-aged man in a plain dark navy jacket holding a small notebook with blank pages. Further down the street, one boy in a plain grey T-shirt and grey shorts waits for the ball. A small makeshift goal made of two stones marks the end of the street.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the low afternoon sunlight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking down the street.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the asphalt fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No cars, no motorcycles and no shop signs with writing.

=============== IMAGE 18 OF 18 — scene: 17-rua-do-bairro — hair: careca — file name: 17-rua-do-bairro__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A quiet sloping street in a working-class Brazilian neighbourhood in the late afternoon. Low brick and plaster houses with gates, overhead electric wires, a corner shop with a blank awning, and long warm shadows on the worn asphalt.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He stands in the middle of the street, in the centre of the frame, with his back to the camera, his right foot resting on top of a worn plain football, arms relaxed at his sides, looking ahead.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On the pavement to the right, slightly out of focus, a scout watches him: a middle-aged man in a plain dark navy jacket holding a small notebook with blank pages. Further down the street, one boy in a plain grey T-shirt and grey shorts waits for the ball. A small makeshift goal made of two stones marks the end of the street.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the low afternoon sunlight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking down the street.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the asphalt fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No cars, no motorcycles and no shop signs with writing.

=============== END OF THE 18 PROMPTS ===============
After image 18, write: "All 18 images done." If any image was skipped or could not be generated, say exactly which numbers.
````

## Pedido 2 — Cenas: 18-peneira · 19-banco-de-reservas · 20-aeroporto

**Onde salvar cada imagem** (pastas dentro de `docs/arte/`)

| # | Pasta | Cena | Corte |
|--:|---|---|---|
| 1 | `cenas/18-peneira/curto/` | Peneira | Curto |
| 2 | `cenas/18-peneira/cacheado-medio/` | Peneira | Cacheado médio |
| 3 | `cenas/18-peneira/liso-medio/` | Peneira | Liso médio |
| 4 | `cenas/18-peneira/cacheado-grande/` | Peneira | Cacheado grande |
| 5 | `cenas/18-peneira/liso-grande/` | Peneira | Liso grande |
| 6 | `cenas/18-peneira/careca/` | Peneira | Careca |
| 7 | `cenas/19-banco-de-reservas/curto/` | Banco de reservas | Curto |
| 8 | `cenas/19-banco-de-reservas/cacheado-medio/` | Banco de reservas | Cacheado médio |
| 9 | `cenas/19-banco-de-reservas/liso-medio/` | Banco de reservas | Liso médio |
| 10 | `cenas/19-banco-de-reservas/cacheado-grande/` | Banco de reservas | Cacheado grande |
| 11 | `cenas/19-banco-de-reservas/liso-grande/` | Banco de reservas | Liso grande |
| 12 | `cenas/19-banco-de-reservas/careca/` | Banco de reservas | Careca |
| 13 | `cenas/20-aeroporto/curto/` | Aeroporto | Curto |
| 14 | `cenas/20-aeroporto/cacheado-medio/` | Aeroporto | Cacheado médio |
| 15 | `cenas/20-aeroporto/liso-medio/` | Aeroporto | Liso médio |
| 16 | `cenas/20-aeroporto/cacheado-grande/` | Aeroporto | Cacheado grande |
| 17 | `cenas/20-aeroporto/liso-grande/` | Aeroporto | Liso grande |
| 18 | `cenas/20-aeroporto/careca/` | Aeroporto | Careca |

````
You will generate 18 SEPARATE images in this conversation. Start from a clean slate: ignore everything from any earlier conversation.

WHAT THIS JOB IS
A set of illustrations for a mobile football career game. There are 3 different scenes, and each scene is painted 6 times, once for each hairstyle of the main character:
- Images 1 to 6: scene "18-peneira". An open trial day at a football club's training pitch on a hot, bright morning.
- Images 7 to 12: scene "19-banco-de-reservas". The substitutes' bench of a football stadium during a night match, seen from behind the bench.
- Images 13 to 18: scene "20-aeroporto". The departure hall of a large airport at dawn.
The 6 hairstyles always come in this order: curto (short), cacheado-medio (medium curly), liso-medio (medium straight), cacheado-grande (long curly), liso-grande (long straight), careca (bald).

RULES FOR THE WHOLE JOB
1. Generate exactly 18 images, one for each prompt below, in the order given: image 1, then image 2, and so on up to image 18.
2. Each image is a separate, complete, full-size picture in vertical 4:5 format. Never combine images into one picture: no grid, no collage, no contact sheet, no split screen, no character sheet, no before-and-after.
3. Treat each prompt as independent. For each image, use only the text of its own prompt. Never carry an object, a person or a background from one scene into another scene.
4. Inside one scene, the ONLY difference between its 6 images is the hair of the main character. Keep the room or place, the camera, the pose, the other people, the colours and the painting style as close as possible across those 6 images.
5. When the scene changes (after image number: 6 and 12), start that scene fresh from its own prompt.
6. Before each image, write one short line outside the image with its number and file name, exactly as given in its heading, for example: "Image 1 of 18 - 18-peneira__curto.jpeg".
7. If you cannot generate all 18 in one reply, generate as many as you can and stop. When I write "Continue with the next image.", carry on from the next number. Never start again from image 1 and never skip a number.

RULES THAT APPLY TO EVERY IMAGE
A. PAINTING STYLE. Semi-realistic painted illustration: soft blended shading, visible brush texture and only very thin, subtle linework. Not a comic, not a cartoon, no thick black outlines, no cel shading. All 18 images must look painted by the same artist.
B. THE MAIN CHARACTER IS SEEN FROM BEHIND. His face is never visible. He is horizontally centred and is the largest figure in the image.
C. THE BACK OF HIS SHIRT IS EMPTY AND UNCOVERED from the shoulders to the waist: one smooth, evenly lit surface. No number, no name, no print, and no arm, hand, strap, chair back, person or object in front of it. Software will write a number there afterwards.
D. KEY COLOURS. Bright magenta is used only for the football shirt (and the shirts of team-mates, when the prompt mentions team-mates). Cyan is used only for football shorts and socks, and only when the prompt asks for them. Software will recolour these two colours afterwards, so nothing else in the image may be magenta, pink, purple or cyan.
E. EVERYONE ELSE IS NEUTRAL. Crowds, flags, opponents and bystanders are in light grey, mid grey, navy, beige or off-white, exactly as each prompt says.
F. PLAIN CLOTHES AND OBJECTS. No badge, crest, emblem, logo, brand mark, sponsor or stripes on any clothing or object: shirts, tracksuits, jackets, coats, polo shirts, boots, trainers, balls, bags, glasses, speakers, screens and walls are completely plain.
G. NO WRITING. No text, letters, numbers, signs, labels, captions or watermarks anywhere inside any image. Papers, screens and boards are blank.
H. THE LOWER 40% IS DARK AND EMPTY. In every image the bottom 40% fades into deep navy shadow with no people, no objects and no detail, because interface panels will cover it. The main character and all the action stay in the upper 60%.
I. ORIGINAL PEOPLE. Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 1 OF 18 — scene: 18-peneira — hair: curto — file name: 18-peneira__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
An open trial day at a football club's training pitch on a hot, bright morning. A worn grass pitch, a wire fence with parents watching from behind it, and a long folding table at the side of the pitch.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He stands at the edge of the pitch, in the centre of the frame, with his back to the camera, holding a plain white football under his left arm against his hip, waiting for his turn, looking at the pitch.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On the pitch in front of him, slightly out of focus, about twenty boys in plain light-grey T-shirts and dark-grey shorts wait in lines or play a small match. At the folding table sit two coaches in plain dark navy polo shirts with clipboards holding blank sheets. He is the only one in magenta and cyan.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- All the other boys wear light grey and dark grey: only the main character wears magenta and cyan.
- Warm yellow or gold appears only on: nothing; the light is bright daylight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 2 OF 18 — scene: 18-peneira — hair: cacheado-medio — file name: 18-peneira__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
An open trial day at a football club's training pitch on a hot, bright morning. A worn grass pitch, a wire fence with parents watching from behind it, and a long folding table at the side of the pitch.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands at the edge of the pitch, in the centre of the frame, with his back to the camera, holding a plain white football under his left arm against his hip, waiting for his turn, looking at the pitch.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On the pitch in front of him, slightly out of focus, about twenty boys in plain light-grey T-shirts and dark-grey shorts wait in lines or play a small match. At the folding table sit two coaches in plain dark navy polo shirts with clipboards holding blank sheets. He is the only one in magenta and cyan.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- All the other boys wear light grey and dark grey: only the main character wears magenta and cyan.
- Warm yellow or gold appears only on: nothing; the light is bright daylight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 3 OF 18 — scene: 18-peneira — hair: liso-medio — file name: 18-peneira__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
An open trial day at a football club's training pitch on a hot, bright morning. A worn grass pitch, a wire fence with parents watching from behind it, and a long folding table at the side of the pitch.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands at the edge of the pitch, in the centre of the frame, with his back to the camera, holding a plain white football under his left arm against his hip, waiting for his turn, looking at the pitch.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On the pitch in front of him, slightly out of focus, about twenty boys in plain light-grey T-shirts and dark-grey shorts wait in lines or play a small match. At the folding table sit two coaches in plain dark navy polo shirts with clipboards holding blank sheets. He is the only one in magenta and cyan.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- All the other boys wear light grey and dark grey: only the main character wears magenta and cyan.
- Warm yellow or gold appears only on: nothing; the light is bright daylight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 4 OF 18 — scene: 18-peneira — hair: cacheado-grande — file name: 18-peneira__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
An open trial day at a football club's training pitch on a hot, bright morning. A worn grass pitch, a wire fence with parents watching from behind it, and a long folding table at the side of the pitch.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He stands at the edge of the pitch, in the centre of the frame, with his back to the camera, holding a plain white football under his left arm against his hip, waiting for his turn, looking at the pitch.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On the pitch in front of him, slightly out of focus, about twenty boys in plain light-grey T-shirts and dark-grey shorts wait in lines or play a small match. At the folding table sit two coaches in plain dark navy polo shirts with clipboards holding blank sheets. He is the only one in magenta and cyan.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- All the other boys wear light grey and dark grey: only the main character wears magenta and cyan.
- Warm yellow or gold appears only on: nothing; the light is bright daylight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 5 OF 18 — scene: 18-peneira — hair: liso-grande — file name: 18-peneira__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
An open trial day at a football club's training pitch on a hot, bright morning. A worn grass pitch, a wire fence with parents watching from behind it, and a long folding table at the side of the pitch.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He stands at the edge of the pitch, in the centre of the frame, with his back to the camera, holding a plain white football under his left arm against his hip, waiting for his turn, looking at the pitch.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On the pitch in front of him, slightly out of focus, about twenty boys in plain light-grey T-shirts and dark-grey shorts wait in lines or play a small match. At the folding table sit two coaches in plain dark navy polo shirts with clipboards holding blank sheets. He is the only one in magenta and cyan.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- All the other boys wear light grey and dark grey: only the main character wears magenta and cyan.
- Warm yellow or gold appears only on: nothing; the light is bright daylight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 6 OF 18 — scene: 18-peneira — hair: careca — file name: 18-peneira__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
An open trial day at a football club's training pitch on a hot, bright morning. A worn grass pitch, a wire fence with parents watching from behind it, and a long folding table at the side of the pitch.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He stands at the edge of the pitch, in the centre of the frame, with his back to the camera, holding a plain white football under his left arm against his hip, waiting for his turn, looking at the pitch.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On the pitch in front of him, slightly out of focus, about twenty boys in plain light-grey T-shirts and dark-grey shorts wait in lines or play a small match. At the folding table sit two coaches in plain dark navy polo shirts with clipboards holding blank sheets. He is the only one in magenta and cyan.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- All the other boys wear light grey and dark grey: only the main character wears magenta and cyan.
- Warm yellow or gold appears only on: nothing; the light is bright daylight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 7 OF 18 — scene: 19-banco-de-reservas — hair: curto — file name: 19-banco-de-reservas__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The substitutes' bench of a football stadium during a night match, seen from behind the bench. The bench is a simple row of plain dark seats under a clear curved roof. Beyond it lies the floodlit pitch.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He sits on the bench, in the centre of the frame, with his back to the camera, leaning forward with his forearms on his knees, head slightly down, watching the match.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
One team-mate in the same magenta-and-cyan kit sits one empty seat away on his left and another one empty seat away on his right, both also seen from behind. On the touchline, slightly out of focus, the coach stands in a plain dark navy tracksuit with his arms crossed. On the pitch, small blurred players in magenta and cyan and in plain light grey are in play. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at seated eye level, about two metres behind the bench, looking at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. The seat of the bench is no lower than 60% of the way down from the top edge. The seats have low backrests that end below his waist.
- The lower 40% of the image is calm and dark: the ground behind the bench fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 8 OF 18 — scene: 19-banco-de-reservas — hair: cacheado-medio — file name: 19-banco-de-reservas__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The substitutes' bench of a football stadium during a night match, seen from behind the bench. The bench is a simple row of plain dark seats under a clear curved roof. Beyond it lies the floodlit pitch.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He sits on the bench, in the centre of the frame, with his back to the camera, leaning forward with his forearms on his knees, head slightly down, watching the match.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
One team-mate in the same magenta-and-cyan kit sits one empty seat away on his left and another one empty seat away on his right, both also seen from behind. On the touchline, slightly out of focus, the coach stands in a plain dark navy tracksuit with his arms crossed. On the pitch, small blurred players in magenta and cyan and in plain light grey are in play. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at seated eye level, about two metres behind the bench, looking at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. The seat of the bench is no lower than 60% of the way down from the top edge. The seats have low backrests that end below his waist.
- The lower 40% of the image is calm and dark: the ground behind the bench fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 9 OF 18 — scene: 19-banco-de-reservas — hair: liso-medio — file name: 19-banco-de-reservas__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The substitutes' bench of a football stadium during a night match, seen from behind the bench. The bench is a simple row of plain dark seats under a clear curved roof. Beyond it lies the floodlit pitch.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He sits on the bench, in the centre of the frame, with his back to the camera, leaning forward with his forearms on his knees, head slightly down, watching the match.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
One team-mate in the same magenta-and-cyan kit sits one empty seat away on his left and another one empty seat away on his right, both also seen from behind. On the touchline, slightly out of focus, the coach stands in a plain dark navy tracksuit with his arms crossed. On the pitch, small blurred players in magenta and cyan and in plain light grey are in play. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at seated eye level, about two metres behind the bench, looking at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. The seat of the bench is no lower than 60% of the way down from the top edge. The seats have low backrests that end below his waist.
- The lower 40% of the image is calm and dark: the ground behind the bench fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 10 OF 18 — scene: 19-banco-de-reservas — hair: cacheado-grande — file name: 19-banco-de-reservas__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The substitutes' bench of a football stadium during a night match, seen from behind the bench. The bench is a simple row of plain dark seats under a clear curved roof. Beyond it lies the floodlit pitch.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He sits on the bench, in the centre of the frame, with his back to the camera, leaning forward with his forearms on his knees, head slightly down, watching the match.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
One team-mate in the same magenta-and-cyan kit sits one empty seat away on his left and another one empty seat away on his right, both also seen from behind. On the touchline, slightly out of focus, the coach stands in a plain dark navy tracksuit with his arms crossed. On the pitch, small blurred players in magenta and cyan and in plain light grey are in play. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at seated eye level, about two metres behind the bench, looking at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. The seat of the bench is no lower than 60% of the way down from the top edge. The seats have low backrests that end below his waist.
- The lower 40% of the image is calm and dark: the ground behind the bench fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 11 OF 18 — scene: 19-banco-de-reservas — hair: liso-grande — file name: 19-banco-de-reservas__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The substitutes' bench of a football stadium during a night match, seen from behind the bench. The bench is a simple row of plain dark seats under a clear curved roof. Beyond it lies the floodlit pitch.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He sits on the bench, in the centre of the frame, with his back to the camera, leaning forward with his forearms on his knees, head slightly down, watching the match.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
One team-mate in the same magenta-and-cyan kit sits one empty seat away on his left and another one empty seat away on his right, both also seen from behind. On the touchline, slightly out of focus, the coach stands in a plain dark navy tracksuit with his arms crossed. On the pitch, small blurred players in magenta and cyan and in plain light grey are in play. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at seated eye level, about two metres behind the bench, looking at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. The seat of the bench is no lower than 60% of the way down from the top edge. The seats have low backrests that end below his waist.
- The lower 40% of the image is calm and dark: the ground behind the bench fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 12 OF 18 — scene: 19-banco-de-reservas — hair: careca — file name: 19-banco-de-reservas__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The substitutes' bench of a football stadium during a night match, seen from behind the bench. The bench is a simple row of plain dark seats under a clear curved roof. Beyond it lies the floodlit pitch.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He sits on the bench, in the centre of the frame, with his back to the camera, leaning forward with his forearms on his knees, head slightly down, watching the match.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
One team-mate in the same magenta-and-cyan kit sits one empty seat away on his left and another one empty seat away on his right, both also seen from behind. On the touchline, slightly out of focus, the coach stands in a plain dark navy tracksuit with his arms crossed. On the pitch, small blurred players in magenta and cyan and in plain light grey are in play. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at seated eye level, about two metres behind the bench, looking at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. The seat of the bench is no lower than 60% of the way down from the top edge. The seats have low backrests that end below his waist.
- The lower 40% of the image is calm and dark: the ground behind the bench fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 13 OF 18 — scene: 20-aeroporto — hair: curto — file name: 20-aeroporto__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The departure hall of a large airport at dawn. A tall wall of glass shows the apron outside, where a single plain white airliner with no markings is parked. The sky outside is pale with the first light of the day. The hall has a polished floor and rows of empty seats.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He stands in the centre of the frame, with his back to the camera, upright, looking out through the glass at the aircraft. His right hand holds the raised handle of a plain dark navy wheeled suitcase standing on the floor beside him.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue tracksuit trousers and plain white trainers. He wears nothing over the shirt: no jacket, no backpack, no bag strap.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Far to the sides, a few blurred travellers in plain grey and navy clothes walk by. A departures board hangs from the ceiling: it is a plain dark panel with nothing shown on it.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His trousers are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: the first light of dawn on the horizon.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking at the glass wall.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the polished floor fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No airline name, no livery on the aircraft, no flags and no signs with writing.
- No backpack and no shoulder bag: his back is completely free.

=============== IMAGE 14 OF 18 — scene: 20-aeroporto — hair: cacheado-medio — file name: 20-aeroporto__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The departure hall of a large airport at dawn. A tall wall of glass shows the apron outside, where a single plain white airliner with no markings is parked. The sky outside is pale with the first light of the day. The hall has a polished floor and rows of empty seats.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands in the centre of the frame, with his back to the camera, upright, looking out through the glass at the aircraft. His right hand holds the raised handle of a plain dark navy wheeled suitcase standing on the floor beside him.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue tracksuit trousers and plain white trainers. He wears nothing over the shirt: no jacket, no backpack, no bag strap.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Far to the sides, a few blurred travellers in plain grey and navy clothes walk by. A departures board hangs from the ceiling: it is a plain dark panel with nothing shown on it.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His trousers are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: the first light of dawn on the horizon.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking at the glass wall.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the polished floor fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No airline name, no livery on the aircraft, no flags and no signs with writing.
- No backpack and no shoulder bag: his back is completely free.

=============== IMAGE 15 OF 18 — scene: 20-aeroporto — hair: liso-medio — file name: 20-aeroporto__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The departure hall of a large airport at dawn. A tall wall of glass shows the apron outside, where a single plain white airliner with no markings is parked. The sky outside is pale with the first light of the day. The hall has a polished floor and rows of empty seats.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands in the centre of the frame, with his back to the camera, upright, looking out through the glass at the aircraft. His right hand holds the raised handle of a plain dark navy wheeled suitcase standing on the floor beside him.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue tracksuit trousers and plain white trainers. He wears nothing over the shirt: no jacket, no backpack, no bag strap.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Far to the sides, a few blurred travellers in plain grey and navy clothes walk by. A departures board hangs from the ceiling: it is a plain dark panel with nothing shown on it.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His trousers are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: the first light of dawn on the horizon.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking at the glass wall.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the polished floor fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No airline name, no livery on the aircraft, no flags and no signs with writing.
- No backpack and no shoulder bag: his back is completely free.

=============== IMAGE 16 OF 18 — scene: 20-aeroporto — hair: cacheado-grande — file name: 20-aeroporto__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The departure hall of a large airport at dawn. A tall wall of glass shows the apron outside, where a single plain white airliner with no markings is parked. The sky outside is pale with the first light of the day. The hall has a polished floor and rows of empty seats.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He stands in the centre of the frame, with his back to the camera, upright, looking out through the glass at the aircraft. His right hand holds the raised handle of a plain dark navy wheeled suitcase standing on the floor beside him.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue tracksuit trousers and plain white trainers. He wears nothing over the shirt: no jacket, no backpack, no bag strap.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Far to the sides, a few blurred travellers in plain grey and navy clothes walk by. A departures board hangs from the ceiling: it is a plain dark panel with nothing shown on it.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His trousers are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: the first light of dawn on the horizon.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking at the glass wall.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the polished floor fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No airline name, no livery on the aircraft, no flags and no signs with writing.
- No backpack and no shoulder bag: his back is completely free.

=============== IMAGE 17 OF 18 — scene: 20-aeroporto — hair: liso-grande — file name: 20-aeroporto__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The departure hall of a large airport at dawn. A tall wall of glass shows the apron outside, where a single plain white airliner with no markings is parked. The sky outside is pale with the first light of the day. The hall has a polished floor and rows of empty seats.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He stands in the centre of the frame, with his back to the camera, upright, looking out through the glass at the aircraft. His right hand holds the raised handle of a plain dark navy wheeled suitcase standing on the floor beside him.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue tracksuit trousers and plain white trainers. He wears nothing over the shirt: no jacket, no backpack, no bag strap.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Far to the sides, a few blurred travellers in plain grey and navy clothes walk by. A departures board hangs from the ceiling: it is a plain dark panel with nothing shown on it.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His trousers are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: the first light of dawn on the horizon.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking at the glass wall.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the polished floor fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No airline name, no livery on the aircraft, no flags and no signs with writing.
- No backpack and no shoulder bag: his back is completely free.

=============== IMAGE 18 OF 18 — scene: 20-aeroporto — hair: careca — file name: 20-aeroporto__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The departure hall of a large airport at dawn. A tall wall of glass shows the apron outside, where a single plain white airliner with no markings is parked. The sky outside is pale with the first light of the day. The hall has a polished floor and rows of empty seats.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He stands in the centre of the frame, with his back to the camera, upright, looking out through the glass at the aircraft. His right hand holds the raised handle of a plain dark navy wheeled suitcase standing on the floor beside him.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue tracksuit trousers and plain white trainers. He wears nothing over the shirt: no jacket, no backpack, no bag strap.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Far to the sides, a few blurred travellers in plain grey and navy clothes walk by. A departures board hangs from the ceiling: it is a plain dark panel with nothing shown on it.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His trousers are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: the first light of dawn on the horizon.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking at the glass wall.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the polished floor fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No airline name, no livery on the aircraft, no flags and no signs with writing.
- No backpack and no shoulder bag: his back is completely free.

=============== END OF THE 18 PROMPTS ===============
After image 18, write: "All 18 images done." If any image was skipped or could not be generated, say exactly which numbers.
````

## Pedido 3 — Cenas: 21-estadio · 22-cabecada · 23-fisioterapia

**Onde salvar cada imagem** (pastas dentro de `docs/arte/`)

| # | Pasta | Cena | Corte |
|--:|---|---|---|
| 1 | `cenas/21-estadio/curto/` | Estádio | Curto |
| 2 | `cenas/21-estadio/cacheado-medio/` | Estádio | Cacheado médio |
| 3 | `cenas/21-estadio/liso-medio/` | Estádio | Liso médio |
| 4 | `cenas/21-estadio/cacheado-grande/` | Estádio | Cacheado grande |
| 5 | `cenas/21-estadio/liso-grande/` | Estádio | Liso grande |
| 6 | `cenas/21-estadio/careca/` | Estádio | Careca |
| 7 | `cenas/22-cabecada/curto/` | Cabeçada | Curto |
| 8 | `cenas/22-cabecada/cacheado-medio/` | Cabeçada | Cacheado médio |
| 9 | `cenas/22-cabecada/liso-medio/` | Cabeçada | Liso médio |
| 10 | `cenas/22-cabecada/cacheado-grande/` | Cabeçada | Cacheado grande |
| 11 | `cenas/22-cabecada/liso-grande/` | Cabeçada | Liso grande |
| 12 | `cenas/22-cabecada/careca/` | Cabeçada | Careca |
| 13 | `cenas/23-fisioterapia/curto/` | Fisioterapia | Curto |
| 14 | `cenas/23-fisioterapia/cacheado-medio/` | Fisioterapia | Cacheado médio |
| 15 | `cenas/23-fisioterapia/liso-medio/` | Fisioterapia | Liso médio |
| 16 | `cenas/23-fisioterapia/cacheado-grande/` | Fisioterapia | Cacheado grande |
| 17 | `cenas/23-fisioterapia/liso-grande/` | Fisioterapia | Liso grande |
| 18 | `cenas/23-fisioterapia/careca/` | Fisioterapia | Careca |

````
You will generate 18 SEPARATE images in this conversation. Start from a clean slate: ignore everything from any earlier conversation.

WHAT THIS JOB IS
A set of illustrations for a mobile football career game. There are 3 different scenes, and each scene is painted 6 times, once for each hairstyle of the main character:
- Images 1 to 6: scene "21-estadio". A full football stadium at night, in the middle of a league match.
- Images 7 to 12: scene "22-cabecada". A full football stadium at night, during a corner kick in a tense match.
- Images 13 to 18: scene "23-fisioterapia". The physiotherapy room of a football club in daylight.
The 6 hairstyles always come in this order: curto (short), cacheado-medio (medium curly), liso-medio (medium straight), cacheado-grande (long curly), liso-grande (long straight), careca (bald).

RULES FOR THE WHOLE JOB
1. Generate exactly 18 images, one for each prompt below, in the order given: image 1, then image 2, and so on up to image 18.
2. Each image is a separate, complete, full-size picture in vertical 4:5 format. Never combine images into one picture: no grid, no collage, no contact sheet, no split screen, no character sheet, no before-and-after.
3. Treat each prompt as independent. For each image, use only the text of its own prompt. Never carry an object, a person or a background from one scene into another scene.
4. Inside one scene, the ONLY difference between its 6 images is the hair of the main character. Keep the room or place, the camera, the pose, the other people, the colours and the painting style as close as possible across those 6 images.
5. When the scene changes (after image number: 6 and 12), start that scene fresh from its own prompt.
6. Before each image, write one short line outside the image with its number and file name, exactly as given in its heading, for example: "Image 1 of 18 - 21-estadio__curto.jpeg".
7. If you cannot generate all 18 in one reply, generate as many as you can and stop. When I write "Continue with the next image.", carry on from the next number. Never start again from image 1 and never skip a number.

RULES THAT APPLY TO EVERY IMAGE
A. PAINTING STYLE. Semi-realistic painted illustration: soft blended shading, visible brush texture and only very thin, subtle linework. Not a comic, not a cartoon, no thick black outlines, no cel shading. All 18 images must look painted by the same artist.
B. THE MAIN CHARACTER IS SEEN FROM BEHIND. His face is never visible. He is horizontally centred and is the largest figure in the image.
C. THE BACK OF HIS SHIRT IS EMPTY AND UNCOVERED from the shoulders to the waist: one smooth, evenly lit surface. No number, no name, no print, and no arm, hand, strap, chair back, person or object in front of it. Software will write a number there afterwards.
D. KEY COLOURS. Bright magenta is used only for the football shirt (and the shirts of team-mates, when the prompt mentions team-mates). Cyan is used only for football shorts and socks, and only when the prompt asks for them. Software will recolour these two colours afterwards, so nothing else in the image may be magenta, pink, purple or cyan.
E. EVERYONE ELSE IS NEUTRAL. Crowds, flags, opponents and bystanders are in light grey, mid grey, navy, beige or off-white, exactly as each prompt says.
F. PLAIN CLOTHES AND OBJECTS. No badge, crest, emblem, logo, brand mark, sponsor or stripes on any clothing or object: shirts, tracksuits, jackets, coats, polo shirts, boots, trainers, balls, bags, glasses, speakers, screens and walls are completely plain.
G. NO WRITING. No text, letters, numbers, signs, labels, captions or watermarks anywhere inside any image. Papers, screens and boards are blank.
H. THE LOWER 40% IS DARK AND EMPTY. In every image the bottom 40% fades into deep navy shadow with no people, no objects and no detail, because interface panels will cover it. The main character and all the action stay in the upper 60%.
I. ORIGINAL PEOPLE. Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 1 OF 18 — scene: 21-estadio — hair: curto — file name: 21-estadio__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, in the middle of a league match. Floodlights shine from above. A large scoreboard above the stand is a plain dark panel with nothing shown on it.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He runs away from the camera with the ball, in the centre of the frame, with his back to the camera, a plain white football just ahead of his right foot, body leaning forward, arms out for balance but not crossing his back.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, two opponents close in on him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. On each side, further away, one team-mate in the same magenta-and-cyan kit runs forward asking for the ball. Beyond them is the opponents' goal. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch towards the goal.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 2 OF 18 — scene: 21-estadio — hair: cacheado-medio — file name: 21-estadio__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, in the middle of a league match. Floodlights shine from above. A large scoreboard above the stand is a plain dark panel with nothing shown on it.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He runs away from the camera with the ball, in the centre of the frame, with his back to the camera, a plain white football just ahead of his right foot, body leaning forward, arms out for balance but not crossing his back.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, two opponents close in on him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. On each side, further away, one team-mate in the same magenta-and-cyan kit runs forward asking for the ball. Beyond them is the opponents' goal. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch towards the goal.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 3 OF 18 — scene: 21-estadio — hair: liso-medio — file name: 21-estadio__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, in the middle of a league match. Floodlights shine from above. A large scoreboard above the stand is a plain dark panel with nothing shown on it.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He runs away from the camera with the ball, in the centre of the frame, with his back to the camera, a plain white football just ahead of his right foot, body leaning forward, arms out for balance but not crossing his back.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, two opponents close in on him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. On each side, further away, one team-mate in the same magenta-and-cyan kit runs forward asking for the ball. Beyond them is the opponents' goal. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch towards the goal.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 4 OF 18 — scene: 21-estadio — hair: cacheado-grande — file name: 21-estadio__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, in the middle of a league match. Floodlights shine from above. A large scoreboard above the stand is a plain dark panel with nothing shown on it.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He runs away from the camera with the ball, in the centre of the frame, with his back to the camera, a plain white football just ahead of his right foot, body leaning forward, arms out for balance but not crossing his back.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, two opponents close in on him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. On each side, further away, one team-mate in the same magenta-and-cyan kit runs forward asking for the ball. Beyond them is the opponents' goal. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch towards the goal.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 5 OF 18 — scene: 21-estadio — hair: liso-grande — file name: 21-estadio__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, in the middle of a league match. Floodlights shine from above. A large scoreboard above the stand is a plain dark panel with nothing shown on it.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He runs away from the camera with the ball, in the centre of the frame, with his back to the camera, a plain white football just ahead of his right foot, body leaning forward, arms out for balance but not crossing his back.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, two opponents close in on him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. On each side, further away, one team-mate in the same magenta-and-cyan kit runs forward asking for the ball. Beyond them is the opponents' goal. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch towards the goal.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 6 OF 18 — scene: 21-estadio — hair: careca — file name: 21-estadio__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, in the middle of a league match. Floodlights shine from above. A large scoreboard above the stand is a plain dark panel with nothing shown on it.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He runs away from the camera with the ball, in the centre of the frame, with his back to the camera, a plain white football just ahead of his right foot, body leaning forward, arms out for balance but not crossing his back.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, two opponents close in on him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. On each side, further away, one team-mate in the same magenta-and-cyan kit runs forward asking for the ball. Beyond them is the opponents' goal. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch towards the goal.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 7 OF 18 — scene: 22-cabecada — hair: curto — file name: 22-cabecada__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, during a corner kick in a tense match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He is in mid-air, at the highest point of a jump, in the centre of the frame, with his back to the camera, rising above everyone else, his head about to strike a plain white football that is just above and in front of his forehead. His arms are spread out to the sides for lift, and his legs are bent behind him.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Below him and to the sides, two opponents also jump but are clearly lower than him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. One team-mate in the same magenta-and-cyan kit watches from the side. Beyond them, slightly out of focus, is the goal with a goalkeeper in a plain dark-grey kit on the line. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking at the goal.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air: his boots are no lower than 65% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 8 OF 18 — scene: 22-cabecada — hair: cacheado-medio — file name: 22-cabecada__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, during a corner kick in a tense match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He is in mid-air, at the highest point of a jump, in the centre of the frame, with his back to the camera, rising above everyone else, his head about to strike a plain white football that is just above and in front of his forehead. His arms are spread out to the sides for lift, and his legs are bent behind him.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Below him and to the sides, two opponents also jump but are clearly lower than him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. One team-mate in the same magenta-and-cyan kit watches from the side. Beyond them, slightly out of focus, is the goal with a goalkeeper in a plain dark-grey kit on the line. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking at the goal.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air: his boots are no lower than 65% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 9 OF 18 — scene: 22-cabecada — hair: liso-medio — file name: 22-cabecada__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, during a corner kick in a tense match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He is in mid-air, at the highest point of a jump, in the centre of the frame, with his back to the camera, rising above everyone else, his head about to strike a plain white football that is just above and in front of his forehead. His arms are spread out to the sides for lift, and his legs are bent behind him.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Below him and to the sides, two opponents also jump but are clearly lower than him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. One team-mate in the same magenta-and-cyan kit watches from the side. Beyond them, slightly out of focus, is the goal with a goalkeeper in a plain dark-grey kit on the line. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking at the goal.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air: his boots are no lower than 65% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 10 OF 18 — scene: 22-cabecada — hair: cacheado-grande — file name: 22-cabecada__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, during a corner kick in a tense match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He is in mid-air, at the highest point of a jump, in the centre of the frame, with his back to the camera, rising above everyone else, his head about to strike a plain white football that is just above and in front of his forehead. His arms are spread out to the sides for lift, and his legs are bent behind him.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Below him and to the sides, two opponents also jump but are clearly lower than him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. One team-mate in the same magenta-and-cyan kit watches from the side. Beyond them, slightly out of focus, is the goal with a goalkeeper in a plain dark-grey kit on the line. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking at the goal.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air: his boots are no lower than 65% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 11 OF 18 — scene: 22-cabecada — hair: liso-grande — file name: 22-cabecada__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, during a corner kick in a tense match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He is in mid-air, at the highest point of a jump, in the centre of the frame, with his back to the camera, rising above everyone else, his head about to strike a plain white football that is just above and in front of his forehead. His arms are spread out to the sides for lift, and his legs are bent behind him.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Below him and to the sides, two opponents also jump but are clearly lower than him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. One team-mate in the same magenta-and-cyan kit watches from the side. Beyond them, slightly out of focus, is the goal with a goalkeeper in a plain dark-grey kit on the line. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking at the goal.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air: his boots are no lower than 65% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 12 OF 18 — scene: 22-cabecada — hair: careca — file name: 22-cabecada__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, during a corner kick in a tense match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He is in mid-air, at the highest point of a jump, in the centre of the frame, with his back to the camera, rising above everyone else, his head about to strike a plain white football that is just above and in front of his forehead. His arms are spread out to the sides for lift, and his legs are bent behind him.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Below him and to the sides, two opponents also jump but are clearly lower than him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. One team-mate in the same magenta-and-cyan kit watches from the side. Beyond them, slightly out of focus, is the goal with a goalkeeper in a plain dark-grey kit on the line. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking at the goal.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air: his boots are no lower than 65% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 13 OF 18 — scene: 23-fisioterapia — hair: curto — file name: 23-fisioterapia__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The physiotherapy room of a football club in daylight. A padded treatment table, a wall bar, a large plain grey exercise ball, a rack of plain black dumbbells, and a wide window. Pale walls and a light-grey floor.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He sits on the edge of the treatment table, in the centre of the frame, with his back to the camera, sitting upright, both hands gripping the edge of the table at his sides, slowly stretching out his right leg, which wears a plain white knee brace.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue shorts and plain white trainers. He wears nothing over the shirt.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him and a little to the side, slightly out of focus, a physiotherapist in a plain dark navy polo shirt kneels on one knee, holding the ankle of his right leg and guiding the movement.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His shorts are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: nothing; the light is soft daylight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at seated eye level, about two metres behind him, looking towards the window.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. The edge of the table where he sits is no lower than 60% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the floor of the room fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No medical symbols and no visible injury.

=============== IMAGE 14 OF 18 — scene: 23-fisioterapia — hair: cacheado-medio — file name: 23-fisioterapia__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The physiotherapy room of a football club in daylight. A padded treatment table, a wall bar, a large plain grey exercise ball, a rack of plain black dumbbells, and a wide window. Pale walls and a light-grey floor.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He sits on the edge of the treatment table, in the centre of the frame, with his back to the camera, sitting upright, both hands gripping the edge of the table at his sides, slowly stretching out his right leg, which wears a plain white knee brace.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue shorts and plain white trainers. He wears nothing over the shirt.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him and a little to the side, slightly out of focus, a physiotherapist in a plain dark navy polo shirt kneels on one knee, holding the ankle of his right leg and guiding the movement.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His shorts are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: nothing; the light is soft daylight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at seated eye level, about two metres behind him, looking towards the window.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. The edge of the table where he sits is no lower than 60% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the floor of the room fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No medical symbols and no visible injury.

=============== IMAGE 15 OF 18 — scene: 23-fisioterapia — hair: liso-medio — file name: 23-fisioterapia__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The physiotherapy room of a football club in daylight. A padded treatment table, a wall bar, a large plain grey exercise ball, a rack of plain black dumbbells, and a wide window. Pale walls and a light-grey floor.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He sits on the edge of the treatment table, in the centre of the frame, with his back to the camera, sitting upright, both hands gripping the edge of the table at his sides, slowly stretching out his right leg, which wears a plain white knee brace.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue shorts and plain white trainers. He wears nothing over the shirt.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him and a little to the side, slightly out of focus, a physiotherapist in a plain dark navy polo shirt kneels on one knee, holding the ankle of his right leg and guiding the movement.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His shorts are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: nothing; the light is soft daylight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at seated eye level, about two metres behind him, looking towards the window.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. The edge of the table where he sits is no lower than 60% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the floor of the room fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No medical symbols and no visible injury.

=============== IMAGE 16 OF 18 — scene: 23-fisioterapia — hair: cacheado-grande — file name: 23-fisioterapia__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The physiotherapy room of a football club in daylight. A padded treatment table, a wall bar, a large plain grey exercise ball, a rack of plain black dumbbells, and a wide window. Pale walls and a light-grey floor.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He sits on the edge of the treatment table, in the centre of the frame, with his back to the camera, sitting upright, both hands gripping the edge of the table at his sides, slowly stretching out his right leg, which wears a plain white knee brace.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue shorts and plain white trainers. He wears nothing over the shirt.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him and a little to the side, slightly out of focus, a physiotherapist in a plain dark navy polo shirt kneels on one knee, holding the ankle of his right leg and guiding the movement.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His shorts are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: nothing; the light is soft daylight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at seated eye level, about two metres behind him, looking towards the window.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. The edge of the table where he sits is no lower than 60% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the floor of the room fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No medical symbols and no visible injury.

=============== IMAGE 17 OF 18 — scene: 23-fisioterapia — hair: liso-grande — file name: 23-fisioterapia__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The physiotherapy room of a football club in daylight. A padded treatment table, a wall bar, a large plain grey exercise ball, a rack of plain black dumbbells, and a wide window. Pale walls and a light-grey floor.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He sits on the edge of the treatment table, in the centre of the frame, with his back to the camera, sitting upright, both hands gripping the edge of the table at his sides, slowly stretching out his right leg, which wears a plain white knee brace.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue shorts and plain white trainers. He wears nothing over the shirt.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him and a little to the side, slightly out of focus, a physiotherapist in a plain dark navy polo shirt kneels on one knee, holding the ankle of his right leg and guiding the movement.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His shorts are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: nothing; the light is soft daylight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at seated eye level, about two metres behind him, looking towards the window.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. The edge of the table where he sits is no lower than 60% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the floor of the room fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No medical symbols and no visible injury.

=============== IMAGE 18 OF 18 — scene: 23-fisioterapia — hair: careca — file name: 23-fisioterapia__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The physiotherapy room of a football club in daylight. A padded treatment table, a wall bar, a large plain grey exercise ball, a rack of plain black dumbbells, and a wide window. Pale walls and a light-grey floor.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He sits on the edge of the treatment table, in the centre of the frame, with his back to the camera, sitting upright, both hands gripping the edge of the table at his sides, slowly stretching out his right leg, which wears a plain white knee brace.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain dark navy-blue shorts and plain white trainers. He wears nothing over the shirt.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him and a little to the side, slightly out of focus, a physiotherapist in a plain dark navy polo shirt kneels on one knee, holding the ankle of his right leg and guiding the movement.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirt of the player.
- There is no cyan anywhere in the image.
- His shorts are dark navy blue and his trainers are white.
- Warm yellow or gold appears only on: nothing; the light is soft daylight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at seated eye level, about two metres behind him, looking towards the window.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. The edge of the table where he sits is no lower than 60% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the floor of the room fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No medical symbols and no visible injury.

=============== END OF THE 18 PROMPTS ===============
After image 18, write: "All 18 images done." If any image was skipped or could not be generated, say exactly which numbers.
````

## Pedido 4 — Cenas: 24-classico · 25-vaia

**Onde salvar cada imagem** (pastas dentro de `docs/arte/`)

| # | Pasta | Cena | Corte |
|--:|---|---|---|
| 1 | `cenas/24-classico/curto/` | Clássico | Curto |
| 2 | `cenas/24-classico/cacheado-medio/` | Clássico | Cacheado médio |
| 3 | `cenas/24-classico/liso-medio/` | Clássico | Liso médio |
| 4 | `cenas/24-classico/cacheado-grande/` | Clássico | Cacheado grande |
| 5 | `cenas/24-classico/liso-grande/` | Clássico | Liso grande |
| 6 | `cenas/24-classico/careca/` | Clássico | Careca |
| 7 | `cenas/25-vaia/curto/` | Vaia | Curto |
| 8 | `cenas/25-vaia/cacheado-medio/` | Vaia | Cacheado médio |
| 9 | `cenas/25-vaia/liso-medio/` | Vaia | Liso médio |
| 10 | `cenas/25-vaia/cacheado-grande/` | Vaia | Cacheado grande |
| 11 | `cenas/25-vaia/liso-grande/` | Vaia | Liso grande |
| 12 | `cenas/25-vaia/careca/` | Vaia | Careca |

````
You will generate 12 SEPARATE images in this conversation. Start from a clean slate: ignore everything from any earlier conversation.

WHAT THIS JOB IS
A set of illustrations for a mobile football career game. There are 2 different scenes, and each scene is painted 6 times, once for each hairstyle of the main character:
- Images 1 to 6: scene "24-classico". A packed football stadium on a late afternoon, seconds before the kick-off of a derby.
- Images 7 to 12: scene "25-vaia". A football stadium at night in light rain, right after a bad defeat.
The 6 hairstyles always come in this order: curto (short), cacheado-medio (medium curly), liso-medio (medium straight), cacheado-grande (long curly), liso-grande (long straight), careca (bald).

RULES FOR THE WHOLE JOB
1. Generate exactly 12 images, one for each prompt below, in the order given: image 1, then image 2, and so on up to image 12.
2. Each image is a separate, complete, full-size picture in vertical 4:5 format. Never combine images into one picture: no grid, no collage, no contact sheet, no split screen, no character sheet, no before-and-after.
3. Treat each prompt as independent. For each image, use only the text of its own prompt. Never carry an object, a person or a background from one scene into another scene.
4. Inside one scene, the ONLY difference between its 6 images is the hair of the main character. Keep the room or place, the camera, the pose, the other people, the colours and the painting style as close as possible across those 6 images.
5. When the scene changes (after image number: 6), start that scene fresh from its own prompt.
6. Before each image, write one short line outside the image with its number and file name, exactly as given in its heading, for example: "Image 1 of 12 - 24-classico__curto.jpeg".
7. If you cannot generate all 12 in one reply, generate as many as you can and stop. When I write "Continue with the next image.", carry on from the next number. Never start again from image 1 and never skip a number.

RULES THAT APPLY TO EVERY IMAGE
A. PAINTING STYLE. Semi-realistic painted illustration: soft blended shading, visible brush texture and only very thin, subtle linework. Not a comic, not a cartoon, no thick black outlines, no cel shading. All 12 images must look painted by the same artist.
B. THE MAIN CHARACTER IS SEEN FROM BEHIND. His face is never visible. He is horizontally centred and is the largest figure in the image.
C. THE BACK OF HIS SHIRT IS EMPTY AND UNCOVERED from the shoulders to the waist: one smooth, evenly lit surface. No number, no name, no print, and no arm, hand, strap, chair back, person or object in front of it. Software will write a number there afterwards.
D. KEY COLOURS. Bright magenta is used only for the football shirt (and the shirts of team-mates, when the prompt mentions team-mates). Cyan is used only for football shorts and socks, and only when the prompt asks for them. Software will recolour these two colours afterwards, so nothing else in the image may be magenta, pink, purple or cyan.
E. EVERYONE ELSE IS NEUTRAL. Crowds, flags, opponents and bystanders are in light grey, mid grey, navy, beige or off-white, exactly as each prompt says.
F. PLAIN CLOTHES AND OBJECTS. No badge, crest, emblem, logo, brand mark, sponsor or stripes on any clothing or object: shirts, tracksuits, jackets, coats, polo shirts, boots, trainers, balls, bags, glasses, speakers, screens and walls are completely plain.
G. NO WRITING. No text, letters, numbers, signs, labels, captions or watermarks anywhere inside any image. Papers, screens and boards are blank.
H. THE LOWER 40% IS DARK AND EMPTY. In every image the bottom 40% fades into deep navy shadow with no people, no objects and no detail, because interface panels will cover it. The main character and all the action stay in the upper 60%.
I. ORIGINAL PEOPLE. Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 1 OF 12 — scene: 24-classico — hair: curto — file name: 24-classico__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A packed football stadium on a late afternoon, seconds before the kick-off of a derby. The low sun gives the sky a warm glow and the floodlights are already on. Thin white smoke drifts across the stands.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He stands on the centre spot, in the centre of the frame, with his back to the camera, feet apart, arms relaxed at his sides, a plain white football on the grass just in front of his feet, staring at the opponents' half.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, the opposing team stands spread out across their half, facing him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. In the stand behind them, the crowd holds up one enormous plain light-grey flag with nothing on it. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- The smoke from the stands is white or light grey only: no coloured smoke.
- Warm yellow or gold appears only on: the low sun and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking straight at the opponents and the stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 2 OF 12 — scene: 24-classico — hair: cacheado-medio — file name: 24-classico__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A packed football stadium on a late afternoon, seconds before the kick-off of a derby. The low sun gives the sky a warm glow and the floodlights are already on. Thin white smoke drifts across the stands.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands on the centre spot, in the centre of the frame, with his back to the camera, feet apart, arms relaxed at his sides, a plain white football on the grass just in front of his feet, staring at the opponents' half.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, the opposing team stands spread out across their half, facing him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. In the stand behind them, the crowd holds up one enormous plain light-grey flag with nothing on it. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- The smoke from the stands is white or light grey only: no coloured smoke.
- Warm yellow or gold appears only on: the low sun and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking straight at the opponents and the stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 3 OF 12 — scene: 24-classico — hair: liso-medio — file name: 24-classico__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A packed football stadium on a late afternoon, seconds before the kick-off of a derby. The low sun gives the sky a warm glow and the floodlights are already on. Thin white smoke drifts across the stands.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands on the centre spot, in the centre of the frame, with his back to the camera, feet apart, arms relaxed at his sides, a plain white football on the grass just in front of his feet, staring at the opponents' half.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, the opposing team stands spread out across their half, facing him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. In the stand behind them, the crowd holds up one enormous plain light-grey flag with nothing on it. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- The smoke from the stands is white or light grey only: no coloured smoke.
- Warm yellow or gold appears only on: the low sun and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking straight at the opponents and the stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 4 OF 12 — scene: 24-classico — hair: cacheado-grande — file name: 24-classico__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A packed football stadium on a late afternoon, seconds before the kick-off of a derby. The low sun gives the sky a warm glow and the floodlights are already on. Thin white smoke drifts across the stands.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He stands on the centre spot, in the centre of the frame, with his back to the camera, feet apart, arms relaxed at his sides, a plain white football on the grass just in front of his feet, staring at the opponents' half.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, the opposing team stands spread out across their half, facing him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. In the stand behind them, the crowd holds up one enormous plain light-grey flag with nothing on it. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- The smoke from the stands is white or light grey only: no coloured smoke.
- Warm yellow or gold appears only on: the low sun and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking straight at the opponents and the stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 5 OF 12 — scene: 24-classico — hair: liso-grande — file name: 24-classico__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A packed football stadium on a late afternoon, seconds before the kick-off of a derby. The low sun gives the sky a warm glow and the floodlights are already on. Thin white smoke drifts across the stands.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He stands on the centre spot, in the centre of the frame, with his back to the camera, feet apart, arms relaxed at his sides, a plain white football on the grass just in front of his feet, staring at the opponents' half.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, the opposing team stands spread out across their half, facing him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. In the stand behind them, the crowd holds up one enormous plain light-grey flag with nothing on it. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- The smoke from the stands is white or light grey only: no coloured smoke.
- Warm yellow or gold appears only on: the low sun and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking straight at the opponents and the stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 6 OF 12 — scene: 24-classico — hair: careca — file name: 24-classico__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A packed football stadium on a late afternoon, seconds before the kick-off of a derby. The low sun gives the sky a warm glow and the floodlights are already on. Thin white smoke drifts across the stands.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He stands on the centre spot, in the centre of the frame, with his back to the camera, feet apart, arms relaxed at his sides, a plain white football on the grass just in front of his feet, staring at the opponents' half.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, the opposing team stands spread out across their half, facing him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. In the stand behind them, the crowd holds up one enormous plain light-grey flag with nothing on it. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- The smoke from the stands is white or light grey only: no coloured smoke.
- Warm yellow or gold appears only on: the low sun and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking straight at the opponents and the stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 7 OF 12 — scene: 25-vaia — hair: curto — file name: 25-vaia__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night in light rain, right after a bad defeat. The floodlights give a cold white light and the grass is wet and shiny.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He walks slowly away from the camera towards the dark mouth of the players' tunnel, in the centre of the frame, with his back to the camera, head down, shoulders slumped, arms hanging loosely at his sides.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In the stand above the tunnel, the crowd is on its feet with arms thrown up and thumbs pointing down, some turning their backs. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. Far to one side, one team-mate in the same magenta-and-cyan kit also walks off alone, small and out of focus.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is cold white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking at the tunnel and the stand above it.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the wet grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No objects thrown onto the pitch.

=============== IMAGE 8 OF 12 — scene: 25-vaia — hair: cacheado-medio — file name: 25-vaia__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night in light rain, right after a bad defeat. The floodlights give a cold white light and the grass is wet and shiny.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He walks slowly away from the camera towards the dark mouth of the players' tunnel, in the centre of the frame, with his back to the camera, head down, shoulders slumped, arms hanging loosely at his sides.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In the stand above the tunnel, the crowd is on its feet with arms thrown up and thumbs pointing down, some turning their backs. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. Far to one side, one team-mate in the same magenta-and-cyan kit also walks off alone, small and out of focus.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is cold white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking at the tunnel and the stand above it.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the wet grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No objects thrown onto the pitch.

=============== IMAGE 9 OF 12 — scene: 25-vaia — hair: liso-medio — file name: 25-vaia__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night in light rain, right after a bad defeat. The floodlights give a cold white light and the grass is wet and shiny.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He walks slowly away from the camera towards the dark mouth of the players' tunnel, in the centre of the frame, with his back to the camera, head down, shoulders slumped, arms hanging loosely at his sides.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In the stand above the tunnel, the crowd is on its feet with arms thrown up and thumbs pointing down, some turning their backs. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. Far to one side, one team-mate in the same magenta-and-cyan kit also walks off alone, small and out of focus.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is cold white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking at the tunnel and the stand above it.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the wet grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No objects thrown onto the pitch.

=============== IMAGE 10 OF 12 — scene: 25-vaia — hair: cacheado-grande — file name: 25-vaia__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night in light rain, right after a bad defeat. The floodlights give a cold white light and the grass is wet and shiny.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He walks slowly away from the camera towards the dark mouth of the players' tunnel, in the centre of the frame, with his back to the camera, head down, shoulders slumped, arms hanging loosely at his sides.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In the stand above the tunnel, the crowd is on its feet with arms thrown up and thumbs pointing down, some turning their backs. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. Far to one side, one team-mate in the same magenta-and-cyan kit also walks off alone, small and out of focus.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is cold white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking at the tunnel and the stand above it.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the wet grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No objects thrown onto the pitch.

=============== IMAGE 11 OF 12 — scene: 25-vaia — hair: liso-grande — file name: 25-vaia__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night in light rain, right after a bad defeat. The floodlights give a cold white light and the grass is wet and shiny.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He walks slowly away from the camera towards the dark mouth of the players' tunnel, in the centre of the frame, with his back to the camera, head down, shoulders slumped, arms hanging loosely at his sides.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In the stand above the tunnel, the crowd is on its feet with arms thrown up and thumbs pointing down, some turning their backs. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. Far to one side, one team-mate in the same magenta-and-cyan kit also walks off alone, small and out of focus.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is cold white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking at the tunnel and the stand above it.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the wet grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No objects thrown onto the pitch.

=============== IMAGE 12 OF 12 — scene: 25-vaia — hair: careca — file name: 25-vaia__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night in light rain, right after a bad defeat. The floodlights give a cold white light and the grass is wet and shiny.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He walks slowly away from the camera towards the dark mouth of the players' tunnel, in the centre of the frame, with his back to the camera, head down, shoulders slumped, arms hanging loosely at his sides.

CLOTHING
He wears a plain bright magenta short-sleeved football shirt, plain cyan shorts, plain cyan knee-high socks and plain black boots. The cyan shorts and socks are clearly lit and fully visible.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the magenta shirt is fully visible to the camera: one smooth, flat, evenly lit magenta surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In the stand above the tunnel, the crowd is on its feet with arms thrown up and thumbs pointing down, some turning their backs. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. Far to one side, one team-mate in the same magenta-and-cyan kit also walks off alone, small and out of focus.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Magenta appears in one place only: the shirts of the player and of his team-mates.
- Cyan appears in one place only: the shorts and socks of the player and of his team-mates.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is cold white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking at the tunnel and the stand above it.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the wet grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No objects thrown onto the pitch.

=============== END OF THE 12 PROMPTS ===============
After image 12, write: "All 12 images done." If any image was skipped or could not be generated, say exactly which numbers.
````

## Pedido 5 — Goleiro: 01-titulo · 04-penalti · 12-defesa

**Onde salvar cada imagem** (pastas dentro de `docs/arte/`)

| # | Pasta | Cena | Corte |
|--:|---|---|---|
| 1 | `cenas-goleiro/01-titulo/curto/` | Título | Curto |
| 2 | `cenas-goleiro/01-titulo/cacheado-medio/` | Título | Cacheado médio |
| 3 | `cenas-goleiro/01-titulo/liso-medio/` | Título | Liso médio |
| 4 | `cenas-goleiro/01-titulo/cacheado-grande/` | Título | Cacheado grande |
| 5 | `cenas-goleiro/01-titulo/liso-grande/` | Título | Liso grande |
| 6 | `cenas-goleiro/01-titulo/careca/` | Título | Careca |
| 7 | `cenas-goleiro/04-penalti/curto/` | Pênalti | Curto |
| 8 | `cenas-goleiro/04-penalti/cacheado-medio/` | Pênalti | Cacheado médio |
| 9 | `cenas-goleiro/04-penalti/liso-medio/` | Pênalti | Liso médio |
| 10 | `cenas-goleiro/04-penalti/cacheado-grande/` | Pênalti | Cacheado grande |
| 11 | `cenas-goleiro/04-penalti/liso-grande/` | Pênalti | Liso grande |
| 12 | `cenas-goleiro/04-penalti/careca/` | Pênalti | Careca |
| 13 | `cenas-goleiro/12-defesa/curto/` | Defesa | Curto |
| 14 | `cenas-goleiro/12-defesa/cacheado-medio/` | Defesa | Cacheado médio |
| 15 | `cenas-goleiro/12-defesa/liso-medio/` | Defesa | Liso médio |
| 16 | `cenas-goleiro/12-defesa/cacheado-grande/` | Defesa | Cacheado grande |
| 17 | `cenas-goleiro/12-defesa/liso-grande/` | Defesa | Liso grande |
| 18 | `cenas-goleiro/12-defesa/careca/` | Defesa | Careca |

````
You will generate 18 SEPARATE images in this conversation. Start from a clean slate: ignore everything from any earlier conversation.

WHAT THIS JOB IS
A set of illustrations for a mobile football career game. There are 3 different scenes, and each scene is painted 6 times, once for each hairstyle of the main character:
- Images 1 to 6: scene "01-titulo". A football stadium at night, seconds after the final whistle of a cup final that his team has just won.
- Images 7 to 12: scene "04-penalti". A football stadium at night during a penalty kick in a decisive match, seen from inside the goal.
- Images 13 to 18: scene "12-defesa". A full football stadium at night, at the instant of a great save.
The 6 hairstyles always come in this order: curto (short), cacheado-medio (medium curly), liso-medio (medium straight), cacheado-grande (long curly), liso-grande (long straight), careca (bald).

RULES FOR THE WHOLE JOB
1. Generate exactly 18 images, one for each prompt below, in the order given: image 1, then image 2, and so on up to image 18.
2. Each image is a separate, complete, full-size picture in vertical 4:5 format. Never combine images into one picture: no grid, no collage, no contact sheet, no split screen, no character sheet, no before-and-after.
3. Treat each prompt as independent. For each image, use only the text of its own prompt. Never carry an object, a person or a background from one scene into another scene.
4. Inside one scene, the ONLY difference between its 6 images is the hair of the main character. Keep the room or place, the camera, the pose, the other people, the colours and the painting style as close as possible across those 6 images.
5. When the scene changes (after image number: 6 and 12), start that scene fresh from its own prompt.
6. Before each image, write one short line outside the image with its number and file name, exactly as given in its heading, for example: "Image 1 of 18 - 01-titulo__curto.jpeg".
7. If you cannot generate all 18 in one reply, generate as many as you can and stop. When I write "Continue with the next image.", carry on from the next number. Never start again from image 1 and never skip a number.

RULES THAT APPLY TO EVERY IMAGE
A. PAINTING STYLE. Semi-realistic painted illustration: soft blended shading, visible brush texture and only very thin, subtle linework. Not a comic, not a cartoon, no thick black outlines, no cel shading. All 18 images must look painted by the same artist.
B. THE MAIN CHARACTER IS SEEN FROM BEHIND. His face is never visible. He is horizontally centred and is the largest figure in the image.
C. THE BACK OF HIS SHIRT IS EMPTY AND UNCOVERED from the shoulders to the waist: one smooth, evenly lit surface. No number, no name, no print, and no arm, hand, strap, chair back, person or object in front of it. Software will write a number there afterwards.
D. KEY COLOURS. Bright magenta is used only for the football shirt (and the shirts of team-mates, when the prompt mentions team-mates). Cyan is used only for football shorts and socks, and only when the prompt asks for them. Software will recolour these two colours afterwards, so nothing else in the image may be magenta, pink, purple or cyan. The one exception is the main character himself: in this job he is a GOALKEEPER and wears a rose-pink (#F0569B) long-sleeved shirt, rose-pink shorts and socks and vivid orange gloves, exactly as each prompt says. His team-mates wear magenta and cyan.
E. EVERYONE ELSE IS NEUTRAL. Crowds, flags, opponents and bystanders are in light grey, mid grey, navy, beige or off-white, exactly as each prompt says.
F. PLAIN CLOTHES AND OBJECTS. No badge, crest, emblem, logo, brand mark, sponsor or stripes on any clothing or object: shirts, tracksuits, jackets, coats, polo shirts, boots, trainers, balls, bags, glasses, speakers, screens and walls are completely plain.
G. NO WRITING. No text, letters, numbers, signs, labels, captions or watermarks anywhere inside any image. Papers, screens and boards are blank.
H. THE LOWER 40% IS DARK AND EMPTY. In every image the bottom 40% fades into deep navy shadow with no people, no objects and no detail, because interface panels will cover it. The main character and all the action stay in the upper 60%.
I. ORIGINAL PEOPLE. Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 1 OF 18 — scene: 01-titulo — hair: curto — file name: 01-titulo__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night, seconds after the final whistle of a cup final that his team has just won. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He stands on the pitch in the centre of the frame, with his back to the camera, his left arm raised straight up, gloved index finger pointing to the night sky, head tilted slightly upwards, in a quiet, emotional celebration. His right arm hangs at his side.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, slightly out of focus, four team-mates in plain magenta shirts, cyan shorts and cyan socks, with blank shirts, run towards each other to hug. Further away, on a small plain podium on the pitch, stands a simple gold cup: a round bowl with two curved handles, a short stem and a square dark base, like a generic sports-day trophy. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. A few small pieces of off-white paper confetti fall through the floodlight beams.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the trophy and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- The trophy is a generic cup of original design and does not copy any real trophy.

=============== IMAGE 2 OF 18 — scene: 01-titulo — hair: cacheado-medio — file name: 01-titulo__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night, seconds after the final whistle of a cup final that his team has just won. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands on the pitch in the centre of the frame, with his back to the camera, his left arm raised straight up, gloved index finger pointing to the night sky, head tilted slightly upwards, in a quiet, emotional celebration. His right arm hangs at his side.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, slightly out of focus, four team-mates in plain magenta shirts, cyan shorts and cyan socks, with blank shirts, run towards each other to hug. Further away, on a small plain podium on the pitch, stands a simple gold cup: a round bowl with two curved handles, a short stem and a square dark base, like a generic sports-day trophy. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. A few small pieces of off-white paper confetti fall through the floodlight beams.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the trophy and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- The trophy is a generic cup of original design and does not copy any real trophy.

=============== IMAGE 3 OF 18 — scene: 01-titulo — hair: liso-medio — file name: 01-titulo__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night, seconds after the final whistle of a cup final that his team has just won. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands on the pitch in the centre of the frame, with his back to the camera, his left arm raised straight up, gloved index finger pointing to the night sky, head tilted slightly upwards, in a quiet, emotional celebration. His right arm hangs at his side.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, slightly out of focus, four team-mates in plain magenta shirts, cyan shorts and cyan socks, with blank shirts, run towards each other to hug. Further away, on a small plain podium on the pitch, stands a simple gold cup: a round bowl with two curved handles, a short stem and a square dark base, like a generic sports-day trophy. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. A few small pieces of off-white paper confetti fall through the floodlight beams.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the trophy and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- The trophy is a generic cup of original design and does not copy any real trophy.

=============== IMAGE 4 OF 18 — scene: 01-titulo — hair: cacheado-grande — file name: 01-titulo__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night, seconds after the final whistle of a cup final that his team has just won. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He stands on the pitch in the centre of the frame, with his back to the camera, his left arm raised straight up, gloved index finger pointing to the night sky, head tilted slightly upwards, in a quiet, emotional celebration. His right arm hangs at his side.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, slightly out of focus, four team-mates in plain magenta shirts, cyan shorts and cyan socks, with blank shirts, run towards each other to hug. Further away, on a small plain podium on the pitch, stands a simple gold cup: a round bowl with two curved handles, a short stem and a square dark base, like a generic sports-day trophy. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. A few small pieces of off-white paper confetti fall through the floodlight beams.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the trophy and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- The trophy is a generic cup of original design and does not copy any real trophy.

=============== IMAGE 5 OF 18 — scene: 01-titulo — hair: liso-grande — file name: 01-titulo__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night, seconds after the final whistle of a cup final that his team has just won. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He stands on the pitch in the centre of the frame, with his back to the camera, his left arm raised straight up, gloved index finger pointing to the night sky, head tilted slightly upwards, in a quiet, emotional celebration. His right arm hangs at his side.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, slightly out of focus, four team-mates in plain magenta shirts, cyan shorts and cyan socks, with blank shirts, run towards each other to hug. Further away, on a small plain podium on the pitch, stands a simple gold cup: a round bowl with two curved handles, a short stem and a square dark base, like a generic sports-day trophy. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. A few small pieces of off-white paper confetti fall through the floodlight beams.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the trophy and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- The trophy is a generic cup of original design and does not copy any real trophy.

=============== IMAGE 6 OF 18 — scene: 01-titulo — hair: careca — file name: 01-titulo__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night, seconds after the final whistle of a cup final that his team has just won. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He stands on the pitch in the centre of the frame, with his back to the camera, his left arm raised straight up, gloved index finger pointing to the night sky, head tilted slightly upwards, in a quiet, emotional celebration. His right arm hangs at his side.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, slightly out of focus, four team-mates in plain magenta shirts, cyan shorts and cyan socks, with blank shirts, run towards each other to hug. Further away, on a small plain podium on the pitch, stands a simple gold cup: a round bowl with two curved handles, a short stem and a square dark base, like a generic sports-day trophy. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. A few small pieces of off-white paper confetti fall through the floodlight beams.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the trophy and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- The trophy is a generic cup of original design and does not copy any real trophy.

=============== IMAGE 7 OF 18 — scene: 04-penalti — hair: curto — file name: 04-penalti__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night during a penalty kick in a decisive match, seen from inside the goal. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He stands on the goal line, in the centre of the frame, with his back to the camera, knees bent, body low and balanced, both gloved arms spread wide to the sides, ready to dive.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, about eleven metres away and slightly out of focus, a plain white football rests on the penalty spot and an opponent takes his run-up towards it. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. Behind the taker, players of both teams wait at the edge of the penalty area. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. The white goalposts frame the image on the left and right edges; the net is behind the camera and is not visible.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about two metres behind him, looking out at the penalty spot. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 8 OF 18 — scene: 04-penalti — hair: cacheado-medio — file name: 04-penalti__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night during a penalty kick in a decisive match, seen from inside the goal. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands on the goal line, in the centre of the frame, with his back to the camera, knees bent, body low and balanced, both gloved arms spread wide to the sides, ready to dive.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, about eleven metres away and slightly out of focus, a plain white football rests on the penalty spot and an opponent takes his run-up towards it. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. Behind the taker, players of both teams wait at the edge of the penalty area. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. The white goalposts frame the image on the left and right edges; the net is behind the camera and is not visible.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about two metres behind him, looking out at the penalty spot. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 9 OF 18 — scene: 04-penalti — hair: liso-medio — file name: 04-penalti__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night during a penalty kick in a decisive match, seen from inside the goal. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands on the goal line, in the centre of the frame, with his back to the camera, knees bent, body low and balanced, both gloved arms spread wide to the sides, ready to dive.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, about eleven metres away and slightly out of focus, a plain white football rests on the penalty spot and an opponent takes his run-up towards it. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. Behind the taker, players of both teams wait at the edge of the penalty area. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. The white goalposts frame the image on the left and right edges; the net is behind the camera and is not visible.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about two metres behind him, looking out at the penalty spot. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 10 OF 18 — scene: 04-penalti — hair: cacheado-grande — file name: 04-penalti__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night during a penalty kick in a decisive match, seen from inside the goal. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He stands on the goal line, in the centre of the frame, with his back to the camera, knees bent, body low and balanced, both gloved arms spread wide to the sides, ready to dive.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, about eleven metres away and slightly out of focus, a plain white football rests on the penalty spot and an opponent takes his run-up towards it. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. Behind the taker, players of both teams wait at the edge of the penalty area. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. The white goalposts frame the image on the left and right edges; the net is behind the camera and is not visible.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about two metres behind him, looking out at the penalty spot. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 11 OF 18 — scene: 04-penalti — hair: liso-grande — file name: 04-penalti__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night during a penalty kick in a decisive match, seen from inside the goal. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He stands on the goal line, in the centre of the frame, with his back to the camera, knees bent, body low and balanced, both gloved arms spread wide to the sides, ready to dive.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, about eleven metres away and slightly out of focus, a plain white football rests on the penalty spot and an opponent takes his run-up towards it. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. Behind the taker, players of both teams wait at the edge of the penalty area. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. The white goalposts frame the image on the left and right edges; the net is behind the camera and is not visible.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about two metres behind him, looking out at the penalty spot. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 12 OF 18 — scene: 04-penalti — hair: careca — file name: 04-penalti__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night during a penalty kick in a decisive match, seen from inside the goal. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He stands on the goal line, in the centre of the frame, with his back to the camera, knees bent, body low and balanced, both gloved arms spread wide to the sides, ready to dive.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, about eleven metres away and slightly out of focus, a plain white football rests on the penalty spot and an opponent takes his run-up towards it. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. Behind the taker, players of both teams wait at the edge of the penalty area. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them. The white goalposts frame the image on the left and right edges; the net is behind the camera and is not visible.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about two metres behind him, looking out at the penalty spot. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 13 OF 18 — scene: 12-defesa — hair: curto — file name: 12-defesa__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, at the instant of a great save. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He is in full horizontal flight, diving to his right, in the centre of the frame, with his back to the camera, body stretched parallel to the ground, his right gloved hand pushing a plain white football away at the tips of his fingers, his left arm stretched along the same line.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Beyond him, slightly out of focus, the opponent who took the shot watches with his hands going to his head. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. One team-mate in a plain magenta shirt, cyan shorts and cyan socks runs back. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about three metres behind him, looking out at the pitch. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air, between 30% and 60% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 14 OF 18 — scene: 12-defesa — hair: cacheado-medio — file name: 12-defesa__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, at the instant of a great save. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He is in full horizontal flight, diving to his right, in the centre of the frame, with his back to the camera, body stretched parallel to the ground, his right gloved hand pushing a plain white football away at the tips of his fingers, his left arm stretched along the same line.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Beyond him, slightly out of focus, the opponent who took the shot watches with his hands going to his head. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. One team-mate in a plain magenta shirt, cyan shorts and cyan socks runs back. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about three metres behind him, looking out at the pitch. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air, between 30% and 60% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 15 OF 18 — scene: 12-defesa — hair: liso-medio — file name: 12-defesa__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, at the instant of a great save. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He is in full horizontal flight, diving to his right, in the centre of the frame, with his back to the camera, body stretched parallel to the ground, his right gloved hand pushing a plain white football away at the tips of his fingers, his left arm stretched along the same line.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Beyond him, slightly out of focus, the opponent who took the shot watches with his hands going to his head. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. One team-mate in a plain magenta shirt, cyan shorts and cyan socks runs back. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about three metres behind him, looking out at the pitch. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air, between 30% and 60% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 16 OF 18 — scene: 12-defesa — hair: cacheado-grande — file name: 12-defesa__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, at the instant of a great save. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He is in full horizontal flight, diving to his right, in the centre of the frame, with his back to the camera, body stretched parallel to the ground, his right gloved hand pushing a plain white football away at the tips of his fingers, his left arm stretched along the same line.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Beyond him, slightly out of focus, the opponent who took the shot watches with his hands going to his head. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. One team-mate in a plain magenta shirt, cyan shorts and cyan socks runs back. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about three metres behind him, looking out at the pitch. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air, between 30% and 60% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 17 OF 18 — scene: 12-defesa — hair: liso-grande — file name: 12-defesa__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, at the instant of a great save. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He is in full horizontal flight, diving to his right, in the centre of the frame, with his back to the camera, body stretched parallel to the ground, his right gloved hand pushing a plain white football away at the tips of his fingers, his left arm stretched along the same line.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Beyond him, slightly out of focus, the opponent who took the shot watches with his hands going to his head. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. One team-mate in a plain magenta shirt, cyan shorts and cyan socks runs back. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about three metres behind him, looking out at the pitch. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air, between 30% and 60% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 18 OF 18 — scene: 12-defesa — hair: careca — file name: 12-defesa__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, at the instant of a great save. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He is in full horizontal flight, diving to his right, in the centre of the frame, with his back to the camera, body stretched parallel to the ground, his right gloved hand pushing a plain white football away at the tips of his fingers, his left arm stretched along the same line.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Beyond him, slightly out of focus, the opponent who took the shot watches with his hands going to his head. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. One team-mate in a plain magenta shirt, cyan shorts and cyan socks runs back. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about three metres behind him, looking out at the pitch. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air, between 30% and 60% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== END OF THE 18 PROMPTS ===============
After image 18, write: "All 18 images done." If any image was skipped or could not be generated, say exactly which numbers.
````

## Pedido 6 — Goleiro: 22-saida-do-gol · 21-estadio · 24-classico

**Onde salvar cada imagem** (pastas dentro de `docs/arte/`)

| # | Pasta | Cena | Corte |
|--:|---|---|---|
| 1 | `cenas-goleiro/22-saida-do-gol/curto/` | Saída do gol | Curto |
| 2 | `cenas-goleiro/22-saida-do-gol/cacheado-medio/` | Saída do gol | Cacheado médio |
| 3 | `cenas-goleiro/22-saida-do-gol/liso-medio/` | Saída do gol | Liso médio |
| 4 | `cenas-goleiro/22-saida-do-gol/cacheado-grande/` | Saída do gol | Cacheado grande |
| 5 | `cenas-goleiro/22-saida-do-gol/liso-grande/` | Saída do gol | Liso grande |
| 6 | `cenas-goleiro/22-saida-do-gol/careca/` | Saída do gol | Careca |
| 7 | `cenas-goleiro/21-estadio/curto/` | Estádio | Curto |
| 8 | `cenas-goleiro/21-estadio/cacheado-medio/` | Estádio | Cacheado médio |
| 9 | `cenas-goleiro/21-estadio/liso-medio/` | Estádio | Liso médio |
| 10 | `cenas-goleiro/21-estadio/cacheado-grande/` | Estádio | Cacheado grande |
| 11 | `cenas-goleiro/21-estadio/liso-grande/` | Estádio | Liso grande |
| 12 | `cenas-goleiro/21-estadio/careca/` | Estádio | Careca |
| 13 | `cenas-goleiro/24-classico/curto/` | Clássico | Curto |
| 14 | `cenas-goleiro/24-classico/cacheado-medio/` | Clássico | Cacheado médio |
| 15 | `cenas-goleiro/24-classico/liso-medio/` | Clássico | Liso médio |
| 16 | `cenas-goleiro/24-classico/cacheado-grande/` | Clássico | Cacheado grande |
| 17 | `cenas-goleiro/24-classico/liso-grande/` | Clássico | Liso grande |
| 18 | `cenas-goleiro/24-classico/careca/` | Clássico | Careca |

````
You will generate 18 SEPARATE images in this conversation. Start from a clean slate: ignore everything from any earlier conversation.

WHAT THIS JOB IS
A set of illustrations for a mobile football career game. There are 3 different scenes, and each scene is painted 6 times, once for each hairstyle of the main character:
- Images 1 to 6: scene "22-saida-do-gol". A full football stadium at night, during a corner kick in a tense match.
- Images 7 to 12: scene "21-estadio". A full football stadium at night, in the middle of a league match.
- Images 13 to 18: scene "24-classico". A packed football stadium on a late afternoon, seconds before the kick-off of a derby.
The 6 hairstyles always come in this order: curto (short), cacheado-medio (medium curly), liso-medio (medium straight), cacheado-grande (long curly), liso-grande (long straight), careca (bald).

RULES FOR THE WHOLE JOB
1. Generate exactly 18 images, one for each prompt below, in the order given: image 1, then image 2, and so on up to image 18.
2. Each image is a separate, complete, full-size picture in vertical 4:5 format. Never combine images into one picture: no grid, no collage, no contact sheet, no split screen, no character sheet, no before-and-after.
3. Treat each prompt as independent. For each image, use only the text of its own prompt. Never carry an object, a person or a background from one scene into another scene.
4. Inside one scene, the ONLY difference between its 6 images is the hair of the main character. Keep the room or place, the camera, the pose, the other people, the colours and the painting style as close as possible across those 6 images.
5. When the scene changes (after image number: 6 and 12), start that scene fresh from its own prompt.
6. Before each image, write one short line outside the image with its number and file name, exactly as given in its heading, for example: "Image 1 of 18 - 22-saida-do-gol__curto.jpeg".
7. If you cannot generate all 18 in one reply, generate as many as you can and stop. When I write "Continue with the next image.", carry on from the next number. Never start again from image 1 and never skip a number.

RULES THAT APPLY TO EVERY IMAGE
A. PAINTING STYLE. Semi-realistic painted illustration: soft blended shading, visible brush texture and only very thin, subtle linework. Not a comic, not a cartoon, no thick black outlines, no cel shading. All 18 images must look painted by the same artist.
B. THE MAIN CHARACTER IS SEEN FROM BEHIND. His face is never visible. He is horizontally centred and is the largest figure in the image.
C. THE BACK OF HIS SHIRT IS EMPTY AND UNCOVERED from the shoulders to the waist: one smooth, evenly lit surface. No number, no name, no print, and no arm, hand, strap, chair back, person or object in front of it. Software will write a number there afterwards.
D. KEY COLOURS. Bright magenta is used only for the football shirt (and the shirts of team-mates, when the prompt mentions team-mates). Cyan is used only for football shorts and socks, and only when the prompt asks for them. Software will recolour these two colours afterwards, so nothing else in the image may be magenta, pink, purple or cyan. The one exception is the main character himself: in this job he is a GOALKEEPER and wears a rose-pink (#F0569B) long-sleeved shirt, rose-pink shorts and socks and vivid orange gloves, exactly as each prompt says. His team-mates wear magenta and cyan.
E. EVERYONE ELSE IS NEUTRAL. Crowds, flags, opponents and bystanders are in light grey, mid grey, navy, beige or off-white, exactly as each prompt says.
F. PLAIN CLOTHES AND OBJECTS. No badge, crest, emblem, logo, brand mark, sponsor or stripes on any clothing or object: shirts, tracksuits, jackets, coats, polo shirts, boots, trainers, balls, bags, glasses, speakers, screens and walls are completely plain.
G. NO WRITING. No text, letters, numbers, signs, labels, captions or watermarks anywhere inside any image. Papers, screens and boards are blank.
H. THE LOWER 40% IS DARK AND EMPTY. In every image the bottom 40% fades into deep navy shadow with no people, no objects and no detail, because interface panels will cover it. The main character and all the action stay in the upper 60%.
I. ORIGINAL PEOPLE. Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 1 OF 18 — scene: 22-saida-do-gol — hair: curto — file name: 22-saida-do-gol__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, during a corner kick in a tense match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He is in mid-air, at the highest point of a jump, in the centre of the frame, with his back to the camera, rising above everyone else, both gloved hands stretched straight up above his head, catching a plain white football. One knee is raised for protection.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Below him and to the sides, two opponents jump but are clearly lower than him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. Two team-mates in plain magenta shirts, cyan shorts and cyan socks stand nearby. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking out at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air: his boots are no lower than 65% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 2 OF 18 — scene: 22-saida-do-gol — hair: cacheado-medio — file name: 22-saida-do-gol__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, during a corner kick in a tense match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He is in mid-air, at the highest point of a jump, in the centre of the frame, with his back to the camera, rising above everyone else, both gloved hands stretched straight up above his head, catching a plain white football. One knee is raised for protection.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Below him and to the sides, two opponents jump but are clearly lower than him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. Two team-mates in plain magenta shirts, cyan shorts and cyan socks stand nearby. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking out at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air: his boots are no lower than 65% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 3 OF 18 — scene: 22-saida-do-gol — hair: liso-medio — file name: 22-saida-do-gol__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, during a corner kick in a tense match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He is in mid-air, at the highest point of a jump, in the centre of the frame, with his back to the camera, rising above everyone else, both gloved hands stretched straight up above his head, catching a plain white football. One knee is raised for protection.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Below him and to the sides, two opponents jump but are clearly lower than him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. Two team-mates in plain magenta shirts, cyan shorts and cyan socks stand nearby. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking out at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air: his boots are no lower than 65% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 4 OF 18 — scene: 22-saida-do-gol — hair: cacheado-grande — file name: 22-saida-do-gol__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, during a corner kick in a tense match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He is in mid-air, at the highest point of a jump, in the centre of the frame, with his back to the camera, rising above everyone else, both gloved hands stretched straight up above his head, catching a plain white football. One knee is raised for protection.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Below him and to the sides, two opponents jump but are clearly lower than him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. Two team-mates in plain magenta shirts, cyan shorts and cyan socks stand nearby. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking out at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air: his boots are no lower than 65% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 5 OF 18 — scene: 22-saida-do-gol — hair: liso-grande — file name: 22-saida-do-gol__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, during a corner kick in a tense match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He is in mid-air, at the highest point of a jump, in the centre of the frame, with his back to the camera, rising above everyone else, both gloved hands stretched straight up above his head, catching a plain white football. One knee is raised for protection.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Below him and to the sides, two opponents jump but are clearly lower than him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. Two team-mates in plain magenta shirts, cyan shorts and cyan socks stand nearby. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking out at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air: his boots are no lower than 65% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 6 OF 18 — scene: 22-saida-do-gol — hair: careca — file name: 22-saida-do-gol__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, during a corner kick in a tense match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He is in mid-air, at the highest point of a jump, in the centre of the frame, with his back to the camera, rising above everyone else, both gloved hands stretched straight up above his head, catching a plain white football. One knee is raised for protection.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Below him and to the sides, two opponents jump but are clearly lower than him. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. Two team-mates in plain magenta shirts, cyan shorts and cyan socks stand nearby. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind him, looking out at the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His whole body is in the air: his boots are no lower than 65% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 7 OF 18 — scene: 21-estadio — hair: curto — file name: 21-estadio__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, in the middle of a league match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He stands at the edge of his penalty area, in the centre of the frame, with his back to the camera, feet apart, his right gloved arm stretched out to the side, pointing and organising his defence.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, four team-mates in plain magenta shirts, cyan shorts and cyan socks form a defensive line. Further up the pitch, small and blurred, players of both teams contest the ball. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 8 OF 18 — scene: 21-estadio — hair: cacheado-medio — file name: 21-estadio__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, in the middle of a league match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands at the edge of his penalty area, in the centre of the frame, with his back to the camera, feet apart, his right gloved arm stretched out to the side, pointing and organising his defence.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, four team-mates in plain magenta shirts, cyan shorts and cyan socks form a defensive line. Further up the pitch, small and blurred, players of both teams contest the ball. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 9 OF 18 — scene: 21-estadio — hair: liso-medio — file name: 21-estadio__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, in the middle of a league match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands at the edge of his penalty area, in the centre of the frame, with his back to the camera, feet apart, his right gloved arm stretched out to the side, pointing and organising his defence.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, four team-mates in plain magenta shirts, cyan shorts and cyan socks form a defensive line. Further up the pitch, small and blurred, players of both teams contest the ball. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 10 OF 18 — scene: 21-estadio — hair: cacheado-grande — file name: 21-estadio__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, in the middle of a league match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He stands at the edge of his penalty area, in the centre of the frame, with his back to the camera, feet apart, his right gloved arm stretched out to the side, pointing and organising his defence.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, four team-mates in plain magenta shirts, cyan shorts and cyan socks form a defensive line. Further up the pitch, small and blurred, players of both teams contest the ball. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 11 OF 18 — scene: 21-estadio — hair: liso-grande — file name: 21-estadio__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, in the middle of a league match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He stands at the edge of his penalty area, in the centre of the frame, with his back to the camera, feet apart, his right gloved arm stretched out to the side, pointing and organising his defence.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, four team-mates in plain magenta shirts, cyan shorts and cyan socks form a defensive line. Further up the pitch, small and blurred, players of both teams contest the ball. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 12 OF 18 — scene: 21-estadio — hair: careca — file name: 21-estadio__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at night, in the middle of a league match. Floodlights shine from above.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He stands at the edge of his penalty area, in the centre of the frame, with his back to the camera, feet apart, his right gloved arm stretched out to the side, pointing and organising his defence.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Ahead of him, slightly out of focus, four team-mates in plain magenta shirts, cyan shorts and cyan socks form a defensive line. Further up the pitch, small and blurred, players of both teams contest the ball. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 13 OF 18 — scene: 24-classico — hair: curto — file name: 24-classico__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A packed football stadium on a late afternoon, seconds before the kick-off of a derby. The low sun gives the sky a warm glow and the floodlights are already on. Thin white smoke drifts across the stands.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He stands a few steps in front of his goal line, in the centre of the frame, with his back to the camera, feet apart, both gloved arms held out to the sides at waist height with the palms open, focused, looking up the pitch.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Far ahead of him, slightly out of focus, both teams take their positions for the kick-off: his team-mates in plain magenta shirts, cyan shorts and cyan socks, and the opponents. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. In the far stand the crowd holds up one enormous plain light-grey flag with nothing on it. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- The smoke from the stands is white or light grey only: no coloured smoke.
- Warm yellow or gold appears only on: the low sun and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 14 OF 18 — scene: 24-classico — hair: cacheado-medio — file name: 24-classico__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A packed football stadium on a late afternoon, seconds before the kick-off of a derby. The low sun gives the sky a warm glow and the floodlights are already on. Thin white smoke drifts across the stands.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands a few steps in front of his goal line, in the centre of the frame, with his back to the camera, feet apart, both gloved arms held out to the sides at waist height with the palms open, focused, looking up the pitch.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Far ahead of him, slightly out of focus, both teams take their positions for the kick-off: his team-mates in plain magenta shirts, cyan shorts and cyan socks, and the opponents. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. In the far stand the crowd holds up one enormous plain light-grey flag with nothing on it. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- The smoke from the stands is white or light grey only: no coloured smoke.
- Warm yellow or gold appears only on: the low sun and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 15 OF 18 — scene: 24-classico — hair: liso-medio — file name: 24-classico__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A packed football stadium on a late afternoon, seconds before the kick-off of a derby. The low sun gives the sky a warm glow and the floodlights are already on. Thin white smoke drifts across the stands.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands a few steps in front of his goal line, in the centre of the frame, with his back to the camera, feet apart, both gloved arms held out to the sides at waist height with the palms open, focused, looking up the pitch.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Far ahead of him, slightly out of focus, both teams take their positions for the kick-off: his team-mates in plain magenta shirts, cyan shorts and cyan socks, and the opponents. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. In the far stand the crowd holds up one enormous plain light-grey flag with nothing on it. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- The smoke from the stands is white or light grey only: no coloured smoke.
- Warm yellow or gold appears only on: the low sun and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 16 OF 18 — scene: 24-classico — hair: cacheado-grande — file name: 24-classico__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A packed football stadium on a late afternoon, seconds before the kick-off of a derby. The low sun gives the sky a warm glow and the floodlights are already on. Thin white smoke drifts across the stands.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He stands a few steps in front of his goal line, in the centre of the frame, with his back to the camera, feet apart, both gloved arms held out to the sides at waist height with the palms open, focused, looking up the pitch.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Far ahead of him, slightly out of focus, both teams take their positions for the kick-off: his team-mates in plain magenta shirts, cyan shorts and cyan socks, and the opponents. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. In the far stand the crowd holds up one enormous plain light-grey flag with nothing on it. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- The smoke from the stands is white or light grey only: no coloured smoke.
- Warm yellow or gold appears only on: the low sun and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 17 OF 18 — scene: 24-classico — hair: liso-grande — file name: 24-classico__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A packed football stadium on a late afternoon, seconds before the kick-off of a derby. The low sun gives the sky a warm glow and the floodlights are already on. Thin white smoke drifts across the stands.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He stands a few steps in front of his goal line, in the centre of the frame, with his back to the camera, feet apart, both gloved arms held out to the sides at waist height with the palms open, focused, looking up the pitch.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Far ahead of him, slightly out of focus, both teams take their positions for the kick-off: his team-mates in plain magenta shirts, cyan shorts and cyan socks, and the opponents. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. In the far stand the crowd holds up one enormous plain light-grey flag with nothing on it. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- The smoke from the stands is white or light grey only: no coloured smoke.
- Warm yellow or gold appears only on: the low sun and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 18 OF 18 — scene: 24-classico — hair: careca — file name: 24-classico__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A packed football stadium on a late afternoon, seconds before the kick-off of a derby. The low sun gives the sky a warm glow and the floodlights are already on. Thin white smoke drifts across the stands.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He stands a few steps in front of his goal line, in the centre of the frame, with his back to the camera, feet apart, both gloved arms held out to the sides at waist height with the palms open, focused, looking up the pitch.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Far ahead of him, slightly out of focus, both teams take their positions for the kick-off: his team-mates in plain magenta shirts, cyan shorts and cyan socks, and the opponents. Opponents wear plain light-grey shirts, light-grey shorts and light-grey socks. In the far stand the crowd holds up one enormous plain light-grey flag with nothing on it. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- The smoke from the stands is white or light grey only: no coloured smoke.
- Warm yellow or gold appears only on: the low sun and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking up the pitch.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== END OF THE 18 PROMPTS ===============
After image 18, write: "All 18 images done." If any image was skipped or could not be generated, say exactly which numbers.
````

## Pedido 7 — Goleiro: 10-copa · 25-vaia · 11-treino

**Onde salvar cada imagem** (pastas dentro de `docs/arte/`)

| # | Pasta | Cena | Corte |
|--:|---|---|---|
| 1 | `cenas-goleiro/10-copa/curto/` | Copa do Mundo | Curto |
| 2 | `cenas-goleiro/10-copa/cacheado-medio/` | Copa do Mundo | Cacheado médio |
| 3 | `cenas-goleiro/10-copa/liso-medio/` | Copa do Mundo | Liso médio |
| 4 | `cenas-goleiro/10-copa/cacheado-grande/` | Copa do Mundo | Cacheado grande |
| 5 | `cenas-goleiro/10-copa/liso-grande/` | Copa do Mundo | Liso grande |
| 6 | `cenas-goleiro/10-copa/careca/` | Copa do Mundo | Careca |
| 7 | `cenas-goleiro/25-vaia/curto/` | Vaia | Curto |
| 8 | `cenas-goleiro/25-vaia/cacheado-medio/` | Vaia | Cacheado médio |
| 9 | `cenas-goleiro/25-vaia/liso-medio/` | Vaia | Liso médio |
| 10 | `cenas-goleiro/25-vaia/cacheado-grande/` | Vaia | Cacheado grande |
| 11 | `cenas-goleiro/25-vaia/liso-grande/` | Vaia | Liso grande |
| 12 | `cenas-goleiro/25-vaia/careca/` | Vaia | Careca |
| 13 | `cenas-goleiro/11-treino/curto/` | Treino | Curto |
| 14 | `cenas-goleiro/11-treino/cacheado-medio/` | Treino | Cacheado médio |
| 15 | `cenas-goleiro/11-treino/liso-medio/` | Treino | Liso médio |
| 16 | `cenas-goleiro/11-treino/cacheado-grande/` | Treino | Cacheado grande |
| 17 | `cenas-goleiro/11-treino/liso-grande/` | Treino | Liso grande |
| 18 | `cenas-goleiro/11-treino/careca/` | Treino | Careca |

````
You will generate 18 SEPARATE images in this conversation. Start from a clean slate: ignore everything from any earlier conversation.

WHAT THIS JOB IS
A set of illustrations for a mobile football career game. There are 3 different scenes, and each scene is painted 6 times, once for each hairstyle of the main character:
- Images 1 to 6: scene "10-copa". A gigantic, three-tier football stadium at night, minutes before the kick-off of a world tournament match.
- Images 7 to 12: scene "25-vaia". A football stadium at night in light rain, right after he has conceded a goal.
- Images 13 to 18: scene "11-treino". The training ground of a football club on a bright morning.
The 6 hairstyles always come in this order: curto (short), cacheado-medio (medium curly), liso-medio (medium straight), cacheado-grande (long curly), liso-grande (long straight), careca (bald).

RULES FOR THE WHOLE JOB
1. Generate exactly 18 images, one for each prompt below, in the order given: image 1, then image 2, and so on up to image 18.
2. Each image is a separate, complete, full-size picture in vertical 4:5 format. Never combine images into one picture: no grid, no collage, no contact sheet, no split screen, no character sheet, no before-and-after.
3. Treat each prompt as independent. For each image, use only the text of its own prompt. Never carry an object, a person or a background from one scene into another scene.
4. Inside one scene, the ONLY difference between its 6 images is the hair of the main character. Keep the room or place, the camera, the pose, the other people, the colours and the painting style as close as possible across those 6 images.
5. When the scene changes (after image number: 6 and 12), start that scene fresh from its own prompt.
6. Before each image, write one short line outside the image with its number and file name, exactly as given in its heading, for example: "Image 1 of 18 - 10-copa__curto.jpeg".
7. If you cannot generate all 18 in one reply, generate as many as you can and stop. When I write "Continue with the next image.", carry on from the next number. Never start again from image 1 and never skip a number.

RULES THAT APPLY TO EVERY IMAGE
A. PAINTING STYLE. Semi-realistic painted illustration: soft blended shading, visible brush texture and only very thin, subtle linework. Not a comic, not a cartoon, no thick black outlines, no cel shading. All 18 images must look painted by the same artist.
B. THE MAIN CHARACTER IS SEEN FROM BEHIND. His face is never visible. He is horizontally centred and is the largest figure in the image.
C. THE BACK OF HIS SHIRT IS EMPTY AND UNCOVERED from the shoulders to the waist: one smooth, evenly lit surface. No number, no name, no print, and no arm, hand, strap, chair back, person or object in front of it. Software will write a number there afterwards.
D. KEY COLOURS. Bright magenta is used only for the football shirt (and the shirts of team-mates, when the prompt mentions team-mates). Cyan is used only for football shorts and socks, and only when the prompt asks for them. Software will recolour these two colours afterwards, so nothing else in the image may be magenta, pink, purple or cyan. The one exception is the main character himself: in this job he is a GOALKEEPER and wears a rose-pink (#F0569B) long-sleeved shirt, rose-pink shorts and socks and vivid orange gloves, exactly as each prompt says. His team-mates wear magenta and cyan.
E. EVERYONE ELSE IS NEUTRAL. Crowds, flags, opponents and bystanders are in light grey, mid grey, navy, beige or off-white, exactly as each prompt says.
F. PLAIN CLOTHES AND OBJECTS. No badge, crest, emblem, logo, brand mark, sponsor or stripes on any clothing or object: shirts, tracksuits, jackets, coats, polo shirts, boots, trainers, balls, bags, glasses, speakers, screens and walls are completely plain.
G. NO WRITING. No text, letters, numbers, signs, labels, captions or watermarks anywhere inside any image. Papers, screens and boards are blank.
H. THE LOWER 40% IS DARK AND EMPTY. In every image the bottom 40% fades into deep navy shadow with no people, no objects and no detail, because interface panels will cover it. The main character and all the action stay in the upper 60%.
I. ORIGINAL PEOPLE. Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 1 OF 18 — scene: 10-copa — hair: curto — file name: 10-copa__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A gigantic, three-tier football stadium at night, minutes before the kick-off of a world tournament match. Every seat is taken. Rows of white floodlights shine from the roof.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He stands on the pitch in a straight line with his team-mates, in the centre of the frame, with his back to the camera, feet apart, gloved arms straight down at his sides, head up, looking at the huge stand in front of him.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On his left and on his right, three team-mates on each side stand in the same line, seen from behind in plain magenta shirts, cyan shorts and cyan socks with blank shirts, with a small gap between each player so that nobody touches him. In the stand in front of them the crowd unfurls one enormous plain light-grey flag with nothing on it, and small white fireworks burst above the roof. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow and the sparks of the fireworks.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind the line of players, looking straight at the stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No arms around shoulders: nobody touches the main character.
- No national flags, no country names and no real tournament trophy.

=============== IMAGE 2 OF 18 — scene: 10-copa — hair: cacheado-medio — file name: 10-copa__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A gigantic, three-tier football stadium at night, minutes before the kick-off of a world tournament match. Every seat is taken. Rows of white floodlights shine from the roof.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands on the pitch in a straight line with his team-mates, in the centre of the frame, with his back to the camera, feet apart, gloved arms straight down at his sides, head up, looking at the huge stand in front of him.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On his left and on his right, three team-mates on each side stand in the same line, seen from behind in plain magenta shirts, cyan shorts and cyan socks with blank shirts, with a small gap between each player so that nobody touches him. In the stand in front of them the crowd unfurls one enormous plain light-grey flag with nothing on it, and small white fireworks burst above the roof. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow and the sparks of the fireworks.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind the line of players, looking straight at the stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No arms around shoulders: nobody touches the main character.
- No national flags, no country names and no real tournament trophy.

=============== IMAGE 3 OF 18 — scene: 10-copa — hair: liso-medio — file name: 10-copa__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A gigantic, three-tier football stadium at night, minutes before the kick-off of a world tournament match. Every seat is taken. Rows of white floodlights shine from the roof.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands on the pitch in a straight line with his team-mates, in the centre of the frame, with his back to the camera, feet apart, gloved arms straight down at his sides, head up, looking at the huge stand in front of him.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On his left and on his right, three team-mates on each side stand in the same line, seen from behind in plain magenta shirts, cyan shorts and cyan socks with blank shirts, with a small gap between each player so that nobody touches him. In the stand in front of them the crowd unfurls one enormous plain light-grey flag with nothing on it, and small white fireworks burst above the roof. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow and the sparks of the fireworks.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind the line of players, looking straight at the stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No arms around shoulders: nobody touches the main character.
- No national flags, no country names and no real tournament trophy.

=============== IMAGE 4 OF 18 — scene: 10-copa — hair: cacheado-grande — file name: 10-copa__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A gigantic, three-tier football stadium at night, minutes before the kick-off of a world tournament match. Every seat is taken. Rows of white floodlights shine from the roof.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He stands on the pitch in a straight line with his team-mates, in the centre of the frame, with his back to the camera, feet apart, gloved arms straight down at his sides, head up, looking at the huge stand in front of him.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On his left and on his right, three team-mates on each side stand in the same line, seen from behind in plain magenta shirts, cyan shorts and cyan socks with blank shirts, with a small gap between each player so that nobody touches him. In the stand in front of them the crowd unfurls one enormous plain light-grey flag with nothing on it, and small white fireworks burst above the roof. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow and the sparks of the fireworks.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind the line of players, looking straight at the stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No arms around shoulders: nobody touches the main character.
- No national flags, no country names and no real tournament trophy.

=============== IMAGE 5 OF 18 — scene: 10-copa — hair: liso-grande — file name: 10-copa__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A gigantic, three-tier football stadium at night, minutes before the kick-off of a world tournament match. Every seat is taken. Rows of white floodlights shine from the roof.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He stands on the pitch in a straight line with his team-mates, in the centre of the frame, with his back to the camera, feet apart, gloved arms straight down at his sides, head up, looking at the huge stand in front of him.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On his left and on his right, three team-mates on each side stand in the same line, seen from behind in plain magenta shirts, cyan shorts and cyan socks with blank shirts, with a small gap between each player so that nobody touches him. In the stand in front of them the crowd unfurls one enormous plain light-grey flag with nothing on it, and small white fireworks burst above the roof. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow and the sparks of the fireworks.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind the line of players, looking straight at the stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No arms around shoulders: nobody touches the main character.
- No national flags, no country names and no real tournament trophy.

=============== IMAGE 6 OF 18 — scene: 10-copa — hair: careca — file name: 10-copa__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A gigantic, three-tier football stadium at night, minutes before the kick-off of a world tournament match. Every seat is taken. Rows of white floodlights shine from the roof.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He stands on the pitch in a straight line with his team-mates, in the centre of the frame, with his back to the camera, feet apart, gloved arms straight down at his sides, head up, looking at the huge stand in front of him.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
On his left and on his right, three team-mates on each side stand in the same line, seen from behind in plain magenta shirts, cyan shorts and cyan socks with blank shirts, with a small gap between each player so that nobody touches him. In the stand in front of them the crowd unfurls one enormous plain light-grey flag with nothing on it, and small white fireworks burst above the roof. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the floodlight glow and the sparks of the fireworks.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at chest height, a few metres behind the line of players, looking straight at the stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No arms around shoulders: nobody touches the main character.
- No national flags, no country names and no real tournament trophy.

=============== IMAGE 7 OF 18 — scene: 25-vaia — hair: curto — file name: 25-vaia__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night in light rain, right after he has conceded a goal. The floodlights give a cold white light and the grass is wet and shiny.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He stands in his goal mouth facing the net, in the centre of the frame, with his back to the camera, head down, shoulders slumped, gloved hands hanging at his sides, looking at a plain white football lying in the back of the net.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Behind the net, in the stand, the crowd is on its feet with arms thrown up and thumbs pointing down. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is cold white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, on the pitch side, looking at the goal and the stand behind it.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the wet grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No objects thrown onto the pitch.

=============== IMAGE 8 OF 18 — scene: 25-vaia — hair: cacheado-medio — file name: 25-vaia__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night in light rain, right after he has conceded a goal. The floodlights give a cold white light and the grass is wet and shiny.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands in his goal mouth facing the net, in the centre of the frame, with his back to the camera, head down, shoulders slumped, gloved hands hanging at his sides, looking at a plain white football lying in the back of the net.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Behind the net, in the stand, the crowd is on its feet with arms thrown up and thumbs pointing down. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is cold white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, on the pitch side, looking at the goal and the stand behind it.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the wet grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No objects thrown onto the pitch.

=============== IMAGE 9 OF 18 — scene: 25-vaia — hair: liso-medio — file name: 25-vaia__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night in light rain, right after he has conceded a goal. The floodlights give a cold white light and the grass is wet and shiny.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands in his goal mouth facing the net, in the centre of the frame, with his back to the camera, head down, shoulders slumped, gloved hands hanging at his sides, looking at a plain white football lying in the back of the net.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Behind the net, in the stand, the crowd is on its feet with arms thrown up and thumbs pointing down. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is cold white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, on the pitch side, looking at the goal and the stand behind it.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the wet grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No objects thrown onto the pitch.

=============== IMAGE 10 OF 18 — scene: 25-vaia — hair: cacheado-grande — file name: 25-vaia__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night in light rain, right after he has conceded a goal. The floodlights give a cold white light and the grass is wet and shiny.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He stands in his goal mouth facing the net, in the centre of the frame, with his back to the camera, head down, shoulders slumped, gloved hands hanging at his sides, looking at a plain white football lying in the back of the net.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Behind the net, in the stand, the crowd is on its feet with arms thrown up and thumbs pointing down. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is cold white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, on the pitch side, looking at the goal and the stand behind it.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the wet grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No objects thrown onto the pitch.

=============== IMAGE 11 OF 18 — scene: 25-vaia — hair: liso-grande — file name: 25-vaia__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night in light rain, right after he has conceded a goal. The floodlights give a cold white light and the grass is wet and shiny.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He stands in his goal mouth facing the net, in the centre of the frame, with his back to the camera, head down, shoulders slumped, gloved hands hanging at his sides, looking at a plain white football lying in the back of the net.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Behind the net, in the stand, the crowd is on its feet with arms thrown up and thumbs pointing down. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is cold white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, on the pitch side, looking at the goal and the stand behind it.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the wet grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No objects thrown onto the pitch.

=============== IMAGE 12 OF 18 — scene: 25-vaia — hair: careca — file name: 25-vaia__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A football stadium at night in light rain, right after he has conceded a goal. The floodlights give a cold white light and the grass is wet and shiny.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He stands in his goal mouth facing the net, in the centre of the frame, with his back to the camera, head down, shoulders slumped, gloved hands hanging at his sides, looking at a plain white football lying in the back of the net.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Behind the net, in the stand, the crowd is on its feet with arms thrown up and thumbs pointing down. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: nothing; the light is cold white.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, on the pitch side, looking at the goal and the stand behind it.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the wet grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.
- No objects thrown onto the pitch.

=============== IMAGE 13 OF 18 — scene: 11-treino — hair: curto — file name: 11-treino__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The training ground of a football club on a bright morning. A grass pitch with a full-size goal, a low wire fence, a few trees and a small empty concrete stand in the distance. Clear pale-blue sky.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He stands in the middle of the goal mouth, in the centre of the frame, with his back to the camera, knees bent, both gloved hands held forward and to the sides at waist height, ready for the next shot.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, about twelve metres away and slightly out of focus, a goalkeeping coach in a plain dark navy tracksuit is about to strike a plain white football, with five more white footballs lined up beside him. A few small white training cones mark the area.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- The training cones are plain white. There are no orange, yellow or red cones or bibs.
- Warm yellow or gold appears only on: nothing; the light is natural morning sunlight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about two metres behind him, looking out at the coach. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 14 OF 18 — scene: 11-treino — hair: cacheado-medio — file name: 11-treino__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The training ground of a football club on a bright morning. A grass pitch with a full-size goal, a low wire fence, a few trees and a small empty concrete stand in the distance. Clear pale-blue sky.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands in the middle of the goal mouth, in the centre of the frame, with his back to the camera, knees bent, both gloved hands held forward and to the sides at waist height, ready for the next shot.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, about twelve metres away and slightly out of focus, a goalkeeping coach in a plain dark navy tracksuit is about to strike a plain white football, with five more white footballs lined up beside him. A few small white training cones mark the area.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- The training cones are plain white. There are no orange, yellow or red cones or bibs.
- Warm yellow or gold appears only on: nothing; the light is natural morning sunlight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about two metres behind him, looking out at the coach. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 15 OF 18 — scene: 11-treino — hair: liso-medio — file name: 11-treino__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The training ground of a football club on a bright morning. A grass pitch with a full-size goal, a low wire fence, a few trees and a small empty concrete stand in the distance. Clear pale-blue sky.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands in the middle of the goal mouth, in the centre of the frame, with his back to the camera, knees bent, both gloved hands held forward and to the sides at waist height, ready for the next shot.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, about twelve metres away and slightly out of focus, a goalkeeping coach in a plain dark navy tracksuit is about to strike a plain white football, with five more white footballs lined up beside him. A few small white training cones mark the area.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- The training cones are plain white. There are no orange, yellow or red cones or bibs.
- Warm yellow or gold appears only on: nothing; the light is natural morning sunlight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about two metres behind him, looking out at the coach. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 16 OF 18 — scene: 11-treino — hair: cacheado-grande — file name: 11-treino__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The training ground of a football club on a bright morning. A grass pitch with a full-size goal, a low wire fence, a few trees and a small empty concrete stand in the distance. Clear pale-blue sky.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He stands in the middle of the goal mouth, in the centre of the frame, with his back to the camera, knees bent, both gloved hands held forward and to the sides at waist height, ready for the next shot.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, about twelve metres away and slightly out of focus, a goalkeeping coach in a plain dark navy tracksuit is about to strike a plain white football, with five more white footballs lined up beside him. A few small white training cones mark the area.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- The training cones are plain white. There are no orange, yellow or red cones or bibs.
- Warm yellow or gold appears only on: nothing; the light is natural morning sunlight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about two metres behind him, looking out at the coach. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 17 OF 18 — scene: 11-treino — hair: liso-grande — file name: 11-treino__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The training ground of a football club on a bright morning. A grass pitch with a full-size goal, a low wire fence, a few trees and a small empty concrete stand in the distance. Clear pale-blue sky.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He stands in the middle of the goal mouth, in the centre of the frame, with his back to the camera, knees bent, both gloved hands held forward and to the sides at waist height, ready for the next shot.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, about twelve metres away and slightly out of focus, a goalkeeping coach in a plain dark navy tracksuit is about to strike a plain white football, with five more white footballs lined up beside him. A few small white training cones mark the area.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- The training cones are plain white. There are no orange, yellow or red cones or bibs.
- Warm yellow or gold appears only on: nothing; the light is natural morning sunlight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about two metres behind him, looking out at the coach. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 18 OF 18 — scene: 11-treino — hair: careca — file name: 11-treino__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
The training ground of a football club on a bright morning. A grass pitch with a full-size goal, a low wire fence, a few trees and a small empty concrete stand in the distance. Clear pale-blue sky.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He stands in the middle of the goal mouth, in the centre of the frame, with his back to the camera, knees bent, both gloved hands held forward and to the sides at waist height, ready for the next shot.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
In front of him, about twelve metres away and slightly out of focus, a goalkeeping coach in a plain dark navy tracksuit is about to strike a plain white football, with five more white footballs lined up beside him. A few small white training cones mark the area.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- The training cones are plain white. There are no orange, yellow or red cones or bibs.
- Warm yellow or gold appears only on: nothing; the light is natural morning sunlight.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is inside the goal, at waist height, about two metres behind him, looking out at the coach. There is no net between the camera and him.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass of the goal mouth fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== END OF THE 18 PROMPTS ===============
After image 18, write: "All 18 images done." If any image was skipped or could not be generated, say exactly which numbers.
````

## Pedido 8 — Goleiro: 09-despedida

**Onde salvar cada imagem** (pastas dentro de `docs/arte/`)

| # | Pasta | Cena | Corte |
|--:|---|---|---|
| 1 | `cenas-goleiro/09-despedida/curto/` | Despedida | Curto |
| 2 | `cenas-goleiro/09-despedida/cacheado-medio/` | Despedida | Cacheado médio |
| 3 | `cenas-goleiro/09-despedida/liso-medio/` | Despedida | Liso médio |
| 4 | `cenas-goleiro/09-despedida/cacheado-grande/` | Despedida | Cacheado grande |
| 5 | `cenas-goleiro/09-despedida/liso-grande/` | Despedida | Liso grande |
| 6 | `cenas-goleiro/09-despedida/careca/` | Despedida | Careca |

````
You will generate 6 SEPARATE images in this conversation. Start from a clean slate: ignore everything from any earlier conversation.

WHAT THIS JOB IS
A set of illustrations for a mobile football career game. There are 1 different scenes, and each scene is painted 6 times, once for each hairstyle of the main character:
- Images 1 to 6: scene "09-despedida". A full football stadium at dusk, right after the last match of his career.
The 6 hairstyles always come in this order: curto (short), cacheado-medio (medium curly), liso-medio (medium straight), cacheado-grande (long curly), liso-grande (long straight), careca (bald).

RULES FOR THE WHOLE JOB
1. Generate exactly 6 images, one for each prompt below, in the order given: image 1, then image 2, and so on up to image 6.
2. Each image is a separate, complete, full-size picture in vertical 4:5 format. Never combine images into one picture: no grid, no collage, no contact sheet, no split screen, no character sheet, no before-and-after.
3. Treat each prompt as independent. For each image, use only the text of its own prompt. Never carry an object, a person or a background from one scene into another scene.
4. Inside one scene, the ONLY difference between its 6 images is the hair of the main character. Keep the room or place, the camera, the pose, the other people, the colours and the painting style as close as possible across those 6 images.
5. When the scene changes (after image number: none), start that scene fresh from its own prompt.
6. Before each image, write one short line outside the image with its number and file name, exactly as given in its heading, for example: "Image 1 of 6 - 09-despedida__curto.jpeg".
7. If you cannot generate all 6 in one reply, generate as many as you can and stop. When I write "Continue with the next image.", carry on from the next number. Never start again from image 1 and never skip a number.

RULES THAT APPLY TO EVERY IMAGE
A. PAINTING STYLE. Semi-realistic painted illustration: soft blended shading, visible brush texture and only very thin, subtle linework. Not a comic, not a cartoon, no thick black outlines, no cel shading. All 6 images must look painted by the same artist.
B. THE MAIN CHARACTER IS SEEN FROM BEHIND. His face is never visible. He is horizontally centred and is the largest figure in the image.
C. THE BACK OF HIS SHIRT IS EMPTY AND UNCOVERED from the shoulders to the waist: one smooth, evenly lit surface. No number, no name, no print, and no arm, hand, strap, chair back, person or object in front of it. Software will write a number there afterwards.
D. KEY COLOURS. Bright magenta is used only for the football shirt (and the shirts of team-mates, when the prompt mentions team-mates). Cyan is used only for football shorts and socks, and only when the prompt asks for them. Software will recolour these two colours afterwards, so nothing else in the image may be magenta, pink, purple or cyan. The one exception is the main character himself: in this job he is a GOALKEEPER and wears a rose-pink (#F0569B) long-sleeved shirt, rose-pink shorts and socks and vivid orange gloves, exactly as each prompt says. His team-mates wear magenta and cyan.
E. EVERYONE ELSE IS NEUTRAL. Crowds, flags, opponents and bystanders are in light grey, mid grey, navy, beige or off-white, exactly as each prompt says.
F. PLAIN CLOTHES AND OBJECTS. No badge, crest, emblem, logo, brand mark, sponsor or stripes on any clothing or object: shirts, tracksuits, jackets, coats, polo shirts, boots, trainers, balls, bags, glasses, speakers, screens and walls are completely plain.
G. NO WRITING. No text, letters, numbers, signs, labels, captions or watermarks anywhere inside any image. Papers, screens and boards are blank.
H. THE LOWER 40% IS DARK AND EMPTY. In every image the bottom 40% fades into deep navy shadow with no people, no objects and no detail, because interface panels will cover it. The main character and all the action stay in the upper 60%.
I. ORIGINAL PEOPLE. Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 1 OF 6 — scene: 09-despedida — hair: curto — file name: 09-despedida__curto.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at dusk, right after the last match of his career. The sky is deep navy with a thin band of warm light on the horizon, and the floodlights are on.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, short curly dark-brown hair, cut close to the head, and an athletic build.
He stands on the centre circle, in the centre of the frame, with his back to the camera, his right arm raised high, waving goodbye to the crowd with his bare open hand. His left hand, at his side, holds his pair of orange gloves.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Further ahead, slightly out of focus, his team-mates in plain magenta shirts, cyan shorts and cyan socks stand in two short rows, one on each side, applauding him, leaving the middle open. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the band of light on the horizon and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking straight towards the main stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 2 OF 6 — scene: 09-despedida — hair: cacheado-medio — file name: 09-despedida__cacheado-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at dusk, right after the last match of his career. The sky is deep navy with a thin band of warm light on the horizon, and the floodlights are on.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands on the centre circle, in the centre of the frame, with his back to the camera, his right arm raised high, waving goodbye to the crowd with his bare open hand. His left hand, at his side, holds his pair of orange gloves.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Further ahead, slightly out of focus, his team-mates in plain magenta shirts, cyan shorts and cyan socks stand in two short rows, one on each side, applauding him, leaving the middle open. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the band of light on the horizon and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking straight towards the main stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 3 OF 6 — scene: 09-despedida — hair: liso-medio — file name: 09-despedida__liso-medio.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at dusk, right after the last match of his career. The sky is deep navy with a thin band of warm light on the horizon, and the floodlights are on.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck, and an athletic build.
He stands on the centre circle, in the centre of the frame, with his back to the camera, his right arm raised high, waving goodbye to the crowd with his bare open hand. His left hand, at his side, holds his pair of orange gloves.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Further ahead, slightly out of focus, his team-mates in plain magenta shirts, cyan shorts and cyan socks stand in two short rows, one on each side, applauding him, leaving the middle open. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the band of light on the horizon and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking straight towards the main stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 4 OF 6 — scene: 09-despedida — hair: cacheado-grande — file name: 09-despedida__cacheado-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at dusk, right after the last match of his career. The sky is deep navy with a thin band of warm light on the horizon, and the floodlights are on.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there, and an athletic build.
He stands on the centre circle, in the centre of the frame, with his back to the camera, his right arm raised high, waving goodbye to the crowd with his bare open hand. His left hand, at his side, holds his pair of orange gloves.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Further ahead, slightly out of focus, his team-mates in plain magenta shirts, cyan shorts and cyan socks stand in two short rows, one on each side, applauding him, leaving the middle open. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the band of light on the horizon and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking straight towards the main stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 5 OF 6 — scene: 09-despedida — hair: liso-grande — file name: 09-despedida__liso-grande.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at dusk, right after the last match of his career. The sky is deep navy with a thin band of warm light on the horizon, and the floodlights are on.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there, and an athletic build.
He stands on the centre circle, in the centre of the frame, with his back to the camera, his right arm raised high, waving goodbye to the crowd with his bare open hand. His left hand, at his side, holds his pair of orange gloves.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Further ahead, slightly out of focus, his team-mates in plain magenta shirts, cyan shorts and cyan socks stand in two short rows, one on each side, applauding him, leaving the middle open. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the band of light on the horizon and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking straight towards the main stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== IMAGE 6 OF 6 — scene: 09-despedida — hair: careca — file name: 09-despedida__careca.jpeg ===============
Create a vertical 4:5 portrait image at the highest resolution available (about 1856 x 2304 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture, gentle gradients of light and shadow, and only very thin, subtle linework. Realistic human proportions and anatomy. It must look hand-painted, not like a cartoon, comic, cel-shaded art, flat vector art, anime, a 3D render or a photograph. Avoid thick black outlines.

SETTING
A full football stadium at dusk, right after the last match of his career. The sky is deep navy with a thin band of warm light on the horizon, and the floodlights are on.

MAIN CHARACTER
One young Brazilian football player, seen entirely from behind so his face is not visible. He has brown skin, a completely shaved, smooth bald head with no hair at all, and an athletic build.
He stands on the centre circle, in the centre of the frame, with his back to the camera, his right arm raised high, waving goodbye to the crowd with his bare open hand. His left hand, at his side, holds his pair of orange gloves.

CLOTHING
He is a goalkeeper. He wears a plain rose-pink (#F0569B) LONG-sleeved goalkeeper shirt, plain rose-pink shorts, plain rose-pink knee-high socks, plain black boots and plain vivid orange goalkeeper gloves. The rose pink is clearly lighter and warmer than the magenta of his team-mates.

THE BACK OF THE SHIRT
His hair ends at shoulder height at the lowest. From the shoulders down to the waist, the back of the rose-pink shirt is fully visible to the camera: one smooth, flat, evenly lit rose-pink surface with nothing printed on it and nothing covering it (no arm, no hand, no strap, no other person, no object). Software will write the player's number there.

OTHER PEOPLE AND OBJECTS
Further ahead, slightly out of focus, his team-mates in plain magenta shirts, cyan shorts and cyan socks stand in two short rows, one on each side, applauding him, leaving the middle open. The softly blurred crowd wears neutral light-grey clothes and waves plain light-grey flags with nothing on them.

COLOUR PLAN - follow it exactly, because software will recolour this image afterwards
- Rose pink (#F0569B) appears in one place only: the shirt, shorts and socks of the goalkeeper.
- Vivid orange appears in one place only: the goalkeeper gloves.
- Magenta appears only on the shirts of his team-mates, and cyan only on their shorts and socks.
- Boots are plain black.
- Warm yellow or gold appears only on: the band of light on the horizon and the floodlight glow.
- Everything else uses navy blue, concrete grey, off-white, pitch green and muted natural tones. No purple, no pink other than the kit described, no neon colours.

COMPOSITION - follow these positions
- Vertical 4:5. The camera is at waist height, a few metres behind him, looking straight towards the main stand.
- The main character is horizontally centred and is the largest figure in the image.
- The main character and all the action are in the upper 60% of the image. His feet are no lower than 75% of the way down from the top edge.
- The lower 40% of the image is calm and dark: the grass fading into deep navy shadow down to the bottom edge, with no objects, no people and no detail, because interface panels will be placed over that area.

MUST NOT APPEAR
- No text, letters or numbers anywhere: not on shirts, boards, screens, papers, flags, walls or signs.
- No logos, crests, badges, sponsor or brand marks on kits, boots, balls, flags, boards, bags or walls.
- No badge, emblem or stripes on the clothes of coaches, staff, reporters or anyone else: tracksuits, jackets and polo shirts are completely plain.
- No watermark or signature, and no interface elements, frames or borders.
- The face of the main character is not visible: he is seen from behind.
- Every person is an original fictional character who does not resemble any real person.

=============== END OF THE 6 PROMPTS ===============
After image 6, write: "All 6 images done." If any image was skipped or could not be generated, say exactly which numbers.
````

## Pedido 9 — Troféus (18)

**Onde salvar cada imagem** (pastas dentro de `docs/arte/`)

| # | Pasta | Cena | Corte |
|--:|---|---|---|
| 1 | `trofeus/estadual/` | Campeonato estadual | — |
| 2 | `trofeus/serie-a/` | Campeonato nacional — primeira divisão | — |
| 3 | `trofeus/serie-b/` | Campeonato nacional — segunda divisão | — |
| 4 | `trofeus/serie-c/` | Campeonato nacional — terceira divisão | — |
| 5 | `trofeus/serie-d/` | Campeonato nacional — quarta divisão | — |
| 6 | `trofeus/copa-do-brasil/` | Copa nacional | — |
| 7 | `trofeus/copa-do-nordeste/` | Copa regional | — |
| 8 | `trofeus/continental-principal/` | Copa continental principal | — |
| 9 | `trofeus/continental-secundaria/` | Copa continental secundária | — |
| 10 | `trofeus/copa-do-mundo/` | Copa do Mundo de seleções | — |
| 11 | `trofeus/copa-america/` | Copa continental de seleções | — |
| 12 | `trofeus/olimpiadas/` | Medalha de ouro olímpica | — |
| 13 | `trofeus/liga-europeia/` | Liga nacional europeia | — |
| 14 | `trofeus/copa-europeia/` | Copa europeia de clubes | — |
| 15 | `trofeus/premio-melhor-jogador/` | Prêmio individual — melhor jogador | — |
| 16 | `trofeus/premio-artilheiro/` | Prêmio individual — artilheiro | — |
| 17 | `trofeus/premio-melhor-goleiro/` | Prêmio individual — melhor goleiro | — |
| 18 | `trofeus/premio-revelacao/` | Prêmio individual — revelação | — |

````
You will generate 18 SEPARATE images in this conversation. Start from a clean slate: ignore everything from any earlier conversation.

WHAT THIS JOB IS
A set of 18 trophy illustrations for a mobile football career game. Each image shows ONE different trophy of original, invented design on a flat navy background.

RULES FOR THE WHOLE JOB
1. Generate exactly 18 images, one for each prompt below, in the order given: image 1, then image 2, and so on up to image 18.
2. Each image is a separate, complete, full-size SQUARE (1:1) picture with one single trophy. Never combine trophies into one picture: no grid, no collage, no line-up, no shelf of trophies.
3. Treat each prompt as independent. Every trophy has a different design: never repeat the shape of an earlier trophy and never mix two designs.
4. Before each image, write one short line outside the image with its number and file name, exactly as given in its heading.
5. If you cannot generate all 18 in one reply, generate as many as you can and stop. When I write "Continue with the next image.", carry on from the next number. Never start again from image 1 and never skip a number.

RULES THAT APPLY TO EVERY IMAGE
A. ORIGINAL DESIGN. Every trophy is an invented object. It must not copy or closely resemble the trophy of any real competition or award. Follow the DESIGN text literally.
B. SAME STYLE. Semi-realistic painted illustration with soft shading and visible brush texture, not a photograph and not a 3D render. All 18 images must look painted by the same artist, with the same light and the same navy background (#14213D).
C. NO WRITING AND NO SYMBOLS. No text, numbers, dates, inscriptions, logos, crests, flags or country symbols anywhere, including on bases and plaques.
D. NOTHING ELSE IN THE PICTURE. No people, no hands, no table, no confetti, no ribbons unless the DESIGN text asks for them.

=============== IMAGE 1 OF 18 — file name: trofeu__estadual.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A classic medium-sized gold cup: a round bowl with a slightly flared rim, two curved handles shaped like simple scrolls, a short ribbed stem and a square base of dark polished wood. Friendly and traditional, like the cup of a regional championship.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 2 OF 18 — file name: trofeu__serie-a.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A tall, slender gold trophy with no bowl and no handles: five narrow vertical blades of polished gold rise from a round base and curve gently inwards, holding a smooth polished gold sphere at the top. The base is a low cylinder of black stone. Modern and imposing.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 3 OF 18 — file name: trofeu__serie-b.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A silver trophy with no bowl and no handles: three narrow vertical blades of polished silver rise from a round base and curve gently inwards, holding a smooth polished silver sphere at the top. The base is a low cylinder of black stone. Clearly shorter and simpler than a first-division trophy.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 4 OF 18 — file name: trofeu__serie-c.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A bronze trophy with no bowl and no handles: two broad vertical blades of polished bronze rise from a round base and lean towards each other, holding a small smooth bronze sphere between their tips. The base is a low cylinder of dark wood. Modest in size.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 5 OF 18 — file name: trofeu__serie-d.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A small, simple trophy of brushed steel: a plain shallow bowl on a short straight stem, with no handles and no ornament, on a small round base of dark wood. Humble and honest.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 6 OF 18 — file name: trofeu__copa-do-brasil.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A wide gold cup: a broad, shallow, bowl-shaped body with two large semicircular handles, a domed gold lid topped by a small plain gold ball, a short thick stem and a round stepped base of dark wood. Heavy and festive.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 7 OF 18 — file name: trofeu__copa-do-nordeste.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A gold cup with a sun motif: a rounded bowl resting on a stem made of twelve straight gold rays that fan out like a rising sun, with no handles, on a round base of warm dark wood. Bright and cheerful.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 8 OF 18 — file name: trofeu__continental-principal.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A tall, noble silver cup: an elongated egg-shaped body with a gold laurel wreath encircling the rim, two thin straight handles that run vertically down the sides, and a long stem wrapped by one spiralling silver band, on a round two-step base of black stone. The most imposing club trophy of the series.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 9 OF 18 — file name: trofeu__continental-secundaria.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A slim silver chalice with no handles: a tall, narrow body that flares smoothly outwards at the rim, one plain gold ring around its middle, and a slender stem on a small round base of black stone. Elegant and lighter than the main continental trophy.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 10 OF 18 — file name: trofeu__copa-do-mundo.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A solid gold trophy: a smooth gold globe engraved only with a few thin curved meridian lines, resting on top of a gold column that twists upwards like a rope and widens where it meets the globe, on a round two-step base of black marble. There are no human figures and no hands in the design. The grandest trophy of the series.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 11 OF 18 — file name: trofeu__copa-america.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A silver cup with a fluted body: vertical grooves run all around a tall rounded bowl, with two small angular handles near the rim and a plain silver lid with a flat knob, on a square two-step base of dark wood with no plaques. Old-fashioned and dignified.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 12 OF 18 — file name: trofeu__olimpiadas.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
Not a cup: one round gold medal hanging from a plain off-white ribbon that forms a V going up and out of the top of the image. The face of the medal is embossed with a single laurel branch curving around a small plain football. There are no rings, no torch and no symbols of any real event.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 13 OF 18 — file name: trofeu__liga-europeia.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A polished silver cup with a domed lid topped by a small plain gold football, a rounded body, two straight vertical handles shaped like flat bars, and a short stem on a round base of black stone. Two plain off-white ribbons are tied to the handles and hang down. There is no crown in the design.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 14 OF 18 — file name: trofeu__copa-europeia.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A short, wide silver cup with a hammered texture on its body, a polished gold rim and two large looping handles that curve outwards and downwards to join the lower body, with no lid and almost no stem, on a low round silver foot. Its proportions are clearly its own: short and broad rather than tall.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 15 OF 18 — file name: trofeu__premio-melhor-jogador.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A polished gold ball with a smooth surface divided by a few thin engraved lines, held inside one tilted gold ring that circles it like an orbit, on a plain cylindrical base of deep navy stone with a gold band at the top. There is no rock or rough stone in the design.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 16 OF 18 — file name: trofeu__premio-artilheiro.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A gold football boot seen in profile, pointing to the right, plain and smooth, with simple laces and studs and no stripes or marks of any kind, mounted at a slight upward angle on a rectangular base of dark wood.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 17 OF 18 — file name: trofeu__premio-melhor-goleiro.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A gold goalkeeper glove, upright with the palm facing the viewer and the fingers together and slightly open, plain and smooth with no marks of any kind, mounted by the wrist on a round base of dark wood.

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
- No watermark or signature, and no frames or borders.

=============== IMAGE 18 OF 18 — file name: trofeu__premio-revelacao.jpeg ===============
Create a square 1:1 image at the highest resolution available (about 2048 x 2048 pixels).

STYLE
A semi-realistic painted digital illustration for a mobile football career game. Painterly look: soft blended shading, visible brush texture and only very thin, subtle linework. It must look hand-painted, not like a photograph, a 3D render, flat vector art or an icon.

SUBJECT
One single sports trophy of ORIGINAL design, standing alone, seen from the front at eye level, perfectly upright and symmetrical. It is an invented object: it must not copy or closely resemble the trophy of any real competition or award.

DESIGN
A five-pointed gold star with softly rounded points, standing upright on a slender silver stem that rises from a round base of dark wood. Small and bright, like an award for a young newcomer.

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
- No watermark or signature, and no frames or borders.

=============== END OF THE 18 PROMPTS ===============
After image 18, write: "All 18 images done." If any image was skipped or could not be generated, say exactly which numbers.
````

## Conferência (nota para revisão humana)

- [ ] Imagens separadas, nenhuma em grade ou colagem, na resolução maior
- [ ] Em cada cena, os cortes na ordem: curto, cacheado médio, liso médio, cacheado grande, liso grande, careca
- [ ] Dentro de cada cena, só o cabelo muda
- [ ] Nenhum distintivo, listra, logo ou texto em roupa, objeto ou parede
- [ ] Traço pintado, sem contorno preto grosso
- [ ] Troféus: desenho original, não lembra o troféu real
