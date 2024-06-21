import { ApolloLink, HttpLink, from } from "@apollo/client"
import { getTokens, setTokens } from "./apollo-tokens"

import { setContext } from "@apollo/client/link/context"

const httpLink = new HttpLink({ uri: "http://localhost:4040/graphql" })

// get the access and refresh tokens from localStorage and use them to set the request headers
const authLink = setContext(async (_, { headers }) => {
  const tokens = getTokens()
  console.log({ tokens })
  return {
    headers: {
      ...headers,
      "x-access-token": "breaker", //tokens?.accessToken,
      "x-refresh-token": tokens?.refreshToken,
    },
  }
})

// our Apollo server is regularly sending new access and refresh tokens in
// the response headers. These need to be extracted and pushed to localStorage
// See https://zach.codes/access-response-headers-in-apollo-client/

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext()
    console.dir({
      context,
      values: context.headers.values,
    })
    const accessToken = context.response.headers.get("X-Access-Token")
    const refreshToken = context.response.headers.get("x-refresh-token")

    console.log({
      accessToken,
      refreshToken,
    })
    if (accessToken || refreshToken) setTokens({ accessToken, refreshToken })

    if (typeof response !== "object")
      console.error(`Response is of type ${typeof response}, expected object`)
    return response
  })
})

// see https://www.apollographql.com/docs/react/api/link/introduction/#additive-composition
export const link = from([authLink, afterwareLink, httpLink])
