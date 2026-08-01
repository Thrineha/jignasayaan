"use client";

import { motion } from "framer-motion";

const DESTINATIONS = [
  {
    name: "Trivandrum",
    tag: "Culture & Coast",
    desc: "Napier Museum, Kovalam's shoreline, and an evening of Kathakali storytelling.",
  },
  {
    name: "Munnar",
    tag: "Nature & Adventure",
    desc: "Tea gardens, misty ridgelines, and leadership challenges in the hills.",
  },
  {
    name: "Kochi",
    tag: "Innovation & Heritage",
    desc: "Fort Kochi's colonial streets alongside Kerala's growing startup scene.",
  },
];

export default function Destinations() {
  return (
    <section id="destinations" className="bg-off-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-charcoal sm:text-4xl">
          Destinations
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-charcoal/70">
          Every stop is an experience card — places, activities, and what students take home.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((dest, i) => (
            <motion.article
              key={dest.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-sm transition hover:shadow-xl"
            >
              <div className="flex h-40 items-end bg-yaan-gradient p-5">
                <span className="font-heading text-lg font-bold text-off-white">{dest.name}</span>
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-saffron">
                  {dest.tag}
                </span>
                <p className="mt-2 text-sm text-charcoal/70">{dest.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
