"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Bookmark, CheckCircle2, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { TRACKS, trackProgress } from "@/lib/learn/curriculum";
import { useProgress } from "@/lib/learn/store";
import { Progress } from "@/components/ui/progress";

const DOTS = {
  leaf: "bg-leaf-500",
  marigold: "bg-marigold-500",
  cobalt: "bg-cobalt-500",
  orchid: "bg-orchid-500",
  coral: "bg-coral-500",
} as const;

interface TopicSidebarProps {
  activeTrackId?: string;
  activeLessonId?: string;
  className?: string;
}

export function TopicSidebar({ activeTrackId, activeLessonId, className }: TopicSidebarProps) {
  const pathname = usePathname();
  const { state } = useProgress();
  const [openId, setOpenId] = React.useState<string | null>(activeTrackId ?? TRACKS[0].id);

  React.useEffect(() => {
    if (activeTrackId) setOpenId(activeTrackId);
  }, [activeTrackId]);

  return (
    <aside
      className={cn(
        "flex w-72 shrink-0 flex-col gap-1 self-start rounded-lg bg-card p-3 shadow-e1 ring-1 ring-line/60",
        className,
      )}
      aria-label="Curriculum"
    >
      <div className="mb-2 flex items-center gap-2 px-2 pt-1">
        <BookOpen className="size-4 text-ink-500" />
        <span className="text-xs font-semibold tracking-widest text-ink-500 uppercase">
          Curriculum
        </span>
      </div>

      {TRACKS.map((track) => {
        const open = openId === track.id;
        const pct = trackProgress(track, state.completed);
        return (
          <div key={track.id}>
            <button
              onClick={() => setOpenId(open ? null : track.id)}
              aria-expanded={open}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-left transition-colors",
                open ? "bg-paper-1" : "hover:bg-paper-1/60",
              )}
            >
              <span className={cn("size-2 shrink-0 rounded-full", DOTS[track.accent])} />
              <span className="flex-1 truncate text-sm font-medium text-ink-900">
                {track.title}
              </span>
              <span className="font-mono text-[11px] text-ink-300 tabular-nums">{pct}%</span>
              <ChevronDown
                className={cn(
                  "size-4 text-ink-300 transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.65, 0, 0.35, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 mb-2 ml-3 border-l border-line pl-3">
                    <Progress value={pct} accent={track.accent} className="mt-1 mb-2 w-24" />
                    {track.chapters.map((chapter) => (
                      <div key={chapter.id} className="mb-1">
                        {track.chapters.length > 1 && (
                          <p className="px-2 pt-1 pb-0.5 text-[10px] font-semibold tracking-widest text-ink-300 uppercase">
                            {chapter.title}
                          </p>
                        )}
                        {chapter.lessons.map((lesson) => {
                          const href = `/learn/${track.id}/${lesson.id}`;
                          const active =
                            lesson.id === activeLessonId || pathname === href;
                          const done = state.completed.includes(lesson.id);
                          const marked = state.bookmarks.includes(lesson.id);
                          return (
                            <Link
                              key={lesson.id}
                              href={href}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "group flex items-center gap-2 rounded px-2 py-1.5 text-[13px] transition-colors",
                                active
                                  ? "bg-paper-1 font-medium text-ink-900"
                                  : "text-ink-700 hover:bg-paper-1 hover:text-ink-900",
                              )}
                            >
                              {done ? (
                                <CheckCircle2 className="size-3.5 shrink-0 text-leaf-500" />
                              ) : (
                                <span
                                  className={cn(
                                    "size-1.5 shrink-0 rounded-full ring-2 ring-offset-1",
                                    active ? "bg-ink-500 ring-line" : "bg-transparent ring-line",
                                  )}
                                />
                              )}
                              <span className="flex-1 truncate">{lesson.title}</span>
                              {marked && (
                                <Bookmark className="size-3 shrink-0 fill-marigold-300 text-marigold-500" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </aside>
  );
}
