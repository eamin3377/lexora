# D08 — Motion & 3D Master Specification

The single source of truth for every animation value. If a motion isn't specified here or in D02–D07, it doesn't ship.

---

## 1. Easing library (named curves)

| Name | Curve | Use |
|---|---|---|
| `out-quint` | cubic-bezier(.22,1,.36,1) | Entrances, reveals |
| `in-out-cubic` | cubic-bezier(.65,0,.35,1) | Moves, layout shifts |
| `spring-ui` | stiffness 300 / damping 24 / mass 1 | Buttons, chips, plates |
| `spring-pop` | stiffness 400 / damping 20 | Token pop, badge pop |
| `spring-settle` | stiffness 260 / damping 30 | Card landings, stamps |
| `linear` | — | Conveyor flows, scrubber mapping only |
| `anticipate` | cubic-bezier(.36,0,.66,-.28) | Exits that "wind up" (falling chips) |

## 2. Duration bands (hard rules)

Micro (hover, tint, tick): **80–180ms** · Standard (open, move, morph): **200–350ms** · Scene (panel expand, page): **400–600ms** · Ceremony (badge, level-up, certificate): **900–1400ms, always skippable** · Pedagogy: **learner-clocked** (per-char/per-step values defined per tool at 1×; global speed multiplier 0.25–4×; all pedagogy timings scale, UI timings never do).

## 3. Choreography laws

1. **One thing leads.** In any composite animation a single element is the protagonist; supports are ≤50% its distance/scale change.
2. **Cause before effect, 60–120ms apart.** Table cell flashes *then* the plate moves; never simultaneous (simultaneity hides causality — the enemy of teaching).
3. **Stagger = 40–90ms**, never >120ms; max 12 staggered items (beyond that, batch).
4. **Nothing moves without provenance.** Every flying object (chip, plate, line) travels a visible path between its origin and destination; no teleporting content.
5. **Settle everything.** Landings get 1–2px overshoot + settle (`spring-settle`); nothing stops dead.
6. **60fps or degrade.** Frame monitor auto-drops: halo blurs → off, particle counts → halved, 3D → SVG fallback. Never drop the pedagogy, only the garnish.
7. **Interruptibility.** All UI animations are cancel-and-redirect (spring-based); pedagogy animations pause-then-respond.
8. **Reduced motion:** decorative = off; pedagogy = discrete frames w/ 120ms crossfades; ceremonies = static card + confetti removed.

## 4. Signature motion recipes (canonical values)

| Recipe | Spec |
|---|---|
| **Ink-draw** | stroke-dashoffset sweep; speed 600px/s (constant velocity, so long edges take proportionally longer — reads as a pen); 1px trailing "wet ink" darker segment 8px long |
| **Token pop** | scale .6→1 `spring-pop` + accent-100 radial flash (0→48px, 250ms fade) |
| **Character eat** | cursor 120ms/cell `in-out-cubic`; cell tint 80ms following cursor by 40ms |
| **Rewind streak** | 80ms/cell reverse + 12px directional blur + cells un-tint in trail |
| **Plate fold (reduce)** | glow 150ms → lift 12px 120ms → rotate-in ±6° + merge 280ms `in-out-cubic` → new plate settle |
| **Lasso** | dashed ink loop draws 400ms `out-quint` → contracts to 0 while flying to target 300ms |
| **Cell-division (split)** | region pinches at midline (scaleX .92) 150ms → separates 8px gap 150ms + hairline draws between |
| **Fuse (fold constants)** | tiles converge 200ms → squash 1→.85→1 120ms → result tile pop + 6-particle paper puff (particles: 8px paper bits, 300ms, gravity 200px/s², fade) |
| **Wax stamp** | element drops from 1.15 scale + 8° → 1.0/0° in 120ms `spring-settle` + ring ripple 200ms |
| **Liquid fill** | mask rises with 2px meniscus sine wobble (2 cycles, 600ms), then stills |
| **Blueprint fill-in** | dashed→solid stroke morph 300ms + fill fades in 200ms after |
| **Confetti (ceremonies)** | 6–12 paper-cut tokens, launch 260–320px/s at 60–120°, rotation ±180°, gravity, 1.2s lifetime, ink outlines visible |

## 5. Page & panel transitions

Route change: outgoing fades to 0 & falls 8px (150ms) → incoming rises 12px + fades (250ms `out-quint`), 60ms overlap. **Shared elements:** Living Pipeline strip, device frames, and token chips morph across routes when both pages contain them (FLIP, 350ms) — continuity is a brand behavior. Panel expand (pipeline inspector, mega-menu): container-transform pattern — the trigger card *becomes* the surface (no modal-from-nowhere). Modals: 180ms scale .98→1; backdrops fade 150ms.

## 6. Scroll motion

Reveal-once threshold 30% viewport; rise 24px + fade 400ms `out-quint`; grouped children stagger 60ms. Scroll-scrub sections (home S2 only + roadmap camera): 1:1 progress mapping, `requestAnimationFrame`, no easing on the mapping itself (easing lives in keyframe design). Parallax cap 24px, decorative layers only, disabled ≤ md.

## 7. 3D Art Direction — "The Paper Machine"

Only three 3D surfaces exist (scarcity keeps it special): **home hero machine**, **certificate card tilt** (pseudo-3D CSS), **level-12 seal**.

### Hero machine (R3F)
- **Style:** low-poly papercraft — every mesh looks folded/cut from the design system's paper stocks; visible "fold" edges (slight normal hardening), tiny paper-fiber roughness map (0.85 roughness, 0 metalness). Palette locked to system tokens: bodies `#FDFBF7`/`#F7F3EA`, mechanisms ink `#1A1F16`, accents leaf/marigold/cobalt/coral used exactly as their 2D meanings (scanner = marigold, parser gears = cobalt, output = leaf).
- **Lighting:** single warm key (soft directional, 3200K-ish tint, top-left 35°) + broad cool-neutral fill + AO baked; **no environment reflections, no bloom, no god-rays** (papercraft, not sci-fi). Shadows: one soft contact shadow on an invisible ground plane (radius 24px blur equivalent).
- **Camera:** 35° FOV, fixed 3/4 hero angle; pointer parallax rotates machine ±8° yaw / ±4° pitch (lerp 0.06); no user orbit (composition is authored).
- **Animation rig:** conveyor belt (UV scroll), 3 gear clusters (rotation speeds 0.4/0.7/1.1 rad/s, interlocked), Lexi's lens (bobs 6px, flash = emissive marigold pulse 150ms), token chute flap (opens per emission, spring). Characters/tiles/chips are **billboarded 2D sprites of the actual UI assets** living inside the 3D scene — the 2D/3D marriage that makes it unmistakably ours (tokens in 3D are literally the UI's token chips on paper cards).
- **Performance:** ≤ 45k triangles, one 1024 atlas + one 512 sprite atlas, DRACO'd GLB ≤ 900KB; renders at devicePixelRatio ≤ 1.5; pauses when off-screen or tab-hidden; SVG twin (same choreography, flat) for mobile/low-power/reduced-motion/WebGL-absent — decided before first paint, no pop-in swap.

### Floating objects
Paper-cut tokens (hero + 2 section dividers only): pure CSS `translate3d` sine drifts (defined in D02); shadows are flat paper shadows, not dynamic.

### Explicit bans
No glossy blobs, no chrome text, no particle nebulae, no rotating wireframe globes, no depth-of-field, no lens flares. If it wouldn't exist in a beautiful pop-up book, it doesn't exist here.

## 8. Loading choreography

- Route-level: top 2px progress bar in stage accent (starts 80ms after nav intent, finishes with 150ms sweep).
- Tool cold-load (WASM fetch): the device frame renders instantly with a skeleton machine inside; a caption cycles honest status lines ("warming up flex… 2.1MB"); on ready, skeleton parts snap to real parts with a 300ms assemble.
- Logo compile-in (1.4s) used only: first app load, auth, certificates. Never on route changes.

## 9. Sound (optional layer, default OFF)

A 9-sound palette (soft mechanical: tick, shhk-rewind, plate-clink, stamp, chime) mapped to recipes; master toggle in settings + first-run prompt never plays sound before consent. All sounds ≤ 120ms, −18 LUFS, no music.

## 10. QA checklist per animation (definition of done)

Runs 60fps on a 2019 mid-range laptop · interruptible · reduced-motion variant exists · aria-live text emitted if pedagogical · respects global speed if pedagogical · no layout thrash (transform/opacity only) · verified at 0.25× (choreography must still read) and 4× (must not strobe).
