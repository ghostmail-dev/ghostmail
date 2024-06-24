import { GetEmailQuery } from "../gql/get-email.operation"

export const Attachments = ({
  attachments,
}: {
  attachments: NonNullable<GetEmailQuery["email"]>["attachments"][]
}) => {
  return (
    <div>
      {attachments?.map((attachment: any, index: number) => (
        <div key={index}>
          <h3>{attachment.generatedFileName}</h3>
          <p>{attachment.transferEncoding}</p>
          <p>{attachment.contentType}</p>
          <p>{attachment.size}</p>
        </div>
      ))}
    </div>
  )
}
