# Building the TypeScript application ( Build stage )

# Use Node.js 24 on Debian as the build environment.
FROM node:24-bookworm-slim AS builder

# Set the working directory inside the container.
WORKDIR /app

# Install the exact pnpm version used by this project.
RUN npm install -g pnpm@10.28.1

# Disable Husky Git hook initialization during installation.
ENV HUSKY=0

# Copy dependency manifests before source code for Docker caching.
COPY package.json pnpm-lock.yaml ./

# The frozen lockfile prevents unexpected dependency updates ( that ensure deps are installed exactly according to our pnpm-lock.yaml ).
RUN pnpm install --frozen-lockfile

COPY src ./src
COPY tsconfig.json ./

# Compile TypeScript using the existing "build": "tsc" script.
RUN pnpm run build





# Install production dependencies ( deps stage )

FROM node:24-bookworm-slim AS deps

WORKDIR /app

RUN npm install -g pnpm@10.28.1

# Disable Husky during installation.
ENV HUSKY=0

# Copy dependency manifests.
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies.
RUN pnpm install --prod --frozen-lockfile





# Run the Express API gateway

FROM node:24-bookworm-slim AS runner

# Configure the application for production.
ENV NODE_ENV=production

# Set the application working directory.
WORKDIR /app

# Copy production dependencies from the deps stage.
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

# Copy compiled JavaScript from the builder stage.
COPY --from=builder --chown=node:node /app/dist ./dist

# Copy package metadata, including "type": "module".
COPY --chown=node:node package.json ./

# Allow the non-root node user to write application logs
RUN mkdir -p /app/logs && chown node:node /app/logs

# Run the application as the non-root node user.
USER node

# Document the application port.
EXPOSE 3000

# Start the compiled Express server.
CMD ["node", "dist/server.js"]
