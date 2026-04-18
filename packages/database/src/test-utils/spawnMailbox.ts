import { faker } from "@faker-js/faker"
import { ObjectId } from "mongodb"
import { MailboxDocument, EmailDetails } from "../models/mailbox.js"
import { mailboxesCollection } from "../collections/mailbox.js"

export function spawnEmailDetails(
  overrides?: Partial<EmailDetails>
): EmailDetails {
  return {
    emailId: new ObjectId(),
    sender: faker.internet.email(),
    subject: faker.lorem.sentence(),
    date: faker.date.recent(),
    isRead: faker.datatype.boolean(),
    ...overrides,
  }
}

export function spawnMailbox(
  overrides?: Partial<MailboxDocument>
): MailboxDocument {
  return {
    _id: new ObjectId(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.internet.username(),
    password: faker.internet.password(),
    emails: [],
    createdAt: faker.date.past(),
    ...overrides,
  }
}

export async function seedMailbox(
  overrides?: Partial<MailboxDocument>
): Promise<MailboxDocument> {
  const mailbox = spawnMailbox(overrides)
  await mailboxesCollection.insertOne(mailbox)
  return mailbox
}
