import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";

const STATS = [
  { value: 40, suffix: "K+", label: "Learners" },
  { value: 220, suffix: "K", label: "Visualizations shared" },
  { value: 1200, suffix: "K", label: "Programs compiled" },
  { value: 60, suffix: "+", label: "Universities" },
];

export function StatsSection() {
  return (
    <section className="border-y border-line bg-card">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 divide-line px-4 py-16 sm:px-8 lg:grid-cols-4 lg:divide-x">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} className="px-6 py-4 text-center">
            <p className="font-display text-4xl font-bold tracking-tight text-ink-900 tabular-nums sm:text-5xl">
              <Counter to={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-xs font-semibold tracking-widest text-ink-500 uppercase">
              {stat.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
