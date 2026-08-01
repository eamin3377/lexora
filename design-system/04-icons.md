# DS-04 — Inkline Icon System

## 1. Construction rules

- **Grid:** 24×24 with 1.5px safe padding (live area 21×21). Optical, not mathematical, centering.
- **Stroke:** 1.75px, round caps & joins, corner radius 2.5px on angular shapes. No fills in the default set.
- **Style DNA:** every icon could plausibly be drawn with the same pen as the logomark — continuous strokes preferred, ≤3 path pieces, one 0.25px "hand" waver baked into curves (subtle; grids/exports stay crisp).
- **Sizes:** 16 (dense UI, stroke 1.5px redrawn — not scaled), 20 (buttons, rows), 24 (nav, panels), 28 (pipeline glyphs). Never scale between; each size is its own master.
- **Color:** `lx-text-secondary` default; interactive parents drive hover to `-primary` or context accent. Filled variant = accent-200 fill + 1.75px ink outline (used only for active/selected states).

## 2. Set scope (~140 general + 14 bespoke)

General set derived from Lucide geometry, redrawn to Inkline DNA (stroke, radius, waver) — categories: navigation, actions, files, media/transport, status, arrows, objects, social.

**Bespoke compiler glyphs (the crown jewels, 24px masters):**
| Glyph | Drawing | Hover micro-animation (≤800ms, once per hover) |
|---|---|---|
| `token-chip` | rounded pill w/ 2 text ticks | ticks blink in sequence |
| `dfa` | double circle + exiting edge w/ arrowhead | inner ring blips (scale pulse) |
| `nfa` | two overlapping single circles + ε | circles drift 1px apart & back |
| `ast` | 3-node tree, root filled dot | third node + branch draws in |
| `grammar` | rule card w/ `→` line | arrow extends 2px |
| `shift` | plate + down arrow | plate drops 2px + settle |
| `reduce` | 3 plates + brace folding | plates fold toward center |
| `ir` | 3 lines, middle offset left | middle line slides into align |
| `register` | bracketed slot w/ dot | dot hops out and back |
| `pipeline` | 3 chained rounded stages | a dot travels the chain |
| `lexeme` | half-brackets around text tick | brackets pinch inward |
| `epsilon` | ε in Inkline stroke | draws itself |
| `lookahead` | eye + chevron right | pupil shifts toward chevron |
| `conflict` | forked arrow | fork tines splay 2° |

## 3. Animated icon standards

Micro-animations ship as Lottie (or animated-SVG) with static SVG fallbacks; trigger states: `hover`, `active` (loops gently, e.g., pipeline dot while building), `success-once`. Duration ≤800ms, easing `out-quint`, no loops on hover (play once, reset after 2s). Reduced-motion: static always.

## 4. Production & delivery

Masters in Figma (per-size components, auto-exported); pipeline: SVGO → sprite + per-icon React components (`<Icon name="dfa" size={20} />`); animated pairs co-located. Naming `icon-{name}-{size}`. New-icon checklist: 4 size masters · stroke audit at 100%/200% zoom · 16px legibility test · pairs-well screenshot beside 3 existing icons · dark-on-terminal variant check (icons on terminal chrome use `term-text`).

## 5. Usage rules

Icons never appear without a text label except: icon-buttons (tooltip mandatory), transport controls (universal symbols), and status dots. Max one animated icon visible per panel at rest. Emoji are banned in UI chrome (allowed in user content only). The logomark is not an icon — never use it at ≤16px except the favicon master.
