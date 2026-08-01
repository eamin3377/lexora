"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Columns2,
  FileCode2,
  Map as MapIcon,
  Moon,
  PanelBottom,
  PanelLeft,
  Play,
  Save,
  Search,
  Settings,
  Sun,
  TerminalSquare,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useIde } from "@/lib/playground/store";

interface Command {
  id: string;
  label: string;
  hint?: string;
  keys?: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
}

export function CommandPalette() {
  const ide = useIde();
  const { state, setPaletteOpen } = ide;
  const [query, setQuery] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commands = React.useMemo<Command[]>(() => {
    const fileCommands: Command[] = state.files.map((f) => ({
      id: `open-${f.name}`,
      label: `Open: ${f.name}`,
      hint: "file",
      icon: FileCode2,
      run: () => ide.openFile(f.name),
    }));
    return [
      { id: "run", label: "Run: Build & Execute", keys: "Ctrl+Enter", icon: Play, run: ide.run },
      { id: "save", label: "File: Save All", keys: "Ctrl+S", icon: Save, run: () => ide.save() },
      { id: "split", label: "View: Toggle Split Editor", keys: "Ctrl+\\", icon: Columns2, run: ide.toggleSplit },
      { id: "explorer", label: "View: Toggle Explorer", keys: "Ctrl+B", icon: PanelLeft, run: () => ide.toggleSidebar("explorer") },
      { id: "search", label: "View: Search in Files", keys: "Ctrl+Shift+F", icon: Search, run: () => ide.toggleSidebar("search") },
      { id: "settings", label: "View: Open Settings", icon: Settings, run: () => ide.toggleSidebar("settings") },
      { id: "panel", label: "View: Toggle Panel", keys: "Ctrl+`", icon: PanelBottom, run: () => ide.togglePanel() },
      { id: "terminal", label: "Terminal: Focus Terminal", icon: TerminalSquare, run: () => ide.setPanelTab("terminal") },
      { id: "minimap", label: `View: ${state.settings.minimap ? "Hide" : "Show"} Minimap`, icon: MapIcon, run: () => ide.patchSettings({ minimap: !state.settings.minimap }) },
      {
        id: "theme",
        label: `Theme: Switch to ${state.settings.theme === "lexora-dark" ? "Light" : "Dark"}`,
        icon: state.settings.theme === "lexora-dark" ? Sun : Moon,
        run: () =>
          ide.patchSettings({
            theme: state.settings.theme === "lexora-dark" ? "lexora-light" : "lexora-dark",
          }),
      },
      ...fileCommands,
    ];
  }, [ide, state.files, state.settings]);

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  React.useEffect(() => {
    if (state.paletteOpen) {
      setQuery("");
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [state.paletteOpen]);

  React.useEffect(() => {
    setIndex(0);
  }, [query]);

  const execute = (cmd: Command) => {
    setPaletteOpen(false);
    cmd.run();
  };

  return (
    <AnimatePresence>
      {state.paletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/30"
            onClick={() => setPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-10 left-1/2 z-50 w-[min(560px,90%)] -translate-x-1/2 overflow-hidden rounded-lg bg-term-panel shadow-e3 ring-1 ring-white/15"
            role="dialog"
            aria-label="Command palette"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setIndex((i) => Math.min(filtered.length - 1, i + 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setIndex((i) => Math.max(0, i - 1));
                } else if (e.key === "Enter" && filtered[index]) {
                  execute(filtered[index]);
                } else if (e.key === "Escape") {
                  setPaletteOpen(false);
                }
              }}
              placeholder="Type a command or file name…"
              aria-label="Command input"
              className="w-full border-b border-white/10 bg-transparent px-4 py-3 font-mono text-sm text-term-text placeholder:text-term-text/30 focus:outline-none"
            />
            <ul className="max-h-72 overflow-y-auto py-1" role="listbox">
              {filtered.length === 0 && (
                <li className="px-4 py-3 font-mono text-xs text-term-text/40">
                  no matching commands
                </li>
              )}
              {filtered.map((cmd, i) => (
                <li key={cmd.id} role="option" aria-selected={i === index}>
                  <button
                    onClick={() => execute(cmd)}
                    onMouseEnter={() => setIndex(i)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2 text-left text-[13px]",
                      i === index ? "bg-cobalt-500/30 text-term-text" : "text-term-text/70",
                    )}
                  >
                    <cmd.icon className="size-4 shrink-0 text-term-text/50" />
                    <span className="flex-1">{cmd.label}</span>
                    {cmd.hint && (
                      <span className="text-[10px] text-term-text/30 uppercase">{cmd.hint}</span>
                    )}
                    {cmd.keys && (
                      <kbd className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-term-text/50 ring-1 ring-white/10">
                        {cmd.keys}
                      </kbd>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
