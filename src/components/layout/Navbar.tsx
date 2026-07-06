import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { portfolio } from "../../data/portfolio";
import { useActiveSection } from "../../hooks/useActiveSection";
import { cn } from "../../lib/cn";
import { HoverHighlighter } from "../ui/HoverHighlighter";
import { MagneticButton } from "../ui/MagneticButton";
import { ThemeToggle } from "../ui/ThemeToggle";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [origin, setOrigin] = useState({ x: 50, y: 5 });
  const activeSection = useActiveSection();
  const { scrollY } = useScroll();

  const height = useTransform(scrollY, [0, 120], [80, 56]);
  const backgroundColor = useTransform(
    scrollY,
    [0, 120],
    ["rgba(10, 10, 15, 0)", "rgba(10, 10, 15, 0.85)"],
  );
  const backdropBlur = useTransform(scrollY, [0, 120], ["blur(0px)", "blur(16px)"]);

  useEffect(() => {
    if (menuOpen && hamburgerRef.current) {
      const rect = hamburgerRef.current.getBoundingClientRect();
      setOrigin({
        x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
        y: ((rect.top + rect.height / 2) / window.innerHeight) * 100,
      });
    }
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = portfolio.nav;

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-50 px-6 md:px-12"
        style={{ height }}
      >
        <motion.div
          className="absolute inset-0 border-b border-white/5 bg-background/0 backdrop-blur-none transition-colors"
          style={{ backgroundColor, backdropFilter: backdropBlur }}
        />
        <motion.nav
          className="relative mx-auto flex h-full max-w-7xl items-center justify-between gap-4"
          aria-label="Main navigation"
        >
          <motion.a
            href="#"
            className="font-display text-lg font-bold tracking-wider focus-ring"
            data-cursor="hover"
            whileTap={{ rotate: [0, -8, 8, -4, 0], scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            {portfolio.name.split(" ")[0]}
            <span className="text-accent">.</span>
          </motion.a>

          <ul className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <li key={link.href} className="relative">
                  <a
                    href={link.href}
                    className={cn(
                      "font-display text-sm font-medium tracking-wide transition-colors focus-ring",
                      isActive ? "text-foreground" : "text-muted hover:text-foreground",
                    )}
                    data-cursor="hover"
                  >
                    {isActive ? (
                      <>
                        {link.label}
                        <motion.span
                          layoutId="navUnderline"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-violet via-cyan to-accent"
                        />
                      </>
                    ) : (
                      <HoverHighlighter
                        text={link.label}
                        textColor="inherit"
                        penColor="#c7f200"
                        penOpacity={30}
                        penHeight={40}
                        penOffset={0}
                        penRadius={2}
                        penLeft={3}
                        penRight={3}
                        font={{
                          fontFamily: "inherit",
                          fontWeight: "inherit",
                          fontSize: "inherit",
                          lineHeight: "inherit",
                          letterSpacing: "inherit",
                        }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <MagneticButton href="#contact" variant="primary">
              Hire Me
            </MagneticButton>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              ref={hamburgerRef}
              type="button"
              className="relative z-[70] flex h-10 w-10 items-center justify-center rounded-full glass focus-ring"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[65] flex items-center justify-center bg-background/95 backdrop-blur-2xl lg:hidden"
            initial={{ clipPath: `circle(0% at ${origin.x}% ${origin.y}%)` }}
            animate={{ clipPath: `circle(150% at ${origin.x}% ${origin.y}%)` }}
            exit={{ clipPath: `circle(0% at ${origin.x}% ${origin.y}%)` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.ul
              className="flex flex-col items-center gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
              }}
            >
              {navLinks.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                >
                  <a
                    href={link.href}
                    className="font-display text-2xl font-bold tracking-wider focus-ring"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              >
                <MagneticButton href="#contact" onClick={() => setMenuOpen(false)}>
                  Hire Me
                </MagneticButton>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
