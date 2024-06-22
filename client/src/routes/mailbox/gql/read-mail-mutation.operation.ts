import * as Types from "~/gql/types.generated";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type ReadMailMutationVariables = Types.Exact<{
  mailId: Types.Scalars["ID"]["input"];
}>;

export type ReadMailMutation = {
  __typename: "Mutation";
  readMail: boolean | null;
};

export const ReadMailDocument = gql`
  mutation ReadMail($mailId: ID!) {
    readMail(mailId: $mailId)
  }
`;
export type ReadMailMutationFn = Apollo.MutationFunction<
  ReadMailMutation,
  ReadMailMutationVariables
>;

/**
 * __useReadMailMutation__
 *
 * To run a mutation, you first call `useReadMailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReadMailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [readMailMutation, { data, loading, error }] = useReadMailMutation({
 *   variables: {
 *      mailId: // value for 'mailId'
 *   },
 * });
 */
export function useReadMailMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ReadMailMutation,
    ReadMailMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ReadMailMutation, ReadMailMutationVariables>(
    ReadMailDocument,
    options,
  );
}
export type ReadMailMutationHookResult = ReturnType<typeof useReadMailMutation>;
export type ReadMailMutationResult = Apollo.MutationResult<ReadMailMutation>;
export type ReadMailMutationOptions = Apollo.BaseMutationOptions<
  ReadMailMutation,
  ReadMailMutationVariables
>;
