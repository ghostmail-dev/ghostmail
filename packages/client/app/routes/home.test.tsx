import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { createMemoryRouter, RouterProvider } from "react-router"
import Home from "./home"

describe("Home Page (Mailbox Creation)", () => {
  it("renders the main Ghostmail branding and creation form", () => {
    const router = createMemoryRouter([{ path: "/", element: <Home /> }], {
      initialEntries: ["/"],
      initialIndex: 0,
    })

    render(<RouterProvider router={router} />)

    expect(screen.getByText(/Ghostmail/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/Choose a username/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /Create Ephemeral Inbox/i })
    ).toBeInTheDocument()
  })
})
