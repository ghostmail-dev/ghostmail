import { useRevalidator } from "react-router"
import { useEffect } from "react"
import { EmailRow } from "./_components/EmailRow"
import { useMailbox } from "./useMailbox"

export default function MailboxInbox() {
  const mailbox = useMailbox()
  const { revalidate } = useRevalidator()

  useEffect(() => {
    const id = setInterval(revalidate, 5000)
    return () => clearInterval(id)
  }, [revalidate])

  const mailboxIdStr = mailbox._id

  return mailbox.emails.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-24 text-base-content/40 gap-3">
      <span className="text-5xl">📫</span>
      <p className="text-lg font-medium">Waiting for emails…</p>
      <p className="text-sm">Your inbox is live and securely listening.</p>
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      {[...mailbox.emails]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((email) => (
          <EmailRow
            key={email.emailId}
            email={email}
            mailboxId={mailboxIdStr}
          />
        ))}
    </div>
  )
}
