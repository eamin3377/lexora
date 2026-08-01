"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, Clock, History, Play, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  TRACKS,
  findLessonById,
  flatLessons,
  trackProgress,
} from "@/lib/learn/curriculum";
import { ACHIEVEMENTS, unlockedAchievements } from "@/lib/learn/achievements";
import { useProgress } from "@/lib/learn/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StaggerGroup, StaggerItem, Reveal } from "@/components/motion/reveal";
import { ProgressRing } from "@/components/learn/progress-ring";
import { XpBar } from "@/components/learn/xp-bar";
import { StreakFlame } from "@/components/learn/streak-flame";
import { AchievementBadge } from "@/components/learn/achievement-badge";
import { LearnNav } from "@/components/learn/learn-nav";
import { TopicSidebar } from "@/components/learn/topic-sidebar";

const BADGE_VARIANTS = {
  leaf: "leaf",
  marigold: "marigold",
  cobalt: "cobalt",
  orchid: "orchid",
  coral: "coral",
} as const;

function timeAgo(at: number): string {
  const mins = Math.max(1, Math.round((Date.now() - at) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function Dashboard() {
  const { state, hydrated } = useProgress();

  // Continue learning: most recent unfinished lesson, else first unfinished overall
  const continueRef = React.useMemo(() => {
    for (const r of state.recent) {
      if (!state.completed.includes(r.lessonId)) {
        const ref = findLessonById(r.lessonId);
        if (ref) return ref;
      }
    }
    for (const track of TRACKS) {
      const lesson = flatLessons(track).find((l) => !state.completed.includes(l.id));
      if (lesson) return findLessonById(lesson.id);
    }
    return undefined;
  }, [state.recent, state.completed]);

  const unlocked = unlockedAchievements(state);
  const recent = state.recent.slice(0, 4);
  const bookmarks = state.bookmarks.slice(0, 4);

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-24 pb-20 sm:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink-900">
            Dashboard
          </h1>
          <p className="mt-2 text-ink-500">Pick up where the scanner left off.</p>
        </div>
        <StreakFlame days={hydrated ? state.streak.count : 0} />
      </div>

      <LearnNav className="mb-8" />

      <div className="flex flex-col gap-6 lg:flex-row">
        <TopicSidebar className="hidden lg:flex" />

        <div className="min-w-0 flex-1 space-y-6">
          {/* XP + level */}
          <Reveal>
            <Card>
              <CardContent className="p-5">
                <XpBar xp={state.xp} />
              </CardContent>
            </Card>
          </Reveal>

          {/* Continue learning */}
          {continueRef && (
            <Reveal delay={0.05}>
              <Card accent={continueRef.track.accent} className="bg-sunrise">
                <CardContent className="p-6">
                  <Badge variant={BADGE_VARIANTS[continueRef.track.accent]}>Continue</Badge>
                  <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900">
                    {continueRef.lesson.title}
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-ink-500">
                    {continueRef.lesson.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <span className="inline-flex items-center gap-1 text-xs text-ink-500">
                      <Clock className="size-3.5" />
                      {continueRef.lesson.minutes} min · +{continueRef.lesson.xp} XP
                    </span>
                    <span className="text-xs text-ink-500">
                      {continueRef.track.title} · {continueRef.chapter.title}
                    </span>
                  </div>
                  <div className="mt-5">
                    <Link href={`/learn/${continueRef.track.id}/${continueRef.lesson.id}`}>
                      <Button>
                        <Play className="size-4" />
                        {state.recent.some((r) => r.lessonId === continueRef.lesson.id)
                          ? "Resume lesson"
                          : "Start lesson"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          )}

          {/* Course progress */}
          <div>
            <h2 className="mb-4 font-display text-xl font-semibold text-ink-900">
              Course progress
            </h2>
            <StaggerGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {TRACKS.map((track) => {
                const pct = trackProgress(track, state.completed);
                const total = flatLessons(track).length;
                const done = flatLessons(track).filter((l) =>
                  state.completed.includes(l.id),
                ).length;
                return (
                  <StaggerItem key={track.id}>
                    <Link href={`/learn/${track.id}`} className="block h-full">
                      <Card interactive accent={track.accent} className="h-full">
                        <CardContent className="flex h-full items-center gap-4 p-5">
                          <ProgressRing value={pct} accent={track.accent} size={56} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display text-base font-semibold text-ink-900">
                              {track.title}
                            </p>
                            <p className="mt-0.5 text-xs text-ink-500">
                              {done} / {total} lessons · {track.tagline}
                            </p>
                            <Progress value={pct} accent={track.accent} className="mt-2" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>

          {/* Recently viewed + bookmarks */}
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <Card className="h-full">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <History className="size-4 text-ink-500" />
                    <h3 className="font-display text-base font-semibold text-ink-900">
                      Recently viewed
                    </h3>
                  </div>
                  {recent.length === 0 ? (
                    <p className="py-6 text-center text-sm text-ink-300">
                      Open a lesson and it will appear here.
                    </p>
                  ) : (
                    <ul className="divide-y divide-line/60">
                      {recent.map((r) => {
                        const ref = findLessonById(r.lessonId);
                        if (!ref) return null;
                        return (
                          <li key={r.lessonId}>
                            <Link
                              href={`/learn/${ref.track.id}/${ref.lesson.id}`}
                              className="group flex items-center gap-3 py-2.5"
                            >
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-ink-900 group-hover:underline">
                                  {ref.lesson.title}
                                </span>
                                <span className="text-[11px] text-ink-500">
                                  {ref.track.title} · {timeAgo(r.at)}
                                </span>
                              </span>
                              <ArrowRight className="size-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-700" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.05}>
              <Card className="h-full">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Bookmark className="size-4 text-marigold-500" />
                    <h3 className="font-display text-base font-semibold text-ink-900">
                      Bookmarks
                    </h3>
                  </div>
                  {bookmarks.length === 0 ? (
                    <p className="py-6 text-center text-sm text-ink-300">
                      Bookmark lessons to keep them one click away.
                    </p>
                  ) : (
                    <ul className="divide-y divide-line/60">
                      {bookmarks.map((id) => {
                        const ref = findLessonById(id);
                        if (!ref) return null;
                        return (
                          <li key={id}>
                            <Link
                              href={`/learn/${ref.track.id}/${ref.lesson.id}`}
                              className="group flex items-center gap-3 py-2.5"
                            >
                              <Bookmark className="size-3.5 shrink-0 fill-marigold-300 text-marigold-500" />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-ink-900 group-hover:underline">
                                  {ref.lesson.title}
                                </span>
                                <span className="text-[11px] text-ink-500">{ref.track.title}</span>
                              </span>
                              <ArrowRight className="size-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-700" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </Reveal>
          </div>

          {/* Achievements preview */}
          <Reveal>
            <Card>
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="size-4 text-marigold-500" />
                    <h3 className="font-display text-base font-semibold text-ink-900">
                      Achievements
                    </h3>
                    <span className="font-mono text-xs text-ink-500 tabular-nums">
                      {unlocked.length}/{ACHIEVEMENTS.length}
                    </span>
                  </div>
                  <Link
                    href="/learn/achievements"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-ink-900 hover:underline"
                  >
                    View all
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {ACHIEVEMENTS.slice(0, 6).map((a) => (
                    <AchievementBadge
                      key={a.id}
                      achievement={a}
                      unlocked={unlocked.some((u) => u.id === a.id)}
                      size="sm"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
