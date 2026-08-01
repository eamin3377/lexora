"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark, CheckCircle2, Clock, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { flatLessons, getTrack, trackProgress } from "@/lib/learn/curriculum";
import { useProgress } from "@/lib/learn/store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerGroup, StaggerItem, Reveal } from "@/components/motion/reveal";
import { ProgressRing } from "@/components/learn/progress-ring";
import { TopicSidebar } from "@/components/learn/topic-sidebar";

const BADGE_VARIANTS = {
  leaf: "leaf",
  marigold: "marigold",
  cobalt: "cobalt",
  orchid: "orchid",
  coral: "coral",
} as const;

export function TrackOverview({ trackId }: { trackId: string }) {
  const { state } = useProgress();
  const track = getTrack(trackId);

  if (!track) {
    return (
      <div className="mx-auto max-w-[760px] px-4 pt-32 pb-20 text-center">
        <p className="font-display text-2xl font-bold text-ink-900">Track not found</p>
        <Link href="/learn" className="mt-4 inline-block text-sm font-semibold underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const pct = trackProgress(track, state.completed);
  const all = flatLessons(track);
  const nextLesson = all.find((l) => !state.completed.includes(l.id));

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-24 pb-20 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <TopicSidebar activeTrackId={track.id} className="hidden lg:flex" />

        <div className="min-w-0 flex-1">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>

          <Reveal>
            <Card accent={track.accent} className="mt-4">
              <CardContent className="flex flex-wrap items-center gap-6 p-6">
                <ProgressRing value={pct} accent={track.accent} size={80} strokeWidth={6} />
                <div className="min-w-0 flex-1">
                  <Badge variant={BADGE_VARIANTS[track.accent]}>{track.tagline}</Badge>
                  <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900">
                    {track.title}
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-ink-500">
                    {track.description}
                  </p>
                </div>
                {nextLesson && (
                  <Link
                    href={`/learn/${track.id}/${nextLesson.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-paper-0 transition-transform hover:-translate-y-0.5"
                  >
                    <Play className="size-4" />
                    {pct > 0 ? "Continue" : "Start track"}
                  </Link>
                )}
              </CardContent>
            </Card>
          </Reveal>

          {track.chapters.map((chapter) => (
            <div key={chapter.id} className="mt-8">
              <h2 className="mb-4 font-display text-xl font-semibold text-ink-900">
                {chapter.title}
              </h2>
              <StaggerGroup className="space-y-3">
                {chapter.lessons.map((lesson, i) => {
                  const done = state.completed.includes(lesson.id);
                  const marked = state.bookmarks.includes(lesson.id);
                  return (
                    <StaggerItem key={lesson.id}>
                      <Link href={`/learn/${track.id}/${lesson.id}`} className="block">
                        <Card interactive>
                          <CardContent className="flex items-center gap-4 p-4">
                            <span
                              className={cn(
                                "flex size-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ring-1",
                                done
                                  ? "bg-leaf-100 text-leaf-700 ring-leaf-300/60"
                                  : "bg-paper-1 text-ink-500 ring-line",
                              )}
                            >
                              {done ? <CheckCircle2 className="size-4" /> : i + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2">
                                <span className="truncate font-display text-base font-semibold text-ink-900">
                                  {lesson.title}
                                </span>
                                {marked && (
                                  <Bookmark className="size-3.5 shrink-0 fill-marigold-300 text-marigold-500" />
                                )}
                              </span>
                              <span className="mt-0.5 block truncate text-sm text-ink-500">
                                {lesson.summary}
                              </span>
                            </span>
                            <span className="hidden shrink-0 items-center gap-1 text-xs text-ink-500 sm:inline-flex">
                              <Clock className="size-3.5" />
                              {lesson.minutes} min
                            </span>
                            <span className="shrink-0 font-mono text-xs text-ink-300">
                              +{lesson.xp} XP
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    </StaggerItem>
                  );
                })}
              </StaggerGroup>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
