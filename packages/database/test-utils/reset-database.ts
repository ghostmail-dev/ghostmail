import { mongoDB } from "../connection"

export const resetDatabase = async () => await mongoDB.dropDatabase()
