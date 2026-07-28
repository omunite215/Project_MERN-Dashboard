import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    testTimeout: 30000, // mongodb-memory-server first download/boot
    hookTimeout: 30000,
    pool: "forks",
  },
});
