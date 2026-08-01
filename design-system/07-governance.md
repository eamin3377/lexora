# DS-07 — Governance, Tooling & Workflow

## 1. Source-of-truth chain

`tokens.json` (Style Dictionary) → generated: CSS variables, Tailwind theme, Figma variables (via API sync), documentation tables. Hand-editing generated artifacts is forbidden. Component truth = this doc set + Storybook; Figma mirrors, never leads, after v1 lock.

## 2. Figma organization

Files: **01 Foundations** (tokens as variables, type styles, effects) · **02 Components** (mirrors DS-03 tiers, variants via component props) · **03 Icons & Illustration** (masters + pose sheets) · **04 Screens** (per `/design/02–07`, one page per surface) · **05 Motion boards** (choreography storyboards with timing annotations). Naming mirrors code: `Button/Primary/lg/hover`. Every screen frame links the spec doc section it implements.

## 3. Storybook structure

`Foundations/` (token showcases, type ramp, elevation) · `Primitives/` · `Containers/` · `Navigation/` · `Pedagogy/` (TransportBar, canvases, chips — with **trace-player harness**: canned engine traces to scrub) · `Composed/` · `Motion/` (recipe catalog with speed controls). Addons: a11y (axe), viewport (all 6 breakpoints), reduced-motion toggle, RTL toggle, pseudo-states.

## 4. Versioning & change control

SemVer on `@lexora/ui` + `tokens.json`. Patch = fixes; minor = additive tokens/variants; major = breaking rename/removal (requires codemod + deprecation cycle of one minor). CHANGELOG per release with visual diffs. Token additions need: use-case, contrast audit, approval by design lead + one engineer.

## 5. Contribution flow (new component)

Proposal issue (problem, why existing parts can't compose it) → spec PR to DS-03 (anatomy/sizes/variants/states/ARIA/tokens) → Figma master → implementation PR with full QA gates (DS-03 footer) → docs page + Storybook → release. Rule of three: a pattern must appear 3× in product specs before it becomes a system component (until then it lives in the app as a one-off composition).

## 6. Quality gates (CI-enforced)

`no-raw-colors` / `no-raw-durations` / `no-raw-z` lint · axe-core zero violations · visual regression (Playwright + Percy, all variant×state stories) · keyboard-path tests for interactive components · bundle budget per component (flag >8KB gz) · reduced-motion story present · token-coverage report (per cent of styles token-sourced, target 100%).

## 7. Adoption metrics

Track: token coverage %, component reuse ratio (system vs one-off), Figma-code drift audits (quarterly screenshot diff), a11y regression count, time-to-build for new screens (should fall release over release). The design system is succeeding when a new page is an assembly job measured in hours.
