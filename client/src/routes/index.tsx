import { createBrowserRouter } from "react-router-dom"
import { RootRoute } from "./root/route"
import { MailboxRoute } from "./mailbox/route"
import { LoginRoute } from "./login/route"
import { LogoutRoute } from "./logout/route"
import { EmailRoute } from "./mailbox.$emailId/route"

export const router = createBrowserRouter([
  RootRoute([MailboxRoute([EmailRoute()]), LoginRoute(), LogoutRoute()]),
])
