"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  Info,
  Lightbulb,
  PenLine,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { LessonBlock } from "@/lib/learn/types";
import { findLesson, siblingLessons } from "@/lib/learn/curriculum";
import { useProgress } from "@/lib/learn/store";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { LessonQuiz } from "@/components/learn/lesson-quiz";
import { TopicSidebar } from "@/components/learn/topic-sidebar";

const BADGE_VARIANTS = {
  leaf: "leaf",
  marigold: "marigold",
  cobalt: "cobalt",
  orchid: "orchid",
  coral: "coral",
} as const;

const CALLOUTS = {
  tip: { icon: Lightbulb, cls: "bg-leaf-100 text-leaf-700 ring-leaf-300/50" },
  warn: { icon: AlertTriangle, cls: "bg-marigold-100 text-marigold-700 ring-marigold-300/50" },
  info: { icon: Info, cls: "bg-cobalt-100 text-cobalt-700 ring-cobalt-300/50" },
} as const;

function Block({ block }: { block: LessonBlock }) {
  switch (block.kind) {
    case "p":
      return <p className="text-[15px] leading-7 text-ink-700">{block.text}</p>;
    case "code":
      return (
        <pre className="overflow-x-auto rounded-lg bg-term p-4 font-mono text-[13px] leading-6 text-term-text shadow-e1">
          <code>{block.code}</code>
        </pre>
      );
    case "callout": {
      const { icon: Icon, cls } = CALLOUTS[block.tone];
      return (
        <div className={cn("flex gap-3 rounded-lg p-4 ring-1", cls)}>
          <Icon className="mt-0.5 size-4 shrink-0" />
          <div className="text-sm leading-6">
            <span className="font-semibold">{block.title}. </span>
            {block.text}
          </div>
        </div>
      );
    }
    case "list":
      return (
        <ul className="space-y-1.5 pl-1">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2.5 text-[15px] leading-7 text-ink-700">
              <span className="mt-3 size-1.5 shrink-0 rounded-full bg-ink-300" />
              {item}
            </li>
          ))}
        </ul>
      );
  }
}

interface LessonViewerProps {
  trackId: string;
  lessonId: string;
}

export function LessonViewer({ trackId, lessonId }: LessonViewerProps) {
  const {
    state,
    completeLesson,
    toggleBookmark,
    saveNote,
    visitLesson,
    recordQuiz,
  } = useProgress();

  const ref = findLesson(trackId, lessonId);
  const [noteOpen, setNoteOpen] = React.useState(false);
  const [noteDraft, setNoteDraft] = React.useState("");

  React.useEffect(() => {
    if (ref) visitLesson(ref.lesson.id);
    // record one visit per mount, not per re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  React.useEffect(() => {
    setNoteDraft(state.notes[lessonId] ?? "");
    // sync draft when navigating between lessons; ignore later store echoes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  if (!ref) {
    return (
      <div className="mx-auto max-w-[760px] px-4 pt-32 pb-20 text-center">
        <p className="font-display text-2xl font-bold text-ink-900">Lesson not found</p>
        <Link href="/learn" className="mt-4 inline-block text-sm font-semibold underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const { track, chapter, lesson } = ref;
  const { prev, next } = siblingLessons(ref);
  const done = state.completed.includes(lesson.id);
  const marked = state.bookmarks.includes(lesson.id);
  const savedNote = state.notes[lesson.id] ?? "";

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-24 pb-20 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <TopicSidebar
          activeTrackId={track.id}
          activeLessonId={lesson.id}
          className="hidden lg:flex"
        />

        <div className="min-w-0 flex-1">
          {/* Breadcrumb + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 text-sm text-ink-500">
              <Link href="/learn" className="hover:text-ink-900 hover:underline">
                Learn
              </Link>
              <span>/</span>
              <Link href={`/learn/${track.id}`} className="hover:text-ink-900 hover:underline">
                {track.title}
              </Link>
              <span>/</span>
              <span className="truncate text-ink-900">{chapter.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toggleBookmark(lesson.id);
                  toast(marked ? "Bookmark removed" : "Lesson bookmarked", {
                    variant: marked ? "info" : "success",
                  });
                }}
                aria-pressed={marked}
                aria-label={marked ? "Remove bookmark" : "Bookmark lesson"}
              >
                <Bookmark
                  className={cn("size-4", marked && "fill-marigold-300 text-marigold-500")}
                />
                {marked ? "Bookmarked" : "Bookmark"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNoteOpen((v) => !v)}
                aria-expanded={noteOpen}
              >
                <PenLine className={cn("size-4", savedNote.trim() && "text-cobalt-500")} />
                Notes
              </Button>
            </div>
          </div>

          {/* Title */}
          <Reveal>
            <div className="mt-6">
              <Badge variant={BADGE_VARIANTS[track.accent]}>{track.title}</Badge>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                {lesson.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {lesson.minutes} min
                </span>
                <span className="font-mono text-xs">+{lesson.xp} XP</span>
                {done && (
                  <span className="inline-flex items-center gap-1 font-medium text-leaf-700">
                    <CheckCircle2 className="size-4" />
                    Completed
                  </span>
                )}
              </div>
            </div>
          </Reveal>

          {/* Notes panel */}
          {noteOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-xl bg-marigold-100/60 p-4 ring-1 ring-marigold-300/50"
            >
              <label
                htmlFor="lesson-note"
                className="text-xs font-semibold tracking-widest text-marigold-700 uppercase"
              >
                My notes
              </label>
              <textarea
                id="lesson-note"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                rows={4}
                placeholder="Write it in your own words — that's when it sticks."
                className="mt-2 w-full resize-y rounded-lg bg-card p-3 text-sm leading-6 text-ink-900 ring-1 ring-line focus:ring-2 focus:ring-marigold-500/60 focus:outline-none"
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setNoteOpen(false)}>
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    saveNote(lesson.id, noteDraft);
                    toast("Note saved", { variant: "success" });
                  }}
                >
                  Save note
                </Button>
              </div>
            </motion.div>
          )}

          {/* Content */}
          <Reveal delay={0.08}>
            <article className="mt-8 space-y-5">
              {lesson.content.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </article>
          </Reveal>

          {/* Quiz */}
          <Reveal delay={0.1}>
            <div className="mt-10">
              <LessonQuiz
                questions={lesson.quiz}
                onComplete={(score, total) => {
                  recordQuiz(lesson.id, score, total);
                  toast(`Quiz recorded: ${score}/${total}`, {
                    description: `+${score * 10} XP added to your total.`,
                    variant: score === total ? "success" : "info",
                  });
                }}
              />
            </div>
          </Reveal>

          {/* Complete */}
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              variant={done ? "secondary" : "primary"}
              disabled={done}
              onClick={() => {
                completeLesson(lesson.id);
                toast("Lesson complete", {
                  description: `+${lesson.xp} XP — nice work.`,
                  variant: "success",
                });
              }}
            >
              <CheckCircle2 className="size-5" />
              {done ? "Completed" : `Mark complete · +${lesson.xp} XP`}
            </Button>
          </div>

          {/* Chapter navigation */}
          <div className="mt-10 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/learn/${track.id}/${prev.id}`}
                className="group flex items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-line/60 transition-all hover:-translate-y-0.5 hover:shadow-e2"
              >
                <ArrowLeft className="size-4 shrink-0 text-ink-300 transition-transform group-hover:-translate-x-0.5" />
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold tracking-widest text-ink-500 uppercase">
                    Previous
                  </span>
                  <span className="block truncate text-sm font-medium text-ink-900">
                    {prev.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/learn/${track.id}/${next.id}`}
                className="group flex items-center justify-end gap-3 rounded-xl bg-card p-4 text-right ring-1 ring-line/60 transition-all hover:-translate-y-0.5 hover:shadow-e2"
              >
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold tracking-widest text-ink-500 uppercase">
                    Next
                  </span>
                  <span className="block truncate text-sm font-medium text-ink-900">
                    {next.title}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <Link
                href={`/learn/${track.id}`}
                className="group flex items-center justify-end gap-3 rounded-xl bg-leaf-100 p-4 text-right ring-1 ring-leaf-300/60 transition-all hover:-translate-y-0.5 hover:shadow-e2"
              >
                <span>
                  <span className="block text-[11px] font-semibold tracking-widest text-leaf-700 uppercase">
                    Track complete
                  </span>
                  <span className="block text-sm font-medium text-ink-900">
                    Back to {track.title}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-leaf-700" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
