import DataLoader from "dataloader"
import {
  toEmailDetailsDTO,
  type MailboxDocument,
  type SerializableEmailDetails,
  type SerializableMailbox,
  spawnMailbox,
  toMailboxDTO,
} from "../models/mailbox.js"
import { mailboxesCollection } from "../collections/mailbox.js"
import { emailsCollection } from "../collections/email.js"
import type {
  AbstractMailboxesLoader,
  AbstractMailboxesMutator,
} from "../definitions.js"

export class MailboxesLoader implements AbstractMailboxesLoader {
  private async getEmailsForMailboxes(mailboxes: MailboxDocument[]) {
    const emails = await emailsCollection
      .find({ mailboxes: { $in: mailboxes.map((e) => e._id) } })
      .toArray()
    const emailMap = new Map<string, SerializableEmailDetails[]>()
    emails.forEach((email) => {
      for (const mailbox of email.mailboxes) {
        const currentIds = emailMap.get(mailbox) || []
        emailMap.set(mailbox, [...currentIds, toEmailDetailsDTO(email)])
      }
    })
    return emailMap
  }
  private batchMailboxes = new DataLoader<string, SerializableMailbox | null>(
    async (keys) => {
      const mailboxes = await mailboxesCollection
        .find({ username: { $in: keys as string[] } })
        .toArray()
      const emailMap = await this.getEmailsForMailboxes(mailboxes)
      const mailboxMap = new Map(
        mailboxes.map((mailbox) => {
          return [
            mailbox.username,
            toMailboxDTO(mailbox, emailMap.get(mailbox._id) || []),
          ]
        })
      )
      return keys.map((k) => mailboxMap.get(k) || null)
    }
  )

  private batchMailboxesById = new DataLoader<
    string,
    SerializableMailbox | null
  >(async (keys) => {
    const mailboxes = await mailboxesCollection
      .find({ _id: { $in: keys } })
      .toArray()
    const emailMap = await this.getEmailsForMailboxes(mailboxes)

    const mailboxMap = new Map(
      mailboxes.map((e) => [e._id, toMailboxDTO(e, emailMap.get(e._id) || [])])
    )
    return keys.map((k) => mailboxMap.get(k) || null)
  })

  async getMailboxByName(name: string): Promise<SerializableMailbox | null> {
    return this.batchMailboxes.load(name)
  }

  async getMailboxById(id: string): Promise<SerializableMailbox | null> {
    return this.batchMailboxesById.load(id)
  }

  async getMailboxesByOwnerId(ownerId: string): Promise<SerializableMailbox[]> {
    const mailboxes = await mailboxesCollection.find({ ownerId }).toArray()
    const emailMap = await this.getEmailsForMailboxes(mailboxes)
    return mailboxes.map((mailbox) => {
      return toMailboxDTO(mailbox, emailMap.get(mailbox._id) || [])
    })
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

export class MailboxesMutator implements AbstractMailboxesMutator {
  async addEphemeralMailbox(userId: string): Promise<SerializableMailbox> {
    const mailbox = spawnMailbox({ type: "ephemeral", ownerId: userId })
    await mailboxesCollection.insertOne(mailbox)
    return toMailboxDTO(mailbox, [])
  }

  async addPersistentMailbox(userId: string): Promise<SerializableMailbox> {
    const mailbox = spawnMailbox({ type: "persistent", ownerId: userId })
    await mailboxesCollection.insertOne(mailbox)
    return toMailboxDTO(mailbox, [])
  }

  async deleteMailbox(id: string): Promise<void> {
    await mailboxesCollection.deleteOne({ _id: id })
  }
}
