import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // base "./" makes the build work on any static host (Netlify drop, subpaths, etc.)
  base: "./",
});
