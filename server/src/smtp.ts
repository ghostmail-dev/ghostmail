import "dotenv/config"
import { SMTPServer } from "smtp-server"
import { HeaderValue, simpleParser } from "mailparser"
import { Emails } from "./database/email-collection"
import { Mailboxes } from "./database/mailboxes"
import { ObjectId } from "mongodb"
const logger = console

export const smtpServer = new SMTPServer({
  logger: false,
  authOptional: true,
  disabledCommands: ["AUTH"],
  disableReverseLookup: true,
  maxClients: 5,
  onConnect(session, callback) {
    logger.info("SMTP Connect from " + session.remoteAddress)
    return callback() // Accept the connection
  },
  onMailFrom(address, _session, callback) {
    logger.info("SMTP MAIL FROM: " + address.address)
    return callback()
  },
  onData(stream, _session, callback) {
    logger.info("SMTP DATA start")
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
        logger.error("Error inserting email", error)
        return callback(new Error("Error inserting email"))
      }

      const to = mail.to
      try {
        if (Array.isArray(to)) {
          to.forEach((recipient) => {
            const addresses = recipient.value.map((a) => {
              const nameAndDomain = a.address?.split("@")
              return {
                name: nameAndDomain?.[0],
                domain: nameAndDomain?.[1],
              }
            })
            addresses.forEach(({ name, domain }) => {
              if (name === undefined || domain === undefined) {
                return
              }
              Mailboxes.updateOne(
                { name: name?.toLowerCase() },
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
            })
          })
        } else if (to?.value) {
          const addresses = to.value.map((a) => {
            const nameAndDomain = a.address?.split("@")
            return {
              name: nameAndDomain?.[0],
              domain: nameAndDomain?.[1],
            }
          })
          addresses.forEach(({ name, domain }) => {
            if (name === undefined || domain === undefined) {
              return
            }
            Mailboxes.updateOne(
              { name: name?.toLowerCase() },
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
          })
        }
      } catch (e) {
        logger.error(e)
      }
    })
  },
})
