import { Link, Outlet } from "react-router"
import { ArrowBigLeft, ArrowLeft, Check, Copy, Mail } from "lucide-react"
import { useMailbox } from "./useMailbox"
import type { Route } from "./+types/Layout"
import { useCopy } from "../../utils/useCopy"

export default function Layout({ matches }: Route.ComponentProps) {
  const isViewingEmail = matches.some(
    (match) =>
      match?.id === "routes/mailboxes.$mailboxid.$emailid/EmailDetails",
  )
  return (
    <div className="min-h-screen p-4 w-full bg-base-200">
      {isViewingEmail ? <EmailDetailsHeader /> : <InboxHeader />}
      <Outlet />
    </div>
  )
}

const InboxHeader = () => {
  const mailbox = useMailbox()
  const { copied, handleCopy } = useCopy()
  return (
    <>
      <div className="flex items-center justify-start gap-2">
        <Link
          to="/mailboxes"
          className="md:hidden btn btn-ghost btn-sm btn-square -ml-1 mr-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Mail />
        <h1 className="font-bold">{mailbox.username}</h1>
        <button
          onClick={() => handleCopy(mailbox.username)}
          className="btn btn-ghost btn-sm btn-square touch-manipulation"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-success" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
        <span className="text-sm text-base-content/50 ml-auto">
          {mailbox.emails.length} message
          {mailbox.emails.length !== 1 ? "s" : ""}
        </span>
      </div>
    </>
  )
}

const EmailDetailsHeader = () => {
  const mailbox = useMailbox()

  return (
    <div className="flex items-center justify-between mb-4">
      <Link to={`/mailboxes/${mailbox._id}`}>
        <ArrowBigLeft />
      </Link>
    </div>
  )
}
