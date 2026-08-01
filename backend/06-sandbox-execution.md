# BE-06 — Sandbox Execution (Tier-2 Runner)

Server-side execution for what WASM can't do (big builds, `make -j`, valgrind, long runs). Security-critical: **separate cloud account/project, zero shared credentials with core infrastructure.**

## 1. Architecture

```
core-api ── signed job ticket ──▶ runner-svc (control plane)
                                    │ allocates from warm pool
                              ┌─────┴─────┐
                              │ Firecracker microVM (per session)  │
                              │  rootfs: ro Alpine + toolchain     │
                              │  /work: learner FS (from snapshot) │
                              │  no network device                 │
                              └─────┬─────┘
        browser ◀── WS PTY (via realtime node, ticket-authed) ─────┘
```

- **Warm pool:** N pre-booted microVMs per region (boot ~150ms from snapshot; pool refill async) → terminal tier-2 consent-to-prompt < 2s.
- **Session lifecycle:** ticket (workspace id, user, limits, TTL) → VM leased → FS snapshot hydrated into `/work` → PTY attached → on end/idle-timeout: `/work` diffed back to a workspace snapshot → VM **destroyed** (never reused across users; pool provides speed, not reuse).
- **Image:** versioned rootfs containing real flex/bison/gcc/clang/make/gdb/valgrind + coreutils; read-only; toolchain versions mirror the WASM manifest so behavior matches tier-1.

## 2. Isolation stack (defense in depth)

1. Firecracker microVM (KVM) — hardware virtualization boundary.
2. Jailer: chroot, dedicated uid/gid, cgroups v2 (vCPU 1, RAM 256MB default / 1GB Pro-burst, io capped), seccomp on the VMM process.
3. **No network device in the guest.** File exchange only via snapshot hydration/extraction on the host side. (Package installation is a product non-goal at MVP — BE invariant: capability minimalism.)
4. Host: dedicated instances (no co-tenancy with other services), IMDSv2 locked, egress-denied security groups except control plane.
5. Quotas: disk 1GB tmpfs `/work`, process cap 256, wall-clock 30 min/session, CPU-seconds budget per plan/day (Redis-metered via control plane).

## 3. Protocol

- **PTY WS frames:** `stdin/stdout` binary, `resize`, `signal` (ctrl-c → SIGINT into session), `status` heartbeats.
- **Structured runs:** the same BuildReport/fd-3 instrumentation protocol as tier-1 (PG-02) — the runner image ships the instrumented tool wrappers, so **panels light up identically from VM runs** (invariant "two views, one execution" holds across tiers).
- **File sync:** on-demand pull of changed files during session (chunked, content-addressed — reuses the snapshot chunk store BE-03 §8); explicit `sync` and automatic on detach.

## 4. Scheduling, fairness & abuse

Per-user concurrent sessions: 1 (2 Pro). Queue with visible position if pool exhausted; free tier preemptible after grace warning when Pro demand spikes (stated policy, not silent). Abuse containment: crypto-mining/heat heuristics (sustained CPU with no toolchain invocations → warn → kill), fork-bomb caps via cgroups, audit of session metadata (never file contents) for rate patterns. Kill switch: global and per-user session termination from admin.

## 5. Failure & observability

VM crash → PTY shows honest "VM died — restore from last sync?" + auto-restore path. Control plane metrics: pool depth, boot latency, session duration histogram, OOM/timeout kill counts, CPU-seconds by plan. Runner logs contain **no learner code**, only lifecycle events (privacy stance). Chaos drill: monthly kill-pool exercise must leave tier-1 learning unaffected (BE-01 §5).

## 6. Cost model & scaling

Sessions are short and bursty (median expected < 6 min). Autoscale pool on time-of-day curve (university evenings); scale-to-near-zero overnight per region. Regions: us-east + eu-central launch; ap-south fast-follow (Bangladesh/India cohort). Budget guard: tier-2 minutes/user/day capped per plan; the WASM-first architecture keeps tier-2 an exception path (~5% of executions projected), which is what makes free sustainable.
