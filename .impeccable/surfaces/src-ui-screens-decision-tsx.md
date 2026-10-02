---
version: 1
slug: "src-ui-screens-decision-tsx"
primary_target: "src/ui/screens/Decision.tsx"
related_targets: ["src/ui/theme/tokens.json"]
---

# Tela de decisão (src/ui/screens/Decision.tsx)

Scope: the decision screen of a career, the screen every event of the game uses. Visitor mode: Operate.

Audience and job: a Brazilian football fan on a phone, often one-handed and distracted, choosing one of three options and understanding what each one causes and which temperament it belongs to. Content: scene painting, who the player is (club crest, name, position, club, overall as a number, trophies won), age and career progress, event title and story, three options with temperament and consequence previews (direction and intensity, never numbers). Constraints: one decision per screen; only the overall is shown as a number, the ten attributes never are; WCAG 2.1 AA; all text from i18n; dark theme on scene screens.

Would feel wrong (user, 2026-10-02): a banking app, a children's game, a betting site, small cramped text, an impersonal screen that hides who the player is.

User revisions folded in (2026-10-02): smaller scene and more room for story and options; three options, one per temperament; identity strip with club, Over number and mini trophies with a count badge; neutral grey ground instead of navy; shirt number fixed in the sample scene.

Unresolved: recolouring of the scene by club and a per-scene focus point for the crop (art code, T44b/T45b); real trophy art per competition (art lot 5); story text for every event (T51).

## Direction contract

THESIS: The shirt number is the screen. A giant numeral, the player's age, anchors the panel like the number on a back, and the captain's armband is the only colour that moves. Refuses the category default of a rounded card sheet with pill buttons floating over an image.

OWN-WORLD: Neutral graphite ground (#212222, surface #2C2D2D) so no club colour is ever fought; Cal de campo #F2F4EF type; Amarelo braçadeira #FFC21A only on the progress band and the pressed option; green and red, lightened for the dark ground, only on consequence arrows; club colours appear only inside the stylised crest and the painting. Big Shoulders Display for numerals, names and titles, Atkinson Hyperlegible for everything read. Options are full-width bands divided by hairlines, square-shouldered, no cards, no shadows, no pills.

STORY: the player sees who he is (crest, name, club, Over, trophies), where he is in the career (armband band and age), what happened (title and story across the full width), then compares three options top to bottom, each naming its temperament, and commits with a thumb.

FIRST VIEWPORT: scene across the top at about half the screen width in height; identity strip on a lighter surface: crest, name, position and club with mini trophies under them, OVER and its number on one baseline at right; a 6px armband progress band; numeral about 5.5rem with ANOS under it beside the title; the story across the full width; then three stacked full-width bands at least 64px tall, each with its label and one row holding its temperament and consequence items; the last band sits above the safe-area inset.

FORM: "Número gigante", position 5 of 7 on the ordered structure list; surface seed key 71a367db. Signature interaction: pressing an option turns the whole band into the yellow armband with dark type, instantly; no other motion (the brand allows one animated moment, the opening stamp).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
