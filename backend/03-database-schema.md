# BE-03 — Database Schema

Postgres (Neon), Drizzle ORM, UUIDv7 PKs, `created_at/updated_at` everywhere (omitted below), soft-delete only where noted. Naming: snake_case tables, singular domain prefixes.

## 1. Identity & orgs

```
users            (id, email uq, name, username uq nullable, avatar_url, locale,
                  plan enum[free,pro,team], plan_epoch int, flags jsonb, deleted_at)
auth_accounts    (id, user_id fk, provider, provider_account_id uq(provider,paid), tokens…)  # Auth.js
sessions         (Auth.js managed)
orgs             (id, kind enum[university,company], name, slug uq, settings jsonb)
org_members      (org_id, user_id, role enum[member,instructor,org_admin], pk(org_id,user_id))
classrooms       (id, org_id fk, instructor_id fk, name, term, join_code uq, settings jsonb)
classroom_members(classroom_id, user_id, role enum[student,ta], pk(...))
```

## 2. Content (read model; authored in CMS)

```
tracks           (id, slug uq, title, stage, position)
modules          (id, track_id fk, slug, title, position, badge_id, checkpoint_quiz_id)
lessons          (id, module_id fk, slug, title, est_minutes, position,
                  current_version_id fk)
lesson_versions  (id, lesson_id fk, version int, mdx_ref (object key), concept_ids uuid[],
                  toolchain_range, published_at, status)        # immutable
concepts         (id, key uq e.g. 'lex.maximal-munch', name, parent_id, glossary_term_id)
concept_edges    (from_id, to_id, kind enum[requires], pk(...))
scenarios        (id, key uq, tool_id, version int, seed jsonb, mode, script jsonb,
                  tasks jsonb, concept_ids uuid[], golden_trace_ref, status)
glossary_terms   (id, term uq, mdx_ref, scenario_id fk nullable)
quiz_items       (id, type, concept_ids uuid[], difficulty, bloom, spec jsonb,
                  feedback jsonb, telemetry jsonb, status, author_kind)
quiz_blueprints  (id, module_id fk, spec jsonb)
```

## 3. Learning state (per learner)

```
evidence         (id, user_id fk, kind, item_id fk?, scenario_id fk?, concept_ids uuid[],
                  score real, first_try bool, hints_used int, latency_ms int,
                  context jsonb, idempotency_key uq, ts)         # APPEND-ONLY
mastery          (user_id, concept_id, value real, stability real, last_evidence_at,
                  next_review_at, pk(user_id, concept_id))       # derived, rebuildable
lesson_progress  (user_id, lesson_version_id, state enum, scroll_anchor,
                  widget_states jsonb, completed_at, pk(user_id, lesson_id))
review_queue     (user_id, concept_id, due_at, interval_days, pk(...))  # derived
certificates     (id, user_id fk, kind, issued_at, verify_slug uq, artifact_ref,
                  revoked_at nullable)
```

## 4. Workspaces, sharing, journal

```
workspaces       (id, owner_id fk, name, kind enum[free,project,assignment],
                  project_slug?, classroom_assignment_id?, fs_snapshot_ref,
                  layout jsonb, deleted_at)
workspace_snapshots (id, workspace_id fk, label, fs_ref, created_by enum[user,agent,system])
shared_states    (id, short_slug uq, tool_id, payload bytea (compressed ?s=),
                  og_image_ref, creator_id?, view_count)
journal_entries  (id, workspace_id fk, kind enum[build,ai_fix,agent_step,snapshot],
                  payload jsonb, snapshot_id fk?)                # APPEND-ONLY, 30d TTL free
```

## 5. Gamification & community

```
xp_events        (id, user_id fk, source, amount int, ref_id, ts)        # APPEND-ONLY
xp_balances      (user_id pk, total int, level int)                       # materialized
streaks          (user_id pk, current int, longest int, last_day date, freezes int)
badges           (id, key uq, name, art_ref, criteria jsonb, rarity real)
user_badges      (user_id, badge_id, earned_at, pk(...))
challenges       (id, week, kind, spec jsonb, opens_at, closes_at)
challenge_submissions (id, challenge_id fk, user_id fk, artifact jsonb, metrics jsonb,
                  score, rank int?, fingerprint bytea)
threads          (id, author_id fk, title, tags text[], solved_post_id?, deleted_at)
posts            (id, thread_id fk, author_id fk, body_md, embedded_states uuid[], deleted_at)
reactions        (user_id, post_id, kind, pk(...))
showcases        (id, user_id fk, workspace_snapshot_id fk, title, readme_md,
                  stars int, forked_from?, featured_at?)
```

## 6. Classroom, billing, AI, ops

```
assignments      (id, classroom_id fk, template jsonb, tests_ref, due_at, points)
submissions      (id, assignment_id fk, user_id fk, snapshot_id fk, submitted_at,
                  ai_review jsonb, grade real?, graded_by?, journal_ref)
billing_customers(user_id pk, stripe_customer_id uq, plan, status, seats?)
ai_quotas        (redis — see below)
ai_turns         (id, user_id fk, feature, tokens_in, tokens_out, cost_microusd,
                  cache_hit bool, verified bool?, feedback int?, ts)  # APPEND-ONLY, partitioned monthly
audit_log        (id, actor_id, action, resource, detail jsonb, ip, ts)  # APPEND-ONLY
analytics_events (partitioned by month; pseudonymous_id, event, props jsonb, ts)
feature_flags    (key pk, rules jsonb)
```

**Key indexes:** evidence `(user_id, ts)`, `(concept_ids GIN)` · mastery `(user_id, next_review_at)` · shared_states `(short_slug)` · xp_events `(user_id, ts)` · challenge_submissions `(challenge_id, score desc)` · posts `(thread_id, created_at)` · analytics partitions BRIN on ts.

## 7. Redis keyspaces

`sess:*` session adjunct · `quota:ai:{user}:{feature}:{day}` counters (atomic INCR, TTL 48h) · `lb:weekly:{week}:{league}` sorted sets · `lb:alltime` · `rate:{scope}:{key}` sliding windows · `hot:state:{slug}` shared-state cache (TTL 1h) · `live:classroom:{id}` presence sets.

## 8. Object storage (R2) buckets

`content/` lesson MDX + media (immutable, versioned keys) · `traces/` golden traces · `workspaces/` FS snapshots (content-addressed chunks — dedupe across snapshots/forks) · `og/` rendered cards (immutable by hash) · `certs/` PDFs · `wasm/` toolchain artifacts (public, immutable, hash-keyed) · `exports/` takeout zips (signed URLs, 7-day TTL).

## 9. Derivation & rebuild guarantees

`mastery`, `review_queue`, `xp_balances`, `quiz_items.telemetry`, leaderboards: all rebuildable from append-only sources (`evidence`, `xp_events`, submissions) — a documented `rebuild` job per table. Migration policy: expand-and-contract only (no destructive migrations against live tables); evidence/xp schemas are versioned via `context jsonb` rather than churned.
