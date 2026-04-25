import { useState } from "react"
import { Link, useLocation } from "react-router"
import { Check, Copy } from "lucide-react"

export default function MailboxInfoRoute() {
  const location = useLocation()
  const { username, password } = location.state ?? {
    username: "",
    password: "",
  }
  const [copied, setCopied] = useState(false)

  const credentials = JSON.stringify(
    {
      host: import.meta.env.VITE_SMTP_HOST,
      port: import.meta.env.VITE_SMTP_PORT,
      username,
      password,
    },
    null,
    2,
  )

  const handleCopy = () => {
    navigator.clipboard.writeText(credentials)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="p-4 space-y-4 bg-base-100 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-lg font-semibold">Mailbox Info</h2>
        <div>Use the credentials to configure your email client</div>
        <div className="relative">
          <pre
            data-testid="mailbox-info"
            className="bg-base-300 text-accent p-4 pr-10 rounded-lg overflow-x-auto text-xs md:text-sm"
          >
            {credentials}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 btn btn-ghost btn-xs btn-square"
            title="Copy credentials"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <div className="flex justify-center mt-4">
          <Link to="/mailboxes" className="btn btn-accent text-white">
            Close
          </Link>
        </div>
      </div>
    </div>
  )
}
