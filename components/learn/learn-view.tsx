"use client";

import * as React from "react";
import { ArrowRight, Clock, Flame, Play } from "lucide-react";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SkeletonCard } from "@/components/ui/skeleton";
import { TokenChip } from "@/components/ui/token-chip";
import { toast } from "@/components/ui/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";

const NEXT_LESSONS = [
  {
    title: "Longest match & rule priority",
    track: "Lexical Analysis",
    badge: "marigold" as const,
    minutes: 14,
    progress: 62,
  },
  {
    title: "Flex specs: definitions & rules",
    track: "Lexical Analysis",
    badge: "marigold" as const,
    minutes: 18,
    progress: 0,
  },
  {
    title: "FIRST & FOLLOW sets",
    track: "Syntax & Parsing",
    badge: "cobalt" as const,
    minutes: 22,
    progress: 0,
  },
];

export function LearnView() {
  const [loadingDemo, setLoadingDemo] = React.useState(false);

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-24 pb-20 sm:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink-900">Learn</h1>
          <p className="mt-2 text-ink-500">
            Evening, learner — the parser awaits.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-marigold-100 px-4 py-2 text-sm font-semibold text-marigold-700">
          <Flame className="size-4 fill-marigold-300" />
          12-day streak
        </span>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <Sidebar className="hidden lg:flex" />

        <div className="min-w-0 flex-1 space-y-6">
          <Card accent="marigold" className="bg-sunrise">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <Badge variant="marigold">Continue</Badge>
                <CardTitle className="mt-3 text-2xl">
                  Longest match & rule priority
                </CardTitle>
                <CardDescription className="mt-2 max-w-md">
                  You left off at the maximal-munch rewind. The scanner is
                  paused mid-input, waiting for you.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2 rounded-lg bg-card/70 p-3 ring-1 ring-line/60">
                <span className="mr-1 font-mono text-xs text-ink-500">input:</span>
                <TokenChip type="keyword" value="if" index={0} />
                <TokenChip type="identifier" value="ifdef" index={1} />
                <TokenChip type="operator" value="=" index={2} />
                <TokenChip type="number" value="42" index={3} />
                <span className="animate-blink ml-1 h-5 w-0.5 bg-marigold-500" />
              </div>
              <div className="mt-4 flex items-center gap-4">
                <Progress value={62} accent="marigold" className="max-w-52" />
                <span className="text-xs text-ink-500">62% · ~5 min left</span>
              </div>
            </CardContent>
            <CardFooter className="gap-3">
              <Button onClick={() => toast("Lesson resumed", { description: "Jumping back to the rewind animation.", variant: "success" })}>
                <Play className="size-4" />
                Resume lesson
              </Button>
              <Button variant="ghost">
                View transcript
                <ArrowRight className="size-4" />
              </Button>
            </CardFooter>
          </Card>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ink-900">Up next</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLoadingDemo(true);
                  setTimeout(() => setLoadingDemo(false), 1800);
                  toast("Refreshing recommendations", {
                    description: "Scoring candidates against your mastery profile…",
                  });
                }}
              >
                Refresh
              </Button>
            </div>

            {loadingDemo ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : (
              <StaggerGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {NEXT_LESSONS.map((lesson) => (
                  <StaggerItem key={lesson.title}>
                    <Card interactive className="h-full cursor-pointer">
                      <CardContent className="flex h-full flex-col p-5">
                        <Badge variant={lesson.badge}>{lesson.track}</Badge>
                        <h3 className="mt-3 flex-1 font-display text-lg font-semibold tracking-tight text-ink-900">
                          {lesson.title}
                        </h3>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-xs text-ink-500">
                            <Clock className="size-3.5" />
                            {lesson.minutes} min
                          </span>
                          {lesson.progress > 0 ? (
                            <Progress value={lesson.progress} className="w-20" />
                          ) : (
                            <span className="text-xs font-medium text-leaf-700">Start →</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
