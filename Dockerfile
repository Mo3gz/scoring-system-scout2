# Use official Node.js image
FROM node:20.18.0-slim AS build

WORKDIR /app

# Install server dependencies
COPY package*.json ./
RUN npm ci --include=dev

# Install client dependencies
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci

# Copy the rest of the code
WORKDIR /app
COPY . .

# Build the client
WORKDIR /app/client
RUN npm run build

# Start the server
WORKDIR /app
CMD ["node", "server/index.js"] 