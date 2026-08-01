import type { Metadata } from "next";

import { RegexStudio } from "@/components/regex/regex-studio";

export const metadata: Metadata = {
  title: "Regex Studio",
  description:
    "The regex, NFA & DFA learning studio: build, explain, optimize, animate Thompson's construction and subset construction, trace backtracking, and export straight to lex code.",
};

export default function RegexStudioPage() {
  return <RegexStudio />;
}
