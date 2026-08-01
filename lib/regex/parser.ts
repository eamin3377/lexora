/* ────────────────────────────────────────────────────────────────
   Regex parser for the studio. Supports the educational core:
   literals, escapes (\d \w \s \. etc), character classes [a-z],
   the dot, grouping ( ), alternation |, and quantifiers * + ?.
   Produces an AST used by the explainer, the Thompson construction,
   and the backtracking matcher.
   ──────────────────────────────────────────────────────────────── */

export type RegexNode =
  | { type: "empty" }
  | { type: "char"; value: string }
  | { type: "any" }
  | { type: "class"; negated: boolean; body: string; raw: string }
  | { type: "concat"; parts: RegexNode[] }
  | { type: "alt"; options: RegexNode[] }
  | { type: "star"; child: RegexNode }
  | { type: "plus"; child: RegexNode }
  | { type: "opt"; child: RegexNode }
  | { type: "group"; child: RegexNode; index: number };

export interface ParseOutcome {
  ast: RegexNode | null;
  error: string | null;
}

const ESCAPE_CLASSES: Record<string, string> = {
  d: "0-9",
  D: "^0-9",
  w: "a-zA-Z0-9_",
  W: "^a-zA-Z0-9_",
  s: " \\t\\n\\r",
  S: "^ \\t\\n\\r",
};

export function parseRegex(source: string): ParseOutcome {
  let pos = 0;
  let groupCount = 0;

  const peek = () => source[pos];
  const eof = () => pos >= source.length;

  function parseAlt(): RegexNode {
    const options: RegexNode[] = [parseConcat()];
    while (!eof() && peek() === "|") {
      pos++;
      options.push(parseConcat());
    }
    return options.length === 1 ? options[0] : { type: "alt", options };
  }

  function parseConcat(): RegexNode {
    const parts: RegexNode[] = [];
    while (!eof() && peek() !== "|" && peek() !== ")") {
      parts.push(parseQuantified());
    }
    if (parts.length === 0) return { type: "empty" };
    return parts.length === 1 ? parts[0] : { type: "concat", parts };
  }

  function parseQuantified(): RegexNode {
    let atom = parseAtom();
    for (;;) {
      const c = peek();
      if (c === "*") {
        pos++;
        atom = { type: "star", child: atom };
      } else if (c === "+") {
        pos++;
        atom = { type: "plus", child: atom };
      } else if (c === "?") {
        pos++;
        atom = { type: "opt", child: atom };
      } else {
        return atom;
      }
    }
  }

  function parseAtom(): RegexNode {
    const c = peek();
    if (c === "(") {
      pos++;
      groupCount++;
      const index = groupCount;
      const inner = parseAlt();
      if (peek() !== ")") throw new Error(`expected ')' at position ${pos}`);
      pos++;
      return { type: "group", child: inner, index };
    }
    if (c === "[") return parseClass();
    if (c === ".") {
      pos++;
      return { type: "any" };
    }
    if (c === "\\") {
      pos++;
      if (eof()) throw new Error("dangling backslash at end of pattern");
      const e = source[pos++];
      if (ESCAPE_CLASSES[e]) {
        const body = ESCAPE_CLASSES[e];
        return {
          type: "class",
          negated: body.startsWith("^"),
          body: body.replace(/^\^/, ""),
          raw: `\\${e}`,
        };
      }
      const literals: Record<string, string> = { n: "\n", t: "\t", r: "\r" };
      return { type: "char", value: literals[e] ?? e };
    }
    if (c === "*" || c === "+" || c === "?") {
      throw new Error(`quantifier '${c}' at position ${pos} has nothing to repeat`);
    }
    if (c === ")") throw new Error(`unmatched ')' at position ${pos}`);
    if (c === undefined) throw new Error("unexpected end of pattern");
    pos++;
    return { type: "char", value: c };
  }

  function parseClass(): RegexNode {
    const start = pos;
    pos++; // [
    let negated = false;
    if (peek() === "^") {
      negated = true;
      pos++;
    }
    let body = "";
    if (peek() === "]") {
      body += "]";
      pos++;
    }
    while (!eof() && peek() !== "]") {
      if (peek() === "\\") {
        body += source.slice(pos, pos + 2);
        pos += 2;
      } else {
        body += source[pos++];
      }
    }
    if (eof()) throw new Error(`character class opened at position ${start} is never closed`);
    pos++; // ]
    return { type: "class", negated, body, raw: source.slice(start, pos) };
  }

  if (source.length === 0) return { ast: { type: "empty" }, error: null };
  try {
    const ast = parseAlt();
    if (!eof()) throw new Error(`unexpected '${peek()}' at position ${pos}`);
    return { ast, error: null };
  } catch (e) {
    return { ast: null, error: e instanceof Error ? e.message : "parse error" };
  }
}

/* ── Character matching for class/any/char nodes ───────────── */

export function classMatches(body: string, negated: boolean, ch: string): boolean {
  try {
    const re = new RegExp(`^[${negated ? "^" : ""}${body}]$`);
    return re.test(ch);
  } catch {
    return false;
  }
}

export function nodeMatchesChar(
  node: Extract<RegexNode, { type: "char" | "any" | "class" }>,
  ch: string,
): boolean {
  if (node.type === "char") return node.value === ch;
  if (node.type === "any") return ch !== "\n";
  return classMatches(node.body, node.negated, ch);
}

/* ── Explainer: AST → ordered human-readable breakdown ─────── */

export interface Explanation {
  fragment: string;
  depth: number;
  text: string;
}

export function nodeToString(node: RegexNode): string {
  switch (node.type) {
    case "empty":
      return "";
    case "char":
      return node.value === "\n" ? "\\n" : node.value === "\t" ? "\\t" : node.value;
    case "any":
      return ".";
    case "class":
      return node.raw;
    case "concat":
      return node.parts.map(nodeToString).join("");
    case "alt":
      return node.options.map(nodeToString).join("|");
    case "star":
      return `${nodeToString(node.child)}*`;
    case "plus":
      return `${nodeToString(node.child)}+`;
    case "opt":
      return `${nodeToString(node.child)}?`;
    case "group":
      return `(${nodeToString(node.child)})`;
  }
}

export function explain(node: RegexNode, depth = 0): Explanation[] {
  const frag = nodeToString(node);
  switch (node.type) {
    case "empty":
      return [{ fragment: "ε", depth, text: "the empty string — matches without consuming anything" }];
    case "char":
      return [{ fragment: frag, depth, text: `the literal character '${frag}'` }];
    case "any":
      return [{ fragment: ".", depth, text: "any single character (except newline)" }];
    case "class": {
      const desc = node.negated
        ? `any single character NOT in the set [${node.body}]`
        : `one character from the set [${node.body}]`;
      return [{ fragment: node.raw, depth, text: desc }];
    }
    case "concat":
      return [
        { fragment: frag, depth, text: `a sequence — each part must match, in order:` },
        ...node.parts.flatMap((p) => explain(p, depth + 1)),
      ];
    case "alt":
      return [
        {
          fragment: frag,
          depth,
          text: `an alternation — exactly one of ${node.options.length} branches matches:`,
        },
        ...node.options.flatMap((o) => explain(o, depth + 1)),
      ];
    case "star":
      return [
        {
          fragment: frag,
          depth,
          text: "zero or more repetitions (Kleene star) — greedy, tries the longest run first:",
        },
        ...explain(node.child, depth + 1),
      ];
    case "plus":
      return [
        { fragment: frag, depth, text: "one or more repetitions — like * but must match at least once:" },
        ...explain(node.child, depth + 1),
      ];
    case "opt":
      return [
        { fragment: frag, depth, text: "optional — matches once or not at all:" },
        ...explain(node.child, depth + 1),
      ];
    case "group":
      return [
        { fragment: frag, depth, text: `capture group #${node.index}:` },
        ...explain(node.child, depth + 1),
      ];
  }
}
