# DS-05 — Marginalia Illustration System

## 1. Style constitution

- **Line:** 2px ink (`ink-900`) outlines, hand-jitter ±0.5px, round terminals; interior detail lines 1.25px.
- **Fill:** marker-style accent fills offset 1–2px outside lines (misregistration charm); max 2 accent families + paper tones per illustration.
- **Shadow:** `lx-shadow-paper-flat` (4px offset 135°, `line` color, zero blur) under grounded objects only.
- **Texture:** 3% paper grain multiply within fills; nothing glossy, no gradients inside illustrations.
- **Scale bands:** spot (≤64px, single object), scene (≤180px, 1–2 characters + prop), hero-scene (≤320px, marketing only). Characters never exceed 180px in app UI.

## 2. The cast (canonical model sheets)

| Character | Design | Personality | Owns |
|---|---|---|---|
| **Lexi** the Scanner | Brass-rimmed magnifying glass, two stick legs, lens tints marigold when scanning | Curious, quick, slightly obsessive about order | Lexing surfaces, search/empty states, beginner cursor |
| **Stax** | Tower of 4–7 cafeteria plates, one sleepy eye per plate, wobbles | Anxious but load-bearing; relieved when popped | Stacks, parsing, 500 page |
| **The Grammarian** | Horned owl, monocle (accepting double-ring), holds production-rule cards in wing | Fussy, precise, secretly kind | Grammar tools, docs, review queue |
| **Bug** | Ladybug with coral `!` on shell, always slightly embarrassed | Apologetic, harmless, helpful | Errors, diagnostics, 404 |

**Pose library per character (12 poses):** idle (2-frame loop) · wave · point-left/right · celebrate · think · sleep · work · oops · peek (from edge) · walk cycle (6-frame) · read. All poses exported at 3 scale bands.

**Rules:** characters support, never explain (pedagogy lives in the visualizers); max one character on screen at rest; characters never overlap interactive elements; Bug never appears for *user* mistakes in graded contexts (shame-free rule) — only for system errors and playful teaching moments.

## 3. Spot object library (~60)

Paper-cut tokens (`{ } ; id + ε → | * ( )`), rule cards, plates, tape reels, gears, conveyor segments, ink pens, bookmark pins, wax seals, laurels, envelopes, manila folders, blueprints, flags, ice cubes (streak freeze), flame tiers. Each: SVG, 3 sizes, follows the constitution.

## 4. Scene formulas (repeatable compositions)

Empty state = 1 character (peek or idle) + 1 spot object + one line of copy + action. Success = celebrate pose + ≤12-piece paper confetti. Error page = character + broken prop. Onboarding = character pointing at the real UI element (never a screenshot). Marketing hero-scenes = the cast operating machinery built from spot objects (composed per campaign, parts reused).

## 5. Backgrounds & marginalia

Doodle layer: arrows, ε, tiny automata, underlines at **8% opacity ink**, hand-drawn, sprinkled only on empty states, 404s, and section headers (never behind reading text or tools). Paper grain global at 3%. Section divider art: a single 1200×80px strip per marketing page — conveyor, tape, or trail motif.

## 6. Production workflow

Drawn in vector (Figma/Illustrator) with the shared brush preset (jitter baked); layers named `line/fill/shadow`; exported SVG (spots/scenes) or Lottie (pose loops ≤6 frames, hand-timed at 8–12fps for stop-motion charm — deliberately *not* 60fps smooth). Every asset: reduced-motion static frame, title/desc for a11y (`role=img` + label, or `aria-hidden` if purely decorative). File naming `ill-{character|spot|scene}-{name}-{size}`. New-asset checklist: constitution audit · palette lint (tokens only) · 3 bands exported · shame-free review for error contexts.

## 7. Photography (the one exception)

Testimonial portraits only: real photos, duotone paper treatment (warm highlights, ink shadows, 4% grain), inside 2px ink circles. No stock photography anywhere else — diagrams are the brand's imagery (D00 §4).
