"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Copy, Check, Lightbulb, Sparkles, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LexSpec, ScanResult, Suggestion } from "@/lib/lex/engine";

/* ── token color hashing (stable per type) ─────────────────── */

const PALETTES = [
  "bg-cobalt-100 text-cobalt-700 ring-cobalt-300/50",
  "bg-leaf-100 text-leaf-700 ring-leaf-300/50",
  "bg-marigold-100 text-marigold-700 ring-marigold-300/50",
  "bg-orchid-100 text-orchid-700 ring-orchid-300/50",
  "bg-coral-100 text-coral-700 ring-coral-300/50",
];

function paletteFor(type: string): string {
  let h = 0;
  for (let i = 0; i < type.length; i++) h = (h * 31 + type.charCodeAt(i)) | 0;
  return PALETTES[Math.abs(h) % PALETTES.length];
}

/* ── Token stream ──────────────────────────────────────────── */

export function TokenStream({
  result,
  stepIndex,
}: {
  result: ScanResult | null;
  stepIndex: number;
}) {
  if (!result) {
    return (
      <p className="p-6 text-center text-sm text-ink-300">
        press Run — every token pops in as the scanner emits it
      </p>
    );
  }
  const visible =
    stepIndex >= 0 ? result.tokens.filter((t) => t.step <= stepIndex) : result.tokens;

  return (
    <div className="flex flex-wrap items-start gap-2 p-4" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {visible.map((t, i) => (
          <motion.span
            key={`${t.step}-${i}`}
            layout
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 font-mono text-xs ring-1",
              paletteFor(t.type),
            )}
            title={`${t.type} at ${t.line}:${t.col}`}
          >
            <span className="text-[9px] font-bold tracking-wider uppercase opacity-60">
              {t.type}
            </span>
            <span className="font-medium">{t.lexeme.replace(/\n/g, "\\n")}</span>
          </motion.span>
        ))}
      </AnimatePresence>
      {visible.length === 0 && (
        <p className="text-sm text-ink-300">no tokens emitted yet — step forward</p>
      )}
    </div>
  );
}

/* ── Token table ───────────────────────────────────────────── */

export function TokenTable({ result }: { result: ScanResult | null }) {
  if (!result || result.tokens.length === 0) {
    return <p className="p-6 text-center text-sm text-ink-300">no tokens — run the scanner</p>;
  }

  const counts = new Map<string, number>();
  for (const t of result.tokens) counts.set(t.type, (counts.get(t.type) ?? 0) + 1);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left font-mono text-xs">
        <thead>
          <tr className="border-b border-line text-[10px] tracking-widest text-ink-500 uppercase">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Token</th>
            <th className="px-4 py-2">Lexeme</th>
            <th className="px-4 py-2">Line:Col</th>
          </tr>
        </thead>
        <tbody>
          {result.tokens.map((t, i) => (
            <tr key={i} className="border-b border-line/40 hover:bg-paper-1">
              <td className="px-4 py-1.5 text-ink-300 tabular-nums">{i + 1}</td>
              <td className="px-4 py-1.5">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold ring-1",
                    paletteFor(t.type),
                  )}
                >
                  {t.type}
                </span>
              </td>
              <td className="px-4 py-1.5 text-ink-900">
                &quot;{t.lexeme.replace(/\n/g, "\\n")}&quot;
              </td>
              <td className="px-4 py-1.5 text-ink-500 tabular-nums">
                {t.line}:{t.col}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-wrap gap-2 px-4 py-3">
        {[...counts.entries()].map(([type, n]) => (
          <span
            key={type}
            className={cn("rounded-full px-2 py-0.5 font-mono text-[10px] ring-1", paletteFor(type))}
          >
            {type} × {n}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Generated C ───────────────────────────────────────────── */

export function GeneratedC({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => {
          navigator.clipboard?.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }}
        className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 font-mono text-[10px] text-term-text/70 ring-1 ring-white/15 hover:text-term-text"
        aria-label="Copy generated C code"
      >
        {copied ? <Check className="size-3 text-leaf-300" /> : <Copy className="size-3" />}
        {copied ? "copied" : "copy"}
      </button>
      <pre className="max-h-96 overflow-auto bg-term p-4 font-mono text-[12px] leading-5 text-term-text">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ── AI suggestions ────────────────────────────────────────── */

const KIND_META = {
  fix: { icon: Wrench, cls: "bg-coral-100 text-coral-700", label: "Fix" },
  improve: { icon: Sparkles, cls: "bg-cobalt-100 text-cobalt-700", label: "Improve" },
  learn: { icon: Lightbulb, cls: "bg-marigold-100 text-marigold-700", label: "Insight" },
} as const;

export function Suggestions({ suggestions }: { suggestions: Suggestion[] }) {
  return (
    <div className="space-y-3 p-4">
      {suggestions.map((s, i) => {
        const meta = KIND_META[s.kind];
        return (
          <motion.div
            key={`${s.title}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex gap-3 rounded-lg bg-paper-1 p-3.5 ring-1 ring-line/60"
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full",
                meta.cls,
              )}
            >
              <meta.icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink-900">
                <span className="mr-2 text-[10px] font-bold tracking-widest uppercase opacity-50">
                  {meta.label}
                </span>
                {s.title}
              </p>
              <p className="mt-1 text-[13px] leading-6 text-ink-500">{s.detail}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Errors ────────────────────────────────────────────────── */

export function ErrorsList({
  spec,
  result,
}: {
  spec: LexSpec | null;
  result: ScanResult | null;
}) {
  const specErrors = spec?.diagnostics ?? [];
  const scanErrors = result?.errors ?? [];

  if (specErrors.length === 0 && scanErrors.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-ink-300">
        no problems — spec compiles, all input matched
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line/40">
      {specErrors.map((d, i) => (
        <li key={`spec-${i}`} className="flex items-start gap-2.5 px-4 py-2.5">
          <AlertCircle
            className={cn(
              "mt-0.5 size-4 shrink-0",
              d.severity === "error" ? "text-coral-500" : "text-marigold-500",
            )}
          />
          <span className="font-mono text-xs leading-5">
            <span className="text-ink-900">{d.message}</span>
            <span className="ml-2 text-ink-300">spec line {d.line}</span>
          </span>
        </li>
      ))}
      {scanErrors.map((e, i) => (
        <li key={`scan-${i}`} className="flex items-start gap-2.5 px-4 py-2.5">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-coral-500" />
          <span className="font-mono text-xs leading-5">
            <span className="text-ink-900">
              no rule matches &quot;{e.char === "\n" ? "\\n" : e.char}&quot;
            </span>
            <span className="ml-2 text-ink-300">
              input {e.line}:{e.col}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
