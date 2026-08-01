import { Hero } from "@/components/home/hero";
import { PipelineSection } from "@/components/home/pipeline-section";
import { TokenizerDemo } from "@/components/home/tokenizer-demo";
import { Features } from "@/components/home/features";
import { StatsSection } from "@/components/home/stats-section";
import { CtaSection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PipelineSection />
      <TokenizerDemo />
      <Features />
      <StatsSection />
      <CtaSection />
    </>
  );
}
