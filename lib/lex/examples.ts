export interface LexExample {
  id: string;
  title: string;
  description: string;
  spec: string;
  input: string;
}

export const EXAMPLES: LexExample[] = [
  {
    id: "calculator",
    title: "Calculator tokens",
    description: "Numbers, operators, parens — the classic first scanner.",
    spec: `DIGIT   [0-9]

%%
{DIGIT}+(\\.{DIGIT}+)?   { return NUM; }
"+"                     { return PLUS; }
"-"                     { return MINUS; }
"*"                     { return TIMES; }
"/"                     { return DIV; }
"("                     { return LPAREN; }
")"                     { return RPAREN; }
[ \\t\\n]+                ;
.                       { return ERROR; }
%%`,
    input: "3.14 + (42 * 7) / 2",
  },
  {
    id: "keywords",
    title: "Keywords vs identifiers",
    description: "Why rule order matters: keyword literals above the ID rule.",
    spec: `LETTER  [a-zA-Z_]
ALNUM   [a-zA-Z0-9_]

%%
"if"                { return IF; }
"else"              { return ELSE; }
"while"             { return WHILE; }
"return"            { return RETURN; }
{LETTER}{ALNUM}*    { return ID; }
[0-9]+              { return NUM; }
[=<>!]=?            { return OP; }
[;(){}]             { return PUNCT; }
[ \\t\\n]+            ;
.                   { return ERROR; }
%%`,
    input: "if (ifdef > 10) return elsewhere; else x = 1;",
  },
  {
    id: "maximal-munch",
    title: "Maximal munch duel",
    description: "== vs = — watch the longer match win every time.",
    spec: `%%
"=="        { return EQ; }
"="         { return ASSIGN; }
"<="        { return LE; }
"<"         { return LT; }
[0-9]+      { return NUM; }
[a-z]+      { return ID; }
[ \\t\\n]+    ;
.           { return ERROR; }
%%`,
    input: "a == b = c <= 10 < 20",
  },
  {
    id: "word-count",
    title: "Word counter",
    description: "wc in four rules — actions without returns just observe.",
    spec: `%%
[a-zA-Z]+     { return WORD; }
[0-9]+        { return NUMBER; }
\\n            { return NEWLINE; }
[ \\t]+        ;
.             { return PUNCT; }
%%`,
    input: "the quick brown fox\njumped over 2 lazy dogs",
  },
  {
    id: "strings-comments",
    title: "Strings & comments",
    description: "Greedy classes with exclusions — the [^...]* idiom.",
    spec: `%%
\\"[^\\"\\n]*\\"        { return STRING; }
"//"[^\\n]*          ;
[a-zA-Z_][a-zA-Z0-9_]*  { return ID; }
[0-9]+              { return NUM; }
[=+;]               { return OP; }
[ \\t\\n]+            ;
.                   { return ERROR; }
%%`,
    input: 'msg = "hello world"; // greeting\ncount = 42;',
  },
];

/* ── Exercises ─────────────────────────────────────────────── */

export interface LexExercise {
  id: string;
  title: string;
  brief: string;
  hint: string;
  input: string;
  expected: string[]; // expected token type sequence
  starterSpec: string;
}

export const EXERCISES: LexExercise[] = [
  {
    id: "ex-hex",
    title: "Hex numbers",
    brief: "Make 0x1F and 255 both lex as NUM, and identifiers as ID.",
    hint: "Hex first or decimal first? Try both — maximal munch may surprise you. Pattern: 0[xX][0-9a-fA-F]+",
    input: "0x1F 255 x0 dead 0xBEEF",
    expected: ["NUM", "NUM", "ID", "ID", "NUM"],
    starterSpec: `%%
[0-9]+                  { return NUM; }
[a-zA-Z_][a-zA-Z0-9_]*  { return ID; }
[ \\t\\n]+                ;
.                       { return ERROR; }
%%`,
  },
  {
    id: "ex-keywords",
    title: "Rescue the keywords",
    brief: "This spec lexes 'for' as ID. Fix it so for/in are KEYWORD, everything else ID.",
    hint: "Priority only breaks length ties — but literal rules must still appear before the identifier rule to win those ties.",
    input: "for x in list format",
    expected: ["KEYWORD", "ID", "KEYWORD", "ID", "ID"],
    starterSpec: `%%
[a-zA-Z_][a-zA-Z0-9_]*  { return ID; }
"for"                   { return KEYWORD; }
"in"                    { return KEYWORD; }
[ \\t\\n]+                ;
.                       { return ERROR; }
%%`,
  },
  {
    id: "ex-floats",
    title: "Integers vs floats",
    brief: "Split NUM into INT and FLOAT. 3.14 is FLOAT, 3 is INT — and 3. must not be FLOAT.",
    hint: "FLOAT needs digits on both sides of the dot: [0-9]+\\.[0-9]+ — and put it above INT.",
    input: "3.14 3 0.5 100 2.0",
    expected: ["FLOAT", "INT", "FLOAT", "INT", "FLOAT"],
    starterSpec: `%%
[0-9]+      { return INT; }
[ \\t\\n]+    ;
.           { return ERROR; }
%%`,
  },
];
