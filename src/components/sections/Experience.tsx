import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { portfolio } from "../../data/portfolio";
import { SectionHeading, SectionWrapper } from "../ui/SectionWrapper";
import { TimelineItem } from "../ui/TimelineItem";

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <SectionWrapper id="experience" ariaLabelledBy="experience-heading">
      <div className="mx-auto max-w-3xl" ref={containerRef}>
        <SectionHeading
          id="experience-heading"
          eyebrow="Career"
          title="Experience"
          highlight="timeline"
        />

        <div className="relative">
          {/* Main vertical line */}
          <motion.div
            className="absolute bottom-0 left-[7px] top-0 w-0.5 origin-top bg-gradient-to-b from-accent via-violet/40 to-transparent"
            style={{ scaleY: lineScale }}
          />

          <div className="space-y-8">
            {portfolio.experience.map((item, i) => (
              <TimelineItem
                key={`${item.company}-${item.role}`}
                item={item}
                index={i}
                isLast={i === portfolio.experience.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
