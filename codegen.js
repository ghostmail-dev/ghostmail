"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gcg_typescript_resolver_files_1 = require("@eddeee888/gcg-typescript-resolver-files");
const graphql_scalars_1 = require("graphql-scalars");
const scalars = {
    LocalDate: graphql_scalars_1.LocalDateResolver.extensions.codegenScalarType,
};
const config = {
    schema: [
        "./server/src/gql-modules/**/schema.graphql",
        "./server/src/gql-modules/**/domain.graphql",
        "./server/src/gql-modules/**/queries.graphql",
        "./server/src/gql-modules/**/mutations.graphql",
    ],
    hooks: {
        afterAllFileWrite: ["npx prettier --write"],
    },
    ignoreNoDocuments: true, // for better experience with the watcher
    generates: {
        "server/src/gql-modules": (0, gcg_typescript_resolver_files_1.defineConfig)({
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
        "./client/src/gql/types.generated.ts": {
            plugins: ["typescript"],
            config: {
                scalars,
                namingConvention: {
                    enumValues: "keep",
                },
            },
        },
        "client/src/routes": {
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
};
exports.default = config;
