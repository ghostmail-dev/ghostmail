import { Link } from "react-router-dom"
import { useGetMailboxQuery } from "../gql/get-messages.operation"
import { useUserContext } from "~/global-contexts/useUserContext"

export function Messages() {
  const [username] = useUserContext()
  const { data, loading, error } = useGetMailboxQuery({
    variables: {
      name: username ?? "",
    },
  })

  if (error) return <p>Error: {error.message}</p>
  if (loading || !data) return <p>Loading...</p>
  const { mailbox } = data

  return (
    mailbox && (
      <div className="rounded-lg border-solid border-2">
        <table className="min-w-full divide-y dark:divide-gray-300 mt-0 mb-0 rounded-md border-solid border-2">
          <tbody className="divide-y divide-gray-200 bg-white">
            {mailbox.messages.map((message) => (
              <tr key={message.emailId} className="even:bg-gray-50">
                <td
                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6 ${
                    message.isRead ? "text-gray-500" : "text-gray-900"
                  }`}
                >
                  <Link to={message.emailId}>
                    TO: {message.sender || "Unknown"}
                  </Link>
                </td>
                <td
                  className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500`}
                >
                  <Link to={message.emailId}>{message.subject}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  )
}
