"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Expedition departure date -- update once finalized.
const EXPEDITION_DATE = new Date("2026-12-20T05:00:00+05:30");

function useCountdown(target: Date) {
  const [remaining, setRemaining] = useState(() => target.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => setRemaining(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const clamped = Math.max(0, remaining);
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((clamped / (1000 * 60)) % 60);
  const seconds = Math.floor((clamped / 1000) % 60);

  return { days, hours, minutes, seconds };
}

const STATS = [
  { value: "1080+", label: "Students" },
  { value: "50+", label: "Institutions" },
  { value: "1", label: "Special Train" },
  { value: "7", label: "Days" },
  { value: "Kerala", label: "Capital" },
];

export default function Hero() {
  const { days, hours, minutes, seconds } = useCountdown(EXPEDITION_DATE);

  return (
    <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep-blue">
      {/* Cinematic background: swap the poster/video src for the real expedition footage. */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
      >
        <source src="/hero-reel.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-deep-blue/70 via-deep-blue/60 to-deep-blue" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-golden"
        >
          I am joining a movement
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-4xl font-extrabold leading-tight text-off-white sm:text-6xl md:text-7xl"
        >
          SOUTH INDIA&apos;S LARGEST <span className="text-saffron">STUDENT YAAN</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-10"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="numeric font-numeric text-2xl font-bold text-off-white sm:text-3xl">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-wide text-off-white/70">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-10 flex max-w-md justify-center gap-4"
          aria-label="Countdown to departure"
        >
          {[
            { value: days, label: "Days" },
            { value: hours, label: "Hrs" },
            { value: minutes, label: "Min" },
            { value: seconds, label: "Sec" },
          ].map((unit) => (
            <div
              key={unit.label}
              className="flex w-16 flex-col items-center rounded-lg border border-off-white/20 bg-off-white/5 py-3 backdrop-blur-sm"
            >
              <span className="numeric font-numeric text-xl font-bold text-golden">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase text-off-white/70">{unit.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <a
            href="#register"
            className="rounded-full bg-saffron px-8 py-3 font-heading font-semibold text-off-white shadow-lg shadow-saffron/30 transition hover:bg-golden hover:text-deep-blue"
          >
            Register Now
          </a>
          <a
            href="#journey"
            className="rounded-full border border-off-white/40 px-8 py-3 font-heading font-semibold text-off-white transition hover:border-golden hover:text-golden"
          >
            Watch Film
          </a>
        </motion.div>
      </div>
    </section>
  );
}
