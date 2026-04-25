import { Form, Link, redirect } from "react-router"
import { MailboxesLoader, MailboxesMutator } from "@ghostmail/database"
import { requireAuth } from "../../utils/session.server"
import type { Route } from "./+types/DeleteMailbox"

export async function action({ request, params }: Route.ActionArgs) {
  const { userId } = await requireAuth(request)
  const { mailboxId } = params

  if (!mailboxId) throw new Response("Not Found", { status: 404 })

  const mailboxLoader = new MailboxesLoader()
  const mailbox = await mailboxLoader.getMailboxById(mailboxId)
  if (!mailbox || mailbox.ownerId !== userId) {
    throw new Response("Not Found", { status: 404 })
  }

  const mailboxMutator = new MailboxesMutator()
  await mailboxMutator.deleteMailbox(mailboxId)

  return redirect("/mailboxes")
}

export default function DeleteMailboxRoute({ params }: Route.ComponentProps) {
  const { mailboxId } = params
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Form
        method="post"
        action={`/mailboxes/${mailboxId}/delete`}
        className="bg-base-100 rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="p-6 border-b border-base-300">
          <h2 className="text-lg text-center font-semibold">
            Are you sure you want to delete this inbox?
          </h2>
        </div>

        <div className="p-6 border-t border-base-300 flex justify-center gap-2">
          <button type="submit" className="btn btn-error">
            Delete
          </button>
          <Link to="/mailboxes" className="btn btn-outline">
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  )
}
