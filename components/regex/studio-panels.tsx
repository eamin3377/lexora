"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Sparkles, Wand2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Explanation } from "@/lib/regex/parser";
import type { BacktrackResult } from "@/lib/regex/backtrack";
import type { OptimizerTip } from "@/lib/regex/optimize";
import { findMatches } from "@/lib/regex/library";

/* ── Regex Playground: live matches + character highlighting ── */

export function PlaygroundPanel({
  pattern,
  valid,
}: {
  pattern: string;
  valid: boolean;
}) {
  const [text, setText] = React.useState(
    "The DFA accepts abb and aababb.\nCall 42 or 3.14 — identifiers like _tmp and count9 also lurk here.",
  );

  const matches = React.useMemo(
    () => (valid && pattern ? findMatches(pattern, text) : []),
    [pattern, text, valid],
  );

  const segments = React.useMemo(() => {
    const out: { text: string; hit: number }[] = [];
    let cursor = 0;
    matches.forEach((m, i) => {
      if (m.start > cursor) out.push({ text: text.slice(cursor, m.start), hit: -1 });
      out.push({ text: text.slice(m.start, m.end), hit: i });
      cursor = m.end;
    });
    if (cursor < text.length) out.push({ text: text.slice(cursor), hit: -1 });
    return out;
  }, [matches, text]);

  return (
    <div className="p-4">
      <label className="text-[11px] font-semibold tracking-widest text-ink-500 uppercase">
        Test text
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        spellCheck={false}
        className="mt-1.5 w-full resize-y rounded-lg bg-paper-1 p-3 font-mono text-sm text-ink-900 ring-1 ring-line focus:ring-2 focus:ring-cobalt-500/60 focus:outline-none"
        aria-label="Playground test text"
      />
      <p className="mt-3 text-[11px] font-semibold tracking-widest text-ink-500 uppercase">
        {matches.length} match{matches.length === 1 ? "" : "es"} highlighted
      </p>
      <div className="mt-1.5 rounded-lg bg-card p-3 font-mono text-sm leading-7 ring-1 ring-line/60 whitespace-pre-wrap">
        {segments.map((s, i) =>
          s.hit >= 0 ? (
            <motion.mark
              key={i}
              initial={{ backgroundColor: "#FDF5E5" }}
              animate={{ backgroundColor: "#FCEBCB" }}
              className="rounded px-0.5 text-marigold-700 ring-1 ring-marigold-300/60"
            >
              {s.text}
            </motion.mark>
          ) : (
            <span key={i} className="text-ink-700">
              {s.text}
            </span>
          ),
        )}
        {text.length === 0 && <span className="text-ink-300">type something…</span>}
      </div>
    </div>
  );
}

/* ── Explainer ─────────────────────────────────────────────── */

export function ExplainerPanel({
  explanations,
  error,
}: {
  explanations: Explanation[];
  error: string | null;
}) {
  if (error) {
    return (
      <div className="flex items-start gap-3 p-5">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-coral-500" />
        <p className="font-mono text-sm text-coral-700">{error}</p>
      </div>
    );
  }
  return (
    <ul className="space-y-1 p-4">
      {explanations.map((e, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: Math.min(i * 0.04, 0.6) }}
          style={{ paddingLeft: e.depth * 18 }}
          className="flex items-baseline gap-2.5"
        >
          <code className="shrink-0 rounded bg-paper-2 px-1.5 py-0.5 font-mono text-xs text-ink-900">
            {e.fragment.length > 24 ? e.fragment.slice(0, 24) + "…" : e.fragment}
          </code>
          <span className="text-[13px] leading-6 text-ink-500">{e.text}</span>
        </motion.li>
      ))}
    </ul>
  );
}

/* ── Optimizer ─────────────────────────────────────────────── */

const TIP_META = {
  danger: { icon: AlertTriangle, cls: "bg-coral-100 text-coral-700" },
  improve: { icon: Wand2, cls: "bg-cobalt-100 text-cobalt-700" },
  style: { icon: Sparkles, cls: "bg-leaf-100 text-leaf-700" },
} as const;

export function OptimizerPanel({
  tips,
  onApply,
}: {
  tips: OptimizerTip[];
  onApply: (suggestion: string) => void;
}) {
  return (
    <div className="space-y-3 p-4">
      {tips.map((tip, i) => {
        const meta = TIP_META[tip.severity];
        return (
          <motion.div
            key={`${tip.title}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex gap-3 rounded-lg bg-paper-1 p-3.5 ring-1 ring-line/60"
          >
            <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", meta.cls)}>
              <meta.icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink-900">{tip.title}</p>
              <p className="mt-1 text-[13px] leading-6 text-ink-500">{tip.detail}</p>
              {tip.suggestion && (
                <button
                  onClick={() => onApply(tip.suggestion!)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-card px-2.5 py-1 font-mono text-xs text-ink-900 ring-1 ring-line transition-all hover:-translate-y-px hover:shadow-e1"
                >
                  <Wand2 className="size-3 text-cobalt-500" />
                  apply: {tip.suggestion.length > 32 ? tip.suggestion.slice(0, 32) + "…" : tip.suggestion}
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Backtracking visualization + match timeline ───────────── */

const ACTION_META = {
  try: { color: "bg-cobalt-300", text: "text-cobalt-700", label: "try" },
  match: { color: "bg-leaf-500", text: "text-leaf-700", label: "match" },
  fail: { color: "bg-coral-500", text: "text-coral-700", label: "fail" },
  backtrack: { color: "bg-marigold-500", text: "text-marigold-700", label: "backtrack" },
} as const;

export function BacktrackPanel({
  result,
  input,
}: {
  result: BacktrackResult | null;
  input: string;
}) {
  const [cursor, setCursor] = React.useState(-1); // -1 = show all

  React.useEffect(() => setCursor(-1), [result]);

  if (!result) {
    return (
      <p className="p-6 text-center text-sm text-ink-300">
        enter a valid pattern and a test input to trace the backtracker
      </p>
    );
  }

  const events = cursor >= 0 ? result.events.slice(0, cursor + 1) : result.events;
  const current = cursor >= 0 ? result.events[cursor] : result.events[result.events.length - 1];
  const backtracks = result.events.filter((e) => e.action === "backtrack").length;
  const maxPos = Math.max(input.length, 1);

  return (
    <div className="p-4">
      {/* verdict + stats */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase",
            result.matched ? "bg-leaf-100 text-leaf-700" : "bg-coral-100 text-coral-700",
          )}
        >
          {result.matched ? `matched ${result.end} char${result.end === 1 ? "" : "s"}` : "no match"}
        </span>
        <span className="font-mono text-xs text-ink-500">
          {result.events.length}
          {result.truncated ? "+" : ""} events · {backtracks} backtracks
        </span>
        {backtracks > 8 && (
          <span className="flex items-center gap-1 font-mono text-xs text-marigold-700">
            <AlertTriangle className="size-3.5" />
            heavy backtracking
          </span>
        )}
      </div>

      {/* input with current position */}
      <div className="mt-3 flex gap-px overflow-x-auto rounded-lg bg-paper-1 p-2 ring-1 ring-line">
        {input.split("").map((ch, i) => (
          <span
            key={i}
            className={cn(
              "flex h-7 w-5 shrink-0 items-center justify-center rounded font-mono text-xs",
              current && i === current.pos
                ? "bg-marigold-200 text-marigold-700 ring-1 ring-marigold-500"
                : current && i < current.pos
                  ? "bg-leaf-100 text-leaf-700"
                  : "text-ink-500",
            )}
          >
            {ch === " " ? "␣" : ch}
          </span>
        ))}
      </div>

      {/* scrubber */}
      <input
        type="range"
        min={0}
        max={result.events.length - 1}
        value={cursor < 0 ? result.events.length - 1 : cursor}
        onChange={(e) => setCursor(Number(e.target.value))}
        aria-label="Scrub through backtracking events"
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-paper-2 accent-marigold-500"
      />

      {/* match timeline: one bar per event, x = input pos, indent = depth */}
      <p className="mt-4 text-[11px] font-semibold tracking-widest text-ink-500 uppercase">
        Match timeline
      </p>
      <div className="mt-1.5 max-h-64 space-y-px overflow-y-auto rounded-lg bg-card p-2 ring-1 ring-line/60">
        {events.slice(-120).map((e) => {
          const meta = ACTION_META[e.action];
          return (
            <div
              key={e.index}
              className={cn(
                "flex items-center gap-2 rounded px-1 py-px",
                cursor >= 0 && e.index === cursor && "bg-paper-1 ring-1 ring-marigold-300",
              )}
            >
              <span className="w-8 shrink-0 text-right font-mono text-[9px] text-ink-300 tabular-nums">
                {e.index}
              </span>
              <div className="relative h-3.5 flex-1">
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    left: `${(e.pos / maxPos) * 82}%`,
                    width: `${Math.max(3, (1 / maxPos) * 82)}%`,
                    marginLeft: e.depth * 3,
                    transformOrigin: "left",
                  }}
                  className={cn("absolute top-0.5 h-2.5 rounded-sm", meta.color)}
                />
              </div>
              <code className="w-24 shrink-0 truncate font-mono text-[10px] text-ink-700">
                {e.node}
              </code>
              <span className={cn("w-16 shrink-0 font-mono text-[9px] uppercase", meta.text)}>
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-3">
        {Object.entries(ACTION_META).map(([k, m]) => (
          <span key={k} className="flex items-center gap-1.5 font-mono text-[10px] text-ink-500">
            <span className={cn("size-2 rounded-sm", m.color)} />
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}
