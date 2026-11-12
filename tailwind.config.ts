import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2B1220",
        claret: "#5A0118",
        raspberry: { DEFAULT: "#C30239", deep: "#7A0220" },
        petal: "#FFEEF2",
        rosewater: "#F8CDD9",
        mute: "#6F5B66",
        line: "#F2D9E1",
        edge: "#8F7A86",
        gold: "#ECB86C",
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', "system-ui", "sans-serif"],
        display: ['"Bodoni Moda"', "Georgia", "serif"],
      },
      fontSize: {
        display: ["clamp(2.5rem, 1rem + 2.6vw, 3.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        h1: ["clamp(2.25rem, 1.4rem + 3.6vw, 4rem)", { lineHeight: "1.06", letterSpacing: "-0.02em" }],
        h2: ["clamp(1.75rem, 1.25rem + 2.2vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        h3: ["clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },
      maxWidth: { page: "80rem", prose: "40rem" },
      boxShadow: {
        lift: "0 2px 4px rgba(43,18,32,.05), 0 16px 32px -16px rgba(43,18,32,.22)",
      },
      transitionTimingFunction: { out: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
} satisfies Config;
