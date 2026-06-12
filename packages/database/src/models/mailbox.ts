import { faker } from "@faker-js/faker"
import type { EmailDocument, SerializableEmailDocument } from "./email"

export const EPHEMERAL_TTL_MS = 60 * 60 * 1000 // 1 hour

export type MailboxType = "ephemeral" | "persistent"

export type MailboxDocumentBase = {
  _id: string
  firstName: string
  lastName: string
  username: string
  password: string
  createdAt: Date
  ownerId: string
}

type MailboxDocumentEphemeral = MailboxDocumentBase & {
  type: "ephemeral"
  expiresAt: Date
}

type MailboxDocumentPersistent = MailboxDocumentBase & {
  type: "persistent"
}

export type MailboxDocument =
  | MailboxDocumentEphemeral
  | MailboxDocumentPersistent

export type SerializableEmailDetails = {
  emailId: string
  isRead: boolean
  date: string
  sender: string
  subject?: string
}

type SerializableMailboxBase = {
  _id: string
  firstName: string
  lastName: string
  username: string
  password: string
  createdAt: string
  ownerId: string
  emails: SerializableEmailDetails[]
}

export type SerializableMailboxEphemeral = SerializableMailboxBase & {
  type: "ephemeral"
  expiresAt: string
}

export type SerializableMailboxPersistent = SerializableMailboxBase & {
  type: "persistent"
}

export type SerializableMailbox =
  | SerializableMailboxEphemeral
  | SerializableMailboxPersistent

export function toEmailDetailsDTO(
  email: EmailDocument | SerializableEmailDocument
): SerializableEmailDetails {
  return {
    emailId: String(email._id),
    date:
      typeof email.date === "string"
        ? email.date
        : email.date?.toISOString() || "",
    isRead: email.isRead,
    sender: email.from?.text || "Unknown sender",
    subject: email.subject || "(no subject)",
  }
}

export function toMailboxDTO(
  doc: MailboxDocument,
  emails: SerializableEmailDetails[]
): SerializableMailbox {
  return {
    _id: doc._id,
    ownerId: doc.ownerId,
    firstName: doc.firstName,
    lastName: doc.lastName,
    username: doc.username,
    password: doc.password,
    createdAt: doc.createdAt.toJSON(),
    ...(doc.type === "ephemeral"
      ? { type: "ephemeral", expiresAt: doc.expiresAt.toJSON() }
      : { type: "persistent" }),
    emails,
  } satisfies SerializableMailbox
}

export function spawnMailbox(
  overrides?: Partial<MailboxDocument>
): MailboxDocument {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    _id: faker.database.mongodbObjectId(),
    firstName,
    lastName,
    username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${process.env.VITE_MAIL_DOMAIN}`,
    password: faker.internet.password(),
    createdAt: new Date(),
    ownerId: faker.database.mongodbObjectId(),
    ...overrides,
    ...(overrides?.type === "ephemeral"
      ? {
          type: "ephemeral",
          expiresAt: new Date(Date.now() + EPHEMERAL_TTL_MS),
        }
      : { type: "persistent" }),
  }
}
