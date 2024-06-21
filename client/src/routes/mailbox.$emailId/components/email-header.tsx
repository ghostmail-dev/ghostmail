import { GetEmailQuery } from "../gql/get-email.operation"

export const EmailHeader = (props: {
  email: NonNullable<GetEmailQuery["email"]>
}) => {
  return (
    <div className="email-header">
      <ul>
        <li>From:</li>
        <li>To: </li>
        <li>Subject: {props.email.subject}</li>
        <li>Date: {props.email.date} </li>
      </ul>
    </div>
  )
}
