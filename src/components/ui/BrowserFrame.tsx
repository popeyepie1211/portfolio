import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface BrowserFrameProps {
  children: ReactNode;
  url?: string;
  className?: string;
}

export function BrowserFrame({ children, url = "localhost:3000", className }: BrowserFrameProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-white/10 bg-[#0d0d12]", className)}>
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-pink/70" />
        <span className="h-2 w-2 rounded-full bg-accent/70" />
        <span className="h-2 w-2 rounded-full bg-cyan/70" />
        <span className="ml-2 flex-1 truncate rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-muted">
          {url}
        </span>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
