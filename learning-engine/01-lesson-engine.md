# LE-01 — Lesson Engine

## 1. Content model (CMS schema)

```
Curriculum
└─ Track (A–E)                { id, slug, title, stage: PipelineStage, order }
   └─ Module                  { id, prereqModuleIds[], badgeId, checkpointQuizId }
      └─ Lesson               { id, slug, title, estMinutes, conceptIds[],
                                 toolchainRange?, body: MDX, version, status }
Concept ontology (~180 nodes)  { id, name, glossaryTermId, parentId?, edges: requires[] }
```
- **Concept ontology is the spine:** ~180 concepts (e.g., `regex.kleene-star`, `lex.maximal-munch`, `lr.lookahead`, `ir.three-address`) arranged in a prerequisite DAG. Everything tags into it (LE invariant 1).
- Lessons declare `conceptIds` they *teach* and inherit `requires` from the ontology — the roadmap's soft prerequisite graph is computed, not hand-maintained.
- Versioning: published lessons are immutable snapshots; learner progress pins the version it was earned on; migrations only forward.

## 2. MDX widget registry (author-facing contract)

Only registered, typed components compile (FA-03 §4). Core widgets:

| Widget | Props (essence) | Emits evidence? |
|---|---|---|
| `<Anim scenario="…" autoplay speed poster />` | scenario id (LE-02) | no (exposure logged) |
| `<TryIt scenario tasks=[TaskSpec] hints=[HintSpec] />` | seeded tool + verifiable tasks | ✅ `check` |
| `<CodeLab template tests=[TestSpec] locked=[Range] explainLayers />` | workspace seed + acceptance tests | ✅ `lab` |
| `<Check type=… />` | inline quiz item (LE-03 types) | ✅ `check` |
| `<Callout kind=insight|watchout|deepdive|tryit>` | prose | no |
| `<Term id>` | glossary link w/ live popover | no |
| `<Compare left right>` | side-by-side scenarios | no |
| `<Summary skills=[conceptId]>` | closing checklist + next teaser | no |

Authors write: hook → prose → `<Anim>` → `<TryIt>` → prose → `<Check>`×n → `<CodeLab>` → `<Summary>`. Linter enforces rhythm rules: ≤3 min prose between interactions, ≥1 `<Anim>` + ≥2 evidence-emitting widgets per lesson, every taught conceptId covered by ≥1 evidence widget.

## 3. Lesson runtime (client state machine)

Per-lesson session store (FA-04 factory):
```
states: loading → reading ⇄ interacting(widgetId) → completing → complete
context: { scrollAnchor, widgetStates{}, evidenceQueue[], hintUsage{}, startedAt }
```
- **Widget lifecycle:** `mounted → engaged (first interaction) → attempted(n) → passed | abandoned`. Transitions emit analytics events (LE-05 §6); `passed` enqueues an EvidenceRecord.
- **Evidence queue:** offline-tolerant — records buffer in IndexedDB, flush via server action with idempotency keys; UI optimism per FA-04.
- **Resume:** `scrollAnchor` (nearest block id) + serialized widget states autosave (3s debounce). Reopening restores exact position ("Continue: 62% through").
- **Completion rule:** lesson `complete` when all evidence widgets `passed` *or* explicitly skipped (skips recorded — mastery treats skip as absent evidence, not failure). Summary block unlocks on complete; next-lesson auto-advance only if bottom reached naturally (D03).

## 4. Explain layers (the lesson↔tool bridge)

`<TryIt>`/`<CodeLab>` accept `explainLayers`: named annotation overlays (`regex`, `lexer-decision`, `parser-action`) that toggle provenance-driven annotations inside the embedded visualizer (doc 05 §2). Layers are data: `{ trigger: artifactSelector, content: template(conceptId, frameContext) }` — templated micro-explanations resolved against the current frame, so the same layer works for any input the learner types. AI "explain deeper" on any layer hands the resolved context to the tutor (LE-04).

## 5. Authoring pipeline

```
Author (MDX in CMS) → schema validation → rhythm lint → scenario resolution
→ preview build (real components, draft traces) → pedagogy review checklist
→ publish (immutable version) → ISR tag revalidate → prefetch-worker warms traces
```
- **Pedagogy review checklist (human gate):** hook lands in ≤15s read · every animation answers a stated misconception · predict-moments placed before, not after, the reveal · hint ladder authored (no auto-generated rung 1–2 in published lessons) · a11y narration reviewed.
- **Misconception library:** per module, authors register mistake patterns `{ id, detector: (widgetState)→bool, response: { calloutMDX, scenarioId? } }` — the ~50/track curated detectors (doc 05 §3). Detectors run client-side on failed attempts; matched responses render the coral callout + optional "watch the failure" scenario.
- **Content tests (CI):** every scenario referenced exists and type-checks against its tool schema · all `TestSpec`s pass against the reference solution · reading level scan · broken-link check · trace-duration budget (autoplay ≤ 45s at 1×).
