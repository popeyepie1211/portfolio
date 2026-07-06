import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { fadeUpVariants, staggerContainer, viewport } from "../../lib/motion";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  ariaLabelledBy?: string;
}

export function SectionWrapper({
  id,
  className,
  children,
  ariaLabelledBy,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn("relative px-6 py-24 md:px-12 lg:px-20", className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={staggerContainer}
    >
      {children}
    </motion.section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  highlight,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  className?: string;
}) {
  return (
    <motion.div className={cn("mb-16 max-w-3xl", className)} variants={fadeUpVariants}>
      {eyebrow && (
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="heading-lg font-display">
        {title}{" "}
        {highlight && <span className="gradient-text">{highlight}</span>}
      </h2>
    </motion.div>
  );
}
