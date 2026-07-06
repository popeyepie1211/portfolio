export const easePremium = [0.22, 1, 0.36, 1] as const;

export const springMagnetic = { stiffness: 150, damping: 15 };
export const springCursor = { stiffness: 500, damping: 28 };
export const springTilt = { stiffness: 300, damping: 30 };

export const fadeUpVariants = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { ease: easePremium, duration: 0.7 },
  },
};

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const letterContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

export const letterItem = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { ease: easePremium, duration: 0.5 },
  },
};

export const wordContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export const wordItem = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { ease: easePremium, duration: 0.6 },
  },
};

export const popVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 25 },
  },
};

export const viewport = { once: true, amount: 0.3 } as const;

export const buttonSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 17,
};
