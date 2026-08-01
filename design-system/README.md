# Lexora Design System — "Paper & Ink" v1.0

The complete, buildable design system. This is the contract between design and engineering: **`packages/ui` implements exactly this, Storybook story-by-story.** Extends `/docs/03-design-system.md` (vision) and `/design/*` (page specs) into implementation-grade detail.

| # | Document | Contents |
|---|---|---|
| 01 | [`01-tokens.md`](01-tokens.md) | Full token dictionary — primitives → semantic → component tokens, JSON-ready naming |
| 02 | [`02-typography.md`](02-typography.md) | Faces, ramp, styles catalog, code typography, math notation, i18n |
| 03 | [`03-components.md`](03-components.md) | 40+ components: anatomy, sizes, variants, states, keyboard & ARIA contracts |
| 04 | [`04-icons.md`](04-icons.md) | Inkline icon system: grid, strokes, compiler glyphs, animated icons |
| 05 | [`05-illustrations.md`](05-illustrations.md) | Marginalia system: cast, poses, spot art, textures, production workflow |
| 06 | [`06-motion.md`](06-motion.md) | Motion tokens, primitives, recipes, orchestration API surface |
| 07 | [`07-governance.md`](07-governance.md) | Naming, versioning, contribution, Figma/Storybook structure, QA gates |

## The five laws (inherited, enforced here)

1. **One light theme.** Tokens have no dark-mode dimension; the terminal palette is a component-scoped exception.
2. **Tokens or nothing.** No raw hex/px in product code — every value maps to a token in doc 01.
3. **Max two accents per view** (plus stage color-coding where content demands it).
4. **Motion is pedagogy** — UI motion fixed, pedagogical motion learner-clocked (doc 06).
5. **Accessibility is a component property**, not a page afterthought — every component ships its ARIA contract.
