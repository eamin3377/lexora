# LE-04 — AI Tutor Workflow

The tutor is a **pipeline with policies**, not a raw chat. Every request flows: *context assembly → policy gate → retrieval → generation → verification → rendering*.

## 1. Context assembly (pull-based, FA-04 §6)

On each turn, the client snapshots:
```
TutorContext {
  surface: { route, toolId?, lessonId?, widgetId? }
  toolState?: compressed ?s= payload + current frameIndex
  lastError?: { source: flex|bison|cc|engine, raw, mappedDiagnostic }
  learner: { level band, mastery of surface conceptIds, recent misconceptionIds,
             hintRungsUsedHere, locale, register pref (eli5|standard|exam) }
  conversation: last 12 turns (server-side thread)
}
```
Radical transparency: the context tray (D06 §7) renders exactly this object; learners can toggle items off. Nothing else is sent.

## 2. Policy gate (deterministic, before any model call)

| Condition | Policy |
|---|---|
| Exam / graded assignment active | **Socratic-only** mode forced; answer-shaped responses blocked by output filter |
| Active challenge window | direct solutions refused; conceptual help allowed |
| Quota exhausted | cached-answer search only + upgrade prompt |
| Age/classroom flags | classroom content policy applied |
| Question matches cached canonical explanation (pattern-hash for regex/grammar explainers) | serve verified cache, zero model cost |

## 3. Retrieval grounding

Two indexes: (a) **reference corpus** — lessons, glossary, reference tables, misconception library (chunked, concept-tagged); (b) **scenario index** — every scenario's conceptIds + narration. Retrieval is concept-first: surface conceptIds + question embedding → top chunks + top 3 candidate scenarios. The model is instructed to cite scenario ids for demonstrable claims; the renderer turns them into "Watch it →" deep-links (LE invariant 2).

## 4. Generation & response contract

Per-feature system prompts (versioned in `packages/ai` prompt library). The model must emit **structured blocks**, not free markdown:
```
TutorResponse = Block[]
Block = prose(MDX-safe) | tokenChips(Token[]) | miniDiagram(scenarioClipRef)
      | diff(before,after) | table | watchIt(scenarioRef) | conceptLink(conceptId)
      | question(SocraticPrompt)         # Socratic mode's primary block
```
Renderer only accepts registry blocks (same doctrine as MDX). Register adapts to learner pref; length budget 180 words prose per turn (tutor, not lecturer — link to lessons for depth).

**Socratic mode:** responds with ≤2 guiding `question` blocks + at most 1 conceptLink; never emits diffs/answers; question quality rubric: each question must be answerable from the learner's visible state.

## 5. Verification loop (generators & debugger)

For any generated artifact (regex, lex rules, grammar, fix diff):
```
generate → extract artifact → run locally (engine/toolchain worker)
  ├─ verifiers pass → render with pass/fail wall + annotated view
  └─ fail → feed failures back (≤3 rounds) → still failing?
        render honestly: "best attempt, fails these cases" + failing cases shown
```
The debugger adds a *diagnosis validation* step: proposed fix is applied to a shadow copy and rebuilt; "The fix" block only renders if the shadow build's original error disappears (new errors are disclosed). This is the anti-hallucination core: **the browser is the fact-checker.**

## 6. Hint personalization (rung 3)

Rung-3 hints are tutor calls with a constrained prompt: input = learner's exact failing attempt + matched misconceptionId + task verifier; output = one `prose` block referencing their specific wrong artifact + one `watchIt` on an ad-hoc failure scenario (LE-02 §4) + never the solution. Cost: quota-free (hints are learning infrastructure), rate-limited per task.

## 7. Threads, memory & feedback

Threads persist per surface (lesson thread ≠ playground thread); a "carry to Tutor page" action promotes any thread. Long-term memory is **only** the mastery/misconception profile (LE-05) — no free-form memory of conversations (privacy + predictability). Every response: 👍/👎 + optional reason → eval set; scenario-citation precision and verification-loop failure rates are the two tracked quality KPIs. Model routing: fast model for explain-hover/cached-adjacent, frontier for debugging/generation/Socratic; all responses labeled with the feature id, never the model name (product speaks pedagogy, not vendor).
