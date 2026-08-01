# Lexora — The Interactive Compiler Design Studio

> **Status: Pre-development. Specification phase only. No code exists in this repository yet — by design.**

Lexora is a premium, fully interactive learning platform that teaches **Compiler Design** — Regular Expressions, Automata, Lex/Flex, Parsing, Bison/Yacc, and full Compiler Construction — from absolute beginner to advanced, entirely through **visual, animated, hands-on experiences**.

Think of it as: *Duolingo's pedagogy × Stripe's polish × VSCode's power × Framer's motion — for compilers.*

---

## Repository Contents (Specification Phase)

| # | Document | Covers |
|---|----------|--------|
| 01 | [`docs/01-product-plan.md`](docs/01-product-plan.md) | Mission, vision, personas, learning philosophy, roadmap, monetization |
| 02 | [`docs/02-architecture-sitemap.md`](docs/02-architecture-sitemap.md) | Full sitemap, every page, navigation model, URL structure |
| 03 | [`docs/03-design-system.md`](docs/03-design-system.md) | "Paper & Ink" design language — color, type, motion, components |
| 04 | [`docs/04-home-page.md`](docs/04-home-page.md) | Landing page, section-by-section, with animation specs |
| 05 | [`docs/05-learning-experience.md`](docs/05-learning-experience.md) | Lesson anatomy, interactive learning system |
| 06 | [`docs/06-lex-visualization.md`](docs/06-lex-visualization.md) | The Lex Machine — world-class Lex/Flex visualization |
| 07 | [`docs/07-regex-visualization.md`](docs/07-regex-visualization.md) | Regex Lab — NFA/DFA, matching animation, builder, AI |
| 08 | [`docs/08-parser-visualization.md`](docs/08-parser-visualization.md) | Parser Theater — LL/LR/SLR/CLR/LALR, stacks, tables, trees |
| 09 | [`docs/09-compiler-pipeline.md`](docs/09-compiler-pipeline.md) | Animated end-to-end compiler pipeline |
| 10 | [`docs/10-playground.md`](docs/10-playground.md) | VSCode-style workspace specification |
| 11 | [`docs/11-terminal.md`](docs/11-terminal.md) | In-browser Linux terminal (flex, bison, gcc, make…) |
| 12 | [`docs/12-ai-features.md`](docs/12-ai-features.md) | AI Tutor, AI Debugger, generators, reviewers |
| 13 | [`docs/13-projects.md`](docs/13-projects.md) | Real compiler projects (calculator → Tiny C compiler) |
| 14 | [`docs/14-gamification.md`](docs/14-gamification.md) | XP, streaks, badges, leaderboards, certificates |
| 15 | [`docs/15-responsive-design.md`](docs/15-responsive-design.md) | Breakpoint strategy, mobile → ultra-wide |
| 16 | [`docs/16-performance-accessibility.md`](docs/16-performance-accessibility.md) | Performance budgets, a11y, SEO |
| 17 | [`docs/17-implementation-plan.md`](docs/17-implementation-plan.md) | Tech stack, folder architecture, component hierarchy, user flows, roadmap, risks |

## Ground Rules Established in This Spec

- **No dark mode.** One meticulously crafted light theme ("Paper & Ink").
- **No generic AI aesthetics.** No purple-on-black gradients, no Bootstrap grids, no stock hero layouts.
- **Everything animates with purpose.** Motion explains computation; it is pedagogy, not decoration.
- **Handcrafted feel.** Custom illustration language, editorial typography, tactile micro-interactions.

## UI/UX Design Documentation

Pixel-perfect design specs for every page — brand identity, logo system, exact layouts, animation choreography, and the papercraft 3D art direction — live in [`design/`](design/README.md) (D00–D08).

## Design System — "Paper & Ink" v1.0

The complete, buildable design system — token dictionary, typography, 40+ component specs with ARIA contracts, Inkline icons, Marginalia illustration system, motion API, and governance — lives in [`design-system/`](design-system/README.md) (DS-01–DS-07).

## Next Step

Await product owner approval of this specification, then proceed to Phase 0 of [`docs/17-implementation-plan.md`](docs/17-implementation-plan.md).
