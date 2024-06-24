import type { MailboxResolvers } from "../../types.generated";
export const Mailbox: Pick<MailboxResolvers, "_id" | "name" | "username"> = {
  /* Implement Mailbox resolver logic here */
  name: async ({ firstName, lastName }) => {
    return `${firstName} ${lastName}`;
  },
};
