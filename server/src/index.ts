import { smtpServer } from "./smtp"
import { startApolloServer } from "./apollo-server/server"

await startApolloServer()
smtpServer.listen(2525)
