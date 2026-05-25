import {
  data,
  Form,
  Link,
  redirect,
  useActionData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router"
import { UsersLoader, UsersMutator } from "@ghostmail/database"
import {
  commitSession,
  getSession,
  requireAuth,
} from "../../utils/session.server"
import { AuthenticationCard } from "../../components/AuthenticationWrapper"
import { InvitesLoader } from "@ghostmail/database"
import { canonicalHref, ogImageUrl } from "../../utils/seo"

const SIGNUP_TITLE = "Create account · GhostMail"
const SIGNUP_DESCRIPTION =
  "Create a GhostMail account with your invite code and start testing email with catch-all SMTP inboxes."

export const meta: MetaFunction = ({ location }) => {
  const canonical = canonicalHref(location.pathname)
  const ogImage = ogImageUrl()

  return [
    { title: SIGNUP_TITLE },
    { name: "description", content: SIGNUP_DESCRIPTION },
    { property: "og:title", content: SIGNUP_TITLE },
    { property: "og:description", content: SIGNUP_DESCRIPTION },
    ...(canonical ? [{ property: "og:url", content: canonical }] : []),
    ...(ogImage ? [{ property: "og:image", content: ogImage }] : []),
    { name: "twitter:title", content: SIGNUP_TITLE },
    { name: "twitter:description", content: SIGNUP_DESCRIPTION },
    ...(canonical
      ? [{ tagName: "link", rel: "canonical", href: canonical }]
      : []),
  ]
}

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
  const invite = String(formData.get("invite") ?? "").trim()

  if (!username || !password) {
    return data(
      { error: "Username and password are required" },
      { status: 400 },
    )
  }

  // if (!invite) {
  //   return data({ error: "Invite code is required" }, { status: 400 })
  // }

  if (password !== confirm) {
    return data({ error: "Passwords do not match" }, { status: 400 })
  }
  if (password.length < 8) {
    return data(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    )
  }

  const inviteLoader = new InvitesLoader()
  let hasInvite = invite !== ""
  if (hasInvite) {
    const validInvite = await inviteLoader.validateInvite(invite)
    if (!validInvite.ok)
      return data({ error: "Service unavailable" }, { status: 503 })
    if (!validInvite.value) {
      return data({ error: "Invalid invite code" }, { status: 400 })
    }
    hasInvite = validInvite.value
  }

  const loader = new UsersLoader()
  const existingResult = await loader.getUserByName(username)
  if (!existingResult.ok)
    return data({ error: "Service unavailable" }, { status: 503 })
  if (existingResult.value) {
    return data({ error: "Username already taken" }, { status: 409 })
  }

  const mutator = new UsersMutator()
  const userResult = await mutator.createUser(username, password, invite)
  if (!userResult.ok)
    return data({ error: "Service unavailable" }, { status: 503 })
  const user = userResult.value

  const session = await getSession(request.headers.get("Cookie"))
  session.set("userId", user._id)
  session.set("username", user.username)
  session.set("roles", user.roles)
  session.set("maxPersistentMailboxes", user.maxPersistentMailboxes)

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
        <label className="fieldset w-full">
          <span className="fieldset-legend">
            Username <span className="text-error font-medium">*</span>
          </span>
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

        <label className="fieldset w-full">
          <span className="fieldset-legend">
            Password <span className="text-error font-medium">*</span>
          </span>
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

        <label className="fieldset w-full">
          <span className="fieldset-legend">
            Confirm Password <span className="text-error font-medium">*</span>
          </span>
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

        <label className="fieldset w-full">
          <span className="fieldset-legend flex justify-between w-full items-center">
            <span>Invite Code</span>
            <span className="fieldset-label text-base-content/60 font-normal">
              (Optional)
            </span>
          </span>
          <input
            id="invite"
            name="invite"
            type="text"
            autoComplete="off"
            placeholder="Enter your invite code"
            className="input input-bordered w-full"
          />
        </label>

        <button type="submit" className="btn btn-primary w-full mt-2">
          Create Account
        </button>
      </Form>

      <div className="divider text-xs">Have an account?</div>
      <Link to="/login" className="btn btn-outline btn-sm w-full">
        Sign in
      </Link>
    </AuthenticationCard>
  )
}
