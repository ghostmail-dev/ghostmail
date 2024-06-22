import { useParams } from "react-router-dom"
import { EmailHeader } from "./components/email-header"
import { useGetEmailQuery } from "./gql/get-email.operation"
import { Messages } from "../mailbox/components/messages"
import { useState } from "react"

export const Email = () => {
  const { emailId } = useParams()
  const [leftWidth, setLeftWidth] = useState(50) // Initial width in percentage
  const [isDragging, setIsDragging] = useState(false)

  const startDragging = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    e.preventDefault()
  }

  const stopDragging = () => {
    if (isDragging) {
      setIsDragging(false)
    }
  }

  const drag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newWidth = (e.clientX / window.innerWidth) * 100
      setLeftWidth(newWidth)
    }
  }

  const { data, loading, error } = useGetEmailQuery({
    variables: {
      id: emailId ?? "",
    },
  })
  if (loading || data === undefined) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const email = data.email
  return (
    email && (
      <div
        className="flex w-full h-full"
        onMouseMove={drag}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        <div
          style={{ width: `${leftWidth}%` }}
          className="border-r-4 border-gray-200"
        >
          <Messages />
        </div>
        <div
          className="cursor-col-resize"
          style={{ width: "10px", cursor: "ew-resize" }}
          onMouseDown={startDragging}
        />
        <div style={{ width: `${100 - leftWidth}%` }}>
          <EmailHeader email={email} />
          <div
            className="bg-white shadow-md rounded-lg px-4 m-4 border border-gray-200"
            dangerouslySetInnerHTML={{
              __html: email.html ?? email.textAsHtml ?? email.text ?? "",
            }}
          />
        </div>
      </div>
    )
  )
}
