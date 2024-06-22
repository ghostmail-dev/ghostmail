import { clearTokens } from "~/lib/apollo-tokens"
import type { RouteConfigFunction } from "../../types"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "~/global-contexts/useUserContext"
import { useEffect } from "react"

export const LogoutRoute: RouteConfigFunction = (children) => ({
  path: "logout",
  element: <Logout />,
  children: [
    {
      index: true,
      element: <Logout />,
    },
    {
      path: "*",
      element: <div>404</div>,
    },
    ...(children ?? []),
  ],
})

function Logout() {
  const navigate = useNavigate()
  const [_, setUsername] = useUserContext()
  useEffect(() => {
    clearTokens()
    setUsername(null)
    navigate("/login")
  }, [])
  return null
}
