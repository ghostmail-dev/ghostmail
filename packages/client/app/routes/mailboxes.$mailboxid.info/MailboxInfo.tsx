import { Link, useLocation } from "react-router"

export default function MailboxInfoRoute() {
  const location = useLocation()
  const { username, password } = location.state ?? {
    username: "",
    password: "",
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="p-4 space-y-4 bg-base-100 rounded-lg shadow-xl mx-4">
        <h2 className="text-lg font-semibold">Mailbox Info</h2>
        <div>Use the credentials to configure your email client</div>
        <code>
          <pre
            data-testid="mailbox-info"
            className="bg-base-10 text-accent p-4 rounded-lg"
          >
            {JSON.stringify(
              {
                host: import.meta.env.VITE_SMTP_HOST,
                port: import.meta.env.VITE_SMTP_PORT,
                username,
                password,
              },
              null,
              2,
            )}
          </pre>
        </code>
        <div className="flex justify-center mt-4">
          <Link to="/mailboxes" className="btn btn-accent text-white">
            Close
          </Link>
        </div>
      </div>
    </div>
  )
}
