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
import { MailboxLimitError, UnknownDatabaseError } from "../definitions.js"
import { Err, Ok, tryCatch } from "../result.js"
import { usersCollection } from "../collections/users.js"

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
        }),
      )
      return keys.map((k) => mailboxMap.get(k) || null)
    },
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
      mailboxes.map((e) => [e._id, toMailboxDTO(e, emailMap.get(e._id) || [])]),
    )
    return keys.map((k) => mailboxMap.get(k) || null)
  })

  async getMailboxByName(name: string) {
    return await tryCatch(
      () => this.batchMailboxes.load(name),
      UnknownDatabaseError,
    )
  }

  async getMailboxById(id: string) {
    return await tryCatch(
      () => this.batchMailboxesById.load(id),
      UnknownDatabaseError,
    )
  }

  async getMailboxesByOwnerId(ownerId: string) {
    return await tryCatch(async () => {
      const mailboxes = await mailboxesCollection.find({ ownerId }).toArray()
      const emailMap = await this.getEmailsForMailboxes(mailboxes)
      return mailboxes.map((mailbox) =>
        toMailboxDTO(mailbox, emailMap.get(mailbox._id) || []),
      )
    }, UnknownDatabaseError)
  }

  async validateMailboxCredentials(username: string, password: string) {
    const result = await this.getMailboxByName(username)

    if (!result.ok) return result

    return Ok(result.value != null && result.value.password === password)
  }
}

export class MailboxesMutator implements AbstractMailboxesMutator {
  async addEphemeralMailbox(userId: string) {
    return await tryCatch(async () => {
      const mailbox = spawnMailbox({
        type: "ephemeral",
        ownerId: userId,
      })
      await mailboxesCollection.insertOne(mailbox)
      return toMailboxDTO(mailbox, [])
    }, UnknownDatabaseError)
  }

  async addPersistentMailbox(userId: string) {
    const result = await tryCatch(async () => {
      const existingMailboxesCount = await mailboxesCollection.countDocuments({
        ownerId: userId,
        type: "persistent",
      })
      const user = await usersCollection.findOne({ _id: userId })
      return { existingMailboxesCount, user }
    }, UnknownDatabaseError)

    if (!result.ok) return result
    const { existingMailboxesCount, user } = result.value
    if (!user || user.maxPersistentMailboxes <= existingMailboxesCount) {
      return Err(new MailboxLimitError())
    }

    return await tryCatch(async () => {
      const mailbox = spawnMailbox({
        type: "persistent",
        ownerId: userId,
      })
      await mailboxesCollection.insertOne(mailbox)
      return toMailboxDTO(mailbox, [])
    }, UnknownDatabaseError)
  }

  async deleteMailbox(id: string) {
    return await tryCatch(async () => {
      await mailboxesCollection.deleteOne({ _id: id })
    }, UnknownDatabaseError)
  }
}
