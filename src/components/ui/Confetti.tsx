import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface ConfettiProps {
  active: boolean;
}

export function Confetti({ active }: ConfettiProps) {
  const reduced = useReducedMotion();
  const [pieces, setPieces] = useState<{ id: number; x: number; color: string }[]>([]);

  useEffect(() => {
    if (!active || reduced) return;
    const colors = ["#c7f200", "#8b5cf6", "#22d3ee", "#ec4899"];
    setPieces(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[i % colors.length],
      })),
    );
    const timer = setTimeout(() => setPieces([]), 3000);
    return () => clearTimeout(timer);
  }, [active, reduced]);

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      <AnimatePresence>
        {pieces.map((p) => (
          <motion.div
            key={p.id}
            className="absolute top-0 h-3 w-2 rounded-sm"
            style={{ left: `${p.x}%`, backgroundColor: p.color }}
            initial={{ y: -20, rotate: 0, opacity: 1 }}
            animate={{ y: "100vh", rotate: 720, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 + Math.random(), ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
