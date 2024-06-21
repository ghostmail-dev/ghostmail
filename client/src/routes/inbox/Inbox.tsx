import { useUserContext } from "~/global-contexts/useUserContext"
import { Messages } from "./components/messages"
import { Navigate } from "react-router-dom"

export default function Inbox() {
  const [username] = useUserContext()
  console.log(username)
  if (!username) {
    return <Navigate to="/login" />
  }
  return <Messages />
}
