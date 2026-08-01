import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "deep-blue": "#0F172A",
        saffron: "#F97316",
        emerald: "#10B981",
        golden: "#FBBF24",
        "off-white": "#F8FAFC",
        charcoal: "#111827",
      },
      fontFamily: {
        heading: ["var(--font-sora)", "var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        numeric: ["var(--font-space-grotesk)", "sans-serif"],
      },
      backgroundImage: {
        "yaan-gradient": "linear-gradient(135deg, #0F172A 0%, #0F172A 60%, #F97316 150%)",
      },
    },
  },
  plugins: [],
};

export default config;
