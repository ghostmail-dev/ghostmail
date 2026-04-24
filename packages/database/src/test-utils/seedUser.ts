import { spawnUser, UserDocument } from "../models/users.js"
import { usersCollection } from "../collections/users.js"

export async function seedUser(
  overrides?: Partial<UserDocument>,
): Promise<UserDocument> {
  const user = spawnUser(overrides)
  await usersCollection.insertOne(user)
  return user
}
