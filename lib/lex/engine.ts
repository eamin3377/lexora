/* ────────────────────────────────────────────────────────────────
   A real (subset) Lex/Flex engine in TypeScript.
   Parses a .l spec, expands {NAME} definitions, compiles each rule
   pattern to an anchored JS RegExp, then scans input with maximal
   munch + rule priority, recording every decision for the debugger.
   ──────────────────────────────────────────────────────────────── */

export interface LexRule {
  index: number;
  pattern: string; // as written
  expanded: string; // after {NAME} expansion
  action: string;
  tokenType: string | null; // null = no return (skip / side effect)
  regex: RegExp | null;
  line: number; // line in spec
  error?: string;
}

export interface SpecDiagnostic {
  line: number;
  severity: "error" | "warning";
  message: string;
}

export interface LexSpec {
  definitions: { name: string; value: string; line: number; used: boolean }[];
  rules: LexRule[];
  diagnostics: SpecDiagnostic[];
}

export interface Candidate {
  ruleIndex: number;
  length: number;
}

export interface ScanStep {
  pos: number;
  line: number;
  col: number;
  candidates: Candidate[];
  winnerRule: number | null; // rule index
  length: number; // chars consumed this step (>=1)
  lexeme: string;
  tokenType: string | null; // emitted token, null if skipped
  error: boolean; // true when no rule matched
}

export interface LexToken {
  type: string;
  lexeme: string;
  line: number;
  col: number;
  step: number;
}

export interface ScanResult {
  steps: ScanStep[];
  tokens: LexToken[];
  errors: { line: number; col: number; char: string }[];
}

/* ── Spec parsing ───────────────────────────────────────────── */

function splitSections(source: string): { defs: string[]; rules: string[]; diag: SpecDiagnostic[] } {
  const lines = source.split("\n");
  const seps: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "%%") seps.push(i);
  }
  const diag: SpecDiagnostic[] = [];
  if (seps.length === 0) {
    diag.push({ line: 1, severity: "error", message: "missing %% separator — rules section not found" });
    return { defs: [], rules: lines, diag };
  }
  const defs = lines.slice(0, seps[0]);
  const rules = lines.slice(seps[0] + 1, seps[1] ?? lines.length);
  return { defs, rules, diag };
}

/** Expand {NAME} references using the definitions table (recursively). */
function expand(
  pattern: string,
  table: Map<string, { value: string; markUsed: () => void }>,
  depth = 0,
): string {
  if (depth > 10) return pattern;
  return pattern.replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (whole, name: string) => {
    const def = table.get(name);
    if (!def) return whole; // repetition like {2,3} or unknown name — leave as-is
    def.markUsed();
    return `(?:${expand(def.value, table, depth + 1)})`;
  });
}

/** Convert a (subset of) flex pattern syntax to a JS regex source string. */
function flexToJs(pattern: string): string {
  let out = "";
  let i = 0;
  while (i < pattern.length) {
    const ch = pattern[i];
    if (ch === "\\") {
      out += pattern.slice(i, i + 2);
      i += 2;
      continue;
    }
    if (ch === '"') {
      // quoted literal — escape every regex metacharacter inside
      let j = i + 1;
      let lit = "";
      while (j < pattern.length && pattern[j] !== '"') {
        if (pattern[j] === "\\") {
          lit += pattern[j + 1] ?? "";
          j += 2;
        } else {
          lit += pattern[j];
          j++;
        }
      }
      out += lit.replace(/[.*+?^${}()|[\]\\/]/g, (m) => `\\${m}`);
      i = j + 1;
      continue;
    }
    if (ch === "[") {
      // character class — copy through to the closing bracket
      let j = i + 1;
      if (pattern[j] === "^") j++;
      if (pattern[j] === "]") j++;
      while (j < pattern.length && pattern[j] !== "]") {
        if (pattern[j] === "\\") j++;
        j++;
      }
      out += pattern.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

const RULE_RE = /^(\S+)\s+(.*)$/;

export function parseSpec(source: string): LexSpec {
  const { defs, rules: ruleLines, diag } = splitSections(source);
  const diagnostics: SpecDiagnostic[] = [...diag];

  // definitions
  const definitions: LexSpec["definitions"] = [];
  let inBlock = false;
  for (let i = 0; i < defs.length; i++) {
    const line = defs[i];
    const trimmed = line.trim();
    if (trimmed.startsWith("%{")) {
      inBlock = true;
      continue;
    }
    if (trimmed.startsWith("%}")) {
      inBlock = false;
      continue;
    }
    if (inBlock || trimmed === "" || trimmed.startsWith("%")) continue;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+(.+)$/);
    if (m) {
      definitions.push({ name: m[1], value: m[2].trim(), line: i + 1, used: false });
    } else if (!line.startsWith(" ") && !line.startsWith("\t")) {
      diagnostics.push({
        line: i + 1,
        severity: "warning",
        message: `unrecognized definition line: "${trimmed.slice(0, 30)}"`,
      });
    }
  }

  const table = new Map(
    definitions.map((d) => [
      d.name,
      {
        value: d.value,
        markUsed: () => {
          d.used = true;
        },
      },
    ]),
  );

  // rules — offset: rules section starts after the defs + separator line
  const ruleLineOffset = defs.length + 1;
  const rules: LexRule[] = [];
  for (let i = 0; i < ruleLines.length; i++) {
    const raw = ruleLines[i];
    const trimmed = raw.trim();
    if (trimmed === "" || trimmed.startsWith("/*") || trimmed.startsWith("%{")) continue;
    // continuation of a multi-line action — skip lines that start with whitespace and have no pattern
    if (/^\s/.test(raw)) continue;
    const m = raw.match(RULE_RE);
    if (!m) continue;
    const [, pattern, actionRaw] = m;
    const action = actionRaw.trim();
    const specLine = ruleLineOffset + i + 1;

    const expanded = expand(pattern, table);
    const jsSource = flexToJs(expanded);

    let regex: RegExp | null = null;
    let error: string | undefined;
    try {
      regex = new RegExp(jsSource, "y");
    } catch (e) {
      error = e instanceof Error ? e.message : "invalid pattern";
      diagnostics.push({
        line: specLine,
        severity: "error",
        message: `rule ${rules.length + 1}: cannot compile pattern ${pattern} — ${error}`,
      });
    }

    const returnMatch = action.match(/return\s+([A-Za-z_][A-Za-z0-9_]*)\s*;?/);
    rules.push({
      index: rules.length,
      pattern,
      expanded,
      action,
      tokenType: returnMatch ? returnMatch[1] : null,
      regex,
      line: specLine,
      error,
    });
  }

  if (rules.length === 0) {
    diagnostics.push({ line: 1, severity: "error", message: "no rules found in rules section" });
  }

  for (const d of definitions) {
    if (!d.used) {
      diagnostics.push({
        line: d.line,
        severity: "warning",
        message: `definition ${d.name} is never used`,
      });
    }
  }

  return { definitions, rules, diagnostics };
}

/* ── Scanning ───────────────────────────────────────────────── */

export function scan(spec: LexSpec, input: string, maxSteps = 2000): ScanResult {
  const steps: ScanStep[] = [];
  const tokens: LexToken[] = [];
  const errors: ScanResult["errors"] = [];

  let pos = 0;
  let line = 1;
  let col = 1;

  const advance = (text: string) => {
    for (const ch of text) {
      if (ch === "\n") {
        line++;
        col = 1;
      } else {
        col++;
      }
    }
  };

  while (pos < input.length && steps.length < maxSteps) {
    const candidates: Candidate[] = [];
    for (const rule of spec.rules) {
      if (!rule.regex) continue;
      rule.regex.lastIndex = pos;
      const m = rule.regex.exec(input);
      if (m && m.index === pos && m[0].length > 0) {
        candidates.push({ ruleIndex: rule.index, length: m[0].length });
      }
    }

    if (candidates.length === 0) {
      const ch = input[pos];
      steps.push({
        pos,
        line,
        col,
        candidates: [],
        winnerRule: null,
        length: 1,
        lexeme: ch,
        tokenType: null,
        error: true,
      });
      errors.push({ line, col, char: ch });
      advance(ch);
      pos++;
      continue;
    }

    // maximal munch, then rule priority (lowest index wins ties)
    let winner = candidates[0];
    for (const c of candidates) {
      if (c.length > winner.length || (c.length === winner.length && c.ruleIndex < winner.ruleIndex)) {
        winner = c;
      }
    }

    const rule = spec.rules[winner.ruleIndex];
    const lexeme = input.slice(pos, pos + winner.length);

    steps.push({
      pos,
      line,
      col,
      candidates: candidates.sort((a, b) => a.ruleIndex - b.ruleIndex),
      winnerRule: winner.ruleIndex,
      length: winner.length,
      lexeme,
      tokenType: rule.tokenType,
      error: false,
    });

    if (rule.tokenType) {
      tokens.push({ type: rule.tokenType, lexeme, line, col, step: steps.length - 1 });
    }

    advance(lexeme);
    pos += winner.length;
  }

  return { steps, tokens, errors };
}

/* ── "AI" analysis: heuristics that read like a code review ─── */

export interface Suggestion {
  kind: "fix" | "improve" | "learn";
  title: string;
  detail: string;
}

export function analyze(spec: LexSpec, result: ScanResult | null): Suggestion[] {
  const out: Suggestion[] = [];

  // literal rule shadowed by an earlier broader rule
  for (let i = 0; i < spec.rules.length; i++) {
    const literal = spec.rules[i];
    if (!literal.regex || !/^"[^"]+"$/.test(literal.pattern)) continue;
    const text = literal.pattern.slice(1, -1);
    for (let j = 0; j < i; j++) {
      const earlier = spec.rules[j];
      if (!earlier.regex) continue;
      earlier.regex.lastIndex = 0;
      const m = earlier.regex.exec(text);
      if (m && m.index === 0 && m[0].length === text.length) {
        out.push({
          kind: "fix",
          title: `Rule ${i + 1} (${literal.pattern}) is shadowed by rule ${j + 1}`,
          detail: `Rule ${j + 1} (${earlier.pattern}) matches "${text}" with the same length and has higher priority. Move the literal rule above it — keywords must come before the identifier rule.`,
        });
        break;
      }
    }
  }

  // no whitespace handling
  const handlesWs = spec.rules.some((r) => /\\t|\\n| |\[ /.test(r.pattern) || r.pattern.includes("[ \\t]"));
  if (spec.rules.length > 0 && !handlesWs) {
    out.push({
      kind: "improve",
      title: "No whitespace rule detected",
      detail: 'Without a rule like `[ \\t]+  ;` every space reaches the fallback (or errors). Add an explicit skip rule — silence is a decision, make it visible.',
    });
  }

  // rules that never fired on this input
  if (result && result.steps.length > 0) {
    const winners = new Set(result.steps.map((s) => s.winnerRule));
    const idle = spec.rules.filter((r) => r.regex && !winners.has(r.index));
    if (idle.length > 0 && idle.length < spec.rules.length) {
      out.push({
        kind: "learn",
        title: `${idle.length} rule${idle.length > 1 ? "s" : ""} never matched this input`,
        detail: `Rule${idle.length > 1 ? "s" : ""} ${idle.map((r) => `${r.index + 1} (${r.pattern})`).join(", ")} won zero steps. Either the input never exercises ${idle.length > 1 ? "them" : "it"}, or an earlier rule always wins — check with the step debugger.`,
      });
    }
  }

  // scan errors
  if (result && result.errors.length > 0) {
    const first = result.errors[0];
    out.push({
      kind: "fix",
      title: `${result.errors.length} character${result.errors.length > 1 ? "s" : ""} matched no rule`,
      detail: `First unmatched character: "${first.char}" at ${first.line}:${first.col}. Add a catch-all rule like \`.  { printf("bad: %s\\n", yytext); }\` so errors are reported, not swallowed.`,
    });
  }

  // maximal munch teaching moment
  if (result) {
    const contested = result.steps.find(
      (s) => s.candidates.length > 1 && s.candidates.some((c) => c.length !== s.length),
    );
    if (contested) {
      const loser = contested.candidates.find((c) => c.length < contested.length);
      if (loser) {
        out.push({
          kind: "learn",
          title: "Maximal munch decided a contest for you",
          detail: `At step ${result.steps.indexOf(contested) + 1}, rule ${loser.ruleIndex + 1} matched ${loser.length} char(s) but rule ${(contested.winnerRule ?? 0) + 1} matched ${contested.length} — the longer match always wins, regardless of rule order.`,
        });
      }
    }
  }

  if (out.length === 0) {
    out.push({
      kind: "improve",
      title: "Spec looks clean",
      detail: "No shadowed rules, no unmatched input, whitespace handled. Try a nastier input — or open an exercise.",
    });
  }

  return out;
}
