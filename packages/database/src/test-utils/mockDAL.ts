import {
  type EmailDocument,
  type SerializableEmailDocument,
  spawnEmail,
  toEmailDTO,
} from "../models/email"
import {
  type MailboxDocument,
  type SerializableEmailDetails,
  type SerializableMailbox,
  spawnMailbox,
  toEmailDetailsDTO,
  toMailboxDTO,
} from "../models/mailbox"
import {
  type SerializableUserDocument,
  spawnUser,
  toUserDTO,
  type UserDocument,
} from "../models/users"
import {
  AbstractEmailsLoader,
  AbstractEmailsMutator,
  AbstractInvitesLoader,
  AbstractInvitesMutator,
  AbstractMailboxesLoader,
  AbstractMailboxesMutator,
  AbstractUsersLoader,
  AbstractUsersMutator,
  MailboxLimitError,
} from "../definitions"
import { Ok, Err } from "../result"
import type { ParsedMail } from "mailparser"
import { hashSync } from "bcryptjs"
import {
  type InviteDocument,
  type SerializableInviteDocument,
  spawnInvite,
  toInviteDTO,
} from "../models/invites"

/**
 * Stateful in-memory store for client-side tests.
 * Mirrors the real DAL API surface without hitting MongoDB.
 */
const mailboxesStore = new Map<string, SerializableMailbox>()
const mailboxesById = new Map<string, SerializableMailbox>()
const emailsStore = new Map<string, SerializableEmailDocument>()
const usersStore = new Map<string, SerializableUserDocument>()
const invitesStore = new Map<string, SerializableInviteDocument>()

export function resetDatabase() {
  mailboxesStore.clear()
  mailboxesById.clear()
  emailsStore.clear()
  usersStore.clear()
  invitesStore.clear()
}

export { spawnEmail, spawnMailbox, spawnUser, spawnInvite }

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

export function seedInvite(overrides?: Partial<InviteDocument>) {
  const doc = toInviteDTO(spawnInvite(overrides))
  invitesStore.set(doc.code, doc)
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
      return Ok({ ...mailbox, emails: emails.map(toEmailDetailsDTO) })
    }
    return Ok(null)
  }

  async getMailboxById(id: string) {
    const mailbox = mailboxesById.get(id)
    if (mailbox) {
      const emails = MailboxesLoader.getEmailsForMailbox(mailbox._id)
      return Ok({ ...mailbox, emails: emails.map(toEmailDetailsDTO) })
    }
    return Ok(null)
  }

  async getMailboxesByOwnerId(ownerId: string) {
    const ownerStr = ownerId
    const mailboxes = [...mailboxesById.values()].filter(
      (m) => m.ownerId === ownerStr,
    )
    return Ok(
      mailboxes.map((mailbox) => {
        const emails = MailboxesLoader.getEmailsForMailbox(mailbox._id)
        return { ...mailbox, emails: emails.map(toEmailDetailsDTO) }
      }),
    )
  }

  async validateMailboxCredentials(username: string, password: string) {
    const mailbox = mailboxesStore.get(username)
    return Ok(mailbox ? mailbox.password === password : false)
  }
}

export class MailboxesMutator implements AbstractMailboxesMutator {
  async addEphemeralMailbox(userId: string) {
    return Ok(seedMailbox({ type: "ephemeral", ownerId: userId }))
  }

  async addPersistentMailbox(userId: string) {
    const existingMailboxesCount = [...mailboxesById.values()].filter(
      (m) => m.ownerId === userId && m.type === "persistent",
    ).length
    const user = [...usersStore.values()].find((u) => u._id === userId)
    if (!user || user.maxPersistentMailboxes <= existingMailboxesCount) {
      return Err(new MailboxLimitError())
    }
    return Ok(seedMailbox({ type: "persistent", ownerId: userId }))
  }

  async deleteMailbox(id: string) {
    const doc = mailboxesById.get(id)
    if (doc) {
      mailboxesStore.delete(doc.username)
      mailboxesById.delete(id)
    }
    return Ok(undefined)
  }
}

export class EmailsLoader implements AbstractEmailsLoader {
  async getEmailById(id: string) {
    return Ok(emailsStore.get(id) ?? null)
  }

  async getEmailByMessageId(messageId: string) {
    for (const email of emailsStore.values()) {
      if (email.messageId === messageId) return Ok(email)
    }
    return Ok(null)
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
    return Ok(doc)
  }

  async deleteEmail(id: string) {
    emailsStore.delete(id)
    return Ok(undefined)
  }

  async markAsRead(id: string) {
    const email = emailsStore.get(id)
    if (email) {
      const updated = { ...email, isRead: true }
      emailsStore.set(id, updated)
    }
    return Ok(undefined)
  }
}

export class UsersLoader implements AbstractUsersLoader {
  async getUserById(id: string) {
    for (const user of usersStore.values()) {
      if (user._id === id) return Ok(user)
    }
    return Ok(null)
  }

  async getUserByName(username: string) {
    return Ok(usersStore.get(username) ?? null)
  }
}

export class UsersMutator implements AbstractUsersMutator {
  async createUser(username: string, password: string, inviteCode: string) {
    const invite = invitesStore.get(inviteCode)
    if (invite) {
      invite.status = "used"
      invite.usedBy = username
      invite.usedAt = new Date().toJSON()
      invitesStore.set(inviteCode, invite)
    }

    return Ok(seedUser({ username, password: hashSync(password, 10) }))
  }

  async changePersistentMailboxLimit(userId: string, newLimit: number) {
    for (const user of usersStore.values()) {
      if (user._id === userId) {
        const updated = { ...user, maxPersistentMailboxes: newLimit }
        usersStore.set(user.username, updated)
        break
      }
    }
    return Ok(undefined)
  }

  async deleteUser(id: string) {
    for (const user of usersStore.values()) {
      if (user._id === id) {
        usersStore.delete(user.username)
        break
      }
    }
    return Ok(undefined)
  }

  async changeUserRoles(userId: string, newRoles: ("admin" | "user")[]) {
    for (const user of usersStore.values()) {
      if (user._id === userId) {
        const updated = { ...user, roles: newRoles }
        usersStore.set(user.username, updated)
        break
      }
    }
    return Ok(undefined)
  }

  async changeUserPassword(userId: string, newPassword: string) {
    for (const user of usersStore.values()) {
      if (user._id === userId) {
        const updated = { ...user, password: hashSync(newPassword, 10) }
        usersStore.set(user.username, updated)
        break
      }
    }
    return Ok(undefined)
  }
}

export class InvitesLoader implements AbstractInvitesLoader {
  async getInvitesByUsername(username: string) {
    const invites = [...invitesStore.values()].filter(
      (invite) => invite.invitedBy === username,
    )
    return Ok(invites)
  }

  async validateInvite(code: string) {
    return Ok(!!invitesStore.get(code))
  }
}

export class InvitesMutator implements AbstractInvitesMutator {
  async createInvite(
    invitedBy: string,
    persistentTokens: number,
    expiresAt?: Date,
  ) {
    return Ok(seedInvite({ invitedBy, persistentTokens, expiresAt }))
  }

  async deleteInvite(code: string) {
    invitesStore.delete(code)
    return Ok(undefined)
  }
}
