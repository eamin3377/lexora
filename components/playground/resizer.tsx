"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface ResizerProps {
  direction: "horizontal" | "vertical"; // horizontal = drags left/right
  onDelta: (delta: number) => void;
  className?: string;
}

export function Resizer({ direction, onDelta, className }: ResizerProps) {
  const dragging = React.useRef(false);
  const last = React.useRef(0);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    last.current = direction === "horizontal" ? e.clientX : e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const pos = direction === "horizontal" ? e.clientX : e.clientY;
    onDelta(pos - last.current);
    last.current = pos;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      role="separator"
      aria-orientation={direction === "horizontal" ? "vertical" : "horizontal"}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={cn(
        "z-10 shrink-0 bg-transparent transition-colors hover:bg-cobalt-500/50 active:bg-cobalt-500",
        direction === "horizontal" ? "w-1 cursor-col-resize" : "h-1 cursor-row-resize",
        className,
      )}
    />
  );
}
