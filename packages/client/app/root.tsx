import {
  json,
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"
import "./tailwind.css"
import { LoaderFunction } from "@remix-run/node"
import { authenticator } from "./services/auth.server"
import { ThemeProvider } from "./contexts/theme"
import { Navbar } from "./components/navbar"
import darkGhostmail from "./images/ghostmail-dark.png"
import lightGhostmail from "./images/ghostmail-light.png"
import { useTheme } from "./contexts/useTheme"

type LoaderData = {
  username: string
} | null
export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request)
  return json<LoaderData>(user)
}

export const meta: MetaFunction = () => [{ title: "Ghostmail" }]

const ThemedLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme()
  return (
    <html lang="en" data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          type="image/png"
          href={lightGhostmail}
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          type="image/png"
          href={darkGhostmail}
          media="(prefers-color-scheme: dark)"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemedLayout>{children}</ThemedLayout>
    </ThemeProvider>
  )
}

export default function App() {
  const user = useLoaderData<LoaderData>()
  return (
    <>
      <Navbar username={user ? user.username : null} />
      <div className="flex p-5">
        <Outlet />
      </div>
    </>
  )
}
