import { useState } from "react";
import { motion, useMotionTemplate, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../../data/portfolio";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { useTilt } from "../../hooks/useTilt";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../lib/cn";
import { fadeUpVariants, viewport } from "../../lib/motion";
import { BrowserFrame } from "./BrowserFrame";
import { CodeMentorMockup } from "./CodeMentorMockup";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const tiltEnabled = isDesktop && !reduced;
  const { ref, rotateX, rotateY, mouseX, mouseY, onMouseMove, onMouseLeave } =
    useTilt(tiltEnabled);

  const glowX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);
  const background = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(139, 92, 246, 0.15), transparent 60%)`;

  const isCodeReview = project.variant === "code-review";

  return (
    <motion.article
      ref={ref}
      className="group relative"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeUpVariants}
      transition={{ delay: index * 0.1 }}
      drag={tiltEnabled}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.15}
      dragSnapToOrigin
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        onMouseLeave();
        setHovered(false);
      }}
      onMouseEnter={() => setHovered(true)}
      style={
        tiltEnabled
          ? {
              rotateX,
              rotateY,
              transformPerspective: 1000,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
      data-cursor="hover"
    >
      <div className="relative overflow-hidden rounded-2xl glass-strong p-[1px]">
        {tiltEnabled && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background }}
          />
        )}

        <div className="relative overflow-hidden rounded-2xl bg-surface">
          <div className="absolute left-4 top-4 z-20">
            <span className="glass rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent font-body">
              {project.title.split(" ")[0]}
            </span>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden">
            <BrowserFrame
              url={project.repoUrl?.replace("https://", "") ?? "github.com"}
              className="h-full border-0 rounded-none"
            >
              {isCodeReview ? (
                <CodeMentorMockup />
              ) : (
                <motion.img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  animate={{ scale: hovered && tiltEnabled ? 1 : 1.08 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </BrowserFrame>
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-violet/40 via-transparent to-transparent pointer-events-none"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: hovered ? 0 : 0.5, y: hovered ? -20 : 0 }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="relative p-6">
            <h3 className="mb-2 text-xl font-bold tracking-tight font-display">{project.title}</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted font-body">{project.description}</p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted font-body"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: hovered ? 1 : 0.95,
                    opacity: hovered ? 1 : 0.7,
                  }}
                  transition={{
                    delay: hovered ? i * 0.05 : 0,
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            <motion.div
              className="mt-4 flex items-center gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: hovered ? 0 : 20, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {(project.liveUrl || project.repoUrl) && project.repoUrl !== "#" && (
                <a
                  href={project.liveUrl ?? project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-background focus-ring font-body"
                  data-cursor="hover"
                >
                  View Project
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
              {project.repoUrl && project.repoUrl !== "#" && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium uppercase tracking-wider text-muted transition-colors hover:text-foreground focus-ring font-body"
                  data-cursor="hover"
                >
                  Source
                </a>
              )}
              {project.repoUrl === "#" && (
                <span className="text-xs font-medium uppercase tracking-wider text-muted font-body">
                  Repo link coming soon
                </span>
              )}
            </motion.div>
          </div>

          {(project.liveUrl || project.repoUrl) && project.repoUrl !== "#" && (
            <motion.a
              href={project.liveUrl ?? project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-background",
                "shadow-lg transition-shadow hover:glow-accent focus-ring",
              )}
              whileHover={{ scale: 1.1, rotate: 45 }}
              whileTap={{ scale: 0.95 }}
              data-cursor="hover"
              aria-label={`View ${project.title}`}
            >
              <ArrowUpRight className="h-5 w-5" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
