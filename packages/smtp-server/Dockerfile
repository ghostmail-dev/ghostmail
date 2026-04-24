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
COPY packages/smtp-server/package.json ./packages/smtp-server/

RUN pnpm install --frozen-lockfile

COPY packages/database ./packages/database
COPY packages/smtp-server ./packages/smtp-server

# Build packages
RUN pnpm --filter @ghostmail/database build
RUN pnpm --filter @ghostmail/smtp-server build

# Stage 2: Runtime
FROM base AS runtime
ENV NODE_ENV=production

COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/pnpm-workspace.yaml ./
COPY --from=build /app/packages/smtp-server/package.json ./packages/smtp-server/
COPY --from=build /app/packages/smtp-server/dist ./packages/smtp-server/dist
COPY --from=build /app/packages/database ./packages/database

RUN pnpm install --prod --frozen-lockfile

# SMTP ports
EXPOSE 25 465 587

WORKDIR /app/packages/smtp-server
CMD ["node", "dist/index.js"]
