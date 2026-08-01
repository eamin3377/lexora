/* ────────────────────────────────────────────────────────────────
   Thompson construction (regex AST → NFA), subset construction
   (NFA → DFA), simulation traces for both, and a simple layered
   layout so the studio can draw the machines.
   ──────────────────────────────────────────────────────────────── */

import {
  nodeMatchesChar,
  type RegexNode,
} from "./parser";

export interface NfaEdge {
  from: number;
  to: number;
  label: string; // "ε" or a printable label
  matcher: Extract<RegexNode, { type: "char" | "any" | "class" }> | null; // null = ε
}

export interface Nfa {
  start: number;
  accept: number;
  stateCount: number;
  edges: NfaEdge[];
}

/* ── Thompson construction ─────────────────────────────────── */

export function buildNfa(ast: RegexNode): Nfa {
  let next = 0;
  const edges: NfaEdge[] = [];
  const newState = () => next++;
  const eps = (from: number, to: number) => edges.push({ from, to, label: "ε", matcher: null });

  function build(node: RegexNode): { start: number; accept: number } {
    switch (node.type) {
      case "empty": {
        const s = newState();
        const a = newState();
        eps(s, a);
        return { start: s, accept: a };
      }
      case "char":
      case "any":
      case "class": {
        const s = newState();
        const a = newState();
        const label =
          node.type === "char"
            ? node.value === "\n"
              ? "\\n"
              : node.value
            : node.type === "any"
              ? "."
              : node.raw;
        edges.push({ from: s, to: a, label, matcher: node });
        return { start: s, accept: a };
      }
      case "group":
        return build(node.child);
      case "concat": {
        const frags = node.parts.map(build);
        for (let i = 0; i < frags.length - 1; i++) eps(frags[i].accept, frags[i + 1].start);
        return { start: frags[0].start, accept: frags[frags.length - 1].accept };
      }
      case "alt": {
        const s = newState();
        const a = newState();
        for (const opt of node.options) {
          const f = build(opt);
          eps(s, f.start);
          eps(f.accept, a);
        }
        return { start: s, accept: a };
      }
      case "star": {
        const s = newState();
        const a = newState();
        const f = build(node.child);
        eps(s, f.start);
        eps(f.accept, f.start);
        eps(f.accept, a);
        eps(s, a);
        return { start: s, accept: a };
      }
      case "plus": {
        const s = newState();
        const a = newState();
        const f = build(node.child);
        eps(s, f.start);
        eps(f.accept, f.start);
        eps(f.accept, a);
        return { start: s, accept: a };
      }
      case "opt": {
        const s = newState();
        const a = newState();
        const f = build(node.child);
        eps(s, f.start);
        eps(f.accept, a);
        eps(s, a);
        return { start: s, accept: a };
      }
    }
  }

  const { start, accept } = build(ast);
  return { start, accept, stateCount: next, edges };
}

/* ── ε-closure + NFA simulation trace ──────────────────────── */

export function epsilonClosure(nfa: Nfa, states: Set<number>): Set<number> {
  const out = new Set(states);
  const stack = [...states];
  while (stack.length > 0) {
    const s = stack.pop()!;
    for (const e of nfa.edges) {
      if (e.from === s && e.matcher === null && !out.has(e.to)) {
        out.add(e.to);
        stack.push(e.to);
      }
    }
  }
  return out;
}

export interface NfaSimStep {
  /** character consumed to reach this frontier; "" for the initial closure */
  char: string;
  active: number[];
  accepting: boolean;
}

export function simulateNfa(nfa: Nfa, input: string): NfaSimStep[] {
  const steps: NfaSimStep[] = [];
  let current = epsilonClosure(nfa, new Set([nfa.start]));
  steps.push({ char: "", active: [...current].sort((a, b) => a - b), accepting: current.has(nfa.accept) });

  for (const ch of input) {
    const moved = new Set<number>();
    for (const e of nfa.edges) {
      if (e.matcher && current.has(e.from) && nodeMatchesChar(e.matcher, ch)) {
        moved.add(e.to);
      }
    }
    current = epsilonClosure(nfa, moved);
    steps.push({ char: ch, active: [...current].sort((a, b) => a - b), accepting: current.has(nfa.accept) });
    if (current.size === 0) break;
  }
  return steps;
}

/* ── Subset construction: NFA → DFA ─────────────────────────── */

export interface DfaState {
  id: number;
  nfaStates: number[];
  accepting: boolean;
}

export interface DfaEdge {
  from: number;
  to: number;
  label: string;
  matcher: Extract<RegexNode, { type: "char" | "any" | "class" }>;
}

export interface Dfa {
  states: DfaState[];
  edges: DfaEdge[];
  start: number;
}

export function buildDfa(nfa: Nfa, maxStates = 32): Dfa {
  // alphabet = distinct labeled transitions in the NFA
  const symbols = new Map<string, Extract<RegexNode, { type: "char" | "any" | "class" }>>();
  for (const e of nfa.edges) {
    if (e.matcher) symbols.set(e.label, e.matcher);
  }

  const key = (s: Set<number>) => [...s].sort((a, b) => a - b).join(",");
  const startSet = epsilonClosure(nfa, new Set([nfa.start]));

  const states: DfaState[] = [];
  const edges: DfaEdge[] = [];
  const seen = new Map<string, number>();
  const queue: Set<number>[] = [startSet];
  seen.set(key(startSet), 0);
  states.push({ id: 0, nfaStates: [...startSet].sort((a, b) => a - b), accepting: startSet.has(nfa.accept) });

  while (queue.length > 0 && states.length < maxStates) {
    const current = queue.shift()!;
    const fromId = seen.get(key(current))!;

    for (const [label, matcher] of symbols) {
      const moved = new Set<number>();
      for (const e of nfa.edges) {
        if (e.matcher && current.has(e.from) && e.label === label) moved.add(e.to);
      }
      if (moved.size === 0) continue;
      const closed = epsilonClosure(nfa, moved);
      const k = key(closed);
      let toId = seen.get(k);
      if (toId === undefined) {
        toId = states.length;
        seen.set(k, toId);
        states.push({
          id: toId,
          nfaStates: [...closed].sort((a, b) => a - b),
          accepting: closed.has(nfa.accept),
        });
        queue.push(closed);
      }
      edges.push({ from: fromId, to: toId, label, matcher });
    }
  }

  return { states, edges, start: 0 };
}

export interface DfaSimStep {
  char: string;
  state: number | null; // null = dead (no transition)
  accepting: boolean;
}

export function simulateDfa(dfa: Dfa, input: string): DfaSimStep[] {
  const steps: DfaSimStep[] = [];
  let state: number | null = dfa.start;
  steps.push({ char: "", state, accepting: dfa.states[state]?.accepting ?? false });
  for (const ch of input) {
    if (state === null) break;
    const currentState: number = state;
    const edge = dfa.edges.find((e) => e.from === currentState && nodeMatchesChar(e.matcher, ch));
    state = edge ? edge.to : null;
    steps.push({
      char: ch,
      state,
      accepting: state !== null && (dfa.states[state]?.accepting ?? false),
    });
  }
  return steps;
}

/* ── Layered layout for drawing ────────────────────────────── */

export interface LayoutNode {
  id: number;
  x: number;
  y: number;
}

export function layoutGraph(
  stateIds: number[],
  edges: { from: number; to: number }[],
  start: number,
  width = 720,
  height = 260,
): LayoutNode[] {
  // BFS layers from start
  const layerOf = new Map<number, number>();
  layerOf.set(start, 0);
  const queue = [start];
  while (queue.length > 0) {
    const s = queue.shift()!;
    const l = layerOf.get(s)!;
    for (const e of edges) {
      if (e.from === s && !layerOf.has(e.to)) {
        layerOf.set(e.to, l + 1);
        queue.push(e.to);
      }
    }
  }
  // unreachable states go to the last layer
  let maxLayer = 0;
  for (const l of layerOf.values()) maxLayer = Math.max(maxLayer, l);
  for (const id of stateIds) {
    if (!layerOf.has(id)) layerOf.set(id, ++maxLayer);
  }

  const byLayer = new Map<number, number[]>();
  for (const id of stateIds) {
    const l = layerOf.get(id)!;
    byLayer.set(l, [...(byLayer.get(l) ?? []), id]);
  }

  const layers = [...byLayer.keys()].sort((a, b) => a - b);
  const nodes: LayoutNode[] = [];
  const xStep = layers.length > 1 ? (width - 100) / (layers.length - 1) : 0;

  for (const l of layers) {
    const ids = byLayer.get(l)!;
    const yStep = height / (ids.length + 1);
    ids.forEach((id, i) => {
      nodes.push({
        id,
        x: 50 + layers.indexOf(l) * xStep,
        y: yStep * (i + 1),
      });
    });
  }
  return nodes;
}
