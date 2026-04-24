FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Stage 1: Build
FROM base AS build
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json ./
COPY packages/database/package.json ./packages/database/
COPY packages/client/package.json ./packages/client/

RUN pnpm install --frozen-lockfile

COPY packages/database ./packages/database
COPY packages/client ./packages/client

# Build the database package first if needed (if it has a build step)
RUN pnpm --filter @ghostmail/database build
# Build the client
RUN pnpm --filter @ghostmail/client build

# Stage 2: Runtime
FROM base AS runtime
ENV NODE_ENV=production

# Copy built files and dependencies
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/pnpm-workspace.yaml ./
COPY --from=build /app/packages/client/package.json ./packages/client/
COPY --from=build /app/packages/client/build ./packages/client/build
COPY --from=build /app/packages/database ./packages/database

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

WORKDIR /app/packages/client
CMD ["pnpm", "start"]
