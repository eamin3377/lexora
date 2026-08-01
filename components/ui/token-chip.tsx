"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { TokenType } from "@/lib/lexer";

const TOKEN_STYLES: Record<TokenType, string> = {
  keyword: "bg-cobalt-100 text-cobalt-700 ring-cobalt-300/50",
  identifier: "bg-leaf-100 text-leaf-700 ring-leaf-300/50",
  number: "bg-marigold-100 text-marigold-700 ring-marigold-300/50",
  string: "bg-leaf-200 text-leaf-700 ring-leaf-300/50",
  operator: "bg-orchid-100 text-orchid-700 ring-orchid-300/50",
  punctuation: "bg-paper-2 text-ink-500 ring-line",
  comment: "bg-paper-1 text-ink-300 ring-line italic",
  unknown: "bg-coral-100 text-coral-700 ring-coral-300/60 ring-dashed",
};

const TOKEN_LABELS: Record<TokenType, string> = {
  keyword: "KW",
  identifier: "ID",
  number: "NUM",
  string: "STR",
  operator: "OP",
  punctuation: "PUNCT",
  comment: "CMT",
  unknown: "ERR",
};

interface TokenChipProps {
  type: TokenType;
  value: string;
  showLabel?: boolean;
  index?: number;
  className?: string;
}

export function TokenChip({ type, value, showLabel = true, index = 0, className }: TokenChipProps) {
  return (
    <motion.span
      layout
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.6, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 20, delay: index * 0.03 }}
      title={`${type} · "${value}"`}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 font-mono text-xs ring-1",
        TOKEN_STYLES[type],
        className,
      )}
    >
      {showLabel && (
        <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">
          {TOKEN_LABELS[type]}
        </span>
      )}
      <span className="font-medium">{value}</span>
    </motion.span>
  );
}
