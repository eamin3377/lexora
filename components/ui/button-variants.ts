import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt-500/40 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.985] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-leaf-sheen text-white shadow-e1 hover:shadow-e2 hover:-translate-y-px hover:brightness-105 active:shadow-press",
        secondary:
          "bg-card text-ink-900 shadow-e1 ring-1 ring-line hover:bg-paper-1 hover:shadow-e2 hover:-translate-y-px",
        ghost:
          "bg-transparent text-ink-700 hover:bg-paper-1 hover:text-ink-900",
        destructive:
          "bg-coral-500 text-white shadow-e1 hover:shadow-e2 hover:-translate-y-px hover:brightness-105",
        outline:
          "bg-transparent text-ink-900 ring-1 ring-line hover:bg-paper-1",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-[13px] [&_svg]:size-4",
        md: "h-10 rounded-md px-4 text-sm [&_svg]:size-4",
        lg: "h-12 rounded-[10px] px-6 text-[15px] [&_svg]:size-5",
        xl: "h-13 rounded-[10px] px-7 text-[17px] font-semibold [&_svg]:size-5",
        icon: "size-10 rounded-md [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);
