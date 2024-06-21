import type {
  Collection as TCollection,
  CollectionOptions,
  Document,
} from "mongodb"
import { MongoClient } from "mongodb"

const { MONGO_CONNECTION_STRING } = process.env
if (!MONGO_CONNECTION_STRING) {
  throw new Error(
    "Please define the MONGO_CONNECTION_STRING environment variable inside .env"
  )
}

// adding an `appName` to the connection string helps with monitoring and analytics
// in the MongoDB Atlas UI
const connectionString = !MONGO_CONNECTION_STRING.includes("appName")
  ? MONGO_CONNECTION_STRING.includes("?")
    ? `${MONGO_CONNECTION_STRING}&appName=ghostmail`
    : `${MONGO_CONNECTION_STRING}?appName=ghostmail`
  : MONGO_CONNECTION_STRING.replace(
      /appName=([a-z0-9]*)/i,
      () => `appName=ghostmail`
    )

// MongoDB Client is a singleton and should only be instantiated once (rather than multiple times in tests or request handlers, for example)
let mongoClient: MongoClient
const _global = globalThis as unknown as {
  mongoClient: MongoClient | undefined
}

if (process.env.NODE_ENV === "production") {
  mongoClient = new MongoClient(connectionString)
} else {
  if (!_global.mongoClient) {
    mongoClient = new MongoClient(connectionString)
    _global.mongoClient = mongoClient
    const dbName = mongoClient.options.dbName
    if (!dbName) {
      console.error(
        `Database name not found in connection string: ${connectionString}`
      )
      process.exit(1)
    }
  } else {
    mongoClient = _global.mongoClient
  }
}

process.on("exit", () => {
  console.info("EXIT - MongoDB Client disconnecting")
  mongoClient.close()
})

/** Implements a mongo collection
 * @param name - The name of the collection
 * @param options - Optional settings for the collection
 * @returns The collection
 * @example
 * const Users = MongoCollection<User>("users")
 * // then use like
 * const getUser = async (_id: string) => {
 *  return await Users.findOne({ _id })
 * }
 */
export const MongoCollection = <TSchema extends Document>(
  name: string,
  options?: CollectionOptions
): TCollection<TSchema> => {
  return mongoClient.db().collection<TSchema>(name, options)
}

export const mongoDB = mongoClient.db()

export { mongoClient }
