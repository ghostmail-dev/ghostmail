import { useState } from "react"
import { Form, Link, redirect, useNavigate } from "react-router"
import type { Route } from "./+types/CreateInvite"
import { requireAuth } from "../../utils/session.server"
import { InvitesMutator } from "@ghostmail/database"

export const action = async ({ request }: Route.ActionArgs) => {
  const user = await requireAuth(request)

  const formData = await request.formData()
  const tokenCount = parseInt(String(formData.get("tokenCount") ?? "5"), 10)

  if (isNaN(tokenCount) || tokenCount < 1 || tokenCount > 100) {
    return { error: "Token count must be between 1 and 100" } as const
  }

  const inviteMutator = new InvitesMutator()
  await inviteMutator.createInvite(user.username, tokenCount)

  return redirect("..")
}

export default function CreateInvite() {
  const [tokenCount, setTokenCount] = useState(5)
  const navigate = useNavigate()
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => navigate("..", { replace: true })}
    >
      <div
        className="bg-base-100 rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-base-300">
          <h2>Generate New Invite</h2>
          <p className="text-sm text-base-content/60 mt-1">
            Create an invitation code with a token allocation
          </p>
        </div>

        <Form method="post" replace>
          <div className="p-6">
            <label className="fieldset w-full">
              <span className="fieldset-legend">
                Number of Persistent Tokens:
              </span>
              <input
                type="number"
                min="1"
                max="100"
                name="tokenCount"
                value={tokenCount}
                onChange={(e) => setTokenCount(parseInt(e.target.value, 10))}
                className="input input-bordered w-full"
                placeholder="5"
              />
            </label>
            <p className="text-sm text-base-content/60 mt-2">
              The invited user will be able to create up to {tokenCount}{" "}
              persistent mailbox{tokenCount !== 1 ? "es" : ""}
            </p>
          </div>

          <div className="p-6 border-t border-base-300 flex justify-end gap-2">
            <Link
              to={".."}
              replace
              className="btn btn-sm btn-error btn-outline"
            >
              Cancel
            </Link>
            <button type="submit" className="btn btn-sm btn-primary">
              Generate Invite
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}
