import { describe, expect, it, beforeEach } from "vitest"
import { UsersLoader, UsersMutator } from "../dal/users.js"
import { usersCollection } from "../collections/users.js"
import { seedUser } from "../test-utils/seedUser.js"
import { seedInvite } from "../test-utils/seedInvite.js"
import { invitesCollection } from "../collections/invites.js"

describe("Users DAL", () => {
  beforeEach(async () => await usersCollection.deleteMany({}))

  it("can create and get user by name", async () => {
    const invite = await seedInvite()

    const mutator = new UsersMutator()
    const loader = new UsersLoader()
    const userResult = await mutator.createUser(
      "testuser",
      "testpassword",
      invite.code,
    )
    const user = userResult.ok ? userResult.value : null
    const result = await loader.getUserByName(user?.username || "")
    const found = result.ok ? result.value : null
    expect(found).not.toBeNull()
    expect(found?.username).toBe("testuser")
    expect(found?.maxPersistentMailboxes).toBe(invite.persistentTokens)
    const foundInv = await invitesCollection.findOne({ code: invite.code })
    expect(foundInv).not.toBeNull()
    expect(foundInv?.status).toBe("used")
    expect(foundInv?.usedBy).toBe("testuser")
  })

  it("can get user by id", async () => {
    const seeded = await seedUser()
    const loader = new UsersLoader()
    const result = await loader.getUserById(seeded._id)
    const found = result.ok ? result.value : null
    expect(found).not.toBeNull()
    expect(found?._id).toBe(seeded._id)
  })

  it("can change persistent mailbox limit", async () => {
    const seeded = await seedUser({ maxPersistentMailboxes: 1 })
    const mutator = new UsersMutator()
    await mutator.changePersistentMailboxLimit(seeded._id, 5)

    const loader = new UsersLoader()
    const result = await loader.getUserById(seeded._id)
    const found = result.ok ? result.value : null
    expect(found).not.toBeNull()
    expect(found?.maxPersistentMailboxes).toBe(5)
  })

  it("can delete a user", async () => {
    const seeded = await seedUser()
    const mutator = new UsersMutator()
    await mutator.deleteUser(seeded._id)

    const loader = new UsersLoader()
    const result = await loader.getUserById(seeded._id)
    const found = result.ok ? result.value : null
    expect(found).toBeNull()
  })
})
