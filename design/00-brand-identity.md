# D00 — Brand Identity: Logo, Mark, Graphics

The brand must read as *precision-engineered warmth* — a Swiss-grade identity with a hand-inked soul. Nothing in it may resemble default AI branding (no hexagon-brain, no chat bubble, no generic `</>` glyph, no gradient orb).

---

## 1. The Logomark — "The Loop State"

**Concept:** the single most iconic drawing in all of compiler theory — a DFA accepting state with a Kleene-star self-loop — redrawn as one continuous calligraphic ink stroke that simultaneously forms a lowercase **ℓ** (for Lexora).

### Construction (on a 96×96 grid)
- **Base circle (the state):** center (48, 56), radius 26px, stroke 7px, `ink-900 #1A1F16`, round caps.
- **Inner ring (accepting state):** radius 17px, stroke 3.5px — the double-circle is the identity's secret handshake; compiler people recognize it instantly.
- **The ascender/loop (ℓ + Kleene star):** a stroke rises from the circle's top-right tangent point (66, 36) to (58, 8), curls left in a 14px-radius loop and re-enters the circle at (38, 34). Same 7px stroke. This loop *is* the self-transition arrow — its end carries a 10×10px chiseled arrowhead landing on the circle.
- **The traveling dot (motion element):** a 6px `leaf #2F9E6E` dot that lives on the stroke path. Static versions place it at the loop's apex (57, 9).
- **Ink texture:** stroke edges have 0.5px of hand-drawn jitter (baked into the master SVG, three jitter variants rotated randomly at build for print collateral; UI uses variant A only for consistency).

### Color variants
| Variant | Circle/loop | Dot | Use |
|---|---|---|---|
| Primary | `ink-900` | `leaf` | Everywhere on paper surfaces |
| Mono ink | `ink-900` | `ink-900` | Legal, favicons ≤16px (dot merges into stroke) |
| Reversed | `#FDFBF7` | `marigold` | On the terminal panel / photography |
| Celebration | animated 4-color dot cycle | — | Level-up & certificate moments only |

### Animated logo (the "compile-in")
Used on app load, auth screens, and video bumpers. Duration **1400ms**, never longer:
1. 0–600ms: main circle ink-draws clockwise from 3 o'clock (`stroke-dashoffset`, ease-out-quint).
2. 300–800ms: inner ring draws counter-clockwise (overlapping — feels like two pen hands).
3. 600–1100ms: ascender loop draws upward, arrowhead stamps with a 1.15→1.0 scale settle.
4. 1100–1400ms: the leaf dot pops (0→1 spring, stiffness 400) at the loop apex, then begins its **idle behavior**: one lap around the loop every 6s (2s travel + 4s rest). In nav, the dot laps only on hover.
- Reduced-motion: crossfade in at 200ms, dot static.

## 2. The Wordmark

**"lexora"** — all lowercase, Cabinet Grotesk Bold (750 weight axis), tracking −2.5%, with two bespoke modifications:
- The **x** is redrawn with a 4° splay and slightly flared terminals — a nod to a DFA's crossing transition edges.
- The **o** carries a 2.5px inner ring at 40% opacity (micro-echo of the accepting state) — visible ≥ 28px height, dropped below.
- Color: `ink-900`; the terminal "a" is followed by a 6px leaf dot (period-position, baseline-aligned) in lockups ≥ 32px — "the token that comes out at the end."

### Lockups & clear space
- Horizontal: mark (1×) + 0.5× gap + wordmark (cap-height = 0.58× mark height). Min width 96px.
- Stacked: mark above wordmark, centered, 0.35× gap. For square placements.
- Clear space: 0.5× mark height on all sides. Never place on gradients busier than `sunrise` at 60% opacity.
- Favicon set: 16px = mono double-circle only; 32px = full mark; 180px+ = mark on `paper-0` rounded-28% tile.

## 3. Typography in brand voice

Display lines set in Cabinet Grotesk with **one hand-inked underline** allowed per composition: a 6px marker stroke (SVG, slight overshoot both ends, 0.97 opacity) in the section's accent color under the key phrase. This underline is the brand's recurring graphic gesture — used on the hero ("See the machine **think**"), section headers, and OG images. Never two per viewport.

## 4. Graphic language — "Marginalia"

The illustration system extends doc 03 §6 into a full world:
- **The cast (finalized):** **Lexi** the Scanner (brass magnifying glass with legs; lens tints marigold when "eating"); **Stax** (a wobbling tower of cafeteria plates with one eye per plate; plates = stack frames); **The Grammarian** (a horned owl holding production-rule cards, monocle = accepting-state double ring); **Bug** (a literal ladybug with a coral `!` on its back — appears in error states, always slightly embarrassed, never scary).
- **Rendering rules:** 2px ink outlines (same jitter as logo), marker fills offset 1–2px outside lines (printed-in-the-70s misregistration charm), flat paper shadows (`#E3DDCE`, 4px offset 135°, no blur). Characters never exceed 180px in UI; they support, never headline.
- **Spot textures:** paper grain (3% noise, multiply), margin doodles (arrows, ε symbols, tiny automata) at 8% opacity in empty-state backgrounds only.
- **Diagram art style (the product IS the brand):** automata, trees, and pipelines in marketing materials use the *exact* product renderer output — the visualizations are the brand photography. OG/social cards are server-rendered real diagrams on paper with the marker underline. No stock illustration, ever.

## 5. Iconography

- Custom set "Inkline": 24×24 grid, 1.75px stroke, 2.5px terminal rounding, single-color `ink-700`, filled variants use accent-200 + ink outline.
- 14 bespoke compiler glyphs: token-chip, dfa (double circle + edge), nfa (two overlapping circles), ast (3-node tree), grammar (rule card), shift (plate + down arrow), reduce (three plates folding), ir (three stacked lines, middle offset), register (bracketed slot), pipeline (three chained rounds), lexeme (bracketed text), epsilon (ε), lookahead (eye + chevron), conflict (forked arrow).
- Hover micro-animations (Lottie, ≤ 800ms, play once per hover): dfa's inner ring blips; ast grows its third node; conflict's fork wiggles apart.

## 6. Color in brand contexts

Marketing surfaces may use one additional ceremonial color: **Press Gold `#C9A227`** — reserved exclusively for certificates, the level-12 badge, and the capstone. It never appears in the app UI otherwise (scarcity = prestige).

## 7. Voice

Confident, warm, zero academic hedging. We say "Watch the parser choose" not "Learn about parse table disambiguation." Error copy is kind and specific. The word "simple" is banned (nothing about compilers is simple; everything can be *clear*).

## 8. Brand asset deliverables checklist

Master SVG mark (3 jitter variants) · animated Lottie/JSON logo · wordmark with bespoke x/o glyphs (font-embedded lockup SVGs) · favicon set (16/32/180/512 + maskable) · OG template (1200×630: real diagram + marker underline headline + mark bottom-left at 48px) · social avatars · certificate frame (Press Gold foil-style border, guilloché made of tiny ε characters at 6% opacity) · character sheet (4 cast members × 6 poses) · icon font/sprite (Inkline 140 glyphs + 14 compiler glyphs).
