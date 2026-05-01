import { mongoDB } from "../connection.js"
import type { MailboxDocument } from "../models/mailbox.js"

export const mailboxesCollection =
  mongoDB.collection<MailboxDocument>("mailboxes")
