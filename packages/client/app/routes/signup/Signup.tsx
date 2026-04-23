import { data, Form, redirect, useActionData } from "react-router"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router"
import { UsersLoader, UsersMutator } from "@ghostmail/database"
import {
  commitSession,
  getSession,
  requireAuth,
} from "../../utils/session.server"
import { AuthenticationCard } from "../../components/AuthenticationWrapper"

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    await requireAuth(request)
    return redirect("/mailboxes")
  } catch {
    return {}
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const confirm = String(formData.get("confirm") ?? "")

  if (!username || !password) {
    return data(
      { error: "Username and password are required" },
      { status: 400 },
    )
  }
  if (password !== confirm) {
    return data({ error: "Passwords do not match" }, { status: 400 })
  }
  if (password.length < 8) {
    return data(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    )
  }

  const loader = new UsersLoader()
  const existing = await loader.getUserByName(username)
  if (existing) {
    return data({ error: "Username already taken" }, { status: 409 })
  }

  const mutator = new UsersMutator()
  const user = await mutator.createUser(username, password)

  const session = await getSession(request.headers.get("Cookie"))
  session.set("userId", user._id)
  session.set("username", user.username)

  return redirect("/mailboxes", {
    headers: { "Set-Cookie": await commitSession(session) },
  })
}

export default function Signup() {
  const actionData = useActionData<typeof action>()
  return (
    <AuthenticationCard>
      <p className="text-center text-base-content/80 text-sm">
        Create a free account to get started
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
            placeholder="choose-a-username"
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
            autoComplete="new-password"
            required
            placeholder="min 8 characters"
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Confirm Password</span>
          </div>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            placeholder="repeat your password"
            className="input input-bordered w-full"
          />
        </label>

        <button type="submit" className="btn btn-primary w-full mt-2">
          Create Account
        </button>
      </Form>

      <div className="divider text-xs">Have an account?</div>
      <a href="/login" className="btn btn-outline btn-sm w-full">
        Sign in
      </a>
    </AuthenticationCard>
  )
}
