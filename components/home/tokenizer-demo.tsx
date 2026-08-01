"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";

import { tokenize } from "@/lib/lexer";
import { Input } from "@/components/ui/input";
import { TokenChip } from "@/components/ui/token-chip";
import { Reveal } from "@/components/motion/reveal";

const EXAMPLES: { label: string; code: string }[] = [
  { label: "C", code: 'if (count >= 10) return "done";' },
  { label: "JS", code: "let total = price * 1.15; // tax" },
  { label: "SQL", code: "select name from users where age > 21;" },
];

export function TokenizerDemo() {
  const [source, setSource] = React.useState(EXAMPLES[0].code);
  const tokens = React.useMemo(() => tokenize(source), [source]);

  return (
    <section className="mx-auto max-w-[760px] px-4 py-28 sm:px-8">
      <Reveal>
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Type any code.{" "}
          <span className="marker-underline text-marigold-700">Watch it tokenize.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10">
          <div className="mb-3 flex justify-end gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setSource(ex.code)}
                className="rounded-full px-3 py-1 font-mono text-xs text-ink-500 ring-1 ring-line transition-colors hover:bg-paper-1 hover:text-ink-900"
              >
                {ex.label}
              </button>
            ))}
          </div>
          <Input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            spellCheck={false}
            aria-label="Code to tokenize"
            className="h-16 rounded-lg px-5 font-mono text-lg shadow-e2"
          />
        </div>
      </Reveal>

      <div className="mt-8 flex min-h-16 flex-wrap items-start gap-2" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {tokens
            .filter((t) => t.type !== "comment" || t.value.trim())
            .map((t, i) => (
              <TokenChip
                key={`${t.col}-${t.value}-${t.type}`}
                type={t.type}
                value={t.value}
                index={i}
              />
            ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
