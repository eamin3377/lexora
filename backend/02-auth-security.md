# BE-02 — Authentication & Security

## 1. Authentication

- **Methods:** email magic-link (primary — passwordless, student-friendly), Google, GitHub; optional password upgrade for magic-link fatigue. Auth.js with Drizzle adapter.
- **Sessions:** httpOnly secure cookies, JWT strategy with 15-min access / 30-day rotating refresh; session claims carry `{ userId, plan, roles[], orgId? }` (entitlements snapshot, re-issued on plan change via a bump epoch). CSRF via double-submit on non-GET route handlers; server actions rely on Next's origin checks + explicit auth guard per action.
- **Anonymous continuity:** pre-signup work lives client-side (FA-04 §4); on signup, a one-shot `migrateAnonymousWork` action ingests tool autosaves/workspaces (idempotency-keyed).
- **2FA:** TOTP optional; enforced for admin & instructor roles.
- **LTI 1.3 (Edu, Phase 4):** platform-initiated login, deep-linking assignments, grade passback (AGS); LTI users map to org-scoped identities with linkage to personal accounts optional.

## 2. Authorization (RBAC + resource scopes)

Roles: `learner` (default) · `pro` (entitlement, not role — via plan) · `instructor(org)` · `org-admin(org)` · `moderator` · `staff` · `superadmin`.

Policy layer: a single `can(actor, action, resource)` module (code-reviewed policy table, no scattered checks):
- Workspaces: owner CRUD; shared snapshots world-readable; classroom workspaces instructor-readable (+journal, disclosed to students in UI).
- Content: staff/CMS roles; publishing requires `content-publisher`.
- Classroom: instructors manage own courses only; grades write via approval flow (LE-04/12 AI pre-review is draft-only).
- Admin surfaces IP-allowlisted + 2FA + audit-logged per request.

## 3. Threat model highlights & mitigations

| Threat | Mitigation |
|---|---|
| User-submitted code execution | Tier-1: browser sandbox (their own machine). Tier-2: BE-06 isolation stack. Server never compiles/executes user code outside the runner. |
| Shared-state XSS (states render diagrams/labels) | states are **data, never markup**: renderers escape all strings; `?s=` payloads schema-validated (unknown fields dropped); OG renderer runs on the same validated model |
| MDX injection via community/CMS | community posts = restricted markdown (no MDX); CMS MDX compiled against the typed registry only, in the publish job, not at request time |
| Quota/XP gaming | server-side rate caps at ledger write (LE-05 §3); AI quotas in Redis with atomic ops; challenge submissions embargoed + fingerprinted |
| Credential stuffing | magic-link primary; rate limits per IP+email; breached-password check on optional passwords |
| IDOR | every query scoped through the policy layer; ids are UUIDv7 (unguessable, sortable) |
| Instrumentation payload abuse (fd-3 crafted output) | client-side concern documented in FA-05: payloads schema-validated before entering trace adapters; server never trusts them for grading — grading verifiers run engines on inputs, not on claimed outputs |
| SSRF/exfil from AI tools | ai-gateway egress-allowlisted to providers; agent tool surface has no network (PG-04) |

## 4. Data protection & compliance

At rest: PG + objects encrypted (provider-managed keys; certs and PII columns additionally app-encrypted). In transit: TLS everywhere, HSTS. **Privacy:** GDPR + FERPA-aware (Edu): DPA templates, EU data residency option (Neon EU + R2 EU jurisdiction), no third-party trackers (first-party analytics only), minors: classroom accounts support school-managed mode (no public profile, no leaderboard exposure). Endpoints: `data-export` (takeout zip: profile, evidence, transcripts, workspaces) and `delete-account` (evidence anonymization per LE-05 §7) — both self-serve, both audited.

## 5. Application security program

Dependency scanning + lockfile audits in CI · secret scanning (pre-commit + CI) · security headers (CSP with nonces — strict because no third-party scripts; frame-ancestors allowlist for `/embed` only) · rate limiting tiers (per-IP, per-user, per-feature) at the edge middleware · quarterly external pentest before Edu sales · vulnerability disclosure policy page · audit log (append-only) for: auth events, role changes, grade writes, admin actions, data export/delete.
