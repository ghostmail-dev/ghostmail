import type { ParsedMail } from "mailparser"
import { SerializableEmailDocument } from "./models/email"
import { SerializableMailbox } from "./models/mailbox"
import { SerializableUserDocument } from "./models/users"
import { SerializableInviteDocument } from "./models/invites"
import type { ResultAsync } from "./result"

export class UnknownDatabaseError extends Error {
  constructor(databaseError?: unknown) {
    super("Unknown database error")
    this.name = "UnknownDatabaseError"
    this.stack =
      (databaseError instanceof Error ? databaseError.stack : "") || this.stack
  }
}

export type IdLike = string | { toHexString(): string }

export abstract class AbstractEmailsLoader {
  abstract getEmailById(
    id: string,
  ): ResultAsync<SerializableEmailDocument | null, UnknownDatabaseError>
  abstract getEmailByMessageId(
    messageId: string,
  ): ResultAsync<SerializableEmailDocument | null, UnknownDatabaseError>
}

export abstract class AbstractEmailsMutator {
  abstract createEmail(
    email: ParsedMail,
    mailboxIds: IdLike[],
  ): ResultAsync<SerializableEmailDocument, UnknownDatabaseError>
  abstract markAsRead(id: IdLike): ResultAsync<void, UnknownDatabaseError>
  abstract deleteEmail(id: IdLike): ResultAsync<void, UnknownDatabaseError>
}

export abstract class AbstractMailboxesLoader {
  abstract getMailboxByName(
    username: string,
  ): ResultAsync<SerializableMailbox | null, UnknownDatabaseError>
  abstract getMailboxById(
    id: string,
  ): ResultAsync<SerializableMailbox | null, UnknownDatabaseError>
  abstract getMailboxesByOwnerId(
    ownerId: string,
  ): ResultAsync<SerializableMailbox[], UnknownDatabaseError>
  abstract validateMailboxCredentials(
    username: string,
    password: string,
  ): ResultAsync<boolean, UnknownDatabaseError>
}

export class MailboxLimitError extends Error {
  constructor() {
    super("Mailbox limit reached")
    this.name = "MailboxLimitError"
  }
}

export abstract class AbstractMailboxesMutator {
  abstract addEphemeralMailbox(
    userId: IdLike,
    expiresAt?: Date,
  ): ResultAsync<SerializableMailbox, UnknownDatabaseError>
  abstract addPersistentMailbox(
    userId: IdLike,
  ): ResultAsync<SerializableMailbox, MailboxLimitError | UnknownDatabaseError>
  abstract deleteMailbox(id: string): ResultAsync<void, UnknownDatabaseError>
}

export abstract class AbstractUsersLoader {
  abstract getUserById(
    id: IdLike,
  ): ResultAsync<SerializableUserDocument | null, UnknownDatabaseError>
  abstract getUserByName(
    username: string,
  ): ResultAsync<SerializableUserDocument | null, UnknownDatabaseError>
}

export abstract class AbstractUsersMutator {
  abstract createUser(
    username: string,
    password: string,
    inviteCode: string,
  ): ResultAsync<SerializableUserDocument, UnknownDatabaseError>
  abstract deleteUser(id: string): ResultAsync<void, UnknownDatabaseError>
  abstract changePersistentMailboxLimit(
    userId: IdLike,
    newLimit: number,
  ): ResultAsync<void, UnknownDatabaseError>
  abstract changeUserRoles(
    userId: IdLike,
    newRoles: ("admin" | "user")[],
  ): ResultAsync<void, UnknownDatabaseError>
  abstract changeUserPassword(
    userId: IdLike,
    newPassword: string,
  ): ResultAsync<void, UnknownDatabaseError>
}

export abstract class AbstractInvitesLoader {
  abstract getInvitesByUsername(
    username: string,
  ): ResultAsync<SerializableInviteDocument[], UnknownDatabaseError>
  abstract validateInvite(
    code: string,
  ): ResultAsync<boolean, UnknownDatabaseError>
}

export abstract class AbstractInvitesMutator {
  abstract createInvite(
    invitedBy: string,
    persistentTokens: number,
    expiresAt?: Date,
  ): ResultAsync<SerializableInviteDocument, UnknownDatabaseError>
  abstract deleteInvite(code: string): ResultAsync<void, UnknownDatabaseError>
}
