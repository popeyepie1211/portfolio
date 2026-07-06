import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-full glass focus-ring"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92, rotate: 15 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-cursor="hover"
    >
      <motion.div
        className="relative h-5 w-5"
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="absolute inset-0 h-5 w-5 text-foreground"
          initial={false}
          animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.5 : 1 }}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </motion.svg>
        <motion.svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute inset-0 h-5 w-5 text-accent"
          initial={false}
          animate={{ opacity: isDark ? 1 : 0, scale: isDark ? 1 : 0.5 }}
        >
          <path d="M21 14.5A7.5 7.5 0 0110.5 4 7.5 7.5 0 0014.5 21a7.5 7.5 0 006.5-6.5z" />
        </motion.svg>
      </motion.div>
    </motion.button>
  );
}
