"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LexSpec, ScanResult, ScanStep } from "@/lib/lex/engine";

interface RulesPanelProps {
  spec: LexSpec | null;
  result: ScanResult | null;
  stepIndex: number;
}

/**
 * Regex viewer + rule priority + longest-match visualization.
 * At each debug step, every candidate rule shows a bar proportional to
 * its match length; the winner (longest, then earliest) gets the crown.
 */
export function RulesPanel({ spec, result, stepIndex }: RulesPanelProps) {
  const current: ScanStep | undefined =
    result && stepIndex >= 0 ? result.steps[stepIndex] : undefined;

  const winCounts = React.useMemo(() => {
    const counts = new Map<number, number>();
    if (!result) return counts;
    const limit = stepIndex >= 0 ? stepIndex : result.steps.length - 1;
    for (let i = 0; i <= limit && i < result.steps.length; i++) {
      const w = result.steps[i].winnerRule;
      if (w !== null) counts.set(w, (counts.get(w) ?? 0) + 1);
    }
    return counts;
  }, [result, stepIndex]);

  if (!spec || spec.rules.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-ink-300">
        write rules between the %% markers and they will appear here
      </p>
    );
  }

  const maxLen = current ? Math.max(...current.candidates.map((c) => c.length), 1) : 1;

  return (
    <div className="divide-y divide-line/60">
      {spec.rules.map((rule) => {
        const candidate = current?.candidates.find((c) => c.ruleIndex === rule.index);
        const isWinner = current?.winnerRule === rule.index;
        const wins = winCounts.get(rule.index) ?? 0;
        return (
          <div
            key={rule.index}
            className={cn(
              "px-4 py-2.5 transition-colors",
              isWinner && "bg-marigold-100/60",
              rule.error && "bg-coral-100/40",
            )}
          >
            <div className="flex items-center gap-2.5">
              {/* priority number */}
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold ring-1",
                  isWinner
                    ? "bg-marigold-500 text-white ring-marigold-500"
                    : "bg-paper-1 text-ink-500 ring-line",
                )}
                title={`priority ${rule.index + 1} (earlier wins ties)`}
              >
                {rule.index + 1}
              </span>

              <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-ink-900">
                {rule.pattern}
              </code>

              {rule.tokenType ? (
                <span className="rounded-full bg-cobalt-100 px-2 py-0.5 font-mono text-[10px] font-bold text-cobalt-700">
                  {rule.tokenType}
                </span>
              ) : (
                <span className="rounded-full bg-paper-2 px-2 py-0.5 font-mono text-[10px] text-ink-500">
                  skip
                </span>
              )}

              {wins > 0 && (
                <span
                  className="font-mono text-[10px] text-ink-300 tabular-nums"
                  title={`${wins} step win${wins > 1 ? "s" : ""} so far`}
                >
                  ×{wins}
                </span>
              )}
              {isWinner && <Crown className="size-3.5 shrink-0 text-marigold-500" />}
            </div>

            {/* expanded regex, when different */}
            {rule.expanded !== rule.pattern && (
              <p className="mt-1 truncate pl-8 font-mono text-[11px] text-ink-300">
                ⤷ {rule.expanded}
              </p>
            )}
            {rule.error && (
              <p className="mt-1 pl-8 font-mono text-[11px] text-coral-700">{rule.error}</p>
            )}

            {/* longest-match bar at the current step */}
            {candidate && (
              <div className="mt-1.5 flex items-center gap-2 pl-8">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(candidate.length / maxLen) * 100}%` }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "h-full rounded-full",
                      isWinner ? "bg-marigold-500" : "bg-ink-300",
                    )}
                  />
                </div>
                <span className="w-14 shrink-0 font-mono text-[10px] text-ink-500 tabular-nums">
                  {candidate.length} char{candidate.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {current && current.candidates.length > 1 && (
        <p className="bg-paper-1 px-4 py-2 text-[11px] text-ink-500">
          {current.candidates.length} rules matched here —{" "}
          {current.candidates.filter((c) => c.length === current.length).length > 1
            ? "equal lengths, so the earlier rule wins (priority)"
            : "the longest match wins (maximal munch)"}
        </p>
      )}
    </div>
  );
}
