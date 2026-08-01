// Placeholder illustrations under /public/journey -- swap these for real
// expedition photography (train-window shots, drone footage stills, etc.)
// as it becomes available. Filenames are stable so you can drop in
// replacements without touching this component.
const FRAMES = [
  { src: "/journey/countryside-fields.svg", alt: "Countryside fields passing by the train window" },
  { src: "/journey/western-ghats-hills.svg", alt: "Misty hills of the Western Ghats" },
  { src: "/journey/sunset-sky.svg", alt: "Sunset sky over the route" },
  { src: "/journey/kerala-backwaters.svg", alt: "Kerala backwaters lined with coconut palms" },
  { src: "/journey/temple-silhouette.svg", alt: "Temple silhouette at dusk" },
];

/**
 * A continuously scrolling row of "train window" frames -- the landscape
 * glides past behind a dark carriage frame, like looking out while
 * moving. Pure CSS animation (see .train-strip-track in globals.css), so
 * it costs nothing to hydrate and respects prefers-reduced-motion.
 *
 * The track is the frame list rendered twice back to back; animating it
 * exactly -50% creates a seamless, gapless loop.
 */
export default function TrainWindowStrip() {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden py-2"
      style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
    >
      <div className="train-strip-track flex w-max gap-4">
        {[...FRAMES, ...FRAMES].map((frame, i) => (
          <div
            key={`${frame.src}-${i}`}
            className="relative h-40 w-56 shrink-0 overflow-hidden rounded-2xl ring-[6px] ring-deep-blue shadow-xl sm:h-48 sm:w-64"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG placeholder, no next/image optimization needed */}
            <img src={frame.src} alt={frame.alt} className="h-full w-full object-cover" loading="lazy" />
            {/* Glass shine + carriage vignette, so it reads as a window rather than a flat photo. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/20" />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
