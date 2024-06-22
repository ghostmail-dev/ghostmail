import { Link } from "react-router-dom"
import { useGetMailboxQuery } from "../gql/get-messages.operation"
import { useUserContext } from "~/global-contexts/useUserContext"
import { useReadMailMutation } from "../gql/read-mail-mutation.operation"

export function Messages() {
  const [username] = useUserContext()
  const { data, loading, error } = useGetMailboxQuery({
    variables: {
      name: username ?? "",
    },
  })

  const [readEmail] = useReadMailMutation({
    refetchQueries: ["GetMailbox"],
  })

  if (error) return <p>Error: {error.message}</p>
  if (loading || !data) return <p>Loading...</p>
  const { mailbox } = data

  return mailbox ? (
    <div className="overflow-x-auto">
      <table className="table mt-0 mb-0">
        <tbody>
          {mailbox?.messages.map((message) => {
            return (
              <tr
                key={message.emailId}
                onClick={() =>
                  readEmail({
                    variables: {
                      mailId: message.emailId,
                    },
                  })
                }
              >
                <td
                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6`}
                >
                  <Link
                    to={message.emailId}
                    className={`${
                      message.isRead ? "font-normal" : "font-extrabold"
                    }`}
                  >
                    TO: {message.sender || "Unknown"}
                  </Link>
                </td>
                <td
                  className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500`}
                >
                  <Link to={message.emailId}>{message.subject}</Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  ) : null
}
