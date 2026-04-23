import { defineConfig } from "vitest/config"
import { playwright } from "@vitest/browser-playwright"
import react from "@vitejs/plugin-react"
import { resolve } from "node:path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@ghostmail/database": resolve(__dirname, "../database/src/mock.ts"),
      "lucide-react": resolve(__dirname, "./test-utils/lucide-react.mock.tsx"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router", "vitest-browser-react"],
  },
  envDir: resolve(__dirname, "../../"),
  define: {
    "process.env": {
      MAIL_DOMAIN: "testmail.dev",
      VITE_SMTP_HOST: "smtp.ghostmail.dev",
      VITE_SMTP_PORT: "587",
    },
    "import.meta.env.VITE_SMTP_HOST": JSON.stringify("smtp.ghostmail.dev"),
    "import.meta.env.VITE_SMTP_PORT": JSON.stringify("587"),
  },
  test: {
    setupFiles: ["./test-utils/vitest.browser.setup.ts"],
    include: ["app/**/*.test.{ts,tsx}"],
    browser: {
      enabled: true,
      provider: playwright(),
      // https://vitest.dev/config/browser/playwright
      instances: [
        { browser: "chromium" },
        {
          browser: "firefox",
          viewport: { width: 1920, height: 1080 },
        },
      ],
    },
  },
})
