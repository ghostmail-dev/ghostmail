import DataLoader from "dataloader"
import { Attachment, ParsedMail } from "mailparser"
import { MongoCollection } from "../connection"
import { ObjectId } from "mongodb"

interface EmailDocument extends Omit<ParsedMail, "attachments"> {
  _id: ObjectId
  attachments: EmailAttachmentMapper[]
}

const Emails = MongoCollection<EmailDocument>("emails")

export type EmailMapper = EmailDocument

export interface EmailAttachmentMapper extends Omit<Attachment, "headers"> {
  filename: string
  headers: Record<string, string>
}
export class EmailsLoader {
  private batchEmails = new DataLoader<ObjectId, EmailMapper | null>(
    async (ids: ObjectId[]) => {
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

  async getEmailById(id: ObjectId | string): Promise<EmailMapper | null> {
    const _id = typeof id === "string" ? new ObjectId(id) : id
    return this.batchEmails.load(_id)
  }
}
