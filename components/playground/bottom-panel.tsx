"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, AlertTriangle, ChevronDown, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useIde, type PanelTab } from "@/lib/playground/store";

const TABS: { id: PanelTab; label: string }[] = [
  { id: "problems", label: "Problems" },
  { id: "terminal", label: "Terminal" },
  { id: "output", label: "Output" },
  { id: "console", label: "Console" },
];

function ProblemsView() {
  const { state, goToProblem } = useIde();
  const diagnostics = state.result?.diagnostics ?? [];

  if (diagnostics.length === 0) {
    return (
      <p className="px-4 py-6 text-center font-mono text-xs text-term-text/40">
        {state.result ? "No problems detected — clean build." : "Run the toolchain to populate problems."}
      </p>
    );
  }

  return (
    <ul className="py-1">
      {diagnostics.map((d, i) => (
        <li key={`${d.file}-${d.line}-${i}`}>
          <button
            onClick={() => goToProblem(d.file)}
            className="flex w-full items-start gap-2.5 px-4 py-1.5 text-left hover:bg-white/5"
          >
            {d.severity === "error" ? (
              <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-coral-500" />
            ) : d.severity === "warning" ? (
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-marigold-500" />
            ) : (
              <Info className="mt-0.5 size-3.5 shrink-0 text-cobalt-300" />
            )}
            <span className="min-w-0 flex-1 font-mono text-xs leading-5">
              <span className="text-term-text">{d.message}</span>
              <span className="ml-2 text-term-text/40">
                {d.file}:{d.line}:{d.column} · {d.source}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function TerminalView() {
  const { state } = useIde();
  const endRef = React.useRef<HTMLDivElement>(null);
  const lines = state.result?.terminal.slice(0, state.terminalCursor) ?? [];

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [state.terminalCursor]);

  return (
    <div className="px-4 py-2 font-mono text-xs leading-6">
      {lines.length === 0 && !state.running && (
        <p className="text-term-text/40">
          learner@lexora:~/calc — press Run (Ctrl+Enter) to build
        </p>
      )}
      {lines.map((l, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className={cn(
            l.kind === "cmd" && "text-term-text",
            l.kind === "out" && "text-term-text/70",
            l.kind === "err" && "text-coral-300",
            l.kind === "ok" && "text-leaf-300",
          )}
        >
          {l.kind === "cmd" && <span className="mr-2 text-leaf-300">$</span>}
          {l.text}
        </motion.p>
      ))}
      {state.running && (
        <span className="animate-blink inline-block h-3.5 w-2 translate-y-0.5 bg-term-text" />
      )}
      <div ref={endRef} />
    </div>
  );
}

function OutputView() {
  const { state } = useIde();
  const output = state.result?.output ?? [];

  return (
    <div className="px-4 py-2 font-mono text-xs leading-6">
      {output.length === 0 ? (
        <p className="text-term-text/40">program output appears here after a successful run</p>
      ) : (
        output.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={cn(line.startsWith("error") ? "text-coral-300" : "text-leaf-300")}
          >
            {line}
          </motion.p>
        ))
      )}
    </div>
  );
}

function ConsoleView() {
  const { state } = useIde();
  const lines = state.result?.consoleLines ?? [];

  return (
    <div className="px-4 py-2 font-mono text-xs leading-6">
      {lines.length === 0 ? (
        <p className="text-term-text/40">runtime trace — reductions, yyerror calls, exit codes</p>
      ) : (
        lines.map((l, i) => (
          <p
            key={i}
            className={cn(
              l.level === "log" && "text-term-text/70",
              l.level === "warn" && "text-marigold-300",
              l.level === "error" && "text-coral-300",
            )}
          >
            <span className="mr-2 text-term-text/30">{String(i + 1).padStart(2, "0")}</span>
            {l.text}
          </p>
        ))
      )}
    </div>
  );
}

export function BottomPanel() {
  const { state, setPanelTab, togglePanel } = useIde();
  const problems = state.result?.diagnostics.length ?? 0;

  return (
    <AnimatePresence initial={false}>
      {state.panelOpen && (
        <motion.section
          initial={{ height: 0 }}
          animate={{ height: state.panelHeight }}
          exit={{ height: 0 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="flex shrink-0 flex-col overflow-hidden border-t border-white/10 bg-term-panel"
          aria-label="Panel"
        >
          <div className="flex shrink-0 items-center gap-1 border-b border-white/5 px-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPanelTab(tab.id)}
                aria-selected={state.panelTab === tab.id}
                role="tab"
                className={cn(
                  "relative px-3 py-2 text-[11px] font-semibold tracking-wider uppercase transition-colors",
                  state.panelTab === tab.id
                    ? "text-term-text"
                    : "text-term-text/40 hover:text-term-text/70",
                )}
              >
                {tab.label}
                {tab.id === "problems" && problems > 0 && (
                  <span className="ml-1.5 rounded-full bg-coral-500/80 px-1.5 font-mono text-[10px] text-white">
                    {problems}
                  </span>
                )}
                {state.panelTab === tab.id && (
                  <motion.span
                    layoutId="panel-tab-indicator"
                    className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-marigold-500"
                  />
                )}
              </button>
            ))}
            <button
              onClick={() => togglePanel()}
              aria-label="Hide panel"
              className="ml-auto rounded p-1 text-term-text/40 hover:bg-white/10 hover:text-term-text"
            >
              <ChevronDown className="size-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {state.panelTab === "problems" && <ProblemsView />}
            {state.panelTab === "terminal" && <TerminalView />}
            {state.panelTab === "output" && <OutputView />}
            {state.panelTab === "console" && <ConsoleView />}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

export function PanelClosedStrip() {
  const { state, setPanelTab } = useIde();
  if (state.panelOpen) return null;
  const problems = state.result?.diagnostics.length ?? 0;
  return (
    <button
      onClick={() => setPanelTab(state.panelTab)}
      className="flex shrink-0 items-center gap-2 border-t border-white/10 bg-term-panel px-4 py-1 text-[11px] font-semibold tracking-wider text-term-text/40 uppercase hover:text-term-text"
    >
      <X className="size-3 rotate-45" />
      Panel
      {problems > 0 && (
        <span className="rounded-full bg-coral-500/80 px-1.5 font-mono text-[10px] text-white">
          {problems}
        </span>
      )}
    </button>
  );
}
