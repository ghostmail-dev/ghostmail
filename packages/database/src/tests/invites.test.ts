import { describe, it, expect, beforeEach } from "vitest"
import { InvitesLoader, InvitesMutator } from "../dal/invites.js"
import { invitesCollection } from "../collections/invites.js"
import { seedInvite } from "../test-utils/seedInvite.js"
import { resetDatabase } from "../test-utils/resetDatabase.js"

describe("Invites DAL", () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  describe("InvitesLoader", () => {
    it("can fetch invites by username", async () => {
      const invite1 = await seedInvite({ invitedBy: "alice" })
      const invite2 = await seedInvite({ invitedBy: "alice" })
      await seedInvite({ invitedBy: "bob" })

      const loader = new InvitesLoader()
      const found = await loader.getInvitesByUsername("alice")

      expect(found).toHaveLength(2)
      expect(found.map((i) => i.code)).toEqual(
        expect.arrayContaining([invite1.code, invite2.code]),
      )
    })

    it("returns an empty array when user has no invites", async () => {
      await seedInvite({ invitedBy: "bob" })

      const loader = new InvitesLoader()
      const found = await loader.getInvitesByUsername("alice")

      expect(found).toHaveLength(0)
    })

    it("returns serializable DTOs (dates as strings)", async () => {
      await seedInvite({ invitedBy: "alice" })

      const loader = new InvitesLoader()
      const [invite] = await loader.getInvitesByUsername("alice")

      expect(typeof invite.createdAt).toBe("string")
      expect(typeof invite.expiresAt).toBe("string")
    })

    it("validates an active invite as true", async () => {
      const invite = await seedInvite({
        status: "active",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })

      const loader = new InvitesLoader()
      const valid = await loader.validateInvite(invite.code)

      expect(valid).toBe(true)
    })

    it("deletes and returns false for a used invite", async () => {
      const invite = await seedInvite({
        status: "used",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })

      const loader = new InvitesLoader()
      const valid = await loader.validateInvite(invite.code)

      expect(valid).toBe(false)
      const stillExists = await invitesCollection.findOne({ code: invite.code })
      expect(stillExists).toBeNull()
    })

    it("validates a non-existent invite as false", async () => {
      const loader = new InvitesLoader()
      const valid = await loader.validateInvite("NOT-A-REAL-CODE")

      expect(valid).toBe(false)
    })

    it("deletes and returns false for an expired invite", async () => {
      const invite = await seedInvite({
        expiresAt: new Date(Date.now() - 1000),
      })

      const loader = new InvitesLoader()
      const valid = await loader.validateInvite(invite.code)

      expect(valid).toBe(false)

      const stillExists = await invitesCollection.findOne({ code: invite.code })
      expect(stillExists).toBeNull()
    })
  })

  describe("InvitesMutator", () => {
    it("creates an invite with the correct fields", async () => {
      const mutator = new InvitesMutator()
      const created = await mutator.createInvite("alice", 3)

      expect(created).toBeDefined()
      expect(created.invitedBy).toBe("alice")
      expect(created.persistentTokens).toBe(3)
      expect(created.status).toBe("active")
      expect(created.usedBy).toBeNull()
      expect(created.usedAt).toBeNull()

      const found = await invitesCollection.findOne({ code: created.code })
      expect(found).not.toBeNull()
    })

    it("creates an invite and returns a serializable DTO", async () => {
      const mutator = new InvitesMutator()
      const created = await mutator.createInvite("alice", 3)

      expect(typeof created.createdAt).toBe("string")
      expect(typeof created.expiresAt).toBe("string")
    })

    it("deletes an invite by code", async () => {
      const invite = await seedInvite()
      const mutator = new InvitesMutator()

      await mutator.deleteInvite(invite.code)

      const found = await invitesCollection.findOne({ code: invite.code })
      expect(found).toBeNull()
    })

    it("does not throw when deleting a non-existent invite", async () => {
      const mutator = new InvitesMutator()
      await expect(
        mutator.deleteInvite("NOT-A-REAL-CODE"),
      ).resolves.not.toThrow()
    })
  })
})
