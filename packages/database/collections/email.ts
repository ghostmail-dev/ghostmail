import DataLoader from "dataloader"
import { Attachment, HeaderValue, ParsedMail } from "mailparser"
import { MongoCollection } from "../connection"
import { ObjectId } from "mongodb"

interface EmailDocument extends Omit<ParsedMail, "attachments"> {
  _id: ObjectId
  attachments: EmailAttachmentMapper[]
}

const Emails = MongoCollection<EmailDocument>("emails")

export type EmailMapper = EmailDocument

export interface EmailAttachmentMapper extends Omit<Attachment, "headers"> {
  fileName: string
  headers: Record<string, HeaderValue>
}
export class EmailsLoader {
  private batchEmails = new DataLoader<ObjectId, EmailMapper | null>(
    async (ids: readonly ObjectId[]) => {
      const mailboxes = await Emails.find({
        _id: { $in: ids },
      }).toArray()
      return ids.map((id) => {
        return (
          mailboxes.find(
            (mailbox) => mailbox._id.toHexString() === id.toHexString()
          ) ?? null
        )
      })
    }
  )

  private bachEmailsByMessageId = new DataLoader<string, EmailMapper | null>(
    async (messageIds: readonly string[]) => {
      const emails = await Emails.find({
        messageId: { $in: messageIds },
      }).toArray()
      return messageIds.map((messageId) => {
        return emails.find((email) => email.messageId === messageId) ?? null
      })
    }
  )

  async getEmailById(id: ObjectId | string): Promise<EmailMapper | null> {
    const _id = typeof id === "string" ? new ObjectId(id) : id
    return this.batchEmails.load(_id)
  }

  async getEmailByMessageId(messageId: string): Promise<EmailMapper | null> {
    return this.bachEmailsByMessageId.load(messageId)
  }

  async getAllEmails(): Promise<EmailMapper[]> {
    return Emails.find().toArray()
  }
}

export const createEmail = async (
  email: Omit<ParsedMail, "_id">
): Promise<EmailMapper> => {
  const _id = new ObjectId()
  const attachments = email.attachments.map((attachment) => {
    return {
      ...attachment,
      fileName: attachment.filename ?? "",
      headers: Object.fromEntries(attachment.headers),
    }
  })
  await Emails.insertOne({
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
