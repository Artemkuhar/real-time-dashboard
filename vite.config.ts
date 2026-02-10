// vite.config.ts

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  test: {
    environment: "happy-dom",
    setupFiles: ["src/shared/test/setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "lcov"],
    },
    css: false,
  },
});
