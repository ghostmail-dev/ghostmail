// routes/mailboxes.$mailboxid/useMailbox.ts
import { useRouteLoaderData } from "react-router"
import type { Route } from "./+types/Route"

type Mailbox = Route.ComponentProps["loaderData"]

export function useMailbox(): Mailbox {
  const data = useRouteLoaderData("routes/mailboxes.$mailboxid/Route")

  if (!data) {
    throw new Error("Mailbox loader data missing")
  }

  return data as Mailbox
}
