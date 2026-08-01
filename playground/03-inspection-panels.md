# PG-03 — Inspection Panels

All panels render **instrumentation from real runs** (PG-02 §2) through the same trace/provenance model as the standalone tools (FA-03) — the Playground panels *are* the visualizer components, docked. Each panel: freshness chip (`run #12 · 2m ago`), stale scrim when sources changed since, "open as full tool →" (carries state into `/tools/*`).

## 1. Token Viewer

- **Stream view (default):** token chips in emission order, wrapping rail; **live mode** during a run — chips pop in as the instrumented scanner emits them (throttled to 30 chips/frame render batches for huge inputs). Chip hover: three-way sync (editor rule line + source span in the run input + table row).
- **Table view:** columns #, type, lexeme, line:col, rule#, state-cond; virtualized (100k rows fine); column filters (type multi-select as chips); search by lexeme; CSV export.
- **Rule attribution lens:** group-by-rule mode — chips cluster under their producing rule headers with per-rule counts + a mini hit-histogram (the doc-06 performance view, docked).
- **Diff mode:** compare token streams of last two runs (after a spec edit): aligned lanes, changed tokens flash amber, insertions/deletions leaf/coral — "what did my rule change?" answered in one glance.
- **Input inspector strip:** the run's input text across the top with consumed-span tinting; clicking any character scrolls stream+table to the token that consumed it.

## 2. AST Viewer

Reconstructed from the parser action log (reduce events + grammar) — works for *any* user grammar without user code changes; if the user builds a real AST in actions (project templates provide a `lexora_ast.h` helper), the richer user AST is rendered instead (source toggle: `derived | yours`).

- **TreeView component** (DS-03): pan/zoom, minimap, collapse subtrees, parse-tree ↔ AST morph toggle (derived mode), export SVG/PNG.
- **Node inspector (click):** production that created it, source span (editor + input both highlight), child list, `$$` value if user AST provides it.
- **Search:** by nonterminal/token name; matches halo; ⏎ cycles.
- **Replay scrubber:** a slim TransportBar replays tree construction in reduce order (each reduce = fold recipe) — the shift-reduce hero animation, on the learner's own grammar and input.
- **Large-tree policy:** >2k nodes → collapsed-by-depth(3) + Canvas renderer; node badges show hidden-descendant counts.

## 3. Parser Visualizer (docked Parser Theater)

Tabs: **Automaton** (item-set graph from bison payload; current-run path optionally overlaid as a glowing trail) · **Table** (ACTION/GOTO with run heat-map — cells tint by visit frequency; conflict cells per D04) · **Replay** (stack/tape/tree triptych scrubbing the actual parser action log of the last run — including the exact point of syntax errors: the error action cell flashes, recovery visualized honestly) · **Conflicts** (list → Cinema modals).

- **Grammar overlay:** hovering any production in the editor highlights its states/cells here (PG-01 §3 wiring).
- **What-if strip:** edit input text inline in the Replay tab and re-run the parse against the *already-built* tables instantly (no rebuild — tables are loaded in the engine) — rapid "does my grammar handle this?" probing.

## 4. Regex Helper (companion panel)

Selection-driven (PG-01 §2): explains the selected pattern (explainer tree), test box with live matches, "open in Regex Lab", and — inside `.l` files — a **rule-context check**: warns if the selected pattern overlaps an earlier rule (engine intersection) with a two-chip demo input showing which rule would win.

## 5. Performance panel

Per run: build-step timing bars, scanner throughput (chars/s), rewind/backtrack count with offending-rule links, parser action counts (shift/reduce ratio), binary size trend sparkline across runs. Advice chips are deterministic heuristics (not AI): "rule 4 causes 96% of rewinds — consider anchoring".

## 6. Panel orchestration

- Freshness: all panels subscribe to `InstrumentationStore` runs; a new successful run pings updated tabs (icon pop + count), never force-switches the user's active tab.
- Layout presets swap visible panels (Lexing = Tokens+Regex Helper; Parsing = Parser+AST; Full = Tokens+AST+Problems).
- Every panel state (active tab, filters, scrub position) persists per workspace.
- A11y: every panel exposes its table/outline alternative (D16 §3); replay scrubbers emit narration lines.
