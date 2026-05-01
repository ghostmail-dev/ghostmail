import "dotenv/config"
import { SMTPServer } from "smtp-server"
import { type HeaderValue, simpleParser } from "mailparser"
import { EmailsMutator, MailboxesLoader } from "@ghostmail/database"
import { readFileSync, existsSync } from "fs"

const keyFile = process.env.KEY_FILE_PATH
const certFile = process.env.CERT_FILE_PATH

const connectionCounts = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_WINDOW = process.env.NODE_ENV === "test" ? 1000 : 60 * 1000 // 1s in test, 1m in prod
const MAX_CONNECTIONS_PER_IP = process.env.NODE_ENV === "test" ? 5 : 50 // Limit to 5 in test, 50 in prod

export const resetRateLimits = () => connectionCounts.clear()

export const smtpServer = new SMTPServer({
  authOptional: true,
  allowInsecureAuth: process.env.NODE_ENV !== "production",
  authMethods: ["LOGIN"],
  disableReverseLookup: true,
  key: keyFile && existsSync(keyFile) ? readFileSync(keyFile) : undefined,
  cert: certFile && existsSync(certFile) ? readFileSync(certFile) : undefined,
  maxClients: 100,
  onConnect(session, callback) {
    const ip = session.remoteAddress
    const now = Date.now()
    const stats = connectionCounts.get(ip) || { count: 0, lastReset: now }

    if (now - stats.lastReset > RATE_LIMIT_WINDOW) {
      stats.count = 1
      stats.lastReset = now
    } else {
      stats.count++
    }

    connectionCounts.set(ip, stats)

    if (stats.count > MAX_CONNECTIONS_PER_IP) {
      console.info(`Rate limit exceeded for IP: ${ip}`)
      return callback(new Error("Too many connections from this IP"))
    }

    return callback()
  },
  onAuth(
    auth: { username?: string; password?: string },
    _session: { id: string; user?: string },
    callback: (err: Error | null, response?: { user: string }) => void,
  ) {
    if (!auth.username || !auth.password) {
      return callback(
        new Error("Invalid authentication: missing username or password"),
      )
    }
    const username = auth.username.toLowerCase()
    const mailboxesLoader = new MailboxesLoader()
    mailboxesLoader
      .getMailboxByName(username)
      .then((result) => {
        if (!result.ok) {
          return callback(new Error("Error finding mailbox"))
        }
        const mailbox = result.value
        if (!mailbox) {
          return callback(
            new Error("Invalid authentication: mailbox not found"),
          )
        }

        if (!auth.username || !auth.password) {
          return callback(new Error("Invalid authentication"))
        }

        const isPasswordValid = mailbox.password === auth.password
        if (!isPasswordValid) {
          return callback(new Error("Invalid authentication"))
        }

        return callback(null, {
          user: username,
        })
      })
      .catch((error) => {
        console.error("Error finding mailbox", error)
        return callback(new Error("Error finding mailbox"))
      })
  },
  onRcptTo(
    address: { address: string },
    { user }: { user?: string },
    callback: (err?: Error | null) => void,
  ) {
    if (user) {
      return callback()
    }

    const mailboxesLoader = new MailboxesLoader()

    mailboxesLoader
      .getMailboxByName(address.address)
      .then((result) => {
        if (!result.ok || !result.value) {
          return callback(new Error("Invalid recipient"))
        }
        return callback()
      })
      .catch((error) => {
        console.error("Error getting mailbox", error)
        return callback(new Error("Error getting mailbox"))
      })
  },
  onData(
    stream: NodeJS.ReadableStream,
    { user }: { user?: string },
    callback: (err?: Error | null) => void,
  ) {
    simpleParser(stream).then(async (mail) => {
      mail.date = mail.date ?? new Date()

      const to = mail.to
      if (!to) {
        return callback()
      }

      if (mail.headers) {
        mail.headers.forEach(function (_value, key) {
          if (key.includes(".")) {
            const newValue = mail.headers.get(key) as HeaderValue
            const newkey = key.replace(/\./g, "_")
            mail.headers.set(newkey, newValue)
            mail.headers.delete(key)
          }
        })
      }

      const mailboxNames: string[] = user ? [user] : []
      if (Array.isArray(to)) {
        for (const address of to) {
          const emails = address.value
          for (const email of emails) {
            if (email.address) mailboxNames.push(email.address)
          }
        }
      } else {
        const emails = to.value
        for (const email of emails) {
          if (email.address) mailboxNames.push(email.address)
        }
      }

      const mailboxIds = new Set<string>()
      const mailboxesLoader = new MailboxesLoader()
      for (const mailboxName of mailboxNames) {
        const result = await mailboxesLoader.getMailboxByName(mailboxName)
        if (result.ok && result.value) {
          mailboxIds.add(result.value._id)
        }
      }

      const mutator = new EmailsMutator()
      const emailResult = await mutator.createEmail(
        mail,
        Array.from(mailboxIds),
      )
      if (!emailResult.ok) {
        console.error("Error inserting email")
        return callback(new Error("Error inserting email"))
      }
      return callback()
    })
  },
})
