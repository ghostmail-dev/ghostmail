import { useState } from "react"
import { useLoginMutation } from "./gql/login-mutation.operation"
import { Navigate, useNavigate } from "react-router-dom"
import { useUserContext } from "~/global-contexts/useUserContext"
import { getUsernameFromToken } from "~/lib/apollo-tokens"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid"

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useUserContext()
  const navigate = useNavigate()
  const [login, { loading }] = useLoginMutation({
    onCompleted: () => {
      const _username = getUsernameFromToken()
      setUsername(_username)
      navigate("/mailbox")
    },
  })

  if (username) {
    return <Navigate to="/mailbox" />
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    login({ variables: { username: email, password } })
  }
  return (
    <div className="prose min-w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4 bg-base-100 rounded-lg shadow-lg flex flex-col gap-4 border-2 border-solid border-opacity-50"
      >
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="text"
            name="email"
            className="grow"
            placeholder="Email"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            className="grow"
            placeholder="Password"
          />
          {showPassword ? (
            <EyeIcon
              className="cursor-pointer h-5 w-5 text-gray-400"
              aria-hidden="true"
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <EyeSlashIcon
              className="cursor-pointer h-5 w-5 text-gray-400 "
              aria-hidden="true"
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </label>
        <button
          type="submit"
          disabled={loading}
          className={`btn btn-neutral w-full mt-4`}
        >
          Login
        </button>
      </form>
    </div>
  )
}
