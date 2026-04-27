import { describe, it, expect, beforeEach } from "vitest"
import { EmailsLoader, EmailsMutator } from "../dal/emails.js"
import { emailsCollection } from "../collections/email.js"
import { seedEmail } from "../test-utils/seedEmail.js"
import { spawnEmail } from "../models/email.js"

describe("Emails DAL", () => {
  beforeEach(async () => {
    await emailsCollection.deleteMany({})
  })

  describe("EmailsLoader", () => {
    it("can fetch email by id through loader", async () => {
      const seeded = await seedEmail()
      const loader = new EmailsLoader()
      const result = await loader.getEmailById(seeded._id)

      if (!result.ok) {
        throw new Error("Failed to load email")
      }

      expect(result.ok).toBe(true)
      const found = result.value
      expect(found).not.toBeNull()
      expect(found?._id).toBe(seeded._id)
    })

    it("can fetch email by message id", async () => {
      const seeded = await seedEmail({ messageId: "testing-msg-id" })
      const loader = new EmailsLoader()
      const result = await loader.getEmailByMessageId("testing-msg-id")

      if (!result.ok) {
        throw new Error("Failed to load email")
      }

      expect(result.ok).toBe(true)
      const found = result.value
      expect(found).not.toBeNull()
      expect(found?._id).toBe(seeded._id)
    })
  })

  describe("EmailsMutator", () => {
    it("creates an email and persists attachments properly", async () => {
      const mutator = new EmailsMutator()
      const baseEmailData = spawnEmail()

      const mockedParsedMailPayload = {
        ...baseEmailData,
        attachments: [
          {
            type: "attachment",
            content: Buffer.from("test content"),
            contentType: "text/plain",
            partId: "1",
            release: () => {},
            contentDisposition: "attachment",
            filename: "invoice.pdf",
            headers: new Map([
              ["content-type", "application/pdf"],
              ["content-disposition", 'attachment; filename="invoice.pdf"'],
            ]),
          },
          {
            type: "attachment",
            content: Buffer.from(""),
            contentType: "image/png",
            partId: "2",
            release: () => {},
            contentDisposition: "inline",
            headers: new Map([["content-type", "image/png"]]),
          },
        ],
      }

      const result = await mutator.createEmail(
        // @ts-ignore - simulating a ParsedMail payload structurally similar
        mockedParsedMailPayload,
        [],
      )

      if (!result.ok) {
        throw new Error("Failed to create email")
      }

      const created = result.value
      expect(created).toBeDefined()
      expect(typeof created._id).toBe("string")
      expect(created.attachments).toHaveLength(2)

      // Validate mapping logic for filename and Map to Object conversion
      expect(created.attachments[0].fileName).toBe("invoice.pdf")
      expect(created.attachments[0].headers).toEqual({
        "content-type": "application/pdf",
        "content-disposition": 'attachment; filename="invoice.pdf"',
      })

      // Validate fallback for missing filename
      expect(created.attachments[1].fileName).toBe("")
      expect(created.attachments[1].headers).toEqual({
        "content-type": "image/png",
      })

      const found = await emailsCollection.findOne({
        _id: created._id,
      })
      expect(found).not.toBeNull()
      expect(found?.attachments).toHaveLength(2)
      expect(found?.attachments[0].fileName).toBe("invoice.pdf")
    })

    it("deletes an email by id", async () => {
      const seeded = await seedEmail()
      const mutator = new EmailsMutator()

      await mutator.deleteEmail(seeded._id)
      const found = await emailsCollection.findOne({
        _id: seeded._id,
      })
      expect(found).toBeNull()
    })
  })
})
