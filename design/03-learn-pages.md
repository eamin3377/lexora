# D03 — Learn Pages: Hub, Roadmap, Lesson Template

## 1. Learn Hub (`/learn`)

**Header band (paper-1, 280px):** H1 "Learn" 39px + one-line promise + **the Living Pipeline strip** — the signature element:
- 1136×72px horizontal diagram: 9 stage pucks (48px rounded-squares, radius 14, stage accent-100 fill, Inkline glyph 22px) joined by 2px ink connectors with 6px arrowheads.
- Per-user progress paint: each puck fills bottom-up with its accent at mastery % (liquid-fill with a 1px meniscus wobble on change); completed pucks get the double-ring accepting-state border (brand handshake).
- Current position: puck breathes (scale 1.0→1.04, 2.4s) + label pill below "You are here".
- Hover any puck: tooltip (track name, x/y lessons, mastery %) + connected lessons list below filters instantly (120ms crossfade).

**Body:** 5 track cards (full-width rows, 160px, radius 16, e1): left 96px stage-glyph medallion (accent-100 circle, glyph animates on hover) · center: track title 25/650 + description 15 + progress bar (6px, radius full, accent fill animates width 400ms on load) + "12/24 lessons" tabular · right: resume button or "Start track". Row hover: lift + medallion glyph micro-animation. Below tracks: **Review queue card** (marigold-100 tint): "5-minute review · 8 cards due" + streak-guard copy; and **Continue card** pinned top if a lesson is in progress (shows exact scroll position: "LR(0) items — 62% through, ~12 min left").

## 2. Compiler Roadmap (`/learn/roadmap`)

Full-screen pannable canvas (paper grain + 8% marginalia): the trail from home S5 expanded into the entire curriculum — 5 track regions, each a soft accent-100 blob (organic, hand-drawn edge) containing module nodes (40px) chained by ink paths; lesson dots (16px) orbit each module. States: done = filled accent + white check draw; available = paper + accent ring; ahead = blueprint style (dashed ink outline, unfilled — curiosity bait, clickable with "peek" preview modal). Click module: radial expand (300ms) into a lesson list panel docked right (360px). Minimap bottom-right 180×120px. Pan inertia; pinch/scroll zoom 0.5–1.5×. First visit: 2.5s camera glide from Source to Executable, then settles at the user's position.

## 3. Lesson Template (`/learn/:track/:module/:lesson`)

**Structure (desktop):** center prose column 720px; right rail 320px sticky (top 88px); full-bleed breakouts to 1136px for visual stages.

**Header (sticky-condensing):** breadcrumb 13px → lesson H1 31/38 → meta row (track chip · ⏱ 14 min · mastery ring 20px). Living Pipeline mini-strip (48px, current stage glowing). On scroll: condenses to 48px bar with title + a 2px reading progress bar in stage accent along its bottom edge.

**Prose blocks:** 16/26, paragraphs max 65ch; H3 sub-heads with 12px stage-accent tick left. **Callouts** (radius 12, 20px padding, icon 20px, 3px left stripe): Insight (leaf-100), Watch out (coral-100, Bug icon), Deep dive (cobalt-100, collapsible), Try it (marigold-100). Inline glossary terms: dotted ink underline; hover = 280px popover with mini-diagram (rendered live, 350ms delay); click = glossary panel.

**Concept Animation breakout (1136px, min 480px):** device-framed visualizer running the lesson's scenario with the standard TransportBar. First entry: autoplays once at 0.75×; a caption line under the stage types each step-log sentence in sync (14px mono, `ink-500`). Scrub hint appears after autoplay: hand-drawn arrow doodle to the timeline + "drag me" (dismissed forever after first scrub).

**Try-It widget (1136px):** visualizer + a **task banner** (44px, marigold-100, radius-top 12): "⚑ Make the DFA accept `abba`" + attempt counter. Success: banner morphs leaf-100, checkmark draws, +5 XP chip pops from it and arcs to the nav streak area (600ms bezier, once per task).

**Code Lab (1136×560px, radius 16, device shadow):** editor left 55% / output right 45% / 44px toolbar top (file pills, Run ▸ 88×32px leaf, layout toggle). Locked scaffold regions: paper-2 background + 12px 🔒 gutter icon; editable region has a 2px marigold left edge. Run: button → spinner (logo-draw), mini-pipeline (5 pucks, 20px) in toolbar lights per real phase; output tabs per doc 05. Failing diff view: expected vs actual, mismatch chars coral-underlined with a per-line shake (subtle, 2px, once).

**Inline checks:** question cards 720px (radius 12, e1): MCQ options = 48px rows, radio 20px; correct: row tints leaf-100 + check draws + a one-line "why" slides open; wrong: coral shake + the *relevant animation frame* embeds inline (120px thumbnail, click to replay that exact step). Predict-type: the paused visualizer sits above choices; after answering, truth plays out — the learner's guess ghost-overlays the real outcome.

**Hint ladder UI:** right-aligned "Stuck?" ghost link under widgets → popover stack of 3 cards revealed one at a time; each card's reveal costs shown ("−2 XP") on its blur overlay; card 3's key line has an ink-scribble blur (hand-drawn scribble mask) that wipes away on click.

**Summary block:** leaf-100 band, "You can now:" + checklist items that check themselves sequentially (150ms apart) as the block enters; XP total counts up; **Next lesson card** (full-width 96px, shows next concept's animation thumbnail playing muted) with a 4s auto-advance ring (cancellable, only if user reached bottom naturally).

**Right rail:** outline (13px items, active section tracked with a 2px accent slider), Tutor button, notes (collapsible textarea, autosaves with a tiny ink-pen wiggle), glossary peek. ≤1023px: rail becomes a bottom sheet (56px grabber bar, snap points 30/70%).

**Quiz page (checkpoint):** distraction-reduced — nav condenses, rail hidden, one question per screen with a top segmented progress (10 segments, fill per answer); transitions: card exits left 250ms / next enters right; results screen: score ring draws (1s), per-concept bars, wrong answers listed with "watch why" links; ≥80%: module badge ceremony — badge card flips in (600ms), Press Gold shimmer sweep (certificates only get real gold; badges shimmer their accent), paper-token confetti 12 pieces, 1.2s, skippable, reduced-motion→static card.
