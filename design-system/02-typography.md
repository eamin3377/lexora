# DS-02 — Typography

## 1. Faces & loading

| Role | Face | Axes/weights shipped | Fallback stack |
|---|---|---|---|
| Display | **Cabinet Grotesk Variable** | wght 500–800 | `"Cabinet Grotesk", "Inter", system-ui, sans-serif` |
| Body/UI | **Inter Variable** | wght 400–700, opsz auto | `"Inter", system-ui, -apple-system, sans-serif` |
| Code | **JetBrains Mono** | 420, 550; ligature feature toggle | `"JetBrains Mono", ui-monospace, "Cascadia Mono", monospace` |
| Math | **STIX Two Math** | 400 | `"STIX Two Math", "Cambria Math", serif` |

Subsetting: Latin-ext at launch; Bangla (`Noto Sans Bengali` paired, tuned to Inter's x-height) in l10n phase. `font-display: swap`; display face preloaded on marketing routes only; metrics-adjusted fallbacks (`ascent-override`) to keep CLS at 0.

## 2. Style catalog (canonical usage)

| Style token | Where it may appear |
|---|---|
| `display-xl` 61/64 | Home hero only (one per site) |
| `display-lg` 49/56 | Marketing section heroes, certificate name |
| `heading-lg` 39/46 | Page H1s |
| `heading-md` 31/38 | Lesson titles, modal heroes |
| `heading-sm` 25/32 | Section H3, dashboard greeting, testimonial quotes |
| `title` 20/28 | Card titles, tool names, FAQ questions |
| `body` 16/26 | All reading prose (max 65ch) |
| `body-sm` 14/22 | UI copy, table cells, metadata |
| `caption` 12/16 caps +4% | Labels, overlines, panel headers, badge text |
| `code` 14/22 | Editor, code blocks, chips ≥28px |
| `code-sm` 13/20 | Generated-code panes, dense logs, admin |
| `kbd` 12/16 | Keyboard hints in 20px keycap chips (paper-2, hairline, radius 6, `lx-shadow-press` bottom) |

Mobile ramp shifts one step down for display/heading styles (values in D01). Line-length law: prose 45–65ch; UI copy never wraps beyond 2 lines without truncation + tooltip.

## 3. Rules of use

- **Weight before size:** differentiate within a level by weight (600↔450), change size only across levels.
- **Display face is precious:** Cabinet Grotesk only for `heading-sm` and above + wordmark + level names. Never in body, buttons, or tables.
- Numerals: `font-variant-numeric: tabular-nums` in tables, stats, counters, timers; proportional elsewhere.
- Tracking: negative tracking scales with size (locked in tokens); never manually track body text.
- Emphasis in prose: 600 weight, not italics (Inter italics reserved for comments-style asides); links = cobalt-700 + 1.5px underline, offset 3px.
- One marker-underline per viewport (brand gesture, D00 §3).

## 4. Code typography

- Ligatures **on** in Playground editor, **off** everywhere pedagogical (learners must read `->`, `>=` as real character sequences) — enforced by context prop, not author choice.
- Inkwell syntax palette (maps to `lx-token-*`): keywords cobalt-700 550wt · idents ink-900 · numbers marigold-700 · strings leaf-700 · operators orchid-700 · comments ink-300 italic · errors coral wavy-underline · active-line paper-1 wash · selection cobalt-200 · matching-bracket 1.5px cobalt outline.
- Inline code in prose: `code-sm` on paper-2 chip, radius 6, 2px/6px padding, ink-900.
- Line numbers: `code-sm`, ink-300, right-aligned in 56px gutter; highlighted-line gutter numbers go ink-700.

## 5. Formal notation

FIRST/FOLLOW sets, 5-tuples, derivations use `lx-font-math`: e.g. `FIRST(E) = { (, id }` — set braces math-face, terminals inside rendered as micro token chips (18px) when interactive, plain mono when static. Grammar productions: nonterminals math-italic cobalt, `→` U+2192 (never `->`), alternation `|` with 8px side margins. ε always U+03B5, never "epsilon".

## 6. Voice-critical microcopy patterns

Buttons: verb-first, ≤3 words ("Start learning free", "Run", "Watch it"). Errors: what + why + next ("No rule matches `@` — add a catch-all rule or handle it explicitly"). Empty states: one warm line + one action, cast member optional. Numbers humanized above 10k (`220K`), exact below.
