# D01 — Pixel Foundations & Global Shell

Exact values for every recurring measurement. All numbers in px at 1× (rem = px/16 in implementation).

---

## 1. Layout constants

| Token | Value |
|---|---|
| Page max content width | **1200px**, centered, side padding 32 (lg) / 24 (md) / 16 (sm/xs) |
| Prose column | 720px |
| Grid | 12 columns, 24px gutters (lg+), 16px (md), 8px (sm) |
| Nav height | **64px** (56px on scroll-condensed, ≤767px always 56px) |
| Footer height | auto, min 420px desktop |
| Section vertical rhythm (marketing) | 128px between sections (96 md, 64 sm) |
| Section vertical rhythm (app) | 48px |
| Card padding | 24px (compact 16px) |
| Panel header height | 44px |
| Transport bar height | 56px |
| Status bar (playground) | 28px |
| Border hairline | 1px `#E3DDCE` |
| Focus ring | 2px `#3B6FE0` @40%, offset 2px, radius follows element |

**Z-index scale:** base 0 · sticky pipeline strip 20 · nav 40 · dropdowns 50 · AI slide-over 60 · modals 70 · command palette 80 · toasts 90.

**Shadow recipes (final):**
- `e1`: `0 1px 2px rgba(58,50,30,.06), 0 0 0 1px rgba(58,50,30,.03)`
- `e2`: `0 4px 12px rgba(58,50,30,.08), 0 1px 3px rgba(58,50,30,.06)`
- `e3`: `0 12px 32px rgba(58,50,30,.12), 0 4px 8px rgba(58,50,30,.06)`
- `device` (terminal/visualizer frames): `0 16px 40px rgba(35,40,31,.14), 0 2px 6px rgba(35,40,31,.08)`

**Type ramp (final, desktop → mobile):**
| Role | Size/Line | Weight | Tracking |
|---|---|---|---|
| Hero H1 | 61/64 → 39/44 | 750 | −2.5% |
| H2 (section) | 39/46 → 31/38 | 700 | −2% |
| H3 | 25/32 | 650 | −1% |
| H4 / card title | 20/28 | 600 | −0.5% |
| Body | 16/26 | 400 | 0 |
| Body small / meta | 14/22 | 450 | 0 |
| Caption / labels | 12/16 | 550 | +4%, uppercase |
| Code | 14/22 JetBrains Mono | 420 | 0 |

## 2. Top Navigation (all pages)

64px light-glass bar (`rgba(253,251,247,.78)` + blur 14px + bottom hairline; hairline fades in only after 8px scroll).

```
|←32→| ⓁLexora |←48→| Learn  Tools ▾  Build  Practice  Community |→ flex →| ⌘K search (220px) | 🔥12 | ● avatar 32px |←32→|
```

- Logo lockup 28px tall; hover = dot laps the loop once.
- Nav items: 15px/550, `ink-700`, 12px padding-x, 40px hit height. Hover: 2.5px marker underline slides in from left (180ms ease-out), color = item's stage accent (Learn leaf, Tools cobalt, Build marigold, Practice orchid, Community coral). Active page: underline persistent + text `ink-900`.
- **Tools mega-menu:** opens on hover-intent (120ms delay) — 760×340px e3 panel, radius 16, 24px padding; four columns grouped by pipeline stage with 12px stage-dot headers; each item = Inkline icon 20px + name + 12px description in `ink-500`; item hover = accent-100 pill background (radius 8). Panel entrance: 200ms rise 8px + fade; icons stagger-play their micro-animations 30ms apart (one time per open).
- **⌘K trigger:** 220×36px pill, `paper-1` fill, hairline, placeholder "Search or jump… ⌘K" 14px `ink-300`.
- **Streak flame:** 20px custom glyph + count; at streak≥7 gets a subtle 3s flicker loop (2 frames).
- Scroll behavior: nav condenses to 56px and gains hairline at scrollY>8 (200ms); hides on downward scroll >400px/s, reveals instantly on any upward scroll.
- Mobile (≤767): logo + hamburger (24px, morphs to ✕ via 250ms line-rotation); menu = full-screen paper sheet, items 20px/650 stacked with 40ms stagger rise, tool groups as accordions.

## 3. Command Palette (⌘K)

640×max 480px, centered 20vh from top, e3, radius 16, backdrop `rgba(26,31,22,.20)` + blur 4px. Input row 56px, 18px text, leading search icon. Results grouped (Lessons/Tools/Terms/Actions) with caption headers; rows 44px: icon 20 + title 15/550 + breadcrumb 13 `ink-500` + kbd hint. Selection: cobalt-100 pill, arrow keys wrap. Entrance 180ms scale .98→1 + fade; exit 120ms. Fuzzy matches highlight in marigold-200. Empty state: Lexi the Scanner holding an empty lens + "Nothing matches — try 'DFA'".

## 4. AI Tutor slide-over (global)

420px right sheet (100% width on mobile), full-height under nav, e3 with left hairline, entrance 280ms ease-out-quint slide + content 60ms-stagger. Header 56px: "Tutor" + context chip (e.g., `⚙ Lex Machine — 3 rules`, paper-2 pill 12px) + mode segmented control (Explain/Socratic) 28px + ✕. Messages: user = leaf-100 bubble right (radius 16/16/4/16), AI = plain paper with 3px cobalt left stripe; AI messages can embed real token chips/mini-diagrams (max-height 220px, "expand →" opens tool). Footer: 44px input + 32px circular send (leaf, hover 1.06). "Show me →" deep-link pill under relevant answers, cobalt-100. Typing indicator: three 6px ink dots doing a stack-plate wobble (600ms loop) — not generic bouncing dots (they wobble like Stax).

## 5. Footer (marketing + hub pages)

`paper-2`, top hairline, 96px padding-top, 1200px grid. Row 1: 4 link columns (caption headers, 14px links with underline-slide hover) + newsletter block 320px (input 44px + leaf button; success = button morphs to circle + checkmark draw + 6 paper-token confetti, 900ms once). Row 2 (**the heartbeat**): full-width 1px `line` with a 4px leaf dot traveling left→right in 12s linear infinite loop; passes "milestones" (7 tiny stage dots) which blink as it passes; pauses on hover with a tooltip "hi. keep going." Row 3: mono-ink logo 20px, © line 13px `ink-500`, locale switcher, social Inkline icons 20px (hover: −2px rise).

## 6. Shared interactive states (every component)

| State | Recipe |
|---|---|
| Hover (raisable) | translateY(−2px) + e1→e2, 150ms spring |
| Active/press | scale .985 + `press` inner shadow, 80ms |
| Focus-visible | ring (above), never removed |
| Disabled | 45% opacity + `cursor: not-allowed`, no hover |
| Loading (button) | label fades, 16px ink-draw spinner (the logo circle drawing at 900ms loop) |
| Error (input) | border coral, 4px shake ×2 (120ms), message slides down 8px w/ Bug icon 14px |
| Success (input) | border leaf, checkmark draws 200ms |
| Skeleton | paper-2 blocks, 1.6s shimmer sweep (paper-1 highlight), radius matches final content |
| Drag | ghost at 85% opacity + e3, drop targets show 2px dashed cobalt inset, valid target fills cobalt-100 |
| Tooltip | ink-900 bg, paper-0 text 13px, radius 8, 8px/12px padding, 350ms delay, 120ms fade+4px rise, arrow 6px |

## 7. Empty / error / offline pages

- **404:** big mono text `error: unexpected token '/' at line 404` typed by a terminal caret (35ms/char), Bug walks across below (6-frame loop), "parse me home →" leaf button. Background: 8% marginalia doodles.
- **500:** Stax collapsed into a plate pile, "We hit an internal conflict. Rebuilding the stack…" + auto-retry countdown ring.
- **Offline:** paper airplane version of the mark + cached-content list; visualizers that work offline get a leaf "works offline" chip.
