import { Link } from "react-router"
import type { SerializableEmailDetails } from "@ghostmail/database"
import { Mail, MailOpen } from "lucide-react"

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return "Yesterday"
  return `${days}d ago`
}

type Props = {
  email: SerializableEmailDetails
  mailboxId: string
}

export function EmailRow({ email, mailboxId }: Props) {
  const emailId = email.emailId
  return (
    <Link
      id={`email-row-${emailId}`}
      to={`/mailboxes/${mailboxId}/${emailId}`}
      className={`flex items-start gap-3 p-4 rounded-lg border transition-colors hover:bg-base-200 cursor-pointer ${
        email.isRead
          ? "border-base-200 opacity-70"
          : "border-primary/30 bg-primary/5"
      }`}
    >
      <div className="flex items-start gap-3">
        <div>
          {email.isRead ? (
            <MailOpen className="w-5 h-5 text-base-content/40" />
          ) : (
            <Mail className="w-5 h-5 text-accent" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span className={`text-sm ${!email.isRead ? "font-semibold" : ""}`}>
              {email.sender}
            </span>
            <span className="text-xs text-base-content/60 whitespace-nowrap">
              {formatTime(email.date)}
            </span>
          </div>
          <div className={`text-sm ${!email.isRead ? "font-semibold" : ""}`}>
            {email.subject}
          </div>
        </div>
      </div>
    </Link>
  )
}
