"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import TrainWindowStrip from "@/components/TrainWindowStrip";
import MiniTrain from "@/components/MiniTrain";

const STOPS = [
  { title: "Vijayawada", desc: "Departure. Students board the special train and the Yaan begins." },
  { title: "Train Journey", desc: "Games, workshops, and bonding across compartments as India rolls by." },
  { title: "Kerala", desc: "Arrival at the capital — the heart of the expedition." },
  { title: "Knowledge", desc: "Science, technology, and innovation experiences." },
  { title: "Leadership", desc: "Team challenges and leadership labs." },
  { title: "Culture", desc: "Temples, traditions, and Kerala's living heritage." },
  { title: "Return", desc: "Journey home, changed by seven days that felt like a lifetime." },
];

export default function JourneyTimeline() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Progress through the track (0 -> 1) as the user scrolls it into and
  // out of view -- drives the train icon's position and a light sway,
  // so it visibly rides the line from Vijayawada down to Return.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start center", "end center"],
  });
  const top = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const clampedTop = useTransform(top, (v) => {
    const n = parseFloat(v as string);
    return `${Math.min(100, Math.max(0, n))}%`;
  });
  const sway = useTransform(scrollYProgress, [0, 0.5, 1], [-6, 6, -6]);

  return (
    <section id="journey" className="bg-off-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-charcoal sm:text-4xl">
          The Journey
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-charcoal/70">
          One train. Seven stations of discovery. Scroll to follow the route.
        </p>
      </div>

      <div className="mt-10">
        <TrainWindowStrip />
      </div>

      <div className="mx-auto max-w-4xl px-6">
        <div className="relative mt-16" ref={trackRef}>
          {/* Real rail track: two rails plus railway-tie sleepers, instead of a plain line. */}
          <div
            className="absolute left-4 top-0 h-full w-4 -translate-x-1/2 sm:left-1/2"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, #92400E 0, #92400E 3px, transparent 3px, transparent 15px)",
              backgroundPosition: "center",
              backgroundRepeat: "repeat-y",
              backgroundSize: "16px 15px",
              opacity: 0.45,
            }}
            aria-hidden
          />
          <div className="absolute left-3 top-0 h-full w-[3px] bg-saffron/50 sm:left-[calc(50%-6px)]" aria-hidden />
          <div className="absolute left-5 top-0 h-full w-[3px] bg-saffron/50 sm:left-[calc(50%+6px)]" aria-hidden />

          {/* Train that literally rides the track as you scroll -- wheels spin and smoke rises continuously. */}
          {!reduceMotion && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-4 z-10 -translate-x-1/2 sm:left-1/2"
              style={{ top: clampedTop }}
            >
              <motion.div style={{ rotate: sway }} className="drop-shadow-[0_6px_10px_rgba(15,23,42,0.35)]">
                <div className="train-chug">
                  <MiniTrain />
                </div>
              </motion.div>
            </motion.div>
          )}

          <ol className="space-y-12">
            {STOPS.map((stop, i) => (
              <motion.li
                key={stop.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className={`relative flex flex-col gap-2 pl-12 sm:w-1/2 sm:pl-0 sm:pr-12 ${
                  i % 2 === 1 ? "sm:ml-auto sm:pl-12 sm:pr-0 sm:text-left" : "sm:text-right"
                }`}
              >
                <span
                  className="absolute left-2.5 top-1 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-off-white bg-saffron sm:left-auto sm:right-0 sm:translate-x-1/2"
                  style={i % 2 === 1 ? { left: "-1.5rem", right: "auto" } : undefined}
                  aria-hidden
                />
                <span className="font-numeric text-xs uppercase tracking-widest text-saffron">
                  Station {i + 1}
                </span>
                <h3 className="font-heading text-xl font-bold text-charcoal">{stop.title}</h3>
                <p className="text-sm text-charcoal/70">{stop.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
