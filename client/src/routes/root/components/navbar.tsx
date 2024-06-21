import { useEffect, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { useUserContext } from "~/global-contexts/useUserContext"

export const Navbar = () => {
  const [username] = useUserContext()
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <img
          src="ghostmail.png"
          alt="Ghostmail"
          className="h-12 w-12 mr-2 rounded-md"
        />
        <Link to="/" className="btn btn-ghost text-xl dark:prose-invert">
          Ghostmail
        </Link>
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink to="/" className="dark:prose-invert">
              Home
            </NavLink>
          </li>
          {username ? (
            <li>
              <NavLink to="/mailbox" className="dark:prose-invert">
                Mailbox
              </NavLink>
            </li>
          ) : null}
        </ul>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <ThemeController />
          </li>
          <li>
            {username ? (
              <Link to="/logout">Logout</Link>
            ) : (
              <Link to="/login" className="dark:prose-invert">
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  )
}

const ThemeController = () => {
  // use theme from local storage if available or set light theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")

  // update state on toggle
  const handleToggle: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.checked) {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  // set theme state in localstorage on mount & also update localstorage on state change
  useEffect(() => {
    localStorage.setItem("theme", theme)
    const localTheme = localStorage.getItem("theme") || "light"
    // add custom data-theme attribute to html tag required to update theme using DaisyUI
    document?.querySelector("html")?.setAttribute("data-theme", localTheme)
  }, [theme])

  return (
    <label className="swap swap-rotate">
      {/* this hidden checkbox controls the state */}
      <input
        type="checkbox"
        value="synthwave"
        className="toggle theme-controller bg-amber-300 border-sky-400 [--tglbg:theme(colors.sky.500)] checked:bg-blue-300 checked:border-blue-800 checked:[--tglbg:theme(colors.blue.900)] row-start-1 col-start-1 col-span-2"
        checked={theme === "dark"}
        onChange={handleToggle}
      />
    </label>
  )
}
