# FA-02 — Routing Architecture (Next.js App Router)

## 1. Route tree (mirrors sitemap doc 02; groups define layout scopes)

```
app/
├── layout.tsx                        # root: html, fonts, ThemeTokens, Providers, Toaster
├── (marketing)/                      # marketing layout: TopNav(marketing) + Footer
│   ├── page.tsx                      # /            Home (SSG)
│   ├── pricing/page.tsx              # SSG
│   ├── about/page.tsx  changelog/page.tsx
├── (auth)/                           # centered-card layout, no footer
│   ├── login/ signup/ forgot/
├── (app)/                            # app layout: TopNav(app) + AI sheet mount + ⌘K
│   ├── learn/
│   │   ├── layout.tsx                # LivingPipelineStrip slot
│   │   ├── page.tsx                  # hub (RSC)
│   │   ├── roadmap/page.tsx          # client canvas island
│   │   ├── review/page.tsx
│   │   └── [track]/[module]/[lesson]/page.tsx   # SSG paths from CMS, ISR tag-revalidated
│   ├── tools/
│   │   ├── layout.tsx                # tool header chrome
│   │   ├── page.tsx                  # tools hub (SSG)
│   │   └── (16 tool routes)/page.tsx # static shell + <ToolIsland tool=… />
│   ├── playground/
│   │   ├── page.tsx                  # new workspace → redirect to id
│   │   └── [workspaceId]/page.tsx    # client surface
│   ├── projects/ page.tsx · [slug]/page.tsx · gallery(→ /gallery)
│   ├── gallery/ page.tsx · [showcaseId]/page.tsx
│   ├── practice/ exercises/ challenges/ quiz/ assignments/
│   ├── ai/ tutor/ debugger/ rule-generator/ regex-generator/
│   ├── labs/ page.tsx · [labId]/page.tsx
│   ├── community/ page.tsx · [threadId]/page.tsx · leaderboard/page.tsx
│   ├── docs/[[...slug]]/ reference/[[...slug]]/ glossary/ glossary/[term]/
│   ├── dashboard/ page.tsx · progress/ certificates/ achievements/
│   ├── profile/[username]/page.tsx
│   └── settings/[[...tab]]/page.tsx
├── (classroom)/classroom/…           # instructor layout (Edu gate)
├── (admin)/admin/…                   # admin layout (role gate)
├── embed/[tool]/page.tsx             # chromeless layout
├── s/[stateId]/route.ts              # short-link resolver → redirect with ?s=
├── cert/[id]/page.tsx                # public verify (ISR)
├── api/                              # route handlers: auth, trpc-style app api, og/
│   └── og/[kind]/route.tsx           # server-rendered OG diagrams (satori + diagram renderer)
└── sitemap.ts / robots.ts / manifest.ts
```

## 2. Layout & boundary strategy

- **Route groups own chrome:** `(marketing)`, `(auth)`, `(app)`, `(classroom)`, `(admin)`, `embed` — five nav variants, one TopNav component parameterized per group.
- **`loading.tsx`** at: each group root (route progress bar), lesson segment (prose skeleton), tool segment (device-frame skeleton per D08 §8), dashboard (card skeletons). Skeletons come from DS-03, mirror final layout.
- **`error.tsx`** at group roots (Stax 500 card + reset) + tool segment (visualizer crash → "reload tool" without losing URL state). `global-error.tsx` minimal paper page. `not-found.tsx` = the 404 easter egg.
- **Middleware:** auth-session refresh, role gates for `(classroom)/(admin)`, locale detection (future), `?s=` length guard (oversized → 413 page suggesting short-link).
- **Metadata:** per-route `generateMetadata`; lessons/glossary/gallery produce structured data (Course/DefinedTerm/CreativeWork); shared-state tool URLs generate OG via `/api/og` with the serialized diagram.

## 3. RSC / client split (the islands doctrine)

| Layer | RSC | Client |
|---|---|---|
| Page shells, prose, MDX static parts | ✅ | |
| TopNav frame | ✅ | ⌘K, streak flame, avatar menu are islands |
| Lesson MDX interactive components (`<TryIt>`, `<Anim>`, `<CodeLab>`, `<Check>`) | | ✅ lazy islands, hydrate on near-viewport (`rootMargin: 400px`) |
| Visualizer tools | | ✅ single `<ToolIsland>` per page, `next/dynamic`, code-split per tool |
| Playground | | ✅ whole surface client; RSC provides workspace metadata |
| Dashboard data cards | ✅ streamed | count-up/heatmap animations are thin client leaves |
| Community feed | ✅ | composer, votes are islands |

Rules: no client component above the fold that isn't needed for interaction; `"use client"` only at island roots (never sprinkled); server actions for mutations (progress, submissions) so islands stay lean.

## 4. URL-state protocol (`?s=`)

- **Codec** (`@lexora/shared/state-codec`): `{ v: schemaVersion, t: toolId, p: payload }` → MessagePack → deflate → base64url. Budget ≤ 1800 chars; larger states auto-POST to `/api/states` → `/s/:id` short link (UI copies the short form always).
- **Versioning:** per-tool schema version with pure migration functions (`v1→v2…`); unknown future version → friendly "made with a newer Lexora" card.
- **Hydration order:** URL `?s=` > saved workspace (if logged in & same tool) > tool default example. URL wins because links must always reproduce exactly what was shared.
- **Write-back:** tool mutations debounce 800ms → `history.replaceState` (never pushes — Back means "leave tool," not undo; undo is in-tool via trace history).
- **Auth preservation:** signup flow round-trips `?s=` through the auth redirect (`callbackUrl`) — the "your automaton is safe" banner reads it back.

## 5. Navigation ergonomics

Typed route helper `href('lesson', {track, module, lesson})` generated from the route manifest — string literals banned. Prefetch: default for nav links; tool links prefetch the island chunk on hover-intent (120ms). Scroll restoration: manual for lesson resume (saved position), default elsewhere. Cross-page shared-element morphs (pipeline strip, device frames) registered via a `SharedElementProvider` in the `(app)` layout.
