"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Github, Twitter, Youtube } from "lucide-react";

import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const COLUMNS = [
  {
    title: "Learn",
    links: ["Roadmap", "Foundations", "Lexical Analysis", "Parsing", "Code Generation"],
  },
  {
    title: "Tools",
    links: ["Regex Lab", "Automata Visualizer", "Lex Machine", "Parser Theater", "Pipeline"],
  },
  {
    title: "Build",
    links: ["Projects", "Playground", "Gallery", "Challenges"],
  },
  {
    title: "Company",
    links: ["About", "Pricing", "Changelog", "Community"],
  },
];

const STAGES = ["#1A1F16", "#F5A623", "#3B6FE0", "#B25FD1", "#2F9E6E", "#3B6FE0", "#1A1F16"];

export function Footer() {
  const [subscribed, setSubscribed] = React.useState(false);

  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="mx-auto max-w-[1200px] px-4 pt-20 pb-8 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_320px]">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold tracking-widest text-ink-500 uppercase">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="group relative text-sm text-ink-700 hover:text-ink-900"
                      >
                        {link}
                        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-ink-700 transition-transform duration-200 group-hover:scale-x-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-widest text-ink-500 uppercase">
              The weekly token
            </h4>
            <p className="mt-3 text-sm leading-6 text-ink-500">
              One compiler idea, beautifully visualized. Every Tuesday.
            </p>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
            >
              <Input type="email" required placeholder="you@university.edu" className="bg-card" />
              <Button
                type="submit"
                className={subscribed ? "pointer-events-none" : ""}
                aria-label="Subscribe"
              >
                {subscribed ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check className="size-4" />
                  </motion.span>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Heartbeat rail */}
        <div className="relative mt-16 h-px w-full bg-line" aria-hidden>
          {STAGES.map((color, i) => (
            <span
              key={i}
              className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full opacity-40"
              style={{ left: `${(i / (STAGES.length - 1)) * 100}%`, backgroundColor: color }}
            />
          ))}
          <span className="animate-heartbeat absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-leaf-500 shadow-[0_0_8px_rgba(47,158,110,0.6)]" />
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <LogoMark size={22} />
            <p className="text-[13px] text-ink-500">
              © {new Date().getFullYear()} Lexora — see the machine think.
            </p>
          </div>
          <div className="flex items-center gap-4 text-ink-500">
            {[Github, Twitter, Youtube].map((Icon, i) => (
              <Link
                key={i}
                href="#"
                className="transition-transform duration-150 hover:-translate-y-0.5 hover:text-ink-900"
                aria-label="Social link"
              >
                <Icon className="size-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
