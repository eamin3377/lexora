import type { Dfa, Nfa } from "./automata";
import type { RegexNode } from "./parser";
import { explain, nodeToString, parseRegex } from "./parser";

/* ── Builder blocks: click to append ───────────────────────── */

export interface BuilderBlock {
  label: string;
  snippet: string;
  hint: string;
  group: "chars" | "classes" | "quantifiers" | "structure";
}

export const BUILDER_BLOCKS: BuilderBlock[] = [
  { label: "a", snippet: "a", hint: "literal character", group: "chars" },
  { label: ".", snippet: ".", hint: "any character", group: "chars" },
  { label: "\\d", snippet: "\\d", hint: "digit 0-9", group: "classes" },
  { label: "\\w", snippet: "\\w", hint: "word character", group: "classes" },
  { label: "\\s", snippet: "\\s", hint: "whitespace", group: "classes" },
  { label: "[a-z]", snippet: "[a-z]", hint: "lowercase letter", group: "classes" },
  { label: "[A-Z]", snippet: "[A-Z]", hint: "uppercase letter", group: "classes" },
  { label: "[^…]", snippet: "[^ab]", hint: "negated class", group: "classes" },
  { label: "*", snippet: "*", hint: "zero or more", group: "quantifiers" },
  { label: "+", snippet: "+", hint: "one or more", group: "quantifiers" },
  { label: "?", snippet: "?", hint: "optional", group: "quantifiers" },
  { label: "( )", snippet: "()", hint: "group", group: "structure" },
  { label: "|", snippet: "|", hint: "alternation", group: "structure" },
];

/* ── Generator presets ("describe → regex") ────────────────── */

export interface RegexPreset {
  id: string;
  name: string;
  keywords: string[];
  pattern: string;
  sample: string;
  note: string;
}

export const PRESETS: RegexPreset[] = [
  { id: "integer", name: "Integer", keywords: ["int", "integer", "number", "digits"], pattern: "-?\\d+", sample: "42 -17 0", note: "optional sign, one or more digits" },
  { id: "float", name: "Floating point", keywords: ["float", "decimal", "real"], pattern: "-?\\d+\\.\\d+", sample: "3.14 -0.5", note: "digits on both sides of the dot — 3. is not a float" },
  { id: "identifier", name: "Identifier", keywords: ["identifier", "variable", "name", "id"], pattern: "[a-zA-Z_]\\w*", sample: "count _tmp x9", note: "letter or underscore first, then word characters" },
  { id: "hex", name: "Hex number", keywords: ["hex", "hexadecimal", "0x"], pattern: "0[xX][0-9a-fA-F]+", sample: "0x1F 0XBEEF", note: "the 0x prefix keeps it from colliding with integers" },
  { id: "word-abb", name: "Ends in abb", keywords: ["abb", "ends", "classic"], pattern: "(a|b)*abb", sample: "aababb abb", note: "the dragon-book classic — 4-state DFA" },
  { id: "binary-even", name: "Even binary", keywords: ["binary", "even", "bits"], pattern: "(0|1)*0", sample: "10 100 0", note: "any bit string ending in 0" },
  { id: "quoted", name: "Quoted string", keywords: ["string", "quote", "quoted"], pattern: "\"[^\"]*\"", sample: '"hello" ""', note: "negated class keeps it on one line, no escapes" },
  { id: "spaces", name: "Whitespace run", keywords: ["space", "whitespace", "blank"], pattern: "[ \\t]+", sample: "\"   \"", note: "the skip rule every scanner needs" },
];

export function generateFromDescription(desc: string): RegexPreset | null {
  const q = desc.toLowerCase();
  let best: { preset: RegexPreset; score: number } | null = null;
  for (const p of PRESETS) {
    const score = p.keywords.filter((k) => q.includes(k)).length;
    if (score > 0 && (!best || score > best.score)) best = { preset: p, score };
  }
  return best?.preset ?? null;
}

/* ── Exercises: match all / reject all ─────────────────────── */

export interface RegexExercise {
  id: string;
  title: string;
  brief: string;
  mustMatch: string[];
  mustReject: string[];
  hint: string;
}

export const REGEX_EXERCISES: RegexExercise[] = [
  {
    id: "ex-abb",
    title: "The classic",
    brief: "Match every string of a's and b's that ends in abb.",
    mustMatch: ["abb", "aabb", "babb", "abababb"],
    mustReject: ["ab", "ba", "abba", "bbba"],
    hint: "Anything of a|b repeated, then the fixed tail: (a|b)*abb",
  },
  {
    id: "ex-float",
    title: "Real floats",
    brief: "Match decimals like 3.14 — but not 3. or .5 or plain 3.",
    mustMatch: ["3.14", "0.5", "123.456"],
    mustReject: ["3.", ".5", "3", "1.2.3"],
    hint: "Digits, a literal dot (escape it!), digits: \\d+\\.\\d+",
  },
  {
    id: "ex-id",
    title: "Identifiers",
    brief: "Match C identifiers: letter or _ first, then letters, digits, _.",
    mustMatch: ["x", "_tmp", "count9", "camelCase"],
    mustReject: ["9x", "hi-there", ""],
    hint: "[a-zA-Z_] then [a-zA-Z0-9_]* — the two-class idiom.",
  },
  {
    id: "ex-even-a",
    title: "Even number of a's",
    brief: "Match strings of a's and b's with an even count of a's (0 counts).",
    mustMatch: ["", "b", "aa", "aba", "baab"],
    mustReject: ["a", "ab", "aaa", "baa"],
    hint: "Pair up the a's: b*(ab*ab*)* — every a comes with a partner.",
  },
];

/* ── Quiz ──────────────────────────────────────────────────── */

export interface QuizQ {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const REGEX_QUIZ: QuizQ[] = [
  { id: "q1", prompt: "How many states does Thompson's construction produce for a single character?", options: ["1", "2", "3", "4"], answer: 1, explanation: "One start, one accept, one labeled transition between them." },
  { id: "q2", prompt: "a+ is exactly equivalent to…", options: ["a*", "aa*", "a?", "(a|ε)"], answer: 1, explanation: "One mandatory 'a' followed by zero or more." },
  { id: "q3", prompt: "The DFA for a regex, versus its NFA, is always…", options: ["Smaller", "The same size", "Deterministic — one active state at a time", "Faster to build"], answer: 2, explanation: "The defining property: exactly one state is active per input position. It can be exponentially larger." },
  { id: "q4", prompt: "Which pattern risks catastrophic backtracking?", options: ["(a+)+b", "a+b", "[ab]+", "a*b*"], answer: 0, explanation: "The nested quantifier (a+)+ creates exponentially many ways to split a run of a's when the b never comes." },
  { id: "q5", prompt: "In an NFA simulation, what does ε-closure compute?", options: ["Accepting states", "All states reachable without consuming input", "The minimal DFA", "The match length"], answer: 1, explanation: "Follow ε-edges transitively from the current set — free moves cost no input." },
];

/* ── Export: regex → flex rule + machine JSON ──────────────── */

export function toLexSnippet(pattern: string, tokenName = "TOKEN"): string {
  return `%%
${pattern.padEnd(Math.max(20, pattern.length + 2))}{ return ${tokenName}; }
[ \\t\\n]+${" ".repeat(Math.max(2, 20 - 9))};
.${" ".repeat(19)}{ printf("bad: %s\\n", yytext); }
%%`;
}

export function toExportJson(pattern: string, nfa: Nfa | null, dfa: Dfa | null): string {
  return JSON.stringify(
    {
      pattern,
      exportedAt: new Date().toISOString(),
      nfa: nfa
        ? {
            states: nfa.stateCount,
            start: nfa.start,
            accept: nfa.accept,
            transitions: nfa.edges.map((e) => ({ from: e.from, to: e.to, on: e.label })),
          }
        : null,
      dfa: dfa
        ? {
            states: dfa.states.map((s) => ({
              id: s.id,
              nfaStates: s.nfaStates,
              accepting: s.accepting,
            })),
            transitions: dfa.edges.map((e) => ({ from: e.from, to: e.to, on: e.label })),
          }
        : null,
    },
    null,
    2,
  );
}

/* ── AI assistant: question → grounded answer ──────────────── */

export interface AssistantMessage {
  role: "user" | "assistant";
  text: string;
}

export function askAssistant(
  question: string,
  ctx: { pattern: string; ast: RegexNode | null; nfa: Nfa | null; dfa: Dfa | null },
): string {
  const q = question.toLowerCase();
  const { pattern, ast, nfa, dfa } = ctx;

  if (!ast) {
    return "Your pattern doesn't parse yet — fix the syntax error first (check the red banner), then ask me again.";
  }

  if (q.includes("nfa") && (q.includes("how") || q.includes("state") || q.includes("built") || q.includes("work"))) {
    return nfa
      ? `Thompson's construction built ${nfa.stateCount} states and ${nfa.edges.length} transitions (${nfa.edges.filter((e) => !e.matcher).length} of them ε) for ${pattern}. Each operator contributes a tiny fragment: 2 states per character, ε-glue for concatenation, a fork-and-join for |, and a loop-with-bypass for *. Watch the NFA tab — every active state lights up as input is consumed, because an NFA can be in many states at once.`
      : "Build the NFA first by entering a valid pattern.";
  }

  if (q.includes("dfa") && (q.includes("how") || q.includes("state") || q.includes("built") || q.includes("differ") || q.includes("work"))) {
    return dfa
      ? `The subset construction turned the NFA into a DFA with ${dfa.states.length} states. Each DFA state IS a set of NFA states (hover a state to see which). Where the NFA simulation tracks a whole frontier of possibilities, the DFA has pre-computed every frontier — so it's always in exactly one state and never backtracks. That's why lexers compile regexes to DFAs.`
      : "Build the DFA first by entering a valid pattern.";
  }

  if (q.includes("backtrack") || q.includes("slow") || q.includes("catastrophic")) {
    return `Backtracking engines (like the one in the Backtracking tab) try alternatives one at a time and rewind on failure. The danger sign is a quantifier nested inside a quantifier — like (a+)+ — where a failing input forces exponentially many retries. DFAs are immune: one state, one transition per character, no rewinding. Try pattern (a|a)*b on input "aaaaaa" and watch the timeline explode.`;
  }

  if (q.includes("explain") || q.includes("mean") || q.includes("what does")) {
    const lines = explain(ast).slice(0, 8);
    return `Reading ${pattern} piece by piece:\n${lines
      .map((l) => `${"  ".repeat(l.depth)}• ${l.fragment} — ${l.text}`)
      .join("\n")}`;
  }

  if (q.includes("faster") || q.includes("optimi")) {
    return `Check the Optimizer tab — it flags nested quantifiers (the real performance killer), duplicate alternation branches, and redundant quantifier stacks. Rule of thumb: if two ways exist to match the same string, the backtracker will eventually try both.`;
  }

  if (q.includes("lex") || q.includes("flex") || q.includes("scanner")) {
    return `Use Export → Flex rule to drop ${pattern} into a .l spec. In a scanner it competes under maximal munch: the longest match wins, ties go to the earlier rule. Test the full spec in the Lex Machine playground.`;
  }

  // default: grounded summary
  return `Here's what I know about ${pattern}: it parses into ${nodeToString(ast) === pattern ? "the structure you see in the Explainer" : "a normalized form"}, compiles to an NFA with ${nfa?.stateCount ?? "?"} states, and determinizes to a DFA with ${dfa?.states.length ?? "?"} states. Ask me "how does the NFA work", "why is the DFA different", "explain the pattern", or "when does backtracking get slow".`;
}

/** Try-anywhere helper: does the pattern (anchored engine) match somewhere in text? */
export function findMatches(pattern: string, text: string): { start: number; end: number }[] {
  const { ast } = parseRegex(pattern);
  if (!ast) return [];
  // Use the native engine for match-finding in the playground (fast, battle-tested).
  try {
    const re = new RegExp(pattern, "g");
    const out: { start: number; end: number }[] = [];
    let m: RegExpExecArray | null;
    let guard = 0;
    while ((m = re.exec(text)) !== null && guard++ < 500) {
      if (m[0].length === 0) {
        re.lastIndex++;
        continue;
      }
      out.push({ start: m.index, end: m.index + m[0].length });
    }
    return out;
  } catch {
    return [];
  }
}
