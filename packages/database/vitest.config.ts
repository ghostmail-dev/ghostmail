import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "mongodb",
    include: ["src/tests/**/*.test.ts"],
    environmentOptions: {
      mongoUrlEnvName: "MONGODB_URI",
    },
  },
})
