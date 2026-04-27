import { useRouteLoaderData } from "react-router"
import type { Route } from "./+types/Mailboxes"

type Mailboxes = Route.ComponentProps["loaderData"]

export function useMailboxesData(): Mailboxes {
  const data = useRouteLoaderData("routes/mailboxes/Mailboxes")

  if (!data) {
    throw new Error("Mailboxes loader data missing")
  }

  return data as Mailboxes
}
