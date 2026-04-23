import { Link, Outlet } from "react-router"
import MailboxList from "./_components/Mailboxes"
import { Plus } from "lucide-react"
import { requireAuth } from "../../utils/session.server"
import { MailboxesLoader } from "@ghostmail/database"
import type { Route } from "./+types/Mailboxes"

export async function loader({ request }: Route.LoaderArgs) {
  const { userId } = await requireAuth(request)
  const mLoader = new MailboxesLoader()
  const mailboxes = await mLoader.getMailboxesByOwnerId(userId)
  return mailboxes.filter((mb) =>
    mb.type === "ephemeral" ? mb.expiresAt > new Date().toJSON() : true,
  )
}

export default function Mailboxes({ loaderData }: Route.ComponentProps) {
  const mailboxes = loaderData

  return (
    <div className="flex h-screen bg-base-100">
      <aside className="w-80 border-r border-base-300 flex flex-col">
        <div className="p-4">
          <Link to="/mailboxes/create" className="btn btn-primary w-full gap-2">
            <Plus className="w-4 h-4" />
            Create New Inbox
          </Link>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <MailboxList mailboxes={mailboxes} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}
