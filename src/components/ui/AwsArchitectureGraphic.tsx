import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// ---------------------------------------------------------------------------
// Floating Developer Ecosystem — Premium hero illustration
// Each item floats independently with parallax-like 3D drift.
// ---------------------------------------------------------------------------

interface FloatingItem {
  /** SVG content (inline) */
  icon: React.ReactNode;
  label: string;
  /** Position in % from top-left */
  x: number;
  y: number;
  /** Size in px */
  size: number;
  /** Glow / accent color */
  color: string;
  /** Animation delay offset */
  delay: number;
  /** Vertical drift range in px */
  drift?: number;
  /** Float duration in seconds */
  duration?: number;
}

// ---- Icon SVGs (hand-crafted, minimal, neon-stroke style) ----

const icons = {
  laptop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M2 20h20" />
      <path d="M7 8h4M7 11h2" opacity="0.5" />
    </svg>
  ),
  terminal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="M6 9l3 3-3 3" />
      <path d="M12 15h5" />
    </svg>
  ),
  git: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <path d="M6 8v10M8 6h8M18 8v4a2 2 0 01-2 2H8" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  ),
  docker: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 14s1-2 4-2 4 2 4 2" />
      <rect x="3" y="8" width="3" height="3" rx="0.5" />
      <rect x="7" y="8" width="3" height="3" rx="0.5" />
      <rect x="11" y="8" width="3" height="3" rx="0.5" />
      <rect x="7" y="4.5" width="3" height="3" rx="0.5" />
      <rect x="11" y="4.5" width="3" height="3" rx="0.5" />
      <path d="M19 11c1.5 0 3.5.5 3.5 2.5S21 16 19.5 16H3" />
    </svg>
  ),
  kubernetes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 3v7M12 14v7M3 12h7M14 12h7M5.6 5.6l5 5M13.4 13.4l5 5M5.6 18.4l5-5M13.4 10.6l5-5" />
    </svg>
  ),
  aws: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      <path d="M8 14l2-4 2 4M9 13h2" strokeWidth="1.2" />
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </svg>
  ),
  vscode: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2l4 2v16l-4 2L3 14l3-2.5M17 2L7 11.5M17 22L7 12.5" />
      <path d="M17 2v20" />
    </svg>
  ),
  react: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  ),
  nodejs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
      <path d="M12 7v10" />
      <path d="M7 9.5l5 3 5-3" />
    </svg>
  ),
  neural: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <circle cx="4" cy="6" r="1.5" />
      <circle cx="4" cy="12" r="1.5" />
      <circle cx="4" cy="18" r="1.5" />
      <circle cx="12" cy="8" r="1.5" />
      <circle cx="12" cy="16" r="1.5" />
      <circle cx="20" cy="12" r="1.5" />
      <path d="M5.5 6l5 2M5.5 12h5M5.5 18l5-2M13.5 8l5 4M13.5 16l5-4" opacity="0.7" />
    </svg>
  ),
  api: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h6M14 12h6" />
      <path d="M7 9l3 3-3 3" />
      <path d="M17 9l-3 3 3 3" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  brackets: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H6a2 2 0 00-2 2v4a2 2 0 01-2 2 2 2 0 012 2v4a2 2 0 002 2h2" />
      <path d="M16 3h2a2 2 0 012 2v4a2 2 0 002 2 2 2 0 00-2 2v4a2 2 0 01-2 2h-2" />
    </svg>
  ),
  cli: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17l6-6-6-6" />
      <path d="M12 19h8" />
    </svg>
  ),
  sync: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      <path d="M9 14l-2 2 2 2" />
      <path d="M15 12l2-2-2-2" />
      <path d="M7 16h8M9 10h8" />
    </svg>
  ),
  redis: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
};

const items: FloatingItem[] = [
  // ---- Large prominent items ----
  { icon: icons.react,       label: "React",         x: 12, y: 18,  size: 42, color: "#22d3ee", delay: 0,    drift: 14, duration: 6.5 },
  { icon: icons.aws,         label: "AWS",           x: 78, y: 12,  size: 44, color: "#f97316", delay: 0.4,  drift: 12, duration: 7 },
  { icon: icons.docker,      label: "Docker",        x: 55, y: 72,  size: 40, color: "#2196f3", delay: 0.8,  drift: 16, duration: 6 },

  // ---- Medium items ----
  { icon: icons.laptop,      label: "Laptop",        x: 35, y: 8,   size: 34, color: "#a78bfa", delay: 0.2,  drift: 10, duration: 7.5 },
  { icon: icons.terminal,    label: "Terminal",       x: 88, y: 42,  size: 32, color: "#4ade80", delay: 0.6,  drift: 12, duration: 5.5 },
  { icon: icons.git,         label: "Git",           x: 5,  y: 55,  size: 30, color: "#f97316", delay: 1.0,  drift: 11, duration: 6.8 },
  { icon: icons.kubernetes,  label: "K8s",           x: 68, y: 38,  size: 36, color: "#3b82f6", delay: 0.3,  drift: 13, duration: 7.2 },
  { icon: icons.nodejs,      label: "Node.js",       x: 25, y: 68,  size: 34, color: "#4ade80", delay: 0.7,  drift: 15, duration: 6.2 },
  { icon: icons.database,    label: "MySQL",         x: 82, y: 70,  size: 32, color: "#38bdf8", delay: 1.2,  drift: 10, duration: 7.8 },
  { icon: icons.neural,      label: "AI",            x: 42, y: 45,  size: 38, color: "#c084fc", delay: 0.5,  drift: 14, duration: 5.8 },

  // ---- Smaller accent items ----
  { icon: icons.vscode,      label: "VS Code",       x: 58, y: 10,  size: 28, color: "#38bdf8", delay: 1.4,  drift: 9,  duration: 8 },
  { icon: icons.api,         label: "API",           x: 18, y: 40,  size: 26, color: "#fbbf24", delay: 0.9,  drift: 10, duration: 6.5 },
  { icon: icons.folder,      label: "Files",         x: 90, y: 85,  size: 24, color: "#c7f200", delay: 1.6,  drift: 8,  duration: 7.3 },
  { icon: icons.rocket,      label: "Deploy",        x: 48, y: 88,  size: 30, color: "#ec4899", delay: 1.1,  drift: 13, duration: 5.5 },
  { icon: icons.brackets,    label: "Code",          x: 72, y: 88,  size: 26, color: "#a1a1aa", delay: 1.3,  drift: 9,  duration: 7.6 },
  { icon: icons.cli,         label: "CLI",           x: 2,  y: 85,  size: 24, color: "#4ade80", delay: 1.8,  drift: 7,  duration: 8.2 },
  { icon: icons.sync,        label: "Sync",          x: 35, y: 30,  size: 24, color: "#22d3ee", delay: 1.5,  drift: 11, duration: 6 },
  { icon: icons.redis,       label: "Redis",         x: 8,  y: 8,   size: 26, color: "#ef4444", delay: 2.0,  drift: 8,  duration: 7.5 },
  { icon: icons.cloud,       label: "Cloud",         x: 92, y: 20,  size: 26, color: "#a78bfa", delay: 0.1,  drift: 10, duration: 6.8 },
];

export function AwsArchitectureGraphic() {
  const reduced = useReducedMotion();

  return (
    <div className="relative w-full aspect-square select-none overflow-hidden">
      {items.map((item) => (
        <motion.div
          key={item.label}
          className="absolute flex flex-col items-center gap-1"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: item.size,
            height: item.size,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            delay: item.delay,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Glow backdrop */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-20 blur-xl"
            style={{ backgroundColor: item.color }}
            animate={
              reduced
                ? {}
                : {
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.3, 1],
                  }
            }
            transition={{
              duration: (item.duration ?? 6) * 0.8,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
          />

          {/* Icon container */}
          <motion.div
            className="relative flex items-center justify-center rounded-xl border backdrop-blur-sm"
            style={{
              width: item.size,
              height: item.size,
              color: item.color,
              borderColor: `${item.color}30`,
              backgroundColor: `${item.color}08`,
              boxShadow: `0 0 20px ${item.color}15, inset 0 1px 0 ${item.color}10`,
            }}
            animate={
              reduced
                ? {}
                : {
                    y: [0, -(item.drift ?? 10), 0],
                  }
            }
            transition={{
              duration: item.duration ?? 6,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.2,
              borderColor: `${item.color}80`,
              boxShadow: `0 0 30px ${item.color}40`,
              transition: { duration: 0.25 },
            }}
          >
            <div style={{ width: "55%", height: "55%" }}>{item.icon}</div>
          </motion.div>

          {/* Label */}
          <motion.span
            className="mt-0.5 text-center font-body text-[8px] font-medium uppercase tracking-wider whitespace-nowrap"
            style={{ color: item.color, opacity: 0.7 }}
            animate={
              reduced
                ? {}
                : {
                    y: [0, -(item.drift ?? 10), 0],
                  }
            }
            transition={{
              duration: item.duration ?? 6,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            {item.label}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

export function AwsBackground() {
  return null;
}
