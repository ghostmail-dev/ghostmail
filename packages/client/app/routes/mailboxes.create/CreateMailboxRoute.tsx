import { Clock, Archive } from "lucide-react"
import { Form, Link, redirect } from "react-router"
import type { ActionFunctionArgs } from "react-router"
import { MailboxesMutator } from "@ghostmail/database"
import { requireAuth } from "../../utils/session.server"
import { cn } from "../../utils/class-names"
import type { Route } from "./+types/CreateMailboxRoute"
import { useMailboxesData } from "../mailboxes/useMailboxesData"

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request)
  return {
    maxPersistentMailboxes: user.maxPersistentMailboxes,
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const { userId } = await requireAuth(request)
  const formData = await request.formData()
  const type = String(formData.get("type") ?? "ephemeral") as
    | "ephemeral"
    | "persistent"

  const mutator = new MailboxesMutator()
  const fn =
    type === "ephemeral"
      ? mutator.addEphemeralMailbox
      : mutator.addPersistentMailbox

  const result = await fn(userId)

  if (!result.ok) return redirect("/mailboxes")
  return redirect(`/mailboxes/${result.value._id}`)
}

export default function CreateMailboxRoute({
  loaderData,
}: Route.ComponentProps) {
  const { maxPersistentMailboxes } = loaderData
  const mailboxes = useMailboxesData()
  const persistentCount = mailboxes.filter(
    (mb) => mb.type === "persistent",
  ).length
  const canCreatePersistent = persistentCount < maxPersistentMailboxes
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Form
        method="post"
        action="/mailboxes/create"
        className="bg-base-100 rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="p-6 border-b border-base-300">
          <h2>Create New Inbox</h2>
          <p className="text-sm text-base-content/60 mt-1">
            Choose the type of inbox you want to create
          </p>
        </div>

        <div className="p-6 space-y-3">
          <InboxButton type="ephemeral" />
          <InboxButton type="persistent" disabled={!canCreatePersistent} />
        </div>

        <div className="p-6 border-t border-base-300 flex justify-end">
          <Link to="/mailboxes" className="btn btn-ghost">
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  )
}

const InboxButton = ({
  type,
  disabled,
}: {
  type: "ephemeral" | "persistent"
  disabled?: boolean
}) => {
  const Icon = () => {
    switch (type) {
      case "ephemeral":
        return <Clock className="w-5 h-5 text-accent" />
      case "persistent":
        return <Archive className="w-5 h-5 text-accent" />
    }
  }

  const title = type === "ephemeral" ? "Ephemeral Inbox" : "Persistent Inbox"
  const description =
    type === "ephemeral"
      ? "Temporary inbox that expires after 1 hour"
      : "Permanent inbox that doesn't expire"

  return (
    <button
      type="submit"
      name="type"
      value={type}
      className={cn(
        "w-full p-4 border-2 border-base-300 rounded-lg",
        "hover:bg-base-200 hover:border-accent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-all",
        "text-left",
        "group",
      )}
      title={
        disabled
          ? "You have reached the maximum number of persistent inboxes"
          : undefined
      }
      disabled={disabled}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg transition-colors bg-accent-200">
          <Icon />
        </div>
        <div className="flex-1">
          <div className="font-semibold mb-1">{title}</div>
          <div className="text-sm text-base-content/60">{description}</div>
        </div>
      </div>
    </button>
  )
}
