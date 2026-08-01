import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-paper-2 bg-[linear-gradient(90deg,transparent,rgba(253,251,247,0.9),transparent)] bg-[length:400px_100%] bg-no-repeat",
        className,
      )}
      aria-hidden
      {...props}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-lg bg-card p-6 shadow-e1 ring-1 ring-line/60">
      <Skeleton className="h-32 w-full rounded-md" />
      <Skeleton className="mt-4 h-5 w-2/3" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonRow };
