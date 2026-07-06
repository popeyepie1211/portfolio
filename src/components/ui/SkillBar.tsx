import { motion } from "framer-motion";
import { viewport, popVariants } from "../../lib/motion";
import { cn } from "../../lib/cn";

interface SkillBarProps {
  name: string;
  level: number;
  index: number;
}

export function SkillBar({ name, level, index }: SkillBarProps) {
  return (
    <motion.div
      className="space-y-2"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={popVariants}
      transition={{ delay: index * 0.08 }}
    >
      <div className="flex justify-between text-sm">
        <span className="font-medium text-foreground">{name}</span>
        <span className="text-muted">{level}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet via-cyan to-accent"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={viewport}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
        />
      </div>
    </motion.div>
  );
}

export function SkillTag({ name, index }: { name: string; index: number }) {
  return (
    <motion.span
      className={cn(
        "glass rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted",
      )}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={popVariants}
      transition={{ delay: index * 0.05 }}
    >
      {name}
    </motion.span>
  );
}
