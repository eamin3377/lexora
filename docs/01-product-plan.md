# 01 — Product Plan

**Product name:** Lexora
**Tagline:** *See the machine think.*
**Category:** Interactive technical education / developer tools hybrid.

---

## 1. Mission

Make compiler design — historically the most feared course in computer science — the most **visually intuitive, hands-on, and joyful** subject to learn. Every abstract concept (automata, tokenization, parsing, code generation) becomes something a student can **watch, touch, step through, break, and rebuild**.

## 2. Vision

Become the world's default destination for learning language implementation:

- The **Khan Academy of compilers** for university students.
- The **Compiler Explorer + Figma** for practitioners: a shared, visual, linkable workspace where a lexer spec or grammar is a living artifact.
- Within 3 years: adopted by 200+ university courses, 1M+ registered learners, the canonical "regex/automata/parser visualizer" links shared on Stack Overflow and Reddit.

## 3. Target Audience

| Segment | Size | Needs |
|---|---|---|
| CS undergrads taking Compiler Design / Theory of Computation | Primary (millions/year globally, incl. large South Asian cohort) | Pass exams, finish lab assignments in Lex/Yacc, actually understand the material |
| Self-taught developers | Secondary | Build a language/DSL, understand tooling internals |
| University instructors & TAs | Multiplier | Classroom demos, autograded assignments, curriculum |
| Interview candidates | Tertiary | Regex, parsing, and language questions |
| Hobbyist language designers | Tertiary | Playground + real project scaffolds |

## 4. Learning Philosophy

1. **See before symbol.** Every formalism is introduced as an animation first, notation second. A DFA is a glowing machine eating characters before it is a 5-tuple.
2. **Manipulate to understand.** Every diagram is editable. Change the regex, watch the NFA rebuild live.
3. **One mental model, many zoom levels.** The compiler pipeline is the persistent spine of the whole platform; every lesson locates itself on it ("You are here: Lexical Analysis").
4. **Fail forward.** Errors are first-class content. The platform deliberately gets students to produce shift/reduce conflicts and explains them beautifully.
5. **Build the real thing.** Every track ends in a genuine artifact: real Flex/Bison/C compiled in-browser, not a toy simulation.
6. **Spaced, gamified reinforcement.** Streaks, review quizzes, and challenges resurface concepts at increasing intervals.

## 5. User Journey (macro)

```
Discover (SEO/shared visualizer link)
  → Play (no signup: Regex Playground / Automata Visualizer)
    → Aha moment (watch own regex become a DFA, < 60 seconds)
      → Sign up (save work, unlock roadmap)
        → Learn (guided roadmap: Regex → Automata → Lex → Grammar → Parsing → Full compiler)
          → Build (guided real projects: calculator → JSON parser → Tiny C)
            → Certify (assessed certificate)
              → Contribute (project gallery, community grammars)
                → Subscribe / bring classroom (Pro & Edu plans)
```

## 6. Learning Path (curriculum spine)

**Track A — Foundations:** Strings & languages → Regular expressions → Finite automata (NFA/DFA, subset construction, minimization) → Regex↔automata equivalence.
**Track B — Lexical Analysis:** Tokens & lexemes → Longest match & priority → Lex/Flex specs (definitions, rules, actions, states, macros) → Building real scanners.
**Track C — Syntax:** CFGs → Derivations & ambiguity → FIRST/FOLLOW → LL(1) → Shift-reduce → LR(0)/SLR/LALR/CLR → Bison/Yacc → Error recovery.
**Track D — Semantics & Backend:** ASTs → Symbol tables → Type checking → IR (three-address code) → Optimization (constant folding, DCE, CSE, loop opts) → Code generation → Assembly & linking.
**Track E — Capstone Projects:** 13 real projects from Calculator to Tiny C Compiler (see doc 13).

Each track = modules → lessons → checkpoint quiz → mini-project → challenge. Prerequisite graph enforced softly (recommended, never locked for explorers).

## 7. Feature Hierarchy

- **Tier 0 (the soul):** Animated visualizers — Regex/NFA/DFA, Lex Machine, Parser Theater, Pipeline. These are the product.
- **Tier 1 (the school):** Structured lessons, quizzes, exercises, progress, roadmap.
- **Tier 2 (the workshop):** VSCode-style Playground, in-browser terminal (flex/bison/gcc via WASM), real projects.
- **Tier 3 (the tutor):** AI explain/generate/debug/review across every surface.
- **Tier 4 (the community):** Gallery, sharing, leaderboards, classroom tools, certificates.

## 8. User Personas

**1. Anika, 20 — CS junior, Dhaka.** Compiler course this semester; lab uses Flex/Bison on Linux; struggles to visualize LR parsing. Needs: step-by-step LALR table animation, assignment-style exercises, works on a mid-range laptop and phone. Success: passes course, says "I finally get FOLLOW sets."
**2. Marcus, 27 — self-taught backend dev, Berlin.** Wants to build a DSL for config validation. Skips theory, lives in the Playground and projects. Needs: fast REPL-like feedback, AI to explain errors, exportable code. Success: ships his DSL, pays for Pro.
**3. Prof. Rivera, 45 — instructor, Texas.** Teaches 120 students; tired of environment-setup office hours. Needs: classroom dashboards, shareable visualizer states as lecture demos, autograded assignments. Success: adopts Lexora Edu for the department.
**4. Yuki, 33 — senior engineer, Tokyo.** Interview prep + curiosity about how TypeScript's parser works. Needs: dense reference, glossary, quick interactive refreshers. Success: weekly challenge streak, shares visualizations on social.

## 9. Roadmap (product-level)

- **Phase 1 — Wonder (MVP, months 0–4):** Home, Regex Playground, Automata Visualizer, Lex Machine, Track A+B lessons, accounts, progress, basic quizzes.
- **Phase 2 — Depth (months 4–8):** Parser Theater, Grammar Builder, FIRST/FOLLOW tools, Track C, Playground v1, terminal with flex+gcc (WASM), first 4 projects, XP/streaks.
- **Phase 3 — Power (months 8–12):** Full pipeline visualizer, IR/optimization/codegen lessons (Track D), Bison Builder, AI Tutor & Debugger, all 13 projects, certificates.
- **Phase 4 — Scale (year 2):** Community gallery, classrooms/Edu, leaderboards & weekly challenges, mobile refinements, localization (Bangla, Hindi, Spanish, Japanese first).

## 10. Competitive Landscape & Advantages

| Competitor | Gap Lexora exploits |
|---|---|
| regex101 / regexr | Regex only; no automata, no pedagogy, dated UI |
| Compiler Explorer (godbolt) | Experts only; zero teaching layer |
| University slides / Dragon Book | Static, intimidating, no interaction |
| JFLAP | Desktop Java, 2003 UX |
| Crafting Interpreters | Excellent book, but a book |
| YouTube (Neso etc.) | Passive; can't touch anything |

**Advantages:** (1) Only platform covering regex→executable end-to-end interactively. (2) Real toolchain in browser (Flex/Bison/GCC via WASM) — no setup. (3) Every visualizer state is a shareable URL → built-in viral loop. (4) AI tutor grounded in the exact visual state the student sees. (5) Handcrafted, premium design in a category full of academic-grade UI.

## 11. Unique Features (signature moves)

- **The Living Pipeline:** persistent mini compiler-pipeline in the nav; lights up to show where you are in the curriculum.
- **Scrub Time:** every animation has a timeline scrubber — step forward/back through lexing, subset construction, LR parsing like video editing.
- **Conflict Cinema:** shift/reduce & reduce/reduce conflicts rendered as a dramatic split-screen "two futures" animation.
- **Ghost Cursor:** in Lex lessons, a ghost cursor replays the maximal-munch scan over the student's own input.
- **Grammar Autopsy:** paste any grammar → ambiguity detection, FIRST/FOLLOW, parser-family compatibility report.
- **One-Click Classroom:** instructor shares a link; students join a live, synchronized visualizer session.

## 12. Monetization

- **Free forever:** all visualizers/playgrounds, Track A + half of B, community. (Growth engine — never paywall the shareable toys.)
- **Pro ($12/mo, $96/yr):** full curriculum, all projects, AI tutor (fair-use quota), certificates, private workspaces, unlimited saved states.
- **Edu (per-seat, $4/student/semester):** classroom dashboards, autograded assignments, LMS (LTI) integration, plagiarism-aware review.
- **Teams ($25/user/mo):** onboarding tool for companies building DSLs/tooling.
- **Later:** certification exam fee, sponsored challenges, marketplace rev-share for community courses.

## 13. Future Expansion

Interpreters & VMs track (bytecode, GC visualization) → LLVM track → "Design your own language" studio with community-published languages → mobile companion app for quizzes/streaks → localized curricula → live cohort courses → research partnerships (visualizations embedded in papers/textbooks).

## 14. Success Metrics

Activation: % of anonymous visitors reaching an "aha" interaction < 60s (target 40%). Learning: lesson completion rate (target 65%), quiz pass rate after ≤2 attempts (80%). Retention: W4 retention 25%, median streak 5 days. Virality: shared-state links per WAU (0.3). Revenue: 4% free→Pro conversion; 30 Edu departments in year 2.
