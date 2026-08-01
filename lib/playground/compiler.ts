import type { PlaygroundFile } from "./files";

export type Severity = "error" | "warning" | "info";

export interface Diagnostic {
  file: string;
  line: number;
  column: number;
  severity: Severity;
  message: string;
  source: string; // flex | bison | gcc
}

export interface TerminalLine {
  kind: "cmd" | "out" | "err" | "ok";
  text: string;
}

export interface RunResult {
  ok: boolean;
  diagnostics: Diagnostic[];
  terminal: TerminalLine[];
  output: string[];
  consoleLines: { level: "log" | "warn" | "error"; text: string }[];
}

/* ── Tiny static checks that produce believable diagnostics ── */

function checkSections(file: PlaygroundFile, tool: string): Diagnostic[] {
  const separators = file.content.split("\n").filter((l) => l.trim() === "%%").length;
  if (separators >= 1) return [];
  return [
    {
      file: file.name,
      line: 1,
      column: 1,
      severity: "error",
      message: `missing %% section separator — a ${tool} spec needs rules section`,
      source: tool,
    },
  ];
}

function checkBraces(file: PlaygroundFile, source: string): Diagnostic[] {
  const diags: Diagnostic[] = [];
  let depth = 0;
  const lines = file.content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let inString = false;
    let stringStart = -1;
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      const prev = j > 0 ? line[j - 1] : "";
      if (ch === '"' && prev !== "\\") {
        if (!inString) {
          inString = true;
          stringStart = j;
        } else {
          inString = false;
        }
        continue;
      }
      if (inString) continue;
      if (ch === "{") depth++;
      if (ch === "}") depth--;
      if (depth < 0) {
        diags.push({
          file: file.name,
          line: i + 1,
          column: j + 1,
          severity: "error",
          message: "unmatched closing brace '}'",
          source,
        });
        depth = 0;
      }
    }
    if (inString) {
      diags.push({
        file: file.name,
        line: i + 1,
        column: stringStart + 1,
        severity: "warning",
        message: "string literal not terminated on this line",
        source,
      });
    }
  }
  if (depth > 0) {
    diags.push({
      file: file.name,
      line: lines.length,
      column: 1,
      severity: "error",
      message: `${depth} unclosed brace${depth > 1 ? "s" : ""} '{' at end of file`,
      source,
    });
  }
  return diags;
}

function checkTokensDeclared(lexFile: PlaygroundFile, yaccFile: PlaygroundFile): Diagnostic[] {
  const declared = new Set<string>();
  for (const line of yaccFile.content.split("\n")) {
    const m = line.match(/^%token\s+(.+)$/);
    if (m) m[1].split(/\s+/).forEach((t) => t && declared.add(t));
  }
  const diags: Diagnostic[] = [];
  const lines = lexFile.content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/return\s+([A-Z][A-Z0-9_]*)\s*;/);
    if (m && declared.size > 0 && !declared.has(m[1])) {
      diags.push({
        file: lexFile.name,
        line: i + 1,
        column: lines[i].indexOf(m[1]) + 1,
        severity: "warning",
        message: `token ${m[1]} is returned by the scanner but not declared with %token in ${yaccFile.name}`,
        source: "bison",
      });
    }
  }
  return diags;
}

/* ── Expression evaluator so the "program" produces real output ── */

function evaluateLine(expr: string): { value?: number; error?: string } {
  const tokens = expr.match(/\d+|[+\-*/()]|\S/g) ?? [];
  let pos = 0;

  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  function parseExpr(): number {
    let v = parseTerm();
    while (peek() === "+" || peek() === "-") {
      const op = next();
      const r = parseTerm();
      v = op === "+" ? v + r : v - r;
    }
    return v;
  }
  function parseTerm(): number {
    let v = parseFactor();
    while (peek() === "*" || peek() === "/") {
      const op = next();
      const r = parseFactor();
      if (op === "/") {
        if (r === 0) throw new Error("division by zero");
        v = Math.trunc(v / r);
      } else {
        v = v * r;
      }
    }
    return v;
  }
  function parseFactor(): number {
    const t = next();
    if (t === "(") {
      const v = parseExpr();
      if (next() !== ")") throw new Error("expected ')'");
      return v;
    }
    if (t === "-") return -parseFactor();
    if (t !== undefined && /^\d+$/.test(t)) return parseInt(t, 10);
    throw new Error(`syntax error near '${t ?? "end of line"}'`);
  }

  try {
    const value = parseExpr();
    if (pos < tokens.length) throw new Error(`syntax error near '${tokens[pos]}'`);
    return { value };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "syntax error" };
  }
}

/* ── The simulated toolchain run ─────────────────────────────── */

export function runToolchain(files: PlaygroundFile[]): RunResult {
  const lex = files.find((f) => f.name.endsWith(".l"));
  const yacc = files.find((f) => f.name.endsWith(".y"));
  const input = files.find((f) => f.name === "input.txt");

  const diagnostics: Diagnostic[] = [];
  const terminal: TerminalLine[] = [];
  const output: string[] = [];
  const consoleLines: RunResult["consoleLines"] = [];

  // flex
  if (lex) {
    terminal.push({ kind: "cmd", text: `flex ${lex.name}` });
    const d = [...checkSections(lex, "flex"), ...checkBraces(lex, "flex")];
    diagnostics.push(...d);
    if (d.some((x) => x.severity === "error")) {
      terminal.push({
        kind: "err",
        text: `${lex.name}:${d[0].line}: ${d[0].message}`,
      });
    } else {
      terminal.push({ kind: "out", text: "→ lex.yy.c generated" });
    }
  } else {
    terminal.push({ kind: "err", text: "flex: no .l file in workspace" });
    diagnostics.push({
      file: "workspace",
      line: 1,
      column: 1,
      severity: "error",
      message: "no scanner spec (.l) found",
      source: "flex",
    });
  }

  // bison
  if (yacc) {
    terminal.push({ kind: "cmd", text: `bison -d ${yacc.name}` });
    const d = checkBraces(yacc, "bison");
    if (lex) d.push(...checkTokensDeclared(lex, yacc));
    diagnostics.push(...d);
    const errs = d.filter((x) => x.severity === "error");
    if (errs.length > 0) {
      terminal.push({ kind: "err", text: `${yacc.name}:${errs[0].line}: ${errs[0].message}` });
    } else {
      terminal.push({ kind: "out", text: "→ calc.tab.c, calc.tab.h generated" });
      const warns = d.filter((x) => x.severity === "warning");
      for (const w of warns.slice(0, 2)) {
        terminal.push({ kind: "err", text: `warning: ${w.message}` });
      }
    }
  }

  const hasErrors = diagnostics.some((d) => d.severity === "error");

  // gcc
  if (!hasErrors) {
    terminal.push({ kind: "cmd", text: "gcc lex.yy.c calc.tab.c -o calc" });
    terminal.push({ kind: "out", text: "→ calc" });
  }

  // run
  if (!hasErrors) {
    terminal.push({ kind: "cmd", text: "./calc < input.txt" });
    const lines = (input?.content ?? "").split("\n").filter((l) => l.trim());
    consoleLines.push({ level: "log", text: `scanner initialized · ${lines.length} line(s) of input` });
    for (const line of lines) {
      const result = evaluateLine(line.trim());
      if (result.error) {
        output.push(`error: ${result.error}`);
        terminal.push({ kind: "err", text: `error: ${result.error}` });
        consoleLines.push({ level: "error", text: `yyerror: ${result.error} in "${line.trim()}"` });
        diagnostics.push({
          file: "input.txt",
          line: (input?.content.split("\n").indexOf(line) ?? 0) + 1,
          column: 1,
          severity: "error",
          message: result.error,
          source: "calc",
        });
      } else {
        output.push(`= ${result.value}`);
        terminal.push({ kind: "out", text: `= ${result.value}` });
        consoleLines.push({
          level: "log",
          text: `reduce: expr EOL → printf("= %d") · ${line.trim()} = ${result.value}`,
        });
      }
    }
    terminal.push({ kind: "ok", text: "process exited with code 0" });
    consoleLines.push({ level: "log", text: "yyparse returned 0" });
  } else {
    terminal.push({ kind: "err", text: "build failed — see Problems" });
    consoleLines.push({ level: "error", text: `build aborted with ${diagnostics.filter((d) => d.severity === "error").length} error(s)` });
  }

  return { ok: !hasErrors, diagnostics, terminal, output, consoleLines };
}
