import "dotenv/config"
import { SMTPServer } from "smtp-server"
import { HeaderValue, simpleParser } from "mailparser"
import { Emails, Mailboxes } from "@ghostmail-packages/database"
import { ObjectId } from "mongodb"
import * as bcrypt from "bcrypt"
import { readFileSync } from "fs"

const isProduction = process.env.NODE_ENV === "production"
const keyFile = isProduction
  ? "./.certs/_.ghostmail.dev.key"
  : "./sample.certs/localhost.key"
const certFile = isProduction
  ? "./.certs/_.ghostmail.dev.crt"
  : "./sample.certs/localhost.crt"

const smtpServer = new SMTPServer({
  logger: true,
  authOptional: true,
  authMethods: ["LOGIN"],
  disableReverseLookup: true,
  key: readFileSync(keyFile),
  cert: readFileSync(certFile),
  maxClients: 5,
  onAuth(auth, _session, callback) {
    console.info("SMTP Auth:", auth)
    if (!auth.username || !auth.password) {
      return callback(
        new Error("Invalid authentication: missing username or password")
      )
    }
    const username = `${auth.username}@${process.env.MAIL_DOMAIN}`.toLowerCase()
    Mailboxes.findOne({ username })
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
  onConnect(session, callback) {
    console.info("SMTP Connect from " + session.remoteAddress)
    return callback() // Accept the connection
  },
  onMailFrom(address, _session, callback) {
    console.info("SMTP MAIL FROM: " + address.address)
    return callback()
  },
  onData(stream, { user }, callback) {
    console.info("SMTP DATA start")
    simpleParser(stream).then(async (mail) => {
      mail.date = new Date()

      // can't use dots in mongo keys, so replace them with underscores
      mail.headers.forEach(function (_value, key) {
        if (key.includes(".")) {
          const newValue = mail.headers.get(key) as HeaderValue
          const newkey = key.replace(/\./g, "_")
          mail.headers.set(newkey, newValue)
          mail.headers.delete(key)
        }
      })

      let emailId = new ObjectId()
      try {
        await Emails.insertOne({
          _id: emailId,
          ...mail,
        })
      } catch (error) {
        console.error("Error inserting email", error)
        return callback(new Error("Error inserting email"))
      }

      if (user) {
        try {
          await Mailboxes.updateOne(
            { username: user },
            {
              $push: {
                emails: {
                  emailId: emailId,
                  sender: mail.from?.value[0].address ?? null,
                  subject: mail.subject ?? null,
                  date: mail.date ?? new Date(),
                  isRead: false,
                },
              },
            },
            { upsert: true }
          )
        } catch (e) {
          console.error(e)
        }
      }
      const to = mail.to
      if (!to) {
        return
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
              await Mailboxes.updateOne(
                { username },
                {
                  $push: {
                    emails: {
                      emailId: emailId,
                      sender: mail.from?.value[0].address ?? null,
                      subject: mail.subject ?? null,
                      date: mail.date ?? new Date(),
                      isRead: false,
                    },
                  },
                }
              )
            } catch (e) {
              console.error(e)
            }
          }
        }
      } else {
        const emails = to.value
        for (const email of emails) {
          const username = email.address
          // already pushed to user's mailbox
          if (username === user) {
            continue
          }
          try {
            await Mailboxes.updateOne(
              { username },
              {
                $push: {
                  emails: {
                    emailId: emailId,
                    sender: mail.from?.value[0].address ?? null,
                    subject: mail.subject ?? null,
                    date: mail.date ?? new Date(),
                    isRead: false,
                  },
                },
              }
            )
          } catch (e) {
            console.error(e)
          }
        }
      }
      console.info("SMTP DATA end")
      return callback()
    })
  },
})

smtpServer.on("error", (error) => {
  console.error("SMTP Server Error:", error)
})

smtpServer.listen(process.env.SMTP_PORT, () => {
  console.info(`📬 SMTP server running on port ${process.env.SMTP_PORT} `)
})
