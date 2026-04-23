import { redirect } from "react-router"
import { destroySession, getSession } from "../../utils/session.server"
import type { Route } from "./+types/Logout"

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"))
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  })
}

// Redirect GET requests straight to login (no UI needed)
export async function loader() {
  return redirect("/login")
}
