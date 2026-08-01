import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        aria-invalid={error || undefined}
        className={cn(
          "h-10 w-full rounded-sm bg-card px-3.5 text-sm text-ink-900 shadow-e1 ring-1 ring-line transition-all duration-200 placeholder:text-ink-300",
          "focus:ring-2 focus:ring-cobalt-500/60 focus:outline-none",
          error && "ring-coral-500 focus:ring-coral-500/60",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
