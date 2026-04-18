import DataLoader from "dataloader"
import { ObjectId } from "mongodb"
import { UserDocument } from "../models/users.js"
import { usersCollection } from "../collections/users.js"
import { faker } from "@faker-js/faker"

export class UsersLoader {
  private batchUsersByApiKey = new DataLoader<string, UserDocument | null>(
    async (keys) => {
      const users = await usersCollection
        .find({ "apiKey.key": { $in: keys as string[] } })
        .toArray()
      const userMap = new Map(users.map((u) => [u.apiKey.key, u]))
      return keys.map((k) => userMap.get(k) || null)
    }
  )

  private batchUsersByUsername = new DataLoader<string, UserDocument | null>(
    async (keys) => {
      const users = await usersCollection
        .find({ username: { $in: keys as string[] } })
        .toArray()
      const userMap = new Map(users.map((u) => [u.username, u]))
      return keys.map((k) => userMap.get(k) || null)
    }
  )

  async getUserByApiKey(apiKey: string): Promise<UserDocument | null> {
    return this.batchUsersByApiKey.load(apiKey)
  }

  async getUserByName(name: string): Promise<UserDocument | null> {
    return this.batchUsersByUsername.load(name)
  }
}

export class UsersMutator {
  async createUser(): Promise<UserDocument> {
    const doc: UserDocument = {
      _id: new ObjectId(),
      username: faker.internet.username(),
      password: faker.internet.password(),
      apiKey: {
        key: faker.string.uuid(),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        tokens: 100,
      },
    }
    await usersCollection.insertOne(doc)
    return doc
  }

  async deleteUser(id: ObjectId | string): Promise<void> {
    await usersCollection.deleteOne({
      _id: typeof id === "string" ? new ObjectId(id) : id,
    })
  }

  async createApiKey(username: string): Promise<UserDocument> {
    const user = await usersCollection.findOneAndUpdate(
      { username },
      {
        $set: {
          "apiKey.key": new ObjectId().toHexString(),
          "apiKey.createdAt": new Date(),
          "apiKey.expiresAt": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
      { returnDocument: "after" }
    )
    if (!user) throw new Error("User not found")
    return user
  }

  async deleteApiKey(username: string): Promise<void> {
    await usersCollection.updateOne(
      { username },
      { $set: { "apiKey.expiresAt": new Date(0), "apiKey.tokens": 0 } }
    )
  }

  async rotateApiKey(
    oldApiKey: string,
    newApiKey: string
  ): Promise<UserDocument> {
    const user = await usersCollection.findOneAndUpdate(
      { "apiKey.key": oldApiKey },
      {
        $set: {
          "apiKey.key": newApiKey,
          "apiKey.createdAt": new Date(),
          "apiKey.expiresAt": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
      { returnDocument: "after" }
    )
    if (!user) throw new Error("User not found or invalid old ApiKey")
    return user
  }

  async spendToken(apiKey: string): Promise<UserDocument> {
    const user = await usersCollection.findOneAndUpdate(
      { "apiKey.key": apiKey, "apiKey.tokens": { $gt: 0 } },
      { $inc: { "apiKey.tokens": -1 } },
      { returnDocument: "after" }
    )
    if (!user) throw new Error("Insufficient tokens or invalid key")
    return user
  }

  async refillTokens(apiKey: string, amount: number): Promise<UserDocument> {
    const user = await usersCollection.findOneAndUpdate(
      { "apiKey.key": apiKey },
      { $inc: { "apiKey.tokens": amount } },
      { returnDocument: "after" }
    )
    if (!user) throw new Error("Invalid ApiKey")
    return user
  }
}
