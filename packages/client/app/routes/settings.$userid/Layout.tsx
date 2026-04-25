import { Key, Mail } from "lucide-react"
import { NavLink, Outlet } from "react-router"
import { requireAuth } from "../../utils/session.server"
import type { Route } from "./+types/Layout"

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request)
  return user
}

export default function Settings({ loaderData: user }: Route.ComponentProps) {
  const isAdmin = user.roles.includes("admin")
  return (
    <div className="flex flex-col h-screen bg-base-100">
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex w-64 bg-base-200 border-r border-base-300 flex-col">
          <nav className="p-4 space-y-1">
            <NavLink
              to={`/settings/${user.userId}/password`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-base-300" : "hover:bg-base-300"
                }`
              }
            >
              <Key className="w-5 h-5" />
              <span>Change Password</span>
            </NavLink>

            {isAdmin && (
              <NavLink
                to={`/settings/${user.userId}/invites`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-base-300" : "hover:bg-base-300"
                  }`
                }
              >
                <Mail className="w-5 h-5" />
                <span>Invites</span>
              </NavLink>
            )}
          </nav>
        </aside>

        <div className="flex flex-col flex-1 overflow-hidden">
          <nav className="flex md:hidden border-b border-base-300 px-2">
            <NavLink
              to={`/settings/${user.userId}/password`}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent hover:border-base-content/30"
                }`
              }
            >
              <Key className="w-4 h-4" />
              Password
            </NavLink>

            {isAdmin && (
              <NavLink
                to={`/settings/${user.userId}/invites`}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent hover:border-base-content/30"
                  }`
                }
              >
                <Mail className="w-4 h-4" />
                Invites
              </NavLink>
            )}
          </nav>

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
