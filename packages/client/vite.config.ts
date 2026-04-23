import tailwindcss from "@tailwindcss/vite"
import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"
import path from "node:path"

const isDev = process.env.NODE_ENV !== "production"

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  envDir: "../../",
  resolve: {
    alias: {
      ...(isDev && {
        "@ghostmail/database": path.resolve(
          __dirname,
          "../database/src/index.ts",
        ),
      }),
    },
  },
  server: {
    fs: {
      allow: [".."], // allow access to sibling packages
    },
  },

  optimizeDeps: {
    exclude: ["@ghostmail/database"],
  },
})
