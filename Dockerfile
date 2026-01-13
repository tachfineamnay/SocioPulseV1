# =============================================================================
# SOCIOPULSE/MEDICOPULSE - Multi-Brand Next.js Frontend Dockerfile
# Build arg NEXT_PUBLIC_APP_MODE controls brand at build time
# =============================================================================

FROM node:20-slim AS base
WORKDIR /app

# System deps (OpenSSL for Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# =============================================================================
# DEPENDENCIES STAGE
# =============================================================================
FROM base AS deps
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# =============================================================================
# BUILDER STAGE
# IMPORTANT: NEXT_PUBLIC_ vars are baked-in at build time
# =============================================================================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN rm -rf apps/api

# Generate Prisma client
RUN npx prisma generate

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build arguments - these become ENV vars for the build
ARG NEXT_PUBLIC_APP_MODE=SOCIAL
ARG NEXT_PUBLIC_API_URL

# Set environment variables from build args
ENV NEXT_PUBLIC_APP_MODE=$NEXT_PUBLIC_APP_MODE
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Log the brand being built
RUN echo "🏗️ Building for brand: $NEXT_PUBLIC_APP_MODE"

# Build the Next.js application
RUN npm run build

# =============================================================================
# RUNNER STAGE (Production)
# =============================================================================
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install curl for Coolify healthcheck
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application (standalone mode)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port (can be overridden)
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the server
CMD ["node", "server.js"]
