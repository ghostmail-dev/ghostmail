import type { Config } from "jest"

const config: Config = {
  testEnvironment: "node",
  globalSetup: "<rootDir>/__tests__/setup.ts",
  testMatch: ["**/*.test.ts"],
}

export default config
