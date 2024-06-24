import type { QueryResolvers } from "../../../types.generated";
export const mailbox: NonNullable<QueryResolvers["mailbox"]> = async (
  _parent,
  { name },
  { dataSources },
) => {
  const mailbox = dataSources.MailboxLoader.getMailboxByName(name);
  return mailbox;
};
