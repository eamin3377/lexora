# Lexora — Compiler Playground Specification

Deep engineering + UX spec for the Playground: the VSCode-class workspace where learners write real Flex/Bison/C, execute it in-browser, inspect every artifact, and work alongside an AI copilot with full (permissioned) control of the workspace. Extends `/design/05`, `/architecture/FA-05`. Specification only — no code.

| # | Document | Covers |
|---|---|---|
| PG-01 | [`01-editor.md`](01-editor.md) | Monaco integration, Lex/Yacc/C language services, editing UX |
| PG-02 | [`02-terminal-execution.md`](02-terminal-execution.md) | Terminal, shell, the flex→bison→cc execution pipeline, build system |
| PG-03 | [`03-inspection-panels.md`](03-inspection-panels.md) | Token Viewer, AST Viewer, Parser Visualizer, Error/Problems panel — all live-wired to real runs |
| PG-04 | [`04-ai-copilot.md`](04-ai-copilot.md) | AI Fixer, AI Debugger, and the Playground Agent (tool-using, can do anything — with consent) |

## Playground invariants

1. **Real toolchain, real artifacts.** Everything inspectable comes from actual flex/bison/cc runs (fd-3 instrumentation), never simulations.
2. **Two views, one execution.** Terminal commands and visual panels are projections of the same instrumented run.
3. **The AI can do anything the user can — and nothing silently.** Every agent action is a visible, reviewable, undoable operation.
4. **Teach the toolchain, don't hide it.** Auto-magic always discloses the real commands it ran.
5. **Nothing is lost.** Files autosave; every AI edit and build is journaled; undo works across agent actions.
