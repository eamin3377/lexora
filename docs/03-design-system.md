# 03 — Design System: "Paper & Ink"

**Design language name:** *Paper & Ink* — a bright, tactile, editorial system that feels like a beautifully typeset textbook that came alive. Warm paper surfaces, precise ink linework, and four vivid "marker" accents used like a teacher's highlighters.

**Explicit exclusions:** No dark mode. No purple-on-black gradients. No glassmorphism-on-navy. No Bootstrap card grids. No stock 3D blob heroes. No neon.

---

## 1. Color Palette

### Surfaces (warm paper, never pure white)
| Token | Hex | Use |
|---|---|---|
| `paper-0` | `#FDFBF7` | App background (warm off-white) |
| `paper-1` | `#F7F3EA` | Section alternation, sidebars |
| `paper-2` | `#EFE9DC` | Wells, code-block gutters |
| `card` | `#FFFFFF` | Cards/panels (only true white, floats above paper) |

### Ink (text & linework — warm near-black, never #000)
`ink-900 #1A1F16` (headings) · `ink-700 #3D443B` (body) · `ink-500 #6B7267` (secondary) · `ink-300 #A8AEA2` (placeholders) · `line #E3DDCE` (hairline borders).

### Marker accents (the highlighters — each owns a compiler stage)
| Token | Hex | Owns |
|---|---|---|
| `leaf` (primary) | `#2F9E6E` | Brand, success, accepted states, CTAs |
| `marigold` | `#F5A623` | Lexical analysis, tokens, warnings |
| `coral` | `#FF6B5E` | Errors, rejected states, parsing conflicts |
| `cobalt` | `#3B6FE0` | Syntax/parsing, links, info |
| `orchid` | `#B25FD1` | Semantics/IR (used sparingly) |

Tints: each accent has `-100` (8% on paper) and `-200` (16%) for fills behind highlighted tokens. Rule: **max two accents per view** besides state colors; stage color-coding is the exception (pipeline shows all).

### Gradients (soft, paper-safe)
- `sunrise`: 135°, `#FFF6E3 → #FDECEC → #EDF3FF` — hero backdrop only.
- `leaf-sheen`: `#2F9E6E → #37B27D` — primary buttons.
- Accent gradients never exceed 20° hue shift; no rainbow gradients.

## 2. Typography

| Role | Face | Notes |
|---|---|---|
| Display / headings | **Cabinet Grotesk** (variable) | Tight -2% tracking, 1.1 leading; editorial confidence |
| Body / UI | **Inter** (variable) | 16px base, 1.6 leading |
| Code / tokens / terminal | **JetBrains Mono** | Ligatures ON in editor, OFF in lessons (learners must see `->` as two chars) |
| Math/formal notation | **STIX Two Math** | FIRST/FOLLOW sets, 5-tuples |

Scale (1.25 ratio): 12 · 14 · 16 · 20 · 25 · 31 · 39 · 49 · 61. H1 uses 49/61, weight 700. Numerals: tabular in tables/stats.

## 3. Spacing, Grid, Radius, Elevation

- **Space scale:** 4-base — 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- **Grid:** 12-col, 1200px max content (lessons narrow to 720px prose + tool full-bleed breakouts).
- **Radius:** `sm 6` (inputs) · `md 10` (buttons) · `lg 16` (cards) · `xl 24` (hero panels) · full (pills/badges).
- **Elevation (warm shadows, never gray):**
  - `e1` `0 1px 2px rgba(58,50,30,.06)` — resting cards
  - `e2` `0 4px 12px rgba(58,50,30,.08)` — hover, dropdowns
  - `e3` `0 12px 32px rgba(58,50,30,.12)` — modals, command palette
  - `press` inner `0 1px 2px` — active buttons
- **Glass (light glass only):** top nav & floating panels: `rgba(253,251,247,.78)` + `backdrop-blur(14px)` + hairline `line` border. Never dark glass.

## 4. Core Components

- **Buttons:** Primary (leaf-sheen fill, white text, radius-md, hover lifts to e2 + 1.5% scale, press sinks); Secondary (card fill, ink text, hairline border); Ghost (text + underline-slide hover); Destructive (coral). All have 150ms spring transitions and focus ring `2px cobalt @ 40%` offset 2px.
- **Inputs:** card fill, hairline border, focus border animates to cobalt with a subtle 200ms "draw around" effect; floating labels; inline validation slides in below with icon.
- **Cards:** white on paper, e1, hover e2 + translateY(-2px); optional 3px left "stage stripe" in the owning accent.
- **Panels (tool chrome):** paper-1 headers with pill tabs; resizable splitters (6px hit area, cobalt on drag).
- **Code blocks:** paper-2 background, hairline border, JetBrains Mono 14px, custom light syntax theme ("Inkwell": keywords cobalt, strings leaf, numbers marigold, comments ink-300 italic, errors coral wavy underline). Line numbers in gutter; copy button appears on hover; executable blocks get a Run ▸ pill.
- **Editor:** Monaco with Inkwell theme, breadcrumbs, minimap off by default.
- **Terminal:** the one intentionally dark *element* (`#23281F` deep ink-green, not a theme) framed like a physical device in a paper bezel with three ink dots. Cream text `#F2EFE4`, block cursor blinks 1.06s.
- **Badges/pills:** accent-100 fill + accent text; token chips (see below).
- **Token chip (signature atom):** rounded-full monospace chip, category-colored (`KEYWORD` cobalt-100, `IDENT` leaf-100, `NUMBER` marigold-100, `OP` orchid-100, error coral); used identically in lessons, tools, and output panes so tokens are visually consistent platform-wide.
- **Toast/callouts:** paper cards sliding from top-right; lesson callouts: Insight (leaf stripe), Watch out (coral), Deep dive (cobalt), Try it (marigold).

## 5. Motion System

**Motion principle: "Chalkboard, not fireworks."** Motion exists to show computation and causality. Every animation answers "what changed and why."

- **Durations:** micro 120–180ms · standard 200–300ms · scene/page 400–600ms · pedagogical animations: learner-controlled (play/pause/step/scrub, speed 0.25×–4×).
- **Easing:** `ease-out-quint` for entrances, `ease-in-out-cubic` for moves, spring (stiffness 300, damping 24) for tactile UI. No bounce on pedagogy (precision matters).
- **Signature motions:**
  - *Ink draw:* SVG strokes (automata edges, tree branches) draw in via dash-offset, like a pen.
  - *Token pop:* accepted token scales 0.6→1 with spring + accent-100 flash.
  - *Character eat:* scanner cursor slides per character; consumed chars tint marigold-100.
  - *State pulse:* active automaton state gets a soft radial pulse each transition.
  - *Underline slide:* nav links & ghost buttons.
  - *Stagger reveal:* lists/cards cascade 40ms apart on scroll-into-view (once, 24px rise + fade).
- **Page transitions:** 250ms crossfade + 12px rise; tool→lesson shares the pipeline strip element (layout-morph continuity).
- **Loading:** skeletons shimmer in paper tones; long compiles show a mini pipeline with stages lighting up as real phases complete.
- **Hover:** cards lift; interactive diagram nodes grow 1.08 + show grab cursor; token chips reveal tooltip (lexeme, type, position) after 350ms.
- **Scroll:** hero pipeline scroll-scrubbed (see doc 04); prose sections simple fade-rise. Parallax ≤ 24px, decorative layers only.
- **Reduced motion:** `prefers-reduced-motion` → all decorative motion off; pedagogical animations become discrete stepped frames (step buttons remain — learning never depends on continuous motion).

## 6. Illustration, Icons & 3D

- **Illustration language:** hand-drawn "ink & marker" style — 2px ink outlines, imperfect marker fills slightly overshooting lines, on paper texture. Recurring cast: the *Scanner* (a magnifying-glass character that eats characters), the *Stack* (a wobbly tower of plates), the *Grammarian* (an owl with rule cards). Used in empty states, achievements, section headers.
- **Icons:** custom 1.75px-stroke rounded set derived from Lucide, with bespoke compiler glyphs (token, DFA, AST, IR, shift, reduce). Micro-animated on hover (Lottie/SVG, e.g. the DFA icon's state blips).
- **3D (restrained, no blobfields):** one hero centerpiece — a paper-textured, low-poly "compiler machine" (conveyor of characters → gears → tokens) built in Three.js/R3F, lit softly, rotating ±8° on pointer. Floating objects limited to hero + section dividers: paper-cut tokens and parentheses drifting on 6–10s sine loops, `translate3d` only, disabled on mobile/reduced-motion.

## 7. Accessibility (system-level)

Contrast: body ink-700 on paper-0 = 9.8:1; all accents have ≥4.5:1 text variants. Color never sole channel: tokens also differ by chip label; states also by icon/pattern (accepted = double ring, rejected = dashed). Full keyboard support incl. diagram traversal (arrow keys walk automaton states, announced via `aria-live`). Focus visible always. Animations narrated: each pedagogical step emits a text log line ("Shifted `id` onto stack") — doubles as screen-reader stream and study transcript.
