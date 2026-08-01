"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/learn/types";
import { Button } from "@/components/ui/button";

interface LessonQuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
  className?: string;
}

export function LessonQuiz({ questions, onComplete, className }: LessonQuizProps) {
  const [index, setIndex] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const q = questions[index];
  const answered = picked !== null;
  const correct = answered && picked === q.answer;

  const next = () => {
    if (index + 1 >= questions.length) {
      setDone(true);
      onComplete?.(score, questions.length);
    } else {
      setIndex(index + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const perfect = score === questions.length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "rounded-xl bg-card p-8 text-center shadow-e1 ring-1 ring-line/60",
          className,
        )}
      >
        <span
          className={cn(
            "mx-auto flex size-14 items-center justify-center rounded-full",
            perfect ? "bg-leaf-100" : "bg-marigold-100",
          )}
        >
          {perfect ? (
            <CheckCircle2 className="size-7 text-leaf-500" />
          ) : (
            <CheckCircle2 className="size-7 text-marigold-500" />
          )}
        </span>
        <p className="mt-4 font-display text-2xl font-bold text-ink-900">
          {score} / {questions.length}
        </p>
        <p className="mt-1 text-sm text-ink-500">
          {perfect ? "Perfect — the table is full." : "Solid. Replay the misses and try again."}
        </p>
        <Button variant="secondary" size="sm" className="mt-5" onClick={restart}>
          <RotateCcw className="size-4" />
          Retake quiz
        </Button>
      </motion.div>
    );
  }

  return (
    <div className={cn("rounded-xl bg-card shadow-e1 ring-1 ring-line/60", className)}>
      <div className="flex items-center justify-between border-b border-line/60 px-5 py-3">
        <span className="text-xs font-semibold tracking-widest text-ink-500 uppercase">
          Checkpoint
        </span>
        <span className="font-mono text-xs text-ink-500 tabular-nums">
          {index + 1} / {questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="p-5"
        >
          <p className="font-display text-lg font-semibold text-ink-900">{q.prompt}</p>

          <div className="mt-4 space-y-2">
            {q.options.map((option, i) => {
              const isPick = picked === i;
              const isAnswer = i === q.answer;
              return (
                <button
                  key={option}
                  disabled={answered}
                  onClick={() => {
                    setPicked(i);
                    if (i === q.answer) setScore((s) => s + 1);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm ring-1 transition-all",
                    !answered && "ring-line hover:bg-paper-1 hover:ring-ink-300",
                    answered && isAnswer && "bg-leaf-100 text-leaf-700 ring-leaf-300",
                    answered && isPick && !isAnswer && "bg-coral-100 text-coral-700 ring-coral-300",
                    answered && !isPick && !isAnswer && "opacity-50 ring-line",
                  )}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-paper-1 font-mono text-xs font-bold ring-1 ring-line">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {answered && isAnswer && <CheckCircle2 className="size-4 shrink-0" />}
                  {answered && isPick && !isAnswer && <XCircle className="size-4 shrink-0" />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div
                  className={cn(
                    "mt-4 rounded-lg p-4 text-sm leading-6",
                    correct ? "bg-leaf-100 text-leaf-700" : "bg-marigold-100 text-marigold-700",
                  )}
                >
                  <span className="font-semibold">{correct ? "Correct. " : "Not quite. "}</span>
                  {q.explanation}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" onClick={next}>
                    {index + 1 >= questions.length ? "Finish" : "Next question"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
