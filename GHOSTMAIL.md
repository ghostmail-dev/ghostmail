# Ghostmail

![Node](https://img.shields.io/badge/node-%3E=24-brightgreen)
![pnpm](https://img.shields.io/badge/pnpm-workspaces-f69220)
![architecture](https://img.shields.io/badge/architecture-monorepo-blue)
![license](https://img.shields.io/badge/license-MIT-lightgrey)

Ghostmail is an ephemeral email system built as a PNPM monorepo. It ingests emails via SMTP, stores them in MongoDB with TTL expiration, and exposes a React Router v7 frontend.

---

## 🧱 Monorepo Structure

```
/packages
├── smtp-server
│   └──server.ts
│
├── database
│   ├── collections
│   │   ├── email.ts
│   │   ├── mailbox.ts
│   │   └── users.ts
│   ├── models
│   │   ├── email.ts
│   │   ├── mailbox.ts
│   │   └── users.ts
│   ├── test-utils
│   │   ├── spawnEmail.ts
│   │   ├── spawnMailbox.ts
│   │   └── spawnUser.ts
│   ├── connection.ts
│   └── index.ts
│   MongoDB
│   - TTL indexes for email expiration
│   - Use `dataloader` for DAL
│
├── client
│   ├── app
│   │   ├── routes
│   │   │   ├── <route_name>
│   │   │   │   ├── route.tsx
│   │   │   │   ├── components
│   │   │   │   │   ├── <component_name>.tsx
│   │   │   │   │   └── <component_name>.test.tsx
│   │   │   │   ├── hooks
│   │   │   │   │   ├── <hook_name>.tsx
│   │   │   │   │   └── <hook_name>.test.tsx
│   │   │   │   ├── utils
│   │   │   │   │   ├── <utils_name>.tsx
│   │   │   │   │   └── <utils_name>.test.tsx
│   │   │   │   ├── definitions
│   │   │   │   │   └── <definition_name>.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── index.test.tsx
│   ├── components
│   │   ├── <component_name>.tsx
│   │   └── <component_name>.test.tsx
│   ├── hooks
│   │   ├── <hook_name>.tsx
│   │   └── <hook_name>.test.tsx
│   ├── utils
│   │   ├── <utils_name>.tsx
│   │   └── <utils_name>.test.tsx
│   ├── definitions
│   │   └── <definition_name>.ts
│   ├── index.ts
│   └── index.test.tsx
    React Router v7 frontend (Vite)
    - Ephemeral inbox UI
    - User can create mailboxes
    - User can view emails in mailboxes
    - User can delete mailboxes
    - User can delete emails

```

---

## 🔗 Dependency Boundaries

Allowed:

- smtp-server → database
- client → database through `loaders` and `actions`
- database → standalone

Forbidden:

- smtp-server → client
- circular dependencies
- direct MongoDB access outside database package

---

## ⚙️ Tooling

- pnpm workspaces
- Node.js 24+
- React Router v7 (framework mode)
- Vite
- Vitest
- OXC (oxlint + oxfmt)

---

## 🎨 Formatting Rules (oxfmt)

- No semicolons
- Double quotes only

Example:
const message = "Hello world"

---

## 🧹 Lint Rules (oxlint)

- No `any` types
- Sorted imports required
- No unused variables
- Prefer explicit typing in shared packages

---

## 📦 Scripts

Root scripts:
{
"dev": "pnpm -r dev",
"build": "pnpm -r build",
"lint": "oxlint .",
"format": "oxfmt .",
"test": "pnpm -r test"
}

smtp-server scripts:
{
"dev": "node --watch src/index.ts",
"build": "tsc -p tsconfig.json",
"start": "node dist/index.js"
}

database scripts:
{
"build": "tsc -p tsconfig.json",
"test": "node --test"
}

client scripts:
{
"dev": "vite",
"build": "vite build",
"preview": "vite preview"
}

---

## 📩 Domain Model and Architecture

- Test with https://github.com/jb-1980/vitest-environment-mongodb
- Use test-utils to spawn and persist data for testing. Should include at least two exports: `spawn*` and `seed*`. The `spawn*` functions should use faker to generate a random entity and have the signature `spawn<EntityName>(overrides?: Partial<Entity>): Entity`. The `seed*` functions should use the `spawn*` functions to generate a random entity and have the signature `seed<EntityName>(overrides?: Partial<Entity>): Promise<Entity>`.
- Emails are ephemeral
- MongoDB TTL enforces expiration
- Use defined collections:

```ts
// packages/database/src/models/example.ts
interface ExampleDocument {
  _id: ObjectId
  createdAt: Date
  updatedAt: Date
}

// packages/database/src/collections/example.ts
const exampleCollection = new Collection<ExampleDocument>("example")

export class ExampleLoader {}

export class ExampleMutator {}
```

#### Email Document

```ts
import { Attachment, HeaderValue, ParsedMail } from "mailparser"

export interface EmailAttachmentMapper extends Omit<Attachment, "headers"> {
  fileName: string
  headers: Record<string, HeaderValue>
}
interface EmailDocument extends Omit<ParsedMail, "attachments"> {
  _id: ObjectId
  attachments: EmailAttachmentMapper[]
}
```

#### Email DAL

```ts
import { EmailDocument } from "./models/email"

export class EmailsLoader {
  private batchEmails: DataLoader<ObjectId, EmailDocument | null>
  private batchEmailsByMessageId: DataLoader<string, EmailDocument | null>
  async getEmailById(id: ObjectId | string): Promise<EmailDocument | null>
  async getEmailByMessageId(messageId: string): Promise<EmailDocument | null>
  async getAllEmails(): Promise<EmailDocument[]>
}

export class EmailsMutator {
  async createEmail(email: Omit<ParsedMail, "_id">): Promise<EmailDocument>
  async deleteEmail(id: ObjectId | string): Promise<void>
}
```

#### Mailbox Document

```ts
type EmailDetails = {
  emailId: ObjectId
  sender: string | null
  subject: string | null
  date: Date
  isRead: boolean
}

/** A simple collection that keeps track of all the email accounts */
type MailboxDocument = {
  _id: ObjectId
  /** The firstname, generated from faker */
  firstName: string
  /** The last name, generated from faker */
  lastName: string
  /** email address: normalized first.last@domain */
  username: string
  /** password */
  password: string
  /** The emails in the mailbox */
  emails: EmailDetails[]
  createdAt: Date
}
```

#### Mailbox DAL

```ts
import { MailboxDocument } from "./models/mailbox"

export class MailboxesLoader {
  private batchMailboxes: DataLoader<ObjectId, MailboxDocument | null>
  async getMailboxByName(name: string): Promise<MailboxDocument | null>
  async validateMailboxCredentials(
    username: string,
    password: string
  ): Promise<boolean>
}

export class MailboxesMutator {
  async createMailbox(): Promise<MailboxDocument>
  async deleteMailbox(id: ObjectId | string): Promise<void>
  async readMail(emailId: string, username: string): Promise<void>
  async deliverMail(args: EmailDetails & { username: string }): Promise<void>
}
```

#### User Document

```ts
type UserDocument = {
  _id: ObjectId
  /** The firstname, generated from faker */
  username: string
  /** password hash */
  password: string
  /** The emails in the mailbox */
  apiKey: {
    key: string
    /** The date the key was created */
    createdAt: Date
    /** The date the key expires */
    expiresAt: Date
    /** How many tokens are left */
    tokens: number
  }
}
```

#### User DAL

```ts
import { UserDocument } from "./models/user"

export class UsersLoader {
  private batchUsersByApiKey: DataLoader<string, UserDocument | null>
  private batchUsersByUsername: DataLoader<string, UserDocument | null>
  async getUserByApiKey(apiKey: string): Promise<UserDocument | null>
  async getUserByName(name: string): Promise<UserDocument | null>
}

export class UsersMutator {
  async createUser(): Promise<UserDocument>
  async deleteUser(id: ObjectId | string): Promise<void>
  async createApiKey(username: string): Promise<UserDocument>
  async deleteApiKey(username: string): Promise<void>
  async rotateApiKey(
    oldApiKey: string,
    newApiKey: string
  ): Promise<UserDocument>
  async spendToken(apiKey: string): Promise<UserDocument>
  async refillTokens(apiKey: string, amount: number): Promise<UserDocument>
}
```

---

## 🧠 Architecture Principles

- Strict package isolation
- Database access centralized in /database
- Minimal dependencies

---

## 🚫 Anti-Patterns

- Direct MongoDB access outside database package
- Mixed formatting systems

---

## 📌 Philosophy

Ghostmail prioritizes:

- Simplicity
- Modularity
- Modern tooling (Vite + OXC + PNPM)
- TDD; Always write tests first
