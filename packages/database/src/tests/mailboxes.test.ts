import { describe, expect, it, beforeEach, afterEach, vi } from "vitest"
import { MailboxesLoader, MailboxesMutator } from "../dal/mailboxes.js"
import { mailboxesCollection } from "../collections/mailbox.js"
import { seedMailbox } from "../test-utils/seedMailbox.js"
import { seedUser } from "../test-utils/seedUser.js"
import { spawnUser } from "../models/users.js"
import { seedEmail } from "../test-utils/seedEmail.js"
import { EPHEMERAL_TTL_MS } from "../models/mailbox.js"
import { resetDatabase } from "../test-utils/resetDatabase.js"

describe("Mailboxes DAL", () => {
  beforeEach(async () => await resetDatabase())
  afterEach(() => vi.useRealTimers())

  it("can fetch a mailbox by name", async () => {
    const mailbox = await seedMailbox()
    const [email1, email2] = await Promise.all([
      seedEmail({ mailboxes: [mailbox._id] }),
      seedEmail({ mailboxes: [mailbox._id] }),
    ])
    const loader = new MailboxesLoader()
    const result = await loader.getMailboxByName(mailbox.username)
    const found = result.ok ? result.value : null

    // validate the found mailbox is a serialized version of the seeded mailbox
    expect(found).not.toBeNull()
    expect(found?.username).toBe(mailbox.username)
    expect(found?.ownerId).toBe(mailbox.ownerId)
    expect(found?.createdAt).toBe(mailbox.createdAt.toJSON())
    expect(found?.emails).toEqual(
      expect.arrayContaining([
        {
          emailId: email1._id,
          date: email1.date?.toISOString() || "",
          isRead: email1.isRead,
          sender: email1.from?.text || "Unknown sender",
          subject: email1.subject || "(no subject)",
        },
        {
          emailId: email2._id,
          date: email2.date?.toISOString() || "",
          isRead: email2.isRead,
          sender: email2.from?.text || "Unknown sender",
          subject: email2.subject || "(no subject)",
        },
      ]),
    )
  })

  it("can fetch a mailbox by id", async () => {
    const seeded = await seedMailbox()
    const loader = new MailboxesLoader()
    const result = await loader.getMailboxById(seeded._id)
    const found = result.ok ? result.value : null
    expect(found).not.toBeNull()
    expect(found?._id).toBe(seeded._id)
  })

  it("can fetch mailboxes by owner id", async () => {
    const owner = await seedUser()
    await seedMailbox({ ownerId: owner._id })
    await seedMailbox({ ownerId: owner._id })
    await seedMailbox() // unrelated mailbox

    const loader = new MailboxesLoader()
    const result = await loader.getMailboxesByOwnerId(owner._id)
    const found = result.ok ? result.value : []
    expect(found).toHaveLength(2)
  })

  it("can validate credentials", async () => {
    const seeded = await seedMailbox()
    const loader = new MailboxesLoader()
    const validResult = await loader.validateMailboxCredentials(
      seeded.username,
      seeded.password,
    )
    const invalidResult = await loader.validateMailboxCredentials(
      seeded.username,
      "wrongpassword",
    )
    const valid = validResult.ok ? validResult.value : null
    const invalid = invalidResult.ok ? invalidResult.value : null
    expect(valid).toBe(true)
    expect(invalid).toBe(false)
  })

  it("can create an ephemeral mailbox with expiry", async () => {
    const now = new Date("2026-01-01T00:00:00.000Z")
    vi.useFakeTimers()
    vi.setSystemTime(now)

    const owner = spawnUser()
    const mutator = new MailboxesMutator()

    const result = await mutator.addEphemeralMailbox(owner._id)
    if (!result.ok) {
      throw new Error("Failed to create ephemeral mailbox")
    }
    const mailbox = result.value
    if (mailbox.type !== "ephemeral") {
      throw new Error("Mailbox type is not ephemeral")
    }
    expect(mailbox._id).toBeDefined()
    expect(mailbox.expiresAt).toBeDefined()
    expect(mailbox.ownerId).toBe(owner._id)

    const found = await mailboxesCollection.findOne({
      _id: mailbox._id,
    })
    expect(found).not.toBeNull()
    expect(found?.createdAt).toEqual(now)
    expect(found?.type === "ephemeral" && found.expiresAt).toEqual(
      new Date(now.getTime() + EPHEMERAL_TTL_MS),
    )
  })

  it("can create a persistent mailbox without expiry", async () => {
    const owner = await seedUser({ maxPersistentMailboxes: 1 })
    const mutator = new MailboxesMutator()
    const result = await mutator.addPersistentMailbox(owner._id)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const mailbox = result.value
    if (mailbox.type !== "persistent") {
      throw new Error("Mailbox type is not persistent")
    }
    if ("expiresAt" in mailbox) {
      throw new Error("Mailbox has expiry")
    }
  })

  it("won't create persistent mailbox when limit reached", async () => {
    const owner = await seedUser({ maxPersistentMailboxes: 1 })
    await seedMailbox({ ownerId: owner._id, type: "persistent" })
    const mutator = new MailboxesMutator()
    const result = await mutator.addPersistentMailbox(owner._id)
    expect(result.ok).toBe(false)
  })

  it("can delete a mailbox", async () => {
    const seeded = await seedMailbox()
    const mutator = new MailboxesMutator()
    await mutator.deleteMailbox(seeded._id)
    const found = await mailboxesCollection.findOne({ _id: seeded._id })
    expect(found).toBeNull()
  })
})
