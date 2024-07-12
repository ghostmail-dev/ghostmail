import { ActionFunction, LoaderFunction } from "@remix-run/node"
import { useState } from "react"
import { authenticator } from "~/services/auth.server"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid"
import { Form } from "@remix-run/react"

export const loader: LoaderFunction = async ({ request }) => {
  // redirect from login page if user is already authenticated
  await authenticator.isAuthenticated(request, {
    successRedirect: "/mailbox",
  })

  return null
}

export const action: ActionFunction = async ({ request }) => {
  return await authenticator.authenticate("user-pass", request, {
    failureRedirect: "/login",
    successRedirect: "/mailbox",
  })
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const loading = false
  return (
    <div className="prose min-w-full flex justify-center">
      <Form
        className="w-full max-w-lg p-4 bg-base-100 rounded-lg shadow-lg flex flex-col gap-4 border-2 border-solid border-opacity-50"
        method="post"
      >
        <label className="input input-bordered flex items-center gap-2">
          {/* This makes eslint happy */}
          <EmailIcon />
          <input
            type="email"
            name="email"
            className="grow"
            placeholder="Email"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <KeyIcon />
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
      </Form>
    </div>
  )
}

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="w-4 h-4 opacity-70"
  >
    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
  </svg>
)

const KeyIcon = () => (
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
)
