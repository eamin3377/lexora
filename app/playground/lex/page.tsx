import type { Metadata } from "next";

import { LexPlayground } from "@/components/lex/lex-playground";

export const metadata: Metadata = {
  title: "Lex Machine",
  description:
    "The interactive Lex/Flex playground: write a scanner spec, run it on real input, and step through maximal munch, rule priority, and every token decision.",
};

export default function LexPlaygroundPage() {
  return <LexPlayground />;
}
