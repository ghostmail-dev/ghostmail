import { Outlet } from "react-router-dom"
import { Navbar } from "./components/navbar"
import { UserProvider } from "~/global-contexts/user"

export default function Root() {
  return (
    <UserProvider>
      <Navbar />
      <div className="flex justify-center p-5">
        <Outlet />
      </div>
    </UserProvider>
  )
}
