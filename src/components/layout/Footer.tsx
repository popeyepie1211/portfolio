import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { portfolio } from "../../data/portfolio";
import { fadeUpVariants } from "../../lib/motion";
import { SocialIcon } from "../ui/SocialIcon";

export function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/5 px-6 py-12 md:px-12 lg:px-20">
      <motion.div
        className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUpVariants}
      >
        <div className="text-center md:text-left">
          <p className="text-lg font-bold uppercase tracking-wider">
            {portfolio.name.split(" ")[0]}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            © {year} {portfolio.name}. Crafted with motion.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {portfolio.contact.socials.map((social) => (
              <motion.a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full glass text-muted transition-colors focus-ring"
                whileHover={{ rotate: 12, scale: 1.1, color: "#c7f200" }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.platform}
                data-cursor="hover"
              >
                <SocialIcon platform={social.platform} className="h-5 w-5" />
              </motion.a>
            ))}
        </div>

        <motion.button
          type="button"
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted transition-colors hover:text-accent focus-ring"
          whileHover={{ y: -2 }}
          data-cursor="hover"
        >
          Back to top
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </footer>
  );
}
