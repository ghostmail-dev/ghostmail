import { ObjectId } from "mongodb"
import { MongoCollection } from "../connection"
import * as bcrypt from "bcrypt"

/** A simple collection that keeps track of all the email accounts */
type MailboxDocument = {
  _id: ObjectId
  /** The firstname, generated from faker */
  firstName: string
  /** The last name, generated from faker */
  lastName: string
  /** email address: normalized first.last@domain */
  username: string
  /** password */
  password: string
  /** The emails in the mailbox */
  emails: {
    emailId: ObjectId
    sender: string | null
    subject: string | null
    date: Date
    isRead: boolean
  }[]
}

const Mailboxes = MongoCollection<MailboxDocument>("mailboxes")

import DataLoader from "dataloader"
import { faker } from "@faker-js/faker"

export type MailboxMapper = MailboxDocument
export class MailboxLoader {
  private batchMailboxes = new DataLoader<string, MailboxMapper | null>(
    async (usernames) => {
      const mailboxes = await Mailboxes.find({
        username: { $in: usernames },
      }).toArray()

      return usernames.map((username) => {
        return (
          mailboxes.find((mailbox) => mailbox.username === username) ?? null
        )
      })
    }
  )

  async getMailboxByName(name: string): Promise<MailboxMapper | null> {
    return this.batchMailboxes.load(name)
  }

  async validateMailboxCredentials(
    username: string,
    password: string
  ): Promise<boolean> {
    const mailbox = await this.getMailboxByName(username)
    if (!mailbox) {
      return false
    }
    const isPasswordValid = await bcrypt.compare(password, mailbox.password)
    if (!isPasswordValid) {
      return false
    }

    return true
  }
}

export const createMailbox = async () => {
  const password = faker.internet.password()

  // generate a password hash
  const passwordHash = await bcrypt.hash(password, 10)
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  function normalizeName(name: string) {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\W_]+/, "")
      .toLowerCase()
  }
  const username = `${normalizeName(firstName)}.${normalizeName(lastName)}@${
    process.env.MAIL_DOMAIN
  }`

  const result = await Mailboxes.insertOne({
    _id: new ObjectId(),
    firstName,
    lastName,
    username,
    password: passwordHash,
    emails: [],
  })

  return {
    _id: result.insertedId,
    name: `${firstName} ${lastName}`,
    username,
    password,
  }
}

export const readMail = async (
  /** The hex of the mail Object Id */
  mailId: string,
  /** The username of the mailbox */
  username: string
) => {
  await Mailboxes.updateOne(
    {
      username,
    },
    [
      {
        $set: {
          emails: {
            $map: {
              input: "$emails",
              as: "email",
              in: {
                $cond: [
                  {
                    $eq: ["$$email.emailId", new ObjectId(mailId)],
                  },
                  {
                    $mergeObjects: [
                      "$$email",
                      {
                        isRead: true,
                      },
                    ],
                  },
                  "$$email",
                ],
              },
            },
          },
        },
      },
    ]
  )
}
