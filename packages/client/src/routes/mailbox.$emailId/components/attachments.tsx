import { ArrowDownIcon, DocumentIcon } from '@heroicons/react/20/solid';
import { GetEmailQuery } from '../gql/get-email.operation';

export const Attachments = ({
  attachments,
}: {
  attachments: NonNullable<GetEmailQuery['email']>['attachments'][];
}) => {
  const attachmentCount = attachments.length;
  return (
    <div>
      <h2 className='prose-sm mb-0'>
        {attachmentCount >= 1
          ? `${attachmentCount} attachment${attachmentCount > 1 ? 's' : ''}`
          : ''}
      </h2>

      <div className='flex items-center flex-col justify-start'>
        {attachments?.map((attachment: any, index: number) => (
          <div
            key={index}
            className='flex items-center justify-start w-full p-2'
          >
            <DocumentIcon className='w-6 h-6 mr-2' />
            <a
              href={`data:application/octet-stream;base64,${attachment.content}`}
              download={attachment.filename}
            >
              {attachment.generatedFileName.length > 20 ? (
                <span title={attachment.generatedFileName}>
                  {attachment.generatedFileName.slice(0, 20)}...
                </span>
              ) : (
                attachment.generatedFileName
              )}
            </a>
            <span className='text-xs text-gray-400 ml-2'>
              {attachment.size} kb{attachment.size > 1 ? 's' : ''}
            </span>
            <div className='tooltip ml-4' data-tip='Download'>
              <button className='btn btn-sm btn-square'>
                <ArrowDownIcon className='w-5 h-5' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
