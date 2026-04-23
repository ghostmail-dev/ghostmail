import { MailboxDocument, spawnMailbox } from "../models/mailbox.js";
import { mailboxesCollection } from "../collections/mailbox.js";

export async function seedMailbox(
  overrides?: Partial<MailboxDocument>,
): Promise<MailboxDocument> {
  const mailbox = spawnMailbox(overrides);
  await mailboxesCollection.insertOne(mailbox);
  return mailbox;
}
