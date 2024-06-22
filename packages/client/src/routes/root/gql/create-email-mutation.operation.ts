import * as Types from "~/gql/types.generated";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type CreateEmailMutationVariables = Types.Exact<{
  apiKey: Types.Scalars["ID"]["input"];
}>;

export type CreateEmailMutation = {
  __typename: "Mutation";
  createMailbox:
    | { __typename: "InvalidApiKeyError"; message: string }
    | {
        __typename: "NewMailbox";
        _id: any;
        name: string;
        username: string;
        password: string;
      }
    | null;
};

export const CreateEmailDocument = gql`
  mutation CreateEmail($apiKey: ID!) {
    createMailbox(apiKey: $apiKey) {
      ... on NewMailbox {
        _id
        name
        username
        password
      }
      ... on InvalidApiKeyError {
        message
      }
    }
  }
`;
export type CreateEmailMutationFn = Apollo.MutationFunction<
  CreateEmailMutation,
  CreateEmailMutationVariables
>;

/**
 * __useCreateEmailMutation__
 *
 * To run a mutation, you first call `useCreateEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEmailMutation, { data, loading, error }] = useCreateEmailMutation({
 *   variables: {
 *      apiKey: // value for 'apiKey'
 *   },
 * });
 */
export function useCreateEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateEmailMutation,
    CreateEmailMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateEmailMutation, CreateEmailMutationVariables>(
    CreateEmailDocument,
    options,
  );
}
export type CreateEmailMutationHookResult = ReturnType<
  typeof useCreateEmailMutation
>;
export type CreateEmailMutationResult =
  Apollo.MutationResult<CreateEmailMutation>;
export type CreateEmailMutationOptions = Apollo.BaseMutationOptions<
  CreateEmailMutation,
  CreateEmailMutationVariables
>;
