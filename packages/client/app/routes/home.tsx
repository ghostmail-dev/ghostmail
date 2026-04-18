import { Form, redirect } from "react-router"
import type { ActionFunctionArgs } from "react-router"
import { MailboxesMutator } from "@ghostmail/database"

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const username = formData.get("username") as string

  if (!username) return new Response("Username required", { status: 400 })

  const mutator = new MailboxesMutator()
  const target = username.includes("@")
    ? username
    : `${username}@ghostmail.localhost`

  const mailbox = await mutator.createMailbox({ username: target })
  return redirect(`/inbox/${mailbox.username}`)
}

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div
        className="glass-panel"
        style={{
          padding: "3rem",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          Ghost<span style={{ color: "var(--accent-primary)" }}>mail</span>
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "2.5rem",
            fontSize: "1.1rem",
          }}
        >
          Secure, ephemeral inboxes for testing & privacy.
        </p>

        <Form
          method="post"
          action="/?index"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div style={{ textAlign: "left" }}>
            <label
              htmlFor="username"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                fontWeight: 500,
              }}
            >
              Mailbox Username
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="username"
                name="username"
                type="text"
                className="glass-input"
                placeholder="Choose a username..."
                style={{ paddingRight: "110px" }}
                required
              />
              <span
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              >
                @ghostmail
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: "1rem" }}
          >
            Create Ephemeral Inbox
          </button>
        </Form>

        <div
          style={{
            marginTop: "2rem",
            borderTop: "1px solid var(--glass-border)",
            paddingTop: "1.5rem",
          }}
        >
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Already have an inbox?{" "}
            <button
              type="button"
              style={{
                color: "var(--accent-primary)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Access it here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
