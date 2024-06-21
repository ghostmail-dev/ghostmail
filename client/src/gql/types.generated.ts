export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
  LocalDate: { input: string; output: string };
  ObjectID: { input: any; output: any };
};

export type CreateMailboxResponse = InvalidApiKeyError | NewMailbox;

export type Email = {
  __typename?: "Email";
  _id: Scalars["ID"]["output"];
  date: Scalars["Date"]["output"];
  fromText?: Maybe<Scalars["String"]["output"]>;
  html?: Maybe<Scalars["String"]["output"]>;
  messageId?: Maybe<Scalars["String"]["output"]>;
  subject?: Maybe<Scalars["String"]["output"]>;
  text?: Maybe<Scalars["String"]["output"]>;
  textAsHtml?: Maybe<Scalars["String"]["output"]>;
  toText?: Maybe<Scalars["String"]["output"]>;
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
};

export type MutationCreateMailboxArgs = {
  apiKey: Scalars["ID"]["input"];
};

export type MutationLoginArgs = {
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
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

export type QueryEmailArgs = {
  _id: Scalars["ID"]["input"];
};

export type QueryMailboxArgs = {
  name: Scalars["String"]["input"];
};
