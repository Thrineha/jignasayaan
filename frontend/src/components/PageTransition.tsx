"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Wraps route content so every navigation feels like the train pulling
 * away from one station and into the next: the outgoing page slides left
 * and blurs like it's being left behind on the platform, the incoming page
 * arrives from the right and sharpens into focus, and a quick burst of
 * "speed lines" sells the motion in between.
 *
 * Respects prefers-reduced-motion by collapsing to a plain opacity fade.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const variants = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        initial: { opacity: 0, x: 90, filter: "blur(8px)" },
        animate: {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
        },
        exit: {
          opacity: 0,
          x: -90,
          filter: "blur(8px)",
          transition: { duration: 0.32, ease: "easeIn" as const },
        },
      };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        className="relative"
      >
        {!reduceMotion && <SpeedLines />}
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** A brief horizontal flash of "window streak" lines, like a train picking up speed. */
function SpeedLines() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col justify-evenly overflow-hidden"
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.span
          key={i}
          className="h-px bg-off-white/70"
          style={{ marginLeft: `${(i % 3) * 8}%` }}
          initial={{ scaleX: 0, x: "-10%" }}
          animate={{ scaleX: 1.4, x: "0%" }}
          transition={{ duration: 0.45, delay: i * 0.02, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
}
