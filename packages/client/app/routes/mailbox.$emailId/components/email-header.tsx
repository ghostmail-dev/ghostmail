import { EmailLoaderData } from "../route"

export const EmailHeader = (props: { email: NonNullable<EmailLoaderData> }) => {
  return (
    <div className="prose overflow-x-auto shadow-md rounded-lg  m-4 border border-gray-200">
      <table className="table mt-0 mb-0">
        <tbody>
          <tr>
            <td className="prose">
              From: <b>{props.email.fromText}</b>
            </td>
          </tr>
          <tr>
            <td className="prose">
              To: <b>{props.email.toText}</b>
            </td>
          </tr>
          <tr>
            <td className="prose">
              Subject: <b>{props.email.subject}</b>
            </td>
          </tr>
          <tr>
            <td className="prose">
              Date: <b>{props.email.date}</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
