import DataLoader from "dataloader"
import {
  type SerializableUserDocument,
  toUserDTO,
  type UserDocument,
} from "../models/users.js"
import { usersCollection } from "../collections/users.js"
import { hashSync } from "bcryptjs"
import type {
  AbstractUsersLoader,
  AbstractUsersMutator,
} from "../definitions.js"
import { faker } from "@faker-js/faker"

export class UsersLoader implements AbstractUsersLoader {
  private batchUsersById = new DataLoader<string, UserDocument | null>(
    async (keys) => {
      const users = await usersCollection.find({ _id: { $in: keys } }).toArray()
      const userMap = new Map(users.map((u) => [u._id, u]))
      return keys.map((k) => userMap.get(k) || null)
    },
  )

  private batchUsersByUsername = new DataLoader<string, UserDocument | null>(
    async (keys) => {
      const users = await usersCollection
        .find({ username: { $in: keys as string[] } })
        .toArray()
      const userMap = new Map(users.map((u) => [u.username, u]))
      return keys.map((k) => userMap.get(k) || null)
    },
  )

  async getUserById(id: string): Promise<SerializableUserDocument | null> {
    const user = await this.batchUsersById.load(id)
    return user ? toUserDTO(user) : null
  }

  async getUserByName(name: string): Promise<SerializableUserDocument | null> {
    const user = await this.batchUsersByUsername.load(name)
    return user ? toUserDTO(user) : null
  }
}

export class UsersMutator implements AbstractUsersMutator {
  async createUser(
    username: string,
    password: string,
  ): Promise<SerializableUserDocument> {
    const doc: UserDocument = {
      _id: faker.database.mongodbObjectId(),
      username,
      password: hashSync(password, 10),
      maxPersistentMailboxes: 0,
    }
    await usersCollection.insertOne(doc)
    return toUserDTO(doc)
  }

  async changePersistentMailboxLimit(
    id: string,
    newLimit: number,
  ): Promise<void> {
    await usersCollection.updateOne(
      { _id: id },
      { $set: { maxPersistentMailboxes: newLimit } },
    )
  }

  async deleteUser(id: string): Promise<void> {
    await usersCollection.deleteOne({ _id: id })
  }
}
