"use client";

import Link from "next/link";
import { ArrowUpRight, GraduationCap, Hammer, Wrench } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StaggerGroup, StaggerItem, Reveal } from "@/components/motion/reveal";

const FEATURES = [
  {
    icon: GraduationCap,
    accent: "leaf" as const,
    badge: "Learn",
    badgeVariant: "leaf" as const,
    title: "A guided path from regex to executable",
    description:
      "Five tracks, eighty lessons, every concept introduced as an animation before a formula. Mastery tracking keeps you honest.",
    href: "/learn",
  },
  {
    icon: Wrench,
    accent: "cobalt" as const,
    badge: "Tools",
    badgeVariant: "cobalt" as const,
    title: "Visualizers you can touch",
    description:
      "NFA construction, maximal munch, LALR table conflicts — watch them run, scrub them backwards, share the exact state as a link.",
    href: "/tools",
  },
  {
    icon: Hammer,
    accent: "marigold" as const,
    badge: "Build",
    badgeVariant: "marigold" as const,
    title: "Real Flex & Bison, in your browser",
    description:
      "A full workspace with a real toolchain compiled to WASM. Build a calculator, a JSON parser, then a Tiny C compiler.",
    href: "/projects",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-28 sm:px-8">
      <Reveal>
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Three front doors. <span className="marker-underline text-leaf-700">Zero setup.</span>
        </h2>
      </Reveal>

      <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-3">
        {FEATURES.map((f) => (
          <StaggerItem key={f.title}>
            <Link href={f.href} className="group block h-full">
              <Card interactive accent={f.accent} className="h-full">
                <CardContent className="flex h-full flex-col p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-paper-1 ring-1 ring-line">
                      <f.icon className="size-6 text-ink-700" />
                    </span>
                    <Badge variant={f.badgeVariant}>{f.badge}</Badge>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink-900">
                    {f.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-ink-500">{f.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-ink-900">
                    Explore
                    <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
