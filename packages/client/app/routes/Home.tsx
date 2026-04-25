import { Clock, Code, Eye, Inbox } from "lucide-react"
import { GhostMailLogo } from "../components/GhostmailLogo"
import { Link, redirect, type LoaderFunctionArgs } from "react-router"
import { requireAuth } from "../utils/session.server"

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    await requireAuth(request)
    return redirect("/mailboxes")
  } catch {
    return {}
  }
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full text-center">
          <div className="mb-8 flex justify-center">
            <GhostMailLogo className="w-32 h-32" />
          </div>

          <h1 className="text-3xl md:text-5xl mb-4">GhostMail</h1>
          <p className="text-lg md:text-xl text-base-content/70 mb-4 max-w-2xl mx-auto">
            Catch-all SMTP server for development teams
          </p>
          <p className="text-base text-base-content/60 mb-12 max-w-2xl mx-auto">
            Test email delivery without spamming real inboxes. Every message
            sent to any email address lands here, instantly visible and ready to
            inspect.
          </p>

          <Link to="/login" className="btn btn-primary btn-lg gap-2 mb-16">
            <Code className="w-5 h-5" />
            Start Testing
          </Link>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--accent-primary) 15%, transparent)",
                }}
              >
                <Inbox className="w-8 h-8 text-accent" />
              </div>
              <h3 className="mb-2">Catch-All Server</h3>
              <p className="text-sm text-base-content/60">
                Just point your app's smtp config at our @
                {import.meta.env.VITE_MAIL_DOMAIN} server to test email delivery
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Eye className="w-8 h-8 text-accent" />
              </div>
              <h3 className="mb-2">Instant Visibility</h3>
              <p className="text-sm text-base-content/60">
                View and debug emails in real-time as they arrive
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--accent-primary) 15%, transparent)",
                }}
              >
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <h3 className="mb-2">Ephemeral Testing</h3>
              <p className="text-sm text-base-content/60">
                Temporary inboxes auto-expire, keeping your workspace clean
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-sm text-base-content/50 border-t border-base-300">
        <p>
          &copy; {new Date().getFullYear()} GhostMail. SMTP testing for
          development teams.
        </p>
      </footer>
    </div>
  )
}
