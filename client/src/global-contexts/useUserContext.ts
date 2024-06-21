import { useContext } from "react"
import { UserContext } from "./user"

export const useUserContext = () => {
  const data = useContext(UserContext)
  if (!data) {
    throw new Error("useUserContext must be used within a UserProvider")
  }
  return data
}
