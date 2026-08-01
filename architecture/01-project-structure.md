# FA-01 — Project Structure & Module Boundaries

Monorepo: **pnpm workspaces + Turborepo**. TypeScript strict everywhere, `"type": "module"`, path aliases via workspace protocol (`@lexora/*`).

## 1. Workspace layout (authoritative)

```
lexora/
├── apps/
│   └── web/                          # the Next.js 15 app (App Router)
│       ├── app/                      # routes only — see FA-02
│       ├── features/                 # app-level feature modules (see §3)
│       │   ├── auth/  dashboard/  lessons/  playground/  projects/
│       │   ├── practice/  community/  gamification/  ai/  classroom/
│       ├── components/               # app-only composition (shells, providers)
│       ├── lib/                      # app glue: analytics, auth client, api client
│       ├── styles/                   # globals.css (token imports only)
│       └── next.config.ts / middleware.ts
├── packages/
│   ├── shared/                       # 0-dependency foundation
│   │   ├── types/                    # Token, Grammar, TraceFrame, Provenance…
│   │   ├── trace/                    # Trace model + player utilities
│   │   ├── state-codec/              # ?s= serialization (compress/version/migrate)
│   │   └── result/                   # error/result helpers
│   ├── engines/                      # pure computation, no DOM, no React
│   │   ├── regex-engine/  automata/  grammar/  edu-compiler/
│   ├── ui/                           # design system (DS-03), Storybook host
│   ├── motion/                       # primitives (DS-06), timeline player, TransportBar logic
│   ├── visualizers/                  # trace-rendering React components
│   │   ├── lex-machine/  regex-lab/  parser-theater/  pipeline-explorer/
│   │   └── primitives/               # AutomataCanvas, TapeView, TreeView, StackView…
│   ├── workbench/                    # Monaco wrapper, language services, virtual FS, build runner
│   ├── terminal/                     # shell, command registry, nano/vim-sim, xterm binding
│   ├── wasm-toolchain/               # flex/bison/gcc loaders + instrumentation protocol
│   ├── ai/                           # gateway client, prompt ids, verification loop client
│   ├── content/                      # MDX schema, lesson component registry, quiz types
│   └── config/                       # eslint, tsconfig, tailwind preset (tokens)
├── services/                         # non-frontend (api split, runner) — out of scope here
└── tooling/                          # codegen (tokens.json → css/tailwind), scripts
```

## 2. Dependency rules (enforced by eslint `import/no-restricted-paths` + turbo graph)

```
shared ← engines ← visualizers ← apps/web
shared ← ui ← visualizers, workbench, terminal, apps/web
shared ← motion ← visualizers, ui(TransportBar), apps/web
wasm-toolchain → shared only;   consumed by workbench, terminal, features/*
content → ui, visualizers (component registry), shared
```
- `engines` **must not** import React, DOM types, or `ui` — CI runs them in a Node test env to prove it.
- `ui` **must not** import engines or visualizers (system stays product-agnostic except pedagogy-tier primitives, which live in `visualizers/primitives` precisely because they know about traces).
- `apps/web/features/*` may import anything below; features **may not import each other** — cross-feature needs go through `shared` types or app-level composition. (Prevents the feature-tangle that kills big apps.)

## 3. Feature module anatomy (`apps/web/features/*`)

Each feature is a vertical slice:
```
features/lessons/
├── components/          # feature-private components (LessonHeader, HintLadder…)
├── hooks/               # useLessonProgress, useMasterySync
├── server/              # server actions + data loaders (RSC-callable)
├── stores/              # feature Zustand stores (FA-04)
├── types.ts             # feature-local types
└── index.ts             # PUBLIC API — the only import surface for routes
```
Routes (`app/…/page.tsx`) stay thin: compose feature public APIs, own no logic.

## 4. Build & tooling pipeline

- **Turbo tasks:** `build` (topological), `test`, `lint`, `typecheck`, `storybook`, `tokens` (Style Dictionary → css vars + tailwind preset + Figma sync artifact).
- **Codegen:** `tokens.json` → `packages/config/tailwind-preset`; MDX component registry → typed manifest; route manifest → typed `href()` helper (no string URLs in app code).
- **WASM artifacts:** built out-of-band (Docker + wasi-sdk), versioned, published to R2/CDN; `wasm-toolchain` pins exact hashes; never committed to the repo.
- **CI gates:** typecheck, unit (Vitest), component (Testing Library), visual (Playwright+Percy on Storybook), axe, Lighthouse budgets (D16), bundle-size diff per route, `no-raw-*` lints.
- **Env boundaries:** `server-only` / `client-only` markers enforced; secrets never reachable from client bundles (checked by lint).

## 5. Rendering strategy per surface (summary — detail in FA-02)

| Surface | Mode |
|---|---|
| Home, pricing, about | SSG + islands |
| Lessons, docs, glossary, reference | SSG (content) + client islands (widgets), ISR on content publish |
| Tools (`/tools/*`) | Static shell, fully client visualizer island, state from URL |
| Playground | Client app surface (no SSR of docks), RSC shell for chrome |
| Dashboard, classroom, community | RSC + streaming, client islands for interactivity |
| Gallery/showcase, profiles | ISR + OG-image route handlers |
| Embeds (`/embed/*`) | Static shell, chromeless island, `readonly` prop |
