import { ObjectId } from "mongodb"

export type UserDocument = {
  _id: ObjectId
  username: string
  password: string
  apiKey: {
    key: string
    createdAt: Date
    expiresAt: Date
    tokens: number
  }
}
