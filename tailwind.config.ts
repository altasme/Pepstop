import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1A1217",
        raspberry: { DEFAULT: "#C30239", deep: "#7A0220" },
        petal: "#FDEFF2",
        mute: "#675A61",
        line: "#EBDDE2",
        gold: "#ECB86C",
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.5rem, 1.3rem + 5vw, 5rem)", { lineHeight: "0.98", letterSpacing: "-0.04em" }],
        h1: ["clamp(2.25rem, 1.4rem + 3.6vw, 4rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        h2: ["clamp(1.75rem, 1.25rem + 2.2vw, 3rem)", { lineHeight: "1.06", letterSpacing: "-0.03em" }],
        h3: ["clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },
      maxWidth: { page: "80rem", prose: "40rem" },
      boxShadow: {
        lift: "0 2px 4px rgba(26,18,23,.05), 0 16px 32px -16px rgba(26,18,23,.22)",
      },
      transitionTimingFunction: { out: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
} satisfies Config;
