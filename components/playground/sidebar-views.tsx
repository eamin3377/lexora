"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CaseSensitive,
  ChevronDown,
  FileCode2,
  FileText,
  Map as MapIcon,
  Moon,
  Search,
  Sun,
  WrapText,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useIde } from "@/lib/playground/store";

/* ── file icon ─────────────────────────────────────────────── */

function FileIcon({ name }: { name: string }) {
  if (name.endsWith(".l")) return <FileCode2 className="size-4 text-marigold-500" />;
  if (name.endsWith(".y")) return <FileCode2 className="size-4 text-cobalt-300" />;
  if (name.endsWith(".c")) return <FileCode2 className="size-4 text-leaf-300" />;
  if (name.endsWith(".md")) return <FileText className="size-4 text-orchid-300" />;
  return <FileText className="size-4 text-term-text/40" />;
}

/* ── Explorer ──────────────────────────────────────────────── */

export function ExplorerView() {
  const { state, openFile } = useIde();
  const [open, setOpen] = React.useState(true);

  return (
    <div className="flex h-full flex-col">
      <p className="px-4 py-2.5 text-[11px] font-semibold tracking-widest text-term-text/50 uppercase">
        Explorer
      </p>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold tracking-wider text-term-text/70 uppercase hover:text-term-text"
        aria-expanded={open}
      >
        <ChevronDown className={cn("size-3.5 transition-transform", !open && "-rotate-90")} />
        calc-workspace
      </button>
      {open && (
        <div className="mt-0.5">
          {state.files.map((f) => (
            <button
              key={f.name}
              onClick={() => openFile(f.name)}
              onDoubleClick={() => openFile(f.name, true)}
              title={`${f.name} — double-click to open to the side`}
              className={cn(
                "flex w-full items-center gap-2 px-4 py-1.5 text-left font-mono text-[13px] transition-colors",
                state.active === f.name
                  ? "bg-white/10 text-term-text"
                  : "text-term-text/70 hover:bg-white/5 hover:text-term-text",
              )}
            >
              <FileIcon name={f.name} />
              {f.name}
              {state.dirty.includes(f.name) && (
                <span className="ml-auto size-1.5 rounded-full bg-marigold-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Search ────────────────────────────────────────────────── */

interface Match {
  file: string;
  line: number;
  text: string;
}

export function SearchView() {
  const { state, goToProblem } = useIde();
  const [query, setQuery] = React.useState("");
  const [caseSensitive, setCaseSensitive] = React.useState(false);

  const matches = React.useMemo<Match[]>(() => {
    if (query.trim().length < 2) return [];
    const found: Match[] = [];
    const q = caseSensitive ? query : query.toLowerCase();
    for (const f of state.files) {
      const lines = f.content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const hay = caseSensitive ? lines[i] : lines[i].toLowerCase();
        if (hay.includes(q)) found.push({ file: f.name, line: i + 1, text: lines[i].trim() });
        if (found.length >= 50) return found;
      }
    }
    return found;
  }, [query, caseSensitive, state.files]);

  const byFile = React.useMemo(() => {
    const m = new Map<string, Match[]>();
    for (const match of matches) {
      m.set(match.file, [...(m.get(match.file) ?? []), match]);
    }
    return m;
  }, [matches]);

  return (
    <div className="flex h-full flex-col">
      <p className="px-4 py-2.5 text-[11px] font-semibold tracking-widest text-term-text/50 uppercase">
        Search
      </p>
      <div className="px-3">
        <div className="flex items-center gap-1 rounded-md bg-black/25 px-2 ring-1 ring-white/10 focus-within:ring-cobalt-500/70">
          <Search className="size-3.5 shrink-0 text-term-text/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workspace"
            aria-label="Search all files"
            className="w-full bg-transparent py-1.5 font-mono text-[13px] text-term-text placeholder:text-term-text/30 focus:outline-none"
          />
          <button
            onClick={() => setCaseSensitive((v) => !v)}
            aria-pressed={caseSensitive}
            title="Match case"
            className={cn(
              "rounded p-0.5",
              caseSensitive ? "bg-cobalt-500/40 text-term-text" : "text-term-text/40 hover:text-term-text",
            )}
          >
            <CaseSensitive className="size-4" />
          </button>
        </div>
        {query.trim().length >= 2 && (
          <p className="mt-2 text-[11px] text-term-text/50">
            {matches.length} result{matches.length === 1 ? "" : "s"}
          </p>
        )}
      </div>
      <div className="mt-1 min-h-0 flex-1 overflow-y-auto pb-2">
        {[...byFile.entries()].map(([file, fileMatches]) => (
          <div key={file}>
            <p className="flex items-center gap-2 px-4 pt-2 pb-1 font-mono text-xs text-term-text/70">
              <FileIcon name={file} />
              {file}
            </p>
            {fileMatches.map((m, i) => (
              <button
                key={`${m.line}-${i}`}
                onClick={() => goToProblem(m.file)}
                className="flex w-full items-baseline gap-2 px-6 py-1 text-left hover:bg-white/5"
              >
                <span className="shrink-0 font-mono text-[11px] text-term-text/40 tabular-nums">
                  {m.line}
                </span>
                <span className="truncate font-mono text-xs text-term-text/80">{m.text}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Settings ──────────────────────────────────────────────── */

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5">
      <span className="text-[13px] text-term-text/80">{label}</span>
      {children}
    </div>
  );
}

function Toggle({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative h-5 w-9 rounded-full transition-colors",
        on ? "bg-leaf-500" : "bg-white/15",
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={cn(
          "absolute top-0.5 size-4 rounded-full bg-white shadow",
          on ? "left-[18px]" : "left-0.5",
        )}
      />
    </button>
  );
}

export function SettingsView() {
  const { state, patchSettings } = useIde();
  const s = state.settings;

  return (
    <div className="flex h-full flex-col">
      <p className="px-4 py-2.5 text-[11px] font-semibold tracking-widest text-term-text/50 uppercase">
        Settings
      </p>

      <p className="px-4 pt-1 pb-1 text-[11px] font-bold tracking-wider text-term-text/40 uppercase">
        Appearance
      </p>
      <SettingRow label="Color theme">
        <div className="flex overflow-hidden rounded-md ring-1 ring-white/10">
          {(
            [
              { id: "lexora-dark", icon: Moon, label: "Dark" },
              { id: "lexora-light", icon: Sun, label: "Light" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => patchSettings({ theme: t.id })}
              aria-pressed={s.theme === t.id}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-[11px] font-semibold",
                s.theme === t.id
                  ? "bg-cobalt-500/40 text-term-text"
                  : "text-term-text/50 hover:text-term-text",
              )}
            >
              <t.icon className="size-3" />
              {t.label}
            </button>
          ))}
        </div>
      </SettingRow>
      <SettingRow label="Font size">
        <div className="flex items-center gap-2">
          <button
            onClick={() => patchSettings({ fontSize: Math.max(10, s.fontSize - 1) })}
            className="size-6 rounded bg-white/10 text-term-text hover:bg-white/20"
            aria-label="Decrease font size"
          >
            −
          </button>
          <span className="w-6 text-center font-mono text-xs text-term-text tabular-nums">
            {s.fontSize}
          </span>
          <button
            onClick={() => patchSettings({ fontSize: Math.min(22, s.fontSize + 1) })}
            className="size-6 rounded bg-white/10 text-term-text hover:bg-white/20"
            aria-label="Increase font size"
          >
            +
          </button>
        </div>
      </SettingRow>

      <p className="px-4 pt-3 pb-1 text-[11px] font-bold tracking-wider text-term-text/40 uppercase">
        Editor
      </p>
      <SettingRow label="Minimap">
        <span className="flex items-center gap-2">
          <MapIcon className="size-3.5 text-term-text/40" />
          <Toggle
            on={s.minimap}
            onClick={() => patchSettings({ minimap: !s.minimap })}
            label="Toggle minimap"
          />
        </span>
      </SettingRow>
      <SettingRow label="Word wrap">
        <span className="flex items-center gap-2">
          <WrapText className="size-3.5 text-term-text/40" />
          <Toggle
            on={s.wordWrap}
            onClick={() => patchSettings({ wordWrap: !s.wordWrap })}
            label="Toggle word wrap"
          />
        </span>
      </SettingRow>
      <SettingRow label="Tab size">
        <div className="flex overflow-hidden rounded-md ring-1 ring-white/10">
          {[2, 4, 8].map((n) => (
            <button
              key={n}
              onClick={() => patchSettings({ tabSize: n })}
              aria-pressed={s.tabSize === n}
              className={cn(
                "px-2.5 py-1 font-mono text-[11px]",
                s.tabSize === n
                  ? "bg-cobalt-500/40 text-term-text"
                  : "text-term-text/50 hover:text-term-text",
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </SettingRow>
    </div>
  );
}
