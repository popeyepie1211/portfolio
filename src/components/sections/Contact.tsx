import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, CheckCircle, Phone } from "lucide-react";
import { portfolio } from "../../data/portfolio";
import { buttonSpring, fadeUpVariants } from "../../lib/motion";
import { AnimatedInput, AnimatedTextarea } from "../ui/AnimatedInput";
import { Confetti } from "../ui/Confetti";
import { EmailLink } from "../ui/EmailLink";
import { SectionHeading, SectionWrapper } from "../ui/SectionWrapper";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setConfetti(true);
    setTimeout(() => {
      setSubmitted(false);
      setConfetti(false);
    }, 4000);
  };

  return (
    <>
      <Confetti active={confetti} />
      <SectionWrapper id="contact" ariaLabelledBy="contact-heading">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading
                id="contact-heading"
                eyebrow="Contact"
                title="Let's build"
                highlight="something great"
              />
              <motion.p className="text-lg text-muted font-body" variants={fadeUpVariants}>
                Have a cloud project or full-stack app in mind? Drop me a line — I love
                turning ambitious ideas into deployed reality.
              </motion.p>
              <EmailLink email={portfolio.contact.email} />
              <motion.a
                href={`tel:${portfolio.contact.phone.replace(/\s/g, "")}`}
                className="mt-4 flex items-center gap-2 text-muted transition-colors hover:text-accent focus-ring font-body"
                variants={fadeUpVariants}
                data-cursor="hover"
              >
                <Phone className="h-4 w-4" />
                {portfolio.contact.phone}
              </motion.a>
            </div>

            <motion.form
              className="glass-strong space-y-5 rounded-2xl p-8"
              onSubmit={handleSubmit}
              variants={fadeUpVariants}
            >
              <AnimatedInput label="Name" name="name" required placeholder="Your name" />
              <AnimatedInput
                label="Email"
                name="email"
                type="email"
                required
                placeholder="you@email.com"
              />
              <AnimatedTextarea
                label="Message"
                name="message"
                required
                placeholder="Tell me about your project..."
              />

              <motion.button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-bold uppercase tracking-wider text-background focus-ring font-body"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={buttonSpring}
                data-cursor="hover"
              >
                <Send className="h-4 w-4" />
                Send Message
              </motion.button>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    className="flex items-center justify-center gap-2 text-sm text-accent font-body"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Message sent! I&apos;ll get back to you soon.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
