---
version: 1
slug: "src-ui-screens-decision-tsx"
primary_target: "src/ui/screens/Decision.tsx"
related_targets: ["src/ui/theme/tokens.json"]
---

# Tela de decisão (src/ui/screens/Decision.tsx)

Scope: the decision screen of a career, the screen every event of the game uses. Visitor mode: Operate.

Audience and job: a Brazilian football fan on a phone, often one-handed and distracted, choosing one of two or three options and understanding what each one causes. Content: scene painting, event title and short text, options with consequence previews (direction and intensity, never numbers), age and career progress. Constraints: one decision per screen; no attribute numbers; WCAG 2.1 AA; all text from i18n; dark theme on scene screens.

Would feel wrong (user, 2026-10-02): a banking app, a children's game, a betting site, small cramped text.

Unresolved: recolouring of the scene by club (art code, T44b); narrative text for every event (T51).

## Direction contract

THESIS: The shirt number is the screen. A giant numeral, the player's age, anchors the panel like the number on a back, and the captain's armband is the only colour that moves. Refuses the category default of a rounded card sheet with pill buttons floating over an image.

OWN-WORLD: Marinho de vestiário #14213D ground continuous with the painting's dark lower 40%; Cal de campo #F2F4EF type; Amarelo braçadeira #FFC21A only on the progress band and the pressed option; green and red, lightened for the dark ground, only on consequence arrows. Big Shoulders Display for the numeral and titles, Atkinson Hyperlegible for everything read. Options are full-width bands divided by hairlines, square-shouldered, no cards, no shadows, no pills.

STORY: the player reads where he is in the career (numeral and band), what happened (title, one or two lines), then compares options top to bottom and commits with a thumb.

FIRST VIEWPORT: scene fills the top 56% of a phone screen; a 6px armband progress band crosses the full width where the panel begins; below it a two-column head, numeral about 5.5rem at left with ANOS under it, title and text at right; then the options as stacked full-width bands at least 64px tall, each with its label and a row of consequence items; the last band sits above the safe-area inset.

FORM: "Número gigante", position 5 of 7 on the ordered structure list; surface seed key 71a367db. Signature interaction: pressing an option turns the whole band into the yellow armband with navy type, instantly; no other motion (the brand allows one animated moment, the opening stamp).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
