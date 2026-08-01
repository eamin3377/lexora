"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Columns2,
  Command,
  Files,
  GitBranch,
  Loader2,
  Play,
  Search,
  Settings,
  TerminalSquare,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { IdeProvider, useIde } from "@/lib/playground/store";
import { EditorPane } from "@/components/playground/editor-pane";
import { BottomPanel, PanelClosedStrip } from "@/components/playground/bottom-panel";
import { CommandPalette } from "@/components/playground/command-palette";
import { Resizer } from "@/components/playground/resizer";
import {
  ExplorerView,
  SearchView,
  SettingsView,
} from "@/components/playground/sidebar-views";

/* ── Activity bar ──────────────────────────────────────────── */

function ActivityBar() {
  const { state, toggleSidebar, setPaletteOpen } = useIde();

  const items = [
    { id: "explorer" as const, icon: Files, label: "Explorer (Ctrl+B)" },
    { id: "search" as const, icon: Search, label: "Search (Ctrl+Shift+F)" },
    { id: "settings" as const, icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-white/10 bg-black/25 py-2">
      {items.map((item) => {
        const active = state.sidebar === item.id;
        return (
          <button
            key={item.id}
            onClick={() => toggleSidebar(item.id)}
            title={item.label}
            aria-pressed={active}
            className={cn(
              "relative flex size-10 items-center justify-center rounded-md transition-colors",
              active ? "text-term-text" : "text-term-text/40 hover:text-term-text/80",
            )}
          >
            {active && (
              <motion.span
                layoutId="activity-indicator"
                className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-marigold-500"
              />
            )}
            <item.icon className="size-5" />
          </button>
        );
      })}
      <button
        onClick={() => setPaletteOpen(true)}
        title="Command palette (Ctrl+Shift+P)"
        className="mt-auto flex size-10 items-center justify-center rounded-md text-term-text/40 hover:text-term-text/80"
      >
        <Command className="size-5" />
      </button>
    </div>
  );
}

/* ── Title bar ─────────────────────────────────────────────── */

function TitleBar() {
  const { state, run, toggleSplit, setPaletteOpen } = useIde();

  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-black/25 px-3 py-1.5">
      <div className="flex items-center gap-1.5">
        {["bg-coral-500", "bg-marigold-500", "bg-leaf-500"].map((c) => (
          <span key={c} className={cn("size-2.5 rounded-full opacity-80", c)} />
        ))}
      </div>

      <button
        onClick={() => setPaletteOpen(true)}
        className="mx-auto hidden w-72 items-center justify-center gap-2 rounded-md bg-white/5 px-3 py-1 font-mono text-[11px] text-term-text/40 ring-1 ring-white/10 transition-colors hover:text-term-text/70 sm:flex"
      >
        <Search className="size-3" />
        calc-workspace — lexora playground
        <kbd className="rounded bg-black/30 px-1 text-[9px] ring-1 ring-white/10">Ctrl⇧P</kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
        <button
          onClick={toggleSplit}
          title="Toggle split editor (Ctrl+\)"
          aria-pressed={!!state.splitFile}
          className={cn(
            "hidden rounded-md p-1.5 transition-colors md:block",
            state.splitFile
              ? "bg-white/10 text-term-text"
              : "text-term-text/40 hover:text-term-text/80",
          )}
        >
          <Columns2 className="size-4" />
        </button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={run}
          disabled={state.running}
          title="Run (Ctrl+Enter)"
          className="flex items-center gap-1.5 rounded-md bg-leaf-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-leaf-700 disabled:opacity-60"
        >
          {state.running ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Play className="size-3.5 fill-white" />
          )}
          Run
        </motion.button>
      </div>
    </div>
  );
}

/* ── Status bar ────────────────────────────────────────────── */

function StatusBar() {
  const { state, setPanelTab } = useIde();
  const errors = state.result?.diagnostics.filter((d) => d.severity === "error").length ?? 0;
  const warnings = state.result?.diagnostics.filter((d) => d.severity === "warning").length ?? 0;
  const file = state.files.find((f) => f.name === state.active);

  return (
    <div className="flex shrink-0 items-center gap-4 border-t border-white/10 bg-cobalt-700 px-3 py-1 font-mono text-[11px] text-white/90">
      <span className="flex items-center gap-1">
        <GitBranch className="size-3" />
        main
      </span>
      <button
        onClick={() => setPanelTab("problems")}
        className="flex items-center gap-2 hover:text-white"
        aria-label="Show problems"
      >
        <span className="flex items-center gap-1">
          <AlertCircle className="size-3" />
          {errors}
        </span>
        <span className="flex items-center gap-1">
          <AlertTriangle className="size-3" />
          {warnings}
        </span>
      </button>
      {state.running && (
        <span className="flex items-center gap-1 text-marigold-300">
          <Loader2 className="size-3 animate-spin" />
          building…
        </span>
      )}
      <span className="ml-auto hidden sm:block">
        {file?.language ?? "plaintext"} · UTF-8 · Spaces: {state.settings.tabSize}
      </span>
      <button
        onClick={() => setPanelTab("terminal")}
        className="flex items-center gap-1 hover:text-white"
        aria-label="Show terminal"
      >
        <TerminalSquare className="size-3" />
        zsh
      </button>
    </div>
  );
}

/* ── Shortcuts ─────────────────────────────────────────────── */

function useShortcuts() {
  const ide = useIde();
  const ref = React.useRef(ide);
  ref.current = ide;

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) {
        if (e.key === "Escape") ref.current.setPaletteOpen(false);
        return;
      }
      const k = e.key.toLowerCase();
      if (e.shiftKey && k === "p") {
        e.preventDefault();
        ref.current.setPaletteOpen(true);
      } else if (e.shiftKey && k === "f") {
        e.preventDefault();
        ref.current.toggleSidebar("search");
      } else if (k === "enter") {
        e.preventDefault();
        ref.current.run();
      } else if (k === "b") {
        e.preventDefault();
        ref.current.toggleSidebar("explorer");
      } else if (k === "s") {
        e.preventDefault();
        ref.current.save();
      } else if (k === "`") {
        e.preventDefault();
        ref.current.togglePanel("terminal");
      } else if (k === "\\") {
        e.preventDefault();
        ref.current.toggleSplit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

/* ── Shell ─────────────────────────────────────────────────── */

function IdeShell() {
  const { state, setSidebarWidth, setPanelHeight } = useIde();
  useShortcuts();

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl bg-term shadow-device ring-1 ring-white/10">
      <TitleBar />
      <div className="flex min-h-0 flex-1">
        <ActivityBar />

        {state.sidebar && (
          <>
            <aside
              style={{ width: state.sidebarWidth }}
              className="absolute inset-y-9 left-12 z-30 shrink-0 overflow-y-auto border-r border-white/10 bg-term-panel md:static md:inset-auto"
              aria-label="Side bar"
            >
              {state.sidebar === "explorer" && <ExplorerView />}
              {state.sidebar === "search" && <SearchView />}
              {state.sidebar === "settings" && <SettingsView />}
            </aside>
            <Resizer
              direction="horizontal"
              onDelta={(d) => setSidebarWidth(state.sidebarWidth + d)}
              className="hidden md:block"
            />
          </>
        )}

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <EditorPane />
          {state.panelOpen && (
            <Resizer
              direction="vertical"
              onDelta={(d) => setPanelHeight(state.panelHeight - d)}
            />
          )}
          <BottomPanel />
          <PanelClosedStrip />
        </main>
      </div>
      <StatusBar />
      <CommandPalette />
    </div>
  );
}

export function Ide() {
  return (
    <IdeProvider>
      <div className="mx-auto h-[calc(100vh-4rem)] max-w-[1500px] px-3 pt-20 pb-4 sm:px-6">
        <IdeShell />
      </div>
    </IdeProvider>
  );
}
