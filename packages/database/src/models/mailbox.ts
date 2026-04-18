import { ObjectId } from "mongodb"

export type EmailDetails = {
  emailId: ObjectId
  sender: string | null
  subject: string | null
  date: Date
  isRead: boolean
}

export type MailboxDocument = {
  _id: ObjectId
  firstName: string
  lastName: string
  username: string
  password: string
  emails: EmailDetails[]
  createdAt: Date
}
