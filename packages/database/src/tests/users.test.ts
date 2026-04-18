import { describe, it, expect, beforeEach } from "vitest"
import { UsersLoader, UsersMutator } from "../dal/users.js"
import { usersCollection } from "../collections/users.js"
import { seedUser } from "../test-utils/spawnUser.js"

describe("Users DAL", () => {
  beforeEach(async () => await usersCollection.deleteMany({}))

  it("can create and get user", async () => {
    const mutator = new UsersMutator()
    const loader = new UsersLoader()
    const user = await mutator.createUser()

    const found = await loader.getUserByName(user.username)
    expect(found).not.toBeNull()
    expect(found?.username).toBe(user.username)

    const foundKey = await loader.getUserByApiKey(user.apiKey.key)
    expect(foundKey).not.toBeNull()
  })

  it("can execute token transactions", async () => {
    const seeded = await seedUser()
    const mutator = new UsersMutator()

    const initialTokens = seeded.apiKey.tokens
    if (initialTokens > 0) {
      const spent = await mutator.spendToken(seeded.apiKey.key)
      expect(spent.apiKey.tokens).toBe(initialTokens - 1)
    }

    const refilled = await mutator.refillTokens(seeded.apiKey.key, 100)
    expect(refilled.apiKey.tokens).toBeGreaterThan(initialTokens)
  })
})
