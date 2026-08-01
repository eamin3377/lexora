import type { Metadata } from "next";

import { Ide } from "@/components/playground/ide";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "A VS Code-style compiler workspace: edit Flex and Bison specs, run the toolchain, and inspect problems, terminal, and output.",
};

export default function PlaygroundPage() {
  return <Ide />;
}
