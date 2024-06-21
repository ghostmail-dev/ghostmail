// manage security tokens sent and received from the server

import { Buffer } from "buffer"

export interface tokens {
  accessToken: string
  refreshToken: string
}

export const setTokens = (tokens: tokens) => {
  localStorage.setItem("tokens", JSON.stringify(tokens))
}

export const getTokens = () => {
  const tokens = localStorage.getItem("tokens")
  if (!tokens) return null

  const parsedTokens = JSON.parse(tokens)
  if (!parsedTokens.accessToken || !parsedTokens.refreshToken) return null
  return {
    accessToken: parsedTokens.accessToken as string,
    refreshToken: parsedTokens.refreshToken as string,
  }
}

export const hasValidTokens = () => {
  const tokens = getTokens()
  if (!tokens) return false
  const { accessToken, refreshToken } = tokens
  return isTokenValid(accessToken) || isTokenValid(refreshToken)
}

export const clearTokens = () => {
  localStorage.removeItem("tokens")
}

// adapted from https://stackoverflow.com/a/69058154/2805154
const isTokenValid = (token: string) => {
  if (token?.length) {
    const payloadBase64 = token.split(".")[1]
    const decodedJson = Buffer.from(payloadBase64, "base64").toString()
    const expiration = JSON.parse(decodedJson).exp * 1000
    return Date.now() <= expiration
  } else return false
}

export const getUsernameFromToken = () => {
  const tokens = getTokens()
  if (!tokens) return null
  const accessToken = tokens.accessToken
  if (!accessToken) return null
  const payloadBase64 = accessToken.split(".")[1]
  const decodedJson = Buffer.from(payloadBase64, "base64").toString()
  return JSON.parse(decodedJson).username as string
}
