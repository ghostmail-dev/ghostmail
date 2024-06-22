import { ObjectId } from "mongodb"
import { MongoCollection } from "../connection"

/** A simple collection that keeps track of all the email accounts */
export type MailboxDocument = {
  _id: ObjectId
  /** The firstname, generated from faker */
  firstName: string
  /** The last name, generated from faker */
  lastName: string
  /** email address: normalized first.last@domain */
  username: string
  /** password */
  password: string
  /** The emails in the mailbox */
  emails: {
    emailId: ObjectId
    sender: string | null
    subject: string | null
    date: Date
    isRead: boolean
  }[]
}

export const Mailboxes = MongoCollection<MailboxDocument>("mailboxes")
