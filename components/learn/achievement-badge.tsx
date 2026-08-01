"use client";

import { motion } from "framer-motion";
import {
  Award,
  Bookmark,
  Flame,
  Gauge,
  ListChecks,
  Lock,
  PenLine,
  Rocket,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AchievementDef } from "@/lib/learn/types";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Bookmark,
  Flame,
  Gauge,
  ListChecks,
  PenLine,
  Rocket,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
};

const ACCENTS = {
  leaf: "bg-leaf-100 text-leaf-700 ring-leaf-300/60",
  marigold: "bg-marigold-100 text-marigold-700 ring-marigold-300/60",
  cobalt: "bg-cobalt-100 text-cobalt-700 ring-cobalt-300/60",
  orchid: "bg-orchid-100 text-orchid-700 ring-orchid-300/60",
  coral: "bg-coral-100 text-coral-700 ring-coral-300/60",
} as const;

interface AchievementBadgeProps {
  achievement: AchievementDef;
  unlocked: boolean;
  size?: "sm" | "lg";
  className?: string;
}

export function AchievementBadge({
  achievement,
  unlocked,
  size = "lg",
  className,
}: AchievementBadgeProps) {
  const Icon = ICONS[achievement.icon] ?? Award;
  const small = size === "sm";

  return (
    <motion.div
      whileHover={unlocked ? { y: -3 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl p-4 text-center ring-1",
        unlocked ? "bg-card ring-line/60 shadow-e1" : "bg-paper-1 ring-line/40 opacity-70",
        small && "p-3",
        className,
      )}
      title={achievement.description}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full ring-2",
          small ? "size-10" : "size-14",
          unlocked ? ACCENTS[achievement.accent] : "bg-paper-2 text-ink-300 ring-line",
        )}
      >
        {unlocked ? (
          <Icon className={small ? "size-5" : "size-6"} />
        ) : (
          <Lock className={small ? "size-4" : "size-5"} />
        )}
      </span>
      <div className="min-w-0">
        <p
          className={cn(
            "truncate font-display font-semibold",
            small ? "text-xs" : "text-sm",
            unlocked ? "text-ink-900" : "text-ink-500",
          )}
        >
          {achievement.title}
        </p>
        {!small && (
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-ink-500">
            {achievement.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
