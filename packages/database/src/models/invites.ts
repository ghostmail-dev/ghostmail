import { faker } from "@faker-js/faker"

export interface InviteDocument {
  /** A UUID representing the invite code */
  code: string
  /** The date and time when the invite was created */
  createdAt: Date
  /** The date and time when the invite expires */
  expiresAt: Date
  /** The username of the user who sent the invite */
  invitedBy: string
  /** The number of persistent tokens associated with the invite */
  persistentTokens: number
  /** The status of the invite (e.g., "active", "expired") */
  status: "active" | "expired" | "used"
  /** The username of the user who used the invite (null if not used) */
  usedBy: string | null
  /** The date and time when the invite was used (null if not used) */
  usedAt: Date | null
}

export interface SerializableInviteDocument extends Omit<
  InviteDocument,
  "expiresAt" | "createdAt" | "usedAt"
> {
  expiresAt: string
  createdAt: string
  usedAt: string | null
}

export function toInviteDTO(doc: InviteDocument): SerializableInviteDocument {
  return {
    code: doc.code,
    createdAt: doc.createdAt.toJSON(),
    expiresAt: doc.expiresAt.toJSON(),
    invitedBy: doc.invitedBy,
    persistentTokens: doc.persistentTokens,
    status: doc.status,
    usedBy: doc.usedBy,
    usedAt: doc.usedAt ? doc.usedAt.toJSON() : null,
  }
}

export function spawnInvite(
  overrides?: Partial<InviteDocument>,
): InviteDocument {
  const now = new Date().toJSON().slice(0, 10) // Get current date in YYYY-MM-DD format
  return {
    code: `INV-${now}-${faker.string.alphanumeric(8).toUpperCase()}`,
    createdAt: faker.date.recent(), // Created within the last few days
    expiresAt: faker.date.soon({ days: 30 }), // Expires within the next 30 days
    invitedBy: faker.internet.username(),
    persistentTokens: faker.number.int({ min: 1, max: 10 }),
    status: "active",
    usedBy: null,
    usedAt: null,

    ...overrides,
  } satisfies InviteDocument
}
