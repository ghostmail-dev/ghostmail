import { Check, Eye, EyeOff } from "lucide-react"
import type { Route } from "./+types/Password"
import { requireAuth } from "../../utils/session.server"
import { UsersLoader, UsersMutator } from "@ghostmail/database"
import { compareSync } from "bcryptjs"
import { Form } from "react-router"
import { useState } from "react"

export async function action({ request }: Route.ActionArgs) {
  const { userId } = await requireAuth(request)
  const formData = await request.formData()
  const currentPassword = String(formData.get("currentPassword") ?? "")
  const newPassword = String(formData.get("newPassword") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  const userLoader = new UsersLoader()
  const user = await userLoader.getUserById(userId)
  if (!user || !compareSync(currentPassword, user.password)) {
    return { success: false, error: "Invalid password" } as const
  }

  // Validate current password, new password, and confirmation
  // Update password in database if valid
  // Return success or error message
  if (newPassword !== confirmPassword) {
    return {
      success: false,
      error: "New password and confirmation do not match",
    } as const
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      error: "New password must be at least 8 characters long",
    } as const
  }

  const userMutator = new UsersMutator()

  await userMutator.changeUserPassword(userId, newPassword)

  return { success: true } as const
}

export default function ChangePassword({ actionData }: Route.ComponentProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-6">
        <h2 className="mb-2">Change Password</h2>
        <p className="text-base-content/60">
          Update your password to keep your account secure
        </p>
      </div>

      {actionData?.success ? (
        <div className="alert alert-success mb-6 flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>Password updated successfully</span>
        </div>
      ) : actionData?.error ? (
        <div className="alert alert-error mb-6 flex items-center gap-2">
          <span>{actionData.error}</span>
        </div>
      ) : null}

      <Form method="post" className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Current Password</span>
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              className="input input-bordered w-full pr-12"
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-square"
            >
              {showCurrentPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              className="input input-bordered w-full pr-12"
              placeholder="Enter new password"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-square"
            >
              {showNewPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <label className="label">
            <span className="label-text-alt text-base-content/60">
              Must be at least 8 characters
            </span>
          </label>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Confirm New Password</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="input input-bordered w-full pr-12"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-square"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary">
            Update Password
          </button>
        </div>
      </Form>
    </div>
  )
}
