# 08 — Parser Theater (Parsing Visualization)

Suite at `/tools/parser`, `/tools/grammar`, `/tools/ast`, `/tools/bison`. The hardest topic in the course, treated with the most cinematic care.

## 1. Grammar Builder (`/tools/grammar`)

- Structured CFG editor: productions as rows (`E → E + T | T`), nonterminals cobalt, terminals as token chips; syntax-checked live.
- **Grammar Autopsy panel:** one click analyzes any grammar — left recursion (with the offending cycle drawn), ambiguity heuristics (shows *two different parse trees for the same sentence* side by side when found — the definition, visualized), useless/unreachable symbols, and a **compatibility report**: badges for LL(1) / SLR / LALR / CLR with pass/fail and the exact conflict that breaks each.
- Transform assistants: animated left-recursion elimination and left-factoring (old production morphs into the new pair, step-by-step).

## 2. FIRST / FOLLOW

Interactive derivation, not a dumped table: pick a nonterminal → the algorithm animates through productions, tossing terminal chips into the FIRST set bag with a reason line per addition ("`T → ( E )` starts with `(` → add `(`"). FOLLOW propagation shown as arrows flowing between productions. **Practice mode:** the learner fills the sets by dragging chips; wrong drags bounce out with the violated rule explained.

## 3. LL(1) Parser View

Three synced zones: **prediction table** (rows nonterminals, cols terminals) · **stack** (vertical plate tower) · **input tape**. Per step: the table cell being consulted flashes cobalt → the stack top pops with a plate-lift animation → production RHS plates drop on in reverse (staggered 60ms) → matched terminals fly from stack to tape cell and dissolve. Table cells with conflicts are coral with a tooltip proving why the grammar isn't LL(1).

## 4. LR Family (LR(0) · SLR · LALR · CLR)

### Automaton construction
The item-set (canonical collection) built state-by-state: kernel items appear, **closure** animates (items fade in with the reason production highlighted), GOTO edges ink-draw to new states. Each state card lists its items; scrubber walks construction history. Family selector morphs the *same* grammar's automaton between SLR/LALR/CLR — LALR state-merging shown as CLR states physically merging with lookahead sets union-animating (the fabled "why LALR has fewer states," finally visible).

### Parse table
ACTION/GOTO table generated live from the automaton; hovering a cell highlights the automaton state and items that produced it. **Conflict Cinema:** a shift/reduce conflict cell opens a split-screen — left timeline plays the *shift* future, right plays the *reduce* future, both on the same input, diverging trees growing until one (or both) fails. Precedence/associativity declarations resolve the cell with a stamp animation ("resolved: shift, because `*` > `+`").

### Shift-reduce execution
The signature animation. Stack (state/symbol plates) · input tape · growing **parse forest**:
- **Shift:** input chip slides onto the stack, new state plate stamps on top.
- **Reduce:** the handle's plates glow, lift *together*, and fold into a new nonterminal node — simultaneously, in the tree pane, those symbols' subtrees connect under the new parent (ink-draw branches). GOTO consult flashes in the table.
- **Accept:** the completed tree does a root-to-leaves shimmer.

## 5. Parse Tree & AST (`/tools/ast`)

Side-by-side parse tree vs AST with a morph toggle: intermediate nodes (E→T→F chains) visibly collapse away to form the AST — teaching the difference in one animation. AST nodes expandable to show attributes (type, value). Pan/zoom canvas, minimap for large trees, export SVG/PNG.

## 6. Error Recovery

Feed invalid input: the parser hits the error cell (coral flash), then the selected strategy animates — **panic mode** discards tape chips one-by-one (they fall off the tape) until a synchronizing token; **error productions** (Bison `error` token) show the error plate absorbing the mess. Recovery counter and resulting partial tree shown honestly.

## 7. Bison Builder (`/tools/bison`)

Grammar + actions in real Bison syntax → runs actual Bison (WASM) → renders: generated table stats, conflict report (each conflict deep-links into Conflict Cinema for that state), the generated `y.tab.c` with the user's actions highlighted, and a runnable parser wired to a Lex Machine spec (the two tools dock together — `yylex()` handshake animated as chips passing through a hatch between panels).

## 8. Step Execution & Transport

Same transport bar as the Lex Machine (play/pause/step/back/scrub/speed). Every step logs a sentence ("Reduce by E → E + T; goto state 9") — the accessibility stream and exam-revision transcript. Predict mode pauses before each action for "shift or reduce?" quizzes inline.
