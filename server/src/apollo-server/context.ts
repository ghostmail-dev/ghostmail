import { ContextFunction } from "@apollo/server"
import { generateDataSources } from "../gql-modules/datasources"
import { Request, Response } from "express"
import { signTokens, validateAccessToken, validateRefreshToken } from "./jwt"
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4"

export interface ApolloContextType {
  /** the email address of the authenticated user */
  username: string
  dataSources: ReturnType<typeof generateDataSources>
  setAuthToken: (username: string) => void
}

// useful util for testing
export const getApolloContextReturnValue = (
  username: string,
  res: Response
): ApolloContextType => {
  return {
    username,
    dataSources: generateDataSources(),
    setAuthToken: (username: string) => {
      const { accessToken, refreshToken } = signTokens(username)
      res.set({
        "Access-Control-Expose-Headers": ["x-access-token", "x-refresh-token"],
        "x-access-token": accessToken,
        "x-refresh-token": refreshToken,
      })
    },
  }
}

export const apolloContextFunction: ContextFunction<
  [ExpressContextFunctionArgument],
  ApolloContextType
> = async ({ req, res }): Promise<ApolloContextType> => {
  const username = getUsernameFromToken({ req, res })
  return getApolloContextReturnValue(username, res)
}

function getUsernameFromToken({
  req,
  res,
}: ExpressContextFunctionArgument): string | null {
  // Note that 'null' may come across the wire as a string
  const accessTokenHeader = req.headers["x-access-token"]
  const refreshTokenHeader = req.headers["x-refresh-token"]

  let accessToken = Array.isArray(accessTokenHeader)
    ? accessTokenHeader[0]?.replace(/^null$/, "")
    : accessTokenHeader?.replace(/^null$/, "")

  let refreshToken = Array.isArray(refreshTokenHeader)
    ? accessTokenHeader[0]?.replace(/^null$/, "")
    : refreshTokenHeader?.replace(/^null$/, "")

  console.log({
    accessToken,
    refreshToken,
  })
  if (accessToken) {
    const decodedAccessToken = validateAccessToken(accessToken)
    if (!decodedAccessToken || typeof decodedAccessToken === "string") {
      return null
    }
    let username = decodedAccessToken.username
    if (username) {
      return username
    }

    // access token may have expired so check the refresh token
    if (refreshToken) {
      const tokenUser = validateRefreshToken(refreshToken)
      if (!tokenUser || typeof tokenUser === "string") {
        return null
      }
      /* refresh the tokens and make them available through headers to the client
       * this allows the client to transparently get refreshed headers without
       * requiring a separate GraphQL query request */
      username = tokenUser.username
      ;({ accessToken, refreshToken } = signTokens(username))
      res.set({
        "Access-Control-Expose-Headers": ["x-access-token", "x-refresh-token"],
        "x-access-token": accessToken,
        "x-refresh-token": refreshToken,
      })
      return username
    }
  } else
    console.info(
      `Invalid/expired access token presented but refreshToken null or missing!`
    )
  return null
}
