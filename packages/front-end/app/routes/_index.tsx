import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid"
import { Link } from "react-router-dom"
import { ActionFunction, json, TypedResponse } from "@remix-run/node"
import { createMailbox } from "@ghostmail-packages/database"
import { Form, useActionData } from "@remix-run/react"
import { authenticator } from "~/services/auth.server"
import { sessionStorage } from "~/services/session.server"

type EmailAccount = {
  __typename: "NewMailbox"
  _id: string
  name: string
  username: string
  password: string
}

type NewMailboxError = {
  __typename: "InvalidApiKeyError"
  error: string
}

type ActionResponse = EmailAccount | NewMailboxError

export const action: ActionFunction = async ({
  request,
}): Promise<TypedResponse<ActionResponse>> => {
  const req = request.clone()
  const formData = await request.formData()
  const apiKey = formData.get("api-key") as string
  if (!apiKey) {
    return json(
      {
        __typename: "InvalidApiKeyError",
        error: "API Key is required",
      },
      {
        status: 400,
      }
    )
  }

  if (apiKey !== process.env.API_KEY) {
    return json(
      {
        __typename: "InvalidApiKeyError",
        error: "Invalid API Key",
      },
      {
        status: 401,
      }
    )
  }

  const mailbox = await createMailbox()

  const _request = new Request(req.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `email=${mailbox.username}&password=${mailbox.password}`,
  })

  const user = await authenticator.authenticate("user-pass", _request)
  const session = await sessionStorage.getSession(request.headers.get("Cookie"))
  session.set("user", user)
  const userCookie = await sessionStorage.commitSession(session)
  return json(
    {
      __typename: "NewMailbox",
      _id: mailbox._id.toHexString(),
      name: mailbox.name,
      username: mailbox.username,
      password: mailbox.password,
    },
    {
      headers: {
        "Set-Cookie": userCookie,
      },
    }
  )
}

export default function Home() {
  const actionData = useActionData<ActionResponse>()

  return (
    <div className="container mx-auto max-w-lg sm:px-6 lg:px-8 shadow-md rounded-lg border-solid border-2 border-grey-500 p-5">
      {actionData?.__typename === "NewMailbox" ? (
        <AccountCreated email={actionData} />
      ) : (
        <NewMailForm
          error={
            actionData?.__typename === "InvalidApiKeyError"
              ? actionData.error
              : undefined
          }
        />
      )}
    </div>
  )
}

const NewMailForm = (props: { error: string | undefined }) => {
  const [showApiKey, setShowApiKey] = useState(false)

  // TODO: replace with real loading state
  const loading = false
  return (
    <div className="prose w-full">
      <h1 className="prose text-6xl dark:prose-invert mb-0">Ghostmail</h1>
      <h2 className="prose prose-lg">
        Create a new Ghostmail account by providing an API key.
      </h2>
      <Form className="py-4" action="/?index" method="post">
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 prose prose-slate dark:prose-invert"
        >
          API Key
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <input
            type={showApiKey ? "text" : "password"}
            name="api-key"
            id="api-key"
            className="grow"
          />
          {showApiKey ? (
            <EyeIcon
              className="cursor-pointer h-5 w-5 text-gray-400"
              aria-hidden="true"
              onClick={() => setShowApiKey(!showApiKey)}
            />
          ) : (
            <EyeSlashIcon
              className="cursor-pointer h-5 w-5 text-gray-400 "
              aria-hidden="true"
              onClick={() => setShowApiKey(!showApiKey)}
            />
          )}
        </label>
        {props.error && (
          <div className="mt-2 text-sm text-red-600">{props.error}</div>
        )}

        <div>
          <button
            disabled={loading}
            type="submit"
            className={`btn w-full mt-4`}
          >
            Create Mailbox
          </button>
        </div>
      </Form>
    </div>
  )
}

const AccountCreated = (props: { email: EmailAccount }) => {
  const { email } = props
  return (
    <div className="prose">
      <h1 className="prose-lg">Account Created</h1>
      <h2 className="prose">
        Here you can find all the details needed to access your new Ghostmail
        test account. Remember that if sending messages through SMTP then no
        message is actually delivered, all messages are caught and you can see
        these in the Messages page or by using your favorite IMAP/POP3 client.
      </h2>
      <div className="overflow-x-auto">
        <table className="table">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{email.name}</td>
            </tr>
            <tr>
              <th>Username</th>
              <td>{email.username}</td>
            </tr>
            <tr>
              <th>Password</th>
              <td>{email.password}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Link to="/mailbox" className="text-blue-500">
        Open Mailbox
      </Link>
    </div>
  )
}
