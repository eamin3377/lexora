# Lexora — Backend & Infrastructure

Server-side blueprint: services, auth, data, APIs, AI gateway, sandboxed execution, and deployment. Companion to `/architecture` (frontend). Specification only — no code.

| # | Document | Covers |
|---|---|---|
| BE-01 | [`01-backend-architecture.md`](01-backend-architecture.md) | Service topology, boundaries, async jobs, caching layers |
| BE-02 | [`02-auth-security.md`](02-auth-security.md) | Authentication, sessions, RBAC, LTI, threat model |
| BE-03 | [`03-database-schema.md`](03-database-schema.md) | Full Postgres schema, Redis keyspaces, storage buckets |
| BE-04 | [`04-api-structure.md`](04-api-structure.md) | API design, endpoint catalog, contracts, versioning, realtime |
| BE-05 | [`05-ai-gateway.md`](05-ai-gateway.md) | Provider routing, prompt registry, quotas, caching, safety |
| BE-06 | [`06-sandbox-execution.md`](06-sandbox-execution.md) | Tier-2 microVM runner: lifecycle, isolation, protocol |
| BE-07 | [`07-deployment-infra.md`](07-deployment-infra.md) | Environments, CI/CD, observability, scaling, DR, cost model |

## Backend invariants

1. **Client-first compute.** Anything that can run in the learner's browser does (engines, WASM toolchain, verification). The backend stores, syncs, serves, and only executes what the client can't.
2. **Boring by default.** Postgres + Redis + object storage + one deployable API. New infrastructure requires a failed simpler alternative.
3. **Every write is attributable.** Evidence, XP, content, AI actions — append-only or audited; balances and mastery are derivations, never hand-edited truths.
4. **Privacy is architecture.** Pseudonymous analytics, EU residency option, no third-party trackers, learner data export/delete as first-class endpoints.
5. **The free tier must be nearly free to serve.** Cost ceilings are design constraints (static content, client compute, aggressive caching).
