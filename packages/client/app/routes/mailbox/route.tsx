import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Outlet } from "react-router-dom"
import { authenticator } from "~/services/auth.server"

type LoaderData = string
export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  return json<LoaderData>(user.username)
}

export default function Mailbox() {
  const username = useLoaderData<LoaderData>()

  return (
    <div className="prose min-w-full">
      <h1 className="prose-lg ml-4">
        Messages for <a href={`mailto:${username}`}>{username}</a>
      </h1>
      <Outlet />
    </div>
  )
}
