import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Phone, Send } from "lucide-react";
import { portfolio } from "../../data/portfolio";
import { cn } from "../../lib/cn";
import { buttonSpring, fadeUpVariants } from "../../lib/motion";
import { AnimatedInput, AnimatedTextarea } from "../ui/AnimatedInput";
import { Confetti } from "../ui/Confetti";
import { EmailLink } from "../ui/EmailLink";
import { SectionHeading, SectionWrapper } from "../ui/SectionWrapper";

type SubmissionStatus = "idle" | "sending" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [confetti, setConfetti] = useState(false);
  const feedbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current !== null) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const clearFeedbackTimer = () => {
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearFeedbackTimer();
    setStatus("sending");
    setFeedback("Sending your message...");
    setConfetti(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.message ?? "I could not send your message right now.");
      }

      setStatus("success");
      setFeedback(
        result.message ?? "Message received. I’ll get back to you soon and you’ll get a confirmation email shortly.",
      );
      setConfetti(true);
      form.reset();

      feedbackTimerRef.current = window.setTimeout(() => {
        setStatus("idle");
        setFeedback("");
        setConfetti(false);
        feedbackTimerRef.current = null;
      }, 4000);
    } catch (error) {
      setStatus("error");
      setConfetti(false);
      setFeedback(error instanceof Error ? error.message : "I could not send your message right now.");
    }
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
              aria-busy={status === "sending"}
              variants={fadeUpVariants}
            >
              <input
                className="hidden"
                aria-hidden="true"
                autoComplete="off"
                tabIndex={-1}
                name="website"
                type="text"
              />
              <AnimatedInput
                label="Name"
                name="name"
                required
                placeholder="Your name"
                disabled={status === "sending"}
              />
              <AnimatedInput
                label="Email"
                name="email"
                type="email"
                required
                placeholder="you@email.com"
                disabled={status === "sending"}
              />
              <AnimatedTextarea
                label="Message"
                name="message"
                required
                placeholder="Tell me about your project..."
                disabled={status === "sending"}
              />

              <motion.button
                type="submit"
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-bold uppercase tracking-wider text-background focus-ring font-body",
                  status === "sending" && "cursor-wait opacity-80",
                )}
                disabled={status === "sending"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={buttonSpring}
                data-cursor="hover"
              >
                <Send className="h-4 w-4" />
                {status === "sending" ? "Sending..." : "Send Message"}
              </motion.button>

              <AnimatePresence>
                {feedback && (
                  <motion.div
                    className={cn(
                      "flex items-center justify-center gap-2 text-sm font-body",
                      status === "error" ? "text-red-300" : "text-accent",
                    )}
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {status === "error" ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {feedback}
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
