import { mongoDB } from "../connection.js"
import { EmailDocument } from "../models/email.js"

export const emailsCollection = mongoDB.collection<EmailDocument>("emails")
