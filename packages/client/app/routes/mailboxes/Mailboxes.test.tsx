import { beforeEach, describe, expect, it } from "vitest"
import MailboxesRoute, { loader } from "./Mailboxes"
import InfoRoute from "../mailboxes.$mailboxid.info/MailboxInfo"
import {
  MailboxesLoader,
  resetDatabase,
  seedEmail,
  seedMailbox,
  seedUser,
  type UserDocument,
} from "@ghostmail/database"
import { renderRoute } from "../../../test-utils/render-router"
import CreateMailboxRoute, {
  action,
  loader as createLoader,
} from "../mailboxes.create/CreateMailboxRoute"
import DeleteMailboxRoute, {
  action as deleteMailboxAction,
} from "../mailboxes.$mailboxid.delete/DeleteMailbox"
import { userEvent } from "vitest/browser"

const renderMailboxesRoute = (user: UserDocument | null) => {
  return renderRoute(
    [
      {
        id: "routes/mailboxes/Mailboxes",
        path: "/mailboxes",
        Component: MailboxesRoute,
        loader,
        children: [
          {
            path: "create",
            Component: CreateMailboxRoute,
            action,
            loader: createLoader,
          },
          {
            path: ":mailboxId/info",
            Component: InfoRoute,
          },
          {
            path: ":mailboxId/delete",
            Component: DeleteMailboxRoute,
            // @ts-expect-error: params are not being picked up by the router stub
            action: deleteMailboxAction,
          },
          {
            path: ":mailboxId",
            Component: () => <div>Test Inbox</div>,
          },
        ],
      },
    ],
    "/mailboxes",
    user
      ? {
          userId: user._id,
          username: user.username,
          roles: user.roles,
          maxPersistentMailboxes: user.maxPersistentMailboxes,
        }
      : null,
  )
}

describe("/mailboxes", () => {
  beforeEach(() => {
    resetDatabase()
  })
  describe("Renders the mailboxes sidebar", () => {
    it("Renders the mailboxes page", async () => {
      const user = seedUser()

      const ephemeralMailbox = seedMailbox({
        ownerId: user._id,
        type: "ephemeral",
      })
      seedEmail({
        mailboxes: [ephemeralMailbox._id],
      })

      const persistentMailbox = seedMailbox({
        ownerId: user._id,
        type: "persistent",
      })
      seedEmail({
        mailboxes: [persistentMailbox._id],
      })

      const screen = await renderMailboxesRoute(user)

      await expect
        .element(screen.getByRole("link", { name: /Create New Inbox/i }))
        .toHaveAttribute("href", "/mailboxes/create")

      // ephemeral mailbox renders
      await expect.element(screen.getByText("Ephemeral")).toBeInTheDocument()
      await expect
        .element(screen.getByTestId("time-remaining"))
        .toHaveTextContent(/\d+m \d+s/)
      await expect
        .element(screen.getByText(ephemeralMailbox.username))
        .toBeInTheDocument()
      await expect
        .element(
          screen.getByLabelText(`Inbox info for ${ephemeralMailbox.username}`),
        )
        .toHaveAttribute("href", `/mailboxes/${ephemeralMailbox._id}/info`)
      await expect
        .element(
          screen.getByTestId(
            `${ephemeralMailbox.type}-${ephemeralMailbox._id}-unread-count`,
          ),
        )
        .toHaveTextContent("1")
      await expect
        .element(
          screen.getByLabelText(`Inbox for ${ephemeralMailbox.username}`),
        )
        .toHaveAttribute("href", `/mailboxes/${ephemeralMailbox._id}`)
      await expect
        .element(screen.getByLabelText(`Delete ${ephemeralMailbox.username}`))
        .toHaveAttribute("href", `/mailboxes/${ephemeralMailbox._id}/delete`)

      // persistent mailbox renders
      await expect.element(screen.getByText("Persistent")).toBeInTheDocument()
      await expect
        .element(screen.getByText(persistentMailbox.username))
        .toBeInTheDocument()
      await expect
        .element(
          screen.getByLabelText(`Inbox info for ${persistentMailbox.username}`),
        )
        .toHaveAttribute("href", `/mailboxes/${persistentMailbox._id}/info`)
      await expect
        .element(
          screen.getByTestId(
            `${persistentMailbox.type}-${persistentMailbox._id}-unread-count`,
          ),
        )
        .toHaveTextContent("1")
      await expect
        .element(
          screen.getByLabelText(`Inbox for ${persistentMailbox.username}`),
        )
        .toHaveAttribute("href", `/mailboxes/${persistentMailbox._id}`)
      await expect
        .element(screen.getByLabelText(`Delete ${persistentMailbox.username}`))
        .toHaveAttribute("href", `/mailboxes/${persistentMailbox._id}/delete`)
    })
  })

  describe("/mailboxes/create", () => {
    it("Create New Inbox button navigates to create page", async () => {
      const user = seedUser()
      seedMailbox({ ownerId: user._id })

      const screen = await renderMailboxesRoute(user)

      await userEvent.click(
        screen.getByRole("link", { name: /Create New Inbox/i }),
      )

      // Assert that Create New Inbox route modal is rendered
      await expect
        .element(screen.getByRole("heading", { name: /Create New Inbox/i }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText(/Choose the type of inbox/i))
        .toBeInTheDocument()
      await expect
        .element(screen.getByRole("button", { name: /Ephemeral Inbox/i }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText(/Temporary inbox that expires after 1 hour/i))
        .toBeInTheDocument()
      await expect
        .element(screen.getByRole("button", { name: /Persistent Inbox/i }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText(/Permanent inbox that doesn't expire/i))
        .toBeInTheDocument()
      await expect
        .element(screen.getByRole("link", { name: /Cancel/i }))
        .toBeInTheDocument()
    })

    it("Creates a new persistent mailbox", async () => {
      const user = seedUser({ maxPersistentMailboxes: 1 })
      const screen = await renderMailboxesRoute(user)

      await userEvent.click(
        screen.getByRole("link", { name: /Create New Inbox/i }),
      )

      await userEvent.click(
        screen.getByRole("button", { name: /Persistent Inbox/i }),
      )

      const mailboxLoader = new MailboxesLoader()
      const result = await mailboxLoader.getMailboxesByOwnerId(user._id)

      const mailboxes = result.ok ? result.value : []
      expect(mailboxes.length).toBe(1)
      expect(mailboxes[0].type).toBe("persistent")
    })

    it("Disables persistent mailbox button when user has reached limit", async () => {
      const user = seedUser({ maxPersistentMailboxes: 1 })
      seedMailbox({ ownerId: user._id, type: "persistent" })
      const screen = await renderMailboxesRoute(user)

      await userEvent.click(
        screen.getByRole("link", { name: /Create New Inbox/i }),
      )

      const persistentButton = screen.getByRole("button", {
        name: /Persistent Inbox/i,
      })
      expect(persistentButton).toBeDisabled()
    })

    it("Creates a new ephemeral mailbox", async () => {
      const user = seedUser()
      const screen = await renderMailboxesRoute(user)

      await userEvent.click(
        screen.getByRole("link", { name: /Create New Inbox/i }),
      )

      const persistentButton = screen.getByRole("button", {
        name: /Persistent Inbox/i,
      })
      expect(persistentButton).toBeDisabled()
    })

    it("Creates a new ephemeral mailbox", async () => {
      const user = seedUser()
      const screen = await renderMailboxesRoute(user)

      await userEvent.click(
        screen.getByRole("link", { name: /Create New Inbox/i }),
      )

      await userEvent.click(
        screen.getByRole("button", { name: /Ephemeral Inbox/i }),
      )

      const mailboxLoader = new MailboxesLoader()
      const result = await mailboxLoader.getMailboxesByOwnerId(user._id)
      const mailboxes = result.ok ? result.value : []
      expect(mailboxes.length).toBe(1)
      expect(mailboxes[0].type).toBe("ephemeral")
    })
  })

  describe("/mailboxes/:mailboxid/delete", () => {
    it("renders the delete confirmation modal", async () => {
      const user = seedUser()
      const mailbox = seedMailbox({ ownerId: user._id })
      const screen = await renderMailboxesRoute(user)

      await userEvent.click(screen.getByLabelText(`Delete ${mailbox.username}`))

      await expect
        .element(
          screen.getByText(/Are you sure you want to delete this inbox?/i),
        )
        .toBeInTheDocument()
      await expect
        .element(screen.getByRole("link", { name: /Cancel/i }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByRole("button", { name: /Delete/i }))
        .toBeInTheDocument()
    })

    it("Deletes the mailbox", async () => {
      const user = seedUser()
      const mailbox = seedMailbox({ ownerId: user._id })
      const screen = await renderMailboxesRoute(user)

      const deleteBtn = screen.getByLabelText(`Delete ${mailbox.username}`)
      await userEvent.hover(deleteBtn)
      await userEvent.click(deleteBtn)

      await userEvent.click(screen.getByRole("button", { name: /Delete/i }))

      const mailboxLoader = new MailboxesLoader()
      const result = await mailboxLoader.getMailboxesByOwnerId(user._id)
      const mailboxes = result.ok ? result.value : []
      expect(mailboxes.length).toBe(0)

      await expect
        .element(screen.getByRole("heading", { name: /Ephemeral/i }))
        .not.toBeInTheDocument()
      await expect
        .element(screen.getByRole("heading", { name: /Persistent/i }))
        .not.toBeInTheDocument()
      await expect
        .element(screen.getByLabelText(`Delete ${mailbox.username}`))
        .not.toBeInTheDocument()
    })

    it("Cancels the deletion", async () => {
      const user = seedUser()
      const mailbox = seedMailbox({ ownerId: user._id })
      const screen = await renderMailboxesRoute(user)

      const deleteBtn = screen.getByLabelText(`Delete ${mailbox.username}`)
      await userEvent.hover(deleteBtn)
      await userEvent.click(deleteBtn)

      await userEvent.click(screen.getByRole("link", { name: /Cancel/i }))

      const mailboxLoader = new MailboxesLoader()
      const result = await mailboxLoader.getMailboxesByOwnerId(user._id)
      const mailboxes = result.ok ? result.value : []
      expect(mailboxes.length).toBe(1)
    })
  })

  describe("/mailboxes/:mailboxid/info", () => {
    it("renders the mailbox info", async () => {
      const user = seedUser()
      const mailbox = seedMailbox({ ownerId: user._id })
      const screen = await renderMailboxesRoute(user)

      await userEvent.click(
        screen.getByLabelText(`Inbox info for ${mailbox.username}`),
      )

      await expect
        .element(screen.getByText(/Mailbox Info/i))
        .toBeInTheDocument()
      const jsonElement = screen.getByTestId("mailbox-info")
      expect(jsonElement).toHaveTextContent(mailbox.username)
      expect(jsonElement).toHaveTextContent(mailbox.password)
      expect(jsonElement).toHaveTextContent(import.meta.env.VITE_SMTP_HOST)
      expect(jsonElement).toHaveTextContent(import.meta.env.VITE_SMTP_PORT)
    })
  })
})
