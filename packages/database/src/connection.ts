import { MongoClient } from "mongodb"

const { MONGODB_URI } = process.env
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  )
}

// adding an `appName` to the connection string helps with monitoring and analytics
// in the MongoDB Atlas UI
const connectionString = !MONGODB_URI.includes("appName")
  ? MONGODB_URI.includes("?")
    ? `${MONGODB_URI}&appName=<app-name>`
    : `${MONGODB_URI}?appName=<app-name>`
  : MONGODB_URI.replace(/appName=([a-z0-9]*)/i, () => `appName=<app-name>`)

// Features like watch mode or hot reloading in development can create multiple instances of the client, with multiple
// connections. This will inevitably overwhelm the database. So we need to ensure that only one instance exists at a time.
// I found this pattern in the Prisma docs, and found it works equally well here:
// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
let mongoClient: MongoClient

// just helping typescript know what we are trying to do
declare global {
  var __db: MongoClient | undefined
}

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
  // in production or test, we are fine setting it up once without globals
  mongoClient = new MongoClient(connectionString)
  const dbName = mongoClient.options.dbName
  if (!dbName) {
    console.error(
      `Database name not found in connection string: ${connectionString}`
    )
    process.exit(1)
  }
} else {
  // in development, we need to check if there is already an instance of the client.
  if (!global.__db) {
    // If not, we create a new one
    mongoClient = new MongoClient(connectionString)
    const dbName = mongoClient.options.dbName
    if (!dbName) {
      console.error(
        `Database name not found in read connection string: ${connectionString}`
      )
      process.exit(1)
    }
    global.__db = mongoClient
  } else {
    // otherwise just use the current connection
    mongoClient = global.__db
  }
}

// Ensure that if the server process is killed, mongo gracefully closes the connection.
if (process.env.NODE_ENV !== "test") {
  process.on("exit", () => {
    console.info("EXIT - MongoDB Client disconnecting")
    mongoClient.close()
  })
}

// Most features can be accessed from the database instance,
export const mongoDB = mongoClient.db()

// but there may be a need for calling some other methods on the client, so we export that as well
export { mongoClient }
