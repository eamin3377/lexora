"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const ACCENTS = {
  leaf: "bg-leaf-500",
  marigold: "bg-marigold-500",
  coral: "bg-coral-500",
  cobalt: "bg-cobalt-500",
  orchid: "bg-orchid-500",
} as const;

interface ProgressProps {
  value: number;
  accent?: keyof typeof ACCENTS;
  className?: string;
}

export function Progress({ value, accent = "leaf", className }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-paper-2", className)}
    >
      <motion.div
        className={cn("h-full rounded-full", ACCENTS[accent])}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
