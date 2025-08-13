import * as React from "react";
import { motion } from "framer-motion";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverLift?: boolean;
  initialY?: number;
  duration?: number;
};

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  hoverLift = true,
  initialY = 16,
  duration = 0.4,
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: initialY }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      whileHover={hoverLift ? { y: -4 } : undefined}
      whileTap={hoverLift ? { y: -1 } : undefined}
    >
      {children}
    </motion.div>
  );
}
