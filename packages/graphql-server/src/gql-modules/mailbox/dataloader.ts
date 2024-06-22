import DataLoader from "dataloader"
import { MailboxMapper } from "./domain.mappers"
import { Mailboxes } from "../../../../database/collections/mailboxes"

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
}
