import "dotenv/config"
import { SMTPServer } from "smtp-server"
import { HeaderValue, simpleParser } from "mailparser"
import {
  EmailsMutator,
  MailboxesLoader,
  MailboxesMutator,
} from "@ghostmail/database"
import { ObjectId } from "mongodb"
import * as bcrypt from "bcrypt"
import { readFileSync, existsSync } from "fs"

const keyFile = process.env.KEY_FILE_PATH
const certFile = process.env.CERT_FILE_PATH

export const smtpServer = new SMTPServer({
  authOptional: true,
  allowInsecureAuth: process.env.NODE_ENV !== "production",
  authMethods: ["LOGIN"],
  disableReverseLookup: true,
  key: keyFile && existsSync(keyFile) ? readFileSync(keyFile) : undefined,
  cert: certFile && existsSync(certFile) ? readFileSync(certFile) : undefined,
  maxClients: 5,
  onAuth(
    auth: { username?: string; password?: string },
    _session: { id: string; user?: string },
    callback: (err: Error | null, response?: { user: string }) => void
  ) {
    if (!auth.username || !auth.password) {
      return callback(
        new Error("Invalid authentication: missing username or password")
      )
    }
    const username =
      `${auth.username}@${process.env.MAIL_DOMAIN || "ghostmail.localhost"}`.toLowerCase()
    const mailboxesLoader = new MailboxesLoader()
    mailboxesLoader
      .getMailboxByName(username)
      .then((mailbox) => {
        if (!mailbox) {
          return callback(
            new Error("Invalid authentication: mailbox not found")
          )
        }

        if (!auth.username || !auth.password) {
          return callback(new Error("Invalid authentication"))
        }

        bcrypt
          .compare(auth.password, mailbox.password)
          .then((isPasswordValid) => {
            if (!isPasswordValid) {
              return callback(new Error("Invalid authentication"))
            }

            return callback(null, {
              user: username,
            })
          })
          .catch((error) => {
            console.error("Error comparing passwords", error)
            return callback(new Error("Error comparing passwords"))
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
    callback: (err?: Error | null) => void
  ) {
    if (user) {
      return callback()
    }

    const mailboxesLoader = new MailboxesLoader()

    mailboxesLoader
      .getMailboxByName(address.address)
      .then((mailbox) => {
        if (!mailbox) {
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
    callback: (err?: Error | null) => void
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

      let emailId: ObjectId
      try {
        // Use proper DAL
        const mutator = new EmailsMutator()
        const email = await mutator.createEmail(mail)
        emailId = email._id
      } catch (error) {
        console.error("Error inserting email", error)
        return callback(new Error("Error inserting email"))
      }

      const mutator = new MailboxesMutator()

      if (user) {
        try {
          await mutator.deliverMail({
            username: user as string,
            emailId: emailId,
            sender: mail.from?.value[0].address ?? null,
            subject: mail.subject ?? null,
            date: mail.date ?? new Date(),
            isRead: false,
          })
        } catch (e) {
          console.error(e)
        }
      }

      if (Array.isArray(to)) {
        for (const address of to) {
          const emails = address.value
          for (const email of emails) {
            const username = email.address
            if (username === user) {
              continue
            }
            try {
              await mutator.deliverMail({
                username: username as string,
                emailId: emailId,
                sender: mail.from?.value[0].address ?? null,
                subject: mail.subject ?? null,
                date: mail.date ?? new Date(),
                isRead: false,
              })
            } catch (e) {
              console.error(e)
            }
          }
        }
      } else {
        const emailAddresses = to.value
        for (const address of emailAddresses) {
          const username = address.address
          if (username === user) {
            continue
          }
          try {
            await mutator.deliverMail({
              username: username as string,
              emailId: emailId,
              sender: mail.from?.value[0].address ?? null,
              subject: mail.subject ?? null,
              date: mail.date ?? new Date(),
              isRead: false,
            })
          } catch (e) {
            console.error(e)
          }
        }
      }
      return callback()
    })
  },
})
