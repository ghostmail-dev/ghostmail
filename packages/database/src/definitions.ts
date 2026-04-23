import type { ParsedMail } from "mailparser"
import { SerializableEmailDocument } from "./models/email"
import { SerializableMailbox } from "./models/mailbox"
import { SerializableUserDocument } from "./models/users"

export type IdLike = string | { toHexString(): string }

export abstract class AbstractEmailsLoader {
  abstract getEmailById(id: string): Promise<SerializableEmailDocument | null>
  abstract getEmailByMessageId(
    messageId: string
  ): Promise<SerializableEmailDocument | null>
}

export abstract class AbstractEmailsMutator {
  abstract createEmail(
    email: ParsedMail,
    mailboxIds: IdLike[]
  ): Promise<SerializableEmailDocument>
  abstract markAsRead(id: IdLike): Promise<void>
  abstract deleteEmail(id: IdLike): Promise<void>
}

export abstract class AbstractMailboxesLoader {
  abstract getMailboxByName(
    username: string
  ): Promise<SerializableMailbox | null>
  abstract getMailboxById(id: string): Promise<SerializableMailbox | null>
  abstract getMailboxesByOwnerId(
    ownerId: string
  ): Promise<SerializableMailbox[]>
  abstract validateMailboxCredentials(
    username: string,
    password: string
  ): Promise<boolean>
}

export abstract class AbstractMailboxesMutator {
  abstract addEphemeralMailbox(
    userId: IdLike,
    expiresAt?: Date
  ): Promise<SerializableMailbox>
  abstract addPersistentMailbox(userId: IdLike): Promise<SerializableMailbox>
  abstract deleteMailbox(id: string): Promise<void>
}

export abstract class AbstractUsersLoader {
  abstract getUserById(id: IdLike): Promise<SerializableUserDocument | null>
  abstract getUserByName(
    username: string
  ): Promise<SerializableUserDocument | null>
}

export abstract class AbstractUsersMutator {
  abstract createUser(
    username: string,
    password: string
  ): Promise<SerializableUserDocument>
  abstract deleteUser(id: string): Promise<void>
  abstract changePersistentMailboxLimit(
    userId: IdLike,
    newLimit: number
  ): Promise<void>
}
