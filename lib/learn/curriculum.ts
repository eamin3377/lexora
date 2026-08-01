import type { Assignment, Chapter, Lesson, Track } from "./types";

/* ────────────────────────────────────────────────────────────────
   Full curriculum: 5 tracks → chapters → lessons with content + quiz
   ──────────────────────────────────────────────────────────────── */

const foundations: Chapter[] = [
  {
    id: "regex",
    title: "Regular Expressions",
    lessons: [
      {
        id: "strings-languages",
        title: "Strings, alphabets & languages",
        minutes: 12,
        xp: 40,
        summary: "The three words every compiler idea is built from.",
        content: [
          { kind: "p", text: "An alphabet Σ is just a finite set of symbols — {a, b}, ASCII, Unicode. A string is a finite sequence over Σ, and a language is any set of strings. That's it. Every fearsome-looking definition in this course reduces to these three words." },
          { kind: "code", lang: "text", code: "Σ = {a, b}\nstrings: ε, a, b, aa, ab, abb, ...\nL₁ = { all strings ending in \"abb\" }" },
          { kind: "callout", tone: "tip", title: "The empty string", text: "ε is the string of length zero. It is a string, not 'nothing' — the same way 0 is a number." },
          { kind: "list", items: ["Alphabet: finite symbol set", "String: finite sequence of symbols", "Language: a (possibly infinite) set of strings"] },
        ],
        quiz: [
          { id: "q1", prompt: "A language is…", options: ["A set of strings", "A grammar", "A finite automaton", "A single string"], answer: 0, explanation: "A language is defined simply as a set of strings over an alphabet." },
          { id: "q2", prompt: "What is ε?", options: ["An error token", "The string of length zero", "The empty language", "Any whitespace"], answer: 1, explanation: "ε is the empty string — a real string whose length is 0." },
        ],
      },
      {
        id: "regular-expressions",
        title: "Regular expressions, formally",
        minutes: 16,
        xp: 50,
        summary: "Three operators — union, concatenation, star — and nothing else.",
        content: [
          { kind: "p", text: "Formal regular expressions have exactly three operators: union (|), concatenation, and Kleene star (*). Everything else in PCRE — +, ?, character classes — is sugar over these three." },
          { kind: "code", lang: "regex", code: "(a|b)*abb   →  any string of a's and b's ending in abb\n(0|1)*0     →  even binary numbers" },
          { kind: "callout", tone: "info", title: "Precedence", text: "Star binds tightest, then concatenation, then union. a|bc* means a | (b(c*))." },
        ],
        quiz: [
          { id: "q1", prompt: "Which operator binds tightest?", options: ["Union |", "Concatenation", "Kleene star *", "They are equal"], answer: 2, explanation: "* binds tightest, then concatenation, then |." },
          { id: "q2", prompt: "a+ is equivalent to…", options: ["a*", "aa*", "a|a", "(a)"], answer: 1, explanation: "One-or-more is one 'a' followed by zero-or-more: aa*." },
        ],
      },
      {
        id: "nfa-construction",
        title: "Thompson's construction: regex → NFA",
        minutes: 18,
        xp: 60,
        summary: "Building an automaton one operator at a time.",
        content: [
          { kind: "p", text: "Thompson's construction turns any regex into an NFA by composing tiny machines: one fragment per operator, glued together with ε-transitions. The result always has one start state and one accept state." },
          { kind: "code", lang: "text", code: "a        →  ○ ─a→ ◎\nr|s      →  new start ─ε→ {r, s} ─ε→ new accept\nr*       →  loop back with ε, plus a bypass ε" },
          { kind: "callout", tone: "tip", title: "Why ε-transitions?", text: "They let fragments compose without rewiring their internals — the whole trick of the construction." },
        ],
        quiz: [
          { id: "q1", prompt: "Thompson NFAs always have…", options: ["No ε-transitions", "One start and one accept state", "A DFA equivalent of equal size", "At most 5 states"], answer: 1, explanation: "Each fragment exposes exactly one start and one accept state, so composition stays simple." },
        ],
      },
      {
        id: "dfa-conversion",
        title: "Subset construction: NFA → DFA",
        minutes: 20,
        xp: 60,
        summary: "Simulating all NFA paths at once, then freezing the simulation into states.",
        content: [
          { kind: "p", text: "A DFA state is a set of NFA states. Start with the ε-closure of the NFA start state; for each input symbol compute move + ε-closure; repeat until no new sets appear. Any set containing an NFA accept state becomes a DFA accept state." },
          { kind: "code", lang: "text", code: "A = ε-closure({0})\nB = ε-closure(move(A, a))\n... repeat until fixed point" },
          { kind: "callout", tone: "warn", title: "Exponential blowup", text: "In the worst case a DFA has 2ⁿ states for an n-state NFA. In practice, lexers stay small." },
        ],
        quiz: [
          { id: "q1", prompt: "A DFA state in subset construction represents…", options: ["One NFA state", "A set of NFA states", "A regex operator", "An input symbol"], answer: 1, explanation: "Each DFA state is exactly the set of NFA states the machine could be in." },
          { id: "q2", prompt: "Worst-case DFA size for an n-state NFA?", options: ["n", "n²", "2ⁿ", "n log n"], answer: 2, explanation: "There are 2ⁿ possible subsets of NFA states." },
        ],
      },
      {
        id: "minimization",
        title: "DFA minimization",
        minutes: 15,
        xp: 50,
        summary: "Merging states that can never be told apart.",
        content: [
          { kind: "p", text: "Two states are equivalent if no input string distinguishes them. Hopcroft's algorithm partitions states into accepting/non-accepting, then repeatedly splits groups whose members transition to different groups. The final partition is the minimal DFA — and it is unique." },
          { kind: "callout", tone: "info", title: "Canonical form", text: "The minimal DFA is unique up to state renaming — which gives a decision procedure for regex equivalence." },
        ],
        quiz: [
          { id: "q1", prompt: "The minimal DFA for a regular language is…", options: ["Not always computable", "Unique up to renaming", "Always smaller than the NFA", "Nondeterministic"], answer: 1, explanation: "Myhill–Nerode guarantees a unique minimal DFA up to isomorphism." },
        ],
      },
    ],
  },
];

const lexical: Chapter[] = [
  {
    id: "tokens",
    title: "Tokens & Scanning",
    lessons: [
      {
        id: "tokens-lexemes",
        title: "Tokens, lexemes & patterns",
        minutes: 12,
        xp: 40,
        summary: "The scanner's three-way vocabulary.",
        content: [
          { kind: "p", text: "A pattern is a rule (usually a regex). A lexeme is the actual matched text. A token is the classified pair the parser receives: (TYPE, lexeme). The scanner's whole job is turning a character stream into a token stream." },
          { kind: "code", lang: "c", code: "count = count + 1;\n// lexemes:  count  =  count  +  1  ;\n// tokens:   ID     EQ ID     PLUS NUM SEMI" },
        ],
        quiz: [
          { id: "q1", prompt: "The matched source text itself is the…", options: ["Token", "Pattern", "Lexeme", "Symbol"], answer: 2, explanation: "Lexeme = the actual characters; token = its classification." },
        ],
      },
      {
        id: "longest-match",
        title: "Longest match & rule priority",
        minutes: 14,
        xp: 50,
        summary: "Why 'ifdef' is one identifier, not 'if' + 'def'.",
        content: [
          { kind: "p", text: "Two disambiguation rules make lexing deterministic: maximal munch (always take the longest possible match) and rule priority (on equal length, the earlier rule in the spec wins). This is why 'ifdef' lexes as one identifier and why 'if' lexes as a keyword when the keyword rule is listed first." },
          { kind: "callout", tone: "warn", title: "The rewind", text: "Maximal munch may over-scan and have to rewind to the last accepting position — the scanner remembers it as it goes." },
        ],
        quiz: [
          { id: "q1", prompt: "\"ifdef\" with rules for 'if' and identifiers lexes as…", options: ["KEYWORD(if) + ID(def)", "One ID(ifdef)", "A lexical error", "Two identifiers"], answer: 1, explanation: "Maximal munch takes the longest match: the full identifier ifdef." },
          { id: "q2", prompt: "On two equal-length matches, Flex picks…", options: ["The later rule", "The earlier rule", "Random", "Both"], answer: 1, explanation: "Rule priority: the rule listed first in the spec wins ties." },
        ],
      },
      {
        id: "flex-specs",
        title: "Flex specs: definitions & rules",
        minutes: 18,
        xp: 60,
        summary: "Anatomy of a .l file, section by section.",
        content: [
          { kind: "p", text: "A Flex file has three sections separated by %%: definitions (names for regexes, C prologue), rules (pattern → action pairs), and user code. flex compiles it into a C scanner exposing yylex()." },
          { kind: "code", lang: "lex", code: "%{ #include \"tokens.h\" %}\nDIGIT [0-9]\n%%\n{DIGIT}+   { return NUM; }\n\"if\"       { return IF; }\n[a-z]+     { return ID; }\n%%\nint main() { while (yylex()); }" },
          { kind: "callout", tone: "tip", title: "yytext", text: "Inside an action, yytext points at the current lexeme and yyleng holds its length." },
        ],
        quiz: [
          { id: "q1", prompt: "Flex sections are separated by…", options: ["---", "%%", "###", "==="], answer: 1, explanation: "%% separates definitions, rules, and user code." },
        ],
      },
      {
        id: "start-conditions",
        title: "Start conditions & scanner states",
        minutes: 16,
        xp: 60,
        summary: "Mini-modes for comments, strings, and heredocs.",
        content: [
          { kind: "p", text: "Start conditions give the scanner modes: %x COMMENT declares an exclusive state; BEGIN(COMMENT) enters it; rules prefixed <COMMENT> only fire there. It's the standard way to lex block comments and string literals." },
          { kind: "code", lang: "lex", code: "%x COMMENT\n%%\n\"/*\"            BEGIN(COMMENT);\n<COMMENT>\"*/\"   BEGIN(INITIAL);\n<COMMENT>.|\\n   ; /* eat */" },
        ],
        quiz: [
          { id: "q1", prompt: "%x declares a start condition that is…", options: ["Inclusive", "Exclusive", "Deprecated", "Global"], answer: 1, explanation: "%x is exclusive: only <STATE>-prefixed rules apply inside it." },
        ],
      },
    ],
  },
];

const syntax: Chapter[] = [
  {
    id: "grammars",
    title: "Grammars",
    lessons: [
      {
        id: "cfg",
        title: "Context-free grammars",
        minutes: 15,
        xp: 50,
        summary: "Productions, derivations, and parse trees.",
        content: [
          { kind: "p", text: "A CFG is (terminals, nonterminals, productions, start symbol). A derivation repeatedly replaces a nonterminal by a production body; the derivation's shape is the parse tree. Ambiguity means one string has two parse trees — the enemy of every parser generator." },
          { kind: "code", lang: "text", code: "E → E + T | T\nT → T * F | F\nF → ( E ) | id" },
        ],
        quiz: [
          { id: "q1", prompt: "A grammar is ambiguous when…", options: ["It has left recursion", "Some string has two parse trees", "It uses ε-productions", "It has >10 rules"], answer: 1, explanation: "Ambiguity is defined by the existence of two distinct parse trees for one string." },
        ],
      },
      {
        id: "first-follow",
        title: "FIRST & FOLLOW sets",
        minutes: 22,
        xp: 70,
        summary: "The lookahead mathematics behind every table.",
        content: [
          { kind: "p", text: "FIRST(α) = terminals that can begin a string derived from α (plus ε if α can vanish). FOLLOW(A) = terminals that can appear immediately after A in some sentential form. Together they fill LL(1) tables and compute LR lookaheads." },
          { kind: "callout", tone: "tip", title: "Fixed-point", text: "Both sets are computed by iterating the rules until nothing changes — a classic fixed-point computation you'll meet again in dataflow analysis." },
        ],
        quiz: [
          { id: "q1", prompt: "FOLLOW(A) contains…", options: ["Terminals that begin A", "Terminals that can follow A", "All nonterminals", "Only $"], answer: 1, explanation: "FOLLOW captures what can legally appear right after A." },
          { id: "q2", prompt: "ε ∈ FIRST(α) means…", options: ["α is invalid", "α can derive the empty string", "α is a terminal", "α is ambiguous"], answer: 1, explanation: "ε appears in FIRST(α) exactly when α ⇒* ε." },
        ],
      },
      {
        id: "ll1",
        title: "LL(1) predictive parsing",
        minutes: 18,
        xp: 60,
        summary: "One token of lookahead, one table, zero backtracking.",
        content: [
          { kind: "p", text: "An LL(1) parser keeps a stack of grammar symbols and consults table M[A, a] to pick a production. Conflicts in the table mean the grammar isn't LL(1) — usually cured by eliminating left recursion and left-factoring." },
          { kind: "code", lang: "text", code: "E  → T E'\nE' → + T E' | ε\nT  → F T'\nT' → * F T' | ε\nF  → ( E ) | id" },
        ],
        quiz: [
          { id: "q1", prompt: "Left recursion breaks LL(1) because…", options: ["Tables get too big", "The parser loops without consuming input", "FIRST sets become empty", "It requires two stacks"], answer: 1, explanation: "A → Aα makes the top-down parser expand A forever without reading a token." },
        ],
      },
      {
        id: "lr-family",
        title: "The LR family & Bison",
        minutes: 24,
        xp: 80,
        summary: "Shift, reduce, and the tables Bison builds for you.",
        content: [
          { kind: "p", text: "LR parsers read left-to-right producing a rightmost derivation in reverse. They shift tokens onto a stack and reduce when a production body sits on top. LR(0) → SLR → LALR → LR(1) trade table size for precision; Bison builds LALR(1) by default." },
          { kind: "code", lang: "yacc", code: "%token NUM\n%left '+' '*'\n%%\nexpr: expr '+' expr\n    | expr '*' expr\n    | NUM ;" },
          { kind: "callout", tone: "warn", title: "Shift/reduce conflicts", text: "The classic dangling-else. Bison resolves them by shifting — and %left/%prec let you resolve them deliberately." },
        ],
        quiz: [
          { id: "q1", prompt: "Bison's default parser class is…", options: ["LL(1)", "LR(0)", "LALR(1)", "GLR"], answer: 2, explanation: "Bison generates LALR(1) tables by default." },
          { id: "q2", prompt: "A reduce happens when…", options: ["The stack is empty", "A production body is on top of the stack", "Lookahead is $", "An error occurs"], answer: 1, explanation: "Reduce replaces the matched body with its nonterminal." },
        ],
      },
    ],
  },
];

const semantics: Chapter[] = [
  {
    id: "semantic-analysis",
    title: "Semantic Analysis",
    lessons: [
      {
        id: "ast-symbols",
        title: "ASTs & symbol tables",
        minutes: 16,
        xp: 60,
        summary: "From parse tree to the tree you actually want.",
        content: [
          { kind: "p", text: "The AST drops the grammar's plumbing (parentheses, chain nonterminals) and keeps meaning. Symbol tables map names to declarations, with a scope stack so inner scopes shadow outer ones. Both are built during or right after parsing." },
          { kind: "code", lang: "text", code: "x = (1 + 2) * 3\n\nAssign\n├─ Var x\n└─ Mul\n   ├─ Add(1, 2)\n   └─ 3" },
        ],
        quiz: [
          { id: "q1", prompt: "ASTs differ from parse trees by…", options: ["Having more nodes", "Dropping syntactic plumbing", "Being built by the lexer", "Storing token positions only"], answer: 1, explanation: "The AST keeps structure and meaning, dropping grammar artifacts." },
        ],
      },
      {
        id: "type-checking",
        title: "Type checking",
        minutes: 18,
        xp: 60,
        summary: "Judgments, environments, and the rules of the game.",
        content: [
          { kind: "p", text: "A type checker walks the AST proving judgments Γ ⊢ e : τ — 'in environment Γ, expression e has type τ'. Each node kind has a rule; errors are just rules that fail to apply. Coercions insert conversion nodes as they go." },
          { kind: "callout", tone: "info", title: "Environments", text: "Γ is exactly your symbol table — the notation and the data structure are the same idea." },
        ],
        quiz: [
          { id: "q1", prompt: "Γ ⊢ e : τ reads as…", options: ["e produces value τ", "In env Γ, e has type τ", "Γ contains e and τ", "e reduces to τ"], answer: 1, explanation: "It is a typing judgment: under Γ, e is typed τ." },
        ],
      },
      {
        id: "three-address",
        title: "Three-address code",
        minutes: 15,
        xp: 50,
        summary: "The flat IR every optimizer speaks.",
        content: [
          { kind: "p", text: "TAC breaks expressions into instructions with at most one operator: t1 = b * c; t2 = a + t1. Control flow becomes labels and jumps. It's low enough to optimize, high enough to stay machine-independent." },
          { kind: "code", lang: "text", code: "a = b * c + d\n\nt1 = b * c\nt2 = t1 + d\na  = t2" },
        ],
        quiz: [
          { id: "q1", prompt: "Each TAC instruction has at most…", options: ["One operator", "Two labels", "Three operators", "One operand"], answer: 0, explanation: "Hence 'three-address': two sources, one destination, one op." },
        ],
      },
    ],
  },
];

const backend: Chapter[] = [
  {
    id: "opt-codegen",
    title: "Optimization & Codegen",
    lessons: [
      {
        id: "constant-folding",
        title: "Constant folding & local optimization",
        minutes: 14,
        xp: 50,
        summary: "Doing arithmetic at compile time.",
        content: [
          { kind: "p", text: "Folding evaluates constant expressions at compile time; propagation carries known values forward; dead-code elimination deletes what no longer matters. Applied inside a basic block these are 'local' — the gateway drugs of optimization." },
          { kind: "code", lang: "text", code: "x = 3 * 4 + y   →   x = 12 + y" },
        ],
        quiz: [
          { id: "q1", prompt: "Constant folding happens at…", options: ["Runtime", "Link time", "Compile time", "Load time"], answer: 2, explanation: "The compiler evaluates the constant expression itself." },
        ],
      },
      {
        id: "register-allocation",
        title: "Register allocation",
        minutes: 20,
        xp: 70,
        summary: "Graph coloring with real money on the line.",
        content: [
          { kind: "p", text: "Build an interference graph — an edge between two values live at the same time — then color it with k registers. Uncolorable nodes spill to memory. This single pass often decides more performance than every other optimization combined." },
          { kind: "callout", tone: "warn", title: "NP-hard, in practice fine", text: "Optimal coloring is NP-hard, but Chaitin-style heuristics color real programs almost perfectly." },
        ],
        quiz: [
          { id: "q1", prompt: "An edge in the interference graph means…", options: ["Two values share a register", "Two values are live simultaneously", "Two blocks are adjacent", "A spill occurred"], answer: 1, explanation: "Simultaneously-live values can't share a register, hence the edge." },
        ],
      },
      {
        id: "codegen",
        title: "Instruction selection & the final mile",
        minutes: 18,
        xp: 70,
        summary: "From IR to real instructions your CPU will run.",
        content: [
          { kind: "p", text: "Instruction selection tiles the IR tree with machine instructions; scheduling orders them around pipeline hazards; then assembly, linking, and — finally — an executable. The journey that started with a regex ends with bytes the CPU fetches." },
          { kind: "code", lang: "asm", code: "t1 = b * c      imul  eax, [b], [c]\na  = t1 + d     add   eax, [d]\n                mov   [a], eax" },
        ],
        quiz: [
          { id: "q1", prompt: "Instruction selection is often modeled as…", options: ["Graph coloring", "Tree tiling", "Sorting", "Hashing"], answer: 1, explanation: "Cover the IR tree with tiles, each tile = one machine instruction pattern." },
        ],
      },
    ],
  },
];

export const TRACKS: Track[] = [
  { id: "foundations", title: "Foundations", accent: "leaf", tagline: "Regex & automata", description: "Strings, languages, regular expressions, and the automata that recognize them — the mathematical bedrock of every scanner.", chapters: foundations },
  { id: "lexical", title: "Lexical Analysis", accent: "marigold", tagline: "Scanners & Flex", description: "Turn character streams into token streams: maximal munch, rule priority, and real Flex specifications.", chapters: lexical },
  { id: "syntax", title: "Syntax & Parsing", accent: "cobalt", tagline: "Grammars & Bison", description: "Context-free grammars, FIRST/FOLLOW, LL(1) prediction, and the LR machinery inside Bison.", chapters: syntax },
  { id: "semantics", title: "Semantics & IR", accent: "orchid", tagline: "Types & TAC", description: "ASTs, symbol tables, type judgments, and the flat intermediate code optimizers love.", chapters: semantics },
  { id: "backend", title: "Optimization & Codegen", accent: "coral", tagline: "The final mile", description: "Folding, register allocation by graph coloring, instruction selection — IR to executable.", chapters: backend },
];

export const ASSIGNMENTS: Assignment[] = [
  { id: "a-regex-lab", trackId: "foundations", title: "Regex Lab: design 5 languages", description: "Write regexes for five specified languages and prove each with accepted/rejected examples in the visualizer.", xp: 120, due: "Aug 8" },
  { id: "a-word-count", trackId: "lexical", title: "Build wc in Flex", description: "A Flex spec that counts lines, words, and characters — matching coreutils wc on the provided corpus.", xp: 150, due: "Aug 15" },
  { id: "a-calc-parser", trackId: "syntax", title: "Calculator with Bison", description: "Grammar with precedence for + - * / ( ), evaluated on the fly. Must pass the 40 hidden expression tests.", xp: 200, due: "Aug 22" },
  { id: "a-typechecker", trackId: "semantics", title: "Mini type checker", description: "Implement the judgment rules for a tiny expression language: ints, bools, let-bindings, and functions.", xp: 200, due: "Aug 29" },
  { id: "a-tiny-compiler", trackId: "backend", title: "Capstone: Tiny C compiler", description: "Lexer, parser, TAC, constant folding, and x86 output for a C subset. The whole pipeline, yours.", xp: 400, due: "Sep 12" },
];

/* ── Lookup helpers ─────────────────────────────────────────── */

export interface LessonRef {
  track: Track;
  chapter: Chapter;
  lesson: Lesson;
  index: number; // flat index within track
}

export function getTrack(trackId: string): Track | undefined {
  return TRACKS.find((t) => t.id === trackId);
}

export function flatLessons(track: Track): Lesson[] {
  return track.chapters.flatMap((c) => c.lessons);
}

export function findLesson(trackId: string, lessonId: string): LessonRef | undefined {
  const track = getTrack(trackId);
  if (!track) return undefined;
  let index = 0;
  for (const chapter of track.chapters) {
    for (const lesson of chapter.lessons) {
      if (lesson.id === lessonId) return { track, chapter, lesson, index };
      index++;
    }
  }
  return undefined;
}

export function findLessonById(lessonId: string): LessonRef | undefined {
  for (const track of TRACKS) {
    const ref = findLesson(track.id, lessonId);
    if (ref) return ref;
  }
  return undefined;
}

export function siblingLessons(ref: LessonRef): { prev?: Lesson; next?: Lesson } {
  const all = flatLessons(ref.track);
  return { prev: all[ref.index - 1], next: all[ref.index + 1] };
}

export function trackProgress(track: Track, completed: string[]): number {
  const all = flatLessons(track);
  if (all.length === 0) return 0;
  const done = all.filter((l) => completed.includes(l.id)).length;
  return Math.round((done / all.length) * 100);
}

export const TOTAL_LESSONS = TRACKS.reduce((n, t) => n + flatLessons(t).length, 0);
