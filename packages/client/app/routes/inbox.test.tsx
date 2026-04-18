import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { createMemoryRouter, RouterProvider } from "react-router"
import Inbox from "./inbox"

describe("Inbox Page", () => {
  it("renders the empty inbox state when no emails exist alongside dynamic username parameters", async () => {
    const router = createMemoryRouter(
      [
        {
          path: "/inbox/:username",
          element: <Inbox />,
          loader: () => ({ username: "testuser", mailboxFound: true, emailDocs: [] }),
        },
      ],
      { initialEntries: ["/inbox/testuser"], initialIndex: 0 }
    )

    render(<RouterProvider router={router} />)

    expect(
      await screen.findByText(/Waiting for emails.../i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Inbox: testuser/i)).toBeInTheDocument()
  })
})
