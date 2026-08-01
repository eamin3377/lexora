# D02 — Home Page: Pixel-Perfect Specification

Refines doc 04 into exact measurements, colors, and animation choreography. Desktop 1440 reference; deltas noted.

---

## S1 — Hero (100vh min 720px, max 880px)

**Background:** `sunrise` gradient at 100% width; paper grain overlay 3%; 5 floating paper-cut tokens (`{`, `;`, `id`, `+`, `ε`) — 40–64px, `card` fill + hairline + flat paper shadow, positioned at (8%,18%) (14%,72%) (52%,10%) (88%,30%) (82%,80%); each drifts on independent sine loops (y ±14px / 7–11s, rotate ±4°); parallax: tokens translate up to 24px opposite pointer at 0.03 factor. All disabled ≤767px and reduced-motion.

**Grid:** content 1200px; left column cols 1–5, right cols 6–12, vertically centered.

**Left column:**
- Overline pill: `INTERACTIVE COMPILER SCHOOL` 12px/+4% caps, leaf-100 fill, leaf text, 24px height, radius full.
- 20px gap → H1 61/64: "See the machine **think.**" — "think." gets the 6px leaf marker underline, which **ink-draws 400ms after** the word appears.
- 24px gap → subhead 20/30 `ink-500`, max 440px: "Learn compilers by watching them work — regex to executable, every step animated."
- 40px gap → CTA row: Primary "Start learning free" (52px height, 28px padding-x, 17px/600, leaf-sheen, radius 10; hover: e2 + 1.5% scale + sheen highlight sweeps left→right 500ms). 16px gap. Ghost "Open a playground →" (52px, arrow slides 4px right on hover).
- 32px gap → trust row: 3 avatar-cluster (24px, −8px overlap) + "Joined by 40,000+ students" 14px `ink-500`.
- **Entrance:** overline → H1 words (60ms stagger, rise 20px) → underline draw → subhead → CTAs (spring pop, 80ms apart) → trust row. Total ≤ 1100ms.

**Right column — the Live Pipeline Machine (620×520px stage):**
The 3D centerpiece (see D09 §2 for full 3D art direction). Framed composition:
- A low-poly paper-textured machine: intake tray (left) → glass scanner chamber with Lexi's lens (center-left) → gear cluster (center) → token chute (right) → output pedestal.
- Source card floats top-left (280×64px, `card`, code 16px mono): `let x = 3 + 4;` — **click-to-edit**: card lifts to e3, caret appears, machine idles politely (gears slow to 20%); on Enter, machine spins up (200ms gear acceleration) and re-runs the full sequence on the user's line.
- **Run choreography (7.2s loop, then 2s hold, 800ms tape-rewind blur, repeat):**
  | t | Event |
  |---|---|
  | 0–1.8s | Characters peel off the card one-by-one (60ms apart), ride the conveyor into the scanner; each char is a 22px mono tile |
  | 1.2–3.0s | Lens flashes marigold per lexeme boundary; token chips pop out of the chute (spring, 0.6→1) and stack on a rail: `let`·`x`·`=`·`3`·`+`·`4`·`;` colored by category |
  | 3.0–4.6s | Chips fly along an ink-drawn bezier into a parse tree that grows above the machine (branches ink-draw 120ms each, leaves = the chips themselves) |
  | 4.6–5.6s | Tree folds downward (branches retract) into 3 TAC lines on a paper slip |
  | 5.6–6.6s | Slip stamps into 4 assembly lines (letterpress thunk: 2px drop + shadow pulse) |
  | 6.6–7.2s | Output pedestal lights: `▶ 7` pill blinks on (leaf), machine does a 1° satisfied wiggle |
- Pointer proximity <120px slows global timescale to 0.4× (feels alive/curious). WebGL tier lazy-loads; SVG fallback runs identical choreography flat.
- Machine **assembles once** on load: 5 parts slide/settle from 40px offsets with springs, 900ms total, after H1.

**Scroll cue:** 24px mouse glyph + "scroll to compile" 12px caps, gentle 8px y-loop, fades by 80px scroll.

## S2 — Scroll-scrubbed pipeline (pinned, 300vh scroll distance)

Pinned stage 1200×560px. Nine stage cards (120×88px, radius 12, stage accent-100 fill + accent hairline, Inkline glyph 28px + 13px label) on a horizontal rail with 24px gaps, connected by 2px ink path. A 10px glowing packet (stage-accent, 12px blur halo) travels the path mapped 1:1 to scroll progress. When the packet enters a card: card expands to 320×280px (400ms spring) pushing neighbors, revealing its micro-demo (self-contained 3s loop: lexer→chips popping; parser→3 plates folding; optimizer→`3+4` tiles magnetically fusing to `7` with a 6-particle paper puff; codegen→TAC line sliding into a register slot). Section header above: H2 "What even happens when code compiles?" + 16/26 `ink-500` sub. Progress dots (8px, 9) bottom-center mirror scroll. ≤767px: unpinned vertical stepper — cards full-width 96px collapsed / tap to 320px expand, packet jumps per tap.

## S3 — Interactive token strip (720px centered, 240px tall)

H3 "Type any code. Watch it tokenize." → 12px → input 720×64px (`card`, radius 16, e1, mono 18px, focus: cobalt border-draw 200ms) prefilled `if (count >= 10) return "done";` → 20px → chip rail (wrap, 8px gaps): chips 28px height, 12px mono, category colors, re-pop on keystroke with 30ms stagger **only for changed tokens** (diffed — unchanged chips stay put; feels surgical). Hover chip: ink underline draws from chip to its source span in the input (SVG overlay, 150ms); tooltip `IDENT · "count" · col 5`. Example pills right-aligned above input: `C` `JSON` `SQL` (28px ghost pills; click: input clears at 20ms/char then types the sample at 25ms/char).

## S4 — Three front doors (1200px, 3× 384px cards, 24px gaps)

Cards 384×420px, radius 16, e1, 32px padding, 3px top stage stripe (leaf/cobalt/marigold). Content: thumbnail stage 320×180px (paper-1 inset, radius 12) → H3 → 15/24 `ink-500` 3 lines → ghost link w/ arrow. Thumbnails are live micro-loops: **Learn** = roadmap trail with nodes lighting sequentially (4s); **Tools** = 3-state DFA pulsing through `abab` (3s); **Build** = terminal line typing `make` + progress bar filling + green ✓ (5s). Hover: lift e2 −4px, loop speed ×1.5, stripe grows to 5px. Enter: 80ms stagger rise.

## S5 — Roadmap preview (full-bleed `paper-1` band, 640px tall)

1200px stage: ink trail (3px, hand-jittered path) winding through 8 milestone nodes (56px circles, stage accents, Inkline glyphs). Trail ink-draws 1.2s on 30%-viewport entry; nodes pop sequentially (spring, 90ms apart) with count-tick "12 lessons" caption fading under each. Lexi idles at node 1 (72px, 2-frame 1.2s loop). Node hover: 3D-flip (400ms, perspective 800) to back face: lesson count, est hours, "Start →". Header: H2 "One path. Zero setup." + centered marker underline (marigold).

## S6 — Live demo band (1200×620px)

The **real** `<RegexLab>` component in a device frame (radius 24, `device` shadow, 12px paper bezel with 3 ink dots), preloaded `(a|b)*abb` / `aababb`. On 50% entry: autoplays one NFA run (per D06 timings), then a soft cobalt pulse rings the input ("your turn"). Caption row below: "This is the actual tool — not a video." 14px `ink-500` + ghost "Open full Regex Lab →".

## S7 — Statistics (1200px, 4 cols)

Metric blocks: value 49/56 750 tabular `ink-900`, label 14 caps `ink-500`, 24px sparkline beneath (ink-draws 600ms). Count-up 600ms ease-out on entry, staggered 100ms. Values: 40K+ learners · 220K visualizations shared · 1.2M programs compiled · 60+ universities. Hairline verticals between cols.

## S8 — Testimonials (900px centered, 360px tall)

64px hand-inked `"` glyph (ink-draws on each change, 300ms) → quote 25/36 500 `ink-900` max 3 lines → 24px → author row (44px portrait in 2px ink circle + name 15/600 + role 13 `ink-500`). Crossfade+20px slide every 7s; 5-dot pager + arrow buttons (32px ghost circles) pause auto-advance 20s. Portraits: real photos, duotone paper treatment (ink shadows, warm highlights).

## S9 — Community gallery (1200px masonry, 3 cols, 24px gaps)

6 cards (heights 200–320px): live-thumbnail (paused first frame; hover plays 2s loop at 0.75 opacity→1) + title 15/600 + author + stat chips. Click → tool with state. Header: H2 "Made by learners, shared everywhere." Cards enter with 60ms stagger.

## S10 — Latest projects (full-bleed, horizontal snap-scroll)

Cards 340×220px, 20px gaps, momentum scroll; drag tilts cards ±2° toward velocity; edges fade via 48px paper gradient masks. Card: project artwork band 100px (real pipeline render) + title + author + tech chips + ★ count. Terminal card: dashed-border "Build yours →" with plus glyph that draws on hover.

## S11 — FAQ (720px, 8 items)

Rows: 64px collapsed, 20px/600 question, chevron 20px rotates 180° (200ms); answer auto-height 220ms ease-in-out, 16/26 `ink-700`, 16px padding-bottom; open row gets leaf 3px left stripe. Opening auto-scrolls item to 96px from nav if occluded.

## S12 — Pre-footer CTA (full-bleed `sunrise`, 320px)

Centered H2 "Your first token is 60 seconds away." + primary CTA 56px. A single paper token drifts across behind text (18s traverse). Then Footer per D01 §5.

**Mobile deltas (≤767):** hero stacks (machine 100vw×360px SVG-only below headline, non-editable, tap-to-replay); S2 stepper mode; S4 cards stack full-width; S6 device frame edge-to-edge with 16px margins; S7 2×2 grid; S10 native scroll-snap with peek 24px.
