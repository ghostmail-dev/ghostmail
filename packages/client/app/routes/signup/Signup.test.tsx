import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import Signup, { loader, action } from "./Signup"
import { renderRoute } from "../../../test-utils/render-router"
import { UsersLoader, UsersMutator } from "@ghostmail/database"
import Login, {
  action as loginAction,
  loader as loginLoader,
} from "../login/Login"
import { action as logoutAction } from "../logout/Logout"
import { Form } from "react-router"

describe("Signup Page", () => {
  it("will handle a password errors", async () => {
    const screen = await renderRoute([
      { path: "/", Component: Signup, loader, action },
    ])

    const usernameInput = screen.getByLabelText(/Username/i)
    const passwordInput = screen.getByLabelText(/^Password$/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)

    // test password mismatch error
    await userEvent.type(usernameInput, "testuser")
    await userEvent.type(passwordInput, "testpassword")
    await userEvent.type(confirmPasswordInput, "differentpassword")
    await userEvent.click(
      screen.getByRole("button", { name: /Create Account/i }),
    )
    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument()

    // test password length error
    await userEvent.clear(passwordInput)
    await userEvent.clear(confirmPasswordInput)
    await userEvent.type(passwordInput, "short")
    await userEvent.type(confirmPasswordInput, "short")
    await userEvent.click(
      screen.getByRole("button", { name: /Create Account/i }),
    )
    expect(
      screen.getByText(/Password must be at least 8 characters/i),
    ).toBeInTheDocument()
  })

  it("will handle a username already taken error", async () => {
    // Pre-create a user to trigger the "username already taken" error
    const mutator = new UsersMutator()
    await mutator.createUser("existinguser", "password")

    const screen = await renderRoute([
      { path: "/", Component: Signup, loader, action },
    ])

    const usernameInput = screen.getByLabelText(/Username/i)
    const passwordInput = screen.getByLabelText(/^Password$/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)

    await userEvent.type(usernameInput, "existinguser")
    await userEvent.type(passwordInput, "password")
    await userEvent.type(confirmPasswordInput, "password")
    await userEvent.click(
      screen.getByRole("button", { name: /Create Account/i }),
    )
    expect(screen.getByText(/Username already taken/i)).toBeInTheDocument()
  })

  it("redirects to /mailboxes if user is already authenticated", async () => {
    // Pre-create a user and session to simulate an authenticated user

    const screen = await renderRoute(
      [
        { path: "/", Component: Signup, loader, action },
        {
          path: "/mailboxes",
          Component: () => <div>Mailboxes Test SuccessPage</div>,
        },
      ],
      "/",
      { userId: "testuserid", username: "testuser" },
    )

    expect(screen.getByText(/Mailboxes Test SuccessPage/i)).toBeInTheDocument()
  })

  it("creates a new account with valid input in all fields and redirects to /mailboxes", async () => {
    const screen = await renderRoute(
      [
        { path: "/signup", Component: Signup, loader, action },
        {
          path: "/mailboxes",
          Component: () => <div>Mailboxes Test SuccessPage</div>,
        },
      ],
      "/signup",
    )

    const usernameInput = screen.getByLabelText(/Username/i)
    const passwordInput = screen.getByLabelText(/^Password$/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)

    await userEvent.type(usernameInput, "testuser")
    await userEvent.type(passwordInput, "testpassword")
    await userEvent.type(confirmPasswordInput, "testpassword")

    await userEvent.click(
      screen.getByRole("button", { name: /Create Account/i }),
    )

    // Verify we were redirected to the mailboxes page after successful signup
    await expect
      .element(screen.getByText(/Mailboxes Test SuccessPage/i))
      .toBeInTheDocument()

    // Verify the user was created in the mock database

    const userLoader = new UsersLoader()
    const createdUser = await userLoader.getUserByName("testuser")
    expect(createdUser).toBeTruthy()
  })

  it("user can login after signup", async () => {
    const username = "testuser"
    const password = "testpassword"
    const screen = await renderRoute(
      [
        { path: "/signup", Component: Signup, loader, action },
        {
          path: "/mailboxes",
          Component: () => (
            <div>
              <div>Mailboxes Success Page</div>
              <Form method="post" action="/logout">
                <button type="submit">Logout</button>
              </Form>
            </div>
          ),
        },
        {
          path: "/logout",
          Component: () => <div>Logged Out</div>,
          action: logoutAction,
        },
        {
          path: "/login",
          Component: Login,
          loader: loginLoader,
          action: loginAction,
        },
      ],
      "/signup",
    )

    // Pre-create a user to test login
    const usernameInputSignup = screen.getByLabelText(/Username/i)
    const passwordInputSignup = screen.getByLabelText(/^Password$/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)

    await userEvent.type(usernameInputSignup, username)
    await userEvent.type(passwordInputSignup, password)
    await userEvent.type(confirmPasswordInput, password)

    await userEvent.click(
      screen.getByRole("button", { name: /Create Account/i }),
    )

    await userEvent.click(screen.getByText(/Logout/i))

    const usernameInput = screen.getByLabelText(/Username/i)
    const passwordInput = screen.getByLabelText(/^Password$/i)

    await userEvent.type(usernameInput, username)
    await userEvent.type(passwordInput, password)
    await userEvent.click(screen.getByRole("button", { name: /Sign In/i }))
    // After successful login, we should be redirected to /mailboxes
    await expect
      .element(screen.getByText(/Mailboxes Success Page/i))
      .toBeInTheDocument()
  })
})
