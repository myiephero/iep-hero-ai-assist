# Use the official Node.js runtime as a parent image
FROM node:18-alpine

# Install curl for health checks and Cloud Run compatibility
RUN apk add --no-cache curl

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the current directory contents into the container at /app
COPY . .

# Build the application
RUN npm run build

# Ensure single external port configuration for Cloud Run
ENV PORT=5000
ENV NODE_ENV=production

# Expose only the single port expected by Cloud Run
EXPOSE 5000

# Add health check to verify startup
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:5000/startup-health || exit 1

# Define the command to run the application
CMD ["node", "server-js.js"]