import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import express from "express"
import http from "http"
import cors from "cors"
import { ApolloContextType, apolloContextFunction } from "./context"
import { resolvers } from "./resolvers.generated"
import { typeDefs } from "./type-defs.generated"

// Required logic for integrating with Express
export const app = express()
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app)

const whitelist = process.env.CORS_ORIGIN

if (!whitelist) {
  throw new Error("CORS_ORIGIN is required")
}

export async function startApolloServer() {
  const server = new ApolloServer<ApolloContextType>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
  // const { url } = await startStandaloneServer(server, {
  //   listen: { port: 4040, path: "/graphql" },
  //   context: apolloContextFunction,
  // })

  // Ensure we wait for our server to start
  await server.start()
  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: whitelist.split(","),
      credentials: true,
    }),
    // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
    express.json({ limit: "1mb" }),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: apolloContextFunction,
    })
  )

  // Modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4040 }, resolve)
  )
  console.info(`🚀 Apollo Server ready at http://localhost:4040/graphql`)

  return server
}
