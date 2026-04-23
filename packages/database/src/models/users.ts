import { faker } from "@faker-js/faker"

export type UserDocument = {
  _id: string
  username: string
  password: string
  maxPersistentMailboxes: number
}

export type SerializableUserDocument = UserDocument

export const toUserDTO = (doc: UserDocument): SerializableUserDocument => {
  return {
    _id: doc._id,
    username: doc.username,
    password: doc.password,
    maxPersistentMailboxes: doc.maxPersistentMailboxes,
  }
}

export function spawnUser(overrides?: Partial<UserDocument>): UserDocument {
  return {
    _id: faker.database.mongodbObjectId(),
    username: faker.internet.username(),
    password: faker.internet.password(),
    maxPersistentMailboxes: faker.number.int({ min: 0, max: 5 }),
    ...overrides,
  }
}
