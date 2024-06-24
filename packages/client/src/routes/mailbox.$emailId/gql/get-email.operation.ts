import * as Types from "~/gql/types.generated";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type GetEmailQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type GetEmailQuery = {
  __typename: "Query";
  email: {
    __typename: "Email";
    _id: string;
    html: string | null;
    text: string | null;
    textAsHtml: string | null;
    subject: string | null;
    date: any;
    messageId: string | null;
    fromText: string | null;
    toText: string | null;
    attachments: Array<{
      __typename: "EmailAttachment";
      filename: string | null;
      contentType: string | null;
      contentDisposition: string | null;
      contentId: string | null;
      transferEncoding: string | null;
      generatedFileName: string | null;
      size: number | null;
    } | null> | null;
  } | null;
};

export const GetEmailDocument = gql`
  query GetEmail($id: ID!) {
    email(_id: $id) {
      _id
      html
      text
      textAsHtml
      subject
      date
      messageId
      fromText
      toText
      attachments {
        filename
        contentType
        contentDisposition
        contentId
        transferEncoding
        generatedFileName
        size
      }
    }
  }
`;

/**
 * __useGetEmailQuery__
 *
 * To run a query within a React component, call `useGetEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEmailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEmailQuery(
  baseOptions: Apollo.QueryHookOptions<GetEmailQuery, GetEmailQueryVariables> &
    ({ variables: GetEmailQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetEmailQuery, GetEmailQueryVariables>(
    GetEmailDocument,
    options,
  );
}
export function useGetEmailLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetEmailQuery,
    GetEmailQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetEmailQuery, GetEmailQueryVariables>(
    GetEmailDocument,
    options,
  );
}
export function useGetEmailSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetEmailQuery,
    GetEmailQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetEmailQuery, GetEmailQueryVariables>(
    GetEmailDocument,
    options,
  );
}
export type GetEmailQueryHookResult = ReturnType<typeof useGetEmailQuery>;
export type GetEmailLazyQueryHookResult = ReturnType<
  typeof useGetEmailLazyQuery
>;
export type GetEmailSuspenseQueryHookResult = ReturnType<
  typeof useGetEmailSuspenseQuery
>;
export type GetEmailQueryResult = Apollo.QueryResult<
  GetEmailQuery,
  GetEmailQueryVariables
>;
