"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { ScanResult, ScanStep } from "@/lib/lex/engine";

interface InputTapeProps {
  input: string;
  result: ScanResult | null;
  /** index into result.steps currently highlighted; -1 = all consumed */
  stepIndex: number;
}

/**
 * The input string rendered as a tape of cells. Consumed characters are
 * tinted by outcome, the current lexeme glows, and an animated cursor
 * tracks the scan position.
 */
export function InputTape({ input, result, stepIndex }: InputTapeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cursorCellRef = React.useRef<HTMLSpanElement>(null);

  const steps = result?.steps ?? [];
  const current: ScanStep | undefined =
    stepIndex >= 0 ? steps[stepIndex] : undefined;

  // position -> classification
  const cellState = React.useMemo(() => {
    const states = new Array<"pending" | "consumed" | "error" | "active">(input.length).fill(
      "pending",
    );
    if (!result) return states;
    const limit = stepIndex >= 0 ? stepIndex : steps.length - 1;
    for (let i = 0; i <= limit && i < steps.length; i++) {
      const s = steps[i];
      for (let p = s.pos; p < s.pos + s.length; p++) {
        states[p] = s.error ? "error" : "consumed";
      }
    }
    if (current) {
      for (let p = current.pos; p < current.pos + current.length; p++) {
        states[p] = current.error ? "error" : "active";
      }
    }
    return states;
  }, [input.length, result, steps, stepIndex, current]);

  const cursorPos = current ? current.pos + current.length : stepIndex === -1 && steps.length > 0 ? input.length : 0;

  React.useEffect(() => {
    cursorCellRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [cursorPos]);

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto rounded-lg bg-paper-1 p-3 ring-1 ring-line"
      aria-label="Input tape"
    >
      <div className="flex w-max items-center gap-px pb-1">
        {input.split("").map((ch, i) => {
          const state = cellState[i];
          const isCursor = i === cursorPos;
          return (
            <span key={i} ref={isCursor ? cursorCellRef : undefined} className="relative">
              {isCursor && (
                <motion.span
                  layoutId="tape-cursor"
                  transition={{ type: "spring", stiffness: 500, damping: 34 }}
                  className="absolute -inset-y-0.5 -left-px w-0.5 rounded-full bg-marigold-500"
                />
              )}
              <motion.span
                animate={{
                  scale: state === "active" ? 1.1 : 1,
                  y: state === "active" ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className={cn(
                  "flex h-8 w-6 items-center justify-center rounded font-mono text-sm",
                  ch === "\n" && "text-[9px]",
                  state === "pending" && "bg-card text-ink-500 ring-1 ring-line/60",
                  state === "consumed" && "bg-leaf-100 text-leaf-700 ring-1 ring-leaf-300/40",
                  state === "active" &&
                    "bg-marigold-200 text-marigold-700 ring-1 ring-marigold-500 shadow-e2",
                  state === "error" && "bg-coral-100 text-coral-700 ring-1 ring-coral-300",
                )}
              >
                {ch === " " ? "␣" : ch === "\n" ? "\\n" : ch === "\t" ? "\\t" : ch}
              </motion.span>
            </span>
          );
        })}
        {/* end-of-input cursor slot */}
        <span ref={cursorPos === input.length ? cursorCellRef : undefined} className="relative">
          {cursorPos === input.length && (
            <motion.span
              layoutId="tape-cursor"
              transition={{ type: "spring", stiffness: 500, damping: 34 }}
              className="absolute -inset-y-0.5 left-0 w-0.5 rounded-full bg-marigold-500"
            />
          )}
          <span className="flex h-8 w-6 items-center justify-center font-mono text-[10px] text-ink-300">
            EOF
          </span>
        </span>
      </div>

      {/* live status line */}
      <p className="mt-2 font-mono text-xs text-ink-500" aria-live="polite">
        {!result && "run the scanner to animate the tape"}
        {result && current && !current.error && (
          <>
            step {stepIndex + 1}/{steps.length} · matched{" "}
            <span className="font-bold text-marigold-700">
              &quot;{current.lexeme.replace(/\n/g, "\\n")}&quot;
            </span>{" "}
            with rule {(current.winnerRule ?? 0) + 1}
            {current.tokenType ? (
              <>
                {" "}
                → <span className="font-bold text-leaf-700">{current.tokenType}</span>
              </>
            ) : (
              <span className="text-ink-300"> → (skipped)</span>
            )}
          </>
        )}
        {result && current && current.error && (
          <span className="text-coral-700">
            step {stepIndex + 1}/{steps.length} · no rule matches &quot;{current.lexeme}&quot; —
            error
          </span>
        )}
        {result && !current && steps.length > 0 && (
          <>
            scan complete · {steps.length} steps · {result.tokens.length} tokens ·{" "}
            {result.errors.length} errors
          </>
        )}
      </p>
    </div>
  );
}
