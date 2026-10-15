import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    host: "127.0.0.1",
    proxy: {
      "/api": process.env.API_PROXY_TARGET || "http://127.0.0.1:8000",
      "/health": process.env.API_PROXY_TARGET || "http://127.0.0.1:8000",
      "/ready": process.env.API_PROXY_TARGET || "http://127.0.0.1:8000",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.tsx"],
    globals: true,
  },
});
