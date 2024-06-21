import type { RouteConfigFunction } from "../../types"
import { Email } from "./Email"

export const EmailRoute: RouteConfigFunction = (children) => ({
  path: ":emailId",
  element: <Email />,
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
