// function to set jwts
// see https://www.richardkotze.com/coding/json-web-tokens-using-apollo-graphql

import jwt from "jsonwebtoken"

const { sign, verify } = jwt

export const signTokens = (username: string) => {
  // if you want to include more than the user's id in the JWT then include it here
  const token = { username }
  const accessToken = sign(token, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_DURATION,
  })
  const refreshToken = sign(token, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_DURATION,
  })
  return { username, accessToken, refreshToken }
}

// the following two functions wrap verify() in a try/catch to muffle expired jwt errors
export const validateAccessToken = (token: string) => {
  try {
    return verify(token, process.env.ACCESS_TOKEN_SECRET)
  } catch (error) {
    if (error.message !== "jwt expired")
      console.error(`Access token error: ${error.message}`)
    else console.error(error)
  }
}

export const validateRefreshToken = (token: string) => {
  try {
    return verify(token, process.env.REFRESH_TOKEN_SECRET)
  } catch (error) {
    if (error.message !== "jwt expired")
      console.error(`Refresh token error: ${error.message}`)
  }
}
