# BE-07 — Deployment & Infrastructure Plan

## 1. Environments

| Env | Purpose | Data |
|---|---|---|
| `preview` | per-PR (Vercel preview + Neon branch + Upstash ephemeral) | seeded fixtures, no real users |
| `staging` | release rehearsal, content-team preview | anonymized subset + full content |
| `prod` | live | real |

Neon branching gives per-PR databases with schema migrations applied — schema changes are reviewed *running*, not read. Runner-svc: separate staging/prod pools in its isolated account; previews mock tier-2.

## 2. Platform mapping

Web + core-api: **Vercel** (edge network, ISR). Redis: Upstash. Postgres: Neon (+ pgvector). Objects/CDN for wasm & media: **Cloudflare R2 + CDN**. ai-gateway + realtime node + jobs workers: **Fly.io** (regions us-east, eu-central; ap-south later). runner-svc: **AWS (isolated account)** — Firecracker needs metal/KVM instances; region pairing mirrors Fly. Email: Postmark. Payments: Stripe. Status page + uptime: BetterStack.

## 3. CI/CD pipeline (GitHub Actions + Turborepo remote cache)

```
PR:   typecheck · unit · component · lint(no-raw-*) · content tests · golden traces ·
      Storybook visual regression · axe · bundle-diff · preview deploy + Lighthouse budgets
merge→main: staging deploy → smoke suite (Playwright: signup→lesson→tool→share→playground build)
release (tagged, ~2×/week): prod deploy — web/api atomic; gateway & workers rolling;
      migrations expand-first (contract in a later release); feature flags gate user-visible changes
WASM artifacts: separate pipeline (Docker/wasi-sdk) → hash-published to R2 → manifest PR
Rollback: web/api = instant re-alias; workers = redeploy previous image; DB = never rolled back
      (expand-and-contract discipline makes that survivable)
```

## 4. Observability

- **RUM:** web-vitals → first-party collector (analytics_events) with per-route budgets alarmed against D16 targets.
- **Errors:** Sentry (web, api, gateway, workers) with release tagging + source maps; WASM crash reports (tool, hash, stack) — top crasher list feeds toolchain triage.
- **Tracing:** OpenTelemetry across core-api → gateway → jobs (trace ids in audit log); slow-query log reviewed weekly.
- **Product telemetry:** LE-05 §6 events → monthly-partitioned PG → dashboards (activation funnel, aha-rate, lesson completion, AI verification pass rate, tier-2 minutes).
- **SLOs:** app availability 99.9% · shared-state resolve p95 < 200ms · evidence ingest p95 < 300ms · AI first-token p95 < 1.5s · tier-2 prompt p95 < 2s. Error budgets gate release cadence.
- **Alerting:** PagerDuty-lite (BetterStack) — page on SLO burn, queue depth, quota-system failure (fail-open event), runner anomalies.

## 5. Scaling plan (aligned to product phases)

| Phase | Expected load | Moves |
|---|---|---|
| Beta (P1) | 10k MAU | defaults everywhere; single Fly region |
| Launch (P2) | 100k MAU, viral state-shares | Redis cluster tier, read replica for community/gallery, OG pre-render queue, CDN tuning (shared states immutable) |
| Power (P3) | AI GA | gateway horizontal autoscale on queue depth; pgvector → dedicated index node if p95 degrades |
| Scale (P4) | 1M MAU, classrooms | core-api extracted from Next into its own Fly service if function limits bite; evidence table → monthly partitions; leaderboards sharded by league; ap-south region live |

Load model note: the client-compute architecture means MAU growth stresses *storage and shares*, not CPU — the expensive paths (AI, tier-2) are quota-shaped by design.

## 6. Backup & disaster recovery

PG: PITR (Neon) 7d free-tier settings → 30d prod; nightly logical dumps to R2 (cross-region). R2: versioned buckets + lifecycle rules; workspaces chunk-store replicated cross-region weekly. Redis: ephemeral by contract (everything in it is rebuildable — BE-01 §4 rule enforced by review). DR targets: RPO 15 min (PG), RTO 4h full stack; runbook per failure class; quarterly restore drill (staging restored from prod backups). Secrets: platform vaults + 90-day rotation; break-glass procedure documented.

## 7. Cost model (steady-state estimates, launch phase)

Vercel + Fly + Upstash + Neon ≈ low four figures/mo at 100k MAU (static-heavy, client compute). R2 egress ≈ hundreds (WASM cached aggressively, immutable). AI: dominated by debugger/agent — capped by quota design; target blended gross margin ≥ 80% on Pro. Tier-2: metal pool ≈ $600–1.5k/mo at launch scale (scale-to-zero nights). Unit economics guardrail reviewed monthly against BE invariant 5 ("free must be nearly free").

## 8. Launch checklist (infra definition-of-done)

Domains + TLS + HSTS preload · CSP enforced (report-only burn-in 2 weeks) · rate limits verified by load test · backup restore drill passed · SLO dashboards live · status page public · pentest findings closed (highs) · data-export/delete E2E tested · runner isolation review (external) signed off · load test: 10× expected launch traffic on share-resolve and evidence-ingest paths.
