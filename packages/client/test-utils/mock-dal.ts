import type {
  MailboxDocument,
  EmailDocument,
  UserDocument,
  EmailDetails,
} from "@ghostmail/database"

/**
 * Stateful memory persistence mapped locally ensuring
 * React Router Loaders/Actions naturally reflect DB side effects.
 */
const mailboxes = new Map<string, MailboxDocument>()
const emails = new Map<string, EmailDocument>()
const users = new Map<string, UserDocument>()

export function resetMockDatabase() {
  mailboxes.clear()
  emails.clear()
  users.clear()
}

export class MockMailboxesLoader {
  async getMailboxByName(name: string) {
    return mailboxes.get(name) ?? null
  }

  async validateMailboxCredentials(username: string, password: string) {
    const mailbox = mailboxes.get(username)
    return mailbox ? mailbox.password === password : false
  }
}

export class MockMailboxesMutator {
  async createMailbox(overrides?: Partial<MailboxDocument>) {
    const username =
      overrides?.username ?? `testuser-${Math.random()}@ghostmail.localhost`
    const doc = {
      _id: overrides?._id ?? (("mock-id-" + Math.random()) as unknown),
      firstName: overrides?.firstName ?? "Test",
      lastName: overrides?.lastName ?? "User",
      username,
      password: overrides?.password ?? "mockpass",
      emails: overrides?.emails ?? [],
      createdAt: overrides?.createdAt ?? new Date(),
    } as unknown as MailboxDocument

    mailboxes.set(username, doc)
    return doc
  }

  async deleteMailbox(_id: unknown) {
    // Basic mock logic
  }

  async deliverMail(args: EmailDetails & { username: string }) {
    const m = mailboxes.get(args.username)
    if (m) m.emails.push(args)
  }

  async readMail(_id: string, _username: string) {
    // Basic mock logic
  }
}

export class MockEmailsLoader {
  async getEmailById(id: unknown) {
    return emails.get(String(id)) ?? null
  }

  async getEmailByMessageId(messageId: string) {
    for (const email of emails.values()) {
      if (email.messageId === messageId) return email
    }
    return null
  }
}

export class MockEmailsMutator {
  async createEmail(data: Partial<EmailDocument>) {
    const _id = "mock-email-" + Math.random()
    const doc = { ...data, _id: _id as unknown } as unknown as EmailDocument
    emails.set(_id, doc)
    return doc
  }

  async deleteEmail(id: unknown) {
    emails.delete(String(id))
  }
}

export class MockUsersLoader {
  async getUserById(id: unknown) {
    return users.get(String(id)) ?? null
  }
  async getUserByApiKey(key: string) {
    for (const user of users.values()) {
      if (user.apiKey?.key === key) return user
    }
    return null
  }
}

export class MockUsersMutator {
  async createUser(_data: Partial<UserDocument>) {
    return {} as unknown as UserDocument
  }
  async rotateApiKey(_id: unknown) {}
  async spendCredits() {}
}
