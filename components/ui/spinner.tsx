import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 24, className }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn("text-leaf-500", className)}
      role="status"
      aria-label="Loading"
    >
      <circle
        cx="32"
        cy="32"
        r="26"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="110 55"
        className="origin-center animate-ink-spin"
      />
      <circle cx="32" cy="32" r="15" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
    </svg>
  );
}
