import "dotenv/config"
import { SMTPServer } from "smtp-server"
import { HeaderValue, simpleParser } from "mailparser"
import {
  createEmail,
  deliverMail,
  MailboxLoader,
} from "@ghostmail-packages/database"
import { ObjectId } from "mongodb"
import * as bcrypt from "bcrypt"
import { readFileSync } from "fs"

const keyFile = process.env.KEY_FILE_PATH
const certFile = process.env.CERT_FILE_PATH

export const smtpServer = new SMTPServer({
  authOptional: true,
  authMethods: ["LOGIN"],
  disableReverseLookup: true,
  key: readFileSync(keyFile),
  cert: readFileSync(certFile),
  maxClients: 5,
  onAuth(auth, _session, callback) {
    if (!auth.username || !auth.password) {
      return callback(
        new Error("Invalid authentication: missing username or password")
      )
    }
    const username = `${auth.username}@${process.env.MAIL_DOMAIN}`.toLowerCase()
    const mailBoxLoader = new MailboxLoader()
    mailBoxLoader
      .getMailboxByName(username)
      .then((mailbox) => {
        if (!mailbox) {
          return callback(
            new Error("Invalid authentication: mailbox not found")
          )
        }

        // already checked this above, but doing it again for TypeScript
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
  onRcptTo(address, { user }, callback) {
    // we don't want to take in a bunch of spam, so we'll only accept emails for users
    // that have a mailbox in our database or the user that authenticated

    // Case: an authenticated user is sending an email
    if (user) {
      return callback()
    }

    // Case: we are receiving an email for a user that may or may not exist in
    // our database, so we need to check if the mailbox exists and if not, reject the email
    const mailBoxLoader = new MailboxLoader()

    mailBoxLoader
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
  onData(stream, { user }, callback) {
    simpleParser(stream).then(async (mail) => {
      mail.date = new Date()

      const to = mail.to
      if (!to) {
        return callback()
      }

      // can't use dots in mongo keys, so replace them with underscores
      mail.headers.forEach(function (_value, key) {
        if (key.includes(".")) {
          const newValue = mail.headers.get(key) as HeaderValue
          const newkey = key.replace(/\./g, "_")
          mail.headers.set(newkey, newValue)
          mail.headers.delete(key)
        }
      })

      let emailId: ObjectId
      try {
        const email = await createEmail(mail)
        emailId = email._id
      } catch (error) {
        console.error("Error inserting email", error)
        return callback(new Error("Error inserting email"))
      }

      // handle case of a generic smtp server that will route all emails to a single user
      if (user) {
        try {
          await deliverMail({
            username: user,
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
            // already pushed to user's mailbox
            if (username === user) {
              continue
            }
            try {
              await deliverMail({
                username,
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
          // already pushed to user's mailbox
          if (username === user) {
            continue
          }
          try {
            await deliverMail({
              username,
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
