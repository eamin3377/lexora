# 15 — Responsive Design

Principle: **degrade layout, never degrade understanding.** Every visualization has a defined small-screen behavior — nothing is simply hidden.

## 1. Breakpoints

| Name | Width | Targets |
|---|---|---|
| `xs` | < 480 | Phones (portrait) |
| `sm` | 480–767 | Phones (landscape), small tablets |
| `md` | 768–1023 | Tablets, split-screen laptops |
| `lg` | 1024–1439 | Laptops (primary persona hardware) |
| `xl` | 1440–1919 | Desktops |
| `2xl` | ≥ 1920 | Ultra-wide / external monitors |

## 2. Per-surface strategy

- **Home:** hero machine becomes a vertical compact variant on `xs/sm` (SVG, no 3D); scroll-scrub pipeline → tap-through stepper; masonry → single column.
- **Lessons:** designed mobile-first (reading + quizzes + watching animations are fully phone-viable — Anika revises on the bus). Right rail → bottom sheet; Code Lab → stacked editor-over-output with a tab switcher; typing-heavy labs show a gentle "nicer on a laptop" chip, but still work.
- **Visualizers (`md` down):** three-column layouts (Lex Machine, Parser Theater) collapse to a **stage-focused carousel**: the Machine is primary, Spec and Output become swipeable side sheets; the transport bar stays fixed (thumb-reachable, 44px targets); pinch-zoom + pan on all diagram canvases; scrubbing via the timeline (drag) replaces hover-sync (tap = what hover does on desktop, tooltips become tap-toasts).
- **Playground:** `md` = two zones (editor + one dock) with a panel switcher; `xs/sm` = read/run/inspect focus (edit works but is positioned as companion mode); terminal full-screen toggle.
- **Ultra-wide (`2xl`):** layouts widen by adding panels, not stretching prose (max 1200px content, 720px prose): Playground gains a permanently open right dock pair; Pipeline Explorer shows Compare mode side-by-side by default; lessons show the visualizer sticky beside prose instead of inline.

## 3. Input & platform details

Touch: all interactive diagram nodes ≥ 44px effective hit area; drag interactions (Regex Builder blocks, FIRST/FOLLOW chips) have tap-to-place fallback. Keyboard: full operability at every breakpoint. Hover-dependent info always has a tap/focus equivalent. iOS Safari quirks budgeted (OPFS support check → graceful fallback to memory FS with a save warning). Reduced data mode: `Save-Data` header disables autoplay loops and 3D.
