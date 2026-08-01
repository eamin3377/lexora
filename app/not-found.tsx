import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper-0 px-4 pt-16">
      <div className="rounded-xl bg-term px-8 py-6 font-mono text-sm shadow-device">
        <p className="text-term-text/60">$ lexora resolve {"<url>"}</p>
        <p className="mt-2 text-coral-300">
          error: unexpected token &apos;/&apos; at line 404
        </p>
        <p className="text-term-text/60">
          hint: this page was optimized away
          <span className="animate-blink ml-1 inline-block h-4 w-2 translate-y-0.5 bg-term-text" />
        </p>
      </div>
      <Link href="/" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
        Parse me home
      </Link>
    </div>
  );
}
