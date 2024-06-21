import { mongoDB } from "../database/connection"
export const resetMongo = async () => {
  await mongoDB.dropDatabase()
}
