# 02 — Website Architecture & Sitemap

## 1. Information Architecture Principles

- **Three front doors:** *Learn* (guided), *Tools* (instant playgrounds), *Build* (projects). Everything else supports these.
- **The pipeline is the map.** The compiler pipeline diagram doubles as global navigation for the curriculum.
- **Every tool state is a URL.** `?state=` encoded, shareable, embeddable (`/embed/*` routes).
- **Anonymous-first.** All playgrounds work logged out; auth gates only saving, progress, AI quota, and community posting.

## 2. Full Sitemap

```
lexora.dev
│
├── /                                   Home (landing)
├── /pricing                            Plans: Free / Pro / Edu / Teams
├── /about                              Story, team, pedagogy manifesto
├── /changelog                          Product updates (public)
│
├── /learn                              Learning hub (roadmap overview)
│   ├── /learn/roadmap                  Compiler Roadmap (interactive pipeline map)
│   ├── /learn/foundations              Track A: strings, regex, automata
│   │   └── /learn/foundations/:module/:lesson
│   ├── /learn/lexical                  Track B: tokens, Lex/Flex
│   ├── /learn/syntax                   Track C: grammars, parsing, Bison/Yacc
│   ├── /learn/semantics                Track D-1: AST, symbols, types
│   ├── /learn/backend                  Track D-2: IR, optimization, codegen
│   └── /learn/review                   Spaced-repetition review queue
│
├── /tools                              Tools hub (gallery of all playgrounds)
│   ├── /tools/regex                    Regex Playground (match, explain, test)
│   ├── /tools/regex/visualizer         Regex Visualizer (railroad + NFA/DFA)
│   ├── /tools/regex/generator          Regex Generator (AI: examples → regex)
│   ├── /tools/automata                 Automata Visualizer (draw/simulate NFA·DFA·minimize)
│   ├── /tools/lex                      Lex Playground (full Lex Machine, doc 06)
│   ├── /tools/lex/simulator            Lex Rule Simulator (rules vs. input, stepwise)
│   ├── /tools/tokens                   Token Explorer / Token Simulator
│   ├── /tools/grammar                  Grammar Builder (CFG editor + autopsy)
│   ├── /tools/parser                   Parser Playground / Simulator (doc 08)
│   ├── /tools/ast                      AST Visualizer
│   ├── /tools/bison                    Bison Builder (grammar → parser + tables)
│   ├── /tools/pipeline                 Compiler Pipeline Explorer (doc 09)
│   ├── /tools/ir                       Intermediate Code viewer (TAC, quads)
│   ├── /tools/optimizer                Optimization visualizer (before/after passes)
│   ├── /tools/codegen                  Code Generator explorer (IR → assembly)
│   └── /tools/compiler-builder         Compiler Builder (wizard: assemble a compiler)
│
├── /playground                         VSCode-style Workspace (doc 10)
│   └── /playground/:workspaceId        Saved workspaces
│
├── /projects                           Real Projects hub (doc 13)
│   ├── /projects/:slug                 Guided project (calculator, json-parser, tiny-c …)
│   └── /gallery                        Project Gallery (community showcases)
│
├── /practice                           Practice hub
│   ├── /practice/exercises             Exercise sets per topic
│   ├── /practice/challenges            Weekly & ranked challenges
│   ├── /practice/quiz                  Quiz center (topic quizzes, exam mode)
│   └── /practice/assignments           Assignments (self-serve + classroom-issued)
│
├── /ai                                 AI hub
│   ├── /ai/tutor                       AI Tutor (chat, grounded in current tool state)
│   ├── /ai/debugger                    AI Debugger (paste code/errors → visual diagnosis)
│   ├── /ai/rule-generator              Lex Rule Generator
│   └── /ai/regex-generator             Regex Generator (alias of /tools/regex/generator)
│
├── /labs                               Interactive Labs (scenario sandboxes, e.g. "break this lexer")
│
├── /community                          Forum: questions, show & tell, grammar exchange
│   └── /community/leaderboard          Leaderboards (weekly, all-time, per-track)
│
├── /docs                               Documentation (platform + toolchain guides)
├── /reference                          Reference: Lex/Flex, Bison, regex syntax tables, parser cheatsheets
├── /glossary                           A–Z compiler glossary (each term links to its visualizer)
│
├── /dashboard                          Learner dashboard (resume, streak, XP, next-up)
│   ├── /dashboard/progress             Progress: pipeline heatmap, per-track mastery
│   ├── /dashboard/certificates         Earned certificates (+ public verify URLs /cert/:id)
│   └── /dashboard/achievements         Badges & achievements
│
├── /profile/:username                  Public profile (badges, projects, streak)
├── /settings                           Account, editor prefs, keybindings, a11y, notifications, billing
│
├── /classroom                          Instructor space (Edu plan)
│   ├── /classroom/:id                  Course: roster, live sessions, assignments, grades
│   └── /classroom/:id/live             Synchronized live visualizer session
│
├── /admin                              Internal: CMS for lessons, quiz bank, challenge scheduler,
│                                       user management, AI-usage monitor, feature flags
│
├── /embed/:tool                        Chromeless embeddable visualizers (for blogs/LMS)
└── /auth (/login /signup /forgot)      Auth screens
```

## 3. Global Navigation Model

- **Top bar (light glass):** Logo · Learn · Tools ▾ (mega-menu grouped by pipeline stage) · Build · Practice · Community · ⌘K search · streak flame · avatar.
- **⌘K Command Palette:** jump to any lesson/tool/term; actions ("New workspace", "Explain selection").
- **The Living Pipeline strip** (on /learn pages): horizontal Source→Executable diagram; current stage glows; click any stage to jump.
- **Right rail (contextual):** on lessons — outline, AI tutor, glossary peek. On tools — docs panel, examples, share.

## 4. Cross-Linking Logic (everything connected)

- Glossary terms hover-preview mini-visualizations; click opens the relevant tool pre-loaded.
- Every lesson embeds live tools (same components as standalone tools, state-synced).
- Every tool has "Learn this →" linking back to its lesson, and "Practice →" to matching exercises.
- Projects reference the lessons they require; lessons suggest the project they unlock.
- AI Tutor is a slide-over available on every page, receiving the current page's state as context.

## 5. URL & State Conventions

- Kebab-case slugs; lesson URLs stable forever (bookmarkable syllabi).
- Tool state serialized to compressed base64 `?s=`; long states stored server-side → short link `/s/:id`.
- `/embed/*` accepts `?s=` + `readonly=1` + `theme=paper` (only theme).
