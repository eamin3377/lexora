import { Hero } from "@/components/home/hero";
import { PipelineSection } from "@/components/home/pipeline-section";
import { TokenizerDemo } from "@/components/home/tokenizer-demo";
import { Features } from "@/components/home/features";
import { RoadmapPreview } from "@/components/home/roadmap-preview";
import { InteractiveDemo } from "@/components/home/interactive-demo";
import { StatsSection } from "@/components/home/stats-section";
import { Testimonials } from "@/components/home/testimonials";
import { Faq } from "@/components/home/faq";
import { CtaSection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PipelineSection />
      <TokenizerDemo />
      <Features />
      <RoadmapPreview />
      <InteractiveDemo />
      <StatsSection />
      <Testimonials />
      <Faq />
      <CtaSection />
    </>
  );
}
