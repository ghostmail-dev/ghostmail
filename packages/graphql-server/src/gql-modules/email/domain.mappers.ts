import { ParsedMail, Attachment } from "mailparser"
import { ObjectId } from "mongodb"

export interface EmailMapper extends ParsedMail {
  _id: ObjectId
}

export interface EmailAttachmentMapper extends Omit<Attachment, "headers"> {
  filename: string
  headers: Record<string, string>
}
