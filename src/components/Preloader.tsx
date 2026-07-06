import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { portfolio } from "../data/portfolio";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { letterContainer, letterItem } from "../lib/motion";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"letters" | "wipe">("letters");
  const letters = portfolio.name.split("");

  useEffect(() => {
    const letterDuration = reduced ? 400 : letters.length * 50 + 800;
    const timer = setTimeout(() => setPhase("wipe"), letterDuration);
    return () => clearTimeout(timer);
  }, [letters.length, reduced]);

  useEffect(() => {
    if (phase === "wipe") {
      const timer = setTimeout(onComplete, reduced ? 300 : 900);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete, reduced]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {phase === "letters" && (
          <motion.div
            key="letters"
            className="flex"
            variants={letterContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {letters.map((letter, i) => (
              <motion.span
                key={`${letter}-${i}`}
                className="heading-lg inline-block gradient-text"
                variants={reduced ? undefined : letterItem}
                initial={reduced ? { opacity: 0 } : undefined}
                animate={reduced ? { opacity: 1 } : undefined}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.div>
        )}

        {phase === "wipe" && (
          <motion.div
            key="wipe"
            className="absolute inset-0 bg-gradient-to-br from-violet via-cyan to-pink"
            initial={{ clipPath: "circle(150% at 50% 50%)" }}
            animate={{ clipPath: "circle(0% at 50% 50%)" }}
            transition={{
              duration: reduced ? 0.3 : 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
