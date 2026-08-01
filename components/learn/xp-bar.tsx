"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { levelFor } from "@/lib/learn/achievements";

interface XpBarProps {
  xp: number;
  className?: string;
  compact?: boolean;
}

export function XpBar({ xp, className, compact }: XpBarProps) {
  const { level, into, span, pct } = levelFor(xp);

  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900">
          <span className="flex size-6 items-center justify-center rounded-full bg-cobalt-100 font-display text-[11px] font-bold text-cobalt-700">
            {level}
          </span>
          {!compact && "Level"}
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-xs text-ink-500 tabular-nums">
          <TrendingUp className="size-3.5 text-cobalt-500" />
          {into.toLocaleString()} / {span.toLocaleString()} XP
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-2">
        <motion.div
          className="h-full rounded-full bg-cobalt-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
