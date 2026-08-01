"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Binary,
  Braces,
  Cpu,
  FileCode2,
  GitBranch,
  Play,
  Rocket,
  ScanLine,
  Wand2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

const STAGES = [
  { label: "Source", icon: FileCode2, bg: "bg-paper-2", text: "text-ink-700", ring: "ring-line" },
  { label: "Lexer", icon: ScanLine, bg: "bg-marigold-100", text: "text-marigold-700", ring: "ring-marigold-300/50" },
  { label: "Parser", icon: GitBranch, bg: "bg-cobalt-100", text: "text-cobalt-700", ring: "ring-cobalt-300/50" },
  { label: "Semantics", icon: Braces, bg: "bg-orchid-100", text: "text-orchid-700", ring: "ring-orchid-300/50" },
  { label: "IR", icon: Binary, bg: "bg-orchid-100", text: "text-orchid-700", ring: "ring-orchid-300/50" },
  { label: "Optimizer", icon: Wand2, bg: "bg-leaf-100", text: "text-leaf-700", ring: "ring-leaf-300/50" },
  { label: "Codegen", icon: Cpu, bg: "bg-cobalt-100", text: "text-cobalt-700", ring: "ring-cobalt-300/50" },
  { label: "Assembly", icon: Binary, bg: "bg-paper-2", text: "text-ink-700", ring: "ring-line" },
  { label: "Run", icon: Rocket, bg: "bg-leaf-100", text: "text-leaf-700", ring: "ring-leaf-300/50" },
];

export function PipelineSection() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.35"],
  });
  const packetLeft = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setActiveIndex(Math.min(STAGES.length - 1, Math.floor(v * STAGES.length)));
    });
  }, [scrollYProgress]);

  return (
    <section className="bg-paper-1 py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            What happens when code <span className="marker-underline text-cobalt-700">compiles?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-ink-500">
            Nine stages, one journey. On Lexora every one of them is a living,
            scrubbable animation.
          </p>
        </Reveal>

        <div ref={ref} className="mt-16">
          {/* rail */}
          <div className="relative mb-10 hidden h-px bg-line lg:block">
            <motion.span
              style={{ left: packetLeft }}
              className="absolute top-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-leaf-500 shadow-[0_0_12px_rgba(47,158,110,0.8)]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 lg:grid-cols-9">
            {STAGES.map((stage, i) => {
              const active = i === activeIndex;
              return (
                <motion.div
                  key={stage.label}
                  animate={{
                    scale: active ? 1.08 : 1,
                    y: active ? -6 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl p-4 ring-1 transition-shadow",
                    stage.bg,
                    stage.ring,
                    active ? "shadow-e2" : "shadow-e1",
                  )}
                >
                  <stage.icon className={cn("size-6", stage.text)} />
                  <span className={cn("text-xs font-semibold", stage.text)}>{stage.label}</span>
                </motion.div>
              );
            })}
          </div>

          <Reveal delay={0.15}>
            <div className="mt-14 overflow-hidden rounded-xl bg-term shadow-device">
              <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
                {["bg-coral-500", "bg-marigold-500", "bg-leaf-500"].map((c) => (
                  <span key={c} className={cn("size-2.5 rounded-full opacity-80", c)} />
                ))}
                <span className="ml-3 font-mono text-xs text-term-text/50">
                  learner@lexora:~/calc
                </span>
              </div>
              <div className="p-6 font-mono text-sm leading-7">
                <p className="text-term-text/60">
                  <span className="text-leaf-300">$</span> flex calc.l && bison -d calc.y && gcc lex.yy.c calc.tab.c
                </p>
                <p className="text-term-text/60">
                  <span className="text-leaf-300">$</span> echo &quot;3 + 4 * 2&quot; | ./a.out
                </p>
                <p className="text-term-text">
                  <Play className="mr-2 inline size-3.5 text-leaf-300" />
                  11
                  <span className="animate-blink ml-1 inline-block h-4 w-2 translate-y-0.5 bg-term-text" />
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
