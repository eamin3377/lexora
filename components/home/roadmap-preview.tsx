"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

interface Milestone {
  label: string;
  lessons: number;
  hours: number;
  x: number; // % along the svg viewBox
  y: number;
  color: string;
  bg: string;
  ring: string;
}

const MILESTONES: Milestone[] = [
  { label: "Regex", lessons: 8, hours: 3, x: 4, y: 62, color: "text-leaf-700", bg: "bg-leaf-100", ring: "ring-leaf-300" },
  { label: "Automata", lessons: 10, hours: 4, x: 17, y: 26, color: "text-leaf-700", bg: "bg-leaf-100", ring: "ring-leaf-300" },
  { label: "Lex / Flex", lessons: 12, hours: 6, x: 31, y: 66, color: "text-marigold-700", bg: "bg-marigold-100", ring: "ring-marigold-300" },
  { label: "Grammars", lessons: 9, hours: 4, x: 45, y: 24, color: "text-cobalt-700", bg: "bg-cobalt-100", ring: "ring-cobalt-300" },
  { label: "Parsing", lessons: 14, hours: 8, x: 59, y: 62, color: "text-cobalt-700", bg: "bg-cobalt-100", ring: "ring-cobalt-300" },
  { label: "Semantics", lessons: 8, hours: 5, x: 72, y: 26, color: "text-orchid-700", bg: "bg-orchid-100", ring: "ring-orchid-300" },
  { label: "Backend", lessons: 11, hours: 7, x: 85, y: 64, color: "text-orchid-700", bg: "bg-orchid-100", ring: "ring-orchid-300" },
  { label: "Capstone", lessons: 13, hours: 20, x: 96, y: 30, color: "text-leaf-700", bg: "bg-leaf-200", ring: "ring-leaf-300" },
];

const PATH =
  "M 40 155 C 90 155, 120 65, 170 65 S 250 165, 310 165 S 390 60, 450 60 S 530 155, 590 155 S 670 65, 720 65 S 800 160, 850 160 S 930 75, 960 75";

export function RoadmapPreview() {
  const [active, setActive] = React.useState<number | null>(null);

  return (
    <section className="overflow-hidden border-y border-line bg-paper-1 py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            One path. <span className="marker-underline text-leaf-700">Zero setup.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-ink-500">
            Eight milestones from your first regular expression to a compiler
            you built yourself.
          </p>
        </Reveal>

        {/* Desktop winding trail */}
        <div className="relative mt-16 hidden h-64 lg:block">
          <svg
            viewBox="0 0 1000 250"
            className="absolute inset-0 size-full"
            fill="none"
            aria-hidden
          >
            <motion.path
              d={PATH}
              stroke="#A8AEA2"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="1 10"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>

          {MILESTONES.map((m, i) => (
            <motion.button
              key={m.label}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.3 + i * 0.09,
              }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              aria-label={`${m.label}: ${m.lessons} lessons, about ${m.hours} hours`}
            >
              <span
                className={cn(
                  "relative flex size-14 items-center justify-center rounded-full ring-2 transition-all duration-200",
                  m.bg,
                  m.ring,
                  active === i ? "scale-110 shadow-e2" : "shadow-e1",
                )}
              >
                <span className={cn("font-display text-sm font-bold", m.color)}>{i + 1}</span>
                {i === MILESTONES.length - 1 && (
                  <span className="absolute inset-1.5 rounded-full ring-2 ring-leaf-500/60" />
                )}
              </span>
              <span className="mt-2 block text-center text-xs font-semibold text-ink-700">
                {m.label}
              </span>

              <AnimatePresence>
                {active === i && (
                  <motion.span
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 z-10 mt-2 w-36 -translate-x-1/2 rounded-lg bg-ink-900 px-3 py-2 text-center text-xs text-paper-0 shadow-e3"
                  >
                    <span className="font-semibold">{m.lessons} lessons</span>
                    <span className="block text-paper-0/60">~{m.hours}h · interactive</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Mobile / tablet stepper */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:hidden">
          {MILESTONES.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.05}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-xl p-3 ring-1 shadow-e1",
                  m.bg,
                  m.ring,
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full bg-card font-display text-xs font-bold",
                    m.color,
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">{m.label}</p>
                  <p className="text-[11px] text-ink-500">{m.lessons} lessons</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
