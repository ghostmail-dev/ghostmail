import type { MailboxResolvers } from "../../../types.generated"
export const Mailbox: Pick<MailboxResolvers, "messages"> = {
  messages: async ({ emails }) => {
    return emails.map((email) => ({
      ...email,
      date: email.date.toISOString().slice(0, 10),
    }))
  },
}
