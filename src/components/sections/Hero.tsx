import { motion } from "framer-motion";
import { ChevronDown, Download } from "lucide-react";
import { portfolio } from "../../data/portfolio";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { wordContainer, wordItem } from "../../lib/motion";
import { FluidBackground } from "../ui/FluidBackground";
import { HoverHighlighter } from "../ui/HoverHighlighter";
import { MagneticButton } from "../ui/MagneticButton";
import {
  AnimatedCounter,
  DeployButton,
  TerminalWidget,
  TextScramble,
} from "../ui/InteractiveWidgets";
import { ProfilePhoto } from "../ui/ProfilePhoto";
import { TypeBand } from "../ui/TypeBand";

export function Hero() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const { headline, gradientWords, subtext, cta, stats } = portfolio.hero;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 md:px-12"
      aria-label="Hero"
    >
      {/* Fluid shader background — replaces static blobs and grid */}
      <div className="fluid-background">
        <FluidBackground
          patternStyle={3}
          abyssBase="#050510"
          abyssMid="#0a1a3d"
          abyssHigh="#8b5cf6"
          speed={0.3}
          scale={1}
          distortion={2.5}
          brightness={1.5}
          refraction={1}
        />
      </div>

      {/* Dark overlay for text readability */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(5,5,16,0.3)_0%,rgba(5,5,16,0.7)_70%,rgba(5,5,16,0.85)_100%)]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_auto]">
        <div className="text-center lg:text-left">
          <motion.p
            className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent font-body"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <TextScramble text={portfolio.tagline} />
          </motion.p>

          <motion.p
            className="mb-6 text-xs text-muted font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {portfolio.role}
          </motion.p>

          {/* Headline with HoverHighlighter on each word */}
          <motion.h1
            className="heading-xl mb-6 font-display"
            variants={wordContainer}
            initial="hidden"
            animate="visible"
          >
            {headline.map((word, i) => (
              <motion.span
                key={word}
                className="mr-[0.2em] inline-block"
                variants={wordItem}
              >
                {gradientWords.includes(i) ? (
                  <HoverHighlighter
                    text={word}
                    textColor="inherit"
                    penColor="#8b5cf6"
                    penOpacity={40}
                    penHeight={45}
                    penOffset={4}
                    penRadius={4}
                    penLeft={6}
                    penRight={6}
                    font={{
                      fontFamily: "inherit",
                      fontWeight: "inherit",
                      fontSize: "inherit",
                      lineHeight: "inherit",
                    }}
                    className="inline gradient-text"
                  />
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-muted font-body lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {subtext}
          </motion.p>

          {/* TypeBand — interactive text slider */}
          <motion.div
            className="mb-8 flex justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <TypeBand
              text={portfolio.role}
              textColor="#f4f4f5"
              borderColor="#c7f200"
              handleColor="#1a1a2e"
              handleBorderColor="#c7f200"
              handleBarColor="#c7f200"
              fontSize="20px"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight={600}
              letterSpacing="-0.01em"
              padding="12px 16px"
            />
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <MagneticButton href={cta.href}>{cta.label}</MagneticButton>
            <MagneticButton href={portfolio.resumeUrl} variant="secondary">
              <span className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Resume
              </span>
            </MagneticButton>
          </motion.div>

          <DeployButton />
          <TerminalWidget />

          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-strong rounded-2xl px-6 py-5"
                initial={{ opacity: 0, y: 40 }}
                animate={
                  reduced || !isDesktop
                    ? { opacity: 1, y: 0 }
                    : { opacity: 1, y: [0, -8, 0] }
                }
                transition={
                  reduced || !isDesktop
                    ? { delay: 1 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                    : {
                        opacity: { delay: 1 + i * 0.15, duration: 0.6 },
                        y: { duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 + i * 0.3 },
                      }
                }
              >
                <p className="text-3xl font-bold tracking-tight text-accent font-body">
                  {stat.animate && typeof stat.value === "number" ? (
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  ) : (
                    <>
                      {stat.value}
                      {stat.suffix}
                    </>
                  )}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted font-body">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mx-auto lg:mx-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <ProfilePhoto
            src={portfolio.photo}
            alt={`Portrait of ${portfolio.name}`}
            size="lg"
          />
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted focus-ring"
        animate={reduced ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll to about section"
        data-cursor="hover"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.a>
    </section>
  );
}

