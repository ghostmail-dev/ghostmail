import { deepEqual } from "fast-equals"
import {
  type IndexSpecification,
  type CreateIndexesOptions,
  type IndexDescriptionInfo,
  type Collection,
  MongoServerError,
} from "mongodb"
import { emailsCollection } from "./collections/email.js"
import { mailboxesCollection } from "./collections/mailbox.js"
import { usersCollection } from "./collections/users.js"
import { invitesCollection } from "./collections/invites.js"

/** Narrow type covering only the Collection methods needed for index management. */
type IndexManageableCollection = Pick<
  Collection,
  "collectionName" | "indexes" | "createIndex" | "dropIndex"
>

interface IndexDefinition {
  keys: IndexSpecification
  options?: CreateIndexesOptions
}

interface CollectionIndexes {
  [collectionName: string]: Array<IndexDefinition>
}

const dbIndexes: CollectionIndexes = {
  emailsCollection: [
    { keys: { messageId: 1 }, options: { unique: true } },
    { keys: { mailboxes: 1 } },
    { keys: { date: 1 }, options: { expireAfterSeconds: 3600 } },
  ],
  mailboxesCollection: [
    { keys: { username: 1 }, options: { unique: true } },
    { keys: { ownerId: 1 } },
    { keys: { expiresAt: 1 }, options: { expireAfterSeconds: 0 } },
  ],
  usersCollection: [{ keys: { username: 1 }, options: { unique: true } }],
  invitesCollection: [
    { keys: { code: 1 }, options: { unique: true } },
    { keys: { invitedBy: 1 } },
    { keys: { expiresAt: 1 }, options: { expireAfterSeconds: 0 } },
  ],
}

const getCurrentIndexes = async (
  collection: IndexManageableCollection,
): Promise<Array<IndexDescriptionInfo>> => {
  try {
    const indexes = await collection.indexes()
    return indexes
  } catch (error: unknown) {
    if (error instanceof MongoServerError && error.code === 26) {
      // NamespaceNotFound: collection does not exist, so we can treat it as having no indexes
      return []
    }
    console.error(
      "Unexpected error fetching indexes for collection",
      collection.collectionName,
      error,
    )
    return []
  }
}

const generateAutoIndexName = (spec: IndexSpecification): string => {
  // MongoDB's auto-naming convention: field1_direction1_field2_direction2
  return Object.entries(spec)
    .map(([field, direction]) => `${field}_${direction}`)
    .join("_")
}

const ensureIndexName = (indexDef: IndexDefinition): CreateIndexesOptions => {
  return {
    ...indexDef.options,
    name: indexDef.options?.name ?? generateAutoIndexName(indexDef.keys),
  }
}

const indexOptionsEqual = (
  existingOpts: IndexDescriptionInfo,
  proposedOpts: CreateIndexesOptions,
): boolean => {
  // Compare only the intersection of keys
  for (const key in proposedOpts) {
    if (key in existingOpts) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const aVal = existingOpts[key as keyof IndexDescriptionInfo]
      const bVal = proposedOpts[key as keyof CreateIndexesOptions]
      if (aVal !== bVal) {
        return false
      }
    } else {
      return false
    }
  }

  return true
}

/**
 * Synchronizes MongoDB indexes across all known collections to match the
 * definitions in {@link dbIndexes}.
 *
 * For each collection the function will:
 * 1. Create any indexes that are defined but do not yet exist.
 * 2. Recreate (drop then create) any indexes whose options have drifted from
 *    the expected definition.
 * 3. Drop any non-default indexes that are present in the database but not
 *    defined in {@link dbIndexes}.
 *
 * The default `_id` index is always preserved.
 */
const syncIndexes = async (): Promise<void> => {
  console.info("Starting index synchronization...")

  const collectionMap: Record<string, IndexManageableCollection> = {
    emailsCollection,
    mailboxesCollection,
    usersCollection,
    invitesCollection,
  }

  for (const [collectionName, expectedIndexes] of Object.entries(dbIndexes)) {
    console.info(`--- Processing collection: ${collectionName} ---`)

    const collection = collectionMap[collectionName]
    const currentIndexes = await getCurrentIndexes(collection)

    // Add missing indexes
    for (const expectedIndex of expectedIndexes) {
      const existingIndex = currentIndexes.find(
        (current) =>
          deepEqual(current.key, expectedIndex.keys) ||
          current.name === ensureIndexName(expectedIndex).name,
      )

      let shouldCreateIndex = false
      let shouldDropFirst = false

      if (existingIndex == null) {
        // Index doesn't exist, need to create it
        shouldCreateIndex = true
      } else {
        // Index exists, check if options match
        if (!indexOptionsEqual(existingIndex, ensureIndexName(expectedIndex))) {
          shouldDropFirst = true
          shouldCreateIndex = true
        }
      }

      if (shouldDropFirst && existingIndex?.name != null) {
        try {
          await collection.dropIndex(existingIndex.name)
        } catch (error) {
          console.error(`✗ Failed to drop index ${existingIndex.name}:`, error)
          continue // Skip recreation if we can't drop
        }
      }

      if (shouldCreateIndex) {
        try {
          const indexName =
            expectedIndex.options?.name ??
            generateAutoIndexName(expectedIndex.keys)
          await collection.createIndex(
            expectedIndex.keys,
            expectedIndex.options,
          )
          console.info(
            `✓ Successfully ${shouldDropFirst ? "recreated" : "created"} index: ${indexName}`,
          )
        } catch (error) {
          console.error(
            `✗ Failed to create index on ${collection.collectionName}:`,
            error,
          )
        }
      }
    }

    // Remove unused indexes
    for (const currentIndex of currentIndexes) {
      // Skip the default _id index
      if (currentIndex.name === "_id_") {
        continue
      }

      const isExpected = expectedIndexes.some(
        (expected) =>
          deepEqual(expected.keys, currentIndex.key) ||
          ensureIndexName(expected).name === currentIndex.name,
      )

      if (!isExpected && currentIndex.name != null) {
        try {
          console.info(
            `Removing unused index from ${collection.collectionName}: ${currentIndex.name}`,
          )
          await collection.dropIndex(currentIndex.name)
          console.info(`✓ Successfully dropped index: ${currentIndex.name}`)
        } catch (error) {
          console.error(
            `✗ Failed to drop index ${currentIndex.name} from ${collection.collectionName}:`,
            error,
          )
        }
      }
    }
  }

  console.info("✓ Index synchronization completed!")
}

export { syncIndexes }
