import * as dotenv from "dotenv"
import path from "node:path"

dotenv.config({
  path: path.join(__dirname, "../test.env"),
})

export default async function setup() {}
