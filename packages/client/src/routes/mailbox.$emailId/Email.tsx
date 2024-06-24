import { useNavigate, useParams } from 'react-router-dom'
import { EmailHeader } from './components/email-header'
import { useGetEmailQuery } from './gql/get-email.operation'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { Attachments } from './components/attachments'

export const Email = () => {
  const { emailId } = useParams()
  const navigate = useNavigate()
  const { data, loading, error } = useGetEmailQuery({
    variables: {
      id: emailId ?? '',
    },
  })
  if (loading || data === undefined) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const email = data.email
  return (
    email && (
      <div>
        <button className={`btn mt-4 ml-4`} onClick={() => navigate(-1)}>
          <ArrowLeftIcon className='w-4 h-4 mr-2' />
          Back
        </button>
        <EmailHeader email={email} />
        <div className='shadow-md rounded-lg px-4 m-4 border border-gray-200'>
          <div
            dangerouslySetInnerHTML={{
              __html: email.html ?? email.textAsHtml ?? email.text ?? '',
            }}
          />
          <Attachments attachments={email.attachments} />
        </div>
      </div>
    )
  )
}
