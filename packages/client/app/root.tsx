import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router"
import type { ReactNode } from "react"
import "./styles/index.css"
import { LogOut, Moon, Settings, Sun, User } from "lucide-react"
import { requireAuth } from "./utils/session.server"
import { GhostMailLogo } from "./components/GhostmailLogo"
import { getTheme, toggleTheme } from "./utils/theme-changer"
import { buildMeta } from "./utils/seo"

export const links = () => [
  {
    rel: "icon",
    href: "/ghostmail-light.png",
    media: "(prefers-color-scheme: light)",
    type: "image/png",
  },
  {
    rel: "icon",
    href: "/ghostmail-dark.png",
    media: "(prefers-color-scheme: dark)",
    type: "image/png",
  },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap",
  },
]

export const meta: MetaFunction = ({ location }) => {
  return buildMeta({ pathname: location.pathname })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const user = await requireAuth(request)
    return user
  } catch {
    return null
  }
}

export function Layout({ children }: { children: ReactNode }) {
  const user = useLoaderData<typeof loader>()

  const theme = getTheme()
  return (
    <html lang="en" data-theme={theme}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header className="bg-base-200 border-b border-base-300 px-4 md:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <GhostMailLogo className="w-8 h-8" />
            <span className="text-lg font-semibold">GhostMail</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm btn-square"
              aria-label="Toggle theme"
            >
              <Moon className="w-4 h-4 dark:hidden" />
              <Sun className="w-4 h-4 hidden dark:block" />
            </button>

            {user ? (
              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="btn btn-ghost btn-sm btn-circle avatar"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2 border border-base-300 z-50"
                >
                  <li>
                    <Link
                      to={`/settings/${user.userId}/password`}
                      className="text-sm flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </Link>
                  </li>
                  <li>
                    <Form method="post" action="/logout">
                      <button
                        type="submit"
                        className="text-sm flex no-wrap items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </Form>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-ghost" aria-label="Login">
                Login
              </Link>
            )}
          </div>
        </header>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function HydrateFallback() {
  return null
}
