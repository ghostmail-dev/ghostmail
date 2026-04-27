import { render } from "vitest-browser-react"
import { createRoutesStub } from "react-router"
import { vi } from "vitest"
import type { UserDocument } from "@ghostmail/database"

/**
 * Renders the real app at a given path using the browser router.
 * @param routes - The routes to render
 * @param initialPath - The initial path to render at
 * @param authenticatedUser - If provided, mocks requireAuth to return this user.
 *                            If null/undefined, requireAuth will reject (unauthenticated).
 */
export async function renderRoute(
  routes: Parameters<typeof createRoutesStub>[0],
  initialPath = "/",
  authenticatedUser?: UserDocument | null,
) {
  // Configure requireAuth mock based on auth parameter
  const sessionModule = await import("../app/utils/session.server")

  if (authenticatedUser) {
    vi.mocked(sessionModule.requireAuth).mockResolvedValue({
      userId: authenticatedUser._id,
      username: authenticatedUser.username,
      roles: authenticatedUser.roles,
      maxPersistentMailboxes: authenticatedUser.maxPersistentMailboxes,
    })
  } else {
    // Default: reject with redirect-like error (unauthenticated)
    vi.mocked(sessionModule.requireAuth).mockRejectedValue(
      new Response(null, { status: 302, headers: { Location: "/login" } }),
    )
  }

  const Stub = createRoutesStub(
    routes.map((route) => ({ ...route, hydrateFallbackElement: <></> })),
  )

  return await render(<Stub initialEntries={[initialPath]} />)
}
