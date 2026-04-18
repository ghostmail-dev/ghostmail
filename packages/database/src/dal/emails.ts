import DataLoader from "dataloader"
import { ObjectId } from "mongodb"
import { EmailDocument } from "../models/email.js"
import { emailsCollection } from "../collections/email.js"
import { type ParsedMail } from "mailparser"

export class EmailsLoader {
  private batchEmails = new DataLoader<ObjectId, EmailDocument | null>(
    async (keys) => {
      const emails = await emailsCollection
        .find({ _id: { $in: keys as ObjectId[] } })
        .toArray()
      const emailMap = new Map(emails.map((e) => [e._id.toHexString(), e]))
      return keys.map((k) => emailMap.get(k.toHexString()) || null)
    }
  )

  private batchEmailsByMessageId = new DataLoader<string, EmailDocument | null>(
    async (keys) => {
      const emails = await emailsCollection
        .find({ messageId: { $in: keys as string[] } })
        .toArray()
      const emailMap = new Map(emails.map((e) => [e.messageId, e]))
      return keys.map((k) => emailMap.get(k) || null)
    }
  )

  async getEmailById(id: ObjectId | string): Promise<EmailDocument | null> {
    return this.batchEmails.load(typeof id === "string" ? new ObjectId(id) : id)
  }

  async getEmailByMessageId(messageId: string): Promise<EmailDocument | null> {
    return this.batchEmailsByMessageId.load(messageId)
  }
}

export class EmailsMutator {
  async createEmail(email: Omit<ParsedMail, "_id">): Promise<EmailDocument> {
    const _id = new ObjectId()
    const attachments = email.attachments.map((attachment) => {
      return {
        ...attachment,
        fileName: attachment.filename ?? "",
        headers: Object.fromEntries(attachment.headers),
      }
    })
    await emailsCollection.insertOne({
      _id,
      ...email,
      attachments,
    })
    return {
      _id,
      ...email,
      attachments,
    }
  }

  async deleteEmail(id: ObjectId | string): Promise<void> {
    await emailsCollection.deleteOne({
      _id: typeof id === "string" ? new ObjectId(id) : id,
    })
  }
}
