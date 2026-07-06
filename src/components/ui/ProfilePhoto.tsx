import { motion } from "framer-motion";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../lib/cn";

interface ProfilePhotoProps {
  src: string;
  alt: string;
  size?: "lg" | "sm";
  className?: string;
}

export function ProfilePhoto({ src, alt, size = "lg", className }: ProfilePhotoProps) {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  const sizes = {
    lg: "h-48 w-48 md:h-64 md:w-64",
    sm: "h-40 w-40",
  };

  return (
    <motion.div
      className={cn("relative", className)}
      whileHover={isDesktop && !reduced ? { rotate: 2, scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      data-cursor="hover"
    >
      <motion.div
        className={cn(
          "absolute -inset-1 rounded-full bg-gradient-to-br from-violet via-cyan to-accent opacity-70 blur-sm",
          sizes[size],
        )}
        animate={reduced ? {} : { rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <div
        className={cn(
          "relative overflow-hidden rounded-full border-2 border-white/20 bg-surface",
          sizes[size],
        )}
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/avatar.svg";
          }}
        />
      </div>
    </motion.div>
  );
}
