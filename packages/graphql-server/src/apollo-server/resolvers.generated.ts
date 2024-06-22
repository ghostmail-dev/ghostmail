/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
import type { Resolvers } from "../gql-modules/types.generated"
import { email as Query_email } from "../gql-modules/email/resolvers/Query/email"
import { mailbox as Query_mailbox } from "../gql-modules/mailbox/resolvers/Query/mailbox"
import { createMailbox as Mutation_createMailbox } from "../gql-modules/mailbox/resolvers/Mutation/createMailbox"
import { login as Mutation_login } from "../gql-modules/mailbox/resolvers/Mutation/login"
import { readMail as Mutation_readMail } from "../gql-modules/mailbox/resolvers/Mutation/readMail"
import { Email } from "../gql-modules/email/resolvers/Email"
import { InvalidApiKeyError } from "../gql-modules/mailbox/resolvers/InvalidApiKeyError"
import { Mailbox as mailbox_Mailbox } from "../gql-modules/mailbox/resolvers/Mailbox"
import { Mailbox as messages_Mailbox } from "../gql-modules/mailbox/messages/resolvers/Mailbox"
import { Message } from "../gql-modules/mailbox/messages/resolvers/Message"
import { NewMailbox } from "../gql-modules/mailbox/resolvers/NewMailbox"
import {
  DateResolver,
  LocalDateResolver,
  ObjectIDResolver,
} from "graphql-scalars"
export const resolvers: Resolvers = {
  Query: { email: Query_email, mailbox: Query_mailbox },
  Mutation: {
    createMailbox: Mutation_createMailbox,
    login: Mutation_login,
    readMail: Mutation_readMail,
  },

  Email: Email,
  InvalidApiKeyError: InvalidApiKeyError,
  Mailbox: { ...mailbox_Mailbox, ...messages_Mailbox },
  Message: Message,
  NewMailbox: NewMailbox,
  Date: DateResolver,
  LocalDate: LocalDateResolver,
  ObjectID: ObjectIDResolver,
}
