import { GhostMailLogo } from "./GhostmailLogo"

export const AuthenticationCard = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-white">
      <div className="card w-full max-w-sm shadow-xl bg-base-200">
        <div className="card-body gap-4">
          <div className="flex justify-center items-center gap-2">
            <GhostMailLogo className="w-16 h-16" />
            <h1 className="text-4xl font-bold text-center">Ghostmail</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
