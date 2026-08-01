"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Armchair, School, GraduationCap, MapPinned } from "lucide-react";
import type { LiveCounters } from "@/lib/api";

const ITEMS: {
  key: keyof LiveCounters;
  label: string;
  icon: typeof Users;
}[] = [
  { key: "students_registered", label: "Students", icon: Users },
  { key: "seats_left", label: "Seats Left", icon: Armchair },
  { key: "schools_joined", label: "Schools", icon: School },
  { key: "colleges_joined", label: "Colleges", icon: GraduationCap },
  { key: "districts_covered", label: "Districts", icon: MapPinned },
];

/**
 * A black capsule that behaves like iOS's Dynamic Island: a tight pill of
 * icon+number pairs at rest, that morphs open on hover/tap to reveal the
 * label under each figure. Pure CSS/layout-animation, no native APIs.
 */
export default function DynamicIsland({ counters }: { counters: LiveCounters }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex justify-center">
      <motion.button
        type="button"
        layout
        onClick={() => setExpanded((v) => !v)}
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
        aria-expanded={expanded}
        aria-label="Expedition live counters"
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="flex items-center gap-1 rounded-full bg-black px-3 py-2 shadow-2xl shadow-black/40 ring-1 ring-white/10 sm:gap-2 sm:px-4"
      >
        {ITEMS.map((item) => (
          <motion.div
            layout
            key={item.key}
            className="flex items-center gap-1.5 rounded-full px-2 py-1.5 sm:px-3"
          >
            <item.icon
              className="h-4 w-4 shrink-0 text-golden sm:h-[18px] sm:w-[18px]"
              strokeWidth={2.25}
            />
            <motion.span layout className="numeric font-numeric text-sm font-bold text-off-white sm:text-base">
              {counters[item.key].toLocaleString("en-IN")}
            </motion.span>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: "auto", marginLeft: 2 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap text-[10px] uppercase tracking-wide text-off-white/60 sm:text-xs"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.button>
    </div>
  );
}
