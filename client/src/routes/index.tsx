import { createBrowserRouter } from "react-router-dom"
import { RootRoute } from "./root/route"
import { InboxRoute } from "./inbox/route"
import { LoginRoute } from "./login/route"
import { LogoutRoute } from "./logout/route"

export const router = createBrowserRouter([
  RootRoute([InboxRoute(), LoginRoute(), LogoutRoute()]),
])
