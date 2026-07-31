# 11 — The Terminal

A real Linux-like terminal in the browser — the credibility core of the platform. Students run the *actual* commands their university lab expects, with zero setup.

## 1. Technology approach

- **Tier 1 (default, instant):** WASM toolchain — Flex, Bison, GCC (via wasi-sdk/emscripten builds or a v86/WebAssembly userland), BusyBox-style coreutils over an OPFS-backed virtual filesystem. Runs fully client-side: free, offline-capable, private.
- **Tier 2 (Pro/heavy):** on-demand server microVMs (Firecracker) for anything beyond the WASM envelope (large builds, `make -j`, valgrind). Seamless: the terminal reports which tier is active in the status chip.
- Terminal UI: xterm.js, styled as the design system's "device" frame (deep ink-green `#23281F` panel in a paper bezel — the platform's one dark element).

## 2. Supported commands (MVP)

**Toolchain:** `flex`, `lex` (alias), `bison`, `yacc` (alias with POSIX flags), `gcc`, `clang` (alias→same backend at MVP), `make` (GNU-compatible subset), `ar`, `objdump -d` (educational disassembly view).
**Shell & files:** `ls`, `pwd`, `cd`, `cat`, `cp`, `mv`, `rm`, `mkdir`, `touch`, `echo`, `head`, `tail`, `grep`, `wc`, `diff`, `clear`, `history`, pipes `|`, redirection `> >> <`, `&&`/`;`, tab-completion, arrow history.
**Editors:** `nano` (full working implementation — the beginner path) and `vim` **simulation** (honest subset: modal editing, `i/ESC/:w/:q/:wq/dd/yy/p`, hjkl, `/search`; banner states "educational vim — subset").

## 3. Learning integration (what makes it ours)

- **Instrumented toolchain:** platform builds of flex/bison/gcc emit structured side-channel metadata, so running `flex calc.l` in the terminal *also* populates the visual panels (Token Viewer, conflict reports). The terminal and the visualizers are two views of one execution.
- **Explain-this-error:** any stderr line gets a subtle ✨ gutter affordance → AI diagnosis with visualizer deep-link.
- **Guided terminal tasks:** lessons issue checkable terminal missions ("compile your scanner and run it on `input.txt`") verified by command+output matchers, with the hint ladder attached.
- **`lexora` meta-command:** `lexora share`, `lexora tokens`, `lexora tree` — bridge commands that open visualizers on the last artifacts.

## 4. Safety & limits

Client-side tier is inherently sandboxed. Server tier: microVM, no network egress, 256MB/30s-CPU caps, rate-limited. Filesystem quota per workspace (50MB free / 1GB Pro). No arbitrary package installation at MVP.
