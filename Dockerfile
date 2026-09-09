FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies for build)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client and build NestJS
RUN npm run build

# --- Production Image ---
FROM node:20-alpine AS runner

WORKDIR /app

# Install openssl (required by Prisma)
RUN apk add --no-cache openssl

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "start:prod"]
