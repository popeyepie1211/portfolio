import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function AnimatedInput({ label, className, id, ...props }: AnimatedInputProps) {
  const [focused, setFocused] = useState(false);
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="relative">
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={cn(
            "w-full rounded-xl bg-white/[0.04] px-4 py-3.5 text-foreground placeholder:text-muted/50 focus-ring",
            "border border-white/10 transition-colors focus:border-transparent",
            className,
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl"
          initial={false}
          animate={{
            boxShadow: focused
              ? "inset 0 0 0 2px rgba(139, 92, 246, 0.6)"
              : "inset 0 0 0 0px rgba(139, 92, 246, 0)",
          }}
          transition={{ duration: 0.25 }}
        />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-0 h-0.5 w-0 -translate-x-1/2 bg-gradient-to-r from-violet via-cyan to-pink"
          initial={false}
          animate={{
            width: focused ? "100%" : "0%",
            opacity: focused ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

interface AnimatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function AnimatedTextarea({ label, className, id, ...props }: AnimatedTextareaProps) {
  const [focused, setFocused] = useState(false);
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="relative">
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-muted">
        {label}
      </label>
      <div className="relative">
        <textarea
          id={inputId}
          className={cn(
            "min-h-[140px] w-full resize-none rounded-xl bg-white/[0.04] px-4 py-3.5 text-foreground placeholder:text-muted/50 focus-ring",
            "border border-white/10 transition-colors focus:border-transparent",
            className,
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl"
          initial={false}
          animate={{
            boxShadow: focused
              ? "inset 0 0 0 2px rgba(139, 92, 246, 0.6)"
              : "inset 0 0 0 0px rgba(139, 92, 246, 0)",
          }}
          transition={{ duration: 0.25 }}
        />
      </div>
    </div>
  );
}
