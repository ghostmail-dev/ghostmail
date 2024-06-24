import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";
import type { MutationResolvers } from "../../../types.generated";
import { ObjectId } from "mongodb";
import { Mailboxes } from "@ghostmail-packages/database";

export const createMailbox: NonNullable<
  MutationResolvers["createMailbox"]
> = async (_parent, { apiKey }, { dataSources, setAuthToken }) => {
  if (apiKey !== process.env.API_KEY) {
    return {
      __typename: "InvalidApiKeyError",
      message: "Invalid API Key",
    };
  }

  const password = faker.internet.password();

  // generate a password hash
  const passwordHash = await bcrypt.hash(password, 10);
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = `${normalizeName(firstName)}.${normalizeName(lastName)}@${
    process.env.MAIL_DOMAIN
  }`;

  const result = await Mailboxes.insertOne({
    _id: new ObjectId(),
    firstName,
    lastName,
    username,
    password: passwordHash,
    emails: [],
  });

  setAuthToken(username);
  return {
    __typename: "NewMailbox",
    _id: result.insertedId,
    name: `${firstName} ${lastName}`,
    username,
    password,
  };
};

function normalizeName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\W_]+/, "")
    .toLowerCase();
}
