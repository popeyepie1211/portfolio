import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../lib/cn";

interface GradientBlobProps {
  className?: string;
  duration?: number;
  delay?: number;
  color?: "violet" | "cyan" | "pink" | "accent";
}

const colors = {
  violet: "from-violet/30 via-violet/10 to-transparent",
  cyan: "from-cyan/25 via-cyan/10 to-transparent",
  pink: "from-pink/25 via-pink/10 to-transparent",
  accent: "from-accent/20 via-accent/5 to-transparent",
};

export function GradientBlob({
  className,
  duration = 8,
  delay = 0,
  color = "violet",
}: GradientBlobProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute rounded-full bg-gradient-radial blur-3xl",
        `bg-gradient-to-br ${colors[color]}`,
        className,
      )}
      animate={
        reduced
          ? { opacity: 0.4 }
          : {
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }
      }
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      style={{ willChange: "transform" }}
    />
  );
}
