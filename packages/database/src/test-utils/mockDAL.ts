import {
  EmailDocument,
  SerializableEmailDocument,
  spawnEmail,
  toEmailDTO,
} from "../models/email"
import {
  MailboxDocument,
  SerializableEmailDetails,
  SerializableMailbox,
  spawnMailbox,
  toEmailDetailsDTO,
  toMailboxDTO,
} from "../models/mailbox"
import {
  SerializableUserDocument,
  spawnUser,
  toUserDTO,
  UserDocument,
} from "../models/users"
import {
  AbstractEmailsLoader,
  AbstractEmailsMutator,
  AbstractMailboxesLoader,
  AbstractMailboxesMutator,
  AbstractUsersLoader,
  AbstractUsersMutator,
} from "../definitions"
import type { ParsedMail } from "mailparser"
import { hashSync } from "bcryptjs"

/**
 * Stateful in-memory store for client-side tests.
 * Mirrors the real DAL API surface without hitting MongoDB.
 */
const mailboxesStore = new Map<string, SerializableMailbox>()
const mailboxesById = new Map<string, SerializableMailbox>()
const emailsStore = new Map<string, SerializableEmailDocument>()
const usersStore = new Map<string, SerializableUserDocument>()

export function resetDatabase() {
  mailboxesStore.clear()
  mailboxesById.clear()
  emailsStore.clear()
  usersStore.clear()
}

export function seedUser(
  overrides?: Partial<UserDocument>,
): SerializableUserDocument {
  const user = toUserDTO(spawnUser(overrides))
  usersStore.set(user.username, user)
  return user
}

export function seedMailbox(
  overrides?: Partial<MailboxDocument>,
  emails: SerializableEmailDetails[] = [],
): SerializableMailbox {
  const doc = toMailboxDTO(spawnMailbox(overrides), emails)
  mailboxesStore.set(doc.username, doc)
  mailboxesById.set(doc._id, doc)
  return doc
}

export function seedEmail(
  overrides?: Partial<EmailDocument>,
): SerializableEmailDocument {
  const doc = toEmailDTO({
    ...spawnEmail(),
    ...overrides,
  } as EmailDocument)
  emailsStore.set(doc._id, doc)
  return doc
}

export class MailboxesLoader implements AbstractMailboxesLoader {
  private static getEmailsForMailbox(mailboxId: string) {
    return [...emailsStore.values()].filter((email) => {
      return email.mailboxes.includes(mailboxId)
    })
  }

  async getMailboxByName(name: string) {
    const mailbox = mailboxesStore.get(name)
    if (mailbox) {
      const emails = MailboxesLoader.getEmailsForMailbox(mailbox._id)
      return { ...mailbox, emails: emails.map(toEmailDetailsDTO) }
    }
    return null
  }

  async getMailboxById(id: string) {
    const mailbox = mailboxesById.get(id)
    if (mailbox) {
      const emails = MailboxesLoader.getEmailsForMailbox(mailbox._id)
      return { ...mailbox, emails: emails.map(toEmailDetailsDTO) }
    }
    return null
  }

  async getMailboxesByOwnerId(ownerId: string) {
    const ownerStr = ownerId
    const mailboxes = [...mailboxesById.values()].filter(
      (m) => m.ownerId === ownerStr,
    )
    return mailboxes.map((mailbox) => {
      const emails = MailboxesLoader.getEmailsForMailbox(mailbox._id)
      return { ...mailbox, emails: emails.map(toEmailDetailsDTO) }
    })
  }

  async validateMailboxCredentials(username: string, password: string) {
    const mailbox = mailboxesStore.get(username)
    return mailbox ? mailbox.password === password : false
  }
}

export class MailboxesMutator implements AbstractMailboxesMutator {
  async addEphemeralMailbox(userId: string) {
    return seedMailbox({ type: "ephemeral", ownerId: userId })
  }

  async addPersistentMailbox(userId: string) {
    return seedMailbox({ type: "persistent", ownerId: userId })
  }

  async deleteMailbox(id: string) {
    const doc = mailboxesById.get(id)
    if (doc) {
      mailboxesStore.delete(doc.username)
      mailboxesById.delete(id)
    }
  }
}

export class EmailsLoader implements AbstractEmailsLoader {
  async getEmailById(id: string) {
    return emailsStore.get(id) ?? null
  }

  async getEmailByMessageId(messageId: string) {
    for (const email of emailsStore.values()) {
      if (email.messageId === messageId) return email
    }
    return null
  }
}

export class EmailsMutator implements AbstractEmailsMutator {
  async createEmail(emailData: Omit<ParsedMail, "_id">, mailboxIds: string[]) {
    const attachments = emailData.attachments.map((attachment) => {
      return {
        ...attachment,
        fileName: attachment.filename ?? "",
        headers: Object.fromEntries(attachment.headers),
      }
    })
    const doc = seedEmail({
      ...emailData,
      attachments,
      mailboxes: mailboxIds,
      isRead: false,
    })

    emailsStore.set(doc._id, doc)
    return doc
  }

  async deleteEmail(id: string) {
    emailsStore.delete(id)
  }

  async markAsRead(id: string) {
    const email = emailsStore.get(id)
    if (email) {
      const updated = { ...email, isRead: true }
      emailsStore.set(id, updated)
    }
  }
}

export class UsersLoader implements AbstractUsersLoader {
  async getUserById(id: string) {
    for (const user of usersStore.values()) {
      if (user._id === id) return user
    }
    return null
  }

  async getUserByName(username: string) {
    return usersStore.get(username) ?? null
  }
}

export class UsersMutator implements AbstractUsersMutator {
  async createUser(username: string, password: string) {
    return seedUser({ username, password: hashSync(password, 10) })
  }

  async changePersistentMailboxLimit(
    userId: string,
    newLimit: number,
  ): Promise<void> {
    for (const user of usersStore.values()) {
      if (user._id === userId) {
        const updated = { ...user, maxPersistentMailboxes: newLimit }
        usersStore.set(user.username, updated)
        break
      }
    }
  }

  async deleteUser(id: string) {
    for (const user of usersStore.values()) {
      if (user._id === id) {
        usersStore.delete(user.username)
        break
      }
    }
  }
}
