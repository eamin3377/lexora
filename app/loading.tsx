import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper-0">
      <Spinner size={48} />
      <p className="font-mono text-sm text-ink-500">warming up the machine…</p>
    </div>
  );
}
