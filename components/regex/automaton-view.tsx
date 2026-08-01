"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface ViewEdge {
  from: number;
  to: number;
  label: string;
}

export interface ViewNode {
  id: number;
  x: number;
  y: number;
}

interface AutomatonViewProps {
  nodes: ViewNode[];
  edges: ViewEdge[];
  start: number;
  accepting: Set<number>;
  active: Set<number>;
  /** shows the NFA-state composition of a DFA state on hover */
  tooltip?: (id: number) => string | undefined;
  height?: number;
  dead?: boolean; // simulation fell off the machine
}

/** Shared SVG renderer for NFA and DFA graphs with animated active states. */
export function AutomatonView({
  nodes,
  edges,
  start,
  accepting,
  active,
  tooltip,
  height = 280,
  dead,
}: AutomatonViewProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const pos = React.useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const width = Math.max(720, ...nodes.map((n) => n.x + 60));

  // group parallel edges so their curves fan out
  const edgeGroups = React.useMemo(() => {
    const seen = new Map<string, number>();
    return edges.map((e) => {
      const k = `${Math.min(e.from, e.to)}-${Math.max(e.from, e.to)}`;
      const n = seen.get(k) ?? 0;
      seen.set(k, n + 1);
      return { ...e, lane: n };
    });
  }, [edges]);

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: Math.min(width, 720) }}
        className="w-full"
        role="img"
        aria-label="Automaton diagram"
      >
        <defs>
          <marker
            id="automaton-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6.5"
            markerHeight="6.5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#A8AEA2" />
          </marker>
          <marker
            id="automaton-arrow-active"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6.5"
            markerHeight="6.5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#F5A623" />
          </marker>
        </defs>

        {/* edges */}
        {edgeGroups.map((e, i) => {
          const a = pos.get(e.from);
          const b = pos.get(e.to);
          if (!a || !b) return null;
          const isActive = active.has(e.from) && active.has(e.to) && e.from !== e.to;
          const isEps = e.label === "ε";

          let d: string;
          let lx: number;
          let ly: number;
          if (e.from === e.to) {
            d = `M ${a.x - 10} ${a.y - 18} C ${a.x - 26} ${a.y - 52}, ${a.x + 26} ${a.y - 52}, ${a.x + 10} ${a.y - 18}`;
            lx = a.x;
            ly = a.y - 46;
          } else {
            const bend = (e.lane - 0) * 26 + (e.from > e.to ? 34 : e.lane * 26);
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2 - (e.from > e.to ? -bend - 30 : bend ? bend : 0);
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const len = Math.hypot(dx, dy) || 1;
            const ox = (dx / len) * 20;
            const oy = (dy / len) * 20;
            d = `M ${a.x + ox} ${a.y + oy} Q ${mx} ${my}, ${b.x - ox} ${b.y - oy}`;
            lx = mx;
            ly = (a.y + b.y) / 2 === my ? my - 8 : my + (my < (a.y + b.y) / 2 ? -6 : 14);
          }

          return (
            <g key={i}>
              <path
                d={d}
                fill="none"
                stroke={isActive ? "#F5A623" : isEps ? "#C9CDC4" : "#A8AEA2"}
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray={isEps ? "4 4" : undefined}
                markerEnd={`url(#automaton-arrow${isActive ? "-active" : ""})`}
                className="transition-all duration-200"
              />
              <rect
                x={lx - e.label.length * 3.6 - 4}
                y={ly - 9}
                width={e.label.length * 7.2 + 8}
                height={16}
                rx={8}
                fill="#F7F3EA"
                stroke={isActive ? "#F5A623" : "#E3DDCE"}
              />
              <text
                x={lx}
                y={ly + 3}
                textAnchor="middle"
                fontSize="10.5"
                className="font-mono"
                fill={isEps ? "#A8AEA2" : isActive ? "#A66A08" : "#6B7267"}
              >
                {e.label}
              </text>
            </g>
          );
        })}

        {/* start arrow */}
        {pos.get(start) && (
          <path
            d={`M ${pos.get(start)!.x - 44} ${pos.get(start)!.y} L ${pos.get(start)!.x - 22} ${pos.get(start)!.y}`}
            stroke="#3D443B"
            strokeWidth="2"
            markerEnd="url(#automaton-arrow)"
          />
        )}

        {/* nodes */}
        {nodes.map((n) => {
          const isActive = active.has(n.id);
          const isAccept = accepting.has(n.id);
          return (
            <g
              key={n.id}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: tooltip ? "help" : "default" }}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.circle
                    key={`pulse-${n.id}-${[...active].join(",")}`}
                    cx={n.x}
                    cy={n.y}
                    r={18}
                    fill="none"
                    stroke={dead ? "#FF6B5E" : "#F5A623"}
                    strokeWidth={2}
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 1.7, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                  />
                )}
              </AnimatePresence>
              <circle
                cx={n.x}
                cy={n.y}
                r={17}
                fill={isActive ? "#FCEBCB" : "#FFFFFF"}
                stroke={isActive ? "#F5A623" : "#1A1F16"}
                strokeWidth={2}
                className="transition-all duration-200"
              />
              {isAccept && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={12.5}
                  fill="none"
                  stroke={isActive ? "#F5A623" : "#1A1F16"}
                  strokeWidth={1.4}
                />
              )}
              <text
                x={n.x}
                y={n.y + 3.5}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="700"
                fill="#1A1F16"
                className="font-mono"
              >
                {n.id}
              </text>
              {hover === n.id && tooltip?.(n.id) && (
                <g>
                  <rect
                    x={n.x - 60}
                    y={n.y + 24}
                    width={120}
                    height={20}
                    rx={6}
                    fill="#1A1F16"
                  />
                  <text
                    x={n.x}
                    y={n.y + 37}
                    textAnchor="middle"
                    fontSize="9.5"
                    fill="#FDFBF7"
                    className="font-mono"
                  >
                    {tooltip(n.id)}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
