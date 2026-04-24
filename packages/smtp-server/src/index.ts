import "dotenv/config"
import { syncIndexes } from "@ghostmail/database"
import { smtpServer } from "./server"

smtpServer.on("error", (error) => {
  console.error("SMTP Server Error:", error)
})

await syncIndexes()

smtpServer.listen(process.env.SMTP_PORT, () => {
  console.info(`📬 SMTP server running on port ${process.env.SMTP_PORT} `)
})
