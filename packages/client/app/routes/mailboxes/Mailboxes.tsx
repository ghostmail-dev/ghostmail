import { Link, Outlet, useMatch } from "react-router"
import MailboxList from "./_components/Mailboxes"
import { Plus } from "lucide-react"
import { requireAuth } from "../../utils/session.server"
import { MailboxesLoader } from "@ghostmail/database"
import type { Route } from "./+types/Mailboxes"

export async function loader({ request }: Route.LoaderArgs) {
  const { userId } = await requireAuth(request)
  const mLoader = new MailboxesLoader()
  const result = await mLoader.getMailboxesByOwnerId(userId)
  if (!result.ok) throw new Response("Service Unavailable", { status: 503 })
  return result.value.filter((mb) =>
    mb.type === "ephemeral" ? mb.expiresAt > new Date().toJSON() : true
  )
}

export default function Mailboxes({ loaderData }: Route.ComponentProps) {
  const mailboxes = loaderData
  const hasMailboxOpen = useMatch("/mailboxes/:mailboxId/*")

  return (
    <div className="flex h-screen bg-base-100">
      <aside
        className={`${hasMailboxOpen ? "hidden md:flex" : "flex"} w-full md:w-80 border-r border-base-300 flex-col`}
      >
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

      <main
        className={`${hasMailboxOpen ? "flex" : "hidden md:flex"} flex-1 flex-col`}
      >
        <Outlet />
      </main>
    </div>
  )
}
