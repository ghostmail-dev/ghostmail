import { createCookieSessionStorage, redirect } from "react-router"

export type AuthData = {
  userId: string
  username: string
}

const sessionSecret =
  typeof process !== "undefined"
    ? (process.env["SESSION_SECRET"] ?? "ghostmail-dev-secret")
    : "ghostmail-dev-secret"

const isProduction =
  typeof process !== "undefined"
    ? process.env["NODE_ENV"] === "production"
    : false

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<AuthData>({
    cookie: {
      name: "__ghostmail_session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
      secrets: [sessionSecret],
      secure: isProduction,
    },
  })

export { commitSession, destroySession, getSession }

export async function requireAuth(
  request: Request,
): Promise<{ userId: string; username: string }> {
  const session = await getSession(request.headers.get("Cookie"))
  const userId = session.get("userId")
  const username = session.get("username")
  if (!userId || !username) {
    throw redirect("/login")
  }
  return { userId, username }
}
