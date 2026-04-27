import { describe, expect, it } from "vitest"
import MailboxInbox from "./MailboxInbox"
import Route, { loader } from "./Route"
import { seedEmail, seedMailbox, seedUser } from "@ghostmail/database"
import { renderRoute } from "../../../test-utils/render-router"
import MailboxInfo from "../mailboxes.$mailboxid.info/MailboxInfo"
import DeleteMailbox from "../mailboxes.$mailboxid.delete/DeleteMailbox"
import Layout from "./Layout"

describe("/mailboxes/:mailboxId", () => {
  it("renders the inbox heading, message count, and email rows", async () => {
    const user = seedUser()
    const mailbox = seedMailbox({ ownerId: user._id })

    const email1 = seedEmail({ mailboxes: [mailbox._id] })
    const email2 = seedEmail({ mailboxes: [mailbox._id] })

    const screen = await renderRoute(
      [
        {
          id: "routes/mailboxes.$mailboxid/Route",
          path: "/mailboxes/:mailboxId",
          Component: Route,
          // @ts-expect-error, stubbed loader
          loader,
          children: [
            {
              id: "routes/mailboxes.$mailboxid/Layout",
              Component: Layout,
              children: [
                {
                  path: "info",
                  Component: MailboxInfo,
                },
                {
                  path: "delete",
                  Component: DeleteMailbox,
                },
                {
                  path: "",
                  Component: MailboxInbox,
                },
              ],
            },
          ],
        },
      ],
      `/mailboxes/${mailbox._id}`,
      user,
    )

    await expect
      .element(screen.getByRole("heading", { name: mailbox.username }))
      .toBeInTheDocument()

    if (!email1.subject) {
      throw new Error("no subject for email1")
    }
    if (!email2.subject) {
      throw new Error("no subject for email2")
    }
    if (!email1.from?.text) {
      throw new Error("no sender for email1")
    }
    if (!email2.from?.text) {
      throw new Error("no sender for email2")
    }
    await expect.element(screen.getByText("2 messages")).toBeInTheDocument()
    await expect.element(screen.getByText(email1.subject)).toBeInTheDocument()
    await expect.element(screen.getByText(email2.subject)).toBeInTheDocument()
    await expect.element(screen.getByText(email1.from.text)).toBeInTheDocument()
    await expect.element(screen.getByText(email2.from.text)).toBeInTheDocument()
  })

  it("renders the empty inbox state when there are no emails", async () => {
    const user = seedUser()
    const mailbox = seedMailbox({ ownerId: user._id })

    const screen = await renderRoute(
      [
        {
          id: "routes/mailboxes.$mailboxid/Route",
          path: "/mailboxes/:mailboxId",
          Component: Route,
          // @ts-expect-error, stubbed loader
          loader,
          children: [
            {
              id: "routes/mailboxes.$mailboxid/Layout",
              Component: Layout,
              children: [
                {
                  path: "",
                  Component: MailboxInbox,
                },
              ],
            },
          ],
        },
      ],
      `/mailboxes/${mailbox._id}`,
      user,
    )

    await expect.element(screen.getByText("0 messages")).toBeInTheDocument()
    await expect
      .element(screen.getByText(/Waiting for emails/i))
      .toBeInTheDocument()
  })
})
