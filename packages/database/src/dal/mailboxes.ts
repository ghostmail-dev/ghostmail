import DataLoader from "dataloader"
import { ObjectId } from "mongodb"
import { MailboxDocument, EmailDetails } from "../models/mailbox.js"
import { mailboxesCollection } from "../collections/mailbox.js"
import { faker } from "@faker-js/faker"

export class MailboxesLoader {
  private batchMailboxes = new DataLoader<string, MailboxDocument | null>(
    async (keys) => {
      const mailboxes = await mailboxesCollection
        .find({ username: { $in: keys as string[] } })
        .toArray()
      const mailboxMap = new Map(mailboxes.map((e) => [e.username, e]))
      return keys.map((k) => mailboxMap.get(k) || null)
    }
  )

  async getMailboxByName(name: string): Promise<MailboxDocument | null> {
    return this.batchMailboxes.load(name)
  }

  async validateMailboxCredentials(
    username: string,
    password: string
  ): Promise<boolean> {
    const mailbox = await this.getMailboxByName(username)
    if (!mailbox) return false
    return mailbox.password === password
  }
}

export class MailboxesMutator {
  async createMailbox(
    overrides?: Partial<MailboxDocument>
  ): Promise<MailboxDocument> {
    const doc: MailboxDocument = {
      _id: new ObjectId(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.username(),
      password: faker.internet.password(),
      emails: [],
      createdAt: new Date(),
      ...overrides,
    }
    await mailboxesCollection.insertOne(doc)
    return doc
  }

  async deleteMailbox(id: ObjectId | string): Promise<void> {
    await mailboxesCollection.deleteOne({
      _id: typeof id === "string" ? new ObjectId(id) : id,
    })
  }

  async deliverMail(args: EmailDetails & { username: string }): Promise<void> {
    const { username, ...emailDetails } = args
    await mailboxesCollection.updateOne(
      { username },
      { $push: { emails: emailDetails } }
    )
  }

  async readMail(emailId: string, username: string): Promise<void> {
    await mailboxesCollection.updateOne(
      { username, "emails.emailId": new ObjectId(emailId) },
      { $set: { "emails.$.isRead": true } }
    )
  }
}
