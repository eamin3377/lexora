# 06 — The Lex Machine (Lex/Flex Visualization)

The flagship tool at `/tools/lex`. Students **watch Lex work** on their own spec and input. Layout: three synced columns — **Spec** (left), **The Machine** (center), **Output** (right) — plus a transport bar (⏮ ⏪ step-back · ▶/⏸ · step ⏩ · speed 0.25–4× · timeline scrubber) fixed at the bottom. Every panel highlights in sync: one source of truth, one clock.

## 1. Spec Panel (left)

A structured Lex editor with three collapsible bands mirroring real Lex file anatomy:

- **Definitions** (`DIGIT [0-9]` …): each macro is a chip; hovering shows its expansion; using a macro in a rule draws a temporary ink line back to its definition.
- **Rules** (`{DIGIT}+  { return NUMBER; }`): each rule row shows: pattern (regex-highlighted) · action (C, collapsed by default) · priority number (its order) · a live **hit counter** that increments as the simulation runs · a tiny thumbnail of its DFA.
- **User code / Actions:** collapsible C section.
- **Start conditions (states):** `%s`/`%x` states render as tabs above the rules; rules are filtered by active state; the currently active start condition glows marigold during simulation.

## 2. The Machine (center) — animated stages

### 2.1 Input tape & character scanning
The input string rendered as a paper tape of character cells. Animations:
- **Cursor movement:** a marigold caret slides cell-by-cell (character-eat); consumed cells tint; `yytext` region shown as a bracket that grows under the tape.
- **Input buffer view (toggle):** shows Flex's double-buffer with `yy_c_buf_p` pointer — advanced learners see buffering reality.

### 2.2 Combined DFA view
The union DFA built from all rules (each accepting state color-tagged by owning rule). Animations:
- **State changes:** active state pulses per character; traversed edge ink-flashes.
- **Longest match (maximal munch):** when the DFA passes an accepting state but keeps going, a ghost bookmark 📍 drops on the tape ("last accepting position"). If the machine later dies, the cursor **rewinds visibly** to the bookmark — the single most misunderstood Lex behavior, made unmissable.
- **Rule priority:** if two rules accept the same lexeme, both rules flash; the earlier one wins with a small "priority ①" ribbon; the loser dims with the reason ("same length — earlier rule wins").

### 2.3 Token emission
On accept: lexeme lifts off the tape, morphs into a **token chip** (pop animation), flies to the Output column; the matching rule's row flashes and its action code briefly expands showing `return NUMBER;` executing (with `yytext`/`yyleng` values inline).

**Rejected input:** no rule matches → the character shakes, tints coral, the default ECHO rule (or error) is dramatized with a "fell through every rule" cascade down the rule list.

## 3. Output Panel (right) — tabs

- **Token stream:** chips in order; hover a chip ↔ its tape span and rule both highlight (three-way sync). Below: **token table** (type, lexeme, line:col, rule#) exportable CSV.
- **Generated C code:** the *actual* `lex.yy.c` produced by real Flex (WASM). Sections folded; the student's action code highlighted inside the generated scaffold — demystifies "where does my code go?". A "map" gutter links `yy_accept`/tables back to visual DFA states.
- **Performance:** after a run — table sizes, states count, characters/sec, rewind count ("your rules caused 14 backtracks — try anchoring rule 3"), per-rule hit histogram (BarChart).
- **Console:** raw stdout/stderr of the scanner run.

## 4. Debug Mode (step-by-step execution)

Toggling **Debug** switches the transport to single-instruction stepping and opens an inspector strip: current state #, `yytext`, `yyleng`, `yylineno`, active start condition, last-accepting state/position. Each step appends a human-readable log line ("`3` → state 7 (accepting for NUMBER); continuing for longest match") — this log is the screen-reader stream and is downloadable as a study transcript. Breakpoints: click a rule to break whenever it fires.

## 5. Learning-mode overlays

In lessons the same component mounts with scenario overlays: *Predict mode* (animation pauses before a decisive step: "Which rule wins?" — learner clicks a rule, then truth plays out) and *Sabotage labs* ("reorder these rules so `if` stops lexing as IDENT").

## 6. Micro-detail polish

Tape cells have paper texture; the Scanner mascot's lens is the cursor in beginner lessons (plain caret in pro mode); successful full-input scan ends with the token stream doing a 200ms settle wave; everything scrubbable — dragging the timeline runs the whole three-panel sync backwards smoothly (state history is recorded, not recomputed).
