import { EmailDocument, spawnEmail } from "../models/email.js"
import { emailsCollection } from "../collections/email.js"

export async function seedEmail(
  overrides?: Partial<EmailDocument>,
): Promise<EmailDocument> {
  const email = spawnEmail(overrides)
  await emailsCollection.insertOne(email)
  return email
}
