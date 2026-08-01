const REASONS = [
  "Leadership",
  "Adventure",
  "Friendship",
  "National Exposure",
  "Innovation",
  "Career Awareness",
  "Certificates",
  "Networking",
  "Confidence",
];

export default function WhyJoin() {
  return (
    <section id="why-join" className="bg-deep-blue py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-off-white sm:text-4xl">
          Why Join Jignasayaan
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {REASONS.map((reason) => (
            <div
              key={reason}
              className="rounded-xl border border-off-white/10 bg-off-white/5 px-4 py-6 text-center font-heading font-semibold text-off-white transition hover:border-golden hover:text-golden"
            >
              {reason}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
