"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardList, ListChecks, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { ASSIGNMENTS, findLessonById, getTrack } from "@/lib/learn/curriculum";
import { useProgress } from "@/lib/learn/store";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { LearnNav } from "@/components/learn/learn-nav";

const BADGE_VARIANTS = {
  leaf: "leaf",
  marigold: "marigold",
  cobalt: "cobalt",
  orchid: "orchid",
  coral: "coral",
} as const;

function when(at: number): string {
  return new Date(at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryView() {
  const { state, setAssignment } = useProgress();

  return (
    <div className="mx-auto max-w-[1000px] px-4 pt-24 pb-20 sm:px-8">
      <div className="mb-6">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink-900">History</h1>
        <p className="mt-2 text-ink-500">Quiz attempts and assignment status, all in one place.</p>
      </div>

      <LearnNav className="mb-8" />

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Quiz history */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <ListChecks className="size-4 text-cobalt-500" />
            <h2 className="font-display text-xl font-semibold text-ink-900">Quiz history</h2>
          </div>

          {state.quizHistory.length === 0 ? (
            <Reveal>
              <Card>
                <CardContent className="p-8 text-center text-sm text-ink-300">
                  Take a checkpoint quiz inside any lesson and your attempts will show up here.
                </CardContent>
              </Card>
            </Reveal>
          ) : (
            <StaggerGroup className="space-y-2.5">
              {state.quizHistory.map((q, i) => {
                const ref = findLessonById(q.lessonId);
                const pct = q.total > 0 ? Math.round((q.score / q.total) * 100) : 0;
                return (
                  <StaggerItem key={`${q.lessonId}-${q.at}-${i}`}>
                    <Card>
                      <CardContent className="flex items-center gap-4 p-4">
                        <span
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold",
                            pct === 100
                              ? "bg-leaf-100 text-leaf-700"
                              : pct >= 50
                                ? "bg-marigold-100 text-marigold-700"
                                : "bg-coral-100 text-coral-700",
                          )}
                        >
                          {q.score}/{q.total}
                        </span>
                        <span className="min-w-0 flex-1">
                          {ref ? (
                            <Link
                              href={`/learn/${ref.track.id}/${ref.lesson.id}`}
                              className="block truncate text-sm font-medium text-ink-900 hover:underline"
                            >
                              {ref.lesson.title}
                            </Link>
                          ) : (
                            <span className="block truncate text-sm text-ink-500">
                              {q.lessonId}
                            </span>
                          )}
                          <span className="text-[11px] text-ink-500">
                            {when(q.at)} · +{q.score * 10} XP
                          </span>
                        </span>
                        {pct === 100 && (
                          <CheckCircle2 className="size-4 shrink-0 text-leaf-500" />
                        )}
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          )}
        </section>

        {/* Assignments */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList className="size-4 text-marigold-500" />
            <h2 className="font-display text-xl font-semibold text-ink-900">Assignments</h2>
          </div>

          <StaggerGroup className="space-y-2.5">
            {ASSIGNMENTS.map((a) => {
              const track = getTrack(a.trackId);
              const status = state.assignments[a.id] ?? "todo";
              return (
                <StaggerItem key={a.id}>
                  <Card accent={track?.accent}>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {track && (
                              <Badge variant={BADGE_VARIANTS[track.accent]}>{track.title}</Badge>
                            )}
                            <span className="text-[11px] text-ink-500">
                              Due {a.due} · +{a.xp} XP
                            </span>
                          </div>
                          <h3 className="mt-2 font-display text-base font-semibold text-ink-900">
                            {a.title}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-ink-500">{a.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase",
                            status === "todo" && "bg-paper-2 text-ink-500",
                            status === "submitted" && "bg-cobalt-100 text-cobalt-700",
                            status === "graded" && "bg-leaf-100 text-leaf-700",
                          )}
                        >
                          {status === "todo" ? "Not started" : status}
                        </span>
                        {status === "todo" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setAssignment(a.id, "submitted");
                              toast("Assignment submitted", {
                                description: `${a.title} is queued for grading.`,
                                variant: "success",
                              });
                            }}
                          >
                            <Send className="size-4" />
                            Submit
                          </Button>
                        )}
                        {status === "submitted" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setAssignment(a.id, "todo")}
                          >
                            Withdraw
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </section>
      </div>
    </div>
  );
}
