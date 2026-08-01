"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I've taken compiler theory twice. It only clicked when I watched the maximal-munch rewind animation on Lexora. I literally said \"oh\" out loud.",
    name: "Anika Rahman",
    role: "CS junior · Dhaka",
    initials: "AR",
    accent: "bg-marigold-100 text-marigold-700",
  },
  {
    quote:
      "The LALR state-merge animation is the single best piece of educational software I've seen in 15 years of teaching.",
    name: "Prof. Daniel Rivera",
    role: "Instructor · UT Austin",
    initials: "DR",
    accent: "bg-cobalt-100 text-cobalt-700",
  },
  {
    quote:
      "Built my DSL in a weekend. The playground terminal running real flex and bison in the browser — no VM, no setup — is genuinely magical.",
    name: "Marcus Vogel",
    role: "Backend engineer · Berlin",
    initials: "MV",
    accent: "bg-leaf-100 text-leaf-700",
  },
  {
    quote:
      "Every shared visualizer state is a link. My regex-to-DFA post got 40k views because people could play with it, not just read it.",
    name: "Yuki Tanaka",
    role: "Senior engineer · Tokyo",
    initials: "YT",
    accent: "bg-orchid-100 text-orchid-700",
  },
  {
    quote:
      "My students stopped asking \"how do I install bison.\" They just open the playground and start. Office hours got interesting again.",
    name: "Dr. Priya Nair",
    role: "Assistant Professor · IIT Madras",
    initials: "PN",
    accent: "bg-coral-100 text-coral-700",
  },
];

export function Testimonials() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(id);
  }, [paused]);

  const t = TESTIMONIALS[index];

  return (
    <section className="bg-paper-1 py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-8">
        <Reveal>
          <Quote className="mx-auto size-12 text-ink-300" strokeWidth={1.5} />
        </Reveal>

        <div className="relative mt-6 min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="font-display text-2xl leading-relaxed font-medium text-ink-900 sm:text-3xl">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center justify-center gap-3">
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full font-display text-sm font-bold ring-2 ring-paper-1",
                    t.accent,
                  )}
                >
                  {t.initials}
                </span>
                <div className="text-left">
                  <p className="font-semibold text-ink-900">{t.name}</p>
                  <p className="text-sm text-ink-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="flex size-9 items-center justify-center rounded-full text-ink-500 ring-1 ring-line transition-all hover:bg-card hover:text-ink-900 hover:shadow-e1"
            aria-label="Previous testimonial"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === index ? "w-7 bg-ink-900" : "w-2 bg-ink-300 hover:bg-ink-500",
                )}
              />
            ))}
          </div>

          <button
            onClick={() => setIndex((i) => (i + 1) % TESTIMONIALS.length)}
            className="flex size-9 items-center justify-center rounded-full text-ink-500 ring-1 ring-line transition-all hover:bg-card hover:text-ink-900 hover:shadow-e1"
            aria-label="Next testimonial"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
