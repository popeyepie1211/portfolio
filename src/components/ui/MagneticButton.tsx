import { motion } from "framer-motion";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { useMagnetic } from "../../hooks/useMagnetic";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../lib/cn";
import { buttonSpring } from "../../lib/motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}

export function MagneticButton({
  children,
  href,
  onClick,
  className,
  variant = "primary",
}: MagneticButtonProps) {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const enabled = isDesktop && !reduced;
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic(0.35, enabled);

  const variants = {
    primary: "bg-accent text-background hover:glow-accent",
    secondary: "glass text-foreground hover:border-white/20",
    ghost: "border border-white/10 text-foreground hover:bg-white/5",
  };

  const inner = (
    <motion.span
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-wider transition-colors focus-ring",
        variants[variant],
        className,
      )}
      style={{ x: enabled ? x : 0, y: enabled ? y : 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={buttonSpring}
      data-cursor="hover"
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="inline-block"
      >
        <a href={href} className="block" data-cursor="hover">
          {inner}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="inline-block"
    >
      <button type="button" onClick={onClick} className="block" data-cursor="hover">
        {inner}
      </button>
    </motion.div>
  );
}
