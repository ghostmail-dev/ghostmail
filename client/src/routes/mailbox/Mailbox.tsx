import { useUserContext } from "~/global-contexts/useUserContext"
import { Navigate, Outlet } from "react-router-dom"

export default function Mailbox() {
  const [username] = useUserContext()
  console.log(username)
  if (!username) {
    return <Navigate to="/login" />
  }
  return (
    <div>
      <h1>Mailbox for {username}</h1>
      <Outlet />
    </div>
  )
}
