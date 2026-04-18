import { useLoaderData, useRevalidator } from "react-router"
import { useEffect } from "react"
import type { LoaderFunctionArgs } from "react-router"
import { MailboxesLoader, EmailsLoader } from "@ghostmail/database"

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.username) throw new Response("Not Found", { status: 404 })

  const mLoader = new MailboxesLoader()
  const mailbox = await mLoader.getMailboxByName(params.username)

  if (!mailbox) {
    return { username: params.username, mailboxFound: false, emailDocs: [] }
  }

  const eLoader = new EmailsLoader()
  const emailDocs = await Promise.all(
    mailbox.emails.map((e) => eLoader.getEmailById(e.emailId.toHexString()))
  )

  return {
    username: mailbox.username,
    mailboxFound: true,
    emailDocs: emailDocs.filter(Boolean),
  }
}

export default function Inbox() {
  const loaderData = useLoaderData<typeof loader>()
  const { revalidate } = useRevalidator()

  useEffect(() => {
    const id = setInterval(revalidate, 5000)
    return () => clearInterval(id)
  }, [revalidate])

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        padding: "2rem",
        gap: "2rem",
      }}
    >
      <aside
        className="glass-panel"
        style={{
          width: "300px",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
          Inbox: {loaderData.username}
        </h2>
        <div style={{ flex: 1 }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            No active folders.
          </p>
        </div>
        <button
          className="btn-primary"
          style={{
            background: "var(--danger)",
            boxShadow: "0 4px 14px rgba(239, 68, 68, 0.3)",
          }}
        >
          Destroy Inbox
        </button>
      </aside>
      <main
        className="glass-panel"
        style={{
          flex: 1,
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!loaderData.mailboxFound ? (
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "1.5rem", color: "var(--danger)" }}>
              Mailbox missing!
            </h3>
            <p>We could not find this inbox in our persistent layer.</p>
          </div>
        ) : loaderData.emailDocs.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                border: "2px dashed var(--glass-border)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <span style={{ fontSize: "2rem", opacity: 0.5 }}>📫</span>
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              Waiting for emails...
            </h3>
            <p style={{ color: "var(--text-muted)" }}>
              Your ephemeral inbox is live and securely listening.
            </p>
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {loaderData.emailDocs.map((doc, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-surface)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <strong style={{ fontSize: "1.1rem" }}>{doc?.subject}</strong>
                  <span
                    style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
                  >
                    {doc?.date ? new Date(doc.date).toLocaleString() : ""}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    marginBottom: "1rem",
                  }}
                >
                  From: {doc?.from?.text || "Unknown"}
                </div>
                <div
                  style={{
                    background: "rgba(0,0,0,0.2)",
                    padding: "1rem",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {doc?.text || "No text content"}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
