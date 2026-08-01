"use client";

import Link from "next/link";
import { Award, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { TRACKS, flatLessons, trackProgress } from "@/lib/learn/curriculum";
import { useProgress } from "@/lib/learn/store";
import { LogoMark } from "@/components/brand/logo";
import { Progress } from "@/components/ui/progress";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { LearnNav } from "@/components/learn/learn-nav";

const SEALS = {
  leaf: "text-leaf-500",
  marigold: "text-marigold-500",
  cobalt: "text-cobalt-500",
  orchid: "text-orchid-500",
  coral: "text-coral-500",
} as const;

export function CertificatesView() {
  const { state } = useProgress();

  return (
    <div className="mx-auto max-w-[1000px] px-4 pt-24 pb-20 sm:px-8">
      <div className="mb-6">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink-900">
          Certificates
        </h1>
        <p className="mt-2 text-ink-500">
          Finish every lesson in a track to earn its certificate.
        </p>
      </div>

      <LearnNav className="mb-8" />

      <StaggerGroup className="grid gap-6 md:grid-cols-2">
        {TRACKS.map((track) => {
          const pct = trackProgress(track, state.completed);
          const earned = pct === 100;
          const remaining = flatLessons(track).filter(
            (l) => !state.completed.includes(l.id),
          ).length;

          return (
            <StaggerItem key={track.id}>
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl p-8 ring-1 transition-all",
                  earned
                    ? "bg-card shadow-e2 ring-line/60"
                    : "bg-paper-1 ring-line/40",
                )}
              >
                {/* certificate framing */}
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-3 rounded-xl border",
                    earned ? "border-line" : "border-line/50 border-dashed",
                  )}
                />

                <div className="relative text-center">
                  <div className="flex items-center justify-center gap-2">
                    <LogoMark size={20} />
                    <span className="text-[10px] font-bold tracking-[0.3em] text-ink-500 uppercase">
                      Lexora · Certificate of Completion
                    </span>
                  </div>

                  <h2
                    className={cn(
                      "mt-5 font-display text-2xl font-bold tracking-tight",
                      earned ? "text-ink-900" : "text-ink-500",
                    )}
                  >
                    {track.title}
                  </h2>
                  <p className="mt-1 text-xs text-ink-500">{track.tagline}</p>

                  <div className="mt-5 flex justify-center">
                    {earned ? (
                      <span className="relative inline-flex">
                        <Award className={cn("size-12", SEALS[track.accent])} strokeWidth={1.5} />
                      </span>
                    ) : (
                      <span className="flex size-12 items-center justify-center rounded-full bg-paper-2 ring-1 ring-line">
                        <Lock className="size-5 text-ink-300" />
                      </span>
                    )}
                  </div>

                  {earned ? (
                    <p className="mt-4 text-sm text-ink-700">
                      Awarded for completing all {flatLessons(track).length} lessons.
                      <span className="mt-1 block font-mono text-[11px] text-ink-500">
                        Verified by lesson mastery · {new Date().getFullYear()}
                      </span>
                    </p>
                  ) : (
                    <div className="mt-4">
                      <p className="text-sm text-ink-500">
                        {remaining} lesson{remaining === 1 ? "" : "s"} to go
                      </p>
                      <Progress
                        value={pct}
                        accent={track.accent}
                        className="mx-auto mt-2 max-w-44"
                      />
                      <Link
                        href={`/learn/${track.id}`}
                        className="mt-3 inline-block text-sm font-semibold text-ink-900 underline-offset-2 hover:underline"
                      >
                        Keep going →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </div>
  );
}
