import type { SerializableMailbox } from "@ghostmail/database"
import { Trash2, Clock, Info } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router"

function MailboxItem({ mailbox }: { mailbox: SerializableMailbox }) {
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  const location = useLocation()
  const isSelected = location.pathname === `/mailboxes/${mailbox._id}`

  useEffect(() => {
    if (
      mailbox.type === "ephemeral" &&
      mailbox.expiresAt.localeCompare(new Date().toJSON())
    ) {
      const updateTimer = () => {
        const now = new Date()
        const diff = new Date(mailbox.expiresAt).getTime() - now.getTime()

        if (diff <= 0) {
          setTimeRemaining("Expired")
          return
        }

        const minutes = Math.floor(diff / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)

        if (minutes > 0) {
          setTimeRemaining(`${minutes}m ${seconds}s`)
        } else {
          setTimeRemaining(`${seconds}s`)
        }
      }

      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    }
  }, [mailbox])

  const unreadCount = mailbox.emails.filter((email) => !email.isRead).length

  return (
    <div
      className={`py-3 hover:bg-base-100 transition-colors group ${
        isSelected ? "bg-base-100 border-l-2 border-accent" : ""
      }`}
    >
      <div className="p-1 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <Link
            to={`/mailboxes/${mailbox._id}/info`}
            state={{
              username: mailbox.username,
              password: mailbox.password,
            }}
            className="shrink-0 mt-0.5"
            aria-label={`Inbox info for ${mailbox.username}`}
          >
            <Info className="w-3 h-3" />
          </Link>

          <Link
            to={`/mailboxes/${mailbox._id}`}
            aria-label={`Inbox for ${mailbox.username}`}
            className="flex-1 min-w-0"
          >
            <div className="text-sm truncate">{mailbox.username}</div>
            {mailbox.type === "ephemeral" && mailbox.expiresAt && (
              <div className="flex text-accent items-center gap-1 mt-1 text-xs">
                <Clock className="w-3 h-3" />
                <span data-testid="time-remaining">{timeRemaining}</span>
              </div>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <span
              data-testid={`${mailbox.type}-${mailbox._id}-unread-count`}
              className="badge badge-sm bg-accent text-white"
            >
              {unreadCount}
            </span>
          )}

          <Link
            className="z-10 btn btn-ghost btn-xs btn-square opacity-0 group-hover:opacity-100 transition-opacity"
            to={`/mailboxes/${mailbox._id}/delete`}
            aria-label={`Delete ${mailbox.username}`}
          >
            <Trash2 className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function MailboxList({
  mailboxes,
}: {
  mailboxes: SerializableMailbox[]
}) {
  const ephemeralMailboxes = mailboxes.filter(
    (inbox) => inbox.type === "ephemeral",
  )
  const persistentMailboxes = mailboxes.filter(
    (inbox) => inbox.type === "persistent",
  )

  return (
    <div className="space-y-4">
      {ephemeralMailboxes.length > 0 && (
        <div>
          <h3 className="px-1 py-2 text-xs uppercase tracking-wide text-base-content/60">
            Ephemeral
          </h3>
          <div>
            {ephemeralMailboxes.map((mailbox) => (
              <MailboxItem key={mailbox._id} mailbox={mailbox} />
            ))}
          </div>
        </div>
      )}

      {persistentMailboxes.length > 0 && (
        <div>
          <h3 className="px-4 py-2 text-xs uppercase tracking-wide text-base-content/60">
            Persistent
          </h3>
          <div>
            {persistentMailboxes.map((mailbox) => (
              <MailboxItem key={mailbox._id} mailbox={mailbox} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
