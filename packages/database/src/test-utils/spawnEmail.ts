import { faker } from "@faker-js/faker"
import { ObjectId } from "mongodb"
import { EmailDocument } from "../models/email.js"
import { emailsCollection } from "../collections/email.js"

export function spawnEmail(overrides?: Partial<EmailDocument>): EmailDocument {
  return {
    _id: new ObjectId(),
    html: faker.lorem.paragraphs(),
    text: faker.lorem.paragraphs(),
    textAsHtml: faker.lorem.paragraphs(),
    subject: faker.lorem.sentence(),
    messageId: faker.string.uuid(),
    date: faker.date.recent(),
    attachments: [],
    headerLines: [],
    headers: new Map(),
    ...overrides,
  } satisfies EmailDocument
}

export async function seedEmail(
  overrides?: Partial<EmailDocument>
): Promise<EmailDocument> {
  const email = spawnEmail(overrides)
  await emailsCollection.insertOne(email)
  return email
}
