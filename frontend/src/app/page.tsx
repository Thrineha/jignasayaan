import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Vision from "@/components/Vision";
import Dashboard from "@/components/Dashboard";
import JourneyTimeline from "@/components/JourneyTimeline";
import Destinations from "@/components/Destinations";
import WhyJoin from "@/components/WhyJoin";
import Registration from "@/components/Registration";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Vision />
      <Dashboard />
      <JourneyTimeline />
      <Destinations />
      <WhyJoin />
      <Registration />
      <Footer />
    </main>
  );
}
