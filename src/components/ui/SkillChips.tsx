import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolio } from "../../data/portfolio";
import { fadeUpVariants, popVariants, viewport } from "../../lib/motion";
import { SectionHeading, SectionWrapper } from "./SectionWrapper";
import { AwsArchitectureGraphic } from "./AwsArchitectureGraphic";

export function SkillChips() {
  const [activeTab, setActiveTab] = useState(portfolio.skillCategories[0].id);
  const activeCategory = portfolio.skillCategories.find((c) => c.id === activeTab)!;

  return (
    <SectionWrapper id="skills" className="dot-pattern circuit-lines" ariaLabelledBy="skills-heading">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="skills-heading"
          eyebrow="Stack"
          title="Skills &"
          highlight="tools"
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <motion.div variants={fadeUpVariants}>
            <div className="mb-8 flex flex-wrap gap-2">
              {portfolio.skillCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all focus-ring ${
                    activeTab === cat.id
                      ? "bg-accent text-background"
                      : "glass text-muted hover:text-foreground"
                  }`}
                  data-cursor="hover"
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {activeCategory.skills.map((skill, i) => (
                  <motion.div
                    key={skill}
                    className="group relative"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    variants={popVariants}
                    transition={{ delay: i * 0.03 }}
                  >
                    <motion.span
                      className="inline-block cursor-default rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-foreground"
                      whileHover={{ y: -4, scale: 1.05, boxShadow: "0 8px 30px rgba(199,242,0,0.15)" }}
                      data-cursor="hover"
                    >
                      {skill}
                    </motion.span>
                    <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface px-2 py-1 text-[10px] text-accent opacity-0 transition-opacity group-hover:opacity-100">
                      {skill}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fadeUpVariants} className="hidden lg:block">
            <AwsArchitectureGraphic />
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
