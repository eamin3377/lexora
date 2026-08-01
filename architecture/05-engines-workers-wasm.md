# FA-05 — Engines, Workers & WASM Integration

## 1. Engine layer (`packages/engines/*`)

Pure TypeScript, deterministic, DOM-free:

| Engine | Responsibilities | Trace outputs |
|---|---|---|
| `regex-engine` | parse (Lex-flavor + PCRE subset), Thompson NFA, subset construction, minimization, both execution models (backtracking + NFA-sim) | construction traces, match traces (incl. backtrack steps), state-count metrics |
| `automata` | generic FA model, layout (dagre + manual overrides), equivalence, ops | layout graphs, simulation traces |
| `grammar` | CFG model, FIRST/FOLLOW (with reasons), LL(1) table, LR(0)/SLR/LALR/CLR item sets & tables, conflict analysis, ambiguity heuristics, transforms | set-derivation traces, automaton-construction traces, parse traces (shift/reduce with tree building), conflict "two futures" trace pairs |
| `edu-compiler` | subset-C lexer/parser/types/TAC/passes/RISC-V codegen + interpreter, provenance threading through every phase | per-stage traces + cross-stage ProvenanceGraph |

Every public operation: `(input, options) → { result, trace }`. Property-based tests (fast-check) assert result correctness; golden-trace snapshots assert pedagogy stability (a trace change is a reviewable diff — animations are tested artifacts).

## 2. Worker topology

```
Main thread: React, players, rendering
├─ engine.worker (pool of 2)      # regex/automata/grammar/edu-compiler runs
├─ toolchain.worker               # WASM flex/bison/gcc executions (one at a time, queued)
├─ fs.worker                      # OPFS access (sync handles live off-main anyway)
└─ prefetch.worker                # WASM warm-fetch, trace precompute for lesson autoplays
```
- Protocol: Comlink-style RPC with transferables; traces move as ArrayBuffers (MessagePack) — no structured-clone of huge object graphs.
- Cancellation: every request carries an id; superseded requests (typing fast) are aborted engine-side (engines are chunked/yielding to honor aborts within 16ms).
- Timeouts & guards: engine runs cap at 2s CPU (configurable per tool) — catastrophic regex demos run in a sacrificial worker with a step budget instead of wall-clock death.
- Fallback: no-Worker environments (old Safari embeds) run engines on main thread with reduced input limits.

## 3. WASM toolchain (`packages/wasm-toolchain`)

- **Artifacts:** `flex.wasm`, `bison.wasm`, `cc.wasm` (clang-based), `coreutils.wasm` — built via wasi-sdk in Docker, content-hashed, served from CDN, loaded with `WebAssembly.compileStreaming`, cached in CacheStorage keyed by hash.
- **Loader API:** `getTool('flex') → Promise<ToolInstance>`; instances pooled and reused; cold-load surfaces DS skeleton status lines ("warming up flex… 2.1MB").
- **WASI shim:** stdin/stdout/stderr piped to terminal/console panels; filesystem = the virtual FS (below); exit codes surfaced to build runner.
- **Instrumentation protocol:** platform builds emit a JSON side-channel (fd 3): flex → DFA tables + rule map; bison → item sets + conflict details; cc → phase timings. `workbench` translates side-channel payloads into the same Trace model — **terminal runs and visualizers share one data path** (the doc-11 "two views of one execution" promise, concretely: fd-3 JSON → trace adapter → players).
- **Version pinning:** toolchain versions displayed in the status bar come from the artifact manifest; lesson content declares required toolchain range.

## 4. Virtual filesystem

OPFS-backed (`fs.worker`), POSIX-ish API (`open/read/write/stat/readdir`), mounted per workspace at `/home/learner/<workspace>`. Memory-FS fallback (iOS/private mode) with a "not persisted" warning chip. Quotas: 50MB free / 1GB Pro, enforced at write. Snapshots: zip export, server snapshot on share. Watchers: FS events → workspaceStore (dirty markers) + Problems refresh.

## 5. Build runner (`workbench/build-runner`)

Make-subset interpreter + auto-detect chain (`.l → flex → cc`, `.l+.y → flex+bison+cc`); each step: announce command (transparency toast/log) → run in `toolchain.worker` → collect exit/diagnostics/side-channel → structured BuildReport (feeds Compiler Output cards, Problems panel, Token Viewer). Diagnostics mapped to editor markers via file/line from tool output parsers.

## 6. Terminal integration (`packages/terminal`)

Shell (parser for pipes/redirects/`&&`/`;`) → command registry: builtin JS commands (`ls`, `cat`, …) against virtual FS + WASM commands via the same toolchain loader + `lexora` meta-commands (render DS components into xterm via a custom renderer layer). nano = JS implementation over FS; vim-sim = keymap state machine over the same buffer. Tier-2 escalation: registry marks commands `requiresVM`; consent prompt → WebSocket PTY to microVM (out of frontend scope beyond the socket protocol).

## 7. AI integration surface (`packages/ai`)

Client calls a single gateway route (`/api/ai/:feature`) with `{ featureId, context, input }`; context assembled pull-based (FA-04 §6). Streaming responses render structured blocks (registry-limited components, like MDX). **Verification loop is client-visible state:** generate → run verification (in engine/toolchain workers, locally!) → present pass/fail wall — the AI package orchestrates this loop so generated regex/lex/bison artifacts are verified in the learner's own browser before display. Quota state cached in Query (`['ai-quota']`), enforced server-side.

## 8. Performance contracts (frontend-critical)

Trace precompute: lesson autoplay traces prefetched by `prefetch.worker` when a lesson enters viewport range. Frame render budget: a full three-panel Lex frame ≤ 4ms scripting on baseline hardware (test-asserted). Memory: traces capped (~10k frames); longer executions switch to windowed traces (keyframe + regenerate segment on demand — the one permitted recompute path). WASM total cold path ≤ 4s on 4G with progress honesty; warm path instant via CacheStorage.
