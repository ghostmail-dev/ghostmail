import { ParsedMail } from "mailparser"
import { MongoCollection } from "../connection"
import { ObjectId } from "mongodb"

export interface EmailDocument extends ParsedMail {
  _id: ObjectId
}

export const Emails = MongoCollection<EmailDocument>("emails")
