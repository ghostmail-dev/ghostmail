import type { QueryResolvers } from "../../../types.generated"
export const email: NonNullable<QueryResolvers["email"]> = async (
  _parent,
  { _id },
  { dataSources }
) => {
  /* Implement Query.email resolver logic here */
  const email = await dataSources.EmailsLoader.getEmailById(_id)
  return email
}
