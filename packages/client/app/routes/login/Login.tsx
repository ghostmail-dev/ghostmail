import { data, Form, Link, redirect, type MetaFunction } from "react-router"
import { compareSync } from "bcryptjs"
import { UsersLoader } from "@ghostmail/database"
import {
  commitSession,
  getSession,
  requireAuth,
} from "../../utils/session.server"
import type { Route } from "./+types/Login"
import { AuthenticationCard } from "../../components/AuthenticationWrapper"
import { canonicalHref, ogImageUrl } from "../../utils/seo"

const LOGIN_TITLE = "Sign in · GhostMail"
const LOGIN_DESCRIPTION =
  "Sign in to GhostMail to manage catch-all SMTP test inboxes and inspect outgoing mail."

export const meta: MetaFunction = ({ location }) => {
  const canonical = canonicalHref(location.pathname)
  const ogImage = ogImageUrl()

  return [
    { title: LOGIN_TITLE },
    { name: "description", content: LOGIN_DESCRIPTION },
    { property: "og:title", content: LOGIN_TITLE },
    { property: "og:description", content: LOGIN_DESCRIPTION },
    ...(canonical ? [{ property: "og:url", content: canonical }] : []),
    ...(ogImage ? [{ property: "og:image", content: ogImage }] : []),
    { name: "twitter:title", content: LOGIN_TITLE },
    { name: "twitter:description", content: LOGIN_DESCRIPTION },
    ...(canonical
      ? [{ tagName: "link", rel: "canonical", href: canonical }]
      : []),
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    await requireAuth(request)
    return redirect("/mailboxes")
  } catch {
    return {}
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!username || !password) {
    return data(
      { error: "Username and password are required" },
      { status: 400 },
    )
  }

  const loader = new UsersLoader()
  const userResult = await loader.getUserByName(username)
  if (!userResult.ok)
    return data({ error: "Service unavailable" }, { status: 503 })
  const user = userResult.value

  if (!user || !compareSync(password, user.password)) {
    return data({ error: "Invalid username or password" }, { status: 401 })
  }

  const session = await getSession(request.headers.get("Cookie"))
  session.set("userId", user._id)
  session.set("username", user.username)
  session.set("roles", user.roles)
  session.set("maxPersistentMailboxes", user.maxPersistentMailboxes)

  return redirect("/mailboxes", {
    headers: { "Set-Cookie": await commitSession(session) },
  })
}

export default function Login({ actionData }: Route.ComponentProps) {
  return (
    <AuthenticationCard>
      <p className="text-center text-base-content/80 text-sm">
        Sign in to manage your inboxes
      </p>

      {actionData?.error && (
        <div className="alert alert-error flex justify-center">
          {actionData.error}
        </div>
      )}
      <Form method="post" className="flex flex-col gap-3">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Username</span>
          </div>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            placeholder="your-username"
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Password</span>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="input input-bordered w-full"
          />
        </label>

        <button type="submit" className="btn btn-primary w-full mt-2">
          Sign In
        </button>
      </Form>

      <div className="divider text-xs">New here?</div>
      <Link to="/signup" className="btn btn-outline btn-sm w-full">
        Create an account
      </Link>
    </AuthenticationCard>
  )
}
