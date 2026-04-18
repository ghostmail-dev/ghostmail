import { describe, it, expect, beforeEach } from "vitest"
import { MailboxesLoader, MailboxesMutator } from "../dal/mailboxes.js"
import { mailboxesCollection } from "../collections/mailbox.js"
import { seedMailbox } from "../test-utils/spawnMailbox.js"
import { ObjectId } from "mongodb"

describe("Mailboxes DAL", () => {
  beforeEach(async () => await mailboxesCollection.deleteMany({}))

  it("can fetch a mailbox by name", async () => {
    const seeded = await seedMailbox()
    const loader = new MailboxesLoader()
    const found = await loader.getMailboxByName(seeded.username)
    expect(found).not.toBeNull()
    expect(found?.username).toBe(seeded.username)
  })

  it("can validate credentials", async () => {
    const seeded = await seedMailbox()
    const loader = new MailboxesLoader()
    expect(
      await loader.validateMailboxCredentials(seeded.username, seeded.password)
    ).toBe(true)
    expect(
      await loader.validateMailboxCredentials(seeded.username, "wrongpass")
    ).toBe(false)
  })

  it("can create and delete mailboxes", async () => {
    const mutator = new MailboxesMutator()
    const mailbox = await mutator.createMailbox()
    expect(mailbox._id).toBeDefined()

    await mutator.deleteMailbox(mailbox._id)
    const found = await mailboxesCollection.findOne({ _id: mailbox._id })
    expect(found).toBeNull()
  })

  it("can deliver and read mail", async () => {
    const seeded = await seedMailbox()
    const mutator = new MailboxesMutator()

    const emailId = new ObjectId()
    await mutator.deliverMail({
      emailId,
      sender: "test@test.com",
      subject: "Hi",
      date: new Date(),
      isRead: false,
      username: seeded.username,
    })

    let found = await mailboxesCollection.findOne({ _id: seeded._id })
    expect(found?.emails[0].isRead).toBe(false)

    await mutator.readMail(emailId.toHexString(), seeded.username)
    found = await mailboxesCollection.findOne({ _id: seeded._id })
    expect(found?.emails[0].isRead).toBe(true)
  })
})
