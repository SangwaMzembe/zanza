# syntax=docker/dockerfile:1.4
# Build stage for Next.js app
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY container_src/package*.json ./

# Install dependencies
RUN npm ci --loglevel verbose

# Copy application source
COPY container_src/ .

# Build the Next.js application
RUN npm run build

# Production stage - minimal image for Cloudflare Containers
FROM node:22-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV NODE_PORT=8080

# Copy built app and dependencies from builder
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY container_src/server.js ./
COPY container_src/public ./public

EXPOSE 8080

# Health check for Cloudflare Container orchestration
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["npm", "start"]