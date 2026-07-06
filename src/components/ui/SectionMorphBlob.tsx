import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function SectionMorphBlob() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();

  const y = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 200, 400, 600, 800]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 0.8]);
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    ["50%", "30% 70% 70% 30% / 30% 30% 70% 70%", "60% 40% 30% 70% / 60% 30% 70% 40%", "50%"],
  );

  if (reduced) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-1/2 top-1/2 z-0 h-[500px] w-[500px] -translate-x-1/2 opacity-[0.07] blur-3xl"
      style={{
        y,
        scale,
        borderRadius,
        background: "linear-gradient(135deg, #8b5cf6, #22d3ee, #c7f200)",
      }}
    />
  );
}
