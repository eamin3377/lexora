# 04 — Home Page Specification

Goal: a visitor with zero context should, within 8 seconds, *see a compiler working* and feel "I could finally understand this." Every section below specifies content + **exact animation behavior**.

---

## Section 1 — Hero

**Layout:** asymmetric split. Left 45%: headline block. Right 55%: the *Live Pipeline Machine*. Background: `sunrise` gradient wash + faint paper grain + 5 floating paper-cut tokens drifting slowly.

- **Headline:** "See the machine think." Sub: "Learn compilers by watching them work — regex to executable, every step animated."
- **CTAs:** Primary "Start learning free" (leaf) · Ghost "Open a playground →".
- **Animation — Live Pipeline Machine (the centerpiece):** a real, working mini-compiler running `let x = 3 + 4;`:
  1. Characters slide one-by-one from a source card onto a conveyor (character-eat animation).
  2. The Scanner character's lens sweeps them; token chips pop out (`let`→KEYWORD cobalt, `x`→IDENT leaf, `3`→NUM marigold…).
  3. Chips fly along an ink-drawn path into a parse tree that grows branch-by-branch (ink-draw).
  4. Tree folds into three lines of TAC, then into 4 lines of assembly, then a small "▶ 7" output pill blinks on.
  5. Loop pauses 2s, rewinds with a tape-rewind blur, replays. Pointer proximity slows it (feels alive). **It is editable:** clicking the source card lets the visitor type their own one-liner — the whole machine re-runs on their input. This is the < 60s aha moment.
- **Entrance:** headline words rise-fade staggered 60ms; machine assembles itself once (parts slide in, 900ms total).

## Section 2 — "What even is a compiler?" (scroll-scrubbed pipeline)

Full-width horizontal pipeline: Source → Lexer → Parser → Semantics → IR → Optimizer → Codegen → Executable, each stage a labeled card in its owning accent color.

- **Animation:** scroll-scrubbed. As the user scrolls through this pinned section, a glowing packet travels the pipeline; each stage card expands in turn showing a 3-second micro-demo inside (lexer stage shows chips popping; optimizer shows `3+4` collapsing to `7` with a satisfying merge). Progress dots below mirror scroll position. On mobile: becomes a tap-through vertical stepper (no pinning).

## Section 3 — Interactive token strip

A single code line in a big editable input: "Type any code. Watch it tokenize."

- **Animation:** live tokenization on every keystroke — chips re-pop with 30ms stagger beneath the input; hovering a chip draws an ink underline connecting chip ↔ source characters. Three example pills (`C`, `JSON`, `SQL`) swap the input with a typewriter effect.

## Section 4 — Feature trio (the three front doors)

Three large cards: **Learn** (roadmap preview), **Tools** (mini automata thumbnail), **Build** (project artwork).

- **Animation:** cards stagger-reveal; each card's thumbnail is a looping micro-animation (roadmap nodes lighting sequentially; a 3-state DFA pulsing through `abab`; a calculator project "compiling" progress bar). Hover: card lifts e2, thumbnail animation speeds up 1.5×.

## Section 5 — Learning roadmap preview

Horizontal winding path (ink-drawn trail on paper) with milestone nodes: Regex → Automata → Lex → Grammars → Parsing → Semantics → Backend → Capstone.

- **Animation:** trail ink-draws as it scrolls into view (1.2s); nodes pop sequentially; the Scanner character sits at node 1 waving (2-frame idle loop). Hovering a node flips it to show lesson count + est. hours.

## Section 6 — Live demo band ("Try it right here")

Embedded, fully functional **Regex Visualizer** (real component, preloaded with `(a|b)*abb` and input `aababb`), framed as a device on paper-1 background.

- **Animation:** autoplays one matching run (NFA states pulsing per character) when scrolled into view, then hands control to the user. "Open full playground →" ghost link.

## Section 7 — Statistics

Four Metric blocks: learners, visualizations shared, projects compiled, universities.

- **Animation:** numbers count up (600ms, ease-out) on first view; under each, a subtle sparkline draws in. No spinning globes.

## Section 8 — Testimonials

Editorial pull-quote style: one large quote at a time with author + role, small portrait in an ink-circle frame; queue of 5.

- **Animation:** quotes crossfade every 7s with a 20px horizontal slide; quotation mark glyph drawn in ink-draw style on each change. Manual arrows pause auto-advance.

## Section 9 — Interactive examples gallery

Masonry of 6 shareable visualizer states pulled from real community links ("SQL SELECT grammar in LALR", "Email regex as DFA — 34 states!").

- **Animation:** each thumbnail is a paused first-frame; hover plays a 2s preview loop; click opens the actual tool with that state.

## Section 10 — Latest projects

Carousel of student capstones from the gallery (project card: title, author, tech chips, star count).

- **Animation:** horizontal snap-scroll with momentum; cards tilt ±2° toward drag direction; end-of-list reveals "Build yours →" card.

## Section 11 — FAQ

Accordion, 8 questions (Do I need C? Does it work on my phone? Is the terminal real? …).

- **Animation:** height auto-animate 220ms; chevron rotates; opening one softly scrolls it into comfortable view.

## Section 12 — Footer

Deep paper-2 band. Columns: Learn / Tools / Build / Company / Legal + newsletter input + social. Signature detail: a one-line mini pipeline in the footer where a tiny token endlessly travels left→right (4px dot, 12s loop) — the platform's heartbeat.

- **Animation:** newsletter button on success morphs into a leaf checkmark with confetti of 6 paper-cut tokens (once, respects reduced-motion).

## Performance notes for home

Hero machine: SVG + Framer Motion (no WebGL requirement above the fold; the 3D variant lazy-loads and swaps in on capable desktops only). Scroll-scrub section uses transform-only animation. Everything below fold lazy-loaded. LCP target: headline < 1.8s.
