# BE-05 — AI Gateway

The server side of LE-04/PG-04. A separate service (`ai-gateway`) from day one: different scaling, cost, and security profile.

## 1. Request pipeline

```
POST /ai/:featureId  { context, input, threadId? }        (session-authenticated via core-api token)
  → schema-validate context against the feature's ContextSchema (unknown fields dropped)
  → policy gate (server-enforced mirror of LE-04 §2: exam lock, quotas, classroom policy)
  → quota reserve (Redis atomic; refund on failure/cache-hit)
  → cache probe (§4)
  → retrieval (concept-first, §3)
  → provider call (streaming) with the feature's prompt bundle
  → output contract enforcement (§5)
  → stream structured blocks to client · log ai_turn (cost, cache, verified?)
```
Client-side verification results (LE-04 §5 — verification runs in the *browser*) are reported back via `PATCH /ai/turns/:id { verified, rounds }` — the gateway's quality ledger without ever executing user code server-side.

## 2. Feature registry & model routing

```
Feature { id, contextSchema, promptBundleRef, modelPolicy, quotaClass, outputSchema }
modelPolicy: { primary, fallback, maxTokens, temperature, escalation? }
```
Routing classes: `fast` (explain-hover, regex-explain, cached-adjacent → small/cheap model) · `standard` (tutor chat, quiz gen) · `frontier` (debugger, agent planning, Socratic) — concrete providers/models are config, not code; multi-provider with health-based failover (p95 latency + error-rate circuit breakers). All provider calls egress-allowlisted; no data-retention providers preferred; provider names never surface in product.

## 3. Retrieval service

Corpus: lesson versions, glossary, reference, misconception library, scenario index (BE-03 §2) → chunked, concept-tagged, embedded at publish time (content-publish job) into pgvector. Query: `conceptIds` from context boost matching chunks + ANN on the question embedding → top-k with concept coverage guarantee (≥1 chunk per surface concept if it exists). Scenario citations resolved to ids and validated (a cited scenario must exist and be `live`) before the response streams — dead citations dropped server-side.

## 4. Caching (the margin-maker)

- **Canonical explanation cache:** regex/grammar/production explanations keyed by normalized-artifact hash (regex AST hash, production hash) — expected >60% hit rate on explainers; entries carry the verifying schema version and are invalidated on prompt-bundle bumps.
- **Thread-local cache:** identical follow-up in same thread window.
- **Semantic near-dup (Phase 3):** embedding-similarity probe over recent verified answers for stateless features only.
Cache hits: quota refunded, `cache_hit` logged, served <100ms.

## 5. Output contract enforcement

Responses must parse as the feature's `outputSchema` (structured blocks, LE-04 §4). Enforcement: streaming validator; malformed block → one silent repair retry → else degrade to plain-prose block with telemetry flag. Socratic mode adds an output filter (answer-shaped content classifier + rule checks) — violations regenerate with a stricter suffix, max twice, then refuse politely. Safety: provider moderation on inputs where required by classroom policy; PII scrubber on context (emails/tokens redacted before leaving our infra).

## 6. Quotas & cost governance

Quota classes: `free 15/day` · `pro fair-use 300/day` · `edu pooled n×students` · hints & explain-hover uncharged but rate-limited (LE-04 §6). Enforced in Redis (reserve→commit/refund). Cost telemetry: per-feature $/day dashboards (admin), budget alarms, automatic downgrade of `standard→fast` routing under budget pressure (flagged in responses as reduced mode — honesty even here). Monthly `ai_turns` partitions feed the eval set exports.

## 7. Prompt & eval operations

Prompt bundles versioned in-repo (`packages/ai/prompts`), deployed with the gateway; every turn logs its bundle version. Offline eval harness: golden question sets per feature (curated + thumbs-down samples) scored on: citation precision, verification pass rate, Socratic-leak rate, structure validity. A prompt bump ships only with eval deltas attached (prompts get the same rigor as code).
