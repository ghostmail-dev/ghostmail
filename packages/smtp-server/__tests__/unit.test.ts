import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import {
  EmailsLoader,
  MailboxLoader,
  createMailbox,
  DBTestUtils,
  mongoClient,
} from "@ghostmail-packages/database"
import { faker } from "@faker-js/faker"
import { smtpServer } from "../server"

describe("SMTP Server", () => {
  beforeAll(async () => {
    smtpServer.listen(process.env.SMTP_PORT)
    await DBTestUtils.resetDatabase()
  })
  afterEach(async () => {
    await DBTestUtils.resetDatabase()
  })

  afterAll(async () => {
    smtpServer.close()
    await mongoClient.close()
  })

  it("should correctly authenticate a user, store the email, and drop a reference into the users mailbox", async () => {
    // arrange
    const mailbox = await createMailbox()
    const message = makeMessage({ to: mailbox.username, subject: "Test email" })

    // act
    const result = await sendEmail(message, {
      user: mailbox.username.split("@")[0],
      pass: mailbox.password,
    })

    // assert
    expect(result).not.toBeInstanceOf(String)
    const messageId = (result as SMTPTransport.SentMessageInfo).messageId
    const emailsLoader = new EmailsLoader()
    const email = await emailsLoader.getEmailByMessageId(messageId)
    expect(email).not.toBeNull()

    const mailboxLoader = new MailboxLoader()
    const mailboxDocument = await mailboxLoader.getMailboxByName(
      mailbox.username
    )
    const emailFound = mailboxDocument?.emails.some((emailDetail) => {
      return emailDetail.emailId.equals(email?._id)
    })
    expect(emailFound).toBe(true)
  })

  it("should reject an email with an invalid auth", async () => {
    // arrange
    const message = makeMessage({})
    // act
    const result = await sendEmail(message, {
      user: "invalid",
      pass: "invalid",
    })

    // assert
    expect(result).toBe(
      "Invalid login: 535 Invalid authentication: mailbox not found"
    )
  })

  it("should not store an email if no auth used and no mailbox for 'to' exists", async () => {
    // arrange
    const emailsLoader = new EmailsLoader()
    const message = makeMessage({
      to: faker.internet.email(),
      subject: "Test email",
    })
    // act
    const result = await sendEmail(message)
    // assert
    expect(result).toBe(
      "Can't send mail - all recipients were rejected: 550 Invalid recipient"
    )
    const emails = await emailsLoader.getAllEmails()
    expect(emails.length).toBe(0)
  })

  it("should store an email if no auth use but 'to' is a valid address", async () => {
    // arrange
    const emailsLoader = new EmailsLoader()
    const mailboxesLoader = new MailboxLoader()
    const mailbox = await createMailbox()
    const message = makeMessage({ to: mailbox.username })
    // act
    const result = await sendEmail(message)

    // assert
    expect(result).not.toBeInstanceOf(String)
    const messageId = (result as SMTPTransport.SentMessageInfo).messageId
    const email = await emailsLoader.getEmailByMessageId(messageId)
    expect(email).not.toBeNull()
    const emailId = email?._id
    expect(emailId).not.toBeNull()
    const mailboxDocument = await mailboxesLoader.getMailboxByName(
      mailbox.username
    )
    expect(mailboxDocument).not.toBeNull()
    expect(mailboxDocument?.emails.length).toBe(1)
    expect(mailboxDocument?.emails[0].emailId).toStrictEqual(emailId)
  })
})

const sendEmail = async (
  args: Mail.Options,
  withAuth?: {
    user: string
    pass: string
  }
): Promise<SMTPTransport.SentMessageInfo | string> => {
  // Create a SMTP transporter object
  const transporter = nodemailer.createTransport({
    port: process.env.SMTP_PORT ?? 587,
    secure: false,
    ...(withAuth ? { auth: withAuth } : {}),
    // useful because in testing we have a self-signed certificate
    // @ts-expect-error, i don't know why this is not working
    tls: {
      rejectUnauthorized: false,
    },
  })
  return await transporter
    .sendMail(args)
    .then((info) => info)
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
      `<p><br/><img src="${faker.image.urlLoremFlickr()}"/></p>`,

    // An array of attachments
    attachments: [
      // String attachment
      {
        filename: "special-stuff.txt",
        content: "This email has some special stuff attached.",
      },

      // Binary Buffer attachment
      {
        filename: "image.png",
        content: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/" +
            "//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U" +
            "g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC",
          "base64"
        ),

        cid: "note@example.com",
      },
    ],
  }
}
