import type { RouteConfigFunction } from "../../types"
import Mailbox from "./Mailbox"
import { Messages } from "./components/messages"

export const MailboxRoute: RouteConfigFunction = (children) => ({
  path: "mailbox",
  element: <Mailbox />,
  children: [
    {
      index: true,
      element: <Messages />,
    },
    {
      path: "*",
      element: <div>404</div>,
    },
    ...(children ?? []),
  ],
})
