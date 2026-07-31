# 14 — Gamification

Design stance: gamification rewards **understanding and consistency**, never grind. All mechanics map to real learning events; nothing pay-to-win; Focus Mode hides all of it for learners who find it noisy.

## 1. XP & Levels

XP sources: lesson complete (30), inline check first-try (5), quiz pass (50, −10 per retake floor 20), mini-project (100), challenge solve (75–200 by difficulty), review-queue session (15), helping in community (accepted answer 40). Hints deduct 2–5 from the earning event (never below 40%).
**Levels (12) themed as compiler stages:** 1 Character → 2 Lexeme → 3 Token → 4 Production → 5 Parser → 6 Symbol → 7 Type → 8 IR → 9 Optimizer → 10 Codegen → 11 Linker → **12 Compiler**. Level-up moment: full-screen (skippable) ink-draw of the new level glyph + paper-token confetti.

## 2. Streaks

Daily streak = any meaningful learning event (lesson section, review session, challenge attempt — ≥5 min). Flame icon in nav grows subtly at 7/30/100 days. **Streak freeze:** 1 earned per 7-day streak, max 2 banked (kindness beats punishment). Weekly recap email/card with the learner's pipeline heatmap.

## 3. Badges & Achievements (illustrated, ink & marker style)

Categories: *Mastery* (per-module ≥80% quiz: "Automaton Whisperer", "Maximal Muncher", "Conflict Resolver"), *Builder* (per project), *Explorer* ("visited every tool", "shared 5 states"), *Grit* ("passed after 5 attempts" — celebrating persistence), *Community* ("first accepted answer"), *Secret* (e.g., "Catastrophe" — triggered catastrophic backtracking on purpose; "Turing" — built a loop in project 11). Each badge is a hand-illustrated card with earn-date and rarity %; profile displays a curated shelf of 6.

## 4. Weekly Challenges & Leaderboard

Monday drop: one regex golf + one parsing puzzle + one build task; 7-day window. Leaderboards (`/community/leaderboard`): weekly (resets, fair for newcomers), all-time XP, per-track mastery, challenge ELO. League tiers (Paper → Ink → Marker → Press) with weekly promotion groups of 30 (Duolingo-proven). Anti-gaming: XP from repeatable actions is rate-capped daily; challenge solutions plagiarism-checked.

## 5. Certificates

Module certificates (per track) + the capstone **Compiler Engineering Certificate** (exam-gated, Pro). Verifiable `/cert/:id`, PDF + OG-image card featuring the learner's own capstone pipeline render. Classroom completion certificates co-brandable by institution.

## 6. Where it appears

Dashboard (streak, XP ring, next badge progress) · nav flame · lesson-complete moment (XP counts up with token-pops) · profile (public shelf) · weekly recap. Never interrupts inside tools/exams.
