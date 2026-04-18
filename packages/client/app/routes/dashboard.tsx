export default function Dashboard() {
  return (
    <div
      style={{
        padding: "3rem",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "800px",
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          User Dashboard
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "3rem" }}>
          API Keys and usage metrics map here.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
          }}
        >
          <div
            style={{
              background: "var(--bg-surface)",
              padding: "2rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Active Mailboxes
            </h3>
            <span
              style={{
                fontSize: "2.5rem",
                fontWeight: 600,
                color: "var(--accent-primary)",
              }}
            >
              0
            </span>
          </div>
          <div
            style={{
              background: "var(--bg-surface)",
              padding: "2rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              API Tokens
            </h3>
            <span
              style={{
                fontSize: "2.5rem",
                fontWeight: 600,
                color: "var(--success)",
              }}
            >
              0
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
