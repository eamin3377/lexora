"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Blocks,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Download,
  History,
  Pause,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  StepForward,
  Wand2,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { explain, parseRegex } from "@/lib/regex/parser";
import {
  buildDfa,
  buildNfa,
  layoutGraph,
  simulateDfa,
  simulateNfa,
} from "@/lib/regex/automata";
import { traceMatch } from "@/lib/regex/backtrack";
import { optimize } from "@/lib/regex/optimize";
import {
  BUILDER_BLOCKS,
  PRESETS,
  REGEX_EXERCISES,
  REGEX_QUIZ,
  askAssistant,
  generateFromDescription,
  toExportJson,
  toLexSnippet,
  type AssistantMessage,
  type RegexExercise,
} from "@/lib/regex/library";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { LessonQuiz } from "@/components/learn/lesson-quiz";
import { AutomatonView } from "@/components/regex/automaton-view";
import {
  BacktrackPanel,
  ExplainerPanel,
  OptimizerPanel,
  PlaygroundPanel,
} from "@/components/regex/studio-panels";

const HISTORY_KEY = "lexora-regex-history";

type StudioTab = "explain" | "nfa" | "dfa" | "backtrack" | "playground" | "optimize" | "practice" | "ai";

const TABS: { id: StudioTab; label: string }[] = [
  { id: "explain", label: "Explain" },
  { id: "nfa", label: "NFA" },
  { id: "dfa", label: "DFA" },
  { id: "backtrack", label: "Backtracking" },
  { id: "playground", label: "Playground" },
  { id: "optimize", label: "Optimizer" },
  { id: "practice", label: "Practice" },
  { id: "ai", label: "AI" },
];

function fullMatch(pattern: string, s: string): boolean {
  try {
    return new RegExp(`^(?:${pattern})$`).test(s);
  } catch {
    return false;
  }
}

export function RegexStudio() {
  const [pattern, setPattern] = React.useState("(a|b)*abb");
  const [testInput, setTestInput] = React.useState("aababb");
  const [tab, setTab] = React.useState<StudioTab>("nfa");

  // simulation
  const [simIndex, setSimIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);

  // toolbars
  const [builderOpen, setBuilderOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [history, setHistory] = React.useState<string[]>([]);
  const [copied, setCopied] = React.useState<string | null>(null);

  // generator
  const [describe, setDescribe] = React.useState("");

  // practice
  const [exercise, setExercise] = React.useState<RegexExercise | null>(null);

  // assistant
  const [messages, setMessages] = React.useState<AssistantMessage[]>([
    {
      role: "assistant",
      text: "I can explain your pattern, its NFA and DFA, and when backtracking hurts. Try: \"how does the NFA work?\"",
    },
  ]);
  const [question, setQuestion] = React.useState("");

  /* ── derived machines ─────────────────────────────────── */

  const parsed = React.useMemo(() => parseRegex(pattern), [pattern]);
  const nfa = React.useMemo(() => (parsed.ast ? buildNfa(parsed.ast) : null), [parsed.ast]);
  const dfa = React.useMemo(() => (nfa ? buildDfa(nfa) : null), [nfa]);
  const explanations = React.useMemo(
    () => (parsed.ast ? explain(parsed.ast) : []),
    [parsed.ast],
  );
  const tips = React.useMemo(
    () => (parsed.ast ? optimize(parsed.ast, pattern) : []),
    [parsed.ast, pattern],
  );

  const nfaSteps = React.useMemo(
    () => (nfa ? simulateNfa(nfa, testInput.slice(0, 30)) : []),
    [nfa, testInput],
  );
  const dfaSteps = React.useMemo(
    () => (dfa ? simulateDfa(dfa, testInput.slice(0, 30)) : []),
    [dfa, testInput],
  );
  const backtrack = React.useMemo(
    () => (parsed.ast ? traceMatch(parsed.ast, testInput.slice(0, 24)) : null),
    [parsed.ast, testInput],
  );

  const nfaLayout = React.useMemo(
    () =>
      nfa
        ? layoutGraph(
            Array.from({ length: nfa.stateCount }, (_, i) => i),
            nfa.edges,
            nfa.start,
          )
        : [],
    [nfa],
  );
  const dfaLayout = React.useMemo(
    () =>
      dfa
        ? layoutGraph(
            dfa.states.map((s) => s.id),
            dfa.edges,
            dfa.start,
          )
        : [],
    [dfa],
  );

  const stepCount = Math.max(nfaSteps.length, dfaSteps.length);
  const clampedIndex = Math.min(simIndex, Math.max(0, stepCount - 1));

  /* ── playback ─────────────────────────────────────────── */

  React.useEffect(() => {
    setSimIndex(0);
    setPlaying(false);
  }, [pattern, testInput]);

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setSimIndex((i) => {
        if (i + 1 >= stepCount) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 600);
    return () => clearInterval(id);
  }, [playing, stepCount]);

  /* ── history (localStorage) ───────────────────────────── */

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw) as string[]);
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    if (!parsed.ast || pattern.length < 2) return;
    const id = setTimeout(() => {
      setHistory((h) => {
        const next = [pattern, ...h.filter((p) => p !== pattern)].slice(0, 12);
        try {
          window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    }, 1600);
    return () => clearTimeout(id);
  }, [pattern, parsed.ast]);

  /* ── actions ──────────────────────────────────────────── */

  const copy = (label: string, text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 1400);
      toast("Copied", { description: label, variant: "success" });
    });
    setExportOpen(false);
  };

  const download = (name: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const ask = () => {
    const q = question.trim();
    if (!q) return;
    const answer = askAssistant(q, { pattern, ast: parsed.ast, nfa, dfa });
    setMessages((m) => [...m, { role: "user", text: q }, { role: "assistant", text: answer }]);
    setQuestion("");
  };

  const exerciseResults = React.useMemo(() => {
    if (!exercise || !parsed.ast) return null;
    const matched = exercise.mustMatch.map((s) => ({ s, ok: fullMatch(pattern, s) }));
    const rejected = exercise.mustReject.map((s) => ({ s, ok: !fullMatch(pattern, s) }));
    const pass = matched.every((m) => m.ok) && rejected.every((r) => r.ok);
    return { matched, rejected, pass };
  }, [exercise, parsed.ast, pattern]);

  const consumedTape = testInput.slice(0, 30);

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-24 pb-16 sm:px-6">
      {/* header */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900">
            Regex Studio
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            One pattern in — explanation, NFA, DFA, backtracking, and lex code out.
          </p>
        </div>

        {/* history */}
        <div className="relative">
          <Button variant="secondary" size="sm" onClick={() => setHistoryOpen((v) => !v)}>
            <History className="size-4" />
            History
          </Button>
          <AnimatePresence>
            {historyOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 z-30 mt-2 w-64 overflow-hidden rounded-xl bg-card py-1 shadow-e3 ring-1 ring-line"
              >
                {history.length === 0 && (
                  <p className="px-4 py-3 text-xs text-ink-300">
                    patterns you build are remembered here
                  </p>
                )}
                {history.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPattern(p);
                      setHistoryOpen(false);
                    }}
                    className="block w-full truncate px-4 py-1.5 text-left font-mono text-xs text-ink-700 hover:bg-paper-1 hover:text-ink-900"
                  >
                    {p}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* copy / export */}
        <div className="relative">
          <Button variant="secondary" size="sm" onClick={() => setExportOpen((v) => !v)}>
            <Download className="size-4" />
            Export
            <ChevronDown className={cn("size-4 transition-transform", exportOpen && "rotate-180")} />
          </Button>
          <AnimatePresence>
            {exportOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 z-30 mt-2 w-60 overflow-hidden rounded-xl bg-card py-1 shadow-e3 ring-1 ring-line"
              >
                {[
                  { label: "Copy regex", action: () => copy("regex", pattern) },
                  { label: "Copy Flex rule", action: () => copy("flex rule", toLexSnippet(pattern)) },
                  { label: "Download spec.l", action: () => download("spec.l", toLexSnippet(pattern)) },
                  { label: "Download machines.json", action: () => download("machines.json", toExportJson(pattern, nfa, dfa)) },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-ink-700 hover:bg-paper-1 hover:text-ink-900"
                  >
                    {copied === item.label.replace("Copy ", "") ? (
                      <Check className="size-3.5 text-leaf-500" />
                    ) : item.label.startsWith("Copy") ? (
                      <Copy className="size-3.5 text-ink-300" />
                    ) : (
                      <Download className="size-3.5 text-ink-300" />
                    )}
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          variant={builderOpen ? "primary" : "secondary"}
          size="sm"
          onClick={() => setBuilderOpen((v) => !v)}
          aria-pressed={builderOpen}
        >
          <Blocks className="size-4" />
          Builder
        </Button>
      </div>

      {/* pattern input */}
      <div className="rounded-xl bg-card p-4 shadow-e1 ring-1 ring-line/60">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-paper-1 px-3 ring-1 ring-line focus-within:ring-2 focus-within:ring-cobalt-500/60">
            <span className="font-mono text-lg text-ink-300">/</span>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              spellCheck={false}
              aria-label="Regular expression"
              className="min-w-0 flex-1 bg-transparent py-2.5 font-mono text-lg text-ink-900 focus:outline-none"
              placeholder="(a|b)*abb"
            />
            <span className="font-mono text-lg text-ink-300">/</span>
            {parsed.error ? (
              <XCircle className="size-5 shrink-0 text-coral-500" />
            ) : (
              <CheckCircle2 className="size-5 shrink-0 text-leaf-500" />
            )}
          </div>
          {nfa && dfa && (
            <p className="font-mono text-xs text-ink-500">
              NFA {nfa.stateCount} states · DFA {dfa.states.length} states
            </p>
          )}
        </div>
        {parsed.error && (
          <p className="mt-2 font-mono text-xs text-coral-700">{parsed.error}</p>
        )}

        {/* builder blocks */}
        <AnimatePresence>
          {builderOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line/60 pt-3">
                {BUILDER_BLOCKS.map((b) => (
                  <button
                    key={b.label}
                    onClick={() => setPattern((p) => p + b.snippet)}
                    title={b.hint}
                    className="rounded-md bg-paper-1 px-2.5 py-1 font-mono text-xs text-ink-700 ring-1 ring-line transition-all hover:-translate-y-px hover:text-ink-900 hover:shadow-e1"
                  >
                    {b.label}
                  </button>
                ))}
                <button
                  onClick={() => setPattern("")}
                  className="rounded-md px-2.5 py-1 font-mono text-xs text-coral-700 ring-1 ring-coral-300/60 hover:bg-coral-100"
                >
                  clear
                </button>

                {/* generator */}
                <div className="ml-auto flex min-w-56 items-center gap-1.5">
                  <input
                    value={describe}
                    onChange={(e) => setDescribe(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const preset = generateFromDescription(describe);
                        if (preset) {
                          setPattern(preset.pattern);
                          toast(`Generated: ${preset.name}`, { description: preset.note, variant: "success" });
                        } else {
                          toast("No preset matched", {
                            description: `Try: ${PRESETS.slice(0, 4).map((p) => p.name.toLowerCase()).join(", ")}…`,
                            variant: "warning",
                          });
                        }
                      }
                    }}
                    placeholder='generate: "hex number"…'
                    aria-label="Describe a pattern to generate"
                    className="min-w-0 flex-1 rounded-md bg-paper-1 px-2.5 py-1 font-mono text-xs text-ink-900 ring-1 ring-line focus:ring-2 focus:ring-cobalt-500/60 focus:outline-none"
                  />
                  <Wand2 className="size-4 shrink-0 text-cobalt-500" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* test input + transport (shared by NFA/DFA/backtrack) */}
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-card p-3 shadow-e1 ring-1 ring-line/60">
        <label className="font-mono text-xs text-ink-500 uppercase">input</label>
        <div className="flex min-w-0 flex-1 gap-px overflow-x-auto">
          {consumedTape.split("").map((ch, i) => (
            <span
              key={i}
              className={cn(
                "flex h-8 w-6 shrink-0 items-center justify-center rounded font-mono text-sm transition-colors",
                i < clampedIndex
                  ? "bg-leaf-100 text-leaf-700 ring-1 ring-leaf-300/50"
                  : i === clampedIndex && clampedIndex < consumedTape.length
                    ? "bg-marigold-200 text-marigold-700 ring-1 ring-marigold-500"
                    : "bg-paper-1 text-ink-500 ring-1 ring-line/60",
              )}
            >
              {ch === " " ? "␣" : ch}
            </span>
          ))}
        </div>
        <input
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          spellCheck={false}
          aria-label="Test input string"
          className="w-36 rounded-md bg-paper-1 px-3 py-1.5 font-mono text-sm text-ink-900 ring-1 ring-line focus:ring-2 focus:ring-cobalt-500/60 focus:outline-none"
          placeholder="edit me"
        />
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            disabled={stepCount <= 1}
            onClick={() => {
              if (clampedIndex >= stepCount - 1) setSimIndex(0);
              setPlaying((p) => !p);
            }}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={playing || clampedIndex >= stepCount - 1}
            onClick={() => setSimIndex((i) => i + 1)}
            aria-label="Step"
          >
            <StepForward className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSimIndex(0);
              setPlaying(false);
            }}
            aria-label="Reset"
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>

      {/* tabs */}
      <div className="mt-4 overflow-hidden rounded-xl bg-card shadow-e1 ring-1 ring-line/60">
        <div className="flex items-center gap-1 overflow-x-auto border-b border-line/60 px-2" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative shrink-0 px-3 py-2.5 font-mono text-xs transition-colors",
                tab === t.id ? "text-ink-900" : "text-ink-500 hover:text-ink-700",
              )}
            >
              {t.label}
              {tab === t.id && (
                <motion.span
                  layoutId="studio-tab-indicator"
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-marigold-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* ── panels ── */}
        {tab === "explain" && <ExplainerPanel explanations={explanations} error={parsed.error} />}

        {tab === "nfa" && nfa && (
          <div className="p-2">
            <AutomatonView
              nodes={nfaLayout}
              edges={nfa.edges.map((e) => ({ from: e.from, to: e.to, label: e.label }))}
              start={nfa.start}
              accepting={new Set([nfa.accept])}
              active={new Set(nfaSteps[clampedIndex]?.active ?? [])}
            />
            <p className="px-3 pb-2 font-mono text-xs text-ink-500" aria-live="polite">
              {nfaSteps[clampedIndex]
                ? `${nfaSteps[clampedIndex].active.length} active state(s) after ${clampedIndex} char(s)` +
                  (clampedIndex === stepCount - 1
                    ? nfaSteps[clampedIndex].accepting
                      ? " — ACCEPTED ✓"
                      : nfaSteps[clampedIndex].active.length === 0
                        ? " — dead, REJECTED ✗"
                        : " — not in accept state, REJECTED ✗"
                    : "")
                : "press play"}
              {" · dashed edges are ε (free moves)"}
            </p>
          </div>
        )}

        {tab === "dfa" && dfa && (
          <div className="p-2">
            <AutomatonView
              nodes={dfaLayout}
              edges={dfa.edges.map((e) => ({ from: e.from, to: e.to, label: e.label }))}
              start={dfa.start}
              accepting={new Set(dfa.states.filter((s) => s.accepting).map((s) => s.id))}
              active={
                new Set(
                  dfaSteps[clampedIndex]?.state !== null && dfaSteps[clampedIndex] !== undefined
                    ? [dfaSteps[clampedIndex].state as number]
                    : [],
                )
              }
              dead={dfaSteps[clampedIndex]?.state === null}
              tooltip={(id) => {
                const s = dfa.states.find((st) => st.id === id);
                return s ? `NFA {${s.nfaStates.join(",")}}` : undefined;
              }}
            />
            <p className="px-3 pb-2 font-mono text-xs text-ink-500" aria-live="polite">
              {dfaSteps[clampedIndex]?.state === null
                ? "dead — no transition for that character, REJECTED ✗"
                : `in state ${dfaSteps[clampedIndex]?.state ?? 0} after ${clampedIndex} char(s)` +
                  (clampedIndex === stepCount - 1
                    ? dfaSteps[clampedIndex]?.accepting
                      ? " — ACCEPTED ✓"
                      : " — REJECTED ✗"
                    : "")}
              {" · hover a state to see which NFA states it bundles"}
            </p>
          </div>
        )}

        {tab === "backtrack" && <BacktrackPanel result={backtrack} input={testInput.slice(0, 24)} />}
        {tab === "playground" && <PlaygroundPanel pattern={pattern} valid={!parsed.error} />}
        {tab === "optimize" && <OptimizerPanel tips={tips} onApply={setPattern} />}

        {tab === "practice" && (
          <div className="grid gap-6 p-4 lg:grid-cols-2">
            {/* exercises */}
            <div>
              <p className="mb-3 text-[11px] font-semibold tracking-widest text-ink-500 uppercase">
                Interactive exercises — write the pattern above
              </p>
              <div className="space-y-2">
                {REGEX_EXERCISES.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => setExercise(exercise?.id === ex.id ? null : ex)}
                    aria-pressed={exercise?.id === ex.id}
                    className={cn(
                      "block w-full rounded-lg p-3 text-left ring-1 transition-all",
                      exercise?.id === ex.id
                        ? "bg-marigold-100/70 ring-marigold-300"
                        : "bg-paper-1 ring-line/60 hover:ring-ink-300",
                    )}
                  >
                    <span className="text-sm font-semibold text-ink-900">{ex.title}</span>
                    <span className="mt-0.5 block text-xs text-ink-500">{ex.brief}</span>
                  </button>
                ))}
              </div>

              {exercise && exerciseResults && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "mt-3 rounded-lg p-3.5 ring-1",
                    exerciseResults.pass
                      ? "bg-leaf-100 ring-leaf-300"
                      : "bg-paper-1 ring-line",
                  )}
                >
                  <p className="flex items-center gap-2 text-sm font-bold text-ink-900">
                    {exerciseResults.pass ? (
                      <>
                        <CheckCircle2 className="size-4 text-leaf-700" /> Solved!
                      </>
                    ) : (
                      "Checklist"
                    )}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-xs">
                    <div>
                      <p className="mb-1 text-[10px] tracking-widest text-ink-500 uppercase">must match</p>
                      {exerciseResults.matched.map((m) => (
                        <p key={m.s} className={m.ok ? "text-leaf-700" : "text-coral-700"}>
                          {m.ok ? "✓" : "✗"} &quot;{m.s}&quot;
                        </p>
                      ))}
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] tracking-widest text-ink-500 uppercase">must reject</p>
                      {exerciseResults.rejected.map((r) => (
                        <p key={r.s} className={r.ok ? "text-leaf-700" : "text-coral-700"}>
                          {r.ok ? "✓" : "✗"} &quot;{r.s}&quot;
                        </p>
                      ))}
                    </div>
                  </div>
                  {!exerciseResults.pass && (
                    <button
                      onClick={() => toast("Hint", { description: exercise.hint, variant: "info", duration: 8000 })}
                      className="mt-2 text-xs font-semibold text-cobalt-700 underline-offset-2 hover:underline"
                    >
                      hint
                    </button>
                  )}
                </motion.div>
              )}
            </div>

            {/* quiz */}
            <div>
              <p className="mb-3 text-[11px] font-semibold tracking-widest text-ink-500 uppercase">
                Quiz — regex, NFA & DFA theory
              </p>
              <LessonQuiz questions={REGEX_QUIZ} />
            </div>
          </div>
        )}

        {tab === "ai" && (
          <div className="flex flex-col p-4">
            <div className="max-h-80 space-y-3 overflow-y-auto">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-6 whitespace-pre-wrap",
                      m.role === "user"
                        ? "bg-ink-900 text-paper-0"
                        : "bg-paper-1 text-ink-700 ring-1 ring-line/60",
                    )}
                  >
                    {m.role === "assistant" && (
                      <Sparkles className="mr-1.5 inline size-3.5 text-cobalt-500" />
                    )}
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              {["how does the NFA work?", "why is the DFA different?", "when is backtracking slow?"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setQuestion(s)}
                    className="hidden rounded-full px-2.5 py-1 text-[11px] text-ink-500 ring-1 ring-line hover:text-ink-900 sm:block"
                  >
                    {s}
                  </button>
                ),
              )}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask()}
                placeholder="Ask about this pattern, its NFA, DFA, or backtracking…"
                aria-label="Ask the regex assistant"
                className="min-w-0 flex-1 rounded-lg bg-paper-1 px-3 py-2 text-sm text-ink-900 ring-1 ring-line focus:ring-2 focus:ring-cobalt-500/60 focus:outline-none"
              />
              <Button size="sm" onClick={ask} aria-label="Send question">
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
