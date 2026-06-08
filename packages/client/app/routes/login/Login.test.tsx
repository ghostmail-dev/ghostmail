import { describe, expect, it } from "vitest"
import Login, { loader, action, meta } from "./Login"
import { renderRoute } from "../../../test-utils/render-router"
import { userEvent } from "vitest/browser"
import { spawnUser, UsersMutator } from "@ghostmail/database"

describe("Login Page", () => {
  it("correct username and password will authenticate session", async () => {
    // Pre-create a user to test login
    const [username, password] = ["existinguser", "figureItOut"]
    const mutator = new UsersMutator()
    await mutator.createUser(username, password, "")

    const screen = await renderRoute(
      [
        {
          path: "/login",
          Component: Login,
          loader,
          action,
        },
        {
          path: "/mailboxes",
          Component: () => <div>Mailboxes Test SuccessPage</div>,
        },
      ],
      "/login",
    )

    const usernameInput = screen.getByLabelText(/Username/i)
    const passwordInput = screen.getByLabelText(/^Password$/i)

    await userEvent.type(usernameInput, username)
    await userEvent.type(passwordInput, password)
    await userEvent.click(screen.getByRole("button", { name: /Sign In/i }))
    // After successful login, we should be redirected to /mailboxes
    await expect
      .element(screen.getByText(/Mailboxes Test SuccessPage/i))
      .toBeInTheDocument()
  })

  it("will show error on invalid credentials", async () => {
    const screen = await renderRoute(
      [
        {
          path: "/login",
          Component: Login,
          loader,
          action,
        },
      ],
      "/login",
    )

    const usernameInput = screen.getByLabelText(/Username/i)
    const passwordInput = screen.getByLabelText(/^Password$/i)

    await userEvent.type(usernameInput, "nonexistentuser")
    await userEvent.type(passwordInput, "wrongpassword")
    await userEvent.click(screen.getByRole("button", { name: /Sign In/i }))
    // After failed login, we should see an error message
    await expect
      .element(screen.getByText(/Invalid username or password/i))
      .toBeInTheDocument()
  })

  it("redirects to /mailboxes if user is already authenticated", async () => {
    const screen = await renderRoute(
      [
        { path: "/", Component: Login, loader, action },
        {
          path: "/mailboxes",
          Component: () => <div>Mailboxes Test SuccessPage</div>,
        },
      ],
      "/",
      spawnUser(),
    )

    expect(screen.getByText(/Mailboxes Test SuccessPage/i)).toBeInTheDocument()
  })

  it("meta viewport content is set correctly", async () => {
    await renderRoute(
      [{ path: "/login", Component: Login, loader, action, meta }],
      "/login",
    )

    expect(
      document.head
        .querySelector('meta[name="viewport"]')
        ?.getAttribute("content"),
    ).toContain("width=device-width")
    expect(
      document.head
        .querySelector('meta[name="viewport"]')
        ?.getAttribute("content"),
    ).toContain("initial-scale=1")
  })
})
