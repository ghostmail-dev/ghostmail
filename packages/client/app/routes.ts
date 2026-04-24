import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes"

export default [
  index("routes/Home.tsx"),
  route("login", "routes/login/Login.tsx"),
  route("signup", "routes/signup/Signup.tsx"),
  route("logout", "routes/logout/Logout.tsx"),
  route("settings/:userId", "routes/settings.$userid/Route.tsx", [
    layout("routes/settings.$userid/Layout.tsx", [
      index("routes/settings.$userid/Index.tsx"),
      route("password", "routes/settings.$userid/Password.tsx"),
      route("invites", "routes/settings.$userid/Invites.tsx", [
        route("create", "routes/settings.$userid/CreateInvite.tsx"),
      ]),
    ]),
  ]),

  route("mailboxes", "routes/mailboxes/Mailboxes.tsx", [
    route("create", "routes/mailboxes.create/CreateMailboxRoute.tsx"),
    route(":mailboxId", "routes/mailboxes.$mailboxid/Route.tsx", [
      route("info", "routes/mailboxes.$mailboxid.info/MailboxInfo.tsx"),
      route("delete", "routes/mailboxes.$mailboxid.delete/DeleteMailbox.tsx"),
      layout("routes/mailboxes.$mailboxid/Layout.tsx", [
        index("routes/mailboxes.$mailboxid/MailboxInbox.tsx"),
        route(
          ":emailId",
          "routes/mailboxes.$mailboxid.$emailid/EmailDetails.tsx",
        ),
      ]),
    ]),
  ]),

  route(".well-known/*", "routes/well-known/route.tsx"),
] satisfies RouteConfig
