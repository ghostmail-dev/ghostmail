import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files"
import type { CodegenConfig } from "@graphql-codegen/cli"
import { LocalDateResolver } from "graphql-scalars"

const scalars = {
  LocalDate: LocalDateResolver.extensions.codegenScalarType,
}

const config: CodegenConfig = {
  schema: [
    "./packages/graphql-server/src/gql-modules/**/schema.graphql",
    "./packages/graphql-server/src/gql-modules/**/domain.graphql",
    "./packages/graphql-server/src/gql-modules/**/queries.graphql",
    "./packages/graphql-server/src/gql-modules/**/mutations.graphql",
  ],
  hooks: {
    afterAllFileWrite: ["npx prettier --write"],
  },
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "packages/graphql-server/src/gql-modules": defineConfig({
      resolverMainFile: "../apollo-server/resolvers.generated.ts",
      typeDefsFilePath: "../apollo-server/type-defs.generated.ts",
      typesPluginsConfig: {
        contextType: "../apollo-server/context#ApolloContextType",
      },
      scalarsModule: "graphql-scalars",
      scalarsOverrides: {
        ObjectID: {
          type: "mongodb#ObjectId",
        },
      },
    }),

    "./packages/client/src/gql/types.generated.ts": {
      plugins: ["typescript"],
      config: {
        scalars,
        namingConvention: {
          enumValues: "keep",
        },
      },
    },
    "./packages/client/src/routes": {
      documents: ["**/*operation.graphql"],
      overwrite: true,
      plugins: ["typescript-operations", "typescript-react-apollo"],
      preset: "near-operation-file",
      presetConfig: {
        extension: ".ts",
        // the preset uses the ~ for a workspace package, and vite has the ~ aliased to src,
        // so using a ~~ to make it work
        baseTypesPath: "~~/gql/types.generated",
      },
      config: {
        withHooks: true,
        nonOptionalTypename: true,
        avoidOptionals: true,
        scalars,
      },
    },
  },
}
export default config
