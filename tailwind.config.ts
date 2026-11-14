import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Values live in src/styles/tokens.css as RGB channels so opacity utilities (text-ink/80) keep working.
        ground: "rgb(var(--c-ground) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        claret: "rgb(var(--c-claret) / <alpha-value>)",
        raspberry: { DEFAULT: "rgb(var(--c-raspberry) / <alpha-value>)", deep: "rgb(var(--c-raspberry-deep) / <alpha-value>)" },
        petal: "rgb(var(--c-petal) / <alpha-value>)",
        rosewater: "rgb(var(--c-rosewater) / <alpha-value>)",
        mute: "rgb(var(--c-mute) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        edge: "rgb(var(--c-edge) / <alpha-value>)",
        gold: { DEFAULT: "rgb(var(--c-gold) / <alpha-value>)", ink: "rgb(var(--c-gold-ink) / <alpha-value>)" },
      },
      fontFamily: {
        sans: "var(--font-sans)",
        display: "var(--font-display)",
      },
      fontSize: {
        display: ["clamp(2.5rem, 1rem + 2.6vw, 3.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        h1: ["clamp(2.25rem, 1.4rem + 3.6vw, 4rem)", { lineHeight: "1.06", letterSpacing: "-0.02em" }],
        h2: ["clamp(1.75rem, 1.25rem + 2.2vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        h3: ["clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },
      maxWidth: { page: "80rem", prose: "40rem" },
      boxShadow: {
        lift: "var(--shadow-lift)",
      },
      transitionTimingFunction: { out: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
} satisfies Config;
