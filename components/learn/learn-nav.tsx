"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Dashboard", href: "/learn" },
  { label: "Achievements", href: "/learn/achievements" },
  { label: "Certificates", href: "/learn/certificates" },
  { label: "History", href: "/learn/history" },
];

export function LearnNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Learning"
      className={cn(
        "inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-card p-1 shadow-e1 ring-1 ring-line/60",
        className,
      )}
    >
      {ITEMS.map((item) => {
        const active =
          item.href === "/learn"
            ? pathname === "/learn"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              active ? "text-paper-0" : "text-ink-700 hover:text-ink-900",
            )}
          >
            {active && (
              <motion.span
                layoutId="learn-nav-pill"
                className="absolute inset-0 rounded-full bg-ink-900"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
