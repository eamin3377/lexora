"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";

interface StreakFlameProps {
  days: number;
  className?: string;
}

export function StreakFlame({ days, className }: StreakFlameProps) {
  const lit = days > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold",
        lit ? "bg-marigold-100 text-marigold-700" : "bg-paper-2 text-ink-500",
        className,
      )}
      title={lit ? `${days}-day learning streak` : "Start your streak today"}
    >
      <motion.span
        animate={lit ? { scale: [1, 1.15, 1] } : undefined}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex"
      >
        <Flame
          className={cn("size-4", lit ? "fill-marigold-300 text-marigold-500" : "text-ink-300")}
        />
      </motion.span>
      {lit ? `${days}-day streak` : "No streak yet"}
    </span>
  );
}
