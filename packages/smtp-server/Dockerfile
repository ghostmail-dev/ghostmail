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

COPY --from=build /app/packages/smtp-server/dist ./dist
COPY --from=build /app/packages/smtp-server/package.json ./

RUN pnpm install --prod --frozen-lockfile

# SMTP ports
EXPOSE 25 587

WORKDIR /app
CMD ["node", "dist/index.js"]
