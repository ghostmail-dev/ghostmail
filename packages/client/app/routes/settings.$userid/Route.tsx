import {
  Outlet,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router"
import { requireAuth } from "../../utils/session.server"
import { metaRobotsNoIndex } from "../../utils/seo"

export const meta: MetaFunction = () => [
  { title: "Settings · GhostMail" },
  metaRobotsNoIndex(),
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireAuth(request)
  return user
}

export default function UserSettings() {
  return <Outlet />
}
