# PG-02 — Terminal & Execution Pipeline

## 1. The execution pipeline (flex → bison → cc → run)

The Playground's core loop, fully instrumented:

```
source change / ⌘⏎ / `make` in terminal
  → BuildPlanner: Makefile? use it : infer chain from workspace files
      .l only            → flex x.l && cc lex.yy.c -lfl → scanner
      .l + .y            → bison -d x.y && flex x.l && cc lex.yy.c y.tab.c → parser
      .c only            → cc *.c → program
  → BuildRun (toolchain.worker, queued, cancellable):
      per step: emit BuildStep{cmd, args} → run WASM tool
        stdout/stderr → Compiler Output card (streaming)
        fd-3 JSON side-channel → InstrumentationStore
        exit≠0 → halt chain, map diagnostics → Problems + editor markers
  → on success: run stage (./program < input.txt if a default input is set)
        program stdout → Console; if scanner/parser instrumented → live token/parse trace
  → BuildReport{steps[], artifacts[], instrumentation refs} → journal (PG-04 §5)
```

- **Transparency rule:** inferred chains always disclose commands ("we ran: `bison -d calc.y && flex calc.l && cc …`") in a copyable toast + the Compiler Output cards — the terminal equivalent is one paste away.
- **Incremental:** BuildPlanner hashes inputs per step; unchanged steps replay cached artifacts instantly (cards show `cached ⚡`).
- **Default run input:** a workspace-level `input.txt` convention + a run-configuration popover (args, stdin source: file/console/inline text). Re-run last config: ⌘R.
- **Watch mode (toggle):** rebuild-on-save with a 800ms debounce; failures don't clear the last good artifact set (panels keep last-good with a stale scrim).

## 2. Instrumentation payloads (fd-3 protocol, consumed here)

| Tool | Payload → feeds |
|---|---|
| flex | DFA tables, rule→state map, per-rule patterns | Token Viewer rule attribution, Lex Machine "open in visualizer", unreachable-rule confirmation |
| bison | item sets, ACTION/GOTO, conflicts (state, items, symbols) | Parser Visualizer, Problems conflict rows, Conflict Cinema deep-links |
| runtime (instrumented scanner/parser builds) | token emission stream (type, lexeme, line:col, ruleId), parser action log (shift/reduce/goto/error with state stack snapshots) | Token Viewer live stream, Parser Visualizer replay, AST reconstruction |
| cc | phase timings, sizes | Performance card |

Runtime instrumentation is compiled in only for playground builds (a `-DLEXORA_TRACE` shim library); `make RELEASE=1` produces clean binaries — teaching that instrumentation is a build choice.

## 3. Terminal specifics (beyond /design/05 §2)

- **Shell features:** pipes, redirects, `&&`/`||`/`;`, globs, `$VAR` + `export`, history (per workspace, 500), tab-completion (paths, commands, make targets), `ctrl+c` aborts the active WASM run (worker terminate + respawn), `ctrl+l` clear.
- **Command set:** doc-11 list + `time`, `xxd` (educational hex view of binaries), `wc`, `sort`, `uniq`, `tee`. `man <cmd>` opens the Docs panel to that page (bridge, not a pager).
- **`lexora` meta-commands:** `tokens` (chip strip from last run) · `tree` (opens AST viewer) · `conflicts` (lists + links) · `share` · `explain <file:line>` (AI) · `snapshot` (journal checkpoint).
- **Exit-code affordance:** non-zero exits print a subtle `↳ exit 1` line with the ✨ explain affordance directly on it.
- **Multiple terminals:** tabbed (max 4), each its own shell state, same FS; a busy terminal shows a spinner dot in its tab.
- **Task detection:** long-running `./program` waiting on stdin shows a "waiting for input" hint chip after 2s (the classic beginner confusion).

## 4. Error panel (Problems) — full spec

Aggregates four sources, tagged: `engine` (live analysis), `flex`/`bison`/`cc` (build), `project` (cross-file), `runtime` (crash/exit info).

- **Row anatomy (36px):** severity glyph (coral error / marigold warning / cobalt info) · message (13px, primary clause bold) · source tag chip · `file:line:col` · quick-action chips.
- **Quick actions per class:** conflict → "Visualize" (Cinema) · unreachable rule → "Show shadowing rule" (editor reveal both + connecting line overlay) · `%union` mismatch → "Fix types ✨" (AI fixer, PG-04) · undefined reference `yylex` → "Explain link order ✨".
- **Grouping:** by file, collapsible; sort by severity/line; filter chips per source tag.
- **Error translation layer:** raw toolchain messages are preserved (expandable "raw output") but the displayed message is rewritten by a deterministic catalog (~120 patterns) into learner language: `y.tab.c:113: undefined reference to 'yylex'` → "The parser can't find a scanner. Link `lex.yy.c` too, or provide `yylex()`." Catalog misses fall through to raw + ✨.
- **Problems ↔ everything:** click → editor jump + marker flash; hover → 240px peek of the source region; badge count in activity bar; new-problems delta after each build announced to `aria-live` ("2 errors fixed, 1 new").

## 5. Performance & limits

Build steps time-boxed (flex/bison 10s, cc 30s WASM; beyond → tier-2 VM offer). Binary size cap 16MB. Program runs: 10s CPU / 64MB unless VM tier. Infinite-output guard: >10k lines/s throttles with "output flooding — program still running" banner + kill button (teaches the runaway-ECHO loop gracefully).
