"use client";

import * as React from "react";

import { DEFAULT_FILES, type PlaygroundFile } from "./files";
import { runToolchain, type RunResult } from "./compiler";

export type PanelTab = "problems" | "terminal" | "output" | "console";
export type EditorTheme = "lexora-dark" | "lexora-light";

export interface IdeSettings {
  theme: EditorTheme;
  fontSize: number;
  minimap: boolean;
  wordWrap: boolean;
  tabSize: number;
}

interface IdeState {
  files: PlaygroundFile[];
  tabs: string[];
  active: string;
  splitFile: string | null;
  dirty: string[];
  sidebar: "explorer" | "search" | "settings" | null;
  sidebarWidth: number;
  panelOpen: boolean;
  panelHeight: number;
  panelTab: PanelTab;
  paletteOpen: boolean;
  running: boolean;
  result: RunResult | null;
  terminalCursor: number; // lines revealed so far (typewriter effect)
  settings: IdeSettings;
}

const INITIAL: IdeState = {
  files: DEFAULT_FILES,
  tabs: ["calc.l", "calc.y"],
  active: "calc.l",
  splitFile: null,
  dirty: [],
  sidebar: "explorer",
  sidebarWidth: 224,
  panelOpen: true,
  panelHeight: 224,
  panelTab: "terminal",
  paletteOpen: false,
  running: false,
  result: null,
  terminalCursor: 0,
  settings: {
    theme: "lexora-dark",
    fontSize: 13,
    minimap: true,
    wordWrap: false,
    tabSize: 4,
  },
};

interface IdeActions {
  openFile: (name: string, side?: boolean) => void;
  closeTab: (name: string) => void;
  setActive: (name: string) => void;
  updateContent: (name: string, content: string) => void;
  save: (name?: string) => void;
  toggleSidebar: (view: NonNullable<IdeState["sidebar"]>) => void;
  setSidebarWidth: (w: number) => void;
  togglePanel: (tab?: PanelTab) => void;
  setPanelHeight: (h: number) => void;
  setPanelTab: (tab: PanelTab) => void;
  setPaletteOpen: (open: boolean) => void;
  toggleSplit: () => void;
  run: () => void;
  patchSettings: (patch: Partial<IdeSettings>) => void;
  goToProblem: (file: string) => void;
}

interface IdeContextValue extends IdeActions {
  state: IdeState;
}

const IdeContext = React.createContext<IdeContextValue | null>(null);

export function IdeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<IdeState>(INITIAL);
  const revealTimer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    return () => {
      if (revealTimer.current) clearInterval(revealTimer.current);
    };
  }, []);

  const actions = React.useMemo<IdeActions>(() => {
    const openFile: IdeActions["openFile"] = (name, side) =>
      setState((s) => {
        if (side) return { ...s, splitFile: name };
        return {
          ...s,
          tabs: s.tabs.includes(name) ? s.tabs : [...s.tabs, name],
          active: name,
        };
      });

    return {
      openFile,
      closeTab: (name) =>
        setState((s) => {
          const tabs = s.tabs.filter((t) => t !== name);
          const active =
            s.active === name ? (tabs[tabs.length - 1] ?? tabs[0] ?? "") : s.active;
          return { ...s, tabs, active };
        }),
      setActive: (name) => setState((s) => ({ ...s, active: name })),
      updateContent: (name, content) =>
        setState((s) => ({
          ...s,
          files: s.files.map((f) => (f.name === name ? { ...f, content } : f)),
          dirty: s.dirty.includes(name) ? s.dirty : [...s.dirty, name],
        })),
      save: (name) =>
        setState((s) => ({
          ...s,
          dirty: name ? s.dirty.filter((d) => d !== name) : [],
        })),
      toggleSidebar: (view) =>
        setState((s) => ({ ...s, sidebar: s.sidebar === view ? null : view })),
      setSidebarWidth: (w) =>
        setState((s) => ({ ...s, sidebarWidth: Math.min(420, Math.max(160, w)) })),
      togglePanel: (tab) =>
        setState((s) => ({
          ...s,
          panelOpen: tab && s.panelTab !== tab ? true : !s.panelOpen,
          panelTab: tab ?? s.panelTab,
        })),
      setPanelHeight: (h) =>
        setState((s) => ({ ...s, panelHeight: Math.min(480, Math.max(120, h)) })),
      setPanelTab: (tab) => setState((s) => ({ ...s, panelTab: tab, panelOpen: true })),
      setPaletteOpen: (open) => setState((s) => ({ ...s, paletteOpen: open })),
      toggleSplit: () =>
        setState((s) => ({
          ...s,
          splitFile: s.splitFile ? null : (s.tabs.find((t) => t !== s.active) ?? s.active),
        })),
      run: () =>
        setState((s) => {
          if (s.running) return s;
          const result = runToolchain(s.files);
          if (revealTimer.current) clearInterval(revealTimer.current);
          // typewriter reveal of terminal lines
          revealTimer.current = setInterval(() => {
            setState((cur) => {
              if (!cur.result) return cur;
              if (cur.terminalCursor >= cur.result.terminal.length) {
                if (revealTimer.current) clearInterval(revealTimer.current);
                return { ...cur, running: false };
              }
              return { ...cur, terminalCursor: cur.terminalCursor + 1 };
            });
          }, 120);
          return {
            ...s,
            running: true,
            result,
            terminalCursor: 0,
            panelOpen: true,
            panelTab: result.ok ? "terminal" : "problems",
          };
        }),
      patchSettings: (patch) =>
        setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
      goToProblem: (file) =>
        setState((s) => ({
          ...s,
          tabs: s.tabs.includes(file) || !s.files.some((f) => f.name === file)
            ? s.tabs
            : [...s.tabs, file],
          active: s.files.some((f) => f.name === file) ? file : s.active,
        })),
    };
  }, []);

  const value = React.useMemo(() => ({ state, ...actions }), [state, actions]);

  return <IdeContext.Provider value={value}>{children}</IdeContext.Provider>;
}

export function useIde(): IdeContextValue {
  const ctx = React.useContext(IdeContext);
  if (!ctx) throw new Error("useIde must be used inside <IdeProvider>");
  return ctx;
}
