import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export function EmailLink({ email }: { email: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.a
      href={`mailto:${email}`}
      className="group mt-6 inline-flex items-center gap-3 text-2xl font-bold gradient-text-accent focus-ring"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      data-cursor="hover"
    >
      <motion.div animate={{ rotateX: open ? 180 : 0 }} transition={{ duration: 0.4 }}>
        <Mail className="h-7 w-7 text-accent" />
      </motion.div>
      {email}
    </motion.a>
  );
}
