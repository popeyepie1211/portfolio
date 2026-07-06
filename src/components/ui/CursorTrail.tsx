import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface Particle {
  id: number;
  x: number;
  y: number;
}

export function CursorTrail() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (reduced || !isDesktop) return;

    let id = 0;
    const onMove = (e: MouseEvent) => {
      const particle: Particle = { id: id++, x: e.clientX, y: e.clientY };
      setParticles((prev) => [...prev.slice(-12), particle]);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced, isDesktop]);

  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, 100);
    return () => clearTimeout(timer);
  }, [particles]);

  if (reduced || !isDesktop) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9997]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute h-1.5 w-1.5 rounded-full bg-accent/60"
          style={{ left: p.x, top: p.y }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
    </div>
  );
}
