import { ObjectId } from "mongodb"
import { MongoCollection } from "../connection"
import DataLoader from "dataloader"
import { faker } from "@faker-js/faker"

type UserDocument = {
  _id: ObjectId
  /** The firstname, generated from faker */
  username: string
  /** password hash */
  password: string
  /** The emails in the mailbox */
  apiKey: {
    key: string
    /** The date the key was created */
    createdAt: Date
  }
  tokens: number
}

const Users = MongoCollection<UserDocument>("users")

export type UserMapper = UserDocument

export class UserLoader {
  private batchUsersByApiKey = new DataLoader<string, UserMapper | null>(
    async (apiKeys) => {
      const users = await Users.find({
        "apiKey.key": { $in: apiKeys },
      }).toArray()

      return apiKeys.map((key) => {
        return users.find((user) => user.apiKey.key === key) ?? null
      })
    }
  )

  private batchUsersByUsername = new DataLoader<string, UserMapper | null>(
    async (usernames) => {
      const users = await Users.find({
        username: { $in: usernames },
      }).toArray()

      return usernames.map((username) => {
        return users.find((user) => user.username === username) ?? null
      })
    }
  )

  async getUserByApiKey(apiKey: string): Promise<UserMapper | null> {
    return this.batchUsersByApiKey.load(apiKey)
  }

  async getUserByUsername(username: string): Promise<UserMapper | null> {
    return this.batchUsersByUsername.load(username)
  }
}

export async function createUser(
  username: string,
  password: string
): Promise<UserMapper> {
  const newUser = {
    _id: new ObjectId(),
    username,
    password,
    apiKey: {
      key: faker.string.alphanumeric(32),
      createdAt: new Date(),
    },
    tokens: 0,
  }

  await Users.insertOne(newUser)

  return newUser
}

export async function spendToken(apiKey: string) {
  await Users.updateOne(
    {
      "apiKey.key": apiKey,
    },
    {
      $inc: { tokens: -1 },
    }
  )
}
