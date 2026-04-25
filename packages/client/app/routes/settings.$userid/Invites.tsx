import { Calendar, Check, Copy, Mail, Plus, Ticket, Trash2 } from "lucide-react"
import { useState } from "react"
import type { Route } from "./+types/Invites"
import { requireAuth } from "../../utils/session.server"
import { Form, Link, Outlet } from "react-router"
import { InvitesLoader, InvitesMutator } from "@ghostmail/database"

export const loader = async ({ request }: Route.LoaderArgs) => {
  const user = await requireAuth(request)
  const inviteLoader = new InvitesLoader()
  const invites = await inviteLoader.getInvitesByUsername(user.username)
  return invites
}

export const action = async ({ request }: Route.ActionArgs) => {
  const user = await requireAuth(request)

  const formData = await request.formData()
  const tokenCount = parseInt(String(formData.get("tokenCount") ?? "5"), 10)
  const deleteInviteId = String(formData.get("deleteInvite") ?? "")

  if (deleteInviteId) {
    const inviteMutator = new InvitesMutator()
    await inviteMutator.deleteInvite(deleteInviteId)
    return { success: true } as const
  }

  if (isNaN(tokenCount) || tokenCount < 1 || tokenCount > 100) {
    return { error: "Token count must be between 1 and 100" } as const
  }

  const inviteMutator = new InvitesMutator()
  await inviteMutator.createInvite(user.username, tokenCount)

  return { success: true } as const
}

export default function Invites({ loaderData: invites }: Route.ComponentProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="mb-2">Invite Codes</h2>
          <p className="text-base-content/60">
            Manage invitation codes and persistent token allocations
          </p>
        </div>
        <Link to="create" className="btn gap-2 btn-primary shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Generate Invite</span>
          <span className="sm:hidden">Generate</span>
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Invite Code</th>
              <th>Persistent Tokens</th>
              <th>Created</th>
              <th>Status</th>
              <th>Used By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invites.map((invite) => (
              <tr key={invite.code} className="hover:bg-base-200">
                <td>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-base-200 px-2 py-1 rounded">
                      {invite.code}
                    </code>
                    <button
                      onClick={() => handleCopyCode(invite.code)}
                      className="btn btn-ghost btn-xs btn-square"
                      title="Copy code"
                    >
                      {copiedCode === invite.code ? (
                        <Check className="w-3 h-3 text-success" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4" />
                    <span>{invite.persistentTokens}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(invite.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td>
                  {invite.usedBy ? (
                    <span className="badge badge-success badge-sm">Used</span>
                  ) : (
                    <span className="badge badge-warning badge-sm">
                      Pending
                    </span>
                  )}
                </td>
                <td>
                  {invite.usedBy ? (
                    <div className="text-sm">
                      <div>{invite.usedBy}</div>
                      <div className="text-xs text-base-content/60">
                        {invite.usedAt
                          ? new Date(invite.usedAt).toLocaleDateString()
                          : ""}
                      </div>
                    </div>
                  ) : (
                    <span className="text-base-content/40">—</span>
                  )}
                </td>
                <td>
                  {!invite.usedBy && (
                    <Form method="post">
                      <button
                        type="submit"
                        name="deleteInvite"
                        value={invite.code}
                        className="btn btn-ghost btn-xs btn-square text-error"
                        title="Delete invite"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {invites.length === 0 && (
          <div className="text-center py-12 text-base-content/60">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No invites generated yet</p>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {invites.length === 0 && (
          <div className="text-center py-12 text-base-content/60">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No invites generated yet</p>
          </div>
        )}
        {invites.map((invite) => (
          <div key={invite.code} className="card bg-base-200 shadow-sm">
            <div className="card-body p-4 gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <code className="text-sm bg-base-300 px-2 py-1 rounded truncate">
                    {invite.code}
                  </code>
                  <button
                    onClick={() => handleCopyCode(invite.code)}
                    className="btn btn-ghost btn-xs btn-square shrink-0"
                    title="Copy code"
                  >
                    {copiedCode === invite.code ? (
                      <Check className="w-3 h-3 text-success" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {invite.usedBy ? (
                    <span className="badge badge-success badge-sm">Used</span>
                  ) : (
                    <span className="badge badge-warning badge-sm">
                      Pending
                    </span>
                  )}
                  {!invite.usedBy && (
                    <Form method="post">
                      <button
                        type="submit"
                        name="deleteInvite"
                        value={invite.code}
                        className="btn btn-ghost btn-xs btn-square text-error"
                        title="Delete invite"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Form>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-base-content/70">
                <span className="flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5" />
                  {invite.persistentTokens} token
                  {invite.persistentTokens !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(invite.createdAt).toLocaleDateString()}
                </span>
                {invite.usedBy && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {invite.usedBy}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Outlet />
    </div>
  )
}
