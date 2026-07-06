import { motion } from "framer-motion";
import type { Experience } from "../../data/portfolio";
import { fadeUpVariants, viewport } from "../../lib/motion";

interface TimelineItemProps {
  item: Experience;
  index: number;
  isLast: boolean;
}

export function TimelineItem({ item, index, isLast }: TimelineItemProps) {
  return (
    <motion.div
      className="relative pl-10"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeUpVariants}
      transition={{ delay: index * 0.15 }}
    >
      {/* Node */}
      <motion.div
        className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-accent bg-background"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={viewport}
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: index * 0.15 }}
      />

      {/* Connector segment */}
      {!isLast && (
        <motion.div
          className="absolute left-[7px] top-6 w-0.5 origin-top bg-gradient-to-b from-accent/60 to-violet/20"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={viewport}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "calc(100% + 1rem)" }}
        />
      )}

      <div className="glass-strong rounded-2xl p-6">
        <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-lg font-bold">{item.role}</h3>
          <span className="text-sm text-accent">{item.company}</span>
        </div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
          {item.period}
        </p>
        <p className="text-sm leading-relaxed text-muted">{item.description}</p>
      </div>
    </motion.div>
  );
}
