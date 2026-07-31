# 07 — Regex Lab (Regex Visualization)

Suite at `/tools/regex*`. One regex, four synchronized representations: **pattern**, **railroad diagram**, **NFA**, **DFA** — edit any, all update.

## 1. Regex Playground (`/tools/regex`)

- Pattern input (large, monospace) + flavor selector (POSIX/Lex flavor default, PCRE optional — Lex flavor is the pedagogical default, a deliberate differentiator from regex101).
- Test input area; matches highlighted live with alternating accent-100 stripes; group captures color-nested.
- **Explainer rail:** the pattern decomposed into an indented tree of plain-English lines ("`[0-9]+` — one or more digits"); hovering a line highlights that span in the pattern *and* its matches in the input (three-way sync, same interaction grammar as the Lex Machine).

## 2. Matching Animation

Press ▶: the engine consumes the test string character-by-character:
- **Character highlighting:** current char pulses; consumed span tints.
- **Backtracking, visualized honestly:** when the backtracking engine fails and retreats, the cursor *physically backs up* leaving a fading coral trail; a backtrack counter ticks. A toggle switches engine to **NFA-simulation (Thompson)** mode where instead of backtracking, a *set* of ghost cursors advance in parallel — teaching the two execution models by contrast. Catastrophic-backtracking demo patterns included (`(a+)+$`) with an animated explosion counter.

## 3. NFA View

Thompson construction shown **incrementally**: scrub through the regex left-to-right and watch fragments assemble (concatenation snaps boxes together; `|` builds the diamond; `*` draws the loop-back ε-edge in dashed ink). ε-edges dashed; during simulation the **active state set** glows (multiple states at once — the point of NFAs). Layout: automatic left-to-right with manual node dragging (positions saved in share state).

## 4. DFA View

- **Subset construction as animation:** each DFA state materializes as a bubble that visibly *contains* its NFA mini-states; ε-closures shown as a lasso animation gathering states. Step through construction row-by-row with the transition table filling in sync.
- **Minimization:** partition-refinement animated — states start in two big tinted groups (accepting/non), groups split with a cell-division animation until stable; merged result morphs smoothly from the original DFA.
- Simulation on the DFA: single pulsing state (contrast with NFA's set — shown side-by-side in the equivalence lesson).

## 5. Regex Builder

Drag-and-drop composition: palette of blocks (literal, class, `*`, `+`, `?`, group, alternation, anchors) snapped into a horizontal expression; the textual regex writes itself live below (bidirectional — editing text re-renders blocks). Aimed at absolute beginners; blocks use the same railroad visual language.

## 6. Regex AI (`/tools/regex/generator` + inline)

- **Explain:** any pattern → structured explanation (populates the Explainer rail, not just chat text).
- **Generate:** user provides *should-match / shouldn't-match* example lists → AI proposes a regex → the platform **verifies it against the examples in-browser** and shows the pass/fail wall before presenting it. Failed cases loop back to the AI automatically (max 3 rounds).
- **Optimizer:** suggests simplifications (`[0-9]`→`\d` per flavor, factoring alternations, removing redundant groups) with before/after DFA **state-count comparison** ("34 states → 12 states") — optimization made measurable.

## 7. Regex Challenges

Daily/weekly puzzles: "match all of these, none of those, shortest pattern wins." Live leaderboard by pattern length then DFA size. Golf mode is a deliberate virality feature (shareable result cards).

## 8. Cross-links

"Use in Lex →" sends the pattern into a new Lex Machine rule; "Learn: subset construction →" deep-links the lesson with this exact regex preloaded.
