import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_YEAR__: JSON.stringify(String(new Date().getFullYear())),
  },
  ssgOptions: {
    script: "async",
    formatting: "none",
    dirStyle: "nested",
  },
});
