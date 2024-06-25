import { useNavigate } from "react-router-dom"
import { EmailHeader } from "./components/email-header"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { Attachments } from "./components/attachments"
import { json, LoaderFunction } from "@remix-run/node"
import { authenticator } from "~/services/auth.server"
import { EmailsLoader } from "@ghostmail-packages/database"
import { useLoaderData } from "@remix-run/react"

export type EmailLoaderData = {
  _id: string
  html: string | null
  text: string | null
  textAsHtml: string | null
  subject: string | null
  date: string
  messageId: string | null
  fromText: string | null
  toText: string | null
  attachments: Array<{
    filename: string | null
    contentType: string | null
    contentDisposition: string | null
    contentId: string | null
    transferEncoding: string | null
    generatedFileName: string | null
    size: number | null
  } | null> | null
} | null

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  const emailId = params.emailId
  if (!emailId) throw new Error("Email ID is required")

  const emailLoader = new EmailsLoader()
  const email = await emailLoader.getEmailById(emailId)

  if (!email) {
    return null
  }
  return json<EmailLoaderData>({
    _id: emailId,
    html: email.html || null,
    text: email.text || null,
    textAsHtml: email.textAsHtml || null,
    subject: email.subject || null,
    date: email.date ? email.date.toISOString() : "",
    messageId: email.messageId || null,
    fromText: email.from ? email.from.text : null,
    toText: null,
    attachments: email.attachments.map((attachment) => ({
      filename: attachment.filename || null,
      contentType: attachment.contentType || null,
      contentDisposition: attachment.contentDisposition || null,
      contentId: attachment.contentId || null,
      transferEncoding: attachment.headers["content-transfer-encoding"] ?? null,
      generatedFileName: attachment.filename || null,
      size: attachment.size || null,
    })),
  })
}

export default function Email() {
  const email = useLoaderData<EmailLoaderData>()

  const navigate = useNavigate()

  return (
    email && (
      <div>
        <button className={`btn mt-4 ml-4`} onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </button>
        <EmailHeader email={email} />
        <div className="shadow-md rounded-lg px-4 m-4 border border-gray-200">
          <div
            dangerouslySetInnerHTML={{
              __html: email.html ?? email.textAsHtml ?? email.text ?? "",
            }}
          />
          {email.attachments && <Attachments attachments={email.attachments} />}
        </div>
      </div>
    )
  )
}
