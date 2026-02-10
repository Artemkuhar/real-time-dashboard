import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["src/shared/test/setup.ts"],
    globals: true,
    coverage: {
      reporter: ["text", "text-summary", "lcov"],
    },
  },
});
