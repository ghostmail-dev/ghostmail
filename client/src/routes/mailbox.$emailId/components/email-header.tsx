import { GetEmailQuery } from "../gql/get-email.operation"

export const EmailHeader = (props: {
  email: NonNullable<GetEmailQuery["email"]>
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <tbody>
          {/* // <div className="email-header">
    //   <ul className="list-none list-outside">
    //     <li>From: {props.email.fromText}</li>
    //     <li>To: {props.email.toText}</li>
    //     <li>Subject: {props.email.subject}</li>
    //     <li>Date: {props.email.date} </li>
    //   </ul>
    // </div> */}
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
