import { EmailsLoader } from "./email/dataloader"
import { MailboxLoader } from "./mailbox/dataloader"

/** Generates the data sources for the apollo server. DataLoader instances are
 * per-request, so they are not shared between requests. This function ensures
 * that the data sources are created for each request.
 */
export const generateDataSources = () => {
  return {
    MailboxLoader: new MailboxLoader(),
    EmailsLoader: new EmailsLoader(),
  }
}

export type DataSources = ReturnType<typeof generateDataSources>
