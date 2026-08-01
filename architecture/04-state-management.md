# FA-04 — State Management

## 1. State taxonomy (decide the home before writing the state)

| Kind | Examples | Home |
|---|---|---|
| **Server state** | user, progress/mastery, workspaces list, community, leaderboards | TanStack Query + server actions |
| **Tool state** (shareable) | lex spec, grammar, regex, input, frameIndex, panel positions | Zustand store ⇄ `?s=` codec |
| **Session/UI state** | open sheets, ⌘K, active tabs, dock sizes, toasts | Zustand (ephemeral or localStorage-persisted) |
| **Playback state** | frameIndex, playing, speed | `useTracePlayer` (in-memory, not a store — 60fps churn stays out of React state where possible: rAF + refs, store gets throttled mirror) |
| **Form state** | settings, community composer | React Hook Form, local |
| **Content** | lessons, docs, glossary | RSC props (build-time / ISR), never client stores |

Law: **no state duplicated across homes.** Server state is never copied into Zustand; components join them at render.

## 2. Zustand store catalog

Per-surface stores, created via factory + React context (so two tool instances — e.g., lesson embed + standalone — never share):

- `createToolStore(toolId)` — spec/input/options + derived `traceRequest`; middleware chain: `urlSync` (debounced 800ms replaceState via state-codec) → `persist` (per-user autosave, IndexedDB, logged-in only) → `devtools`.
- `workspaceStore` — open files, dirty map, dock layout, active tabs; `persist` to IndexedDB keyed by workspaceId; file *contents* live in the virtual FS (FA-05), store holds handles only.
- `uiStore` (app-global, tiny) — AI sheet open/context, ⌘K, nav condensed, reduced-motion override, sound opt-in. Partially persisted (prefs keys only).
- `gamificationStore` — optimistic XP/streak mirrors for animation moments; source of truth stays server (Query cache); reconciles on refetch.
- `syncHighlightBus` — not really state: a subscribe-only event emitter in context (`highlight(artifactId)` / `clear()`); primitives subscribe with their artifact ids; deliberately outside React state to keep hover at 60fps.

Selector rules: components subscribe via granular selectors + `shallow`; no component subscribes to a whole store (lint rule); derived data via selector functions, never duplicated fields.

## 3. Server state (TanStack Query + server actions)

- **Query keys** namespaced: `['me']`, `['progress', trackId]`, `['workspace', id]`, `['thread', id]`, `['leaderboard', scope, week]`.
- **Mutations = server actions** wrapped in `useMutation`; optimistic updates for: progress ticks, stars, votes, XP events (with rollback + toast on failure).
- **Streaming/live:** leaderboard + classroom live sessions use SSE subscriptions feeding the Query cache (`setQueryData`); no client polling loops.
- **Caching posture:** `staleTime` 60s default; progress/mastery invalidated by tag after lesson events; content never client-fetched (RSC).
- **Auth:** session via Auth.js provider; role gates in middleware; client reads a minimal `useSession()` — permissions logic stays server-side.

## 4. Persistence map

| Data | Where | Notes |
|---|---|---|
| Tool autosaves | IndexedDB (`lexora-tools` db) + server sync (logged-in, debounced 5s) | conflict: last-write-wins + "restored older draft" toast |
| Workspace files | OPFS (FA-05), server snapshot on share/save | quota-guarded |
| Lesson resume (scroll, widget states) | server (progress record) | cross-device resume |
| UI prefs | localStorage | survives logout |
| Anonymous work | IndexedDB + `?s=` | migrated to account on signup (the auth-preservation flow, FA-02 §4) |

## 5. Undo/redo & history

In-tool undo = trace/frame navigation (free, from the trace model) **plus** spec-edit history: tool stores keep a bounded (100) patch stack (immer patches) for editor-side undo (⌘Z edits the spec; ←/→ scrub the execution — two distinct histories, distinct shortcuts, per UX spec).

## 6. Cross-cutting flows (worked examples)

- **Run a Lex spec:** editor change → toolStore.spec → debounce 300ms → `traceRequest` → Worker engine (FA-05) → Trace → `useTracePlayer` resets to frame 0 → autoplay if first run → URL codec writes `?s=` → panels render slices.
- **Lesson TryIt success:** widget verdict → server action `recordCheck` (optimistic mastery tick) → XP arc animation from gamificationStore optimistic event → Query invalidates `['progress']` → dashboard heatmap refreshes on next visit.
- **Share:** button → codec serialize → >1800 chars? POST `/api/states` → short URL → clipboard + toast. Open shared link: codec parse → version-migrate → hydrate store → player at embedded frameIndex.
- **AI context:** AI sheet reads a `getContext()` snapshot assembled from the active surface's registered context providers (tool store slice + last error + lesson position) — pull-based, nothing continuously streamed to the sheet.
