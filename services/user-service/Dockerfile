FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Development stage
FROM base AS dev
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 userservice

# Copy built application
COPY --from=builder --chown=userservice:nodejs /app/dist ./dist
COPY --from=builder --chown=userservice:nodejs /app/package.json ./package.json
COPY --from=deps --chown=userservice:nodejs /app/node_modules ./node_modules

# Create logs directory
RUN mkdir logs && chown userservice:nodejs logs

USER userservice

EXPOSE 3001

ENV PORT=3001

CMD ["node", "dist/index.js"]
