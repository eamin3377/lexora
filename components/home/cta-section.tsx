import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function CtaSection() {
  return (
    <section className="bg-sunrise paper-grain relative overflow-hidden py-24">
      <span
        aria-hidden
        className="animate-drift absolute top-10 left-[10%] hidden rounded-lg bg-card px-3 py-1.5 font-mono text-sm text-ink-500 shadow-[4px_4px_0_#E3DDCE] ring-1 ring-line md:block"
      >
        yylex()
      </span>
      <span
        aria-hidden
        className="animate-drift-slow absolute right-[12%] bottom-10 hidden rounded-lg bg-card px-3 py-1.5 font-mono text-sm text-ink-500 shadow-[4px_4px_0_#E3DDCE] ring-1 ring-line md:block"
      >
        %token
      </span>

      <Reveal className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl">
          Your first token is{" "}
          <span className="marker-underline text-leaf-700">60 seconds</span> away.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg text-ink-500">
          No installs, no setup, no dragon book required. Just open a
          playground and watch.
        </p>
        <div className="mt-9 flex justify-center">
          <Button size="xl">
            Start learning free
            <ArrowRight />
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
