import { useState } from "react"
import {
  CreateEmailMutation,
  useCreateEmailMutation,
} from "../gql/create-email-mutation.operation"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid"
import { Link } from "react-router-dom"

type EmailAccount = Extract<
  CreateEmailMutation["createMailbox"],
  { __typename: "NewMailbox" }
>

export function Home() {
  const [email, setEmail] = useState<null | EmailAccount>(null)

  return (
    <div className="container mx-auto max-w-lg sm:px-6 lg:px-8 shadow-md rounded-lg border-solid border-2 border-grey-500 p-5">
      {email ? (
        <AccountCreated email={email} />
      ) : (
        <NewMailForm setEmail={setEmail} />
      )}
    </div>
  )
}

const NewMailForm = (props: {
  setEmail: React.Dispatch<React.SetStateAction<EmailAccount | null>>
}) => {
  const { setEmail } = props
  const [createEmail, { loading }] = useCreateEmailMutation({
    onCompleted: (data) => {
      if (data.createMailbox?.__typename === "NewMailbox") {
        setEmail(data.createMailbox)
      } else if (data.createMailbox?.__typename === "InvalidApiKeyError") {
        setError(data.createMailbox.message)
      }
    },
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    const apiKey = formData.get("api-key") as string
    createEmail({ variables: { apiKey } })
  }
  return (
    <div className="w-100">
      <h1 className="prose prose-2xl dark:prose-invert">Ghostmail</h1>
      <h2 className="prose prose-lg">
        Create a new Ghostmail account by providing an API key.
      </h2>
      <form className="py-4" onSubmit={handleSubmit}>
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
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

        <div>
          <button
            disabled={loading}
            type="submit"
            className={`btn w-full mt-4`}
          >
            Create Mailbox
          </button>
        </div>
      </form>
    </div>
  )
}

const AccountCreated = (props: { email: EmailAccount }) => {
  const { email } = props
  return (
    <div>
      <h1 className="prose prose-2xl">Account Created</h1>
      <h2 className="prose">
        Here you can find all the details needed to access your new Ghostmail
        test account. Remember that if sending messages through SMTP then no
        message is actually delivered, all messages are caught and you can see
        these in the Messages page or by using your favorite IMAP/POP3 client.
      </h2>
      <div className="overflow-x-auto">
        <table className="table">
          <tbody>
            {/* row 1 */}
            <tr>
              <th>Name</th>
              <td>{email.name}</td>
            </tr>
            {/* row 2 */}
            <tr>
              <th>Username</th>
              <td>{email.username}</td>
            </tr>
            {/* row 3 */}
            <tr>
              <th>Password</th>
              <td>{email.password}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Link to="/login" className="text-blue-500">
        Open Mailbox
      </Link>
    </div>
  )
}
