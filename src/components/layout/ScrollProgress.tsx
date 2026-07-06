import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="fixed left-0 top-0 z-[60] h-0.5 w-full bg-white/5">
      <motion.div
        className="h-full bg-gradient-to-r from-violet via-cyan to-pink"
        style={{ width, transformOrigin: "left" }}
      />
    </div>
  );
}
