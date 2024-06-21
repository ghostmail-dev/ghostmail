import type { RouteConfigFunction } from "../../types"
import { Login } from "./Login"

export const LoginRoute: RouteConfigFunction = (children) => ({
  path: "login",
  element: <Login />,
  children: [
    {
      path: "*",
      element: <div>404</div>,
    },
    ...(children ?? []),
  ],
  loader: () => {
    return null
  },
})
