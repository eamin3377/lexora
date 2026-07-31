# 16 — Performance, Accessibility & SEO

## 1. Performance budgets (enforced in CI via Lighthouse CI)

| Metric | Budget |
|---|---|
| LCP (home, lessons) | < 1.8s (p75, 4G) |
| INP | < 200ms |
| CLS | < 0.05 |
| JS on first load (home) | < 180KB gz (visualizers excluded, lazy) |
| Animation frame rate | 60fps; automatic quality step-down below 45fps |
| WASM toolchain cold fetch | < 4s on 4G, cached thereafter (~20MB, split & streamed) |

## 2. Strategy

- **Lazy everything heavy:** visualizers code-split per tool; Monaco, xterm, Three.js, and each WASM tool (flex/bison/gcc) load on demand with skeleton-in-paper placeholders; WASM cached in CacheStorage + versioned; prefetch on hover of tool links.
- **GPU-friendly animation:** transforms/opacity only for continuous motion; SVG for diagrams up to ~300 nodes, Canvas/WebGL renderer kicks in beyond; scroll-scrub via `requestAnimationFrame` + passive listeners; Framer Motion with `will-change` discipline; all simulation stepping precomputed into a frame timeline (scrubbing = index lookup, not recompute).
- **Rendering:** SSR/SSG for home, lessons, docs, glossary, gallery pages (content is indexable HTML); tools hydrate as islands; RSC/streaming for dashboard.
- **Compute off main thread:** automata construction, subset construction, table generation, and toolchain runs all in Web Workers; UI never blocks on simulation.
- **Assets:** variable fonts subset (Latin + Bangla for l10n phase), `font-display: swap`; illustrations as optimized SVG; AVIF for photos; icon sprite.

## 3. Accessibility (WCAG 2.2 AA)

Beyond the design-system rules (doc 03 §7): every pedagogical animation emits a synchronized text log (`aria-live=polite`) — screen-reader users get a step-by-step narration equivalent, downloadable as transcript. Diagrams expose a structured alternative (transition table for automata, indented outline for trees). Full keyboard maps published in `/docs`; skip-links; focus management on panel/dock changes; forms with proper labels/errors; captions on tour-mode narration; `prefers-reduced-motion` and `prefers-contrast` honored. Quarterly audit with NVDA/VoiceOver as a release gate.

## 4. SEO & growth surface

Every lesson, glossary term, reference page, and public gallery project is SSG with semantic HTML, structured data (Course, LearningResource, FAQ schema), canonical URLs. **Shared visualizer states get server-rendered OG images** (the diagram itself as the preview card) — the growth engine. Programmatic landing pages: "NFA to DFA converter", "LALR parser generator online", "flex tutorial" — matching real search demand with genuinely superior interactive answers. Sitemap.xml auto-generated; sub-100ms TTFB via edge caching for public content.

## 5. Observability

RUM (web-vitals) + error tracking (Sentry) + WASM crash reporting; per-visualizer performance marks; anonymized learning-event analytics (privacy-respecting, GDPR-ready, no third-party ad trackers — a stated trust feature for the Edu market).
