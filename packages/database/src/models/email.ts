import { faker } from "@faker-js/faker"
import type { Attachment, HeaderValue, ParsedMail } from "mailparser"

export interface EmailAttachmentMapper extends Omit<Attachment, "headers"> {
  fileName: string
  headers: Record<string, HeaderValue>
}

export interface EmailDocument extends Omit<ParsedMail, "attachments"> {
  _id: string
  attachments: EmailAttachmentMapper[]
  mailboxes: string[]
  isRead: boolean
}

export interface SerializableEmailDocument extends Omit<
  EmailDocument,
  "_id" | "date" | "headers" | "mailboxes"
> {
  _id: string
  date?: string
  mailboxes: string[]
}

export function toEmailDTO(doc: EmailDocument): SerializableEmailDocument {
  const { _id, date, headers: _, ...rest } = doc
  return {
    ...rest,
    _id: _id,
    date: date?.toJSON(),
    mailboxes: doc.mailboxes,
  }
}

export function spawnEmail(overrides?: Partial<EmailDocument>): EmailDocument {
  const sender = faker.internet.email()
  const recipient = faker.internet.email()
  return {
    _id: faker.database.mongodbObjectId(),
    html: faker.lorem.paragraphs(),
    text: faker.lorem.paragraphs(),
    textAsHtml: faker.lorem.paragraphs(),
    subject: faker.lorem.sentence(),
    messageId: faker.string.uuid(),
    date: faker.date.recent(),
    attachments: [],
    headerLines: [],
    headers: new Map(),
    mailboxes: [],
    isRead: false,
    from: {
      value: [{ address: sender, name: "Sender" }],
      html: `<a href='mailto:${sender}'>Sender</a>`,
      text: sender,
    },
    to: {
      value: [{ address: recipient, name: `${recipient}` }],
      html: `<a href='mailto:${recipient}'>${recipient}</a>`,
      text: recipient,
    },
    ...overrides,
  } satisfies EmailDocument
}
