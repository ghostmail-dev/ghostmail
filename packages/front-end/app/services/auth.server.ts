import { Authenticator } from "remix-auth"
import { sessionStorage } from "./session.server"
import { FormStrategy } from "remix-auth-form"
import { MailboxLoader } from "@ghostmail-packages/database"

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<{ username: string }>(
  sessionStorage
)

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const loader = new MailboxLoader()
    const email = form.get("email")
    const password = form.get("password")
    console.log({ email, password })
    if (!email || !password) {
      throw new Error("Email and password are required")
    }
    const isLoginValid = await loader.validateMailboxCredentials(
      email as string,
      password as string
    )
    console.log({ isLoginValid })
    // the type of this user must match the type you pass to the Authenticator
    // the strategy will automatically inherit the type if you instantiate
    // directly inside the `use` method
    if (!isLoginValid) {
      throw new Error("Invalid email or password")
    }
    return { username: email as string }
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  "user-pass"
)
