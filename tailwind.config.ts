import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        magenta: { DEFAULT: "#C30239", deep: "#7A0220" },
        rose: { DEFAULT: "#F0829F", ink: "#B3103F" },
        gold: { DEFAULT: "#ECB86C", ink: "#7A5712" },
        ivory: "#FFFAF4",
        blush: "#FBEAEF",
        charcoal: "#2A2227",
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.5rem, 1.6rem + 4vw, 4.75rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        h1: ["clamp(2.25rem, 1.5rem + 3.2vw, 3.75rem)", { lineHeight: "1.08", letterSpacing: "-0.01em" }],
        h2: ["clamp(1.75rem, 1.3rem + 1.9vw, 2.75rem)", { lineHeight: "1.15" }],
        h3: ["clamp(1.375rem, 1.15rem + 0.9vw, 1.75rem)", { lineHeight: "1.2" }],
      },
      maxWidth: { page: "72rem", prose: "40rem" },
      boxShadow: {
        soft: "0 1px 2px rgba(122,2,32,.06), 0 12px 32px -12px rgba(122,2,32,.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
