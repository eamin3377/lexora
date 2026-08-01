/* ────────────────────────────────────────────────────────────────
   A backtracking regex matcher instrumented to record every
   attempt, success, failure, and backtrack — feeding the
   backtracking visualization and the match timeline.
   ──────────────────────────────────────────────────────────────── */

import { nodeMatchesChar, nodeToString, type RegexNode } from "./parser";

export interface TraceEvent {
  index: number;
  pos: number; // input position when the event fired
  depth: number; // recursion depth (indent in the timeline)
  node: string; // printable fragment
  action: "try" | "match" | "fail" | "backtrack";
}

export interface BacktrackResult {
  matched: boolean;
  end: number; // match end position when matched (anchored at 0)
  events: TraceEvent[];
  truncated: boolean;
}

const MAX_EVENTS = 400;

export function traceMatch(ast: RegexNode, input: string): BacktrackResult {
  const events: TraceEvent[] = [];
  let truncated = false;

  const emit = (pos: number, depth: number, node: RegexNode, action: TraceEvent["action"]) => {
    if (events.length >= MAX_EVENTS) {
      truncated = true;
      return;
    }
    events.push({
      index: events.length,
      pos,
      depth,
      node: nodeToString(node) || "ε",
      action,
    });
  };

  /**
   * match(node, pos, depth, k) — continuation-passing so alternation
   * and star can backtrack through the rest of the pattern.
   */
  function match(
    node: RegexNode,
    pos: number,
    depth: number,
    k: (end: number) => boolean,
  ): boolean {
    if (truncated) return false;
    emit(pos, depth, node, "try");

    switch (node.type) {
      case "empty":
        emit(pos, depth, node, "match");
        return k(pos);

      case "char":
      case "any":
      case "class": {
        if (pos < input.length && nodeMatchesChar(node, input[pos])) {
          emit(pos, depth, node, "match");
          if (k(pos + 1)) return true;
          emit(pos, depth, node, "backtrack");
          return false;
        }
        emit(pos, depth, node, "fail");
        return false;
      }

      case "group":
        return match(node.child, pos, depth, k);

      case "concat": {
        const go = (i: number, p: number): boolean => {
          if (i >= node.parts.length) return k(p);
          return match(node.parts[i], p, depth + 1, (end) => go(i + 1, end));
        };
        const ok = go(0, pos);
        emit(pos, depth, node, ok ? "match" : "fail");
        return ok;
      }

      case "alt": {
        for (let i = 0; i < node.options.length; i++) {
          if (match(node.options[i], pos, depth + 1, k)) {
            emit(pos, depth, node, "match");
            return true;
          }
          if (i < node.options.length - 1) emit(pos, depth, node, "backtrack");
        }
        emit(pos, depth, node, "fail");
        return false;
      }

      case "star": {
        // greedy: consume as many as possible, then give back
        const attempt = (p: number, count: number): boolean => {
          if (count < input.length + 1) {
            const consumed = match(node.child, p, depth + 1, (end) =>
              end > p ? attempt(end, count + 1) : false,
            );
            if (consumed) return true;
            if (count > 0) emit(p, depth, node, "backtrack");
          }
          return k(p);
        };
        const ok = attempt(pos, 0);
        emit(pos, depth, node, ok ? "match" : "fail");
        return ok;
      }

      case "plus": {
        const ok = match(node.child, pos, depth + 1, (end) => {
          const attempt = (p: number, count: number): boolean => {
            if (count < input.length + 1) {
              const consumed = match(node.child, p, depth + 1, (e2) =>
                e2 > p ? attempt(e2, count + 1) : false,
              );
              if (consumed) return true;
              if (count > 0) emit(p, depth, node, "backtrack");
            }
            return k(p);
          };
          return attempt(end, 1);
        });
        emit(pos, depth, node, ok ? "match" : "fail");
        return ok;
      }

      case "opt": {
        if (match(node.child, pos, depth + 1, k)) {
          emit(pos, depth, node, "match");
          return true;
        }
        emit(pos, depth, node, "backtrack");
        const ok = k(pos);
        emit(pos, depth, node, ok ? "match" : "fail");
        return ok;
      }
    }
  }

  let end = 0;
  const matched = match(ast, 0, 0, (e) => {
    end = e;
    return true;
  });

  return { matched, end, events, truncated };
}
