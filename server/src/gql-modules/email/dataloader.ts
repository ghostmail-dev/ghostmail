import DataLoader from "dataloader"
import { EmailMapper } from "./domain.mappers"
import { Emails } from "../../database/email-collection"
import { ObjectId } from "mongodb"

export class EmailsLoader {
  private batchEmails = new DataLoader<ObjectId, EmailMapper | null>(
    async (ids: ObjectId[]) => {
      console.log("Batching emails", ids)
      const mailboxes = await Emails.find({
        _id: { $in: ids },
      }).toArray()
      console.log("Batched emails", mailboxes)
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
