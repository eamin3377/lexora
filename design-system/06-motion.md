# DS-06 — Motion Guidelines (System Level)

Authoritative rules + the engineering surface. Full choreography values live in `/design/08` (master spec); this doc defines how motion is **tokenized, composed, and enforced** in the design system.

## 1. Motion tokens (from DS-01 §6)

Durations (`micro/standard/scene/ceremony` bands) · easings (`out-quint`, `in-out-cubic`, `anticipate`, `linear`) · springs (`ui`, `pop`, `settle`) · pedagogy clocks (char-eat 120ms/cell, ink-draw 600px/s, etc. — scaled by the global 0.25–4× multiplier; UI motion never scales).

## 2. The eight laws (restated as lint rules)

1. One protagonist per composite animation.
2. Cause precedes effect by 60–120ms.
3. Stagger 40–90ms, ≤12 items.
4. No teleporting content — flying objects travel visible paths.
5. Everything settles (1–2px overshoot, `settle` spring).
6. 60fps or auto-degrade (halos→off, particles→½, 3D→SVG); pedagogy never degrades, garnish does.
7. All UI motion interruptible (spring redirect); pedagogy pause-then-respond.
8. Reduced-motion variants are mandatory, not optional: decorative off, pedagogy stepped frames + 120ms crossfades, ceremonies static.

## 3. Motion primitives (the system's animation API)

Named, reusable primitives implemented once in `packages/motion` and consumed declaratively:

| Primitive | Params | Used by |
|---|---|---|
| `inkDraw` | pathLength, speed(600px/s) | edges, branches, underlines, checkmarks |
| `pop` | scale from(.6), spring pop | TokenChip, badges, dots |
| `rise` | distance(24), fade | scroll reveals, page enters |
| `flip` | layout FLIP, 350ms | reorders, morphs, rank insertion |
| `flight` | path bezier, 350ms, ghost trail opt | chips, plates, lasso targets |
| `fold` | plate-fold recipe | reduce, tree building |
| `fuse` / `split` | converge+squash / pinch+separate | optimizer, minimization |
| `stamp` | drop 1.15→1 + 8°→0 | seals, type annotations, state plates |
| `liquidFill` | level %, meniscus wobble | pipeline pucks, mastery |
| `shimmer` | 1.6s sweep | skeletons only |
| `confetti` | count(6–12), paper-token sprites | ceremonies only |
| `typeIn` | 20ms/char | logs, captions, terminal |

Composite scenes (Lex run, LR step, subset construction) are **frame timelines** produced by engines; primitives render the deltas between frames. No component hand-rolls keyframes outside this vocabulary.

## 4. Orchestration standards

- **Entrance choreography per page:** max total 1100ms; above-fold only; content readable before motion completes (motion must never delay comprehension).
- **Shared-element continuity:** LivingPipelineStrip, device frames, TokenChips morph across routes when present on both (registered shared-element IDs).
- **Container transform:** expanding surfaces grow from their trigger (mega-menu, pipeline inspector, badge detail) — nothing materializes from nowhere.
- **Idle motion budget:** at most 2 gentle idle loops visible per viewport (e.g., footer heartbeat + one thumbnail); everything else rests. Idle loops pause when tab hidden or element off-screen.
- **Frequency guards:** ceremonies fire once per achievement ever; teaching autoplays fire once per user per surface; hint arrows dismiss forever after first use.

## 5. Performance rules

Transform/opacity only for continuous motion; `will-change` applied on interaction start, removed on rest; no animating layout properties (height auto-animations use measured FLIP); scroll listeners passive + rAF-batched; heavy scenes precompute timelines in Workers; frame monitor samples 2s windows and steps quality down (and back up) silently.

## 6. Authoring & QA workflow

Every new motion: spec in the recipe vocabulary → prototype at 0.25× and 4× (must read at both) → reduced-motion variant → aria-live text if pedagogical → perf trace on the 2019-laptop baseline → added to the Storybook "Motion" catalog with play/scrub controls. Motion review is part of design review — a PR that adds unspecified motion fails lint (`no-raw-durations` rule mirrors `no-raw-colors`).
