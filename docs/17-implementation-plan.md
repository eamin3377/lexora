# 17 — Implementation Plan

Everything needed to start development: stack, architecture, component hierarchy, user flows, screens, roadmap, risks.

---

## 1. Technology Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router, RSC)** + TypeScript strict | SSG/SSR for SEO surfaces + island hydration for tools |
| Styling | **Tailwind CSS 4** + CSS variables (design tokens) + tailwind-merge | Token-driven Paper & Ink system |
| Motion | **Framer Motion** (UI) + **GSAP ScrollTrigger** (scroll-scrub) + custom timeline engine for pedagogy | Scrub/step/replay needs a bespoke frame-timeline core |
| Diagrams | **SVG + d3-force/dagre layouts**, custom renderer; Canvas fallback >300 nodes | Full control over ink-draw aesthetics |
| 3D (hero only) | React Three Fiber, lazy | Restrained per design system |
| Editor | **Monaco** + custom Lex/Yacc language services | VSCode familiarity |
| Terminal | **xterm.js** + custom shell over **OPFS** virtual FS | Doc 11 |
| Toolchain | **Flex/Bison/GCC compiled to WASM** (wasi-sdk; fallback: clang→wasm for gcc-equivalent); instrumented forks emitting JSON side-channel | The honesty principle (docs 06–11) |
| Core engines | Custom TS libraries: `@lexora/regex-engine`, `automata`, `grammar` (FIRST/FOLLOW/LL/LR table gen), `edu-compiler` (subset-C → TAC → RISC-V) — all pure, all in Workers | Deterministic, steppable, provenance-carrying |
| State | Zustand (tool state) + TanStack Query (server) + URL-serialized tool snapshots | Shareable-state requirement |
| Content | **MDX in CMS (Payload)** with typed embedded components | Doc 05 §7 |
| Backend | Next.js API routes + **Postgres (Neon)** + Drizzle ORM; Redis for sessions/leaderboards | Boring and scalable |
| Auth | Auth.js (email + GitHub + Google); LTI 1.3 later for Edu | |
| AI | Provider-agnostic gateway (Vercel AI SDK), per-feature prompt library, verification loop service | Doc 12 |
| Heavy compute | Firecracker microVM pool (Fly.io/AWS) — Phase 3 | Terminal tier 2 |
| Payments | Stripe (+ regional gateways for Bangladesh/India later) | Personas |
| Infra | Vercel (app) + Cloudflare R2 (WASM/assets) + GitHub Actions CI (typecheck, tests, Lighthouse budgets, visual regression via Playwright+Percy) | |

## 2. Folder Architecture (monorepo, pnpm + Turborepo)

```
lexora/
├── apps/
│   └── web/                        # Next.js app
│       ├── app/                    # routes mirroring the sitemap (doc 02)
│       │   ├── (marketing)/        # home, pricing, about
│       │   ├── learn/ tools/ playground/ projects/ practice/
│       │   ├── ai/ community/ dashboard/ classroom/ admin/
│       │   └── embed/ api/
│       ├── components/             # app-level composition only
│       └── lib/                    # app utilities, analytics, auth glue
├── packages/
│   ├── ui/                         # Paper & Ink design system (tokens, primitives, Storybook)
│   ├── motion/                     # timeline engine, transport bar, scrub controller
│   ├── visualizers/                # LexMachine, RegexLab, ParserTheater, PipelineExplorer,
│   │                               #   AutomataCanvas, TreeView, TokenChip … (pure UI, engine-fed)
│   ├── engines/
│   │   ├── regex-engine/           # parse, NFA/DFA, minimize, step-trace
│   │   ├── automata/               # generic FA model + layout
│   │   ├── grammar/                # CFG, FIRST/FOLLOW, LL(1), LR(0)/SLR/LALR/CLR, conflicts
│   │   └── edu-compiler/           # subset-C frontend, TAC, passes, RISC-V codegen, provenance
│   ├── workbench/                  # Monaco setup, language services, virtual FS, build runner
│   ├── terminal/                   # shell, coreutils, command registry, nano/vim-sim
│   ├── wasm-toolchain/             # flex/bison/gcc wasm builds + loaders + instrumentation protocol
│   ├── ai/                         # gateway, prompts, verification loop, quota
│   ├── content/                    # MDX schema, lesson component contracts, quiz types
│   └── shared/                     # types, provenance model, state serialization (?s=)
├── services/
│   ├── api/                        # if/when split from Next
│   └── runner/                     # microVM job runner (Phase 3)
├── content/                        # lesson MDX source (synced to CMS)
├── docs/                           # this specification
└── tooling/                        # eslint, tsconfig, CI configs
```

**Key architectural law:** engines are **pure, deterministic, step-recording** (every operation returns a trace of frames with provenance links). Visualizers only render traces. This one decision powers scrubbing, replay, sync-highlighting, transcripts, and testing everywhere.

## 3. Component Hierarchy (core interactive stack)

```
<AppShell>                         nav, ⌘K, AI slide-over, toasts
 └─ <ToolPage>                     e.g. /tools/lex
     └─ <ToolWorkbench>            layout, panel docking, share/state (?s=)
         ├─ <SpecPanel>            (structured editor: LexSpecEditor | GrammarEditor | RegexInput)
         ├─ <MachineStage>         the animated center
         │   ├─ <InputTape>        character cells, cursor, bookmarks
         │   ├─ <AutomataCanvas>   nodes/edges, ink-draw, pulse, pan/zoom
         │   ├─ <StackView> <TableView> <TreeView> <IRView> <RegisterStrip>
         │   └─ <SyncHighlightProvider>   three-way hover/tap sync bus
         ├─ <OutputPanel>          <TokenStream> <GeneratedCode> <PerfReport> <Console>
         ├─ <TransportBar>         play/pause/step/back/scrub/speed  (from @lexora/motion)
         └─ <StepLog>              aria-live narration + transcript export
```

Lesson pages compose the *same* stack inside `<TryIt>`/`<Anim>`/`<CodeLab>` MDX components. The Playground composes `<Workbench>` (Explorer/Monaco/docks) with the same `<OutputPanel>` and visualizer panels attached to instrumented runs.

## 4. Primary User Flows

1. **Anonymous aha:** land on shared link `/tools/regex?s=…` → state hydrates → autoplay one run → user edits → "Save & continue learning" → signup modal (state preserved through auth) → dashboard seeded with the relevant track suggestion.
2. **Daily learner loop:** dashboard → resume card → lesson (read → scrub animation → TryIt task → Code Lab run → checks) → XP moment → review-queue nudge → streak tick.
3. **Assignment flow (Edu):** instructor creates assignment from template → students open pre-seeded workspace → build in Playground/terminal → tests pass → submit → AI pre-review → instructor approves grades → gradebook/LTI sync.
4. **Debug flow:** terminal error → ✨ explain → AI diagnosis card → "Watch it" deep-link → visualizer reproduces failure → fix applied as diff → re-run green.
5. **Challenge flow:** Monday notification → challenge page → ranked submission → leaderboard placement → share card.
6. **Project→gallery flow:** capstone milestones → all tests green → publish → showcase page generated → social share (OG image = their pipeline).

## 5. Screen List (build inventory)

Marketing: Home, Pricing, About, Changelog. Auth: login/signup/reset/verify. Learn: hub, roadmap, 5 track pages, lesson template, review queue. Tools (16): regex, regex-visualizer, regex-generator, automata, lex, lex-simulator, tokens, grammar, parser, ast, bison, pipeline, ir, optimizer, codegen, compiler-builder. Playground (+workspace). Projects: hub, 13 project templates, gallery, showcase. Practice: exercises, challenges, quiz center, assignments. AI: tutor, debugger, rule-generator. Labs. Community: forum, thread, leaderboard. Docs, Reference, Glossary (+term). Dashboard: home, progress, certificates, achievements. Profile (public). Settings (5 tabs). Classroom: list, course, live, gradebook. Admin: content CMS, quiz bank, challenges, users, AI monitor, flags. System: 404 (a "syntax error at line 404" easter egg), error, offline. Embeds. **≈ 75 unique screens/templates.**

## 6. Development Roadmap (engineering)

- **Phase 0 (wks 1–4):** monorepo, design tokens + `ui` primitives + Storybook, motion/timeline engine, regex+automata engines with trace model, CI with budgets. *Exit: TransportBar scrubs a DFA simulation in Storybook.*
- **Phase 1 (wks 5–16) — Wonder:** Home, Regex Lab, Automata Visualizer, Lex Machine (engine-simulated Lex, WASM Flex behind flag), auth, lesson infra + Track A/B content (24 lessons), quizzes, progress, share-state links. **Public beta.**
- **Phase 2 (wks 17–32) — Depth:** grammar engine + Grammar Builder + FIRST/FOLLOW + Parser Theater (LL + LR family), Bison WASM, Track C (18 lessons), Playground v1 + terminal tier 1 (flex/bison/gcc WASM), projects 1–4, XP/streaks/badges. **Launch.**
- **Phase 3 (wks 33–48) — Power:** edu-compiler + Pipeline Explorer, Track D (20 lessons), AI suite (tutor/debugger/generators with verification), projects 5–13, certificates, Pro billing, terminal tier 2.
- **Phase 4 (yr 2) — Scale:** community, gallery, leaderboards/challenges live-ops, classrooms + LTI, localization, mobile polish, marketplace groundwork.

Team shape (lean): 2 product engineers, 1 systems/WASM engineer, 1 designer(-illustrator), 1 content author (compiler PhD/instructor), fractional PM. Content authoring runs parallel from Phase 1.

## 7. Risks & Mitigations

| Risk | L×I | Mitigation |
|---|---|---|
| GCC-to-WASM toolchain heavier than expected | H×H | Start with Flex+Bison WASM (proven) + clang-wasm for C; educational interpreter as universal fallback; tier-2 VMs as escape hatch |
| Visualizer performance on big automata/tables (email-regex DFA, CLR tables) | M×H | Trace precomputation in Workers, Canvas renderer >300 nodes, pagination of item-sets, perf budgets in CI |
| Content production is the real bottleneck | H×H | Hire instructor-author early; MDX component library makes lessons assembly, not custom dev; ship tracks incrementally |
| AI cost & hallucination | M×M | Verification-first generation, caching, quotas, small-model routing |
| Scope creep (this spec is huge) | H×M | Phase gates with exit criteria; Tier-0 visualizers always prioritized over Tier-4 |
| Cheating undermines Edu credibility | M×H | Socratic-lock in graded contexts, question-bank rotation, submission similarity checks |
| Solo-feel design at startup budget | M×M | Design tokens + Storybook discipline; illustration style chosen to be producible in batches |
| Browser storage (OPFS) inconsistencies | M×M | FS abstraction with memory fallback + cloud sync for logged-in users |

## 8. Future Improvements (post-spec backlog)

Real-time collaborative workspaces (CRDT) · Interpreters/VM/GC track · LLVM track · language-design studio with community-published languages · native mobile app for review/streaks · offline PWA mode · voice-narrated tour modes · instructor content marketplace · research/embed licensing for textbooks · competitive "Compiler Royale" live events.

## 9. Definition of Ready (to start coding)

✅ This 17-document spec approved · Figma file translating doc 03 into component sheets + 6 key screens (home, lesson, Lex Machine, Parser Theater, Playground, dashboard) · engine trace-model interface reviewed · Phase 0 tickets cut. **No code before these.**
