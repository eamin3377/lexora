# D05 — Playground & Terminal UI

## 1. Playground frame (`/playground/:id`)

Full-viewport app surface (no marketing footer). Recognizably VSCode-shaped, unmistakably Lexora-skinned: warm paper chrome, pill tabs, round-cornered docks with 8px gaps between zones (docks float on `paper-0` like cards — the "floating dock" look is the anti-Bootstrap move).

```
| Activity 48px | Side panel 280px | Editor group (flex) | Right dock 360px |
|                bottom dock 280px (spans side+editor+right)                |
|                       status bar 28px (full width)                       |
```
All docks: `card` fill, radius 12, e1, 1px hairline; 6px gap gutters; splitters per D01.

- **Activity bar:** 48px paper-1 column, icons 22px at 44px spacing; active = accent-100 squircle behind icon + 2px accent left pip that slides between items (150ms spring). Order: Explorer, Search, Problems (with count badge 14px coral), AI (leaf dot when suggestions ready), Docs, Settings (bottom).
- **Explorer:** tree rows 28px, 13px, indent guides 1px `line`; file icons: bespoke set — `.l` marigold lexeme glyph, `.y` cobalt grammar card, `.c` ink C-block, `Makefile` gear. Row hover: paper-2 wash; rename inline; drag files with ghost. New-file: template picker popover (4 template cards 120×88px with mini-previews).
- **Tabs:** 36px pill tabs (radius 8) in a 44px strip; active = `card` + hairline + tiny stage-colored file glyph; dirty = 6px leaf dot that morphs to ✕ on hover; drag-reorder with FLIP; overflow scrolls with edge fades.
- **Editor:** Monaco, Inkwell theme (D01/doc 03), 14px/22, gutter 56px; breadcrumbs 28px strip. Lex/Yacc niceties: `%%` section separators render as full-width subtle rules with section name watermarks ("DEFINITIONS", 11px caps 8% ink); macro hover = 250ms popover showing expansion; diagnostics: coral squiggle + gutter Bug dot; cmd-click rule→macro jump with a 200ms highlight flash on target.
- **Right dock tabs:** AI Assistant (D01 §4 embedded) · Token Viewer · Tree/AST · Regex Helper · Docs. Token Viewer auto-populates after any instrumented run — its tab pings (icon pop + count chip) when fresh data arrives; stale data shows a 40%-opacity "from last run 2m ago" scrim.
- **Bottom dock tabs:** Terminal · Console · Compiler Output · Problems. **Compiler Output:** each invocation = collapsible card 48px: `$ flex calc.l` mono 13 + duration + exit chip (leaf ✓ / coral ✗); during build, the card hosts the 5-puck mini-pipeline lighting per real phase; expanding reveals raw log. **Problems:** rows 36px grouped by file; Bison conflict rows carry a "visualize →" cobalt chip → opens Conflict Cinema modal pre-loaded.
- **Status bar:** 28px ink-900 strip (the one dark chrome line, matching terminal identity): workspace name · toolchain versions (`flex 2.6.4 · bison 3.8 · gcc 13 (wasm)`) · Ln/Col · tier chip (`⚡ local` leaf / `☁ vm` cobalt) · **▶ Build & Run** 96px leaf button flush right (kbd: ⌘⏎). Build inference transparency: after auto-detected builds, a one-line toast shows the exact commands with a copy icon.
- **Layout presets:** dropdown in tool header (Lexing/Parsing/Full/Zen); switching animates all docks with FLIP (400ms); Zen fades everything but editor to hidden, `esc esc` returns.
- **Share:** snapshot → toast; visiting a shared workspace shows a 40px banner "Read-only snapshot — Fork to edit" (fork button duplicates with a 300ms card-split animation).

## 2. Terminal (in Playground bottom dock + full-screen toggle)

**The device:** panel interior `#23281F`; 12px paper bezel (radius-top 12) with three 8px ink dots left + session title center 12px cream-40% + tier chip right. Text `#F2EFE4` 14px/20 JetBrains Mono; ANSI palette custom-tuned to Paper & Ink accents (errors = `#FF8A7E` soft coral, success = `#5FCF97`, paths = `#7FA3F0`). Block cursor 8×18px blinks 1.06s (solid↔20%). Selection: cream 25%.

- **Prompt:** `learner@lexora:~/calc$` — user leaf, host cream-50%, path cobalt-tint, `$` cream.
- **Output ergonomics:** new output slides up 2px + fades in (60ms — enough to feel smooth, never laggy); long output free-scrolls with a "jump to bottom ↓" pill appearing after 3s of scroll-back.
- **✨ Explain-this-error:** stderr lines get a 16px ✨ affordance in the left gutter (visible on line hover, 30% resting opacity if error persists); click → AI diagnosis card slides over the terminal's right half (car 320px, dark-adapted styling: ink-900 card with cream text) with What/Why/Fix/Watch-it sections; "apply fix" shows the diff in the editor, never auto-applies.
- **Guided task overlays:** lesson missions render as a 48px cream-on-ink banner above the prompt: "⚑ compile your scanner and run it on input.txt" + progress ticks; on matcher success the banner sweeps leaf with a checkmark draw and retracts (500ms).
- **`lexora` meta-commands:** output styled as mini-cards inside the terminal stream (rounded, slightly lighter `#2B3126` panels) — e.g., `lexora tokens` prints an actual token-chip strip rendered in-terminal.
- **nano:** faithful layout (title bar, shortcuts footer with `^X Exit` etc. as cream-on-ink chips). **vim sim:** honest subset with a persistent 11px banner bottom-right "educational vim — subset"; mode line (`-- INSERT --`) in marigold-tint.
- **Full-screen toggle:** dock expands to viewport (350ms), bezel persists (the device just gets bigger); `⌘⇧F` or bezel button.
- **Tier transitions:** if a command needs tier 2, an inline consent line appears: `this needs a cloud VM — start one? [y/N]` (keeping consent in the terminal's own language); VM boot shows a 6-dot knight-rider progress in the status chip.
