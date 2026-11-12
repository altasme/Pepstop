import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Admin panel: a separate client-only app served at /admin by the Worker. Built after the public site.
export default defineConfig({
  root: "admin",
  base: "/admin/",
  plugins: [react()],
  build: { outDir: "../dist/admin", emptyOutDir: true, sourcemap: false },
});
