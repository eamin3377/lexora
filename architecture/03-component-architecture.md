# FA-03 — Component Architecture

## 1. The layer cake

```
Routes (app/…/page.tsx)            thin: data-load + compose
  └─ Feature surfaces (features/*)  screen assembly, feature logic hooks
      └─ Composed components (DS-03 Tier 5)   LessonHeader, ToolWorkbench, CodeLab…
          └─ Pedagogy components (visualizers/*)   LexMachine, ParserTheater…
              └─ Visualizer primitives (visualizers/primitives)  TapeView, AutomataCanvas…
                  └─ Design-system primitives (@lexora/ui)  Button, TokenChip, Panel…
                      └─ Motion primitives (@lexora/motion)  inkDraw, pop, flight…
```

## 2. The trace-rendering contract (the core pattern)

Engines emit a **Trace**; visualizers are pure functions of `(trace, frameIndex)`.

```ts
// @lexora/shared/trace (shape spec — illustrative, not code to build yet)
Trace {
  toolId, schemaVersion
  frames: Frame[]              // precomputed, immutable
  events: EventTick[]          // frame indices of significant moments (timeline ticks)
  provenance: ProvenanceGraph  // artifact-id ↔ artifact-id links across representations
  narration: string[]          // per-frame StepLog / aria-live lines
}
Frame { artifacts: Record<ArtifactId, ArtifactState>, deltas: Delta[] }
Delta { kind: 'move'|'create'|'destroy'|'morph'|'highlight', from?, to?, recipe: MotionRecipeId }
```

- **Playback:** `useTracePlayer(trace)` (in `@lexora/motion`) owns clock, speed, play/step/scrub; returns `frameIndex` + transition descriptors. TransportBar binds to it. Scrubbing = index lookup (no recompute), backward playback = rendering deltas inverted.
- **Rendering deltas:** each `Delta.recipe` maps to a DS-06 motion primitive; visualizer components never invent motion.
- **Narration:** the player emits `narration[frameIndex]` to StepLog + `aria-live`.
- **Why this shape:** one contract gives us scrub/replay/reverse, transcripts, reduced-motion stepping, sync-highlight, deterministic tests (assert on frames), and shareable states (state = engine input + frameIndex) — every signature feature falls out of the data model.

## 3. Component hierarchy — canonical tool page

```
<ToolPage>                              route (RSC shell: header, docs links)
 └─ <ToolIsland tool="lex" />           client boundary, dynamic import
     └─ <ToolWorkbench>                 dock layout, splitters, share, focus mode
         ├─ <ToolStateProvider>         URL codec ⇄ store (FA-04)
         ├─ <SyncHighlightProvider>     provenance hover bus
         ├─ <SpecPanel>                 e.g. <LexSpecEditor/> (workbench pkg)
         ├─ <MachineStage>
         │   ├─ <TapeView/> <AutomataCanvas/> …primitives fed by frame slices
         ├─ <OutputPanel>               <TokenStream/> <GeneratedCode/> <PerfReport/>
         ├─ <TransportBar player={…}/>  from @lexora/motion(ui)
         └─ <StepLog player={…}/>
```

Selector discipline: each primitive subscribes only to its artifact slice of the current frame (`useFrameSlice(artifactId)`) — a 60fps scrub re-renders panels independently, never the whole tree.

## 4. Composition patterns (house rules)

- **Compound components** for multi-part surfaces: `<Workbench.Explorer/>`, `<Quiz.Option/>` — shared context, no prop-drilling.
- **Slots over booleans:** `<Card media={…} footer={…}>` not `<Card hasFooter>`. Variants via `cva`-style typed variant props matching DS-03 tables exactly.
- **Controlled pedagogy, uncontrolled UI:** visualizer components are fully controlled (frame in, callbacks out); simple UI primitives may hold local state.
- **Provider stack (app layout):** `ThemeTokens → QueryClient → AuthSession → SharedElement → CommandK → AITutorSheet → Toaster`. Tool/lesson providers mount per-surface, never globally.
- **MDX registry:** lessons may only use components from `@lexora/content` registry (typed manifest); unknown components fail the content build — authors can't fork the design system.
- **Error containment:** every island wraps in `<IslandBoundary>` (retry + telemetry); a crashing visualizer never takes down prose.
- **Lazy media pattern:** heavy leaves (Monaco, xterm, R3F hero, each WASM tool) load behind `dynamic()` + intersection preload + skeleton from DS-03; the import graph is audited per route in CI (bundle-diff gate).

## 5. Naming & file conventions

Components PascalCase, one per file, colocated `.stories.tsx` + `.test.tsx`; hooks `use*`; stores `*.store.ts`; server actions `*.action.ts`; no `index.ts` barrels inside packages except the package public API (keeps tree-shaking honest). Props interfaces exported and named `<Component>Props`. Every pedagogy component documents its artifact vocabulary (which ArtifactIds it renders) in its header docblock — the provenance graph's rendering map.
