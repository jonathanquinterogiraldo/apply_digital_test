FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN apk add --no-cache bash python3 make g++ \
    && npm ci

# Copy source code
COPY . .

# Expose Nest port
EXPOSE 3000

# Start app
CMD ["npm", "run", "start:dev"]