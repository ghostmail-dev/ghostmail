import {
  Outlet,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router"
import { requireAuth } from "../../utils/session.server"
import { buildMeta, metaRobotsNoIndex } from "../../utils/seo"

export const meta: MetaFunction = ({ location }) =>
  buildMeta({
    pathname: location.pathname,
    title: "Settings · GhostMail",
    robots: metaRobotsNoIndex().content,
  })

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireAuth(request)
  return user
}

export default function UserSettings() {
  return <Outlet />
}
