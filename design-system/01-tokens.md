# DS-01 — Design Tokens

Three tiers: **primitives** (raw values) → **semantic** (meaning) → **component** (scoped). Product code may only consume semantic/component tiers. Naming: `lx-{category}-{name}-{variant}`; exported as CSS variables, Tailwind theme, and `tokens.json` (Style Dictionary format).

---

## 1. Color primitives

### Paper (surfaces)
| Token | Hex |
|---|---|
| `lx-color-paper-0` | `#FDFBF7` |
| `lx-color-paper-1` | `#F7F3EA` |
| `lx-color-paper-2` | `#EFE9DC` |
| `lx-color-white` | `#FFFFFF` |

### Ink (text/linework)
| Token | Hex | Contrast on paper-0 |
|---|---|---|
| `lx-color-ink-900` | `#1A1F16` | 15.9:1 |
| `lx-color-ink-700` | `#3D443B` | 9.8:1 |
| `lx-color-ink-500` | `#6B7267` | 5.1:1 |
| `lx-color-ink-300` | `#A8AEA2` | 2.5:1 (decorative/placeholder only) |
| `lx-color-line` | `#E3DDCE` | borders only |

### Accents — each with a 5-step ladder (`-700` text-safe, `-500` core, `-300` vivid fills, `-200` 16% tint, `-100` 8% tint)
| Family | 700 (text) | 500 (core) | 300 | 200 | 100 |
|---|---|---|---|---|---|
| `leaf` | `#1E7A50` | `#2F9E6E` | `#66C39A` | `#DDF0E6` | `#EEF8F2` |
| `marigold` | `#A66A08` | `#F5A623` | `#F8C468` | `#FCEBCB` | `#FDF5E5` |
| `coral` | `#C23A2E` | `#FF6B5E` | `#FF9C93` | `#FFE0DC` | `#FFF0EE` |
| `cobalt` | `#2A52B0` | `#3B6FE0` | `#7FA3F0` | `#D8E2FA` | `#EBF1FC` |
| `orchid` | `#8A3FA8` | `#B25FD1` | `#CD94E1` | `#EFDFF6` | `#F7EFFA` |
| `gold` (ceremonial) | `#8F7418` | `#C9A227` | — | — | — |

### Terminal scope (component-locked, never global)
`lx-color-term-bg #23281F` · `term-panel #2B3126` · `term-text #F2EFE4` · `term-dim rgba(242,239,228,.5)` · `term-green #5FCF97` · `term-red #FF8A7E` · `term-blue #7FA3F0` · `term-yellow #F8C468` · `term-cursor #F2EFE4`.

### Gradients
`lx-gradient-sunrise: linear-gradient(135deg,#FFF6E3 0%,#FDECEC 50%,#EDF3FF 100%)` · `lx-gradient-leaf-sheen: linear-gradient(180deg,#37B27D,#2F9E6E)` · `lx-gradient-gold-foil: linear-gradient(115deg,#C9A227,#E8CE6B 40%,#C9A227 60%)` (certificates only).

## 2. Semantic color tokens

| Token | Maps to | Use |
|---|---|---|
| `lx-bg-app` / `-subtle` / `-well` | paper-0 / paper-1 / paper-2 | page / sections / insets |
| `lx-bg-raised` | white | cards, panels, popovers |
| `lx-text-primary` / `-secondary` / `-tertiary` / `-placeholder` | ink-900/700/500/300 | |
| `lx-text-on-accent` | white | text on 500-level fills |
| `lx-border-default` / `-strong` | line / ink-300 | |
| `lx-action-primary` (+`-hover #37B27D`, `-active #288A5F`) | leaf | CTAs |
| `lx-status-success/warning/danger/info` | leaf/marigold/coral/cobalt | |
| `lx-focus-ring` | cobalt-500 @40% | universal |
| `lx-stage-source/lex/syntax/semantic/ir/opt/codegen/asm/exec` | ink/marigold/cobalt/orchid/orchid/leaf/cobalt/ink/leaf | pipeline stage coding |
| `lx-token-keyword/ident/number/string/operator/comment/error` | cobalt/leaf/marigold/leaf-700/orchid/ink-300/coral | token chips & syntax (chips use the family's -100 fill + -700 text) |

## 3. Dimension tokens

**Space:** `lx-space-1…12` = 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256.
**Radius:** `lx-radius-sm 6` · `-md 10` · `-lg 16` · `-xl 24` · `-full 9999`.
**Border width:** `hairline 1` · `emphasis 2` · `stripe 3`.
**Sizes:** control heights `lx-size-control-sm 32 / -md 40 / -lg 48 / -xl 52`; icon `16/20/24/28`; avatar `24/32/44/96`; hit-area min `44`.
**Layout:** `container 1200` · `prose 720` · `nav-h 64/56` · `panel-header 44` · `transport-h 56` · `statusbar-h 28` · `grid-gutter 24/16/8`.
**Breakpoints:** `xs <480 · sm 480 · md 768 · lg 1024 · xl 1440 · 2xl 1920`.
**Z-index:** `base 0 · strip 20 · nav 40 · dropdown 50 · sheet 60 · modal 70 · palette 80 · toast 90`.

## 4. Elevation tokens

| Token | Value |
|---|---|
| `lx-shadow-e1` | `0 1px 2px rgba(58,50,30,.06), 0 0 0 1px rgba(58,50,30,.03)` |
| `lx-shadow-e2` | `0 4px 12px rgba(58,50,30,.08), 0 1px 3px rgba(58,50,30,.06)` |
| `lx-shadow-e3` | `0 12px 32px rgba(58,50,30,.12), 0 4px 8px rgba(58,50,30,.06)` |
| `lx-shadow-device` | `0 16px 40px rgba(35,40,31,.14), 0 2px 6px rgba(35,40,31,.08)` |
| `lx-shadow-press` | `inset 0 1px 2px rgba(58,50,30,.10)` |
| `lx-shadow-paper-flat` | `4px 4px 0 #E3DDCE` (illustration/marginalia shadow) |
| `lx-glass` | `background rgba(253,251,247,.78); backdrop-filter blur(14px); border-bottom 1px lx-color-line` |

## 5. Typography tokens

Families: `lx-font-display "Cabinet Grotesk"` · `-body "Inter"` · `-mono "JetBrains Mono"` · `-math "STIX Two Math"`.
Styles (composite tokens — size/line/weight/tracking): `display-xl 61/64/750/−2.5%` · `display-lg 49/56/750/−2.5%` · `heading-lg 39/46/700/−2%` · `heading-md 31/38/700/−2%` · `heading-sm 25/32/650/−1%` · `title 20/28/600/−0.5%` · `body 16/26/400/0` · `body-sm 14/22/450/0` · `caption 12/16/550/+4%/uppercase` · `code 14/22/420(mono)` · `code-sm 13/20` · `kbd 12/16(mono)`.

## 6. Motion tokens

**Durations:** `lx-motion-micro-1 80 · -2 120 · -3 180` · `standard-1 200 · -2 250 · -3 350` · `scene-1 400 · -2 500 · -3 600` · `ceremony 900–1400`.
**Easings:** `out-quint cubic-bezier(.22,1,.36,1)` · `in-out-cubic cubic-bezier(.65,0,.35,1)` · `anticipate cubic-bezier(.36,0,.66,-.28)` · `linear`.
**Springs:** `ui {300,24,1}` · `pop {400,20,1}` · `settle {260,30,1}` (stiffness, damping, mass).
**Pedagogy clocks (@1×):** `char-eat 120ms/cell` · `rewind 80ms/cell` · `edge-flash 150` · `state-pulse 300` · `chip-flight 350` · `plate-fold 280` · `ink-draw 600px/s` · `type-in 20ms/char`. Global multiplier `0.25–4×` applies to this group only.

## 7. Token governance

Primitives frozen per minor version; adding a semantic token requires a documented use-case + contrast audit; component tokens live beside their component spec; `tokens.json` is the single source — Figma variables and CSS are generated, never hand-synced.
