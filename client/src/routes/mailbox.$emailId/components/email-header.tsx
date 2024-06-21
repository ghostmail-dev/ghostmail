import { GetEmailQuery } from "../gql/get-email.operation"

export const EmailHeader = (props: {
  email: NonNullable<GetEmailQuery["email"]>
}) => {
  return (
    <div className="email-header">
      <ul className="list-none list-outside">
        <li>From: {props.email.fromText}</li>
        <li>To: {props.email.toText}</li>
        <li>Subject: {props.email.subject}</li>
        <li>Date: {props.email.date} </li>
      </ul>
    </div>
  )
}
