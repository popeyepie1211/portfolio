import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../lib/cn";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function Marquee({ children, speed = 30, className }: MarqueeProps) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);

  if (reduced) {
    return <div className={cn("flex flex-wrap gap-4", className)}>{children}</div>;
  }

  return (
    <div
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        className="flex w-max gap-6"
        animate={paused ? undefined : { x: ["0%", "-50%"] }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        <div className="flex gap-6">{children}</div>
        <div className="flex gap-6" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
