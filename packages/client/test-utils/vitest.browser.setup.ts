import { afterEach, vi } from "vitest"
import { resetDatabase } from "@ghostmail/database"

// Mock the session module globally for all browser tests
vi.mock("../app/utils/session.server", async () => {
  const actual = await vi.importActual("../app/utils/session.server")
  return {
    ...actual,
    requireAuth: vi.fn(),
  }
})

afterEach(async () => {
  resetDatabase()

  // Reset the requireAuth mock after each test
  const sessionModule = await import("../app/utils/session.server")
  vi.mocked(sessionModule.requireAuth).mockReset()
})
