"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#vision", label: "Vision" },
  { href: "#journey", label: "Journey" },
  { href: "#destinations", label: "Destinations" },
  { href: "#why-join", label: "Why Join" },
  { href: "#register", label: "Register" },
];

/**
 * The primary nav, styled and animated like iOS's Dynamic Island: a
 * floating black capsule rather than a full-width bar, which settles into
 * a tighter, slightly smaller pill once the page is scrolled (the same
 * compact/expanded morph as the counters island), and on mobile collapses
 * to logo + toggle, expanding downward into a stacked menu on tap.
 *
 * Also tracks which section is currently in view (scroll-spy) so the
 * matching link lights up -- the island "knows" where you are on the page.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile island if the viewport grows back to desktop.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Scroll-spy: a section counts as "current" once it crosses the middle
  // band of the viewport, so the nav highlight updates as you scroll
  // rather than only on click.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    const elements = LINKS.map((link) => document.getElementById(link.href.slice(1))).filter(
      (el): el is HTMLElement => el !== null
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed inset-x-0 top-3 z-50 flex justify-center px-4 sm:top-4">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-3xl rounded-[28px] bg-black/95 shadow-2xl shadow-black/50 ring-1 ring-white/10 backdrop-blur-md"
      >
        <motion.div
          layout
          animate={{ paddingTop: scrolled ? 6 : 10, paddingBottom: scrolled ? 6 : 10 }}
          className="flex items-center justify-between gap-4 px-4 sm:px-5"
        >
          <a href="#top" className="shrink-0 font-heading text-base font-bold tracking-wide text-off-white sm:text-lg">
            JIGNASA<span className="text-saffron">YAAN</span>
          </a>

          {/* Desktop: links live inside the same capsule; the current section stays lit. */}
          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => {
              const isActive = activeId === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`rounded-full px-3 py-1.5 font-body text-sm font-medium transition ${
                    isActive
                      ? "bg-white/15 text-golden"
                      : "text-off-white/80 hover:bg-white/10 hover:text-golden"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href="#register"
              className="hidden rounded-full bg-saffron px-4 py-1.5 font-heading text-sm font-semibold text-off-white transition hover:bg-golden hover:text-deep-blue sm:inline-block"
            >
              Join Jignasayaan
            </a>

            {/* Mobile toggle -- expands the island downward instead of navigating to a new page. */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex h-8 w-8 items-center justify-center rounded-full text-off-white transition hover:bg-white/10 md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.div>

        {/* Expanded island content on mobile. */}
        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col gap-1 px-4 pb-4 pt-1">
                {LINKS.map((link) => {
                  const isActive = activeId === link.href.slice(1);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive ? "true" : undefined}
                      className={`rounded-2xl px-3 py-2.5 font-body text-sm font-medium transition ${
                        isActive
                          ? "bg-white/15 text-golden"
                          : "text-off-white/90 hover:bg-white/10 hover:text-golden"
                      }`}
                    >
                      {link.label}
                    </a>
                  );
                })}
                <a
                  href="#register"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 rounded-2xl bg-saffron px-3 py-2.5 text-center font-heading text-sm font-semibold text-off-white transition hover:bg-golden hover:text-deep-blue"
                >
                  Join Jignasayaan
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
}
