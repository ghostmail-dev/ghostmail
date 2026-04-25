import {
  EmailsLoader,
  MailboxesLoader,
  EmailsMutator,
} from "@ghostmail/database"
import { requireAuth } from "../../utils/session.server"
import type { Route } from "./+types/EmailDetails"

export async function loader({ request, params }: Route.LoaderArgs) {
  const { userId } = await requireAuth(request)
  const { mailboxId, emailId } = params

  if (!mailboxId || !emailId) throw new Response("Not Found", { status: 404 })

  const mLoader = new MailboxesLoader()
  const mailbox = await mLoader.getMailboxById(mailboxId)
  if (!mailbox || mailbox.ownerId !== userId) {
    throw new Response("Not Found", { status: 404 })
  }

  const eLoader = new EmailsLoader()
  const email = await eLoader.getEmailById(emailId)
  if (!email) throw new Response("Email Not Found", { status: 404 })

  // Mark as read
  const eMutator = new EmailsMutator()
  await eMutator.markAsRead(emailId)

  return {
    email,
    mailbox,
  }
}

export default function EmailDetail({ loaderData }: Route.ComponentProps) {
  const { email, mailbox } = loaderData
  const from =
    typeof email.from === "object" && email.from !== null
      ? email.from.text
      : String(email.from ?? "Unknown")

  const to =
    typeof email.to === "object" &&
    email.to !== null &&
    !Array.isArray(email.to)
      ? email.to.text
      : Array.isArray(email.to)
        ? email.to.map((a) => a.text).join(", ")
        : String(email.to ?? mailbox.username)

  const subject = email.subject ?? "(no subject)"

  const bodyText = email.text ?? ""
  const hasHtml = Boolean(email.html)

  return (
    <div className="min-h-screen bg-base-200">
      <div className="w-full mx-auto p-4 md:p-6 flex flex-col gap-4">
        {/* Subject header */}
        <div>
          <h1 className="text-xl font-bold">{subject}</h1>
        </div>

        {/* Metadata panel */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body py-4 gap-2">
            <div className="grid grid-cols-[80px_1fr] text-sm gap-y-1">
              <span className="text-base-content/50 font-medium">From</span>
              <span>{from}</span>
              <span className="text-base-content/50 font-medium">To</span>
              <span>{to}</span>
              <span className="text-base-content/50 font-medium">Date</span>
              <span>
                {email.date ? new Date(email.date).toLocaleString() : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            {hasHtml ? (
              <div
                id="email-body"
                className="prose max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: email.html as string }}
              />
            ) : (
              <pre
                id="email-body"
                className="text-sm whitespace-pre-wrap font-sans leading-relaxed"
              >
                {bodyText || "(no content)"}
              </pre>
            )}
          </div>
        </div>

        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-sm">
                Attachments ({email.attachments.length})
              </h2>
              <ul className="flex flex-col gap-2">
                {email.attachments.map((att, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm p-2 rounded bg-base-200"
                  >
                    <span>📎</span>
                    <span>
                      {att.fileName || att.filename || `attachment-${i + 1}`}
                    </span>
                    <span className="text-base-content/40 ml-auto">
                      {att.size ? `${Math.round(att.size / 1024)}KB` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
