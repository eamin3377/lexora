"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Binary,
  BookOpen,
  Braces,
  ChevronDown,
  Cpu,
  GitBranch,
  Regex,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Track {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  dot: string;
  progress: number;
  lessons: { title: string; done: boolean }[];
}

const TRACKS: Track[] = [
  {
    id: "foundations",
    label: "Foundations",
    icon: Regex,
    dot: "bg-leaf-500",
    progress: 80,
    lessons: [
      { title: "Strings & languages", done: true },
      { title: "Regular expressions", done: true },
      { title: "NFA → DFA", done: true },
      { title: "Minimization", done: false },
    ],
  },
  {
    id: "lexical",
    label: "Lexical Analysis",
    icon: Binary,
    dot: "bg-marigold-500",
    progress: 45,
    lessons: [
      { title: "Tokens & lexemes", done: true },
      { title: "Longest match", done: true },
      { title: "Flex specs", done: false },
      { title: "Start conditions", done: false },
    ],
  },
  {
    id: "syntax",
    label: "Syntax & Parsing",
    icon: GitBranch,
    dot: "bg-cobalt-500",
    progress: 10,
    lessons: [
      { title: "Context-free grammars", done: true },
      { title: "FIRST & FOLLOW", done: false },
      { title: "LL(1) parsing", done: false },
      { title: "LR family", done: false },
    ],
  },
  {
    id: "semantics",
    label: "Semantics & IR",
    icon: Braces,
    dot: "bg-orchid-500",
    progress: 0,
    lessons: [
      { title: "ASTs & symbol tables", done: false },
      { title: "Type checking", done: false },
      { title: "Three-address code", done: false },
    ],
  },
  {
    id: "backend",
    label: "Optimization & Codegen",
    icon: Cpu,
    dot: "bg-leaf-500",
    progress: 0,
    lessons: [
      { title: "Constant folding", done: false },
      { title: "Register allocation", done: false },
    ],
  },
];

export function Sidebar({ className }: { className?: string }) {
  const [openId, setOpenId] = React.useState<string | null>("lexical");

  return (
    <aside
      className={cn(
        "flex w-72 shrink-0 flex-col gap-1 rounded-lg bg-card p-3 shadow-e1 ring-1 ring-line/60",
        className,
      )}
      aria-label="Curriculum"
    >
      <div className="mb-2 flex items-center gap-2 px-2 pt-1">
        <BookOpen className="size-4 text-ink-500" />
        <span className="text-xs font-semibold tracking-widest text-ink-500 uppercase">
          Curriculum
        </span>
      </div>

      {TRACKS.map((track) => {
        const open = openId === track.id;
        const Icon = track.icon;
        return (
          <div key={track.id}>
            <button
              onClick={() => setOpenId(open ? null : track.id)}
              aria-expanded={open}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-left transition-colors",
                open ? "bg-paper-1" : "hover:bg-paper-1/60",
              )}
            >
              <span className={cn("size-2 shrink-0 rounded-full", track.dot)} />
              <Icon className="size-4 shrink-0 text-ink-500" />
              <span className="flex-1 truncate text-sm font-medium text-ink-900">
                {track.label}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 text-ink-300 transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.65, 0, 0.35, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 mb-2 ml-[1.35rem] border-l border-line pl-4">
                    <Progress value={track.progress} className="mt-1 mb-2 w-24" />
                    {track.lessons.map((lesson) => (
                      <Link
                        key={lesson.title}
                        href="#"
                        className="group flex items-center gap-2 rounded px-2 py-1.5 text-[13px] text-ink-700 hover:bg-paper-1 hover:text-ink-900"
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full ring-2 ring-offset-1",
                            lesson.done
                              ? "bg-leaf-500 ring-leaf-200"
                              : "bg-transparent ring-line",
                          )}
                        />
                        {lesson.title}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <div className="mt-auto space-y-1 border-t border-line/60 pt-3">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-ink-700 hover:bg-paper-1"
        >
          <RefreshCw className="size-4 text-marigold-500" />
          Daily review
          <span className="ml-auto rounded-full bg-marigold-100 px-2 py-0.5 text-[11px] font-bold text-marigold-700">
            8 due
          </span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-ink-700 hover:bg-paper-1"
        >
          <Sparkles className="size-4 text-cobalt-500" />
          Ask the tutor
        </Link>
      </div>
    </aside>
  );
}
