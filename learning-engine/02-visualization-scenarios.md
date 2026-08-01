# LE-02 — Visualization Scenario System

A **Scenario** is a versioned, seeded, teachable configuration of a visualizer — the unit that lessons, quizzes, hints, AI answers, and glossary popovers all reference. It is how "every claim is demonstrable" is implemented.

## 1. Scenario schema

```
Scenario {
  id, toolId, schemaVersion
  seed: ToolState                  # spec/grammar/regex/program + input (state-codec payload)
  mode: 'watch' | 'explore' | 'predict' | 'task' | 'sabotage' | 'tour' | 'compare'
  camera?: { focusArtifacts[], collapsedPanels[] }   # what to emphasize
  clip?: { fromEvent, toEvent }    # sub-range of the trace (for hint snippets, popovers)
  script?: ScriptStep[]            # predict/tour choreography
  tasks?: TaskSpec[]               # for task/sabotage
  conceptIds[]
}
```
Scenarios resolve to traces at build/prefetch time (golden-trace snapshots in CI); the learner's own edits fork the seed into live state — every scenario is escapable into free exploration ("open full tool →" keeps the fork).

## 2. Modes

- **watch:** autoplay once at 0.75×, then transport unlocks. Used by `<Anim>`, glossary popovers (clipped), AI "Watch it" links.
- **explore:** no autoplay, affordance hints on (scrub doodle arrow).
- **predict:** `script` pauses the player at decisive events and poses a question bound to the *next* delta:
  ```
  ScriptStep { pauseAtEvent, prompt, options: PredictOption[], reveal: 'play-truth' }
  PredictOption { label, artifactRef?, isCorrect, whyMDX }
  ```
  Learner answers → their choice ghost-overlays → truth plays → why-card. Wrong predictions emit evidence (weight lower than quiz items) and register mistake patterns.
- **task:** `TaskSpec { goal: MDX, verifier, maxHintRung }` — verifiers are declarative assertions over final state or trace, e.g. `acceptsInput("abba")`, `tokenStreamEquals([...])`, `noConflicts()`, `stateCount ≤ 12`, `usedRule(3)`. Verifiers run in the engine worker on every attempt (600ms debounce); pass triggers the D03 success choreography + evidence.
- **sabotage:** seeded with a deliberate flaw + tasks to fix it ("make `if` stop lexing as IDENT"). Identical machinery, inverted seed.
- **tour:** narrated autoplay with caption track `{ event, captionMDX }`, letterboxed (D04 §4). Captions are the aria-live stream.
- **compare:** two seeds, locked shared clock (Conflict Cinema, -O0 vs -O2). Divergence event marked automatically (first differing delta).

## 3. Compiler visualization coverage map (scenario library targets)

| Stage | Canonical scenarios (minimum library) |
|---|---|
| Regex/automata | star-vs-plus, alternation, ε-closure walk, subset construction (3 sizes), minimization split, backtracking vs Thompson, catastrophic `(a+)+$` |
| Lex | maximal munch rewind, rule priority tie, start conditions, `if` vs IDENT sabotage, ECHO fallthrough, buffer view |
| Grammar/parsing | ambiguity twin-trees, left-recursion elimination, FIRST/FOLLOW derivations, LL(1) conflict proof, LR(0)→SLR→LALR→CLR morphs, shift/reduce cinema (dangling else!), panic vs error-production recovery |
| Semantics | scope shadowing, type mismatch flood, symbol-table build |
| IR/opt | TAC unroll, const-fold fuse, DCE crumble, CSE lasso, LICM lift, pass-order experiment |
| Codegen | register allocation + spill, TAC→RISC-V provenance chain |
| Full pipeline | expression tour (the 90s), one-line-edit ripple (compare), error propagation |

Each ships with: default seed, 2 alternates (small/gnarly), narration text, conceptIds, misconception hooks.

## 4. Seeding & personalization

Scenario seeds accept **parameter slots** (`{{identifier}}`, `{{number}}`) filled deterministically from the learner id — cosmetic variation (names/values differ per learner, structure identical) that makes copied answers visible in classrooms without changing difficulty. Personalized failure replays (LE-04 hints) construct ad-hoc scenarios: `{ seed: learnerAttempt, clip: aroundFailureEvent, mode: watch }`.

## 5. Verification & QA

Golden traces per scenario version (FA-05 §1); trace diffs are review artifacts. A scenario release requires: verifier soundness tests (reference solution passes, 3 curated near-misses fail), narration review, duration budget, reduced-motion walkthrough. Scenario analytics: completion %, median attempts, hint-rung distribution — surfaced to authors; scenarios with >40% rung-3 usage get flagged for redesign (the content improves from evidence, same as the learners).
