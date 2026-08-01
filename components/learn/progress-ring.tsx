"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const STROKES = {
  leaf: "#2F9E6E",
  marigold: "#F5A623",
  cobalt: "#3B6FE0",
  orchid: "#B25FD1",
  coral: "#FF6B5E",
} as const;

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  accent?: keyof typeof STROKES;
  className?: string;
  label?: React.ReactNode;
}

export function ProgressRing({
  value,
  size = 64,
  strokeWidth = 5,
  accent = "leaf",
  className,
  label,
}: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#EFE9DC"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={STROKES[accent]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - clamped / 100) }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold text-ink-900">
        {label ?? `${clamped}%`}
      </span>
    </div>
  );
}
