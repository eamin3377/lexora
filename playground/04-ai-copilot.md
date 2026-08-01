# PG-04 — The AI Copilot: Fixer, Debugger, and the Playground Agent

Three escalating capability tiers, one trust model: **the AI can do anything the user can do in the workspace — visibly, reviewably, undoably** (invariant 3). Built on the tutor pipeline (LE-04): same context assembly, policy gate, and local-verification core.

## 1. Tier 1 — Inline Fixer (single-shot, targeted)

Entry points: Problems quick-action ✨ · editor lightbulb on diagnostics · terminal stderr ✨ · "Fix" block in Debugger output.

Flow: diagnostic + minimal context → fix proposal → **shadow verification** (LE-04 §5: patch applied to a shadow FS copy, rebuilt in the worker; original error must disappear; new errors disclosed) → rendered as a Monaco diff peek (inline, red/green, 320px max) with `Apply · Apply & re-run · Dismiss`. Applied fixes are journaled (§5) and undoable as one unit (⌘Z reverts the whole patch). Never auto-applies. Fix classes covered by curated prompts: `%union` mismatches, missing `%token`, link-order/`yylex` issues, unreachable Lex rules, C syntax slips, Makefile targets.

## 2. Tier 2 — AI Debugger (diagnostic reasoning over a failing run)

Entry: "Debug this ✨" on any failed build/run, or `/ai/debugger` with workspace attached.

Pipeline additions over LE-04: the debugger receives the **full BuildReport + instrumentation** (token stream, parser action log, exit info) — it reasons over *what actually happened*, not just source text. Output = DiagnosisCard (D06 §8): What / Why (may embed the exact replay frame — e.g., the parser action log step where the error action fired, rendered as a clickable scenario clip) / The fix (Tier-1 verified diff) / Watch it / Root concept.

Interactive follow-ups keep the thread grounded to this run; "re-run and re-check" button closes the loop (run → did the diagnosis hold? → the card annotates itself ✓/✗ — the AI's accountability UI).

## 3. Tier 3 — The Playground Agent ("do anything")

A tool-using agent with the workspace as its environment. Invoked from the AI panel (`Agent` tab) with a natural-language goal: *"add floating-point support to my calculator"*, *"write tests for my scanner"*, *"refactor this grammar to remove the conflict"*, *"scaffold a JSON parser from scratch"*.

### 3.1 Agent tool surface (everything the user can do)

```
fs.read/write/create/delete/rename      terminal.exec(cmd)          build.run(config)
editor.openDiff(patch)                  panels.query(tokens|ast|parser|problems)
engines.verify(verifierSpec)            scenario.create(clip)       journal.checkpoint(label)
web: none. network: none. scope: this workspace only.
```
`panels.query` is the differentiator: the agent can *inspect the same instrumentation the user sees* ("query the token stream", "check conflict count") — it debugs with evidence, not guesses.

### 3.2 Execution & consent model

- **Plan first:** agent posts a step plan (checklist card). Runs in `Ask` mode by default: each mutating step (fs.write, terminal.exec) pauses for approval (chip: `Allow · Allow all this run · Skip`). `Auto` mode (user-armed per run, with a hold-to-confirm) executes freely but **journals every step**.
- **Live activity feed:** each step renders as a card in the agent thread: tool, input, result summary (build cards embed the mini-pipeline; file writes embed collapsed diffs). The workspace visibly reacts (files appear in Explorer with a pop, terminal shows the commands) — the agent works *in the open*, on the same stage.
- **Guardrails:** step budget (default 25/run), time budget (3 min), no destructive ops without explicit per-op consent even in Auto (`fs.delete`, `rm`), locked regions honored (lesson scaffolds are agent-read-only too), graded contexts: agent disabled entirely (policy gate).
- **Self-verification loop:** the agent must end with a verification step (build green + its own stated success criteria via `engines.verify` / test runs). A run that can't verify reports honestly: "built clean, but I couldn't test X because…".

### 3.3 Checkpoints & undo (nothing is lost)

`journal.checkpoint` snapshots the FS (copy-on-write in OPFS) before the run and after each mutating step. The agent thread header shows a **timeline of checkpoints**; one click restores any point ("restore to before agent run" is always the first entry). Checkpoints double as the user's own snapshot feature (`lexora snapshot` in terminal).

### 3.4 Pedagogy mode (the Lexora twist)

A persistent toggle on the Agent tab: **`Do it` vs `Teach me`**. In Teach-me mode the agent executes the same plan but narrates each step with concept links, pauses at decision points with predict-style questions ("I'm about to add a precedence declaration — which conflict will it resolve?"), and ends with a generated summary card + 2 review-queue items tagged to the concepts it touched. Classroom deployments can force Teach-me. This is how "AI can do anything" coexists with a learning platform instead of undermining it.

## 4. Cross-tier shared UX

One AI panel, three tabs (Chat/Debug/Agent) sharing thread history; context tray always visible (LE-04 §1 transparency); quotas: Fixer generous (cheap), Debugger standard, Agent runs metered (Pro: 20/day). All AI-authored changes carry a gutter annotation (tiny ✨, hover: "AI edit — run #7, step 4, view in journal") — provenance for code, matching provenance for artifacts.

## 5. The Journal (audit substrate)

Append-only per-workspace log: builds (BuildReports), AI fixes (patches + verification results), agent runs (plan, steps, checkpoints), user snapshots. UI: a drawer timeline with filter chips; every entry re-openable (view diff, restore checkpoint, re-run command). Retention: 30 days free / full history Pro. The journal is also the classroom submission record — instructors see the honest history, another Edu differentiator.
