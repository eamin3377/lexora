# D07 — Dashboard, Profile, Settings, Marketing, Auth, Admin

## 1. Dashboard (`/dashboard`)

Grid: left 2/3 + right 1/3, 24px gaps.
- **Hero card (full-width, 160px):** greeting 25/650 ("Evening, Anika — the parser awaits.") + **Resume card** inside: lesson thumbnail (its animation's current frame, softly looping) + title + progress ring + "Continue" primary. If nothing in progress: "Start next: LR(0) items".
- **Pipeline heatmap card:** the 9-puck Living Pipeline, large (each puck 64px), liquid-filled by mastery; hovering shows per-track breakdown bars sliding out beneath (200ms). Blueprint pucks for unvisited stages.
- **Streak card (right):** flame 48px (grows/particles at 7/30/100 tiers) + calendar heat-dots (last 8 weeks, 10px dots, leaf intensity) + freeze tokens shown as 2 ice-cube chips + weekly XP sparkline.
- **Next-best row:** 3 suggestion cards (review due / challenge live / project milestone) chosen by mastery model, each with reason caption ("FOLLOW sets decaying — 4 min refresh").
- **Achievement teaser:** nearest badge at 80%+ progress with its progress ring, "2 more LL(1) exercises".
- Entrance: cards stagger-rise 60ms apart, heatmap liquid-fills after 200ms (once per session).

## 2. Progress (`/dashboard/progress`)

Full pipeline heatmap + per-track accordion: each track = mastery bar (segmented per module) + concept-level dots grid (12px, tooltip per concept) + time-invested stat + decay indicators (fading dots pulse gently amber). "Study transcript" export (the accumulated step-logs, PDF).

## 3. Certificates (`/dashboard/certificates`)

Earned: certificate cards 480×340 — Press Gold foil border (subtle angular gradient shift on pointer move, ±6° sheen — the one metallic effect in the product), guilloché of micro-ε at 6%, learner name in Cabinet Grotesk 31px, their capstone pipeline render as the artwork, verify URL + QR. Hover: card tilts ≤4° (perspective 1000) with the sheen tracking. Unearned: blueprint versions with requirement checklists.

## 4. Achievements (`/dashboard/achievements`)

Shelf metaphor: illustrated badge cards (120×160) on drawn wooden shelves; earned = full color + earn date; unearned = ink outline only; secret = a "?" card with a keyhole. Click: card enlarges center-stage (300ms) with rarity %, flavor text, and its earn animation replayable. Curated-shelf editing: drag 6 favorites to the top "display shelf" (FLIP).

## 5. Public profile (`/profile/:username`)

Header: avatar 96px in ink ring + name + level glyph chip (level 12 = gold Compiler seal) + streak + joined date. Display shelf (6 badges) → published projects grid → contribution heat-dots → "languages created" (project #11 REPLs embedded). Everything shareable; OG card = their pipeline heatmap.

## 6. Settings (`/settings`, 5 tabs)

Left tab rail 200px (Account / Editor / Accessibility / Notifications / Billing). Editor tab: live preview pane on right showing a code sample re-rendering as options change (font size slider drags smoothly, ligatures toggle flips the `->` glyph with a micro morph). Accessibility tab: reduced-motion toggle previews by pausing the page's own decorations *live*; contrast, transcript-always-on, keyboard-map viewer. Billing: plan cards + invoice table. All saves: optimistic with a small ink-pen check wiggle top-right.

## 7. Pricing (`/pricing`)

4 plan columns (Free/Pro/Edu/Teams), Pro elevated (e2, leaf top-band 6px, "most popular" wax seal). Monthly/annual toggle: prices roll-flip (200ms) + annual savings chip pops. Feature matrix below with category groups; checkmarks draw on scroll-entry (row-staggered). Edu column CTA: "Talk to us" → inline form expand. FAQ reuse. Footer CTA band.

## 8. About (`/about`)

Editorial page: manifesto typeset large (25/40) with two marker underlines; team cards with duotone portraits + each member's "favorite automaton" (a real mini-diagram, personal touch); timeline of the product story on an ink trail; the cast introduced formally (character sheet excerpts).

## 9. Auth screens

Centered card 440px on `sunrise`-washed paper with 2 drifting tokens. Logo animates its compile-in (1.4s) on first paint. Email/social buttons 48px; magic-link sent state: Lexi mails a paper plane (400ms, once). Signup preserves any tool state: a banner inside the card "your automaton is safe — it'll be here after" with a 64px thumbnail of their diagram (the emotional hook that converts).

## 10. Docs / Reference / Glossary

Docs: 3-col (nav 260 / prose 720 / toc 200). Reference: dense tables, sticky category headers, every regex operator row has a 80×32 inline mini-railroad. **Glossary:** A–Z rail; term cards each with a live micro-visualization (e.g., "ε-closure" card contains a 5-state playable mini-NFA); term pages cross-link to lesson + tool preloaded with a canonical example.

## 11. Classroom (Edu)

Instructor course page: roster table + assignment cards + **live session** launcher. Live mode: instructor's visualizer streams; student view has a "following 👁" chip; instructor can "spotlight" a student's state (300ms swap with attribution toast). Gradebook: matrix with AI pre-review chips (pending amber / approved leaf), bulk approve flow.

## 12. Admin

Utilitarian but on-system (paper chrome, denser 13px type, 8px paddings): content CMS (MDX editor + live lesson preview iframe), quiz bank table with concept-tag filters, challenge scheduler calendar, user lookup, AI-usage monitor (BarCharts, cost/day), feature flags with per-cohort toggles. No marketing polish budget spent here — clarity only.
