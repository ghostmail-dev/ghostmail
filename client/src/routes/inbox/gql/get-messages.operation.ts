import * as Types from "~/gql/types.generated";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type GetMailboxQueryVariables = Types.Exact<{
  name: Types.Scalars["String"]["input"];
}>;

export type GetMailboxQuery = {
  __typename: "Query";
  mailbox: {
    __typename: "Mailbox";
    _id: any;
    name: string;
    messages: Array<{
      __typename: "Message";
      emailId: any;
      sender: string | null;
      subject: string | null;
      date: any | null;
      isRead: boolean | null;
    }>;
  } | null;
};

export const GetMailboxDocument = gql`
  query GetMailbox($name: String!) {
    mailbox(name: $name) {
      _id
      name
      messages {
        emailId
        sender
        subject
        date
        isRead
      }
    }
  }
`;

/**
 * __useGetMailboxQuery__
 *
 * To run a query within a React component, call `useGetMailboxQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMailboxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMailboxQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useGetMailboxQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetMailboxQuery,
    GetMailboxQueryVariables
  > &
    (
      | { variables: GetMailboxQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetMailboxQuery, GetMailboxQueryVariables>(
    GetMailboxDocument,
    options,
  );
}
export function useGetMailboxLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMailboxQuery,
    GetMailboxQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetMailboxQuery, GetMailboxQueryVariables>(
    GetMailboxDocument,
    options,
  );
}
export function useGetMailboxSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetMailboxQuery,
    GetMailboxQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetMailboxQuery, GetMailboxQueryVariables>(
    GetMailboxDocument,
    options,
  );
}
export type GetMailboxQueryHookResult = ReturnType<typeof useGetMailboxQuery>;
export type GetMailboxLazyQueryHookResult = ReturnType<
  typeof useGetMailboxLazyQuery
>;
export type GetMailboxSuspenseQueryHookResult = ReturnType<
  typeof useGetMailboxSuspenseQuery
>;
export type GetMailboxQueryResult = Apollo.QueryResult<
  GetMailboxQuery,
  GetMailboxQueryVariables
>;
