# 12 — AI Features

AI is a **tutor woven through every surface**, never a chatbot bolted on the side. Two design laws: (1) **Grounded** — every AI call receives the exact state the learner sees (code, visualizer state, error, lesson position); (2) **Show, don't just tell** — AI answers link back into visualizers whenever possible.

## 1. AI Tutor (`/ai/tutor` + slide-over everywhere)

Persistent slide-over panel on every page. Knows: current lesson/tool, its state, the learner's mastery profile, recent errors. Modes: *Explain* (concept at my level), *Socratic* (asks guiding questions instead of answering — default inside quizzes/challenges to prevent answer-leaking), *ELI5 / Exam-prep* register toggle. Responses render rich components: token chips, mini automata, table fragments — not walls of text. Every response footer: "Show me →" deep-link that reconstructs the discussed situation in the right visualizer.

## 2. AI Debugger (`/ai/debugger` + Problems panel + terminal ✨)

Input: code + toolchain error + (when available) the failing visual state. Output: structured diagnosis card — *What happened* / *Why* / *The fix* (as a reviewable diff) / *Watch it* (visualizer link) / *Root concept* (lesson link). Specializes in the classics: flex "unrecognized rule", bison shift/reduce walls, `undefined reference to yylex`, `%union` type mismatches, infinite ECHO loops.

## 3. Generators

| Feature | Input → Output | Verification (the differentiator) |
|---|---|---|
| **Regex Generator** | should/shouldn't-match examples → regex | Runs examples in-browser; shows pass/fail wall; auto-retries ≤3 |
| **Lex Rule Generator** (`/ai/rule-generator`) | "tokens for a config language with sections, keys, strings" → complete `.l` rules | Compiled with real Flex; sample input tokenized and displayed |
| **Bison Grammar Generator** | language sketch/examples → `.y` grammar + actions | Run through Bison; conflict report shown honestly |
| **Compiler Project Generator** | "build me a starting point for a stack-based calculator with variables" → full workspace scaffold | Full build must pass before delivery |
| **Grammar Explainer** | any CFG → per-production plain English + Autopsy panel data | Static analysis cross-check |

Rule: **generated artifacts are always machine-verified before being shown**, and always presented with an "understand this" annotated view — the platform teaches, it doesn't do homework silently.

## 4. Assessment AI

- **Quiz generation:** authors (and Pro users) generate topic quizzes from the lesson corpus; questions tagged to concepts; human-reviewed pool for graded contexts, instant-generated allowed only for self-practice.
- **Assignment review:** classroom submissions get AI pre-review — rubric scoring draft, per-line comments, misconception tags — *instructor approves before release*. Self-learners get it directly as "mentor feedback."
- **Exercise generation:** infinite practice variants parameterized from templates ("another LL(1) table exercise, slightly harder"), difficulty steered by mastery model.
- **Phase explanations:** every pipeline stage has "explain what just happened here" — AI narrates the specific artifact transition the learner is looking at.

## 5. Mistake-aware hints

The hint ladder's rung 3 is AI-personalized: it references the learner's *specific* wrong attempt ("you wrote `*` where you need `+` — watch what `*` does with empty input") with a one-click micro-animation of exactly that failure.

## 6. Guardrails, cost & trust

- Quotas: free 15 AI actions/day; Pro fair-use (~300/day); Edu pooled per classroom.
- Anti-cheat: Socratic-only inside exams/graded assignments; challenge answers never produced directly during active challenge windows.
- All AI output labeled; feedback thumbs feed an eval set; hallucination defense = verification-first design (section 3) + retrieval over the platform's own reference corpus for conceptual answers.
- Model strategy: provider-agnostic gateway (system prompt library per feature), small fast model for explain-hover, frontier model for debugging/generation; aggressive caching of common explanations (regex explainer results are cacheable by pattern hash).
