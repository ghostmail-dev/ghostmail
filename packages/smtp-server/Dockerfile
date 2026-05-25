FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/smtp-server/package.json ./packages/smtp-server/
COPY packages/database/package.json ./packages/database/

# Copy built files from host
COPY packages/smtp-server/dist ./packages/smtp-server/dist
COPY packages/database/dist ./packages/database/dist

# Install only production dependencies for smtp-server
RUN pnpm install --prod --frozen-lockfile --filter @ghostmail/smtp-server

# SMTP ports
EXPOSE 25 587

WORKDIR /app/packages/smtp-server
CMD ["node", "dist/index.js"]
