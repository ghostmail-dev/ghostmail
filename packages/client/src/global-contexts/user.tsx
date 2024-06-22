import { createContext, useState } from "react"
import { getUsernameFromToken } from "~/lib/apollo-tokens"

export const UserContext = createContext<
  | [string | null, React.Dispatch<React.SetStateAction<string | null>>]
  | undefined
>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const userState = useState(getUsernameFromToken())

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  )
}
