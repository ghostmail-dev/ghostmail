import { ObjectId } from "mongodb"

export type MailboxMapper = {
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
