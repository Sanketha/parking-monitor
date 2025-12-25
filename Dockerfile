# Use official Node.js LTS
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port (optional if Node.js doesn't serve HTTP)
EXPOSE 3000

# Run Node.js
CMD ["node", "server.js"]
