import "dotenv/config"
import { smtpServer } from "./server"

smtpServer.on("error", (error) => {
  console.error("SMTP Server Error:", error)
})

smtpServer.listen(process.env.SMTP_PORT, () => {
  console.info(`📬 SMTP server running on port ${process.env.SMTP_PORT} `)
})
