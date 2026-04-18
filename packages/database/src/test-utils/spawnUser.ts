import { faker } from "@faker-js/faker"
import { ObjectId } from "mongodb"
import { UserDocument } from "../models/users.js"
import { usersCollection } from "../collections/users.js"

export function spawnUser(overrides?: Partial<UserDocument>): UserDocument {
  return {
    _id: new ObjectId(),
    username: faker.internet.username(),
    password: faker.internet.password(),
    apiKey: {
      key: faker.string.uuid(),
      createdAt: faker.date.recent(),
      expiresAt: faker.date.future(),
      tokens: faker.number.int({ min: 0, max: 100 }),
    },
    ...overrides,
  }
}

export async function seedUser(
  overrides?: Partial<UserDocument>
): Promise<UserDocument> {
  const user = spawnUser(overrides)
  await usersCollection.insertOne(user)
  return user
}
