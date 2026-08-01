"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "info" | "warning" | "error";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
let listeners: Listener[] = [];
let counter = 0;

function emit() {
  listeners.forEach((l) => l([...toasts]));
}

export function toast(
  title: string,
  options?: { description?: string; variant?: ToastVariant; duration?: number },
) {
  const id = ++counter;
  toasts = [...toasts.slice(-2), { id, title, description: options?.description, variant: options?.variant ?? "info" }];
  emit();
  const duration = options?.duration ?? 5000;
  setTimeout(() => dismiss(id), duration);
  return id;
}

export function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="size-5 text-leaf-500" />,
  info: <Info className="size-5 text-cobalt-500" />,
  warning: <AlertTriangle className="size-5 text-marigold-500" />,
  error: <XCircle className="size-5 text-coral-500" />,
};

const STRIPES: Record<ToastVariant, string> = {
  success: "before:bg-leaf-500",
  info: "before:bg-cobalt-500",
  warning: "before:bg-marigold-500",
  error: "before:bg-coral-500",
};

export function Toaster() {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    listeners.push(setItems);
    return () => {
      listeners = listeners.filter((l) => l !== setItems);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed top-20 right-4 z-[90] flex w-80 flex-col gap-2"
    >
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            role="status"
            className={cn(
              "pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-lg bg-card p-4 shadow-e3 ring-1 ring-line/60",
              "before:absolute before:inset-y-0 before:left-0 before:w-[3px]",
              STRIPES[t.variant],
            )}
          >
            {ICONS[t.variant]}
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink-900">{t.title}</p>
              {t.description && <p className="mt-0.5 text-[13px] leading-5 text-ink-500">{t.description}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded p-0.5 text-ink-300 transition-colors hover:text-ink-700"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
