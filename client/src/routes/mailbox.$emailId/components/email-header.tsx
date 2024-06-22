import { GetEmailQuery } from "../gql/get-email.operation"

export const EmailHeader = (props: {
  email: NonNullable<GetEmailQuery["email"]>
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <tbody>
          <tr>
            <td>From: {props.email.fromText}</td>
          </tr>
          <tr>
            <td>To: {props.email.toText}</td>
          </tr>
          <tr>
            <td>Subject: {props.email.subject}</td>
          </tr>
          <tr>
            <td>Date: {props.email.date}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
