import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { portfolio } from "../../data/portfolio";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function TextScramble({ text, className }: { text: string; className?: string }) {
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  const [display, setDisplay] = useState(text);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iteration) return text[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(""),
      );
      iteration += 1 / 3;
      if (iteration >= text.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [text, reduced]);

  return <span className={className}>{display}</span>;
}

export function AnimatedCounter({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setCount(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const startTime = performance.now();
        const duration = 1500;

        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          setCount(Math.floor(progress * value));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );

    const el = document.getElementById("leetcode-counter");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [value, reduced]);

  return (
    <span id="leetcode-counter" className={className}>
      {count}
      {suffix}
    </span>
  );
}

export function TerminalWidget() {
  const { command, output } = portfolio.terminal;
  const [typed, setTyped] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setTyped(command);
      setShowOutput(true);
      return;
    }

    let i = 0;
    const typeInterval = setInterval(() => {
      i++;
      setTyped(command.slice(0, i));
      if (i >= command.length) {
        clearInterval(typeInterval);
        setTimeout(() => setShowOutput(true), 400);
      }
    }, 60);

    return () => clearInterval(typeInterval);
  }, [command, reduced]);

  return (
    <motion.div
      className="glass-strong mx-auto mt-8 max-w-md rounded-xl p-4 text-left font-mono text-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
    >
      <div className="mb-2 flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-pink/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-cyan/80" />
      </div>
      <p className="text-accent">
        {typed}
        {!showOutput && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            ▋
          </motion.span>
        )}
      </p>
      {showOutput && (
        <motion.p
          className="mt-2 text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          → {output}
        </motion.p>
      )}
    </motion.div>
  );
}

export function DeployButton() {
  const [deploying, setDeploying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  const handleDeploy = () => {
    if (deploying) return;
    setDeploying(true);
    setDone(false);
    setProgress(0);

    if (reduced) {
      setProgress(100);
      setDone(true);
      setDeploying(false);
      return;
    }

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setDone(true);
        setTimeout(() => {
          setDeploying(false);
          setDone(false);
          setProgress(0);
        }, 2000);
      }
      setProgress(Math.min(p, 100));
    }, 200);
  };

  return (
    <motion.div className="mt-4 inline-block">
      <motion.button
        type="button"
        onClick={handleDeploy}
        className="relative overflow-hidden rounded-full border border-accent/30 bg-accent/10 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-accent focus-ring"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-cursor="hover"
      >
        {done ? "✓ Deployed!" : deploying ? `Deploying… ${Math.round(progress)}%` : "Click to Deploy ☁"}
        {deploying && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-accent"
            style={{ width: `${progress}%` }}
          />
        )}
      </motion.button>
    </motion.div>
  );
}
