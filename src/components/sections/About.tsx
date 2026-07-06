import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { portfolio } from "../../data/portfolio";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { fadeUpVariants } from "../../lib/motion";
import { HoverHighlighter } from "../ui/HoverHighlighter";
import { ProfilePhoto } from "../ui/ProfilePhoto";
import { SectionWrapper } from "../ui/SectionWrapper";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const { education } = portfolio.about;

  return (
    <SectionWrapper id="about" className="grid-pattern" ariaLabelledBy="about-heading">
      <div className="mx-auto max-w-7xl">
        <motion.div className="mb-16 max-w-3xl" variants={fadeUpVariants}>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            About
          </p>
          <h2 id="about-heading" className="heading-lg font-display">
            Cloud, code &{" "}
            <HoverHighlighter
              text="creativity"
              textColor="inherit"
              penColor="#22d3ee"
              penOpacity={35}
              penHeight={50}
              penOffset={2}
              penRadius={3}
              penLeft={6}
              penRight={6}
              font={{
                fontFamily: "inherit",
                fontWeight: "inherit",
                fontSize: "inherit",
                lineHeight: "inherit",
              }}
              className="inline"
            />
          </h2>
        </motion.div>

        <div ref={ref} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div variants={fadeUpVariants}>
            <p className="mb-8 text-lg leading-relaxed text-muted font-body">{portfolio.about.bio}</p>

            <motion.div
              className="glass-strong rounded-2xl p-6"
              variants={fadeUpVariants}
            >
              <div className="mb-3 flex items-center gap-2 text-accent">
                <GraduationCap className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider font-body">Education</span>
              </div>
              <h3 className="text-lg font-bold font-display">{education.degree}</h3>
              <p className="mt-1 text-sm text-muted font-body">{education.school}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-wider font-body">
                <span className="text-muted">{education.period}</span>
                <span className="text-accent">CGPA {education.cgpa}</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-sm"
            style={reduced ? undefined : { y }}
          >
            <ProfilePhoto
              src={portfolio.about.avatar}
              alt={`Portrait of ${portfolio.name}`}
              size="sm"
              className="mx-auto"
            />
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-strong rounded-xl px-6 py-3 whitespace-nowrap"
              animate={reduced ? {} : { y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-xs font-medium uppercase tracking-wider text-muted font-body">
                LeetCode
              </p>
              <p className="text-xl font-bold text-accent font-body">250+ solved</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
