# 10 — The Playground (VSCode-style Workspace)

`/playground` — a full workspace for free-form compiler hacking, and the engine behind all project work. Familiar VSCode ergonomics, re-skinned in Paper & Ink (light chrome, warm shadows, pill tabs — recognizably *not* stock VSCode).

## 1. Layout

```
┌ Activity bar ┬ Side panel ───────┬ Editor group ────────────┬ Right dock ─────────┐
│ 📁 Explorer  │ File tree         │ Tabs: main.l · calc.y ·  │ Tabs:               │
│ 🔎 Search    │ (workspace files) │       main.c             │ · AI Assistant      │
│ 🧪 Problems  │                   │ Monaco, Inkwell theme,   │ · Token Viewer      │
│ 🤖 AI        │                   │ split support            │ · Parse Tree / AST  │
│ 📖 Docs      │                   │                          │ · Regex Helper      │
│ ⚙ Settings  │                   │                          │ · Documentation     │
├──────────────┴───────────────────┴──────────────────────────┴─────────────────────┤
│ Bottom dock (tabs): Terminal · Console · Compiler Output · Problems               │
├────────────────────────────────────────────────────────────────────────────────────┤
│ Status bar: branch/workspace name · toolchain versions · Ln/Col · ▶ Build & Run   │
└────────────────────────────────────────────────────────────────────────────────────┘
```

All panels resizable/collapsible/drag-dockable; layouts saved per user; presets: *Lexing*, *Parsing*, *Full compiler*, *Zen*.

## 2. Panels in detail

- **Explorer:** virtual filesystem (OPFS-backed) per workspace; templates on new-file (`.l`, `.y`, `Makefile`, `.c`); right-click context menu; drag-drop upload; export workspace as zip.
- **Editor:** Monaco with custom language services for Lex and Yacc/Bison (syntax highlighting, section folding at `%%`, macro hover-expansion, go-to-definition from rule to macro, diagnostics squiggles from the real toolchain mapped back to source lines). C support via clangd-flavored basics (WASM) — best-effort, not full LSP at MVP.
- **Problems:** aggregated diagnostics from flex/bison/gcc runs, click-to-jump; Bison conflicts appear here with a "visualize this conflict →" action that opens Conflict Cinema pre-loaded (the workspace and the visualizers are one system).
- **Compiler Output:** structured build log — each toolchain invocation is a collapsible card (command, duration, exit code) with the mini-pipeline progress animation during builds.
- **Token Viewer / Parse Tree / AST:** the same visualizer components from docs 06–08, attached live to the last run — running `./scanner < input.txt` in the terminal populates the Token Viewer automatically (via instrumented toolchain hooks).
- **Regex Helper:** select any regex in the editor → this panel explains it and offers "open in Regex Lab".
- **AI Assistant:** chat grounded in the open file, selection, and last build errors; inline actions (fix, explain, generate rule) apply as reviewable diffs, never silent edits.
- **Documentation:** searchable offline reference (Flex/Bison manuals condensed, platform guides) so learners never leave the workspace.
- **Console vs Terminal:** Console = program stdin/stdout with a friendly input box; Terminal = the real shell (doc 11).

## 3. Build system

`Build & Run` executes the workspace `Makefile` if present, else auto-detects (`.l`+`.y` → flex→bison→gcc link chain) with the inferred commands shown transparently ("we ran: `flex calc.l && bison -d calc.y && gcc …`") — teaching the toolchain, not hiding it.

## 4. Sharing & collaboration

Share button → snapshot URL (read-only fork-on-edit). Classroom mode: instructor's workspace streams read-only to students with a "follow" cursor. Real-time co-editing is post-MVP (CRDT groundwork in data model from day one).
