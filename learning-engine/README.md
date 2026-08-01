# Lexora — Interactive Learning Engine

The pedagogical runtime: how lessons execute, how visualizations become teachable scenarios, how assessment works, how the AI tutor thinks, and how mastery is measured. Companion to `/docs 05–09, 12`, `/design/03–04`, `/architecture`. Specification only — no code.

| # | Document | Covers |
|---|---|---|
| LE-01 | [`01-lesson-engine.md`](01-lesson-engine.md) | Lesson schema, runtime state machine, widget contracts, authoring pipeline |
| LE-02 | [`02-visualization-scenarios.md`](02-visualization-scenarios.md) | Scenario system: seeded traces, predict/sabotage/tour modes, task verification |
| LE-03 | [`03-quiz-assessment-engine.md`](03-quiz-assessment-engine.md) | Question type schemas, grading, banks, exam mode, integrity |
| LE-04 | [`04-ai-tutor-workflow.md`](04-ai-tutor-workflow.md) | Grounding context, response pipeline, Socratic mode, verification loop, hint personalization |
| LE-05 | [`05-progress-mastery.md`](05-progress-mastery.md) | Mastery math, decay & spaced review, XP ledger, analytics events |

## Engine-level invariants

1. **Concepts are the atomic unit.** Lessons, quiz items, scenarios, hints, and AI answers all tag `conceptIds` — one shared ontology drives mastery, review, recommendations, and tutoring.
2. **Every claim is demonstrable.** Any pedagogical statement (lesson, quiz feedback, AI answer) must be able to point at a scenario that shows it running.
3. **Assessment is evidence, not events.** Mastery updates from graded evidence records, never from raw clicks.
4. **The learner can always see why.** Grades, hints, and recommendations expose their reasoning (which evidence, which decay, which mistake pattern).
5. **Authoring is composition.** Authors assemble typed widgets and scenarios; they cannot introduce untyped interactivity.
