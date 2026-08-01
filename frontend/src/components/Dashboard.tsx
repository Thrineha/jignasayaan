import { fetchCounters } from "@/lib/api";
import DynamicIsland from "@/components/DynamicIsland";

// Fallback values shown if the API is unreachable, so the section never
// renders empty during local dev or a transient outage.
const FALLBACK = {
  students_registered: 0,
  seats_left: 1080,
  schools_joined: 0,
  colleges_joined: 0,
  districts_covered: 0,
};

export default async function Dashboard() {
  const counters = (await fetchCounters()) ?? FALLBACK;

  return (
    <section id="dashboard" className="bg-deep-blue py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-off-white sm:text-4xl">
          Expedition Dashboard
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-off-white/70">
          Live numbers, updated as students, schools, and colleges join the Yaan. Tap to expand.
        </p>

        <div className="mt-10">
          <DynamicIsland counters={counters} />
        </div>
      </div>
    </section>
  );
}
