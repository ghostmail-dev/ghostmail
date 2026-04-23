import { describe, expect, it } from "vitest"
import EmailDetail, { loader } from "./EmailDetails"
import { seedEmail, seedMailbox, seedUser } from "@ghostmail/database"
import { renderRoute } from "../../../test-utils/render-router"

describe("Email Detail Route", () => {
  it("renders the selected email subject, metadata, and body", async () => {
    const user = seedUser()
    const mailbox = seedMailbox({
      ownerId: user._id,
    })

    const email = seedEmail({
      from: {
        value: [{ address: "sender@example.com", name: "Sender" }],
        html: "<a href='mailto:sender@example.com'>Sender</a>",
        text: "sender@example.com",
      },
      to: {
        value: [{ address: mailbox.username, name: `${mailbox.username}` }],
        html: `<a href='mailto:${mailbox.username}'>${mailbox.username}</a>`,
        text: mailbox.username,
      },
      subject: "Welcome to GhostMail",
      html: "<p>This is a test paragraph.</p>",
      textAsHtml: "<p>This is a test paragraph.</p>",
      text: "This is a test paragraph.",
      mailboxes: [mailbox._id],
    })

    const screen = await renderRoute(
      [
        {
          path: "/mailboxes/:mailboxId/:emailId",
          Component: EmailDetail,
          // @ts-expect-error loader is not a Route.LoaderFunction
          loader,
        },
      ],
      `/mailboxes/${mailbox._id}/${email._id}`,
      {
        userId: user._id,
        username: user.username,
      },
    )

    await expect
      .element(screen.getByRole("heading", { name: /Welcome to GhostMail/i }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText("sender@example.com"))
      .toBeInTheDocument()
    await expect.element(screen.getByText(mailbox.username)).toBeInTheDocument()
    await expect
      .element(screen.getByText("This is a test paragraph."))
      .toBeInTheDocument()
  })
})
