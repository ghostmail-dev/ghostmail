import "dotenv/config"
import { SMTPServer } from "smtp-server"
import { HeaderValue, simpleParser } from "mailparser"
import { Emails } from "./database/email-collection"
import { Mailboxes } from "./database/mailboxes"
import { ObjectId } from "mongodb"
import bcrypt from "bcrypt"

export const smtpServer = new SMTPServer({
  logger: false,
  authOptional: true,
  disableReverseLookup: true,
  maxClients: 5,
  onAuth(auth, _session, callback) {
    console.info("SMTP Auth:", auth)
    if (!auth.username || !auth.password) {
      return callback(new Error("Invalid authentication"))
    }
    const username = `${auth.username}@${process.env.MAIL_DOMAIN}`.toLowerCase()
    Mailboxes.findOne({ username }).then((mailbox) => {
      if (!mailbox) {
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
          Mailboxes.updateOne(
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
              Mailboxes.updateOne(
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
            Mailboxes.updateOne(
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
    })
  },
})
