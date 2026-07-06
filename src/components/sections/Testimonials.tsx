import { motion } from "framer-motion";
import { portfolio } from "../../data/portfolio";
import { fadeUpVariants } from "../../lib/motion";
import { Marquee } from "../ui/Marquee";
import { SectionHeading, SectionWrapper } from "../ui/SectionWrapper";

export function Testimonials() {
  if (portfolio.testimonials.length === 0) return null;

  return (
    <SectionWrapper ariaLabelledBy="testimonials-heading">
      <div className="mx-auto max-w-7xl overflow-hidden">
        <SectionHeading
          id="testimonials-heading"
          eyebrow="Kind Words"
          title="What people"
          highlight="say"
        />

        <Marquee speed={35} className="py-4">
          {portfolio.testimonials.map((t) => (
            <motion.blockquote
              key={t.author}
              className="w-[360px] shrink-0 glass-strong rounded-2xl p-6"
              variants={fadeUpVariants}
              data-cursor="hover"
            >
              <p className="mb-4 text-sm leading-relaxed text-muted">&ldquo;{t.quote}&rdquo;</p>
              <footer>
                <p className="font-semibold text-foreground">{t.author}</p>
                <p className="text-xs text-accent">{t.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </Marquee>
      </div>
    </SectionWrapper>
  );
}
