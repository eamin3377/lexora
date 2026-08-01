# LE-05 — Progress, Mastery & Spaced Review

## 1. Mastery model (per learner × concept)

Bayesian-flavored exponential model, tuned for explainability over cleverness:

```
mastery(c) ∈ [0,100]
on EvidenceRecord e touching c:
  gain = w(e.kind) · score · hintPenalty(rung) · noveltyBoost
  mastery ← mastery + gain · (100 − mastery)/100      # diminishing returns
weights w: check .6 · quiz 1.0 · exam 1.4 · lab 1.2 · project-test 1.3 · review .5 · challenge 1.1
hintPenalty: rung0 1.0 · r1 .9 · r2 .75 · r3 .6
noveltyBoost: 1.25 if first evidence of this kind for c, else 1.0
failures: score<0.5 subtracts gain·0.4 (gentler down than up — confidence shouldn't whiplash)
```
- **Decay:** `mastery ← mastery · exp(−Δdays / τ(c))`, τ = 30d base, stretched by evidence diversity (`τ · (1 + 0.2·distinctKinds)`) and stability (each successful review multiplies τ by 1.3, cap 180d) — an SM-2-adjacent stability model expressed in mastery terms.
- **Bands (UI):** 0–24 unvisited/blueprint · 25–49 introduced · 50–79 practicing · 80–100 mastered (module badge needs quiz ≥80% *and* all module concepts ≥50).
- **Explainability (invariant 4):** the progress page can render, per concept, the evidence list + decay curve ("mastered 21 days ago, fading — 1 review restores").

## 2. Spaced review queue

Daily queue builder (server, on first dashboard visit):
```
due(c) = mastery dropped below band edge OR review interval elapsed
interval schedule per concept: 1d → 3d → 7d → 16d → 35d (×stability growth)
queue = top 8 due concepts, prioritized by (curriculum criticality × decay depth),
        each mapped to its lightest strong item type (LE-03) or a 60s scenario clip
session ≈ 5 min; completing it emits `review` evidence and counts for streak
```
Review sessions mix modalities deliberately (one predict, one derive-set, one fill-regex…) — modality variety feeds `distinctKinds` stability.

## 3. XP ledger (economy from doc 14, made transactional)

Append-only `XPEvent { learnerId, source, amount, refId, ts }`; balances are materialized views. Anti-grind caps enforced at ledger write (daily caps per repeatable source). XP is **motivational currency only** — never an input to mastery, certificates, or recommendations (separation keeps the meritocracy honest). Streak = daily flag derived from qualifying events (≥5 min engagement), freezes applied automatically at midnight scan.

## 4. Recommendation engine ("next-best" cards)

Rule-scored candidates (transparent, no ML at MVP):
```
candidates: next lesson in track · due review · active challenge · project milestone ·
            weak-concept exercise set
score = urgency (review decay, challenge deadline) + momentum (same-track continuation)
      + unlock value (prereq for many) − fatigue (same modality 3× today)
top 3 rendered with their reason strings (the score's dominant term, humanized)
```

## 5. Progress surfaces (data contracts)

- **Pipeline heatmap:** stage tint = mean mastery of stage's concepts, weighted by criticality; blueprint if <25.
- **Track rings:** % concepts ≥50 (outer) and ≥80 (inner).
- **Certificates eligibility:** live checklist query (exam pass + capstone tests + track thresholds).
- **Classroom dashboards:** same model aggregated; instructors see concept-level cohort heatmaps + misconception leaderboard ("14 students hitting `lex.longest-match` confusion") — the pedagogy telemetry that sells Edu.

## 6. Analytics event taxonomy (privacy-respecting)

`lesson_view / widget_engaged / widget_passed / hint_used(rung) / scenario_completed / quiz_submitted / review_done / streak_tick / share_created / ai_turn(feature) / build_run(toolchain)` — all keyed to pseudonymous ids, no third-party trackers (D16 §5), EU-residency storage. Product KPIs (doc 01 §14) are queries over this stream. Learner-facing transcript export bundles their own events + step-logs (data dignity: they can take their learning history with them).

## 7. Failure & edge policies

Clock skew: evidence ts server-assigned. Concurrent devices: evidence merges by idempotency key; mastery recompute is order-independent (fold over sorted events). Cheating flags never mutate mastery silently — human review path only. Account deletion: evidence anonymized, aggregates retained (cohort stats survive, person is gone).
