export interface PlaygroundFile {
  name: string;
  language: string;
  content: string;
}

export const DEFAULT_FILES: PlaygroundFile[] = [
  {
    name: "calc.l",
    language: "c",
    content: `%{
#include "calc.tab.h"
%}

DIGIT   [0-9]

%%
{DIGIT}+        { yylval = atoi(yytext); return NUM; }
[ \\t]           ; /* skip whitespace */
\\n              { return EOL; }
"+"             { return PLUS; }
"-"             { return MINUS; }
"*"             { return TIMES; }
"/"             { return DIV; }
"("             { return LPAREN; }
")"             { return RPAREN; }
.               { printf("unexpected: %s\\n", yytext); }
%%

int yywrap(void) { return 1; }
`,
  },
  {
    name: "calc.y",
    language: "c",
    content: `%{
#include <stdio.h>
int yylex(void);
void yyerror(const char *s) { fprintf(stderr, "error: %s\\n", s); }
%}

%token NUM EOL
%token PLUS MINUS TIMES DIV LPAREN RPAREN
%left PLUS MINUS
%left TIMES DIV

%%
input:
    /* empty */
  | input line
  ;

line:
    EOL
  | expr EOL        { printf("= %d\\n", $1); }
  ;

expr:
    NUM             { $$ = $1; }
  | expr PLUS expr  { $$ = $1 + $3; }
  | expr MINUS expr { $$ = $1 - $3; }
  | expr TIMES expr { $$ = $1 * $3; }
  | expr DIV expr   { $$ = $1 / $3; }
  | LPAREN expr RPAREN { $$ = $2; }
  ;
%%

int main(void) { return yyparse(); }
`,
  },
  {
    name: "main.c",
    language: "c",
    content: `#include <stdio.h>

/* Driver notes:
 * flex calc.l   -> lex.yy.c
 * bison -d calc.y -> calc.tab.c, calc.tab.h
 * gcc lex.yy.c calc.tab.c -o calc
 */

int main(void) {
    printf("build via the Run button - the toolchain does the rest\\n");
    return 0;
}
`,
  },
  {
    name: "input.txt",
    language: "plaintext",
    content: `3 + 4 * 2
(1 + 2) * (3 + 4)
100 / 5 - 7
`,
  },
  {
    name: "README.md",
    language: "markdown",
    content: `# Calculator — Flex + Bison

A classic infix calculator:

- **calc.l** — the scanner: numbers, operators, parens
- **calc.y** — the grammar with precedence (\`%left\`)
- **input.txt** — expressions fed to the compiled binary

Press **Run** (or \`Ctrl+Enter\`) to lex, parse, compile, and execute.
`,
  },
];
