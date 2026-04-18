import { Attachment, HeaderValue, ParsedMail } from "mailparser"
import { ObjectId } from "mongodb"

export interface EmailAttachmentMapper extends Omit<Attachment, "headers"> {
  fileName: string
  headers: Record<string, HeaderValue>
}

export interface EmailDocument extends Omit<ParsedMail, "attachments"> {
  _id: ObjectId
  attachments: EmailAttachmentMapper[]
}
