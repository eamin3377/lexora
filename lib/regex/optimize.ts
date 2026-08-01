import type { RegexNode } from "./parser";
import { nodeToString } from "./parser";

export interface OptimizerTip {
  severity: "danger" | "improve" | "style";
  title: string;
  detail: string;
  suggestion?: string;
}

function walk(node: RegexNode, visit: (n: RegexNode) => void): void {
  visit(node);
  switch (node.type) {
    case "concat":
      node.parts.forEach((p) => walk(p, visit));
      break;
    case "alt":
      node.options.forEach((o) => walk(o, visit));
      break;
    case "star":
    case "plus":
    case "opt":
    case "group":
      walk(node.child, visit);
      break;
    default:
      break;
  }
}

function hasQuantifier(node: RegexNode): boolean {
  let found = false;
  walk(node, (n) => {
    if (n.type === "star" || n.type === "plus") found = true;
  });
  return found;
}

export function optimize(ast: RegexNode, source: string): OptimizerTip[] {
  const tips: OptimizerTip[] = [];

  // nested quantifiers → catastrophic backtracking risk
  walk(ast, (n) => {
    if ((n.type === "star" || n.type === "plus") && hasQuantifier(n.child)) {
      tips.push({
        severity: "danger",
        title: "Nested quantifier — catastrophic backtracking risk",
        detail: `${nodeToString(n)} repeats something that itself repeats. On a non-matching input the backtracker explores exponentially many splits. Watch it happen in the Backtracking panel with input like "aaaaaaaaX".`,
        suggestion: "Flatten the repetition or make the inner part unambiguous.",
      });
    }
  });

  // duplicate alternation branches
  walk(ast, (n) => {
    if (n.type === "alt") {
      const seen = new Map<string, number>();
      for (const o of n.options) {
        const s = nodeToString(o);
        seen.set(s, (seen.get(s) ?? 0) + 1);
      }
      for (const [frag, count] of seen) {
        if (count > 1) {
          tips.push({
            severity: "improve",
            title: `Duplicate branch "${frag}" in alternation`,
            detail: `The branch appears ${count} times — the extras can never contribute a different match and just add NFA states.`,
            suggestion: `Keep a single "${frag}" branch.`,
          });
        }
      }
      // single-char branches → class
      if (
        n.options.length > 1 &&
        n.options.every((o) => o.type === "char" && o.value.length === 1)
      ) {
        const chars = n.options.map((o) => (o.type === "char" ? o.value : "")).join("");
        tips.push({
          severity: "style",
          title: "Alternation of single characters",
          detail: `${nodeToString(n)} builds ${n.options.length * 2 + 2} NFA states; a character class builds 2.`,
          suggestion: `[${chars}]`,
        });
      }
    }
  });

  // (x*)* / (x+)* style redundancy and x** direct
  walk(ast, (n) => {
    if (n.type === "star" && (n.child.type === "star" || n.child.type === "opt")) {
      tips.push({
        severity: "improve",
        title: "Redundant quantifier stack",
        detail: `${nodeToString(n)} — a star of a star (or of an optional) matches exactly what a single star matches.`,
        suggestion: `${nodeToString(n.child.type === "star" ? n.child : { type: "star", child: n.child.child })}`,
      });
    }
  });

  // digit class shorthand
  if (source.includes("[0-9]")) {
    tips.push({
      severity: "style",
      title: "[0-9] can be written \\d",
      detail: "Same machine, fewer characters. (In Flex specs, keep [0-9] — classic lex has no \\d.)",
      suggestion: source.replaceAll("[0-9]", "\\d"),
    });
  }

  // leading/trailing .* in a search context
  if (source.startsWith(".*")) {
    tips.push({
      severity: "improve",
      title: "Leading .* is usually unnecessary",
      detail: "When searching (not anchoring), the engine already tries every start position — a leading .* only adds backtracking work.",
      suggestion: source.slice(2),
    });
  }

  if (tips.length === 0) {
    tips.push({
      severity: "style",
      title: "Nothing to optimize",
      detail: "No nested quantifiers, no duplicate branches, no redundant stacks. This pattern compiles to a lean machine.",
    });
  }

  return tips;
}
