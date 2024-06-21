import { Link } from "react-router-dom"
import { useGetMailboxQuery } from "../gql/get-messages.operation"

export function Messages() {
  const { data, loading, error } = useGetMailboxQuery({
    variables: {
      name: "addison.mayert@ghostmail.dev",
    },
  })

  if (error) return <p>Error: {error.message}</p>
  if (loading || !data) return <p>Loading...</p>
  const { mailbox } = data

  return (
    mailbox && (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  {/* <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead> */}
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {mailbox.messages.map((message) => (
                      <tr key={message.emailId}>
                        <td
                          className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6 ${
                            message.isRead ? "text-gray-500" : "text-gray-900"
                          }`}
                        >
                          <Link to={message.emailId}>{message.sender}</Link>
                        </td>
                        <td
                          className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500`}
                        >
                          {message.subject}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}
