import { Outlet, redirect } from "react-router"
import { requireAuth } from "../../utils/session.server"
import { MailboxesLoader, MailboxesMutator } from "@ghostmail/database"
import type { Route } from "./+types/Route"

export async function loader({ request, params }: Route.LoaderArgs) {
  const { userId } = await requireAuth(request)
  const { mailboxId } = params

  if (!mailboxId) throw new Response("Not Found", { status: 404 })

  const mailboxLoader = new MailboxesLoader()
  const mailbox = await mailboxLoader.getMailboxById(mailboxId)

  if (!mailbox || mailbox.ownerId !== userId) {
    throw new Response("Not Found", { status: 404 })
  }

  // Check expiry for ephemeral mailboxes
  const isExpired =
    mailbox.type === "ephemeral" && mailbox.expiresAt < new Date().toJSON()

  if (isExpired) {
    const mutator = new MailboxesMutator()
    await mutator.deleteMailbox(mailboxId)
    return redirect("/mailboxes")
  }

  return mailbox
}

export default function Route() {
  return <Outlet />
}
