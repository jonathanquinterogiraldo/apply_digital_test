FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Nest port
EXPOSE 3000

# Start app
CMD ["npm", "run", "start:dev"]