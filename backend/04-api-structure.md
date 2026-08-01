# BE-04 — API Structure

## 1. Three API surfaces (deliberate split)

| Surface | Style | Consumers | Auth |
|---|---|---|---|
| **App mutations** | Next server actions (typed, co-located with features) | our frontend only | session cookie |
| **App reads** | RSC data loaders + route handlers `/api/app/*` (JSON) for client islands | our frontend only | session cookie |
| **Public API** | REST `/api/v1/*` (OpenAPI-documented) | embeds, LMS, future mobile, partners | API keys / OAuth (Phase 4) |

Server actions never exposed cross-origin; public REST is versioned and contract-frozen. Internal shapes validated end-to-end with zod schemas shared via `@lexora/shared` (single source for request/response types).

## 2. Server-action catalog (by domain — names are the contract)

```
learning:  recordEvidence(batch) · saveLessonProgress · completeLesson ·
           startQuizAttempt · submitQuizAttempt · claimBadge · requestCertificate
workspaces: createWorkspace · saveSnapshot · shareState · forkShared ·
           syncJournal(batch) · restoreSnapshot
community: createThread · replyPost · react · acceptAnswer · publishShowcase ·
           starShowcase · report
gamification: (no direct writes — XP is emitted server-side by other actions)
classroom: createClassroom · createAssignment · submitAssignment ·
           approveReview · publishGrades · startLiveSession
billing:   createCheckoutSession · openPortal
account:   updateProfile · updatePrefs · requestExport · deleteAccount ·
           migrateAnonymousWork
```
Rules: every mutating action takes an `idempotencyKey` where retries are possible (evidence, journal, submissions); every action returns typed `Result` (never throws to the client); every action calls `can()` first (BE-02 §2); side-effectful actions enqueue jobs rather than doing slow work inline.

## 3. Public REST `/api/v1` (initial surface)

```
GET  /states/:slug                → shared state payload (+ cache headers, hot in Redis)
POST /states                      → create short link (rate-limited, optional auth)
GET  /certificates/:slug/verify   → { holder, kind, issuedAt, valid }
GET  /glossary /glossary/:term    → reference content (CORS-open, for embeds/blogs)
GET  /embed-manifest/:tool        → embed bootstrap metadata
POST /lti/*                       → LTI 1.3 endpoints (Phase 4)
GET  /og/:kind/:hash              → rendered OG images (immutable, CDN-cached)
```
Conventions: JSON:API-lite envelopes `{ data, error }`; errors `{ code, message, hint? }` with stable machine codes; cursor pagination (`?cursor=&limit=`); ETag on all GETs; rate-limit headers on every response.

## 4. Realtime contracts

- **SSE `/api/app/stream`** (one connection, multiplexed topics): `leaderboard:{scope}` deltas · `notifications` · `classroom:{id}:roster`. Events: `{ topic, type, payload, seq }`; clients resume with `Last-Event-ID`.
- **WS `/rt/classroom/:id`** (realtime node): instructor state broadcast (throttled 10Hz, delta-encoded tool states), spotlight switches, hand-raise. Auth: short-lived signed ticket fetched via server action.
- **WS `/rt/pty/:sessionId`**: tier-2 terminal (BE-06); binary frames, resize/control messages, idle timeout 5 min.

## 5. Webhooks (inbound)

`/api/hooks/stripe` (signature-verified, event dedupe table) · `/api/hooks/cms` (content publish → job) · Phase 4: LMS grade-passback callbacks. All hooks: verify → persist raw → enqueue → 200 fast.

## 6. API versioning & deprecation

Public REST: URL-versioned (`/v1`), additive changes only within a version; deprecations announced in `/changelog` + `Sunset` headers ≥ 90 days. Internal: no versioning — frontend and actions deploy atomically (monorepo dividend). Embeds pin `embed-manifest` versions so third-party pages never break on our deploys.

## 7. Error, rate-limit & abuse posture

Uniform error codes: `unauthorized / forbidden / not_found / invalid / conflict / quota_exceeded / rate_limited / server_error`. Rate limits (edge + Redis): anonymous state-create 10/h/IP · evidence 600/h/user (generous; caps abuse not learning) · community writes 30/h · AI per BE-05. Abuse: shared-state and showcase creation runs a content scan job (profanity/PII in labels) before public indexing; report → moderation queue.
