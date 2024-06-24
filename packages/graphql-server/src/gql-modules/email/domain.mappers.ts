import { ParsedMail, Attachment } from "mailparser"
import { ObjectId } from "mongodb"

export interface EmailMapper extends ParsedMail {
  _id: ObjectId
}

export type EmailAttachmentMapper = Attachment
