"use client";

import * as React from "react";
import MonacoEditor, { type Monaco } from "@monaco-editor/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bug,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  GraduationCap,
  Library,
  Pause,
  Play,
  RotateCcw,
  StepBack,
  StepForward,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { analyze, parseSpec, scan, type LexSpec, type ScanResult } from "@/lib/lex/engine";
import { generateC } from "@/lib/lex/codegen";
import { EXAMPLES, EXERCISES, type LexExercise } from "@/lib/lex/examples";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { InputTape } from "@/components/lex/input-tape";
import { RulesPanel } from "@/components/lex/rules-panel";
import {
  ErrorsList,
  GeneratedC,
  Suggestions,
  TokenStream,
  TokenTable,
} from "@/components/lex/results-tabs";

/* ── Monaco theme (scoped to this playground) ──────────────── */

let themeDefined = false;
function defineLexTheme(monaco: Monaco) {
  if (themeDefined) return;
  themeDefined = true;
  monaco.editor.defineTheme("lex-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#23281f",
      "editor.foreground": "#f2efe4",
      "editor.lineHighlightBackground": "#2b3126",
      "editorLineNumber.foreground": "#6b7267",
      "editorCursor.foreground": "#f5a623",
      "editor.selectionBackground": "#3b6fe055",
    },
  });
}

type ResultTab = "tokens" | "table" | "code" | "ai" | "errors";

const RESULT_TABS: { id: ResultTab; label: string }[] = [
  { id: "tokens", label: "Tokens" },
  { id: "table", label: "Table" },
  { id: "code", label: "lex.yy.c" },
  { id: "ai", label: "AI" },
  { id: "errors", label: "Problems" },
];

export function LexPlayground() {
  const [specSource, setSpecSource] = React.useState(EXAMPLES[0].spec);
  const [input, setInput] = React.useState(EXAMPLES[0].input);
  const [spec, setSpec] = React.useState<LexSpec | null>(null);
  const [result, setResult] = React.useState<ScanResult | null>(null);
  const [tab, setTab] = React.useState<ResultTab>("tokens");

  // debug state
  const [debug, setDebug] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(-1);
  const [playing, setPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState(500);

  // library / exercise state
  const [libraryOpen, setLibraryOpen] = React.useState(false);
  const [exercise, setExercise] = React.useState<LexExercise | null>(null);
  const [verdict, setVerdict] = React.useState<"pass" | "fail" | null>(null);

  const run = React.useCallback(() => {
    const parsed = parseSpec(specSource);
    const scanned = parsed.rules.some((r) => r.regex) ? scan(parsed, input) : null;
    setSpec(parsed);
    setResult(scanned);
    setPlaying(false);
    setStepIndex(debug && scanned && scanned.steps.length > 0 ? 0 : -1);

    const hasErrors = parsed.diagnostics.some((d) => d.severity === "error");
    if (hasErrors) setTab("errors");
    else if (tab === "errors") setTab("tokens");

    // exercise check
    if (exercise && scanned) {
      const produced = scanned.tokens.map((t) => t.type);
      const pass =
        produced.length === exercise.expected.length &&
        produced.every((t, i) => t === exercise.expected[i]) &&
        scanned.errors.length === 0;
      setVerdict(pass ? "pass" : "fail");
      toast(pass ? "Exercise passed" : "Not yet", {
        description: pass
          ? `${exercise.title} — token stream matches exactly.`
          : `Expected [${exercise.expected.join(", ")}], got [${produced.join(", ") || "nothing"}].`,
        variant: pass ? "success" : "warning",
      });
    }
  }, [specSource, input, debug, tab, exercise]);

  // playback
  React.useEffect(() => {
    if (!playing || !result) return;
    const id = setInterval(() => {
      setStepIndex((i) => {
        if (i + 1 >= result.steps.length) {
          setPlaying(false);
          return -1; // finished — show full result
        }
        return i + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [playing, result, speed]);

  // Ctrl+Enter runs
  const runRef = React.useRef(run);
  runRef.current = run;
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const loadExample = (id: string) => {
    const ex = EXAMPLES.find((e) => e.id === id);
    if (!ex) return;
    setSpecSource(ex.spec);
    setInput(ex.input);
    setExercise(null);
    setVerdict(null);
    setResult(null);
    setSpec(null);
    setStepIndex(-1);
    setLibraryOpen(false);
  };

  const loadExercise = (ex: LexExercise) => {
    setSpecSource(ex.starterSpec);
    setInput(ex.input);
    setExercise(ex);
    setVerdict(null);
    setResult(null);
    setSpec(null);
    setStepIndex(-1);
    setLibraryOpen(false);
  };

  const suggestions = React.useMemo(
    () => (spec ? analyze(spec, result) : []),
    [spec, result],
  );
  const cCode = React.useMemo(() => (spec ? generateC(spec) : ""), [spec]);
  const atEnd = result !== null && (stepIndex === -1 || stepIndex >= result.steps.length - 1);

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-24 pb-16 sm:px-6">
      {/* header */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900">
            Lex Machine
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Write a Flex spec, feed it input, watch maximal munch decide every byte.
          </p>
        </div>

        {/* library dropdown */}
        <div className="relative">
          <Button variant="secondary" size="sm" onClick={() => setLibraryOpen((v) => !v)}>
            <Library className="size-4" />
            Examples & exercises
            <ChevronDown className={cn("size-4 transition-transform", libraryOpen && "rotate-180")} />
          </Button>
          <AnimatePresence>
            {libraryOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-xl bg-card shadow-e3 ring-1 ring-line"
              >
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold tracking-widest text-ink-500 uppercase">
                  Example library
                </p>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => loadExample(ex.id)}
                    className="block w-full px-4 py-2 text-left hover:bg-paper-1"
                  >
                    <span className="block text-sm font-semibold text-ink-900">{ex.title}</span>
                    <span className="block text-xs text-ink-500">{ex.description}</span>
                  </button>
                ))}
                <p className="border-t border-line px-4 pt-3 pb-1 text-[10px] font-bold tracking-widest text-ink-500 uppercase">
                  Exercises
                </p>
                {EXERCISES.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => loadExercise(ex)}
                    className="block w-full px-4 py-2 text-left hover:bg-paper-1"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                      <GraduationCap className="size-4 text-leaf-500" />
                      {ex.title}
                    </span>
                    <span className="block text-xs text-ink-500">{ex.brief}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          variant={debug ? "primary" : "secondary"}
          size="sm"
          onClick={() => {
            setDebug((d) => !d);
            setStepIndex(-1);
            setPlaying(false);
          }}
          aria-pressed={debug}
        >
          <Bug className="size-4" />
          Debug
        </Button>
        <Button size="sm" onClick={run} title="Ctrl+Enter">
          <Play className="size-4" />
          Run
        </Button>
      </div>

      {/* exercise banner */}
      <AnimatePresence>
        {exercise && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "mb-5 flex flex-wrap items-center gap-3 rounded-xl p-4 ring-1",
                verdict === "pass"
                  ? "bg-leaf-100 ring-leaf-300"
                  : verdict === "fail"
                    ? "bg-coral-100 ring-coral-300"
                    : "bg-marigold-100/70 ring-marigold-300",
              )}
            >
              {verdict === "pass" ? (
                <CheckCircle2 className="size-5 shrink-0 text-leaf-700" />
              ) : verdict === "fail" ? (
                <XCircle className="size-5 shrink-0 text-coral-700" />
              ) : (
                <GraduationCap className="size-5 shrink-0 text-marigold-700" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink-900">
                  Exercise: {exercise.title}
                  {verdict === "pass" && " — solved!"}
                </p>
                <p className="text-xs text-ink-700">{exercise.brief}</p>
                <p className="mt-1 font-mono text-[11px] text-ink-500">
                  expected: [{exercise.expected.join(", ")}]
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    toast("Hint", { description: exercise.hint, variant: "info", duration: 9000 })
                  }
                >
                  Hint
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setExercise(null);
                    setVerdict(null);
                  }}
                >
                  Exit
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* input tape — the star of the show */}
      <InputTape input={input} result={result} stepIndex={stepIndex} />

      {/* debug transport */}
      <AnimatePresence>
        {debug && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-card p-3 shadow-e1 ring-1 ring-line/60"
          >
            <Button
              size="sm"
              disabled={!result || result.steps.length === 0}
              onClick={() => {
                if (!result) return;
                if (atEnd && !playing) setStepIndex(0);
                setPlaying((p) => !p);
              }}
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
              {playing ? "Pause" : "Play"}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={!result || playing || stepIndex <= 0}
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              aria-label="Step back"
            >
              <StepBack className="size-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={!result || playing || (result !== null && stepIndex >= result.steps.length - 1)}
              onClick={() => setStepIndex((i) => (result ? Math.min(result.steps.length - 1, i + 1) : i))}
              aria-label="Step forward"
            >
              <StepForward className="size-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={!result}
              onClick={() => {
                setStepIndex(result && result.steps.length > 0 ? 0 : -1);
                setPlaying(false);
              }}
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>

            {/* scrubber */}
            {result && result.steps.length > 0 && (
              <input
                type="range"
                min={0}
                max={result.steps.length - 1}
                value={stepIndex < 0 ? result.steps.length - 1 : stepIndex}
                onChange={(e) => {
                  setPlaying(false);
                  setStepIndex(Number(e.target.value));
                }}
                aria-label="Scrub through scan steps"
                className="mx-2 h-1.5 min-w-32 flex-1 cursor-pointer appearance-none rounded-full bg-paper-2 accent-marigold-500"
              />
            )}

            <div className="flex items-center gap-1">
              {[
                { label: "slow", ms: 900 },
                { label: "med", ms: 500 },
                { label: "fast", ms: 180 },
              ].map((s) => (
                <button
                  key={s.ms}
                  onClick={() => setSpeed(s.ms)}
                  aria-pressed={speed === s.ms}
                  className={cn(
                    "rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase",
                    speed === s.ms
                      ? "bg-ink-900 text-paper-0"
                      : "text-ink-500 ring-1 ring-line hover:text-ink-900",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* main grid */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* left column: editors */}
        <div className="space-y-5">
          <div className="overflow-hidden rounded-xl shadow-device ring-1 ring-line">
            <div className="flex items-center gap-2 bg-term px-4 py-2.5">
              <span className="font-mono text-xs text-term-text/60">spec.l — lex editor</span>
              <span className="ml-auto font-mono text-[10px] text-term-text/40">
                Ctrl+Enter to run
              </span>
            </div>
            <div className="h-80">
              <MonacoEditor
                language="plaintext"
                value={specSource}
                theme="lex-dark"
                beforeMount={defineLexTheme}
                onChange={(v) => setSpecSource(v ?? "")}
                loading={
                  <div className="flex h-full items-center justify-center bg-term font-mono text-xs text-term-text/40">
                    loading editor…
                  </div>
                }
                options={{
                  fontSize: 13,
                  fontFamily: "var(--font-jetbrains), ui-monospace, monospace",
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  padding: { top: 10 },
                  automaticLayout: true,
                  wordWrap: "on",
                }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-card shadow-e1 ring-1 ring-line/60">
            <p className="border-b border-line/60 px-4 py-2.5 font-mono text-xs text-ink-500">
              input — fed to yylex()
            </p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              spellCheck={false}
              aria-label="Scanner input"
              className="w-full resize-y bg-transparent p-4 font-mono text-sm text-ink-900 focus:outline-none"
            />
          </div>

          {/* rules / regex viewer */}
          <div className="overflow-hidden rounded-xl bg-card shadow-e1 ring-1 ring-line/60">
            <p className="border-b border-line/60 px-4 py-2.5 font-mono text-xs text-ink-500">
              rules — priority order · expanded regex · longest-match contest
            </p>
            <div className="max-h-96 overflow-y-auto">
              <RulesPanel spec={spec} result={result} stepIndex={stepIndex} />
            </div>
          </div>
        </div>

        {/* right column: results */}
        <div className="self-start overflow-hidden rounded-xl bg-card shadow-e1 ring-1 ring-line/60">
          <div className="flex items-center gap-1 border-b border-line/60 px-2" role="tablist">
            {RESULT_TABS.map((t) => {
              const errCount =
                t.id === "errors"
                  ? (spec?.diagnostics.length ?? 0) + (result?.errors.length ?? 0)
                  : 0;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "relative px-3 py-2.5 font-mono text-xs transition-colors",
                    tab === t.id ? "text-ink-900" : "text-ink-500 hover:text-ink-700",
                  )}
                >
                  {t.label}
                  {errCount > 0 && (
                    <span className="ml-1 rounded-full bg-coral-500 px-1.5 font-mono text-[9px] text-white">
                      {errCount}
                    </span>
                  )}
                  {tab === t.id && (
                    <motion.span
                      layoutId="lex-tab-indicator"
                      className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-marigold-500"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="min-h-64">
            {tab === "tokens" && <TokenStream result={result} stepIndex={stepIndex} />}
            {tab === "table" && <TokenTable result={result} />}
            {tab === "code" &&
              (spec ? (
                <GeneratedC code={cCode} />
              ) : (
                <p className="p-6 text-center text-sm text-ink-300">
                  run once and flex generates lex.yy.c from your rules
                </p>
              ))}
            {tab === "ai" &&
              (spec ? (
                <Suggestions suggestions={suggestions} />
              ) : (
                <p className="p-6 text-center text-sm text-ink-300">
                  run the scanner and the tutor reviews your spec
                </p>
              ))}
            {tab === "errors" && <ErrorsList spec={spec} result={result} />}
          </div>
        </div>
      </div>

      {/* back link */}
      <div className="mt-8">
        <a
          href="/playground"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
        >
          <ChevronLeft className="size-4" />
          Full IDE playground
        </a>
      </div>
    </div>
  );
}
