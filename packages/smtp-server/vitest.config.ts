import { defineConfig } from "vitest/config"

export default defineConfig({
  envDir: "../",
  test: {
    environment: "mongodb",
    include: ["src/tests/**/*.test.ts"],
    environmentOptions: {
      mongoUrlEnvName: "MONGODB_URI",
    },
  },
  resolve: {
    alias: {
      "@ghostmail/database": "../database/src/mock.ts",
    },
  },
})
