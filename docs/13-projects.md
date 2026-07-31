# 13 — Real Projects

Guided builds of genuine artifacts in the Playground, with staged milestones, acceptance tests, and gallery publishing. Each project card: difficulty · est. hours · prerequisite lessons · tech (Flex/Bison/C) · what you'll have at the end.

## 1. Project Catalog (13)

| # | Project | Level | Core skills | Signature moment |
|---|---|---|---|---|
| 1 | **Calculator** | 🌱 Beginner | Lex+Yacc basics, precedence | First `3+4*2 → 11` from *your* parser |
| 2 | **Tokenizer** (standalone lexer for mini-JS) | 🌱 | Flex spec design, longest match | Your token stream in the Token Viewer |
| 3 | **JSON Parser** | 🌱🌿 | Recursive grammar, escaping | Parse a real 1MB JSON, render its tree |
| 4 | **Markdown Parser** | 🌿 | Line-based lexing, start conditions | Live HTML preview from your parser |
| 5 | **HTML Parser** | 🌿 | Tolerant parsing, error recovery | Survive real-world broken HTML |
| 6 | **SQL Parser** (SELECT subset) | 🌿 | Keywords vs identifiers, grammars at scale | Query AST → explain plan visualization |
| 7 | **Code Formatter** (for project 2's mini-JS) | 🌿 | AST traversal, pretty-printing | Before/after format diff |
| 8 | **Arithmetic Compiler** (expressions → stack VM) | 🌿🌳 | Codegen basics | Watch your bytecode execute step-by-step |
| 9 | **Interpreter** (tree-walking, variables/if/while/functions) | 🌳 | Environments, scopes, evaluation | Fibonacci runs in *your* language |
| 10 | **Static Analyzer** (unused vars, unreachable code, type lint) | 🌳 | Symbol tables, CFG, dataflow | Your analyzer flags real bugs in sample code |
| 11 | **Mini Programming Language** ("design your own") | 🌳 | Full frontend + interpreter, your syntax | Language spec page + shareable REPL |
| 12 | **Compiler Frontend** (subset-C → TAC) | 🌳🔥 | Semantic analysis, IR generation | Your TAC in the Pipeline Explorer |
| 13 | **Tiny C Compiler** (subset-C → RISC-V asm, runs in-browser) | 🔥 Capstone | Everything | Assembly you generated, executing — certificate project |

## 2. Guided Project Structure

Each project = **milestones** (4–8), each with: spec ("what must work") · starter state (locked scaffold + your-code regions) · acceptance test suite (runs in-browser; green wall fills with token-pop per pass) · stuck-ladder (hints → concept replay → AI mentor) · a *checkpoint diff* showing an idiomatic solution **after** the learner passes (compare, don't copy). Milestone completion animates the project's progress conveyor.

## 3. Project Gallery (`/gallery`)

Published projects get a generated showcase page: README, live demo (embedded runnable workspace, read-only fork-on-edit), pipeline visualization of their compiler, badges (tests passing, capstone). Social: stars, forks, "featured this week" (human-curated). Mini language projects (#11) get a special "Try my language" REPL embed — a strong viral artifact.

## 4. Assessment & certificates

Capstone (#13) + timed exam = **Lexora Compiler Engineering Certificate** (verifiable URL `/cert/:id`, LinkedIn-shareable card with the learner's own pipeline visualization as the artwork). Classroom variants let instructors swap acceptance tests and set deadlines.
