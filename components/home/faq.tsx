"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

const FAQS = [
  {
    q: "Do I need to know C before starting?",
    a: "No. The Foundations and Lexical tracks assume zero C knowledge — you learn regex and automata visually first. C appears naturally in the Lex and Bison tracks, and every code example comes with a runnable playground and an AI tutor that explains any line you don't understand.",
  },
  {
    q: "Does it work on my phone?",
    a: "Yes. Every lesson is designed mobile-first — reading, quizzes, and watching animations work perfectly on a phone. The full Playground and terminal are positioned as companion experiences on larger screens, but you can always read, review, and keep your streak on mobile.",
  },
  {
    q: "Is the terminal running real tools?",
    a: "Yes. The terminal runs actual Flex, Bison, and GCC compiled to WebAssembly. When you type `flex calc.l`, real Flex runs in your browser and produces a real `lex.yy.c`. No simulation, no mocks — just zero install.",
  },
  {
    q: "What if I get stuck on a concept?",
    a: "Every lesson has a three-rung hint ladder: a nudge, a concept replay (the relevant animation snippet), and a personalized AI hint that references your exact wrong attempt. The AI tutor is also available on every page, grounded in whatever tool state you're looking at.",
  },
  {
    q: "Can my university use this for a course?",
    a: "Yes — the Edu plan includes classroom dashboards, autograded assignments, LMS integration (LTI 1.3), and per-concept cohort heatmaps that show instructors exactly where the class is struggling. Contact us for department-level rollout.",
  },
  {
    q: "Is the free tier actually free?",
    a: "Forever. Every visualizer, every playground, and the first two tracks are free with no time limit. We never paywall the shareable tools — that's the growth engine, and it stays open. Pro adds the full curriculum, projects, AI tutor, and certificates.",
  },
  {
    q: "How is this different from Compiler Explorer (godbolt)?",
    a: "Compiler Explorer is a brilliant tool for experts. Lexora is a school. We cover the entire journey from regex to executable with a teaching layer, structured curriculum, interactive visualizations, and an AI tutor — godbolt is for checking your output; Lexora is for understanding it.",
  },
  {
    q: "Can I share what I build?",
    a: "Every visualizer state is a shareable URL — the diagram itself becomes the link preview. Publish your capstone project to the gallery with a live, runnable demo embed. Build your own mini language and share a REPL that anyone can try.",
  },
];

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section className="mx-auto max-w-[760px] px-4 py-28 sm:px-8">
      <Reveal>
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Questions, <span className="marker-underline text-marigold-700">answered.</span>
        </h2>
      </Reveal>

      <div className="mt-12 divide-y divide-line overflow-hidden rounded-xl bg-card shadow-e1 ring-1 ring-line/60">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={faq.q} delay={i * 0.04}>
              <div>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-6 py-5 text-left"
                >
                  <span
                    className={cn(
                      "h-6 w-1 shrink-0 rounded-full transition-colors duration-200",
                      isOpen ? "bg-leaf-500" : "bg-transparent",
                    )}
                  />
                  <span className="flex-1 font-display text-lg font-semibold text-ink-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-ink-500 transition-transform duration-200",
                      isOpen && "rotate-180 text-leaf-500",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.65, 0, 0.35, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 pl-[2.75rem] text-[15px] leading-7 text-ink-500">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
