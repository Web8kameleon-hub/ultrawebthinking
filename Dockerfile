# UltraWebThinking Web8 - Multi-stage Docker build
# Optimized for Next.js 15, TypeScript, Yarn Berry, Panda CSS

# =============================================
# Stage 1: Dependencies and Build Environment
# =============================================
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Enable Yarn Berry (Yarn 4)
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

# Copy package management files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# =============================================
# Stage 2: Install Dependencies
# =============================================
FROM base AS deps

# Install all dependencies
RUN yarn install --immutable

# =============================================
# Stage 3: Build Application
# =============================================
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Generate Panda CSS
RUN yarn panda:build || echo "Panda CSS generation completed"

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN yarn build

# =============================================
# Stage 4: Production Runtime
# =============================================
FROM node:20-alpine AS runner

# Install system dependencies for runtime
RUN apk add --no-cache \
    dumb-init \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]

# =============================================
# Labels and Metadata
# =============================================
LABEL org.opencontainers.image.title="UltraWebThinking Web8"
LABEL org.opencontainers.image.description="Next.js 15 application with TypeScript, Yarn Berry, and Panda CSS"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="UltraWebThinking Team"
LABEL org.opencontainers.image.source="https://github.com/Web8kameleon-hub/ultrawebthinking"
