# LE-03 — Quiz & Assessment Engine

## 1. Item model

```
QuizItem {
  id, type, conceptIds[], difficulty: 1–5, bloom: recall|apply|analyze
  stem: MDX, scenarioRef?          # items may embed scenarios
  spec: TypeSpec                   # per-type payload (below)
  feedback: { correctMDX, perDistractor{}, misconceptionIds[] }
  telemetry: { pValue, discrimination, avgTime }   # computed from responses
  status: draft|reviewed|live|retired, authorKind: human|ai-assisted
}
```

## 2. Item types (TypeSpec per type)

| Type | Interaction | Grading |
|---|---|---|
| `mcq` / `multi` | options, shuffle, ≤5 | exact / partial credit (multi: +1 correct, −½ wrong, floor 0) |
| `predict` | paused scenario + options bound to next delta | exact; wrong answers auto-map to misconceptions |
| `manipulate-automaton` | drag states/edges to complete an FA on AutomataCanvas | verifier: language-equivalence check against target (engine), not shape-matching — any correct machine passes |
| `pick-cell` | click the ACTION/GOTO or LL cell the parser uses next | exact cell |
| `select-lexeme` | click the span the scanner accepts | span match |
| `fill-regex` | pattern input + live match feedback against hidden case list | all cases pass; DFA-equivalence tolerance (any equivalent regex accepted) |
| `order-steps` | drag algorithm steps into sequence | exact or authored partial orders |
| `derive-set` | drag terminal chips into FIRST/FOLLOW bags | set equality; per-chip feedback with violated-rule reasons |
| `trace-output` | given code, type program/token output | normalized string compare (whitespace-lenient) |
| `code-fix` | small editor, one bug to fix | acceptance tests in worker |

**Grading principle:** wherever the domain permits, grade by *semantic equivalence via engines* (language equality, test passage), never by literal answer matching — the engines make honest grading cheap, and it's a differentiator no quiz platform has.

## 3. Assembly & delivery

- **Inline `<Check>`:** fixed items authored in place; instant feedback; unlimited retries; first-try flag recorded.
- **Checkpoint quiz:** assembled per attempt from the module bank by blueprint `{ conceptCoverage: all taught, difficultyCurve: [2,2,3,3,4], bloomMix }`; 80% pass → badge; retakes rotate items (never repeat an item the learner saw in last 2 attempts).
- **Exam mode (certificates):** timed, no hints, Socratic-locked AI, sequential commit (no back-navigation), proctoring-lite signals (focus-loss count, paste events — reported, not auto-punished), item pool human-reviewed only.
- **Adaptive difficulty (post-MVP flag):** next-item selection by mastery estimate ±1 difficulty band; blueprint constraints always win over adaptivity.
- **Practice generation:** AI-parameterized variants from templates (doc 12) enter the bank as `draft`, auto-verified (engine-solvable, unique answer), usable immediately in self-practice, promoted to `live` only after human review + healthy telemetry.

## 4. Evidence & scoring output

Every graded interaction emits:
```
EvidenceRecord {
  learnerId, itemId?, scenarioId?, conceptIds[]
  kind: check|quiz|exam|lab|project-test|review|challenge
  score: 0–1, firstTry: bool, hintsUsed: rung, latencyMs, attempt, ts
  context: { lessonVersion, seedParams }
}
```
Weights and mastery math in LE-05. Feedback UX per D03 (wrong answers embed the exact frame that disproves them — `feedback.perDistractor` may reference a scenario clip).

## 5. Item quality loop

Telemetry recomputed nightly: p-value (target 0.4–0.85 by difficulty band), discrimination (point-biserial ≥ 0.2), distractor analysis (each distractor chosen ≥5% or flagged dead). Flags queue items into the author review board. Misconception mapping validated: if a distractor's mapped misconception doesn't correlate with the detector's other evidence, the mapping is flagged.

## 6. Integrity

Seed parameterization (LE-02 §4) varies surface details per learner. Exam pools disjoint from practice pools. Challenge windows: solutions embargoed until close; similarity checks (token-stream fingerprints of submitted code — our own lexer, eating our dogfood) on classroom assignments and leaderboard submissions. All integrity signals go to humans (instructor/admin dashboards); the platform never auto-accuses.
