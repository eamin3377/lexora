import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
  {
    variants: {
      variant: {
        leaf: "bg-leaf-100 text-leaf-700",
        marigold: "bg-marigold-100 text-marigold-700",
        coral: "bg-coral-100 text-coral-700",
        cobalt: "bg-cobalt-100 text-cobalt-700",
        orchid: "bg-orchid-100 text-orchid-700",
        ink: "bg-paper-2 text-ink-700",
        outline: "text-ink-500 ring-1 ring-line",
      },
    },
    defaultVariants: {
      variant: "ink",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
