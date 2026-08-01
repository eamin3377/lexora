export type TokenType =
  | "keyword"
  | "identifier"
  | "number"
  | "string"
  | "operator"
  | "punctuation"
  | "comment"
  | "unknown";

export interface Token {
  type: TokenType;
  value: string;
  col: number;
}

const KEYWORDS = new Set([
  "let",
  "const",
  "var",
  "if",
  "else",
  "for",
  "while",
  "return",
  "function",
  "int",
  "float",
  "char",
  "void",
  "struct",
  "select",
  "from",
  "where",
  "true",
  "false",
  "null",
]);

const OPERATORS = /^(===|!==|==|!=|<=|>=|&&|\|\||\+\+|--|->|=>|[+\-*/%=<>!&|^~?])/;
const PUNCTUATION = /^[()[\]{},;:.]/;
const NUMBER = /^\d+(\.\d+)?([eE][+-]?\d+)?/;
const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*/;
const STRING = /^("([^"\\]|\\.)*"?|'([^'\\]|\\.)*'?)/;
const COMMENT = /^(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/;
const WHITESPACE = /^\s+/;

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let rest = source;
  let col = 0;

  while (rest.length > 0) {
    const ws = rest.match(WHITESPACE);
    if (ws) {
      col += ws[0].length;
      rest = rest.slice(ws[0].length);
      continue;
    }

    let matched: { type: TokenType; value: string } | null = null;

    const comment = rest.match(COMMENT);
    const str = rest.match(STRING);
    const num = rest.match(NUMBER);
    const ident = rest.match(IDENT);
    const op = rest.match(OPERATORS);
    const punct = rest.match(PUNCTUATION);

    if (comment) matched = { type: "comment", value: comment[0] };
    else if (str) matched = { type: "string", value: str[0] };
    else if (num) matched = { type: "number", value: num[0] };
    else if (ident)
      matched = {
        type: KEYWORDS.has(ident[0].toLowerCase()) ? "keyword" : "identifier",
        value: ident[0],
      };
    else if (op) matched = { type: "operator", value: op[0] };
    else if (punct) matched = { type: "punctuation", value: punct[0] };
    else matched = { type: "unknown", value: rest[0] };

    tokens.push({ ...matched, col });
    col += matched.value.length;
    rest = rest.slice(matched.value.length);
  }

  return tokens;
}
