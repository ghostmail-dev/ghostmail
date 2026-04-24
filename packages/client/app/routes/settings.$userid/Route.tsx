import { Outlet, type LoaderFunctionArgs } from "react-router"
import { requireAuth } from "../../utils/session.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireAuth(request)
  return user
}

export default function UserSettings() {
  return <Outlet />
}
