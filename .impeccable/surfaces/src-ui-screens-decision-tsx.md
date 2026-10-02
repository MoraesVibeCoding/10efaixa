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

User revisions folded in (2026-10-02): smaller scene and more room for story and options; three options, one per temperament; identity strip with club, Over number and mini trophies with a count badge; neutral grey ground instead of navy; shirt number fixed in the sample scene. Then a replacement world, pinned by the user with a named reference (the browser game 7a0 in light mode, for colour and type) and green in place of its orange: light theme, Over as a rounded card coloured by overall tier, trophies with a ×N tag, age moved into the record.

Unresolved: recolouring of the scene by club and a per-scene focus point for the crop (art code, T44b/T45b); real trophy art per competition (art lot 5); story text for every event (T51).

## Direction contract

THESIS: A match programme printed on cream paper. Everything read as a block or pressed is an inked box with a hard green shadow; the screen refuses the dark glassy game HUD and the soft rounded card sheet alike.

OWN-WORLD: Papel #EEE9DF ground, lighter #F8F5EE inside boxes; Marinho #14213D ink for type and 2px box borders; Verde gramado #1E7B4F as the base colour: hard 3px shadows without blur, the progress line, the pressed option, the "Seu jeito" tag. Red and green arrows only on consequences. Club colours only in the stylised crest and the painting. The Over sits in a rounded card whose gradient is the overall tier (bronze, silver, gold, platinum, emerald, violet diamond). Big Shoulders Display at 900 uppercase for names and titles, Atkinson Hyperlegible for everything read. 4px corners; no blur shadows, no glass.

STORY: the player sees the scene, then who he is in one inked box (crest, name, club, OVR card; age, playing time and salary in three cells; trophies with ×N), then what happened (title and story), then compares three option boxes, each naming its temperament, and presses one.

FIRST VIEWPORT: scene across the top, cropped to about 46% of the width in height, closed by an inked progress line filled in green; below, with 16px side margins: the player box; the title in display caps and the story in muted ink; three stacked option boxes at least 64px tall with label, a temperament tag and consequence items, a chevron at right; the last box sits above the safe-area inset.

FORM: a redesign pinned by the user's reference, replacing "Número gigante" (surface seed key 71a367db, kept for the record); no new roll was run because a user-pinned direction beats the roll. Signature interaction: pressing an option drops the box onto its own shadow and floods it with green, instantly; no other motion (the brand allows one animated moment, the opening stamp).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
