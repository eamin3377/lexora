"use client";

import * as React from "react";
import MonacoEditor, { useMonaco, type Monaco } from "@monaco-editor/react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useIde } from "@/lib/playground/store";

/* ── Custom themes matching the Lexora palette ─────────────── */

let themesDefined = false;

function defineThemes(monaco: Monaco) {
  if (themesDefined) return;
  themesDefined = true;
  monaco.editor.defineTheme("lexora-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8a9184", fontStyle: "italic" },
      { token: "keyword", foreground: "7fa3f0" },
      { token: "number", foreground: "f8c468" },
      { token: "string", foreground: "66c39a" },
      { token: "type", foreground: "cd94e1" },
    ],
    colors: {
      "editor.background": "#23281f",
      "editor.foreground": "#f2efe4",
      "editor.lineHighlightBackground": "#2b3126",
      "editorLineNumber.foreground": "#6b7267",
      "editorLineNumber.activeForeground": "#f2efe4",
      "editorCursor.foreground": "#f5a623",
      "editor.selectionBackground": "#3b6fe055",
      "editorIndentGuide.background1": "#2b3126",
      "minimap.background": "#1f241c",
    },
  });
  monaco.editor.defineTheme("lexora-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "a8aea2", fontStyle: "italic" },
      { token: "keyword", foreground: "2a52b0" },
      { token: "number", foreground: "a66a08" },
      { token: "string", foreground: "1e7a50" },
      { token: "type", foreground: "8a3fa8" },
    ],
    colors: {
      "editor.background": "#fdfbf7",
      "editor.foreground": "#1a1f16",
      "editor.lineHighlightBackground": "#f7f3ea",
      "editorLineNumber.foreground": "#a8aea2",
      "editorCursor.foreground": "#f5a623",
      "editor.selectionBackground": "#d8e2fa",
    },
  });
}

/* ── Tabs ──────────────────────────────────────────────────── */

function TabBar() {
  const { state, setActive, closeTab } = useIde();

  return (
    <div
      role="tablist"
      aria-label="Open editors"
      className="flex shrink-0 items-end overflow-x-auto bg-black/20"
    >
      {state.tabs.map((name) => {
        const active = state.active === name;
        const dirty = state.dirty.includes(name);
        return (
          <div
            key={name}
            role="tab"
            aria-selected={active}
            className={cn(
              "group flex shrink-0 cursor-pointer items-center gap-2 border-t-2 px-3.5 py-2 font-mono text-xs transition-colors",
              active
                ? "border-marigold-500 bg-term text-term-text"
                : "border-transparent text-term-text/50 hover:text-term-text/80",
            )}
            onClick={() => setActive(name)}
          >
            {name}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(name);
              }}
              aria-label={`Close ${name}`}
              className={cn(
                "flex size-4 items-center justify-center rounded hover:bg-white/15",
                dirty && "text-marigold-500",
              )}
            >
              {dirty ? (
                <span className="size-2 rounded-full bg-marigold-500 group-hover:hidden" />
              ) : null}
              <X className={cn("size-3", dirty && "hidden group-hover:block")} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ── Single editor ─────────────────────────────────────────── */

function Editor({ fileName }: { fileName: string }) {
  const { state, updateContent } = useIde();
  const monaco = useMonaco();
  const file = state.files.find((f) => f.name === fileName);

  // push diagnostics into Monaco markers for this file
  React.useEffect(() => {
    if (!monaco || !file) return;
    const model = monaco.editor
      .getModels()
      .find((m) => m.uri.path.endsWith(`/${file.name}`));
    if (!model) return;
    const markers = (state.result?.diagnostics ?? [])
      .filter((d) => d.file === file.name)
      .map((d) => ({
        startLineNumber: d.line,
        startColumn: d.column,
        endLineNumber: d.line,
        endColumn: d.column + 6,
        message: `[${d.source}] ${d.message}`,
        severity:
          d.severity === "error"
            ? monaco.MarkerSeverity.Error
            : d.severity === "warning"
              ? monaco.MarkerSeverity.Warning
              : monaco.MarkerSeverity.Info,
      }));
    monaco.editor.setModelMarkers(model, "lexora", markers);
  }, [monaco, file, state.result]);

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-sm text-term-text/30">
        no file open — pick one in the Explorer
      </div>
    );
  }

  return (
    <MonacoEditor
      path={file.name}
      language={file.language}
      value={file.content}
      theme={state.settings.theme}
      beforeMount={defineThemes}
      onChange={(value) => updateContent(file.name, value ?? "")}
      loading={
        <div className="flex h-full items-center justify-center font-mono text-xs text-term-text/40">
          loading editor…
        </div>
      }
      options={{
        fontSize: state.settings.fontSize,
        fontFamily: "var(--font-jetbrains), ui-monospace, monospace",
        minimap: { enabled: state.settings.minimap },
        wordWrap: state.settings.wordWrap ? "on" : "off",
        tabSize: state.settings.tabSize,
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        scrollBeyondLastLine: false,
        renderLineHighlight: "all",
        padding: { top: 12 },
        automaticLayout: true,
      }}
    />
  );
}

/* ── Editor group: tabs + editor (+ optional split) ────────── */

export function EditorPane() {
  const { state } = useIde();

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <TabBar />
      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          <Editor fileName={state.active} />
        </div>
        {state.splitFile && (
          <>
            <div className="w-px shrink-0 bg-white/10" />
            <div className="hidden min-w-0 flex-1 md:block">
              <div className="flex items-center bg-black/20 px-3.5 py-1.5 font-mono text-[11px] text-term-text/50">
                {state.splitFile} · split
              </div>
              <div className="h-[calc(100%-1.75rem)]">
                <Editor fileName={state.splitFile} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
