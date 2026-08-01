"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface LogoMarkProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export function LogoMark({ size = 32, animated = false, className }: LogoMarkProps) {
  const draw = animated
    ? {
        initial: { pathLength: 0 },
        animate: { pathLength: 1 },
      }
    : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      className={cn("text-ink-900", className)}
      aria-label="Lexora"
      role="img"
    >
      <motion.circle
        cx="48"
        cy="56"
        r="26"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        {...draw}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx="48"
        cy="56"
        r="16"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        {...draw}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d="M66 36 C72 24, 66 8, 55 9 C45 10, 44 22, 51 27"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        {...draw}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx="60"
        cy="8"
        r="6"
        className="fill-leaf-500"
        initial={animated ? { scale: 0 } : undefined}
        animate={animated ? { scale: 1 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 1.1 }}
      />
    </svg>
  );
}

export function LogoLockup({ className, markSize = 30 }: { className?: string; markSize?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={markSize} />
      <span className="font-display text-xl font-bold tracking-tight text-ink-900">
        lexora<span className="text-leaf-500">.</span>
      </span>
    </span>
  );
}
