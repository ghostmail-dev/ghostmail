import {
  ApolloClient,
  createQueryPreloader,
  InMemoryCache,
} from "@apollo/client"
import { link } from "./apollo-links"

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  credentials: "include",
})

export const preloadQuery = createQueryPreloader(apolloClient)
