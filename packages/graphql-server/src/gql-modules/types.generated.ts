import { ObjectId } from "mongodb";
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import { EmailMapper, EmailAttachmentMapper } from "./email/domain.mappers";
import { MailboxMapper } from "./mailbox/domain.mappers";
import { ApolloContextType } from "../apollo-server/context";
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string | number };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: Date | string; output: Date | string };
  LocalDate: { input: string; output: string };
  ObjectID: { input: ObjectId; output: ObjectId };
};

export type CreateMailboxResponse = InvalidApiKeyError | NewMailbox;

export type Email = {
  __typename?: "Email";
  _id: Scalars["ID"]["output"];
  attachments?: Maybe<Array<Maybe<EmailAttachment>>>;
  date: Scalars["Date"]["output"];
  fromText?: Maybe<Scalars["String"]["output"]>;
  html?: Maybe<Scalars["String"]["output"]>;
  messageId?: Maybe<Scalars["String"]["output"]>;
  subject?: Maybe<Scalars["String"]["output"]>;
  text?: Maybe<Scalars["String"]["output"]>;
  textAsHtml?: Maybe<Scalars["String"]["output"]>;
  toText?: Maybe<Scalars["String"]["output"]>;
};

export type EmailAttachment = {
  __typename?: "EmailAttachment";
  contentDisposition?: Maybe<Scalars["String"]["output"]>;
  contentId?: Maybe<Scalars["String"]["output"]>;
  contentType?: Maybe<Scalars["String"]["output"]>;
  filename?: Maybe<Scalars["String"]["output"]>;
  generatedFileName?: Maybe<Scalars["String"]["output"]>;
  /** The size of the attachment in bytes. */
  size?: Maybe<Scalars["Int"]["output"]>;
  transferEncoding?: Maybe<Scalars["String"]["output"]>;
};

export type Error = {
  message: Scalars["String"]["output"];
};

export type InvalidApiKeyError = Error & {
  __typename?: "InvalidApiKeyError";
  message: Scalars["String"]["output"];
};

export type Mailbox = {
  __typename?: "Mailbox";
  _id: Scalars["ObjectID"]["output"];
  messages: Array<Message>;
  name: Scalars["String"]["output"];
  username: Scalars["String"]["output"];
};

export type Message = {
  __typename?: "Message";
  date?: Maybe<Scalars["Date"]["output"]>;
  emailId: Scalars["ObjectID"]["output"];
  isRead?: Maybe<Scalars["Boolean"]["output"]>;
  sender?: Maybe<Scalars["String"]["output"]>;
  subject?: Maybe<Scalars["String"]["output"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  createMailbox?: Maybe<CreateMailboxResponse>;
  login?: Maybe<Scalars["Boolean"]["output"]>;
  readMail?: Maybe<Scalars["Boolean"]["output"]>;
};

export type MutationcreateMailboxArgs = {
  apiKey: Scalars["ID"]["input"];
};

export type MutationloginArgs = {
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type MutationreadMailArgs = {
  mailId: Scalars["ID"]["input"];
};

export type NewMailbox = {
  __typename?: "NewMailbox";
  _id: Scalars["ObjectID"]["output"];
  name: Scalars["String"]["output"];
  password: Scalars["String"]["output"];
  username: Scalars["String"]["output"];
};

export type Query = {
  __typename?: "Query";
  email?: Maybe<Email>;
  mailbox?: Maybe<Mailbox>;
};

export type QueryemailArgs = {
  _id: Scalars["ID"]["input"];
};

export type QuerymailboxArgs = {
  name: Scalars["String"]["input"];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  CreateMailboxResponse:
    | (InvalidApiKeyError & { __typename: "InvalidApiKeyError" })
    | (NewMailbox & { __typename: "NewMailbox" });
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> =
  {
    Error: InvalidApiKeyError & { __typename: "InvalidApiKeyError" };
  };

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  CreateMailboxResponse: ResolverTypeWrapper<
    ResolversUnionTypes<ResolversTypes>["CreateMailboxResponse"]
  >;
  Date: ResolverTypeWrapper<Scalars["Date"]["output"]>;
  Email: ResolverTypeWrapper<EmailMapper>;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  EmailAttachment: ResolverTypeWrapper<EmailAttachmentMapper>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  Error: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>["Error"]>;
  InvalidApiKeyError: ResolverTypeWrapper<InvalidApiKeyError>;
  LocalDate: ResolverTypeWrapper<Scalars["LocalDate"]["output"]>;
  Mailbox: ResolverTypeWrapper<MailboxMapper>;
  Message: ResolverTypeWrapper<Message>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  Mutation: ResolverTypeWrapper<{}>;
  NewMailbox: ResolverTypeWrapper<NewMailbox>;
  ObjectID: ResolverTypeWrapper<Scalars["ObjectID"]["output"]>;
  Query: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  CreateMailboxResponse: ResolversUnionTypes<ResolversParentTypes>["CreateMailboxResponse"];
  Date: Scalars["Date"]["output"];
  Email: EmailMapper;
  ID: Scalars["ID"]["output"];
  String: Scalars["String"]["output"];
  EmailAttachment: EmailAttachmentMapper;
  Int: Scalars["Int"]["output"];
  Error: ResolversInterfaceTypes<ResolversParentTypes>["Error"];
  InvalidApiKeyError: InvalidApiKeyError;
  LocalDate: Scalars["LocalDate"]["output"];
  Mailbox: MailboxMapper;
  Message: Message;
  Boolean: Scalars["Boolean"]["output"];
  Mutation: {};
  NewMailbox: NewMailbox;
  ObjectID: Scalars["ObjectID"]["output"];
  Query: {};
};

export type CreateMailboxResponseResolvers<
  ContextType = ApolloContextType,
  ParentType extends
    ResolversParentTypes["CreateMailboxResponse"] = ResolversParentTypes["CreateMailboxResponse"],
> = {
  __resolveType?: TypeResolveFn<
    "InvalidApiKeyError" | "NewMailbox",
    ParentType,
    ContextType
  >;
};

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export type EmailResolvers<
  ContextType = ApolloContextType,
  ParentType extends
    ResolversParentTypes["Email"] = ResolversParentTypes["Email"],
> = {
  _id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  attachments?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["EmailAttachment"]>>>,
    ParentType,
    ContextType
  >;
  date?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  fromText?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  html?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  messageId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  subject?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  textAsHtml?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  toText?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmailAttachmentResolvers<
  ContextType = ApolloContextType,
  ParentType extends
    ResolversParentTypes["EmailAttachment"] = ResolversParentTypes["EmailAttachment"],
> = {
  contentDisposition?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  contentId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  contentType?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  filename?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  generatedFileName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  size?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  transferEncoding?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ErrorResolvers<
  ContextType = ApolloContextType,
  ParentType extends
    ResolversParentTypes["Error"] = ResolversParentTypes["Error"],
> = {
  __resolveType?: TypeResolveFn<"InvalidApiKeyError", ParentType, ContextType>;
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type InvalidApiKeyErrorResolvers<
  ContextType = ApolloContextType,
  ParentType extends
    ResolversParentTypes["InvalidApiKeyError"] = ResolversParentTypes["InvalidApiKeyError"],
> = {
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface LocalDateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["LocalDate"], any> {
  name: "LocalDate";
}

export type MailboxResolvers<
  ContextType = ApolloContextType,
  ParentType extends
    ResolversParentTypes["Mailbox"] = ResolversParentTypes["Mailbox"],
> = {
  _id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  messages?: Resolver<
    Array<ResolversTypes["Message"]>,
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  username?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageResolvers<
  ContextType = ApolloContextType,
  ParentType extends
    ResolversParentTypes["Message"] = ResolversParentTypes["Message"],
> = {
  date?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  emailId?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  isRead?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  subject?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = ApolloContextType,
  ParentType extends
    ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"],
> = {
  createMailbox?: Resolver<
    Maybe<ResolversTypes["CreateMailboxResponse"]>,
    ParentType,
    ContextType,
    RequireFields<MutationcreateMailboxArgs, "apiKey">
  >;
  login?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationloginArgs, "password" | "username">
  >;
  readMail?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationreadMailArgs, "mailId">
  >;
};

export type NewMailboxResolvers<
  ContextType = ApolloContextType,
  ParentType extends
    ResolversParentTypes["NewMailbox"] = ResolversParentTypes["NewMailbox"],
> = {
  _id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  password?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  username?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface ObjectIDScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["ObjectID"], any> {
  name: "ObjectID";
}

export type QueryResolvers<
  ContextType = ApolloContextType,
  ParentType extends
    ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = {
  email?: Resolver<
    Maybe<ResolversTypes["Email"]>,
    ParentType,
    ContextType,
    RequireFields<QueryemailArgs, "_id">
  >;
  mailbox?: Resolver<
    Maybe<ResolversTypes["Mailbox"]>,
    ParentType,
    ContextType,
    RequireFields<QuerymailboxArgs, "name">
  >;
};

export type Resolvers<ContextType = ApolloContextType> = {
  CreateMailboxResponse?: CreateMailboxResponseResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Email?: EmailResolvers<ContextType>;
  EmailAttachment?: EmailAttachmentResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  InvalidApiKeyError?: InvalidApiKeyErrorResolvers<ContextType>;
  LocalDate?: GraphQLScalarType;
  Mailbox?: MailboxResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NewMailbox?: NewMailboxResolvers<ContextType>;
  ObjectID?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
};
