# BE-01 — Backend Architecture

## 1. Topology (Phase 1–3; split-points marked for scale)

```
                    ┌────────────────────────────────────────────┐
 Browser ── CDN ────┤  Edge (Vercel/CF): static, ISR, middleware │
                    └───────────────┬────────────────────────────┘
                                    │
              ┌─────────────────────┴──────────────────────┐
              │        core-api (Next.js route handlers     │
              │        + server actions — one deployable)   │
              │  domains: identity · learning · workspaces  │
              │  · community · gamification · billing       │
              └──┬──────────┬──────────┬──────────┬─────────┘
                 │          │          │          │
            Postgres      Redis     R2/S3     ai-gateway (svc)
            (Neon)       (Upstash)  objects       │
                 │          │                 LLM providers
              jobs (queue: pg-boss → upgrade path: SQS)
                 │
            workers: mastery-rollup · leaderboard · og-render ·
                     content-publish · email · integrity-scan
                                    │
                          runner-svc (BE-06, isolated account)
```

- **One deployable API** at MVP (`core-api` inside the Next app: server actions for app mutations + route handlers for public/REST). Domain modules are code-separated (`services/api/domains/*`) with no cross-domain imports except via interfaces — the future service split is a deploy decision, not a rewrite.
- **First planned splits (Phase 3+):** `ai-gateway` (different scaling/cost profile, already isolated) and `runner-svc` (security isolation mandatory from day one — separate cloud account/project).
- **Realtime:** SSE from core-api for leaderboards/notifications; WebSocket only for classroom live sessions and tier-2 PTYs (through a thin `realtime` node on Fly, sticky sessions).

## 2. Domain modules & responsibilities

| Domain | Owns | Notes |
|---|---|---|
| identity | users, sessions, orgs/classrooms, roles | wraps Auth.js adapter |
| learning | content read model, evidence intake, mastery, review queue, certificates | evidence is append-only; mastery = fold (LE-05) |
| workspaces | workspace metadata, snapshots, shared states (`/s/:id`), journal sync | file bytes in object storage, metadata in PG |
| community | threads, posts, reactions, gallery showcases, reports | |
| gamification | XP ledger, streaks, badges, challenges, leaderboards | ledger append-only; boards materialized in Redis |
| billing | Stripe sync, plans, entitlements, AI quotas | entitlements cached in session claims |
| admin | CMS (Payload embedded), flags, moderation queues, AI monitor | |

## 3. Async jobs (queue-backed, idempotent, at-least-once)

`mastery-rollup` (evidence batch → mastery snapshots + review due-dates, 5-min cadence) · `leaderboard-refresh` (weekly boards, league promotions Monday 00:00 UTC per region) · `og-render` (satori diagram cards on share/publish, cached forever by state hash) · `content-publish` (MDX validate → scenario golden traces → ISR revalidate tags) · `integrity-scan` (similarity fingerprints on classroom submissions) · `email-digest` (weekly recap) · `data-export` (learner takeout zips) · `cert-issue` (PDF + verify record).

## 4. Caching layers (in order)

1. CDN/ISR: all content pages, glossary, gallery, cert verify (tag-based revalidation).
2. Redis: sessions adjunct, leaderboards (sorted sets), AI quota counters, hot shared-states, rate limits.
3. Postgres materialized views: XP balances, track progress aggregates (refreshed by jobs).
4. Client (Query cache) per FA-04.
Rule: every cache has an owner, a TTL, and an invalidation trigger documented beside its key definition (BE-03 §5).

## 5. Failure posture

Graceful-degradation matrix: PG down → site read-only (content is static; banner "progress paused, keep learning — we'll sync"); evidence buffers client-side (LE-01 §3) — the learning experience survives backend outages by design. Redis down → quotas fail-open with conservative defaults, leaderboards stale. ai-gateway down → cached explanations only. runner down → tier-1 WASM unaffected (the invariant-1 dividend). All services: health endpoints, circuit breakers on cross-service calls, timeouts ≤ 5s.
