# 05 — Interactive Learning Experience

## 1. Lesson Anatomy (every lesson follows this rhythm)

A lesson is a vertical narrative alternating **prose → animation → interaction**, never more than ~3 minutes of reading before the learner must *do* something.

```
┌ Lesson header ────────────────────────────────────────────┐
│ Track badge · title · est. time · Living Pipeline strip   │
│ ("You are here: Lexical Analysis" — stage glows)          │
├ 1. Hook ──────────────────────────────────────────────────┤
│ One provocative example or broken program (15s read)      │
├ 2. Theory blocks (720px prose) ───────────────────────────┤
│ Short sections with callouts (Insight/Watch out/Deep dive)│
├ 3. Concept Animation (full-bleed breakout) ───────────────┤
│ Scrubbable, step-controlled visualization of the idea     │
├ 4. Try-It Widget ─────────────────────────────────────────┤
│ Embedded live tool, pre-seeded, with a micro-task         │
├ 5. Code Lab ──────────────────────────────────────────────┤
│ Editor + Run + output panes (below)                       │
├ 6. Checks ────────────────────────────────────────────────┤
│ 2–4 inline quiz questions with instant animated feedback  │
├ 7. Practice / Mini-project / Challenge cards ─────────────┤
├ 8. Summary ("What you can now do") + next-lesson teaser ──┤
└───────────────────────────────────────────────────────────┘
Right rail: outline · AI Tutor · glossary peek · notes
```

## 2. The Code Lab (embedded workbench)

Every code-bearing lesson embeds a slim version of the Playground:

- **Editor** (Monaco, Inkwell theme) preloaded with lesson scaffold; read-only regions lock boilerplate so students edit only what matters.
- **Run ▸ button:** runs the real toolchain (flex/bison/gcc via WASM). While compiling, a mini pipeline lights up stage-by-stage as actual phases complete.
- **Output tabs:** *Program output* · *Terminal* (raw toolchain log) · *Tokens* (chip stream, synced hover with source) · *Tree* (parse tree/AST when applicable) · *Generated code* (e.g., `lex.yy.c` with the student's rules highlighted inside).
- **Explain layers:** toggles that annotate output — *Regex explanation* (hover any pattern → plain-English breakdown), *Lexer explanation* (why this rule won: longest match / priority), *Parser explanation* (why this action: table cell highlighted).

## 3. Feedback, Mistakes & Hints

- **Mistake detection:** static checks + expected-output diffing recognize ~50 curated misconception patterns per track (e.g., regex `*` vs `+` confusion, missing `%%`, left recursion in LL grammar). Detected mistakes trigger a coral callout that *shows* the failure in the visualizer, not just text.
- **Hint ladder (3 rungs):** 1) nudge ("Look at what happens after the 3rd character") → 2) concept link (replays the relevant animation snippet) → 3) partial solution with the key line blurred until clicked. Using hints costs a little XP, never blocks progress.
- **AI explanation:** "Explain my error" button sends code + toolchain error + visualizer state to the AI Tutor, which responds with a diagnosis *plus* a deep-link that re-creates the failure in the appropriate visualizer.

## 4. Quizzes

Types: multiple choice with animated answer reveals · "predict the output" (then the animation runs and confirms) · **interactive-manipulation questions** (drag DFA states to complete a machine; click the parse-table cell the parser will use; select the lexeme the scanner accepts) · fill-in-the-regex with live match feedback. Checkpoint quiz per module (80% to earn the module badge, unlimited retakes with question-bank rotation). Exam mode (timed, no hints) for certificate eligibility.

## 5. Mini-projects & Challenges

- **Mini-project (per module):** 20–40 min guided build with acceptance tests run in-browser (e.g., after Lex module: "a scanner for INI files"). Green test wall fills up as tests pass — token-pop per passing test.
- **Challenge (per module):** un-guided, spec-only, ranked by solve count; feeds the leaderboard.

## 6. Progress Tracking

- **Mastery model:** each lesson contributes to concept-level mastery (0–100) computed from checks, quiz, project tests, and review performance; decays slowly to power the **spaced review queue** (`/learn/review` — 5-minute daily mixed reviews, streak-friendly).
- **Progress surfaces:** dashboard pipeline heatmap (each compiler stage tinted by mastery), track rings, lesson checkmarks on the roadmap trail, resume card ("Continue: LR(0) items, 12 min left").
- **Everything resumable:** lesson scroll position, editor contents, and visualizer states autosave per user.

## 7. Lesson Content Pipeline (authoring)

Lessons authored in MDX with typed custom components (`<Anim id="subset-construction" />`, `<TryIt tool="lex" seed="…" task="…" />`, `<Check type="predict" … />`). Stored in CMS (see admin), versioned, previewable. This makes every lesson a composition of the same battle-tested interactive components used in standalone tools — one codebase, no drift.
