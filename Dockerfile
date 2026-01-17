# =============================================================================
# SOCIOPULSE / MEDICOPULSE - Multi-Brand Next.js Frontend
# Production-Ready Dockerfile with Multi-Stage Build
# =============================================================================
#
# Usage:
#   docker build --build-arg NEXT_PUBLIC_APP_MODE=SOCIAL -t sociopulse-web .
#   docker build --build-arg NEXT_PUBLIC_APP_MODE=MEDICAL -t medicopulse-web .
#
# =============================================================================

# =============================================================================
# STAGE 1: BASE
# Lightweight Alpine image with essential dependencies
# =============================================================================
FROM node:20-alpine AS base

WORKDIR /app

# Install libc6-compat for Alpine compatibility + OpenSSL for Prisma
RUN apk add --no-cache libc6-compat openssl

# =============================================================================
# STAGE 2: DEPS
# Install all dependencies (cached layer)
# =============================================================================
FROM base AS deps

WORKDIR /app

# Copy lockfiles first for better cache utilization
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Copy workspace packages for monorepo resolution
COPY packages ./packages

# Install dependencies based on available lockfile
RUN \
  if [ -f yarn.lock ]; then \
    corepack enable && yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm i --frozen-lockfile; \
  else \
    echo "❌ Lockfile not found." && exit 1; \
  fi

# =============================================================================
# STAGE 3: BUILDER
# Build the Next.js application with baked-in environment variables
# =============================================================================
FROM base AS builder

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages

# Copy source code (excluding API via .dockerignore or rm)
COPY . .
RUN rm -rf apps/api

# Generate Prisma client for Next.js
RUN npx prisma generate

# -----------------------------------------------------------------------------
# BUILD ARGUMENTS - CRITICAL: These are baked into the Next.js bundle
# -----------------------------------------------------------------------------
ARG NEXT_PUBLIC_APP_MODE=SOCIAL
ARG NEXT_PUBLIC_API_URL

# -----------------------------------------------------------------------------
# CRITICAL: Set ENV vars BEFORE npm run build
# Next.js inlines NEXT_PUBLIC_* variables at build time
# -----------------------------------------------------------------------------
ENV NEXT_PUBLIC_APP_MODE=$NEXT_PUBLIC_APP_MODE
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Log build configuration for debugging
RUN echo "==========================================" && \
    echo "🏗️  Building Next.js Application" && \
    echo "==========================================" && \
    echo "📦 Brand Mode:  $NEXT_PUBLIC_APP_MODE" && \
    echo "🔗 API URL:     $NEXT_PUBLIC_API_URL" && \
    echo "==========================================" 

# Build the application (standalone output mode required in next.config.js)
RUN npm run build

# =============================================================================
# STAGE 4: RUNNER
# Minimal production image with only necessary files
# =============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install curl for healthcheck probes (Coolify, K8s, etc.)
RUN apk add --no-cache curl

# Create non-root user for security (best practice)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only the standalone build output (minimal footprint)
# This requires `output: "standalone"` in next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Runtime configuration
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck for container orchestrators
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the Next.js server
CMD ["node", "server.js"]
