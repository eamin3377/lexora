import { ProgressProvider } from "@/lib/learn/store";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <ProgressProvider>{children}</ProgressProvider>;
}
