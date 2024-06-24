import type { MutationResolvers } from "../../../types.generated";
import * as bcrypt from "bcrypt";

export const login: NonNullable<MutationResolvers["login"]> = async (
  _parent,
  { username, password },
  { dataSources, setAuthToken },
) => {
  const mailbox = await dataSources.MailboxLoader.getMailboxByName(username);
  if (!mailbox) {
    return false;
  }

  const isPasswordValid = await bcrypt.compare(password, mailbox.password);
  if (!isPasswordValid) {
    return false;
  }

  setAuthToken(mailbox.username);

  return true;
};
