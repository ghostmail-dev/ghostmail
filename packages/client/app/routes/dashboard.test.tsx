import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { createMemoryRouter, RouterProvider } from "react-router"
import Dashboard from "./dashboard"

describe("Dashboard Page", () => {
  it("renders the dashboard specific headers securely out of context of the inbox routes", () => {
    const router = createMemoryRouter([{ path: "/", element: <Dashboard /> }])
    render(<RouterProvider router={router} />)
    expect(screen.getByText(/User Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/API Keys/i)).toBeInTheDocument()
  })
})
