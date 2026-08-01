"use client";

import { Trophy } from "lucide-react";

import { ACHIEVEMENTS, unlockedAchievements } from "@/lib/learn/achievements";
import { useProgress } from "@/lib/learn/store";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StaggerGroup, StaggerItem, Reveal } from "@/components/motion/reveal";
import { AchievementBadge } from "@/components/learn/achievement-badge";
import { LearnNav } from "@/components/learn/learn-nav";
import { StreakFlame } from "@/components/learn/streak-flame";
import { XpBar } from "@/components/learn/xp-bar";

export function AchievementsView() {
  const { state, hydrated } = useProgress();
  const unlocked = unlockedAchievements(state);
  const pct = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100);

  return (
    <div className="mx-auto max-w-[1000px] px-4 pt-24 pb-20 sm:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink-900">
            Achievements
          </h1>
          <p className="mt-2 text-ink-500">Every badge is earned, never given.</p>
        </div>
        <StreakFlame days={hydrated ? state.streak.count : 0} />
      </div>

      <LearnNav className="mb-8" />

      <Reveal>
        <Card>
          <CardContent className="flex flex-wrap items-center gap-6 p-6">
            <span className="flex size-14 items-center justify-center rounded-full bg-marigold-100">
              <Trophy className="size-7 text-marigold-500" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-semibold text-ink-900">
                {unlocked.length} of {ACHIEVEMENTS.length} unlocked
              </p>
              <Progress value={pct} accent="marigold" className="mt-2 max-w-sm" />
            </div>
            <XpBar xp={state.xp} compact className="w-full sm:w-64" />
          </CardContent>
        </Card>
      </Reveal>

      <StaggerGroup className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {ACHIEVEMENTS.map((a) => (
          <StaggerItem key={a.id}>
            <AchievementBadge
              achievement={a}
              unlocked={unlocked.some((u) => u.id === a.id)}
              className="h-full"
            />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
