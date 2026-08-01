import type { Metadata } from "next";
import { Poppins, Sora, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jignasayaan — South India's Largest Student Yaan",
  description:
    "India's next-generation educational expedition platform. 1080+ students. 50+ institutions. 1 special train. 7 days. Kerala.",
  metadataBase: new URL("https://jignasayaan.example.com"),
  openGraph: {
    title: "Jignasayaan — South India's Largest Student Yaan",
    description:
      "Join the movement. An educational expedition through leadership, culture, innovation, and adventure.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${sora.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-body antialiased">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
