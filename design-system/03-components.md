# DS-03 — Component Library

Every component: **Anatomy · Sizes · Variants · States · Keyboard/ARIA · Tokens consumed.** States follow the universal recipes in `/design/01` §6 unless overridden. Organized in five tiers.

---

## Tier 1 — Primitives

### Button
- **Anatomy:** container · optional leading icon 20px · label · optional trailing icon/kbd hint.
- **Sizes:** sm 32 (13px label, 12px pad-x) · md 40 (14px, 16px) · lg 48 (15px, 24px) · xl 52 (17px, 28px — marketing CTAs only).
- **Variants:** *Primary* (leaf-sheen fill, white label, radius-md; hover: `-hover` fill + e2 + scale 1.015 + sheen sweep on xl only; active: `-active` + press shadow) · *Secondary* (raised bg, hairline, ink-900 label; hover: paper-1 + lift) · *Ghost* (transparent, ink-700; hover: underline-slide in context accent) · *Destructive* (coral-500 fill) · *Icon-button* (square, all sizes, tooltip mandatory).
- **States:** loading (label→logo-draw spinner 16px, width locked), disabled 45%.
- **Keyboard/ARIA:** native `<button>`; loading sets `aria-busy`; icon-button requires `aria-label`.
- Hold-to-confirm variant (exam start, destructive bulk): 600ms press fills a ring around the button; release early cancels.

### Input / Textarea
Anatomy: field (raised bg, hairline, radius-sm, 40/48px) · floating label (moves 16→−8px, 150ms, caption style) · helper/error row 20px below · optional leading icon / trailing action. Focus: border "draws around" perimeter in cobalt 200ms (SVG stroke overlay). Error: coral border + ×2 4px shake + Bug icon 14px + message slide-down. `aria-describedby` wires helper/error. Textarea: min 3 rows, drag-resize handle with dot-grid glyph.

### Select / Combobox
Trigger = Input anatomy + chevron (rotates 180°, 200ms). Menu: raised, e2, radius-md, 4px pad; options 36px with 8px-radius hover pill; selected = leaf check draws 150ms. Type-ahead + arrow nav (`aria-activedescendant`), groups get caption headers. Multi-select renders chips inside trigger (overflow "+3").

### Checkbox / Radio / Switch
Checkbox 20px radius-6: check **ink-draws** 150ms on select; indeterminate = 8px dash. Radio 20px: inner dot springs in (`pop`); *the selected radio ring doubles* — accepting-state double-ring as selection language (brand detail). Switch 36×20: thumb 16px slides 150ms `ui`, track tints leaf; drag-capable. All: 44px hit area, native inputs visually hidden.

### Slider
Track 6px paper-2, fill accent, thumb 20px white + hairline + e1 (hover 1.1×, grab cursor). Value tooltip pins above thumb while dragging. Steps render 2px ticks. Keyboard: arrows ±step, PgUp ×10. Speed-slider variant (transport) shows `0.25×…4×` detents with magnetic snap.

### Badge / Tag / Chip
Badge (status): 20px pill, caption 11px, accent-100/-700. Tag (filter): 28px, removable ✕ 14px, hover ✕ tints coral. Count badge: 16px min circle, coral fill white text.

### TokenChip ★ (signature atom)
28px pill (24px `sm`, 36px `lg`), `code` face, category fill `lx-token-*-100` + `-700` text + 1px category-300 border. Anatomy: optional category prefix (`ID:` caption, toggleable) + lexeme. Behaviors: **pop entrance** (`pop` spring + radial flash), hover→tooltip (type · lexeme · line:col, 350ms) + sync-highlight broadcast, focusable (`tabindex`, Enter = pin tooltip), draggable in exercise contexts. Error variant: coral dashed border + shake entrance. This exact component renders in lessons, tools, terminal (`lexora tokens`), AI chat, and marketing — zero visual drift allowed.

### KBD
Keycap chip per DS-02; combos joined by 4px `+`; auto-swaps ⌘/Ctrl per platform.

### Avatar
Sizes 24/32/44/96, ink 1.5px ring 2px offset; fallback = initials on deterministic accent-100; streak-active users get a 2px leaf ring segment (arc = week progress).

### Tooltip / Popover
Tooltip per D01 §6 (info only, never interactive). Popover: raised e2 radius-lg, 16px pad, 8px arrow, focus-trapped if interactive, Esc closes, `aria-expanded` on trigger.

### Spinner / ProgressBar / ProgressRing / Skeleton
Spinner = logomark circle ink-drawing at 900ms loop (16/24/48). Bar: 6px, radius-full, accent fill, indeterminate = 30% segment sweeping 1.2s; buffered variant for WASM loads. Ring: 2.5px stroke, draws clockwise from 12 o'clock (quiz score rings 64px animate 1s `out-quint`). Skeleton: paper-2 shapes + 1.6s shimmer; always mirrors final layout (no generic bars).

---

## Tier 2 — Containers

### Card
24px pad (16 compact), radius-lg, raised, e1. Options: 3px stage stripe (left) · media band (radius-lg top only) · footer row (hairline top). Hover (only if whole card is a link): −2px + e2. Never nest cards.

### Panel (tool docks)
Header 44px (caption title + count chip + actions + collapse chevron) · body · optional footer. Raised, radius-12, e1, floats on paper with 8px gutters ("floating dock"). Collapse: body height→0 250ms, header stays.

### Tabs
*Pill tabs* (panels): 28px pills in paper-1 track, active = raised + hairline; slider element glides between (150ms `ui`). *Underline tabs* (pages): 40px, 2px accent underline slides. Overflow: scroll + edge fades. Arrow-key nav, `role=tablist`, ping animation for fresh-data tabs (icon pop + count chip).

### Accordion
Row 64px, chevron 180° 200ms, height auto-animate 220ms; open row = 3px leaf stripe; single- and multi-open modes. `aria-expanded`, arrow/home/end nav.

### Modal / Dialog
Widths 440 (confirm) / 640 (form) / 1040 (Conflict Cinema); radius-xl, e3; backdrop ink-900 @20% + blur 4; enter 180ms scale .98→1. Header 64px, sticky footer actions right-aligned (primary rightmost). Focus trap, Esc, `aria-modal`; destructive confirms require typed name or hold-to-confirm.

### Sheet (slide-over)
Right 420px (AI Tutor), bottom (mobile rail, snap 30/70%). 280ms `out-quint`; grabber bar 32×4px radius-full on bottom sheets; drag-to-dismiss with velocity threshold.

### Toast
320px card e3, top-right stack (max 3, older compress 0.95/0.9); auto-dismiss 5s with a 2px progress hairline draining; hover pauses; variants Status colors; action link optional; `role=status`.

### Banner / Callout
Full-width 44px (task banners) or inline callout cards (Insight/Watch-out/Deep-dive/Try-it per D03). Dismissible ones remember dismissal.

### Table / DataGrid
Rows 40px (dense 32 admin), header caption-style sticky, row hover paper-1, sortable headers (arrow draws in 120ms), tabular numerals, column resize via hairline drag. Selection column = checkboxes + bulk bar slides up from bottom. Empty state slot (cast optional).

### Splitter
6px hit / 1px visual hairline; hover tints cobalt full-height; drag shows 1px guide + panel sizes tooltip; double-click resets; keyboard: focus + arrows ±8px (`role=separator`, `aria-valuenow`).

---

## Tier 3 — Navigation & input surfaces

**TopNav, MegaMenu, CommandPalette, Footer** — per `/design/01` §2–5 (owned by the system, single implementation).
**Breadcrumbs:** 13px, `/` separators ink-300, current ink-900; collapse middle to `…` popover >4 items.
**Pagination:** 32px number pills; active = ink-900 fill white text; `…` gaps.
**SegmentedControl:** 28px, raised active segment glides (LL/LR selectors, Explain/Socratic).
**Stepper (wizard):** dots + connecting hairline; done = leaf fill + check draw; current = double ring.
**FilterBar:** Tag chips + "clear all" ghost; applied count badge on the filter icon.
**SearchField:** Input + `/` kbd hint; results per CommandPalette rows.

---

## Tier 4 — Code & pedagogy components (the moat)

### CodeBlock
paper-2, radius-lg, hairline; header row 36px optional (filename chip + language badge + copy button — copy morphs to check 200ms). Line highlight: marigold-100 full-bleed rows; diff mode: leaf-100/coral-100 gutters with +/− signs; annotations: numbered ink circles in gutter → margin notes (720px prose contexts) or popovers (tools). Executable variant: Run ▸ pill top-right, output area slides open below (250ms) with its own mini status chip.

### Editor (Monaco wrapper)
Inkwell theme locked; context props: `ligatures`, `lockedRegions` (paper-2 + 🔒 gutter), `editableEdge` (2px marigold left edge), section watermarks for `.l/.y`. Diagnostics per DS-02. All editor chrome (breadcrumbs, tab strip) from this system, not Monaco defaults.

### TerminalFrame
The device: paper bezel 12px radius-top-lg + 3 ink dots + title + tier chip; interior terminal-scope tokens; cursor 8×18 @1.06s; ✨ gutter affordance; mission banner slot; full-screen morph 350ms. Everything per `/design/05` §2.

### TransportBar ★
56px; anatomy per `/design/04` §0: jump-start · step-back · play/pause 44px (path-morph 150ms) · step · jump-end · timeline (6px track, accent fill, event ticks 2px with frame-preview popovers 160px) · speed cycler (number-roll) · debug toggle. Keyboard contract: space/←→/shift+←→/[/]. Emits `aria-live` step announcements. One implementation for every visualizer — non-negotiable.

### StepLog
32px collapsed (latest line types in 20ms/char) / 200px expanded transcript; lines clickable (timeline jump); export button; doubles as `aria-live=polite` stream.

### AutomataCanvas
Nodes 44px (double-ring accepting, dashed rejected-style for dead states), edges 2px auto-routed bezier + 11px label pills, ε dashed 4-2. Interactions: drag nodes (8px grid snap), pan/zoom (0.4–2×), arrow-key state traversal (focus ring on states, transitions announced), minimap ≥12 nodes. Animations: ink-draw edges, state pulse 300ms, active-set halos, lasso. Canvas renderer swap >300 nodes (visual parity required).

### TreeView (parse tree/AST)
Nodes: 32px rounded-rect (nonterminals cobalt-100) / TokenChips as leaves; branches 2px ink with draw-in; collapse triangles; morph mode (parse↔AST FLIP); pan/zoom/minimap/export per AutomataCanvas.

### StackView
Plates 120×32 (symbol) + 16px state plates; push = slide+stamp, pop = lift+fade, reduce = plate-fold recipe; overflow compresses lower plates (perspective squash) with count chip.

### TapeView
Cells 36×44, cursor caret + glow, consumed tint, `yytext` elastic bracket, bookmark pin, rewind streak — all per `/design/04` §1.

### GrammarEditor / ProductionRow / SetBag / ParseTable / RegisterStrip / PipelinePuck / ConveyorRail
Specified in `/design/04`; each ships as an independent Storybook-covered component with the same prop-driven trace-rendering contract (components render *frames*, never compute).

### QuizCard family
MCQ, predict (embedded paused visualizer), drag-complete (drop targets per drag spec), fill-regex (live match feedback). Correct/wrong choreography per `/design/03` §Lesson. All variants share result API (`aria-live` verdicts).

### HintLadder
3 stacked cards, blur-scribble mask on rung 3, XP cost chips, "reveals remaining" counter.

### XPCounter / StreakFlame / BadgeCard / CertificateCard / Leaderboard Row
Per `/design/06–07`: count-up 600ms, flame tiers, badge flip + shimmer, gold-foil tilt, FLIP rank insertion.

---

## Tier 5 — Composed surfaces

LessonHeader, LivingPipelineStrip (liquid-fill pucks), ToolWorkbench (header + docks + transport), CodeLab, TryItWidget (task banner + XP arc), MilestoneRail, TestWall (green wave), DiagnosisCard, ContextTray, ResumeCard, HeatmapCalendar — assembly specs live in `/design/03–07`; they compose only Tier 1–4 parts and introduce **no new primitive styles**.

---

## Component QA gates (every component, before merge)

Storybook story per variant×state · keyboard walkthrough recorded · axe-core clean · visual regression snapshot · reduced-motion story · RTL smoke (layout doesn't break) · tokens-only lint (no raw values) · bundle cost noted if >8KB.
