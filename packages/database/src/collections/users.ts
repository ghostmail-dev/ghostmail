import { mongoDB } from "../connection.js"
import type { UserDocument } from "../models/users.js"

export const usersCollection = mongoDB.collection<UserDocument>("users")
