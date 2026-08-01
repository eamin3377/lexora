# D06 — Projects, Practice, AI Pages, Community

## 1. Projects hub (`/projects`)

Header band: H1 "Build real things." + filter pills (level 🌱🌿🌳🔥, tech, hours). Grid 3× 384px cards, 24px gaps. **Project card (384×300):** artwork band 140px — each project has a bespoke marginalia illustration (calculator = Stax holding a `+` plate; Tiny C = the full machine cast assembled) on its accent-tinted paper; body: title 20/650 + one-line promise + meta row (level leaves · ⏱ hours · prereq chips) + progress conveyor (if started: a tiny horizontal conveyor 6px with milestone dots, packet at current milestone). Hover: artwork characters do their 2-frame idle; card lifts. Locked-by-prereq: blueprint style + "unlock via: LR Parsing →".

## 2. Project detail (`/projects/:slug`)

Hero row: artwork 480px + right column (title 31px, promise, meta, **Start/Resume** 52px primary, "view demo" ghost). Below: **Milestone rail** — vertical timeline, milestones as 64px cards chained by ink line: done = leaf double-ring + collapsed summary; current = expanded card with spec, acceptance-test list, "Open workspace →"; future = blueprint. **Acceptance-test wall (inside workspace right dock):** test rows 32px; pass = row sweeps leaf-100 + token-pop ✓ (60ms stagger when multiple pass at once — a green wave, the project system's dopamine moment); fail = coral with expandable diff. Milestone complete: the rail's packet advances with a 500ms glide + next milestone unfolds (accordion 400ms). **Checkpoint diff** (post-pass): side-by-side "yours / idiomatic" with sync scroll — presented as study material, header copy "Compare, don't copy — yours works."

## 3. Gallery (`/gallery`, showcase pages)

Masonry 3-col; showcase page: generated hero = the project's actual pipeline render on paper (server-rendered, doubles as OG image); README prose column; embedded read-only workspace (fork-on-edit); "Try my language" REPL embed for #11 projects (a mini-terminal device, 480×280). Stars: ★ button does a 3-particle spark on click; forks show lineage breadcrumb ("forked from @anika/calc").

## 4. Practice hub & exercises

Hub: 4 door cards (Exercises/Challenges/Quiz/Assignments). **Exercise sets:** left topic tree, right exercise list (rows 56px: title, concept chips, difficulty dots, done-check). Exercise screen = focused single-column 800px: prompt card → interactive answer area (same widget types as lesson checks) → hint ladder → "next" auto-advance with 3s ring. Infinite-practice footer: "Generate a similar one ✨" (AI-parameterized, labeled).

## 5. Challenges (`/practice/challenges`)

Weekly banner: 3 challenge cards (regex golf / parse puzzle / build task) with countdown (mono digits flip-roll each minute) + participant count live-ticking. Challenge screen: spec card + editor/widget + **ranked submit**: on submit, a full-width results reveal — your solution's metrics count up, then the leaderboard strip slides in showing your row inserting at rank position (row physically inserts with FLIP, neighbors shuffle — you *see* yourself beat rank 48). Golf mode result card: pattern in huge mono + char count + DFA state count + share button (generates the OG diagram card).

## 6. Quiz center & assignments

Quiz center: topic grid with mastery rings; exam mode entry = a deliberate "commitment" modal (timer, no-hints notice, begin button requires 600ms hold-to-confirm with a filling ring). Assignments: list rows with due-date chips (amber <48h, coral overdue); submission flow ends with a sealed-envelope animation (paper envelope folds over the work, wax stamp) — grading state shown as envelope states (sealed/opened/graded).

## 7. AI Tutor page (`/ai/tutor`)

Full-page version of the slide-over: conversation column 720px centered; left rail = session history; right rail = **context tray** showing exactly what the tutor can see (current artifacts as cards, toggleable — radical transparency as UX). Empty state: 4 starter prompt cards ("Explain FOLLOW sets like I'm 12", "Why does my regex match too much?"…) with Lexi peeking from the corner.

## 8. AI Debugger (`/ai/debugger`)

Two-panel: left = input zone (code drop area — drag a file in, it lands with a paper-settle animation — + error paste box); right = **diagnosis card** structure: header (error class chip + confidence) → What happened (2 lines) → Why (with inline mini-visual if applicable) → The fix (diff block, apply button) → Watch it (deep-link pill with a 160px preview thumbnail) → Root concept (lesson link). Card assembles section-by-section as the AI streams (each section slides in complete, never token-by-token jitter for structural parts).

## 9. Community (`/community`)

Feed: question cards (56px collapsed: title 16/600, tag chips, answer count in an accepting-ring badge — answered = double ring leaf, unanswered = single ring ink). Thread: prose + embedded live visualizer states (any shared link auto-unfurls into a playable embed 480px). Accepted answer: wrapped in a leaf-100 border with a "✓ solved" wax stamp. Editor supports `!/tools/...` slash-embeds. **Leaderboard:** league header (Paper/Ink/Marker/Press tiers as texture swatches), rows 56px with rank medallions (top 3 get hand-illustrated laurel variants); weekly promotion zone marked by a dashed line — rows near it get a subtle heat shimmer; your row is sticky bottom if off-screen.

## 10. Labs (`/labs`)

Scenario cards styled as case files (manila folder aesthetic, paper-2, tab corner): "Break this lexer" / "The ambiguous grammar" / "Register pressure". Opening a lab: folder-open animation (top flap rotates back 300ms) into the sandbox with the mission banner. Completion stamps the folder "SOLVED" (coral→leaf stamp).
