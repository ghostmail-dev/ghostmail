FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

ENV NODE_ENV=production

# Copy built files and dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/client/package.json ./packages/client/
COPY packages/database/package.json ./packages/database/

# Copy built files from host
COPY packages/client/build ./packages/client/build
COPY packages/database/dist ./packages/database/dist

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

WORKDIR /app/packages/client
CMD ["pnpm", "start"]
