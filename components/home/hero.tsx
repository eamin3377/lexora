"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

const PaperScene = dynamic(() => import("@/components/three/paper-scene"), {
  ssr: false,
  loading: () => <div className="size-full" />,
});

const HEADLINE = ["See", "the", "machine"];

const FLOATERS = [
  { char: "{", left: "6%", top: "16%", delay: "0s" },
  { char: ";", left: "12%", top: "74%", delay: "1.2s" },
  { char: "ε", left: "50%", top: "8%", delay: "0.6s" },
  { char: "+", left: "88%", top: "26%", delay: "1.8s" },
  { char: "id", left: "82%", top: "78%", delay: "0.3s" },
];

export function Hero() {
  return (
    <section className="bg-sunrise paper-grain relative overflow-hidden pt-16">
      {FLOATERS.map((f) => (
        <span
          key={f.char + f.left}
          aria-hidden
          className="animate-drift-slow absolute hidden rounded-lg bg-card px-3 py-1.5 font-mono text-sm text-ink-500 shadow-[4px_4px_0_#E3DDCE] ring-1 ring-line md:block"
          style={{ left: f.left, top: f.top, animationDelay: f.delay }}
        >
          {f.char}
        </span>
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
    </section>
  );
}
