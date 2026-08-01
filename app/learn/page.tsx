import type { Metadata } from "next";

import { Dashboard } from "@/components/learn/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function LearnPage() {
  return <Dashboard />;
}
