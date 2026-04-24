import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import { faker } from "@faker-js/faker"
import { smtpServer, resetRateLimits } from "../server.js"
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest"

import {
  resetDatabase,
  seedMailbox,
  EmailsLoader,
  MailboxesLoader,
} from "@ghostmail/database"

describe("SMTP Server", () => {
  beforeAll(async () => {
    smtpServer.listen(
      process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 2525,
    )
    resetDatabase()
  })

  afterEach(async () => {
    resetDatabase()
    resetRateLimits()
  })

  afterAll(() => {
    smtpServer.close()
  })

  it("should correctly authenticate a user, store the email, and drop a reference into the users mailbox", async () => {
    // arrange
    const rawPass = "mysecurepassword123"
    const username = `testuser@testmail.dev`

    const mailbox = seedMailbox({ username, password: rawPass })

    const message = makeMessage({ to: mailbox.username, subject: "Test email" })

    // act
    const result = await sendEmail(message, {
      user: username,
      pass: rawPass,
    })
    // assert
    expect(result).not.toBeInstanceOf(String)
    const messageId = (result as SMTPTransport.SentMessageInfo).messageId
    const emailsLoader = new EmailsLoader()
    const email = await emailsLoader.getEmailByMessageId(messageId)
    expect(email).not.toBeNull()

    const mailboxLoader = new MailboxesLoader()
    const mailboxDocument = await mailboxLoader.getMailboxByName(
      mailbox.username,
    )

    expect(mailboxDocument).toBeDefined()
    const emailFound = mailboxDocument?.emails.some((emailDetail) => {
      if (!email) return false
      return emailDetail.emailId === email._id
    })
    expect(emailFound).toBe(true)
  })

  it("should reject an email with an invalid auth", async () => {
    const message = makeMessage({})
    const result = await sendEmail(message, {
      user: "invalid",
      pass: "invalid",
    })

    expect(result).toBe(
      "Invalid login: 535 Invalid authentication: mailbox not found",
    )
  })

  it("should not store an email if no auth used and no mailbox for 'to' exists", async () => {
    const message = makeMessage({
      to: faker.internet.email(),
      subject: "Test email",
    })
    const result = await sendEmail(message)
    expect(result).toBe(
      "Can't send mail - all recipients were rejected: 550 Invalid recipient",
    )
  })

  it("should store an email if no auth use but 'to' is a valid address", async () => {
    process.env.MAIL_DOMAIN = process.env.MAIL_DOMAIN || "ghostmail.localhost"
    const username = `testdest@${process.env.MAIL_DOMAIN}`
    const mailbox = seedMailbox({ username })

    const message = makeMessage({ to: mailbox.username })
    const result = await sendEmail(message)

    expect(result).not.toBeInstanceOf(String)
    const messageId = (result as SMTPTransport.SentMessageInfo).messageId
    const emailsLoader = new EmailsLoader()
    const email = await emailsLoader.getEmailByMessageId(messageId)

    expect(email).not.toBeNull()
    const emailId = email?._id

    const mailboxesLoader = new MailboxesLoader()
    const mailboxDocument = await mailboxesLoader.getMailboxByName(
      mailbox.username,
    )

    expect(mailboxDocument).not.toBeNull()
    expect(mailboxDocument?.emails.length).toBe(1)
    if (emailId) {
      expect(mailboxDocument?.emails[0].emailId).toStrictEqual(emailId)
    }
  })

  it("should rate limit connections from the same IP", async () => {
    const username = "ratelimit@test.dev"
    seedMailbox({ username })
    const message = makeMessage({ to: username })

    // Send 5 successful emails (the limit in test mode)
    for (let i = 0; i < 5; i++) {
      const result = await sendEmail(message)
      expect(result).not.toBeInstanceOf(String)
    }

    // The 6th should fail
    const result = await sendEmail(message)
    expect(typeof result).toBe("string")
    expect(result).toContain("554 Too many connections from this IP")
  })

  it("should reset the rate limit after the window expires", async () => {
    const username = "reset@test.dev"
    seedMailbox({ username })
    const message = makeMessage({ to: username })

    // Hit the limit
    for (let i = 0; i < 5; i++) {
      await sendEmail(message)
    }
    const failedResult = await sendEmail(message)
    expect(typeof failedResult).toBe("string")
    expect(failedResult).toContain("554 Too many connections from this IP")

    // Wait for the window to expire (1.1 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1100))

    // Should work again
    const successResult = await sendEmail(message)
    expect(successResult).not.toBeInstanceOf(String)
  })
})

const sendEmail = async (
  args: Mail.Options,
  withAuth?: { user: string; pass: string },
): Promise<SMTPTransport.SentMessageInfo | string> => {
  const transporter = nodemailer.createTransport({
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 2525,
    secure: false,
    ignoreTLS: true,
    ...(withAuth ? { auth: withAuth } : {}),
    tls: { rejectUnauthorized: false },
  })
  return await transporter
    .sendMail(args)
    .then((info) => info as SMTPTransport.SentMessageInfo)
    .catch((err) => {
      if (err instanceof Error) {
        return err.message
      }
      return "An unknown error occurred"
    })
    .finally(() => {
      transporter.close()
    })
}

const makeMessage = (args: { to?: string; subject?: string }): Mail.Options => {
  return {
    from: faker.internet.email(),
    to: args.to ? [args.to] : [faker.internet.email()],
    subject: args.subject ?? faker.lorem.sentence(),
    text: faker.lorem.paragraph(),
    html:
      `<p><b>Hello</b> to myself <img src="${faker.image.avatar()}"/></p>` +
      `<p><br/><img src="${faker.image.url()}"/></p>`,
    attachments: [
      {
        filename: "special-stuff.txt",
        content: "This email has some special stuff attached.",
      },
      {
        filename: "image.png",
        content: Buffer.from("iVBORw0KGgo==", "base64"),
        cid: "note@example.com",
      },
    ],
  }
}
