"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { TokenType } from "@/lib/lexer";

function tokenStyle(type: TokenType): string {
  switch (type) {
    case "keyword":
      return "bg-cobalt-100 text-cobalt-700 ring-cobalt-300/50";
    case "identifier":
      return "bg-leaf-100 text-leaf-700 ring-leaf-300/50";
    case "number":
      return "bg-marigold-100 text-marigold-700 ring-marigold-300/50";
    case "string":
      return "bg-leaf-200 text-leaf-700 ring-leaf-300/50";
    case "operator":
      return "bg-orchid-100 text-orchid-700 ring-orchid-300/50";
    case "punctuation":
      return "bg-paper-2 text-ink-500 ring-line";
    case "comment":
      return "bg-paper-1 text-ink-300 ring-line italic";
    case "unknown":
      return "bg-coral-100 text-coral-700 ring-coral-300/60 ring-dashed";
  }
}

function tokenLabel(type: TokenType): string {
  switch (type) {
    case "keyword":
      return "KW";
    case "identifier":
      return "ID";
    case "number":
      return "NUM";
    case "string":
      return "STR";
    case "operator":
      return "OP";
    case "punctuation":
      return "PUNCT";
    case "comment":
      return "CMT";
    case "unknown":
      return "ERR";
  }
}

interface TokenChipProps {
  type: TokenType;
  value: string;
  showLabel?: boolean;
  index?: number;
  className?: string;
}

export function TokenChip({
  type,
  value,
  showLabel = true,
  index = 0,
  className,
}: TokenChipProps) {
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
        tokenStyle(type),
        className,
      )}
    >
      {showLabel && (
        <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">
          {tokenLabel(type)}
        </span>
      )}
      <span className="font-medium">{value}</span>
    </motion.span>
  );
}
