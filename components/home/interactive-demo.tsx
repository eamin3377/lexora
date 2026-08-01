"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

/**
 * DFA for the classic teaching regex (a|b)*abb
 * state 3 is the accepting state.
 */
const DFA: Record<number, { a: number; b: number }> = {
  0: { a: 1, b: 0 },
  1: { a: 1, b: 2 },
  2: { a: 1, b: 3 },
  3: { a: 1, b: 0 },
};

const ACCEPTING = 3;

const STATE_POS: Record<number, { x: number; y: number }> = {
  0: { x: 90, y: 110 },
  1: { x: 260, y: 110 },
  2: { x: 430, y: 110 },
  3: { x: 600, y: 110 },
};

interface Edge {
  from: number;
  to: number;
  label: string;
  curve: number; // vertical control offset; 0 = straight
}

const EDGES: Edge[] = [
  { from: 0, to: 1, label: "a", curve: 0 },
  { from: 1, to: 2, label: "b", curve: 0 },
  { from: 2, to: 3, label: "b", curve: 0 },
  { from: 0, to: 0, label: "b", curve: -64 },
  { from: 1, to: 1, label: "a", curve: -64 },
  { from: 2, to: 1, label: "a", curve: 58 },
  { from: 3, to: 1, label: "a", curve: 72 },
  { from: 3, to: 0, label: "b", curve: 92 },
];

function edgePath(e: Edge): string {
  const from = STATE_POS[e.from];
  const to = STATE_POS[e.to];
  if (e.from === e.to) {
    // self loop
    return `M ${from.x - 14} ${from.y - 26} C ${from.x - 30} ${from.y + e.curve}, ${from.x + 30} ${from.y + e.curve}, ${from.x + 14} ${from.y - 26}`;
  }
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 + e.curve;
  const sign = to.x > from.x ? 1 : -1;
  return `M ${from.x + sign * 30} ${from.y + (e.curve ? Math.sign(e.curve) * 18 : 0)} Q ${midX} ${midY}, ${to.x - sign * 30} ${to.y + (e.curve ? Math.sign(e.curve) * 18 : 0)}`;
}

function edgeLabelPos(e: Edge): { x: number; y: number } {
  const from = STATE_POS[e.from];
  const to = STATE_POS[e.to];
  if (e.from === e.to) return { x: from.x, y: from.y + e.curve * 0.72 - 14 };
  return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 + e.curve * 0.62 - 8 };
}

type Status = "idle" | "running" | "accepted" | "rejected" | "done";

export function InteractiveDemo() {
  const [input, setInput] = React.useState("aababb");
  const [cursor, setCursor] = React.useState(-1);
  const [state, setState] = React.useState(0);
  const [lastEdge, setLastEdge] = React.useState<string | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const [status, setStatus] = React.useState<Status>("idle");

  const reset = React.useCallback(() => {
    setCursor(-1);
    setState(0);
    setLastEdge(null);
    setPlaying(false);
    setStatus("idle");
  }, []);

  const step = React.useCallback(() => {
    const next = cursor + 1;
    if (next >= input.length) {
      setPlaying(false);
      setStatus(state === ACCEPTING ? "accepted" : "rejected");
      return;
    }
    const ch = input[next] as "a" | "b";
    const target = DFA[state][ch];
    setLastEdge(`${state}-${target}-${ch}`);
    setState(target);
    setCursor(next);
    if (next === input.length - 1) {
      setPlaying(false);
      setStatus(target === ACCEPTING ? "accepted" : "rejected");
    } else {
      setStatus("running");
    }
  }, [cursor, input, state]);

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(step, 650);
    return () => clearInterval(id);
  }, [playing, step]);

  const handleInput = (value: string) => {
    const clean = value.replace(/[^ab]/g, "").slice(0, 12);
    setInput(clean);
    reset();
  };

  const finished = status === "accepted" || status === "rejected";

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-28 sm:px-8">
      <Reveal>
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          This is the actual tool.{" "}
          <span className="marker-underline text-cobalt-700">Not a video.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-ink-500">
          The DFA for <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-base text-ink-900">(a|b)*abb</code>{" "}
          — feed it a string of <code className="font-mono">a</code>s and{" "}
          <code className="font-mono">b</code>s and watch it decide.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl bg-card shadow-device ring-1 ring-line">
          {/* device bezel */}
          <div className="flex items-center gap-1.5 border-b border-line bg-paper-1 px-4 py-3">
            {["bg-coral-300", "bg-marigold-300", "bg-leaf-300"].map((c) => (
              <span key={c} className={cn("size-2.5 rounded-full", c)} />
            ))}
            <span className="ml-3 font-mono text-xs text-ink-500">
              lexora · automata visualizer
            </span>
            <AnimatePresence>
              {finished && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                    status === "accepted"
                      ? "bg-leaf-100 text-leaf-700"
                      : "bg-coral-100 text-coral-700",
                  )}
                >
                  {status}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* input tape */}
          <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4">
            <span className="font-mono text-xs text-ink-500 uppercase tracking-wider">input</span>
            <div className="flex gap-1" role="group" aria-label="Input tape">
              {input.split("").map((ch, i) => (
                <motion.span
                  key={`${i}-${ch}`}
                  animate={{
                    scale: i === cursor ? 1.12 : 1,
                    y: i === cursor ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-md font-mono text-base ring-1 transition-colors",
                    i < cursor
                      ? "bg-marigold-100 text-marigold-700 ring-marigold-300/60"
                      : i === cursor
                        ? "bg-marigold-200 text-marigold-700 ring-marigold-500 shadow-e2"
                        : "bg-paper-1 text-ink-700 ring-line",
                  )}
                >
                  {ch}
                </motion.span>
              ))}
              {input.length === 0 && (
                <span className="text-sm text-ink-300">type a and b below…</span>
              )}
            </div>
            <input
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              spellCheck={false}
              aria-label="Edit input string (a and b only)"
              className="ml-auto h-9 w-36 rounded-md bg-paper-1 px-3 font-mono text-sm text-ink-900 ring-1 ring-line focus:ring-2 focus:ring-cobalt-500/60 focus:outline-none"
              placeholder="edit me"
            />
          </div>

          {/* automaton */}
          <div className="relative">
            <svg viewBox="0 0 690 220" className="w-full" role="img" aria-label="DFA state diagram">
              {EDGES.map((e) => {
                const active = lastEdge === `${e.from}-${e.to}-${e.label}`;
                const lp = edgeLabelPos(e);
                return (
                  <g key={`${e.from}-${e.to}-${e.label}`}>
                    <path
                      d={edgePath(e)}
                      fill="none"
                      stroke={active ? "#F5A623" : "#A8AEA2"}
                      strokeWidth={active ? 3 : 1.75}
                      strokeLinecap="round"
                      markerEnd="url(#arrow)"
                      className="transition-all duration-200"
                    />
                    <rect
                      x={lp.x - 11}
                      y={lp.y - 11}
                      width="22"
                      height="20"
                      rx="10"
                      fill={active ? "#FCEBCB" : "#F7F3EA"}
                      stroke={active ? "#F5A623" : "#E3DDCE"}
                    />
                    <text
                      x={lp.x}
                      y={lp.y + 3.5}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize="12"
                      fill={active ? "#A66A08" : "#6B7267"}
                    >
                      {e.label}
                    </text>
                  </g>
                );
              })}

              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#A8AEA2" />
                </marker>
              </defs>

              {/* start arrow */}
              <path
                d="M 28 110 L 56 110"
                stroke="#3D443B"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />

              {Object.entries(STATE_POS).map(([id, pos]) => {
                const sid = Number(id);
                const isActive = sid === state && cursor >= 0;
                const isStart = sid === 0 && cursor < 0;
                const accepting = sid === ACCEPTING;
                return (
                  <g key={id}>
                    <AnimatePresence>
                      {(isActive || isStart) && (
                        <motion.circle
                          key={`pulse-${state}-${cursor}`}
                          cx={pos.x}
                          cy={pos.y}
                          r={30}
                          fill="none"
                          stroke={finished ? (status === "accepted" ? "#2F9E6E" : "#FF6B5E") : "#F5A623"}
                          strokeWidth={2}
                          initial={{ scale: 1, opacity: 0.6 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.7 }}
                          style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                        />
                      )}
                    </AnimatePresence>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="28"
                      fill={isActive || isStart ? "#FCEBCB" : "#FFFFFF"}
                      stroke={isActive || isStart ? "#F5A623" : "#1A1F16"}
                      strokeWidth="2.5"
                      className="transition-all duration-200"
                    />
                    {accepting && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="21"
                        fill="none"
                        stroke={isActive ? "#F5A623" : "#1A1F16"}
                        strokeWidth="1.75"
                        className="transition-all duration-200"
                      />
                    )}
                    <text
                      x={pos.x}
                      y={pos.y + 5}
                      textAnchor="middle"
                      fontSize="15"
                      fontWeight="700"
                      fill="#1A1F16"
                      className="font-mono"
                    >
                      q{id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* transport */}
          <div className="flex flex-wrap items-center gap-2 border-t border-line bg-paper-1 px-4 py-3">
            <Button
              size="sm"
              disabled={input.length === 0}
              onClick={() => {
                if (finished) reset();
                setPlaying((p) => !p);
                if (status === "idle") setStatus("running");
              }}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
              {playing ? "Pause" : finished ? "Replay" : "Play"}
            </Button>
            <Button size="sm" variant="secondary" onClick={step} disabled={playing || finished || input.length === 0}>
              <StepForward className="size-4" />
              Step
            </Button>
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw className="size-4" />
              Reset
            </Button>
            <p className="ml-auto font-mono text-xs text-ink-500" aria-live="polite">
              {cursor < 0
                ? "ready — press play"
                : finished
                  ? status === "accepted"
                    ? `✓ ends in q${ACCEPTING} — string accepted`
                    : `✗ ends in q${state} — string rejected`
                  : `read '${input[cursor]}' → now in q${state}`}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
