# PG-01 — The Editor

Monaco, fully re-chromed to Paper & Ink (Inkwell theme, DS-02 §4). This doc specifies the language intelligence and editing UX beyond `/design/05` §1.

## 1. Language services (custom, in `packages/workbench`)

### Lex/Flex (`.l`) — first-class citizen
- **Tokenizer/grammar:** custom Monarch + semantic tokens: section-aware (`definitions / %% rules / user code`), regex parts colored by construct (classes leaf, quantifiers marigold, anchors orchid), macro references cobalt, C action blocks delegated to C colorizer.
- **Diagnostics (live, engine-powered — before any build):** undefined macro · unreachable rule (shadowed by earlier longer/equal pattern — computed via engine DFA intersection, the killer diagnostic no editor has) · empty-match rule warning (`a*` can loop) · missing `%%` · unbalanced action braces · start-condition used but not declared.
- **Hovers:** macro → expansion + mini railroad (160px) · rule pattern → plain-English explainer (cached regex-explain) · `yytext/yyleng/yylineno/BEGIN` → doc cards with links to reference.
- **Navigation:** go-to-definition (macro, start condition), find-references (macro usages), outline (definitions / rules by start condition / functions).
- **Completions:** macro names inside `{}`, start conditions after `BEGIN(`, `%option` values, snippet library (`rule`, `state-block`, `count-lines`…).
- **Code actions:** "extract pattern to macro" · "reorder rule above conflicting rule" (with a why-note) · "add catch-all error rule" · "convert to case-insensitive class".
- **Inlay hints (toggle):** rule priority numbers in the gutter margin; per-rule DFA state contribution count after a build.

### Yacc/Bison (`.y`)
- Semantic coloring: nonterminals cobalt, terminals/token names marigold, `$$/$1…` value refs orchid with hover showing their symbol + declared `%type`.
- **Diagnostics:** undeclared token · unused nonterminal · left-recursion note (informational — good in LR!) · `%union` type mismatch on `$n` (the classic) · rule with no action producing a typed value · conflict count after engine pre-analysis (before running real Bison) with per-rule attribution.
- Hovers: production → FIRST/FOLLOW peek of its LHS · precedence declarations → resolution preview table.
- Navigation: token → its `%token` + its Lex rule **across files** (the `.l`↔`.y` link: go-to-definition on `NUMBER` in the grammar jumps to the Lex rule that returns it — powered by return-statement scanning).
- Code actions: "declare missing %token" · "add precedence to fix conflict" (offers the Conflict Cinema first) · "generate %type from usage".

### C (`.c/.h`)
Best-effort at MVP: Monarch highlighting, brace/include diagnostics from cc runs mapped back, hover docs for the yy-API surface (`yylex, yyparse, yyerror, yylval, yyin…`). Full clangd-WASM behind a Pro flag post-MVP.

### Cross-file project intelligence
A lightweight **project model** (workbench) parses all `.l/.y` on change: token-name symbol table across files, `%union`/`%token` consistency checks, Makefile target awareness. Diagnostics from the project model appear in Problems tagged `project`.

## 2. Editing UX

- **Tabs/splits:** per `/design/05`; up to 2×2 grid; drag tab to edge to split (drop-zone overlays at 40% accent tint).
- **Sticky sections:** in `.l/.y`, the current section header (`DEFINITIONS`, `RULES`) sticks under the breadcrumb while scrolling.
- **Locked regions** (lesson/project contexts): read-only ranges per FA/DS spec; attempting to type flashes the 🔒 gutter icon + "scaffold is locked — your code goes here" pointer to the editable region.
- **Multi-cursor, find/replace (regex mode uses our engine — matches highlight with the same visual language as Regex Lab), column select.**
- **Format:** `.l/.y` formatter (align actions at column, normalize section spacing); C via WASM clang-format subset. Format-on-save opt-in.
- **Keybindings:** VSCode-default map + Lexora additions (⌘⏎ build & run, ⌘⇧V open viewer of current artifact, F8 next problem). Vim/Emacs keymap options in settings.
- **Autosave:** 1s idle debounce to virtual FS; dirty dot is therefore about *unsynced-to-server*, not unsaved-to-disk (label tooltips explain).
- **Selection→action affordance:** selecting any regex-shaped string shows a subtle inline ✨ lightbulb: Explain / Open in Regex Lab / Test against sample input (popover with instant matches).

## 3. Editor ↔ panel wiring

- Cursor inside a Lex rule → Token Viewer soft-highlights tokens that rule produced in the last run (and vice versa: clicking a token chip reveals+flashes the producing rule line).
- Cursor inside a grammar production → Parser Visualizer highlights table rows/automaton states involving that production.
- Diagnostics gutter icons: build-sourced (Bug glyph) vs engine-live (lens glyph) — learners see which checks needed a build.
- Breadcrumb tail shows the artifact chain of the current file: `calc.l → lex.yy.c → scanner ✓` (chips, clickable to open each).

## 4. Generated-file etiquette

`lex.yy.c`, `y.tab.c/h` open read-only with a header banner "Generated by flex 2.6.4 — edits will be overwritten", user-authored action code inside highlighted marigold-100, and a gutter minimap linking regions to source rules (D04 §1). A "regenerate" affordance replaces stale generated files with a diff preview when sources changed.
