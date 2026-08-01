# Lexora — Frontend Architecture

Engineering blueprint for the React/Next.js application. Companion to `/docs` (product), `/design` (UX), `/design-system` (UI contract). Still specification — no code.

| # | Document | Covers |
|---|---|---|
| FA-01 | [`01-project-structure.md`](01-project-structure.md) | Monorepo layout, package boundaries, dependency rules, build pipeline |
| FA-02 | [`02-routing.md`](02-routing.md) | App Router tree, layouts, RSC/client split, URL-state protocol, loading/error boundaries |
| FA-03 | [`03-component-architecture.md`](03-component-architecture.md) | Component hierarchy, the trace-rendering contract, composition patterns |
| FA-04 | [`04-state-management.md`](04-state-management.md) | State taxonomy, Zustand stores, TanStack Query, persistence, sync bus |
| FA-05 | [`05-engines-workers-wasm.md`](05-engines-workers-wasm.md) | Engine layer, Worker topology, WASM toolchain integration, virtual FS |

## Architectural invariants (the five rules everything obeys)

1. **Engines are pure; UI renders traces.** No computation in components; no rendering in engines. The `Trace` is the only contract between them.
2. **Every tool state is a URL.** If it can't be serialized into `?s=`, it isn't tool state.
3. **Server components by default; client islands by necessity.** Interactivity is opt-in and code-split.
4. **One-way dependency flow:** `apps/web → packages/visualizers → packages/engines → packages/shared`. Nothing imports upward.
5. **The design system is the only styling authority.** App code composes `@lexora/ui`; raw styles fail lint.
