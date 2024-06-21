import type { RouteConfigFunction } from "../../types"
import Inbox from "./Inbox"

export const InboxRoute: RouteConfigFunction = (children) => ({
  path: "inbox",
  children: [
    {
      index: true,
      element: <Inbox />,
    },
    {
      path: "*",
      element: <div>404</div>,
    },
    ...(children ?? []),
  ],
})
