import { MailboxLoader, readMail } from "@ghostmail-packages/database"
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { Link, useLoaderData, useSubmit } from "@remix-run/react"
import { authenticator } from "~/services/auth.server"

type LoaderData = {
  _id: string
  name: string
  username: string
  messages: {
    emailId: string
    sender: string
    subject: string
    date: string
    isRead: boolean
  }[]
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  const mailboxLoader = new MailboxLoader()
  const mailbox = await mailboxLoader.getMailboxByName(user.username)
  if (!mailbox) {
    return redirect("/login")
  }

  return json<LoaderData>({
    _id: mailbox._id.toHexString(),
    name: `${mailbox.firstName} ${mailbox.lastName}`,
    username: mailbox.username,
    messages: mailbox.emails.map((email) => ({
      emailId: email.emailId.toHexString(),
      sender: email.sender ?? "Unknown",
      subject: email.subject ?? "No Subject",
      date: email.date.toISOString(),
      isRead: email.isRead,
    })),
  })
}

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  const { emailId } = await request.json()
  await readMail(emailId ?? "", user.username)
  return null
}

export default function Messages() {
  const data = useLoaderData<LoaderData>()

  // const [readEmail] = useReadMailMutation({
  //   refetchQueries: ["GetMailbox"],
  // })

  // if (error) return <p>Error: {error.message}</p>
  // if (loading || !data) return <p>Loading...</p>
  // const { mailbox } = data
  const submit = useSubmit()
  const readEmail = async (emailId: string) => {
    submit({ emailId }, { method: "post", encType: "application/json" })
  }
  return (
    <div className="overflow-x-auto">
      <table className="table mt-0 mb-0">
        <tbody>
          {data?.messages.map((message) => {
            return (
              <tr key={message.emailId}>
                <td
                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6`}
                >
                  <Link
                    to={message.emailId}
                    className={`${
                      message.isRead ? "font-normal" : "font-extrabold"
                    }`}
                    onClick={() => readEmail(message.emailId)}
                  >
                    TO: {message.sender || "Unknown"}
                  </Link>
                </td>
                <td
                  className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500`}
                >
                  <Link
                    to={message.emailId}
                    onClick={() => readEmail(message.emailId)}
                  >
                    {message.subject}
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
