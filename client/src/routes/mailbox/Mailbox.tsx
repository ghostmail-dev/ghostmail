import { useUserContext } from "~/global-contexts/useUserContext"
import { Navigate, Outlet } from "react-router-dom"

export default function Mailbox() {
  const [username] = useUserContext()
  if (!username) {
    return <Navigate to="/login" />
  }
  return (
    <div className="prose min-w-full">
      <h1 className="prose-lg ml-4">
        Messages for <a href={`mailto:${username}`}>{username}</a>
      </h1>
      <Outlet />
    </div>
  )
}
