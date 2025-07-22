# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build the app and generate Prisma Client
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma Clients with correct binary targets
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npx prisma generate --schema=prisma-logger/schema.prisma
RUN npm ci
ENV NEXT_PNPM=0
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# Disable telemetry (optional)
# ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Copy node_modules and package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Copy Next.js build output
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# Copy public folder (if needed)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Copy Prisma Client and Query Engine files
COPY --from=builder --chown=nextjs:nodejs /app/generated ./generated
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma-logger ./prisma-logger
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/engines ./node_modules/@prisma/engines
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma/client ./node_modules/.prisma/client

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "start"]