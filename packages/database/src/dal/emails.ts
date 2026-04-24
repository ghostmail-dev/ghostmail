import DataLoader from "dataloader"
import {
  type EmailDocument,
  type SerializableEmailDocument,
  toEmailDTO,
} from "../models/email.js"
import { emailsCollection } from "../collections/email.js"
import type { ParsedMail } from "mailparser"
import type { AbstractEmailsMutator } from "../definitions.js"
import { faker } from "@faker-js/faker"

export class EmailsLoader {
  private batchEmails = new DataLoader<string, EmailDocument | null>(
    async (keys) => {
      const emails = await emailsCollection
        .find({ _id: { $in: keys } })
        .toArray()
      const emailMap = new Map(emails.map((e) => [e._id, e]))
      return keys.map((k) => emailMap.get(k) || null)
    },
  )

  private batchEmailsByMessageId = new DataLoader<string, EmailDocument | null>(
    async (keys) => {
      const emails = await emailsCollection
        .find({ messageId: { $in: keys as string[] } })
        .toArray()
      const emailMap = new Map(emails.map((e) => [e.messageId, e]))
      return keys.map((k) => emailMap.get(k) || null)
    },
  )

  async getEmailById(id: string): Promise<SerializableEmailDocument | null> {
    const email = await this.batchEmails.load(id)
    return email ? toEmailDTO(email) : null
  }

  async getEmailByMessageId(
    messageId: string,
  ): Promise<SerializableEmailDocument | null> {
    const email = await this.batchEmailsByMessageId.load(messageId)
    return email ? toEmailDTO(email) : null
  }
}

export class EmailsMutator implements AbstractEmailsMutator {
  async createEmail(
    email: Omit<ParsedMail, "_id">,
    mailboxIds: string[],
  ): Promise<SerializableEmailDocument> {
    const attachments = email.attachments.map((attachment) => {
      return {
        ...attachment,
        fileName: attachment.filename ?? "",
        headers: Object.fromEntries(attachment.headers),
      }
    })
    const emailDoc = {
      ...email,
      attachments,
      mailboxes: mailboxIds,
      isRead: false,
      _id: faker.database.mongodbObjectId(),
    }

    await emailsCollection.insertOne(emailDoc)
    return toEmailDTO(emailDoc)
  }

  async markAsRead(id: string): Promise<void> {
    await emailsCollection.updateOne({ _id: id }, { $set: { isRead: true } })
  }

  async deleteEmail(id: string): Promise<void> {
    await emailsCollection.deleteOne({
      _id: id,
    })
  }
}
