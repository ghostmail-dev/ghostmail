import DataLoader from "dataloader"
import { toUserDTO, type UserDocument } from "../models/users.js"
import { usersCollection } from "../collections/users.js"
import { hashSync } from "bcryptjs"
import type {
  AbstractUsersLoader,
  AbstractUsersMutator,
} from "../definitions.js"
import { UnknownDatabaseError } from "../definitions.js"
import { faker } from "@faker-js/faker"
import { mongoClient } from "../connection.js"
import { invitesCollection } from "../collections/invites.js"
import { tryCatch } from "../result.js"

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

  async getUserById(id: string) {
    return await tryCatch(async () => {
      const user = await this.batchUsersById.load(id)
      return user ? toUserDTO(user) : null
    }, UnknownDatabaseError)
  }

  async getUserByName(name: string) {
    return await tryCatch(async () => {
      const user = await this.batchUsersByUsername.load(name)
      return user ? toUserDTO(user) : null
    }, UnknownDatabaseError)
  }
}

export class UsersMutator implements AbstractUsersMutator {
  async createUser(username: string, password: string, inviteCode: string) {
    return await tryCatch(async () => {
      const doc: UserDocument = {
        _id: faker.database.mongodbObjectId(),
        username,
        password: hashSync(password, 10),
        maxPersistentMailboxes: 0,
        roles: ["user"],
      }
      const session = mongoClient.startSession()
      session.startTransaction()
      await usersCollection.insertOne(doc, { session })
      await invitesCollection.updateOne(
        { code: inviteCode },
        { $set: { status: "used", usedBy: username, usedAt: new Date() } },
        { session },
      )
      await session.commitTransaction()
      return toUserDTO(doc)
    }, UnknownDatabaseError)
  }

  async changePersistentMailboxLimit(id: string, newLimit: number) {
    return await tryCatch(async () => {
      await usersCollection.updateOne(
        { _id: id },
        { $set: { maxPersistentMailboxes: newLimit } },
      )
    }, UnknownDatabaseError)
  }

  async deleteUser(id: string) {
    return await tryCatch(async () => {
      await usersCollection.deleteOne({ _id: id })
    }, UnknownDatabaseError)
  }

  async changeUserRoles(userId: string, newRoles: ("admin" | "user")[]) {
    return await tryCatch(async () => {
      await usersCollection.updateOne(
        { _id: userId },
        { $set: { roles: newRoles } },
      )
    }, UnknownDatabaseError)
  }

  async changeUserPassword(userId: string, newPassword: string) {
    return await tryCatch(async () => {
      await usersCollection.updateOne(
        { _id: userId },
        { $set: { password: hashSync(newPassword, 10) } },
      )
    }, UnknownDatabaseError)
  }
}
