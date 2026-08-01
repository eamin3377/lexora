"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Menu, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { LogoLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Learn", href: "/learn", accent: "bg-leaf-500" },
  { label: "Tools", href: "/tools", accent: "bg-cobalt-500" },
  { label: "Build", href: "/projects", accent: "bg-marigold-500" },
  { label: "Practice", href: "/practice", accent: "bg-orchid-500" },
  { label: "Community", href: "/community", accent: "bg-coral-500" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "glass fixed inset-x-0 top-0 z-40 transition-all duration-200",
        scrolled ? "h-14 border-b border-line" : "h-16 border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center gap-6 px-4 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="Lexora home">
          <LogoLockup markSize={scrolled ? 26 : 30} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative rounded-md px-3 py-2 text-[15px] font-medium transition-colors",
                  active ? "text-ink-900" : "text-ink-700 hover:text-ink-900",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-px h-[2.5px] origin-left scale-x-0 rounded-full transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100",
                    item.accent,
                    active && "scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            className="hidden h-9 w-52 items-center gap-2 rounded-full bg-paper-1 px-3.5 text-sm text-ink-300 ring-1 ring-line transition-all hover:ring-ink-300 md:flex"
            aria-label="Search"
          >
            <Search className="size-4" />
            <span>Search…</span>
            <kbd className="ml-auto rounded bg-card px-1.5 py-0.5 font-mono text-[10px] text-ink-500 shadow-press ring-1 ring-line">
              ⌘K
            </kbd>
          </button>

          <span
            className="hidden items-center gap-1 text-sm font-semibold text-marigold-700 sm:flex"
            title="Daily streak"
          >
            <Flame className="size-5 fill-marigold-300 text-marigold-500" />
            12
          </span>

          <Button size="sm" className="hidden sm:inline-flex">
            Start free
          </Button>

          <button
            className="rounded-md p-2 text-ink-700 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="glass border-b border-line px-6 pt-2 pb-6 lg:hidden"
            aria-label="Mobile"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-lg font-semibold text-ink-900 hover:bg-paper-1"
                >
                  <span className={cn("size-2 rounded-full", item.accent)} />
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <Button className="mt-3 w-full" size="lg">
              Start learning free
            </Button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
