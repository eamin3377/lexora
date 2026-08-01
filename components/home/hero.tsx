"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

const PaperScene = dynamic(() => import("@/components/three/paper-scene"), {
  ssr: false,
  loading: () => <div className="size-full" />,
});

const HEADLINE = ["See", "the", "machine"];

const FLOATERS = [
  { char: "{", left: "6%", top: "16%", delay: "0s", depth: 0.04 },
  { char: ";", left: "12%", top: "74%", delay: "1.2s", depth: 0.06 },
  { char: "ε", left: "50%", top: "8%", delay: "0.6s", depth: 0.03 },
  { char: "+", left: "88%", top: "26%", delay: "1.8s", depth: 0.05 },
  { char: "id", left: "82%", top: "78%", delay: "0.3s", depth: 0.07 },
  { char: "→", left: "24%", top: "50%", delay: "0.9s", depth: 0.05 },
  { char: "*", left: "72%", top: "52%", delay: "1.5s", depth: 0.04 },
];

interface FloaterProps {
  char: string;
  left: string;
  top: string;
  delay: string;
  depth: number;
  sx: ReturnType<typeof useSpring>;
  sy: ReturnType<typeof useSpring>;
}

function Floater({ char, left, top, delay, depth, sx, sy }: FloaterProps) {
  const tx = useTransform(sx, (v) => v * depth * 100);
  const ty = useTransform(sy, (v) => v * depth * 100);
  return (
    <motion.span
      aria-hidden
      style={{ x: tx, y: ty, left, top }}
      className="absolute hidden md:block"
    >
      <span
        style={{ animationDelay: delay }}
        className="animate-drift-slow inline-block rounded-lg bg-card px-3 py-1.5 font-mono text-sm text-ink-500 shadow-[4px_4px_0_#E3DDCE] ring-1 ring-line"
      >
        {char}
      </span>
    </motion.span>
  );
}

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });

  const onMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    my.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
  }, [mx, my]);

  const onLeave = React.useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <section
      className="bg-sunrise paper-grain relative overflow-hidden pt-16"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {FLOATERS.map((f) => (
        <Floater key={f.char + f.left} {...f} sx={sx} sy={sy} />
      ))}

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1200px] items-center gap-12 px-4 py-16 sm:px-8 lg:grid-cols-[45fr_55fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center rounded-full bg-leaf-100 px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-leaf-700 uppercase"
          >
            Interactive compiler school
          </motion.span>

          <h1 className="mt-5 font-display text-5xl leading-[1.05] font-bold tracking-tight text-ink-900 sm:text-6xl">
            {HEADLINE.map((word, i) => (
              <motion.span
                key={word}
                className="mr-3 inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              className="marker-underline inline-block text-leaf-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              think.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mt-6 max-w-md text-xl leading-8 text-ink-500"
          >
            Learn compilers by watching them work — regex to executable, every
            step animated, every concept touchable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button size="xl">
              Start learning free
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="xl" variant="ghost" className="group">
              <Play className="size-5" />
              Open a playground
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-10 flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              {["bg-leaf-300", "bg-cobalt-300", "bg-marigold-300"].map((c) => (
                <span
                  key={c}
                  className={`size-6 rounded-full ring-2 ring-paper-0 ${c}`}
                />
              ))}
            </div>
            <p className="text-sm text-ink-500">
              Joined by <span className="font-semibold text-ink-900">40,000+</span> students
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden h-[460px] lg:block"
        >
          <PaperScene className="absolute inset-0" />
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 lg:flex"
      >
        <span className="text-[11px] font-semibold tracking-widest text-ink-300 uppercase">
          scroll to compile
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex size-6 items-start justify-center rounded-full border border-ink-300 p-1"
        >
          <span className="size-1 rounded-full bg-ink-300" />
        </motion.span>
      </motion.div>
    </section>
  );
}
